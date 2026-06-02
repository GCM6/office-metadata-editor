"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useMetadata } from "@/contexts/metadata-context"
import { OmFileTypeIcon } from "@/components/om/om-file-type-icon"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PageLayout } from "@/components/layouts/page-layout"
import { formatFileSize } from "@/lib/utils"

export interface EditorLayoutProps {
  actions?: React.ReactNode
}

export const EditorLayout: React.FC<React.PropsWithChildren<EditorLayoutProps>> = ({
  children,
  actions,
}) => {
  const { metadata, hasChanges } = useMetadata()
  const t = useTranslations("editor")
  const resolvedMetadata = metadata!

  const {fileType} = resolvedMetadata
  const {fileName} = resolvedMetadata
  const {fileSize} = resolvedMetadata

  return (
    <SidebarProvider className="h-screen" defaultOpen>
      <PageLayout
        backTo="/"
        header={
          <div className="flex items-center gap-2 min-w-0" data-tauri-drag-region>
            <OmFileTypeIcon type={fileType} />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-sm font-medium text-foreground truncate max-w-25 xs:max-w-[180px] sm:max-w-xs md:max-w-md" title={fileName}>
                {fileName}
              </span>
              <span className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</span>
            </div>
            {hasChanges && (
              <span className="shrink-0 rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                {t("unsavedBadge")}
              </span>
            )}
          </div>
        }
        actions={actions}
        showSidebarTrigger
      >
        {children}
      </PageLayout>
    </SidebarProvider>
  )
}

export default EditorLayout
