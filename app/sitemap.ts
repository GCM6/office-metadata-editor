import type { MetadataRoute } from "next"
import { getPublishedPages } from "@/seo/seo-map"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://officemetadata-editor.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getPublishedPages()

  return pages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency:
      page.pageType === "home"
        ? "weekly"
        : page.pageType === "blog-post"
          ? "monthly"
          : "weekly",
    priority:
      page.level === 1
        ? 1.0
        : page.level === 2
          ? 0.8
          : 0.5,
  }))
}
