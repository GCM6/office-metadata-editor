"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { FolderOpen, Save, Trash2, X } from "lucide-react"

export interface OmBatchToolbarProps {
  hasFiles: boolean
  isBusy?: boolean
  busyText?: string
  onAddFiles(): Promise<void> | void
  onBatchSave(): Promise<void> | void
  onBatchClearAndSave(): Promise<void> | void
  onClearAll(): void
}

export const OmBatchToolbar: React.FC<OmBatchToolbarProps> = ({
  hasFiles,
  isBusy = false,
  busyText,
  onAddFiles,
  onBatchSave,
  onBatchClearAndSave,
  onClearAll,
}) => {
  const t = useTranslations("batch")

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => void onAddFiles()}
        disabled={isBusy}
        className="gap-1 sm:gap-2 px-2 sm:px-3"
      >
        <FolderOpen className="h-4 w-4" />
        <span className="hidden sm:inline">{isBusy ? t("processing") : t("addFile")}</span>
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => void onBatchSave()}
        disabled={!hasFiles || isBusy}
        className="gap-1 sm:gap-2 px-2 sm:px-3"
      >
        <Save className="h-4 w-4" />
        <span className="hidden sm:inline">{t("saveAll")}</span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => void onBatchClearAndSave()}
        disabled={!hasFiles || isBusy}
        className="gap-1 sm:gap-2 px-2 sm:px-3"
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden sm:inline">{t("clearAndSaveAll")}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        disabled={!hasFiles || isBusy}
        className="gap-1 sm:gap-2 px-2 sm:px-3"
      >
        <X className="h-4 w-4" />
        <span className="hidden sm:inline">{t("clearList")}</span>
      </Button>
      {busyText && <span className="text-xs text-muted-foreground hidden md:inline">{busyText}</span>}
    </div>
  )
}

export default OmBatchToolbar
