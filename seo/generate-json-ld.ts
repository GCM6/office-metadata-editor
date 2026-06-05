import { seoMap } from "./seo-map"
import { questionToKey } from "./faq-keys"
import zhMessages from "../messages/zh-CN.json"
import enMessages from "../messages/en.json"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"
const SITE_NAME = "Office元数据编辑器"

const messagesMap: Record<string, typeof zhMessages> = {
  "zh-CN": zhMessages,
  en: enMessages as unknown as typeof zhMessages,
}

export interface JsonLdData {
  "@context": string
  "@type": string
  [key: string]: unknown
}

export function generateJsonLd(pageCode: string, locale: string = "zh-CN"): JsonLdData[] {
  const seo = seoMap[pageCode]

  if (!seo || seo.status !== "published") {
    return []
  }

  const result: JsonLdData[] = []

  const messages = messagesMap[locale] || messagesMap["zh-CN"]

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

  if (seo.schemaTypes?.includes("FAQPage")) {
    if (pageCode === "home") {
      const homeFaqItems = messages.home?.faqItems || []
      if (homeFaqItems.length > 0) {
        result.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        })
      }
    } else {
      const questions = (locale === "en" && seo.en?.paaQuestions) ? seo.en.paaQuestions : seo.paaQuestions
      if (questions && questions.length > 0) {
        const faqQuestions = (messages.seo?.faqQuestions as Record<string, string>) || {}
        const faqAnswers = (messages.seo?.faqAnswers as Record<string, string>) || {}

        result.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions.map((question) => {
            const key = questionToKey(question)
            const qText = faqQuestions[key] || question
            const aText = faqAnswers[key] || ""
            return {
              "@type": "Question",
              name: qText,
              acceptedAnswer: {
                "@type": "Answer",
                text: aText,
              },
            }
          }),
        })
      }
    }
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
