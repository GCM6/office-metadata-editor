"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useMetadata } from "@/contexts/metadata-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, MoreHorizontal, RotateCcw, Save, Trash2 } from "lucide-react"

export const OmEditorToolbar: React.FC = () => {
  const { hasChanges, clearMetadata, resetToOriginal, saveCurrent, saveCurrentAs } = useMetadata()
  const t = useTranslations("editor")

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="default"
        size="sm"
        onClick={() => void saveCurrent()}
        className="h-8 gap-1.5 rounded-lg"
        disabled={!hasChanges}
      >
        <Save className="h-4 w-4" />
        <span>{t("save")}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="rounded-lg">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => void saveCurrentAs()}>
            <Download className="mr-2 h-4 w-4" />
            <span>{t("saveAs")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={clearMetadata}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{t("clearMetadata")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={resetToOriginal} disabled={!hasChanges}>
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>{t("resetToOriginal")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default OmEditorToolbar
