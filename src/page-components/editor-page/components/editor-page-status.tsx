"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { OmPropertyPreview } from "@/components/om/om-property-preview"
import type { DocumentFileType } from "@/types/metadata"

export interface EditorPageUnsupportedStatusProps {
  fileType: DocumentFileType
}

export const EditorPageUnsupportedStatus: React.FC<EditorPageUnsupportedStatusProps> = ({
  fileType,
}) => {
  const t = useTranslations("editor")

  return (
    <div className="flex h-full items-center justify-center p-6">
      <OmPropertyPreview
        title={t("notSupported")}
        properties={[
          {
            label: t("fileType"),
            value: fileType,
            span: 2,
          },
        ]}
      />
    </div>
  )
}

export default EditorPageUnsupportedStatus
