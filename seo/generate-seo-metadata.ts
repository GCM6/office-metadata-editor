import type { Metadata } from "next"
import { seoMap } from "./seo-map"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"
const SITE_NAME = "MetaDocu"

export function generateSeoMetadata(pageCode: string, locale?: string): Metadata {
  const seo = seoMap[pageCode]

  const isEn = locale === "en"

  if (!seo || seo.status !== "published") {
    return {
      title: isEn ? `${SITE_NAME} - Free Online Office Metadata Editor` : `${SITE_NAME} - 免费在线Office元数据编辑工具`,
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

  const title = (isEn ? seo.en?.title : seo.title) || seo.title
  const description = (isEn ? seo.en?.description : seo.description) || seo.description
  const keywords = (isEn ? seo.en?.keywords : seo.keywords) || seo.keywords

  const canonicalUrl = `${SITE_URL}${seo.canonical}`

  const ogTitle = (isEn ? (seo.en?.og?.title ?? seo.en?.title) : (seo.og?.title ?? seo.title)) || seo.title
  const ogDescription = (isEn ? (seo.en?.og?.description ?? seo.en?.description) : (seo.og?.description ?? seo.description)) || seo.description

  const metadata: Metadata = {
    title,
    description,
    keywords,

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
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: seo.og?.image ? [seo.og.image] : [`${SITE_URL}/og-default.png`],
      type: seo.pageType === "blog-post" ? "article" : "website",
      locale: isEn ? "en_US" : "zh_CN",
    },

    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: seo.og?.image ? [seo.og.image] : [`${SITE_URL}/og-default.png`],
    },

    other: {},
  }

  return metadata
}
