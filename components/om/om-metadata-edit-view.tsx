import React from "react"
import { OmMetadataEditor } from "@/components/om/om-metadata-editor"
import { OmPropertyPreview } from "@/components/om/om-property-preview"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DocumentFileType, MetadataPreviewGroup } from "@/types/metadata"

export interface OmMetadataEditViewProps {
  fileType: DocumentFileType
  previewGroups: MetadataPreviewGroup[]
}

export const OmMetadataEditView: React.FC<OmMetadataEditViewProps> = ({ fileType, previewGroups }) => {
  return (
    <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden p-2 gap-4 lg:gap-2">
      <ScrollArea className="min-w-0 flex-1 lg:flex-3 lg:pr-2">
        <OmMetadataEditor fileType={fileType} />
      </ScrollArea>
      <div className="flex w-full lg:w-60 lg:shrink-0 flex-col gap-4 overflow-hidden mt-2 lg:mt-0">
        {previewGroups.map(group => (
          <OmPropertyPreview key={group.id} id={group.id} title={group.title} properties={group.properties as any} />
        ))}
      </div>
    </div>
  )
}

export default OmMetadataEditView
