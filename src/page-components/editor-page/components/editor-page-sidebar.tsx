"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import type { FileEntry } from "@/contexts/file-context"
import type { LoadedDocument } from "@/contexts/metadata-context"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { FilePlus2, FileText, X } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

export interface EditorPageSidebarProps {
  files: FileEntry[]
  documents: LoadedDocument[]
  activeFileId: string | null
  onOpenFiles(): void
  onSelectFile(fileId: string): void
  onRemoveFile(fileId: string): void
}

export const EditorPageSidebar: React.FC<EditorPageSidebarProps> = ({
  files,
  documents,
  activeFileId,
  onOpenFiles,
  onSelectFile,
  onRemoveFile,
}) => {
  const t = useTranslations("editor")
  const documentMap = useMemo(() => {
    return new Map(documents.map(item => [item.id, item]))
  }, [documents])

  return (
    <Sidebar
      collapsible="icon"
      className="top-22 bottom-0 h-auto"
    >
      <SidebarHeader className="gap-1.5 px-2 pt-6 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full justify-start gap-1.5 rounded-lg bg-background/80 shadow-xs group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          onClick={onOpenFiles}
        >
          <FilePlus2 className="h-4 w-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">{t("addFile")}</span>
        </Button>
      </SidebarHeader>
      <SidebarSeparator className="m-0" />
      <SidebarContent>
        <SidebarGroup className="px-2 py-1.5">
          <SidebarGroupLabel>{t("fileList")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {files.map(item => {
                const doc = documentMap.get(item.id)
                if (!doc) return null
                const {fileName} = doc.metadata
                const {hasChanges} = doc
                const {modified} = doc.metadata.documentProperties
                const {created} = doc.metadata.documentProperties
                const displayTime = formatRelativeTime(modified || created)

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeFileId === item.id}
                      tooltip={`${fileName}\n${displayTime}`}
                      onClick={() => onSelectFile(item.id)}
                      className="relative h-auto min-h-12 items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 pr-9 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:min-h-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:p-0 hover:bg-sidebar-accent/70 data-[active=true]:border-primary/35 data-[active=true]:bg-primary/10 data-[active=true]:text-foreground data-[active=true]:hover:bg-primary/12"
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                        <div className="truncate pr-1 text-sm font-medium">{fileName}</div>
                        {hasChanges ? (
                          <div className="truncate pr-1 text-xs text-primary">{t("unsavedChanges")}</div>
                        ) : (
                          <div className="truncate pr-1 text-xs text-muted-foreground">
                            {displayTime}
                          </div>
                        )}
                        {item.status !== "ready" && (
                          <div className="truncate pr-1 text-xs text-muted-foreground">
                            {item.progressMessage}
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      aria-label={t("removeFile", { fileName })}
                      className="top-1.5 right-1.5 rounded-md text-muted-foreground peer-data-active/menu-button:text-muted-foreground hover:bg-destructive/12 hover:text-destructive"
                      onClick={event => {
                        event.stopPropagation()
                        onRemoveFile(item.id)
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default EditorPageSidebar
