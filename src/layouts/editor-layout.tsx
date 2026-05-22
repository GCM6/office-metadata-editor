import React from "react"
import { useMetadata } from "@/contexts/metadata-context"
import { OmFileTypeIcon } from "@/components/om/om-file-type-icon"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PageLayout } from "@/layouts/page-layout"
import { formatFileSize } from "@/lib/utils"

export interface EditorLayoutProps {
  actions?: React.ReactNode
}

export const EditorLayout: React.FC<React.PropsWithChildren<EditorLayoutProps>> = ({
  children,
  actions,
}) => {
  const { metadata, hasChanges } = useMetadata()
  const resolvedMetadata = metadata!

  const {fileType} = resolvedMetadata
  const {fileName} = resolvedMetadata
  const {fileSize} = resolvedMetadata

  return (
    <SidebarProvider className="h-screen" defaultOpen>
      <PageLayout
        backTo="/"
        header={
          <div className="flex items-center gap-2" data-tauri-drag-region>
            <OmFileTypeIcon type={fileType} />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-foreground">{fileName}</span>
              <span className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</span>
            </div>
            {hasChanges && (
              <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                未保持
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
