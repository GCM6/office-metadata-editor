import { PDFDocument, PDFName } from "pdf-lib"
import type { DocumentMetadata } from "@/types/metadata"
import { getFileData } from "@/lib/resources/file-store"

export async function showPdf(fileId: string, fileName: string): Promise<DocumentMetadata> {
  const data = getFileData(fileId)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const doc = await PDFDocument.load(data, { ignoreEncryption: true })

  return {
    fileName,
    fileType: "pdf",
    fileSize: data.byteLength,
    documentProperties: {
      title: doc.getTitle() ?? "",
      subject: doc.getSubject() ?? "",
      creator: doc.getAuthor() ?? "",
      keywords: doc.getKeywords() ?? "",
      description: doc.getSubject() ?? "",
      lastModifiedBy: "",
      revision: "1",
      created: "",
      modified: "",
      category: "",
      contentStatus: "",
      version: "",
      language: "",
      identifier: "",
      source: "",
    },
    coreProperties: {
      dcTitle: doc.getTitle() ?? "",
      dcSubject: doc.getSubject() ?? "",
      dcCreator: doc.getAuthor() ?? "",
      dcDescription: doc.getSubject() ?? "",
      dcKeywords: doc.getKeywords() ?? "",
      dcLanguage: "",
      dcIdentifier: "",
      dcSource: "",
    },
    appProperties: {
      application: "",
      appVersion: "",
      company: "",
      manager: "",
      template: "",
      totalTime: "0",
      pages: doc.getPageCount(),
      words: 0,
      characters: 0,
      charactersWithSpaces: 0,
      paragraphs: 0,
      lines: 0,
    },
  }
}

export async function replacePdf(
  fileId: string,
  fileName: string,
  metadata: DocumentMetadata,
): Promise<string> {
  const data = getFileData(fileId)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const doc = await PDFDocument.load(data, { ignoreEncryption: true })

  doc.setTitle(metadata.documentProperties.title)
  doc.setSubject(metadata.documentProperties.description)
  doc.setAuthor(metadata.documentProperties.creator)
  doc.setKeywords(metadata.documentProperties.keywords.split(", ").filter(Boolean))

  const pdfBytes = await doc.save()

  const blob = new Blob([new Uint8Array(pdfBytes)])
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)

  return fileName
}

export async function clearPdf(filePath: string, fileName: string): Promise<string> {
  const data = getFileData(filePath)
  if (!data) {
    throw new Error(`文件数据未找到: ${fileName}`)
  }

  const doc = await PDFDocument.load(data, { ignoreEncryption: true, updateMetadata: false })
  doc.setTitle("")
  doc.setSubject("")
  doc.setAuthor("")
  doc.setKeywords([])
  doc.setProducer("")
  doc.setCreator("")

  // 从 Info 字典中移除日期，避免泄露文档创建/修改时间
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
  const blob = new Blob([new Uint8Array(pdfBytes)])
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)

  return fileName
}
