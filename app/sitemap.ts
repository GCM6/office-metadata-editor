import type { MetadataRoute } from "next"
import { getPublishedPages } from "@/seo/seo-map"
import { getLandingPage } from "@/lib/seo-data/landing-pages"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"

// Stable last-modified for pages without their own content `updated` date.
// Bump this when the site's core templates/content change — do NOT use
// `new Date()` here: emitting "now" for every URL on every build makes Google
// distrust the sitemap's lastmod signal entirely.
const SITE_LAST_MODIFIED = "2026-06-29"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getPublishedPages()

  return pages.map((page) => {
    // Default: other level-2/3 landing/comparison/guide pages → medium priority.
    let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"
    let priority = 0.7

    if (page.path === "/") {
      changeFrequency = "weekly"
      priority = 1.0
    } else if (["/tools/word", "/tools/excel", "/tools/pdf"].includes(page.path)) {
      changeFrequency = "monthly"
      priority = 0.9
    } else if (page.path === "/blog") {
      changeFrequency = "weekly"
      priority = 0.7
    } else if (page.path === "/about") {
      changeFrequency = "yearly"
      priority = 0.5
    }

    const lastModified = getLandingPage(page.pageCode)?.updated ?? SITE_LAST_MODIFIED

    return {
      url: `${SITE_URL}${page.path}`,
      lastModified,
      changeFrequency,
      priority,
    }
  })
}
