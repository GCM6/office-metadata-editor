import type { DocumentMetadata } from "@/types/metadata"
import { createEmptyOoxmlMetadata, readOoxmlMetadata, writeOoxmlMetadata } from "./ooxml-utils"
import { getFileData } from "@/lib/resources/file-store"

export async function showDocx(fileId: string, fileName: string): Promise<DocumentMetadata> {
  const data = getFileData(fileId)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const { documentProperties, coreProperties, appProperties } = await readOoxmlMetadata(data)

  return {
    fileName,
    fileType: "docx",
    fileSize: data.byteLength,
    documentProperties,
    coreProperties,
    appProperties,
  }
}

export async function replaceDocx(
  fileId: string,
  fileName: string,
  metadata: DocumentMetadata,
): Promise<string> {
  const data = getFileData(fileId)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const updated = await writeOoxmlMetadata(data, metadata)
  triggerDownload(updated, fileName)

  return fileName
}

export async function clearDocx(filePath: string, fileName: string): Promise<string> {
  const data = getFileData(filePath)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const clearedMetadata = createEmptyOoxmlMetadata()
  const updated = await writeOoxmlMetadata(data, clearedMetadata)
  const blob = new Blob([new Uint8Array(updated)])
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)

  return fileName
}

function triggerDownload(data: Uint8Array, fileName: string): void {
  const blob = new Blob([new Uint8Array(data)])
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}
