import type { Metadata } from "next"
import { seoMap } from "./seo-map"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://officemetadata-editor.vercel.app"
const SITE_NAME = "Office元数据编辑器"

export function generateSeoMetadata(pageCode: string): Metadata {
  const seo = seoMap[pageCode]

  if (!seo || seo.status !== "published") {
    return {
      title: `${SITE_NAME} - 免费在线Office元数据编辑工具`,
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    }
  }

  const canonicalUrl = `${SITE_URL}${seo.canonical}`

  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: seo.alternates
        ? Object.fromEntries(
            Object.entries(seo.alternates).map(([lang, path]) => [
              lang,
              `${SITE_URL}${path}`,
            ])
          )
        : undefined,
    },

    robots: {
      index: seo.indexable,
      follow: seo.indexable,
      googleBot: {
        index: seo.indexable,
        follow: seo.indexable,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title: seo.og?.title ?? seo.title,
      description: seo.og?.description ?? seo.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: seo.og?.image ? [seo.og.image] : [`${SITE_URL}/og-default.png`],
      type: seo.pageType === "blog-post" ? "article" : "website",
      locale: "zh_CN",
    },

    twitter: {
      card: "summary_large_image",
      title: seo.og?.title ?? seo.title,
      description: seo.og?.description ?? seo.description,
      images: seo.og?.image ? [seo.og.image] : [`${SITE_URL}/og-default.png`],
    },

    other: {},
  }

  return metadata
}
