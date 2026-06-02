import type { DocumentMetadata } from "@/types/metadata"
import { createEmptyOoxmlMetadata, readOoxmlMetadata, writeOoxmlMetadata } from "./ooxml-utils"
import { getFileData } from "@/lib/resources/file-store"

export async function showXlsx(fileId: string, fileName: string): Promise<DocumentMetadata> {
  const data = getFileData(fileId)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const { documentProperties, coreProperties, appProperties } = await readOoxmlMetadata(data)

  return {
    fileName,
    fileType: "xlsx",
    fileSize: data.byteLength,
    documentProperties,
    coreProperties,
    appProperties,
  }
}

export async function replaceXlsx(
  fileId: string,
  fileName: string,
  metadata: DocumentMetadata,
): Promise<string> {
  const data = getFileData(fileId)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const updated = await writeOoxmlMetadata(data, metadata)
  const blob = new Blob([new Uint8Array(updated)])
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)

  return fileName
}

export async function clearXlsx(filePath: string, fileName: string): Promise<string> {
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
