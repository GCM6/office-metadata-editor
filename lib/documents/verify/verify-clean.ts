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
