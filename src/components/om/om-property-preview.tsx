import React from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OmPropertyPreviewList, OmPropertyPreviewItem } from "@/components/om/om-property-preview-item"

export type OmProperty = {
  key?: string
  label: string
  value: string
  span?: 1 | 2
}

export type OmPropertyPreviewProps = {
  id?: string
  title: string
  properties: OmProperty[]
}

export const OmPropertyPreview: React.FC<OmPropertyPreviewProps> = ({ id, title, properties }) => {
  const tf = useTranslations("fields")
  const translatedTitle = id ? tf(`sections.${id}.title`, { defaultValue: title }) : title

  return (
    <Card
      size="sm"
      className="rounded-lg border border-border/50 bg-background/55 shadow-none backdrop-blur-[2px]"
    >
      <CardHeader className="pb-1.5">
        <CardTitle className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">
          {translatedTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-40 pt-0 pr-1">
        <OmPropertyPreviewList>
          {properties.map(item => {
            const translatedLabel = item.key ? tf(`labels.${item.key}`, { defaultValue: item.label }) : item.label
            return (
              <OmPropertyPreviewItem
                key={item.key || item.label}
                label={translatedLabel}
                value={item.value}
                span={item.span}
              />
            )
          })}
        </OmPropertyPreviewList>
      </CardContent>
    </Card>
  )
}

export default OmPropertyPreview
