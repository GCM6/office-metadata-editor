import Link from "next/link"
import { seoMap } from "../seo-map"

export function RelatedLinks({ currentPageCode }: { currentPageCode: string }) {
  const currentSeo = seoMap[currentPageCode]
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
      <h4 className="text-sm font-semibold text-foreground mb-3">相关工具推荐</h4>
      <div className="flex flex-wrap gap-3">
        {targets.map((target) => (
          <Link
            key={target.pageCode}
            href={target.path}
            className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
          >
            {target.primaryKeyword}
          </Link>
        ))}
      </div>
    </div>
  )
}
