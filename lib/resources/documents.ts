import type { DocumentMetadata } from "@/types/metadata"
import type { DocumentFileType } from "@/types/metadata"
import { isTauri, trackedInvoke } from "@/lib/tauri"
import { resolveFileTypeFromPath } from "@/lib/documents/file-type"
import { getWebResourceByType } from "@/lib/documents/web/document-processor"
import { getFileData } from "@/lib/resources/file-store"

export interface BatchSaveResultItem {
  filePath: string
  success: boolean
  error?: string
}

export interface BatchSaveRequestItem {
  filePath: string
  metadata: DocumentMetadata
}

type DocumentResourceApi = {
  show(filePath: string): Promise<DocumentMetadata>
  replace(filePath: string, metadata: DocumentMetadata): Promise<string>
  createSavedCopy(filePath: string, metadata: DocumentMetadata): Promise<string | null>
  replaceMany(items: BatchSaveRequestItem[]): Promise<BatchSaveResultItem[]>
  destroyMetadataMany(filePaths: string[]): Promise<BatchSaveResultItem[]>
}

const tauriDocumentsResource = {
  docx: {
    show(filePath: string) {
      return trackedInvoke<DocumentMetadata>("parse_docx_metadata_from_path", { filePath })
    },
    replace(filePath: string, metadata: DocumentMetadata) {
      return trackedInvoke<string>("save_docx_metadata_to_source", { filePath, metadata })
    },
    createSavedCopy(filePath: string, metadata: DocumentMetadata) {
      return trackedInvoke<string | null>("save_docx_metadata_as", { filePath, metadata })
    },
    replaceMany(items: BatchSaveRequestItem[]) {
      return trackedInvoke<BatchSaveResultItem[]>("batch_save_docx_metadata_to_source", { items })
    },
    destroyMetadataMany(filePaths: string[]) {
      return trackedInvoke<BatchSaveResultItem[]>("batch_clear_and_save_docx_metadata", {
        filePaths,
      })
    },
  },
  xlsx: {
    show(filePath: string) {
      return trackedInvoke<DocumentMetadata>("parse_xlsx_metadata_from_path", { filePath })
    },
    replace(filePath: string, metadata: DocumentMetadata) {
      return trackedInvoke<string>("save_xlsx_metadata_to_source", { filePath, metadata })
    },
    createSavedCopy(filePath: string, metadata: DocumentMetadata) {
      return trackedInvoke<string | null>("save_xlsx_metadata_as", { filePath, metadata })
    },
    replaceMany(items: BatchSaveRequestItem[]) {
      return trackedInvoke<BatchSaveResultItem[]>("batch_save_xlsx_metadata_to_source", { items })
    },
    destroyMetadataMany(filePaths: string[]) {
      return trackedInvoke<BatchSaveResultItem[]>("batch_clear_and_save_xlsx_metadata", {
        filePaths,
      })
    },
  },
  pdf: {
    show(filePath: string) {
      return trackedInvoke<DocumentMetadata>("parse_pdf_metadata_from_path", { filePath })
    },
    replace(filePath: string, metadata: DocumentMetadata) {
      return trackedInvoke<string>("save_pdf_metadata_to_source", { filePath, metadata })
    },
    createSavedCopy(filePath: string, metadata: DocumentMetadata) {
      return trackedInvoke<string | null>("save_pdf_metadata_as", { filePath, metadata })
    },
    replaceMany(items: BatchSaveRequestItem[]) {
      return trackedInvoke<BatchSaveResultItem[]>("batch_save_pdf_metadata_to_source", { items })
    },
    destroyMetadataMany(filePaths: string[]) {
      return trackedInvoke<BatchSaveResultItem[]>("batch_clear_and_save_pdf_metadata", {
        filePaths,
      })
    },
  },
  doc: {
    show(filePath: string) {
      return trackedInvoke<DocumentMetadata>("parse_doc_metadata_from_path", { filePath })
    },
    replace(filePath: string, metadata: DocumentMetadata) {
      return trackedInvoke<string>("save_doc_metadata_to_source", { filePath, metadata })
    },
    createSavedCopy(filePath: string, metadata: DocumentMetadata) {
      return trackedInvoke<string | null>("save_doc_metadata_as", { filePath, metadata })
    },
    replaceMany(items: BatchSaveRequestItem[]) {
      return trackedInvoke<BatchSaveResultItem[]>("batch_save_doc_metadata_to_source", { items })
    },
    destroyMetadataMany(filePaths: string[]) {
      return trackedInvoke<BatchSaveResultItem[]>("batch_clear_and_save_doc_metadata", {
        filePaths,
      })
    },
  },
} as const

function createWebResourceForType(fileType: DocumentFileType): DocumentResourceApi {
  const webResource = getWebResourceByType(fileType)
  if (!webResource) {
    return unsupportedResource
  }

  return {
    async show(filePath: string) {
      const data = getFileData(filePath)
      if (!data) {
        throw new Error(`Web 模式下文件数据未加载: ${filePath}`)
      }
      return webResource.show(filePath, filePath)
    },
    async replace(filePath: string, metadata: DocumentMetadata) {
      return webResource.replace(filePath, filePath, metadata)
    },
    async createSavedCopy(filePath: string, metadata: DocumentMetadata) {
      return webResource.createSavedCopy(filePath, filePath, metadata)
    },
    async replaceMany(items: BatchSaveRequestItem[]) {
      const results: BatchSaveResultItem[] = []
      for (const item of items) {
        try {
          await webResource.replace(item.filePath, item.filePath, item.metadata)
          results.push({ filePath: item.filePath, success: true })
        } catch (error) {
          results.push({ filePath: item.filePath, success: false, error: String(error) })
        }
      }
      return results
    },
    async destroyMetadataMany(filePaths: string[]) {
      const results: BatchSaveResultItem[] = []
      for (const filePath of filePaths) {
        try {
          await webResource.clear(filePath, filePath)
          results.push({ filePath, success: true })
        } catch (error) {
          results.push({ filePath, success: false, error: String(error) })
        }
      }
      return results
    },
  }
}

const webResourcesCache = new Map<DocumentFileType, DocumentResourceApi>()

function getWebResourceByFileType(fileType: DocumentFileType): DocumentResourceApi {
  const cached = webResourcesCache.get(fileType)
  if (cached) return cached
  const resource = createWebResourceForType(fileType)
  webResourcesCache.set(fileType, resource)
  return resource
}

const unsupportedResource: DocumentResourceApi = {
  async show(filePath: string) {
    throw new Error(`暂不支持的文件类型: ${filePath}`)
  },
  async replace(filePath: string) {
    throw new Error(`暂不支持的文件类型: ${filePath}`)
  },
  async createSavedCopy(filePath: string) {
    throw new Error(`暂不支持的文件类型: ${filePath}`)
  },
  async replaceMany(items: BatchSaveRequestItem[]) {
    if (items.length > 0) {
      throw new Error(`暂不支持的文件类型: ${items[0]?.filePath}`)
    }
    return []
  },
  async destroyMetadataMany(filePaths: string[]) {
    if (filePaths.length > 0) {
      throw new Error(`暂不支持的文件类型: ${filePaths[0]}`)
    }
    return []
  },
}

export function getDocumentResourceByType(fileType: DocumentFileType): DocumentResourceApi {
  if (!isTauri()) {
    return getWebResourceByFileType(fileType)
  }

  switch (fileType) {
    case "docx":
      return tauriDocumentsResource.docx
    case "xlsx":
      return tauriDocumentsResource.xlsx
    case "pdf":
      return tauriDocumentsResource.pdf
    case "doc":
      return tauriDocumentsResource.doc
    default:
      return unsupportedResource
  }
}

export function getDocumentResourceByPath(filePath: string): DocumentResourceApi {
  return getDocumentResourceByType(resolveFileTypeFromPath(filePath))
}
