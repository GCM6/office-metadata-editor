import { seoMap } from "./seo-map"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://officemetadata-editor.vercel.app"
const SITE_NAME = "Office元数据编辑器"

export interface JsonLdData {
  "@context": string
  "@type": string
  [key: string]: unknown
}

export function generateJsonLd(pageCode: string): JsonLdData[] {
  const seo = seoMap[pageCode]

  if (!seo || seo.status !== "published") {
    return []
  }

  const result: JsonLdData[] = []

  if (seo.schemaTypes?.includes("Organization")) {
    result.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      description: seo.description,
    })
  }

  if (seo.schemaTypes?.includes("WebSite")) {
    result.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: seo.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    })
  }

  if (seo.schemaTypes?.includes("BreadcrumbList") && seo.parentPageCode) {
    result.push(buildBreadcrumbList(seo.parentPageCode, seo.path, seo.h1))
  }

  if (
    seo.schemaTypes?.includes("FAQPage") &&
    seo.paaQuestions &&
    seo.paaQuestions.length > 0
  ) {
    result.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.paaQuestions.map((question) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: question,
        },
      })),
    })
  }

  if (seo.schemaTypes?.includes("Article") && seo.pageType === "blog-post") {
    result.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: seo.title,
      description: seo.description,
      url: `${SITE_URL}${seo.canonical}`,
    })
  }

  return result
}

function buildBreadcrumbList(
  parentPageCode: string,
  currentPath: string,
  currentName: string
): JsonLdData {
  const parent = seoMap[parentPageCode]
  const items: Array<{
    "@type": string
    position: number
    name: string
    item: string
  }> = []

  items.push({
    "@type": "ListItem",
    position: 1,
    name: "首页",
    item: SITE_URL,
  })

  if (parent) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: parent.h1,
      item: `${SITE_URL}${parent.path}`,
    })
    items.push({
      "@type": "ListItem",
      position: 3,
      name: currentName,
      item: `${SITE_URL}${currentPath}`,
    })
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: currentName,
      item: `${SITE_URL}${currentPath}`,
    })
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  }
}
