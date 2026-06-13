"use client"

import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { seoMap } from "../seo-map"

const ANCHOR_TEXT_MAP: Record<string, { en: string; zh: string }> = {
  "tool.word": {
    en: "Edit Word Metadata Online",
    zh: "在线修改 Word 文档属性",
  },
  "tool.excel": {
    en: "Edit Excel Metadata Online",
    zh: "在线修改 Excel 工作簿属性",
  },
  "tool.pdf": {
    en: "Edit PDF Metadata Online",
    zh: "在线修改 PDF 文档属性",
  },
}

export function RelatedLinks({ currentPageCode }: { currentPageCode: string }) {
  const currentSeo = seoMap[currentPageCode]
  const t = useTranslations("seo")
  const locale = useLocale()
  const isEn = locale === "en"

  if (!currentSeo || !currentSeo.internalLinksTo.length) return null

  const targets = currentSeo.internalLinksTo
    .map((targetCode) => {
      const target = seoMap[targetCode]
      if (!target || target.status !== "published" || !target.indexable) return undefined
      return target
    })
    .filter((t): t is NonNullable<typeof t> => t != null)

  if (targets.length === 0) return null

  return (
    <div className="related-links rounded-lg border border-border/60 bg-muted/40 p-6">
      <h4 className="text-sm font-semibold text-foreground mb-3">{t("relatedToolsTitle")}</h4>
      <div className="flex flex-wrap gap-3">
        {targets.map((target) => {
          const anchorText = isEn
            ? (ANCHOR_TEXT_MAP[target.pageCode]?.en ?? target.en?.h1 ?? target.primaryKeyword)
            : (ANCHOR_TEXT_MAP[target.pageCode]?.zh ?? target.primaryKeyword)
          return (
            <Link
              key={target.pageCode}
              href={target.path}
              className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
            >
              {anchorText}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
