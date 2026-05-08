import React from "react"
import { FileText, FileSpreadsheet, Presentation } from "lucide-react"

export interface OmFileTypeIconProps {
  type: string
  className?: string
}

export const OmFileTypeIcon: React.FC<OmFileTypeIconProps> = ({ type, className = "" }) => {
  const iconProps = {
    className: `h-5 w-5 ${className}`,
  }

  switch (type) {
    case "docx":
    case "doc":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
          <FileText className="h-5 w-5 text-blue-500" />
        </div>
      )
    case "xlsx":
    case "xls":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
          <FileSpreadsheet className="h-5 w-5 text-green-500" />
        </div>
      )
    case "pptx":
    case "ppt":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
          <Presentation className="h-5 w-5 text-orange-500" />
        </div>
      )
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <FileText {...iconProps} />
        </div>
      )
  }
}

export default OmFileTypeIcon
