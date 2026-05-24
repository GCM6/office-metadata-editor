/**
 * SEO 搜索意图
 *
 * - informational: 信息型（用户想了解某事物）
 * - transactional: 交易型（用户想执行某个操作）
 * - navigational: 导航型（用户想找到特定页面）
 */
export type SeoIntent = "informational" | "transactional" | "navigational"

/**
 * Open Graph 页面类型
 * 影响社交分享卡片的展示形式
 */
export type SeoPageType = "website" | "article"

/**
 * JSON-LD Schema 类型
 * 支持的结构化数据类型
 */
export type SchemaType =
  | "Organization"
  | "WebSite"
  | "BreadcrumbList"
  | "FAQPage"
  | "Article"

/**
 * 语言替代链接
 */
export interface SeoAlternates {
  /** 多语言页面映射，key 为 locale，value 为完整 URL */
  languages?: Record<string, string>
}

/**
 * SEO 页面契约
 *
 * 每个页面通过声明此契约来描述自身的 SEO 元数据需求，
 * 由生成器统一转换为 Next.js Metadata 和 JSON-LD。
 */
export interface SeoPageContract {
  /** 页面唯一标识，用于在 seoMap 中索引 */
  pageCode: string
  /** Open Graph 页面类型 */
  pageType: SeoPageType
  /** 搜索意图 */
  intent: SeoIntent
  /** 页面路径（不含域名） */
  path: string
  /** 页面标题（用于 <title> 和 og:title） */
  title: string
  /** 页面描述（用于 <meta name="description"> 和 og:description） */
  description: string
  /** 页面关键词（用于 <meta name="keywords">） */
  keywords?: string[]
  /** OG 分享图片路径（相对于 public/ 的路径） */
  ogImage?: string
  /** OG 分享图片的 alt 文本 */
  ogImageAlt?: string
  /** 自定义 Canonical URL（不指定则根据 path 自动拼接） */
  canonical?: string
  /** 是否禁止搜索引擎索引 */
  noIndex?: boolean
  /** 需要生成的 JSON-LD Schema 类型列表 */
  schemaTypes: SchemaType[]
  /** 多语言/多地区替代链接 */
  alternates?: SeoAlternates
}

/**
 * SEO Map 类型：pageCode → SeoPageContract 的映射表
 */
export type SeoMap = Record<string, SeoPageContract>

/**
 * Next.js Metadata robots 配置
 */
export interface SeoRobotsConfig {
  index: boolean
  follow: boolean
  googleBot?: {
    index: boolean
    follow: boolean
  }
}
