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
