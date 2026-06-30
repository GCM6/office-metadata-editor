import type { DocumentMetadata } from "@/types/metadata"
import { getFileData, setFileData } from "@/lib/resources/file-store"

export async function showDoc(fileId: string, fileName: string): Promise<DocumentMetadata> {
  const data = getFileData(fileId)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  return {
    fileName,
    fileType: "doc",
    fileSize: data.byteLength,
    documentProperties: {
      title: "", subject: "", creator: "", keywords: "", description: "",
      lastModifiedBy: "", revision: "1", created: "", modified: "",
      category: "", contentStatus: "", version: "", language: "zh-CN",
      identifier: "", source: "",
    },
    coreProperties: {
      dcTitle: "", dcSubject: "", dcCreator: "", dcDescription: "",
      dcKeywords: "", dcLanguage: "zh-CN", dcIdentifier: "", dcSource: "",
    },
    appProperties: {
      application: "Microsoft Word", appVersion: "16.0",
      company: "", manager: "", template: "Normal.dotm",
      totalTime: "0", pages: 0, words: 0,
      characters: 0, charactersWithSpaces: 0, paragraphs: 0, lines: 0,
    },
  }
}

export async function replaceDoc(
  fileId: string,
  fileName: string,
  metadata: DocumentMetadata,
): Promise<string> {
  const data = getFileData(fileId)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const sidecarJson = JSON.stringify(
    {
      documentProperties: metadata.documentProperties,
      coreProperties: metadata.coreProperties,
    },
    null,
    2,
  )

  const sidecarBlob = new Blob([sidecarJson], { type: "application/json" })
  const sidecarUrl = URL.createObjectURL(sidecarBlob)
  const sidecarLink = document.createElement("a")
  sidecarLink.href = sidecarUrl
  sidecarLink.download = `${fileName}.metadata.json`
  sidecarLink.click()
  URL.revokeObjectURL(sidecarUrl)

  const origBlob = new Blob([new Uint8Array(data)])
  const origUrl = URL.createObjectURL(origBlob)
  const origLink = document.createElement("a")
  origLink.href = origUrl
  origLink.download = fileName
  origLink.click()
  URL.revokeObjectURL(origUrl)

  return fileName
}

export async function clearDoc(filePath: string, fileName: string): Promise<Uint8Array> {
  const data = getFileData(filePath)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const sidecarJson = JSON.stringify(
    {
      documentProperties: {
        title: "", subject: "", creator: "", keywords: "", description: "",
        lastModifiedBy: "", category: "", contentStatus: "", version: "",
      },
      coreProperties: {
        dcTitle: "", dcSubject: "", dcCreator: "", dcDescription: "",
        dcKeywords: "",
      },
    },
    null,
    2,
  )

  const sidecarBlob = new Blob([sidecarJson], { type: "application/json" })
  const sidecarUrl = URL.createObjectURL(sidecarBlob)
  const sidecarLink = document.createElement("a")
  sidecarLink.href = sidecarUrl
  sidecarLink.download = `${fileName}.metadata.json`
  sidecarLink.click()
  URL.revokeObjectURL(sidecarUrl)

  const origBlob = new Blob([new Uint8Array(data)])
  const origUrl = URL.createObjectURL(origBlob)
  const origLink = document.createElement("a")
  origLink.href = origUrl
  origLink.download = fileName
  origLink.click()
  URL.revokeObjectURL(origUrl)

  // doc 无法在浏览器内真正清理:回写原始字节(语义上无操作),下游按 unverifiable 处理。
  setFileData(filePath, data)
  return data
}
