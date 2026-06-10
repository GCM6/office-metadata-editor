import { seoMap } from "./seo-map"
import { questionToKey } from "./faq-keys"
import { getLandingPage } from "../lib/seo-data/landing-pages"
import { SITE_EMAIL, SITE_SAME_AS } from "../lib/app-config"
import zhMessages from "../messages/zh-CN.json"
import enMessages from "../messages/en.json"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"
const SITE_NAME = "MetaDocu"

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
      logo: `${SITE_URL}/logo.svg`,
      email: SITE_EMAIL,
      description: seo.description,
      // sameAs only emitted when real official profiles are configured (v2.md §D1)
      ...(SITE_SAME_AS.length > 0 ? { sameAs: SITE_SAME_AS } : {}),
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
    const localizedH1 = locale === "en" && seo.en?.h1 ? seo.en.h1 : seo.h1
    result.push(buildBreadcrumbList(seo.parentPageCode, seo.path, localizedH1, locale))
  }

  const landing = getLandingPage(pageCode)

  if (seo.schemaTypes?.includes("FAQPage") && landing && landing.faqs.length > 0) {
    result.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: landing.faqs.map((faq) => ({
        "@type": "Question",
        name: locale === "en" ? faq.q.en : faq.q.zh,
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "en" ? faq.a.en : faq.a.zh,
        },
      })),
    })
  } else if (seo.schemaTypes?.includes("FAQPage")) {
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
    const articleTitle = locale === "en" && seo.en?.title ? seo.en.title : seo.title
    const articleDesc = locale === "en" && seo.en?.description ? seo.en.description : seo.description
    result.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: articleTitle,
      description: articleDesc,
      url: `${SITE_URL}${seo.canonical}`,
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
      },
      ...(landing?.updated ? { dateModified: landing.updated } : {}),
    })
  }

  if (seo.schemaTypes?.includes("SoftwareApplication")) {
    const appName = locale === "en" && seo.en?.h1 ? seo.en.h1 : seo.h1
    const appDesc = locale === "en" && seo.en?.description ? seo.en.description : seo.description
    result.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: appName,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web (any browser)",
      url: `${SITE_URL}${seo.canonical}`,
      description: appDesc,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList:
        locale === "en"
          ? [
              "100% in-browser processing — no upload",
              "Scan, edit and remove Word/Excel/PDF metadata",
              "Remove author, company, timestamps, RSIDs and tracked changes",
              "After-clean verification report",
            ]
          : [
              "100% 浏览器本地处理——无需上传",
              "扫描、编辑并移除 Word/Excel/PDF 元数据",
              "清除作者、公司、时间戳、RSID 与修订痕迹",
              "清理后验证报告",
            ],
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    })
  }

  if (seo.schemaTypes?.includes("HowTo") && landing?.howTo) {
    result.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: locale === "en" ? landing.howTo.title.en : landing.howTo.title.zh,
      ...(landing.howTo.intro
        ? { description: locale === "en" ? landing.howTo.intro.en : landing.howTo.intro.zh }
        : {}),
      step: landing.howTo.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: locale === "en" ? s.title.en : s.title.zh,
        text: locale === "en" ? s.desc.en : s.desc.zh,
      })),
    })
  }

  return result
}

function buildBreadcrumbList(
  parentPageCode: string,
  currentPath: string,
  currentName: string,
  locale: string = "zh-CN"
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
    name: locale === "en" ? "Home" : "首页",
    item: SITE_URL,
  })

  if (parent) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: locale === "en" && parent.en?.h1 ? parent.en.h1 : parent.h1,
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
