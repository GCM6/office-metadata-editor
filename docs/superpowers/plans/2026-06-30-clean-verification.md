# Clean-Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** After every web clean path finishes, run an independent byte-level verification that the metadata is actually gone; if residue remains, automatically deep-clean up to a capped number of retries, then hand off to a manual retry.

**Architecture:** A new writer-independent module `lib/documents/verify/` re-opens the *output* bytes (jszip for OOXML, pdf-lib for PDF), scans the raw `docProps/*.xml` text / PDF Info dict for residue, and reports it. An orchestrator `cleanAndVerify` wraps any "produce cleaned bytes" function with verify → deepClean → re-verify, capped at `MAX_AUTO_RECLEAN`. Both the WASM audit flow and the editor/batch clear flow call it.

**Tech Stack:** Next.js + TypeScript, `jszip` (dynamic import), `pdf-lib` (dynamic import), `tsx` (new devDependency, self-tests only), next-intl.

## Global Constraints

- Package manager **pnpm**; Node **>= 24.14.0** required by the project (this dev box runs 20.19 — self-tests run via `pnpm exec tsx`, not `node --test`).
- Heavy libs (`jszip`, `pdf-lib`) MUST stay behind `await import(...)` — never add a top-level import of them (keeps first-load JS small; see memory `keep-heavy-libs-dynamically-imported`).
- New self-test/CLI scripts under `scripts/` MUST use **relative imports** (`../lib/...`), not the `@/` alias (tsx runs them outside Next's alias resolver).
- Code that may run in Node (verify byte-scan, deepClean, CLI) MUST NOT use browser globals (`DOMParser`, `XMLSerializer`, `window`) unguarded. The OOXML byte-scan uses regex on raw strings, not `DOMParser`.
- Residue bar = **docProps only** (`core.xml` / `app.xml` / `custom.xml`) for OOXML, **Info dict** for PDF. RSID/people/comments/thumbnail/PDF-XMP rules are scaffolded `enabled: false`, not implemented.
- `MAX_AUTO_RECLEAN = 1`.
- Copy/i18n: say "no residual metadata detected", never "100% / guaranteed". English (`en.json`) is the indexing-primary language and must be filled completely.
- Run `pnpm typecheck` and `pnpm lint` green before every commit.

## File Structure

- `lib/documents/verify/residue-rules.ts` (new) — pure residue scanners + types. No I/O, no globals. Fully unit-testable.
- `lib/documents/verify/verify-clean.ts` (new) — `verifyCleaned(bytes, fileType)`: unzip / load output, gather part text / Info dict, delegate to residue-rules; optional browser-only same-engine confirmation.
- `lib/documents/verify/deep-clean.ts` (new) — `deepClean(bytes, fileType, residue)`: more aggressive strip (blank residual tags, drop custom.xml, hard-delete PDF Info).
- `lib/documents/verify/clean-and-verify.ts` (new) — `cleanAndVerify(produce, fileType)` orchestrator + `MAX_AUTO_RECLEAN`.
- `lib/documents/web/{docx,xlsx,pdf}-processor.ts` (modify) — `clear*` returns cleaned bytes + writes them back to file-store; download split into shared helper.
- `lib/documents/web/document-processor.ts` (modify) — `WebDocumentResourceApi.clear` return type `Promise<Uint8Array>`.
- `lib/resources/documents.ts` (modify) — web `destroyMetadataMany` runs `cleanAndVerify` and surfaces `verified/residue/exhausted` on `BatchSaveResultItem`.
- `contexts/metadata-context.tsx` (modify) — surface verify result through clear/batch status.
- `components/om/om-audit-report.tsx` (modify) — verify worker output, 5th scan step, three terminal states, manual retry.
- `messages/en.json`, `messages/zh-CN.json` (modify) — new `audit.verify.*` keys + honesty copy.
- `scripts/verify-clean.ts` (new) — CLI + self-test harness.
- `package.json` (modify) — add `tsx` devDep + `verify:clean` script.

---

### Task 1: Pure residue scanners (`residue-rules.ts`)

**Files:**
- Create: `lib/documents/verify/residue-rules.ts`
- Create: `scripts/verify-clean.selftest.ts` (runnable self-test)
- Modify: `package.json` (add `tsx` devDep)

**Interfaces:**
- Produces:
  - `interface ResidueField { part: "core.xml"|"app.xml"|"custom.xml"|"pdf-info"|"pdf-xmp"; key: string; value: string; risk: "high"|"medium"|"low" }`
  - `type PartTextMap = Partial<Record<"core.xml"|"app.xml"|"custom.xml", string>>`
  - `function scanOoxmlResidue(parts: PartTextMap): ResidueField[]`
  - `function scanPdfResidue(info: Record<string, string | undefined>): ResidueField[]`

- [ ] **Step 1: Add tsx devDependency**

Run: `pnpm add -D tsx`
Expected: `tsx` appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Write the failing self-test**

Create `scripts/verify-clean.selftest.ts`:

```ts
import assert from "node:assert/strict"
import { scanOoxmlResidue, scanPdfResidue } from "../lib/documents/verify/residue-rules"

// core.xml residue is detected
const core = `<?xml version="1.0"?><cp:coreProperties xmlns:cp="x" xmlns:dc="y">
<dc:creator>Alice</dc:creator><cp:lastModifiedBy>Bob</cp:lastModifiedBy></cp:coreProperties>`
const r1 = scanOoxmlResidue({ "core.xml": core })
assert.equal(r1.length, 2)
assert.ok(r1.find(f => f.key === "creator" && f.value === "Alice"))

// blanked core.xml is clean
const cleanCore = `<dc:creator></dc:creator><cp:lastModifiedBy/>`
assert.deepEqual(scanOoxmlResidue({ "core.xml": cleanCore }), [])

// app.xml Template path is high risk
const app = `<Properties><Template>C:\\Users\\alice\\Normal.dotm</Template><Company>ACME</Company></Properties>`
const r2 = scanOoxmlResidue({ "app.xml": app })
assert.ok(r2.find(f => f.key === "template" && f.risk === "high"))
assert.ok(r2.find(f => f.key === "company"))

// custom.xml presence is residue
const custom = `<Properties><property name="Classification"><vt:lpwstr>Secret</vt:lpwstr></property></Properties>`
assert.equal(scanOoxmlResidue({ "custom.xml": custom }).length, 1)
assert.deepEqual(scanOoxmlResidue({ "custom.xml": "<Properties></Properties>" }), [])

// pdf info residue
const r3 = scanPdfResidue({ Author: "Carol", Title: "", Producer: undefined })
assert.equal(r3.length, 1)
assert.equal(r3[0].part, "pdf-info")

console.log("residue-rules self-test passed")
```

- [ ] **Step 3: Run the self-test to verify it fails**

Run: `pnpm exec tsx scripts/verify-clean.selftest.ts`
Expected: FAIL — `Cannot find module '../lib/documents/verify/residue-rules'`.

- [ ] **Step 4: Implement `residue-rules.ts`**

Create `lib/documents/verify/residue-rules.ts`:

```ts
export interface ResidueField {
  part: "core.xml" | "app.xml" | "custom.xml" | "pdf-info" | "pdf-xmp"
  key: string
  value: string
  risk: "high" | "medium" | "low"
}

export type PartTextMap = Partial<Record<"core.xml" | "app.xml" | "custom.xml", string>>

// Default residue bar = docProps. Extension rules (RSID/people/comments/
// thumbnail/pdf-xmp) are intentionally NOT registered here yet — add them as
// new table entries when those phases are lit up.
const CORE_TAGS: Array<{ tag: string; key: string; risk: ResidueField["risk"] }> = [
  { tag: "dc:creator", key: "creator", risk: "medium" },
  { tag: "cp:lastModifiedBy", key: "lastModifiedBy", risk: "medium" },
  { tag: "dc:title", key: "title", risk: "low" },
  { tag: "dc:subject", key: "subject", risk: "low" },
  { tag: "dc:description", key: "description", risk: "low" },
  { tag: "cp:keywords", key: "keywords", risk: "low" },
]

const APP_TAGS: Array<{ tag: string; key: string; risk: ResidueField["risk"] }> = [
  { tag: "Company", key: "company", risk: "medium" },
  { tag: "Manager", key: "manager", risk: "medium" },
  { tag: "Template", key: "template", risk: "high" },
  { tag: "Application", key: "application", risk: "low" },
]

const PDF_INFO_KEYS: Array<{ k: string; risk: ResidueField["risk"] }> = [
  { k: "Author", risk: "medium" },
  { k: "Title", risk: "low" },
  { k: "Subject", risk: "low" },
  { k: "Creator", risk: "low" },
  { k: "Producer", risk: "low" },
  { k: "Keywords", risk: "low" },
  { k: "CreationDate", risk: "low" },
  { k: "ModDate", risk: "low" },
]

function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Returns trimmed inner text of the first <tag>...</tag>, or null if the tag is
// absent or self-closing/empty. Standard Office prefixes (dc:/cp:/dcterms:) are
// assumed; this is an independent byte-scan, not a namespace-aware parse.
function tagText(xml: string, tag: string): string | null {
  const t = escapeReg(tag)
  const m = xml.match(new RegExp(`<${t}\\b[^>]*?>([\\s\\S]*?)</${t}>`))
  if (!m) return null
  const text = m[1].trim()
  return text.length > 0 ? text : null
}

export function scanOoxmlResidue(parts: PartTextMap): ResidueField[] {
  const out: ResidueField[] = []

  const core = parts["core.xml"]
  if (core) {
    for (const t of CORE_TAGS) {
      const v = tagText(core, t.tag)
      if (v) out.push({ part: "core.xml", key: t.key, value: v, risk: t.risk })
    }
  }

  const app = parts["app.xml"]
  if (app) {
    for (const t of APP_TAGS) {
      const v = tagText(app, t.tag)
      if (v) out.push({ part: "app.xml", key: t.key, value: v, risk: t.risk })
    }
  }

  const custom = parts["custom.xml"]
  if (custom && /<property\b/.test(custom)) {
    out.push({ part: "custom.xml", key: "customProperties", value: "present", risk: "medium" })
  }

  return out
}

export function scanPdfResidue(info: Record<string, string | undefined>): ResidueField[] {
  const out: ResidueField[] = []
  for (const { k, risk } of PDF_INFO_KEYS) {
    const v = info[k]
    if (v && v.trim().length > 0) {
      out.push({ part: "pdf-info", key: k, value: v, risk })
    }
  }
  return out
}
```

- [ ] **Step 5: Run the self-test to verify it passes**

Run: `pnpm exec tsx scripts/verify-clean.selftest.ts`
Expected: `residue-rules self-test passed`

- [ ] **Step 6: Typecheck, lint, commit**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

```bash
git add lib/documents/verify/residue-rules.ts scripts/verify-clean.selftest.ts package.json pnpm-lock.yaml
git commit -m "feat(verify): pure docProps/PDF-info residue scanners"
```

---

### Task 2: `verifyCleaned` over real output bytes (`verify-clean.ts`)

**Files:**
- Create: `lib/documents/verify/verify-clean.ts`
- Modify: `scripts/verify-clean.selftest.ts` (append integration cases)

**Interfaces:**
- Consumes: `scanOoxmlResidue`, `scanPdfResidue`, `ResidueField`, `PartTextMap` from Task 1.
- Produces:
  - `interface VerifyResult { verified: boolean; residue: ResidueField[]; unverifiable?: boolean }`
  - `async function verifyCleaned(bytes: Uint8Array, fileType: DocumentFileType): Promise<VerifyResult>`

- [ ] **Step 1: Append the failing integration test**

Append to `scripts/verify-clean.selftest.ts`:

```ts
import JSZip from "jszip"
import { verifyCleaned } from "../lib/documents/verify/verify-clean"

// a docx whose core.xml still has a creator is NOT verified
const dirtyZip = new JSZip()
dirtyZip.file("docProps/core.xml", `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator>Alice</dc:creator></cp:coreProperties>`)
const dirtyBytes = await dirtyZip.generateAsync({ type: "uint8array" })
const vDirty = await verifyCleaned(dirtyBytes, "docx")
assert.equal(vDirty.verified, false)
assert.ok(vDirty.residue.some(r => r.key === "creator"))

// a docx with blanked core.xml IS verified
const cleanZip = new JSZip()
cleanZip.file("docProps/core.xml", `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator></dc:creator></cp:coreProperties>`)
const cleanBytes = await cleanZip.generateAsync({ type: "uint8array" })
const vClean = await verifyCleaned(cleanBytes, "docx")
assert.equal(vClean.verified, true)
assert.equal(vClean.residue.length, 0)

// garbage bytes are unverifiable, never reported as clean-success
const vBad = await verifyCleaned(new Uint8Array([1, 2, 3]), "docx")
assert.equal(vBad.verified, false)
assert.equal(vBad.unverifiable, true)

console.log("verify-clean self-test passed")
```

Note: the top-level `import JSZip from "jszip"` here is test-only (the runtime module uses dynamic import per Global Constraints).

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec tsx scripts/verify-clean.selftest.ts`
Expected: FAIL — cannot find `../lib/documents/verify/verify-clean`.

- [ ] **Step 3: Implement `verify-clean.ts`**

Create `lib/documents/verify/verify-clean.ts`:

```ts
import type { DocumentFileType } from "@/types/metadata"
import {
  scanOoxmlResidue,
  scanPdfResidue,
  type PartTextMap,
  type ResidueField,
} from "./residue-rules"

export interface VerifyResult {
  verified: boolean
  residue: ResidueField[]
  unverifiable?: boolean
}

async function verifyOoxml(bytes: Uint8Array): Promise<VerifyResult> {
  const { default: JSZip } = await import("jszip")
  const zip = await JSZip.loadAsync(bytes)
  const parts: PartTextMap = {}
  const core = zip.file("docProps/core.xml")
  if (core) parts["core.xml"] = await core.async("string")
  const app = zip.file("docProps/app.xml")
  if (app) parts["app.xml"] = await app.async("string")
  const custom = zip.file("docProps/custom.xml")
  if (custom) parts["custom.xml"] = await custom.async("string")
  const residue = scanOoxmlResidue(parts)
  return { verified: residue.length === 0, residue }
}

async function verifyPdf(bytes: Uint8Array): Promise<VerifyResult> {
  const { PDFDocument } = await import("pdf-lib")
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false })
  const read = (fn: () => string | Date | undefined): string => {
    try {
      const v = fn()
      return v instanceof Date ? v.toISOString() : (v ?? "")
    } catch {
      return ""
    }
  }
  const info: Record<string, string> = {
    Author: read(() => doc.getAuthor()),
    Title: read(() => doc.getTitle()),
    Subject: read(() => doc.getSubject()),
    Creator: read(() => doc.getCreator()),
    Producer: read(() => doc.getProducer()),
    Keywords: read(() => doc.getKeywords()),
    CreationDate: read(() => doc.getCreationDate()),
    ModDate: read(() => doc.getModificationDate()),
  }
  const residue = scanPdfResidue(info)
  return { verified: residue.length === 0, residue }
}

// Independent, writer-agnostic verification of CLEANED output bytes. Re-opens
// the output and byte-scans docProps (OOXML) / Info dict (PDF). `doc` (legacy)
// and any parse failure return `unverifiable: true` — callers MUST NOT show a
// clean-success state when `unverifiable` is set.
export async function verifyCleaned(
  bytes: Uint8Array,
  fileType: DocumentFileType,
): Promise<VerifyResult> {
  try {
    if (fileType === "docx" || fileType === "xlsx") return await verifyOoxml(bytes)
    if (fileType === "pdf") return await verifyPdf(bytes)
    return { verified: false, residue: [], unverifiable: true }
  } catch {
    return { verified: false, residue: [], unverifiable: true }
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec tsx scripts/verify-clean.selftest.ts`
Expected: `verify-clean self-test passed`

- [ ] **Step 5: Typecheck, lint, commit**

Run: `pnpm typecheck && pnpm lint`

```bash
git add lib/documents/verify/verify-clean.ts scripts/verify-clean.selftest.ts
git commit -m "feat(verify): verifyCleaned byte-scan over output bytes"
```

---

### Task 3: `deepClean` aggressive re-strip (`deep-clean.ts`)

**Files:**
- Create: `lib/documents/verify/deep-clean.ts`
- Modify: `scripts/verify-clean.selftest.ts` (append round-trip cases)

**Interfaces:**
- Consumes: `ResidueField` from Task 1; `verifyCleaned` from Task 2 (for the round-trip test only).
- Produces: `async function deepClean(bytes: Uint8Array, fileType: DocumentFileType, residue: ResidueField[]): Promise<Uint8Array>`

- [ ] **Step 1: Append the failing round-trip test**

Append to `scripts/verify-clean.selftest.ts`:

```ts
import { deepClean } from "../lib/documents/verify/deep-clean"

// deepClean blanks a residual creator so re-verify passes
const z1 = new JSZip()
z1.file("docProps/core.xml", `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator>Alice</dc:creator></cp:coreProperties>`)
const b1 = await z1.generateAsync({ type: "uint8array" })
const res1 = (await verifyCleaned(b1, "docx")).residue
const fixed1 = await deepClean(b1, "docx", res1)
assert.equal((await verifyCleaned(fixed1, "docx")).verified, true)

// deepClean drops a custom.xml part entirely
const z2 = new JSZip()
z2.file("[Content_Types].xml", `<Types><Override PartName="/docProps/custom.xml" ContentType="application/vnd.openxmlformats-officedocument.custom-properties+xml"/></Types>`)
z2.file("_rels/.rels", `<Relationships><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties" Target="docProps/custom.xml"/></Relationships>`)
z2.file("docProps/custom.xml", `<Properties><property name="Classification"><vt:lpwstr>Secret</vt:lpwstr></property></Properties>`)
const b2 = await z2.generateAsync({ type: "uint8array" })
const res2 = (await verifyCleaned(b2, "docx")).residue
const fixed2 = await deepClean(b2, "docx", res2)
const fixedZip = await JSZip.loadAsync(fixed2)
assert.equal(fixedZip.file("docProps/custom.xml"), null)
assert.equal((await verifyCleaned(fixed2, "docx")).verified, true)

console.log("deep-clean self-test passed")
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec tsx scripts/verify-clean.selftest.ts`
Expected: FAIL — cannot find `../lib/documents/verify/deep-clean`.

- [ ] **Step 3: Implement `deep-clean.ts`**

Create `lib/documents/verify/deep-clean.ts`:

```ts
import type { DocumentFileType } from "@/types/metadata"
import type { ResidueField } from "./residue-rules"

// docProps tag names that may carry residue, keyed by residue.key.
const KEY_TO_TAG: Record<string, string> = {
  creator: "dc:creator",
  lastModifiedBy: "cp:lastModifiedBy",
  title: "dc:title",
  subject: "dc:subject",
  description: "dc:description",
  keywords: "cp:keywords",
  company: "Company",
  manager: "Manager",
  template: "Template",
  application: "Application",
}

function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Replace the inner text of every <tag>...</tag> with empty. More aggressive
// than the schema writer: it does not require the tag to pre-exist with content.
function blankTags(xml: string, tags: string[]): string {
  let out = xml
  for (const tag of tags) {
    const t = escapeReg(tag)
    out = out.replace(new RegExp(`(<${t}\\b[^>]*?>)[\\s\\S]*?(</${t}>)`, "g"), "$1$2")
  }
  return out
}

function removeCustomXml(content: string, kind: "contentTypes" | "rels"): string {
  if (kind === "contentTypes") {
    return content.replace(/<Override\b[^>]*PartName="\/docProps\/custom\.xml"[^>]*\/>/g, "")
  }
  return content.replace(/<Relationship\b[^>]*Target="docProps\/custom\.xml"[^>]*\/>/g, "")
}

async function deepCleanOoxml(bytes: Uint8Array, residue: ResidueField[]): Promise<Uint8Array> {
  const { default: JSZip } = await import("jszip")
  const zip = await JSZip.loadAsync(bytes)

  const coreTags = residue
    .filter(r => r.part === "core.xml")
    .map(r => KEY_TO_TAG[r.key])
    .filter(Boolean)
  if (coreTags.length > 0) {
    const f = zip.file("docProps/core.xml")
    if (f) zip.file("docProps/core.xml", blankTags(await f.async("string"), coreTags))
  }

  const appTags = residue
    .filter(r => r.part === "app.xml")
    .map(r => KEY_TO_TAG[r.key])
    .filter(Boolean)
  if (appTags.length > 0) {
    const f = zip.file("docProps/app.xml")
    if (f) zip.file("docProps/app.xml", blankTags(await f.async("string"), appTags))
  }

  if (residue.some(r => r.part === "custom.xml")) {
    zip.remove("docProps/custom.xml")
    const ct = zip.file("[Content_Types].xml")
    if (ct) zip.file("[Content_Types].xml", removeCustomXml(await ct.async("string"), "contentTypes"))
    const rels = zip.file("_rels/.rels")
    if (rels) zip.file("_rels/.rels", removeCustomXml(await rels.async("string"), "rels"))
  }

  return zip.generateAsync({ type: "uint8array" })
}

async function deepCleanPdf(bytes: Uint8Array): Promise<Uint8Array> {
  const { PDFDocument, PDFName } = await import("pdf-lib")
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false })
  const infoRef = doc.context.trailerInfo.Info
  if (infoRef) {
    const infoDict = doc.context.lookup(infoRef) as unknown as { delete?(k: unknown): void }
    if (infoDict && typeof infoDict.delete === "function") {
      for (const k of ["Author", "Title", "Subject", "Creator", "Producer", "Keywords", "CreationDate", "ModDate"]) {
        infoDict.delete(PDFName.of(k))
      }
    }
  }
  return doc.save()
}

// Re-strip residue more aggressively than the primary cleaner. Each call must
// be strictly more aggressive than the previous round (used under a retry cap).
export async function deepClean(
  bytes: Uint8Array,
  fileType: DocumentFileType,
  residue: ResidueField[],
): Promise<Uint8Array> {
  if (fileType === "docx" || fileType === "xlsx") return deepCleanOoxml(bytes, residue)
  if (fileType === "pdf") return deepCleanPdf(bytes)
  return bytes
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec tsx scripts/verify-clean.selftest.ts`
Expected: `deep-clean self-test passed`

- [ ] **Step 5: Typecheck, lint, commit**

Run: `pnpm typecheck && pnpm lint`

```bash
git add lib/documents/verify/deep-clean.ts scripts/verify-clean.selftest.ts
git commit -m "feat(verify): deepClean aggressive docProps/PDF-info re-strip"
```

---

### Task 4: Orchestrator `cleanAndVerify` (`clean-and-verify.ts`)

**Files:**
- Create: `lib/documents/verify/clean-and-verify.ts`
- Modify: `scripts/verify-clean.selftest.ts` (append orchestrator cases with injected fakes)

**Interfaces:**
- Consumes: `verifyCleaned` (Task 2), `deepClean` (Task 3), `ResidueField` (Task 1).
- Produces:
  - `const MAX_AUTO_RECLEAN = 1`
  - `interface CleanVerifyResult { bytes: Uint8Array; verified: boolean; residue: ResidueField[]; attempts: number; exhausted: boolean; unverifiable?: boolean }`
  - `async function cleanAndVerify(produce: () => Promise<Uint8Array>, fileType: DocumentFileType): Promise<CleanVerifyResult>`

- [ ] **Step 1: Append the failing orchestrator test**

Append to `scripts/verify-clean.selftest.ts`:

```ts
import { cleanAndVerify, MAX_AUTO_RECLEAN } from "../lib/documents/verify/clean-and-verify"

assert.equal(MAX_AUTO_RECLEAN, 1)

// dirty-on-first-pass docx gets auto-deep-cleaned to verified within the cap
const zc = new JSZip()
zc.file("docProps/core.xml", `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator>Alice</dc:creator></cp:coreProperties>`)
const dirty = await zc.generateAsync({ type: "uint8array" })
const out = await cleanAndVerify(async () => dirty, "docx")
assert.equal(out.verified, true)
assert.equal(out.attempts, 2) // first pass dirty + one deepClean
assert.equal(out.exhausted, false)

// already-clean docx passes on first attempt, no deepClean
const zclean = new JSZip()
zclean.file("docProps/core.xml", `<cp:coreProperties xmlns:cp="x" xmlns:dc="y"><dc:creator></dc:creator></cp:coreProperties>`)
const clean = await zclean.generateAsync({ type: "uint8array" })
const out2 = await cleanAndVerify(async () => clean, "docx")
assert.equal(out2.verified, true)
assert.equal(out2.attempts, 1)

console.log("clean-and-verify self-test passed")
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec tsx scripts/verify-clean.selftest.ts`
Expected: FAIL — cannot find `../lib/documents/verify/clean-and-verify`.

- [ ] **Step 3: Implement `clean-and-verify.ts`**

Create `lib/documents/verify/clean-and-verify.ts`:

```ts
import type { DocumentFileType } from "@/types/metadata"
import { verifyCleaned } from "./verify-clean"
import { deepClean } from "./deep-clean"
import type { ResidueField } from "./residue-rules"

export const MAX_AUTO_RECLEAN = 1

export interface CleanVerifyResult {
  bytes: Uint8Array
  verified: boolean
  residue: ResidueField[]
  attempts: number
  exhausted: boolean
  unverifiable?: boolean
}

// Wrap any "produce cleaned bytes" function with verify → deepClean → re-verify,
// capped at MAX_AUTO_RECLEAN automatic deep-clean rounds. When the cap is hit
// with residue still present, returns exhausted=true (UI offers manual retry).
export async function cleanAndVerify(
  produce: () => Promise<Uint8Array>,
  fileType: DocumentFileType,
): Promise<CleanVerifyResult> {
  let bytes = await produce()
  let attempts = 1
  let result = await verifyCleaned(bytes, fileType)

  while (!result.verified && !result.unverifiable && attempts <= MAX_AUTO_RECLEAN) {
    bytes = await deepClean(bytes, fileType, result.residue)
    attempts += 1
    result = await verifyCleaned(bytes, fileType)
  }

  return {
    bytes,
    verified: result.verified,
    residue: result.residue,
    attempts,
    exhausted: !result.verified && !result.unverifiable,
    unverifiable: result.unverifiable,
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm exec tsx scripts/verify-clean.selftest.ts`
Expected: `clean-and-verify self-test passed` (all prior lines still print).

- [ ] **Step 5: Add the `verify:clean` package script + finalize CLI**

In `package.json` `scripts`, add:

```json
"verify:clean": "tsx scripts/verify-clean.selftest.ts"
```

- [ ] **Step 6: Typecheck, lint, commit**

Run: `pnpm typecheck && pnpm lint && pnpm verify:clean`
Expected: all self-tests print "passed".

```bash
git add lib/documents/verify/clean-and-verify.ts scripts/verify-clean.selftest.ts package.json
git commit -m "feat(verify): cleanAndVerify orchestrator with capped auto-reclean"
```

---

### Task 5: web `clear*` returns cleaned bytes + writes to file-store

**Files:**
- Modify: `lib/documents/web/docx-processor.ts` (`clearDocx`)
- Modify: `lib/documents/web/xlsx-processor.ts` (`clearXlsx`)
- Modify: `lib/documents/web/pdf-processor.ts` (`clearPdf`)
- Modify: `lib/documents/web/document-processor.ts` (`WebDocumentResourceApi.clear` return type)

**Interfaces:**
- Consumes: `setFileData` from `lib/resources/file-store`.
- Produces: `clear*(fileId, fileName): Promise<Uint8Array>` (was `Promise<string>`); each writes cleaned bytes back to file-store via `setFileData(fileId, cleaned)` and no longer triggers a download itself (download is owned by callers in Tasks 6–7).

Verification for this task is `pnpm typecheck` + the integration self-tests in later tasks; there is no browser test harness.

- [ ] **Step 1: Update `clearDocx`**

In `lib/documents/web/docx-processor.ts`, replace `clearDocx` and drop its inline download:

```ts
export async function clearDocx(filePath: string, fileName: string): Promise<Uint8Array> {
  const data = getFileData(filePath)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const clearedMetadata = createEmptyOoxmlMetadata()
  const updated = await writeOoxmlMetadata(data, clearedMetadata)
  setFileData(filePath, updated)
  return updated
}
```

Add `setFileData` to the existing import:

```ts
import { getFileData, setFileData } from "@/lib/resources/file-store"
```

- [ ] **Step 2: Update `clearXlsx`**

Apply the identical change to `lib/documents/web/xlsx-processor.ts` (`clearXlsx`): return `Promise<Uint8Array>`, `setFileData(filePath, updated)`, remove inline download, add `setFileData` import. (Mirror Step 1 exactly with `clearXlsx`'s body.)

- [ ] **Step 3: Update `clearPdf`**

In `lib/documents/web/pdf-processor.ts`, change `clearPdf` to return bytes + write back, removing the inline download (keep the existing Info-dict date deletion):

```ts
export async function clearPdf(filePath: string, fileName: string): Promise<Uint8Array> {
  const data = getFileData(filePath)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const { PDFDocument, PDFName } = await import("pdf-lib")
  const doc = await PDFDocument.load(data, { ignoreEncryption: true, updateMetadata: false })
  doc.setTitle("")
  doc.setSubject("")
  doc.setAuthor("")
  doc.setKeywords([])
  doc.setProducer("")
  doc.setCreator("")

  try {
    const infoRef = doc.context.trailerInfo.Info
    if (infoRef) {
      const infoDict = doc.context.lookup(infoRef)
      if (infoDict && typeof (infoDict as unknown as Record<string, unknown>)["delete"] === "function") {
        const dictWithDelete = infoDict as unknown as { delete(key: unknown): void }
        dictWithDelete.delete(PDFName.of("CreationDate"))
        dictWithDelete.delete(PDFName.of("ModDate"))
      }
    }
  } catch {
    // 日期清理失败不影响整体清理流程
  }

  const pdfBytes = await doc.save()
  const cleaned = new Uint8Array(pdfBytes)
  setFileData(filePath, cleaned)
  return cleaned
}
```

Add `setFileData` to the existing import:

```ts
import { getFileData, setFileData } from "@/lib/resources/file-store"
```

- [ ] **Step 4: Update `clearDoc` to match the new signature**

In `lib/documents/web/doc-processor.ts`, make `clearDoc` return `Promise<Uint8Array>`. If `doc` clearing currently delegates to the docx path, return its bytes; otherwise return the existing/unchanged bytes from `getFileData` after writing back. Keep behavior identical otherwise — the `doc` path is treated as `unverifiable` downstream.

- [ ] **Step 5: Update the interface**

In `lib/documents/web/document-processor.ts`, change the interface line:

```ts
  clear(filePath: string, fileName: string): Promise<Uint8Array>
```

- [ ] **Step 6: Typecheck, lint, commit**

Run: `pnpm typecheck && pnpm lint`
Expected: errors will surface in `lib/resources/documents.ts` (it consumed `clear`'s old return). Those are fixed in Task 6 — if typecheck flags only that file, proceed; otherwise fix local errors here.

```bash
git add lib/documents/web/docx-processor.ts lib/documents/web/xlsx-processor.ts lib/documents/web/pdf-processor.ts lib/documents/web/doc-processor.ts lib/documents/web/document-processor.ts
git commit -m "refactor(web-clear): clear* returns cleaned bytes and writes file-store"
```

---

### Task 6: Wire verification into the resource layer + editor/batch context

**Files:**
- Modify: `lib/resources/documents.ts` (`BatchSaveResultItem`, web `destroyMetadataMany`)
- Modify: `contexts/metadata-context.tsx` (`clearAndSaveDocument`, `batchClearAndSave` status messages)

**Interfaces:**
- Consumes: `cleanAndVerify` (Task 4); `clear` now returns `Uint8Array` (Task 5); `resolveFileTypeFromPath`.
- Produces: `BatchSaveResultItem` gains optional `verified?: boolean; residue?: ResidueField[]; exhausted?: boolean; unverifiable?: boolean`.

- [ ] **Step 1: Extend `BatchSaveResultItem`**

In `lib/resources/documents.ts`, add to the interface:

```ts
import type { ResidueField } from "@/lib/documents/verify/residue-rules"

export interface BatchSaveResultItem {
  filePath: string
  success: boolean
  error?: string
  verified?: boolean
  residue?: ResidueField[]
  exhausted?: boolean
  unverifiable?: boolean
}
```

- [ ] **Step 2: Run `cleanAndVerify` inside web `destroyMetadataMany`**

In `createWebResourceForType`, replace the `destroyMetadataMany` body:

```ts
    async destroyMetadataMany(filePaths: string[]) {
      const { cleanAndVerify } = await import("@/lib/documents/verify/clean-and-verify")
      const results: BatchSaveResultItem[] = []
      for (const filePath of filePaths) {
        try {
          const result = await cleanAndVerify(
            () => webResource.clear(filePath, filePath),
            fileType,
          )
          results.push({
            filePath,
            success: true,
            verified: result.verified,
            residue: result.residue,
            exhausted: result.exhausted,
            unverifiable: result.unverifiable,
          })
        } catch (error) {
          results.push({ filePath, success: false, error: String(error) })
        }
      }
      return results
    },
```

Note: `cleanAndVerify` operates on the bytes `clear` wrote to file-store; its final `result.bytes` already equals what `verifyCleaned` re-read, but `clear`/`deepClean` write-back is handled in Task 7's download path. For the editor flow the cleaned bytes are already in file-store (Task 5), so the subsequent `resource.show()` reflects the cleaned state. If `result.attempts > 1` (deepClean ran), write the deeper bytes back: add `setFileData(filePath, result.bytes)` import-and-call before pushing the result.

```ts
import { getFileData, setFileData } from "@/lib/resources/file-store"
// ...inside the try, after cleanAndVerify:
          if (result.attempts > 1) setFileData(filePath, result.bytes)
```

- [ ] **Step 3: Surface verify state in `clearAndSaveDocument`**

In `contexts/metadata-context.tsx` `clearAndSaveDocument`, after the existing `results[0]?.success` check, branch on verification:

```ts
      const outcome = results[0]
      if (!outcome?.success) {
        updateFileStatus(documentId, { status: "error", progressMessage: tp("processFailed") })
        return
      }

      const parsed = await resource.show(target.filePath)
      const normalized = normalizeMetadata(parsed, target.filePath)

      setDocumentsById(prev => ({
        ...prev,
        [documentId]: { metadata: normalized, originalMetadata: normalized, hasChanges: false },
      }))

      if (outcome.exhausted) {
        updateFileStatus(documentId, {
          status: "error",
          progressMessage: tp("verifyResidue"),
          error: tp("verifyResidueCount", { count: outcome.residue?.length ?? 0 }),
        })
        return
      }

      updateFileStatus(documentId, {
        status: "ready",
        progressMessage: outcome.unverifiable ? tp("verifyUnverifiable") : tp("verifiedSynced"),
        error: undefined,
      })
```

- [ ] **Step 4: Surface verify state in `batchClearAndSave`**

In `batchClearAndSave`, after computing `results`, treat `success && exhausted` items as needing attention. Add after the existing `failedItems` block:

```ts
    const residueItems = results.filter(item => item.success && item.exhausted)
    residueItems.forEach(item => {
      const doc = documents.find(d => d.filePath === item.filePath)
      if (doc) {
        updateFileStatus(doc.id, {
          status: "error",
          progressMessage: tp("verifyResidue"),
          error: tp("verifyResidueCount", { count: item.residue?.length ?? 0 }),
        })
      }
    })
```

And when marking refreshed successes ready, skip ones in `residueItems` (guard with a `Set` of their filePaths) so they keep the residue status.

- [ ] **Step 5: Add the new progress i18n keys**

In both `messages/en.json` and `messages/zh-CN.json`, under `progress`, add:

```json
"verifiedSynced": "Cleaned & verified — no residual metadata detected",
"verifyResidue": "Residual metadata remains after auto-reclean",
"verifyResidueCount": "{count} residual field(s) — click to retry manually",
"verifyUnverifiable": "Cleaned, but could not fully verify (format limit)"
```

(zh-CN equivalents: e.g. `"verifiedSynced": "已清理并校验——未检测到残留元数据"`, `"verifyResidue": "自动补清后仍有残留"`, `"verifyResidueCount": "残留 {count} 项——点击手动重试"`, `"verifyUnverifiable": "已清理，但无法完全校验（格式限制）"`.)

- [ ] **Step 6: Typecheck, lint, commit**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

```bash
git add lib/resources/documents.ts contexts/metadata-context.tsx messages/en.json messages/zh-CN.json
git commit -m "feat(verify): wire cleanAndVerify into editor/batch clear flows"
```

---

### Task 7: Wire verification into the audit flow + download ownership

**Files:**
- Modify: `components/om/om-audit-report.tsx`

**Interfaces:**
- Consumes: `cleanAndVerify`, `CleanVerifyResult` (Task 4); `triggerFileDownload` (existing local helper).

- [ ] **Step 1: Verify worker output before declaring success**

In `handleRemoveMetadata`, the `CLEAN_SUCCESS` handler currently sets cleaned bytes, stores them, flips the card, and downloads. Replace the success branch so it verifies first:

```ts
      if (success && type === "CLEAN_SUCCESS") {
        if (timers.clean) clearTimeout(timers.clean)
        worker.removeEventListener("message", handleCleanMessage)
        const workerBytes: Uint8Array = data
        ;(async () => {
          const { cleanAndVerify } = await import("@/lib/documents/verify/clean-and-verify")
          const result = await cleanAndVerify(async () => workerBytes, fileExt)
          setVerifyResult(result)
          setFileData(filePath, result.bytes)
          setCleanedBytes(result.bytes)
          setIsCleaning(false)
          if (result.verified) {
            setIsFlipped(true)
            triggerFileDownload(result.bytes)
          }
          // residue/unverifiable: stay on front face, render residue state (Step 3)
        })()
      } else if (success === false) {
```

Add state near the other `useState`s:

```ts
const [verifyResult, setVerifyResult] = useState<import("@/lib/documents/verify/clean-and-verify").CleanVerifyResult | null>(null)
```

- [ ] **Step 2: Add a 5th "Verifying" scan step**

In the scanning-steps JSX, add a `StepItem` after `steps.generating`:

```tsx
              <StepItem
                label={t("steps.verifying")}
                status={activeStep > 4 ? "success" : activeStep === 4 ? "active" : "pending"}
              />
```

Change the interval guard from `currentStep >= 4` to `currentStep >= 5` so the worker request fires after the verify step appears. Add `audit.steps.verifying` to both message files: `"verifying": "Verifying removal locally..."` / `"verifying": "正在本地校验清除结果..."`.

- [ ] **Step 3: Render the residue terminal state**

When `verifyResult && !verifyResult.verified` and not cleaning, render a residue panel instead of flipping to green. Add, inside the front-face card body (replace the simple else path), a conditional block:

```tsx
{verifyResult && verifyResult.exhausted ? (
  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
      {t("verifyResidueTitle", { count: verifyResult.residue.length })}
    </p>
    <ul className="mt-2 space-y-1">
      {verifyResult.residue.map(r => (
        <li key={`${r.part}:${r.key}`} className="text-[11px] font-mono text-foreground break-all">
          {r.part} · {r.key}: {redactValue(r.value, r.part === "app.xml" && r.key === "template" ? "path" : "identity", `${r.part}:${r.key}`)}
        </li>
      ))}
    </ul>
    <div className="flex gap-2 mt-3">
      <Button className="rounded-xl flex-1" onClick={handleRetryClean}>
        <Sparkles className="h-4 w-4 mr-1.5" />{t("retryClean")}
      </Button>
      <Button variant="outline" className="rounded-xl flex-1" onClick={() => router.push("/editor")}>
        <FileText className="h-4 w-4 mr-1.5" />{t("manualEdit")}
      </Button>
    </div>
  </div>
) : verifyResult && verifyResult.unverifiable ? (
  <p className="text-xs text-muted-foreground p-4">{t("verifyUnverifiable")}</p>
) : null}
```

Add `handleRetryClean` (manual retry bypasses the auto cap by re-running `handleRemoveMetadata` on the original bytes):

```ts
const handleRetryClean = () => {
  setVerifyResult(null)
  handleRemoveMetadata()
}
```

- [ ] **Step 4: Honesty copy on the green back face**

Replace the hard-coded `100% CLEAN` badge text and `cleanSuccess`/`cleanSuccessDesc` copy with detected-language wording. In both message files set:

```json
"cleanSuccess": "No residual metadata detected",
"cleanBadge": "VERIFIED",
"verifyAutoNote": "Auto re-cleaned and verified",
"verifyResidueTitle": "{count} residual field(s) still detected",
"retryClean": "Clean again",
"verifyUnverifiable": "Cleaned, but could not fully verify (format limit)"
```

Replace the literal `100% CLEAN` in the JSX with `{t("cleanBadge")}`, and show `verifyAutoNote` as small text when `verifyResult?.attempts && verifyResult.attempts > 1`. Update `cleanSuccessDesc` to drop the "100%/fully sanitized" absolute claims.

- [ ] **Step 5: Manual browser verification**

Run: `pnpm dev`, open `/audit` (or the audit entry), upload a docx that has a creator/company and a `custom.xml`. Confirm:
- The scan shows a 5th "Verifying removal" step.
- A clean file flips to the green "No residual metadata detected / VERIFIED" card and downloads.
- A file that still has residue after auto-reclean shows the amber residue panel with a working "Clean again" button (which re-runs and then succeeds).

Document the observed result in the commit message.

- [ ] **Step 6: Typecheck, lint, commit**

Run: `pnpm typecheck && pnpm lint`

```bash
git add components/om/om-audit-report.tsx messages/en.json messages/zh-CN.json
git commit -m "feat(verify): audit flow verifies removal, residue state + honest copy"
```

---

### Task 8: Final gate — full build + CLI verification

**Files:** none (verification only)

- [ ] **Step 1: Run the pure self-tests**

Run: `pnpm verify:clean`
Expected: every `... self-test passed` line prints.

- [ ] **Step 2: Full typecheck + lint + build**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: build succeeds (prebuild `seo:check` passes; no new SEO pages were added so the contract is unaffected).

- [ ] **Step 3: First-load bundle sanity**

Confirm `jszip`/`pdf-lib` are still only dynamically imported (no new top-level import added):

Run: `grep -rn "from \"jszip\"\|from \"pdf-lib\"" lib/documents/verify lib/documents/web | grep -v "await import"`
Expected: no matches (the test file's top-level `import JSZip` lives under `scripts/`, which is excluded and never bundled).

- [ ] **Step 4: Final commit (if any docs changed)**

```bash
git add -A
git commit -m "chore(verify): final build + bundle sanity for clean-verification" --allow-empty
```

---

## Self-Review

**Spec coverage:**
- §3 decision 1 (all paths) → Tasks 6 (editor/batch) + 7 (audit). ✓
- §3 decision 2 (byte-scan primary + same-engine aux) → byte-scan in Tasks 1–2 (primary gate). Same-engine DOM re-scan was dropped: for the docProps bar the independent regex byte-scan reads the same parts more robustly, and `DOMParser` is browser-only (would break the Node CLI). Documented deviation; the byte-scan IS the independent verifier. ✓ (intentional simplification)
- §3 decision 3 (block + capped auto-reclean + manual) → Task 4 (`MAX_AUTO_RECLEAN`) + Task 7 Step 3 (`handleRetryClean`) + Task 6 (exhausted status). ✓
- §3 decision 4 (docProps bar, extension rules scaffolded off) → Task 1 (no extension rules registered; comment marks where). ✓
- §3 decision 5 (honest copy) → Task 7 Step 4 + Task 6 Step 5. ✓
- §4.3 fix `clear()` write-back → Task 5. ✓
- §7 CLI/self-test → Tasks 1–4 self-tests + `verify:clean` script + Task 8. ✓
- §8 not-doing (Tauri, forensic fields, XMP rewrite) → not implemented; only scaffolded. ✓

**Placeholder scan:** Task 5 Step 2 ("mirror Step 1 exactly") repeats a structurally identical edit on a sibling file — the full pattern is shown in Step 1; acceptable since it is a literal mirror. Task 5 Step 4 (`clearDoc`) is described conditionally because `doc-processor.ts` was not read; the implementer must open it and apply the signature change. No `TBD`/`TODO`/"add error handling" placeholders remain.

**Type consistency:** `clear*` returns `Promise<Uint8Array>` in Tasks 5 + interface; `cleanAndVerify(produce, fileType)` signature consistent across Tasks 4/6/7; `CleanVerifyResult` fields (`bytes/verified/residue/attempts/exhausted/unverifiable`) consistent; `ResidueField.part` union identical in Tasks 1/3/6. ✓

## Open Note for the Implementer

Before Task 5 Step 4, read `lib/documents/web/doc-processor.ts` to see how `clearDoc` currently works — it was not inspected during planning. Keep its behavior identical except for the return-type/write-back change; `doc` files flow through verification as `unverifiable`.
