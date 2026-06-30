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
