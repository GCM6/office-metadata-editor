import React from "react"
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
        <span>保存</span>
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
            <span>另存为</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={clearMetadata}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>清理元数据</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={resetToOriginal} disabled={!hasChanges}>
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>重置为原始</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default OmEditorToolbar
