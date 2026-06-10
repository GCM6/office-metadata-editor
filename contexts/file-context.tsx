import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { open } from "@tauri-apps/plugin-dialog"
import { isTauri } from "@tauri-apps/api/core"
import { OPEN_FILE_DIALOG_FILTER } from "@/lib/documents/supported-formats"
import { openWebFilePicker } from "@/lib/web-file-picker"
import { clearFileStore, setFileData } from "@/lib/resources/file-store"

export type FileStatus = "idle" | "reading" | "ready" | "processing" | "error"

export interface FileEntry {
  id: string
  filePath: string
  fileName: string
  status: FileStatus
  progressMessage: string
  error?: string
}

export interface FileContextValue {
  files: FileEntry[]
  activeFileId: string | null
  isLoading: boolean
  openFiles(options?: OpenFilesOptions): Promise<number>
  selectFile(fileId: string): void
  removeFile(fileId: string): void
  clearFiles(): void
  updateFileStatus(fileId: string, patch: Partial<Omit<FileEntry, "id" | "filePath">>): void
}

export interface OpenFilesOptions {
  /** Restrict the picker (and accepted results) to these extensions, e.g. ["docx", "doc"]. */
  extensions?: readonly string[]
}

const FileContext = createContext<FileContextValue | null>(null)

export const FileProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const tp = useTranslations("progress")

  const openFiles = useCallback(async (options?: OpenFilesOptions): Promise<number> => {
    const allowedExtensions = options?.extensions
      ? new Set(options.extensions.map(ext => ext.toLowerCase()))
      : null
    const acceptAttr = options?.extensions
      ? options.extensions.map(ext => `.${ext}`).join(",")
      : undefined

    setIsLoading(true)
    try {
      if (!isTauri()) {
        const entries = await openWebFilePicker(acceptAttr)
        if (entries.length === 0) return 0

        const existingNameSet = new Set(files.map(item => item.fileName))
        const addedFiles: FileEntry[] = []

        for (const entry of entries) {
          if (existingNameSet.has(entry.fileName)) continue
          if (allowedExtensions) {
            const ext = entry.fileName.split(".").pop()?.toLowerCase() ?? ""
            if (!allowedExtensions.has(ext)) continue
          }
          existingNameSet.add(entry.fileName)

          const id = crypto.randomUUID()
          const filePath = entry.fileName
          setFileData(filePath, entry.data)

          addedFiles.push({
            id,
            filePath,
            fileName: entry.fileName,
            status: "idle",
            progressMessage: tp("pending"),
          })
        }

        if (addedFiles.length === 0) {
          if (!activeFileId && files[0]) {
            setActiveFileId(files[0].id)
          }
          return 0
        }

        setFiles(prev => [...prev, ...addedFiles])
        setActiveFileId(prev => prev ?? addedFiles[0]?.id ?? null)
        return addedFiles.length
      }

      const selected = await open({
        multiple: true,
        filters: [
          allowedExtensions
            ? { name: OPEN_FILE_DIALOG_FILTER.name, extensions: [...allowedExtensions] }
            : OPEN_FILE_DIALOG_FILTER,
        ],
      })

      if (!selected) return 0
      const selectedPaths = Array.isArray(selected) ? selected : [selected]
      if (selectedPaths.length === 0) return 0

      const existingPathSet = new Set(files.map(item => item.filePath))
      const pathsToLoad = selectedPaths.filter(path => {
        if (existingPathSet.has(path)) return false
        if (allowedExtensions) {
          const ext = path.split(".").pop()?.toLowerCase() ?? ""
          if (!allowedExtensions.has(ext)) return false
        }
        return true
      })
      if (pathsToLoad.length === 0) {
        if (!activeFileId && files[0]) {
          setActiveFileId(files[0].id)
        }
        return 0
      }

      const addedFiles: FileEntry[] = pathsToLoad.map(filePath => ({
        id: crypto.randomUUID(),
        filePath,
        fileName: filePath.split(/[\\/]/).filter(Boolean).pop() ?? filePath,
        status: "idle",
        progressMessage: tp("pending"),
      }))

      setFiles(prev => [...prev, ...addedFiles])
      setActiveFileId(prev => prev ?? addedFiles[0]?.id ?? null)
      return addedFiles.length
    } catch (error) {
      console.error("选择文件失败:", error)
      return 0
    } finally {
      setIsLoading(false)
    }
  }, [activeFileId, files, tp])

  const selectFile = useCallback((fileId: string) => {
    setActiveFileId(fileId)
  }, [])

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const removeIndex = prev.findIndex(item => item.id === fileId)
      if (removeIndex < 0) return prev

      const next = prev.filter(item => item.id !== fileId)

      setActiveFileId(currentActiveId => {
        if (currentActiveId !== fileId) return currentActiveId
        if (next.length === 0) return null
        const fallbackIndex = Math.min(removeIndex, next.length - 1)
        return next[fallbackIndex]?.id ?? null
      })

      return next
    })
  }, [])

  const clearFiles = useCallback(() => {
    if (!isTauri()) {
      clearFileStore()
    }
    setFiles([])
    setActiveFileId(null)
  }, [])

  const updateFileStatus = useCallback(
    (fileId: string, patch: Partial<Omit<FileEntry, "id" | "filePath">>) => {
      setFiles(prev =>
        prev.map(item =>
          item.id === fileId
            ? {
                ...item,
                ...patch,
              }
            : item,
        ),
      )
    },
    [],
  )

  const value = useMemo<FileContextValue>(
    () => ({
      files,
      activeFileId,
      isLoading,
      openFiles,
      selectFile,
      removeFile,
      clearFiles,
      updateFileStatus,
    }),
    [
      files,
      activeFileId,
      isLoading,
      openFiles,
      selectFile,
      removeFile,
      clearFiles,
      updateFileStatus,
    ],
  )

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>
}

export function useFileContext(): FileContextValue {
  const context = useContext(FileContext)
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider")
  }
  return context
}

export default FileProvider
