import type { MetadataRoute } from "next"
import { getPublishedPages } from "@/seo/seo-map"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getPublishedPages()

  return pages.map((page) => {
    const isToolPage = ["/tools/word", "/tools/excel", "/tools/pdf"].includes(page.path)

    return {
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: isToolPage
        ? "monthly"
        : page.pageType === "home"
          ? "weekly"
          : page.pageType === "blog-post"
            ? "monthly"
            : "weekly",
      priority: isToolPage
        ? 0.9
        : page.pageType === "home"
          ? 1.0
          : page.level === 2
            ? 0.8
            : 0.5,
    }
  })
}
