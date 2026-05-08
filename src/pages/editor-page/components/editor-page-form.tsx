import React from "react"
import { OmMetadataEditView } from "@/components/om/om-metadata-edit-view"
import { EditorPageUnsupportedStatus } from "@/pages/editor-page/components/editor-page-status"
import type { DocumentFileType, MetadataPreviewGroup } from "@/types/metadata"

export interface EditorPageFormProps {
  fileType: DocumentFileType
  previewGroups: MetadataPreviewGroup[]
}

export const EditorPageForm: React.FC<EditorPageFormProps> = ({ fileType, previewGroups }) => {
  if (fileType === "unknown") {
    return <EditorPageUnsupportedStatus fileType={fileType} />
  }

  return <OmMetadataEditView fileType={fileType} previewGroups={previewGroups} />
}

export default EditorPageForm
