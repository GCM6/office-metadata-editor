import type { DocumentMetadata, DocumentFileType } from "@/types/metadata"
import { showDocx, replaceDocx, clearDocx } from "./docx-processor"
import { showXlsx, replaceXlsx, clearXlsx } from "./xlsx-processor"
import { showPdf, replacePdf, clearPdf } from "./pdf-processor"
import { showDoc, replaceDoc, clearDoc } from "./doc-processor"

export interface WebDocumentResourceApi {
  show(fileId: string, fileName: string): Promise<DocumentMetadata>
  replace(fileId: string, fileName: string, metadata: DocumentMetadata): Promise<string>
  createSavedCopy(fileId: string, fileName: string, metadata: DocumentMetadata): Promise<string | null>
  clear(filePath: string, fileName: string): Promise<string>
}

function getWebProcessor(fileType: string): WebDocumentResourceApi | null {
  switch (fileType) {
    case "docx":
      return {
        show: showDocx,
        replace: replaceDocx,
        async createSavedCopy(fileId, fileName, metadata) {
          return replaceDocx(fileId, fileName, metadata)
        },
        clear: clearDocx,
      }
    case "xlsx":
      return {
        show: showXlsx,
        replace: replaceXlsx,
        async createSavedCopy(fileId, fileName, metadata) {
          return replaceXlsx(fileId, fileName, metadata)
        },
        clear: clearXlsx,
      }
    case "pdf":
      return {
        show: showPdf,
        replace: replacePdf,
        async createSavedCopy(fileId, fileName, metadata) {
          return replacePdf(fileId, fileName, metadata)
        },
        clear: clearPdf,
      }
    case "doc":
      return {
        show: showDoc,
        replace: replaceDoc,
        async createSavedCopy(fileId, fileName, metadata) {
          return replaceDoc(fileId, fileName, metadata)
        },
        clear: clearDoc,
      }
    default:
      return null
  }
}

export function getWebResourceByType(fileType: DocumentFileType): WebDocumentResourceApi | null {
  if (fileType === "unknown") return null
  return getWebProcessor(fileType)
}
