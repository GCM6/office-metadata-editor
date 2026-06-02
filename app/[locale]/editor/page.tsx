"use client"

import React, { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useMetadata } from "@/contexts/metadata-context"
import { useFileContext } from "@/contexts/file-context"
import { OmEditorToolbar } from "@/components/om/om-editor-toolbar"
import { normalizeDocumentFileType } from "@/lib/documents/file-type"
import { EditorLayout } from "@/components/layouts/editor-layout"
import { SidebarInset } from "@/components/ui/sidebar"
import { EditorPageSidebar } from "./_components/editor-page-sidebar"
import { EditorPageForm } from "./_components/editor-page-form"
import { EditorPageSkeleton } from "./_components/editor-page-skeleton"
import { resolveMetadataPreviewGroups } from "@/lib/documents/metadata"
import { seoMap } from "@/seo/seo-map"

export default function EditorPage() {
  console.log("zs");

  const router = useRouter()

  const { metadata, documents } = useMetadata()
  const { files, activeFileId, selectFile, removeFile, openFiles, isLoading } = useFileContext()
  const locale = useLocale()

  const isEn = locale === "en"
  const h1Text = isEn ? (seoMap.editor.en?.h1 || seoMap.editor.h1) : seoMap.editor.h1

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
        <h1 className="sr-only">{h1Text}</h1>
        {activeFile?.status === "ready" ? (
          <EditorPageForm fileType={activeFileType} previewGroups={previewGroups} />
        ) : (
          <EditorPageSkeleton />
        )}
      </SidebarInset>
    </EditorLayout>
  )
}

