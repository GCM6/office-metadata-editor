"use client"

import React, { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useMetadata } from "@/contexts/metadata-context"
import { useFileContext } from "@/contexts/file-context"
import { OmEditorToolbar } from "@/components/om/om-editor-toolbar"
import { normalizeDocumentFileType } from "@/lib/documents/file-type"
import { EditorLayout } from "@/layouts/editor-layout"
import { SidebarInset } from "@/components/ui/sidebar"
import { EditorPageSidebar } from "@/page-components/editor-page/components/editor-page-sidebar"
import { EditorPageForm } from "@/page-components/editor-page/components/editor-page-form"
import { EditorPageSkeleton } from "@/page-components/editor-page/components/editor-page-skeleton"
import { resolveMetadataPreviewGroups } from "@/lib/documents/metadata"

export default function EditorPage() {
  const router = useRouter()

  const { metadata, documents } = useMetadata()
  const { files, activeFileId, selectFile, removeFile, openFiles, isLoading } = useFileContext()
  const locale = useLocale()

  const activeFile = useMemo(() => {
    if (files.length === 0) return null
    if (!activeFileId) return files[0]
    return files.find(item => item.id === activeFileId) ?? files[0]
  }, [files, activeFileId])

  const activeFileType = useMemo(() => {
    return normalizeDocumentFileType(
      metadata?.fileType || activeFile?.filePath.split(".").pop() || "",
    )
  }, [metadata, activeFile])

  const previewGroups = useMemo(() => {
    if (!metadata) return []
    return resolveMetadataPreviewGroups(activeFileType, metadata, locale)
  }, [activeFileType, metadata, locale])

  useEffect(() => {
    if (!isLoading && files.length === 0) {
      router.push("/")
    }
  }, [files.length, isLoading, router])

  return (
    <EditorLayout actions={<OmEditorToolbar />}>
      <EditorPageSidebar
        files={files}
        documents={documents}
        activeFileId={activeFileId}
        onOpenFiles={() => void openFiles()}
        onSelectFile={selectFile}
        onRemoveFile={removeFile}
      />
      <SidebarInset className="min-h-0">
        {activeFile?.status === "ready" ? (
          <EditorPageForm fileType={activeFileType} previewGroups={previewGroups} />
        ) : (
          <EditorPageSkeleton />
        )}
      </SidebarInset>
    </EditorLayout>
  )
}
