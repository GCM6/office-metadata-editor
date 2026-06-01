export type SeoIntent =
  | "transactional"
  | "commercial"
  | "informational"
  | "mixed"

export type SeoPageType =
  | "home"
  | "category"
  | "tool-detail"
  | "blog-hub"
  | "blog-post"
  | "faq"

export interface SeoPageContract {
  pageCode: string

  path: string

  level: 1 | 2 | 3

  pageType: SeoPageType

  primaryKeyword: string

  keywordMetrics?: {
    ahrefsKd: number
    semrushKd: number
    goldenScore: number
  }

  secondaryKeywords: string[]

  intent: SeoIntent

  serpPageType: SeoPageType

  indexable: boolean

  parentPageCode?: string

  title: string

  description: string

  keywords?: string[]

  h1: string

  canonical: string

  alternates?: Record<string, string>

  og?: {
    title: string
    description: string
    image: string
  }

  schemaTypes?: Array<
    | "Organization"
    | "WebSite"
    | "BreadcrumbList"
    | "Product"
    | "FAQPage"
    | "Article"
    | "ItemList"
  >

  internalLinksTo: string[]

  paaQuestions?: string[]

  status: "draft" | "ready" | "published"
  en?: Partial<Pick<SeoPageContract, "title" | "description" | "keywords" | "h1" | "og" | "paaQuestions">>
}
