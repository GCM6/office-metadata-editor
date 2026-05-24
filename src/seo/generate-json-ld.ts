import { SITE_NAME, SITE_URL } from "@/lib/app-config"
import { seoMap } from "./seo-map"
import type { SchemaType, SeoPageContract } from "./seo-types"

/** JSON-LD @context 常量 */
const JSON_LD_CONTEXT = "https://schema.org"

// ──── Schema 构建器 ────────────────────────────────────────────

function buildOrganization() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  }
}

function buildWebSite() {
  return {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

function buildBreadcrumbList(contract: SeoPageContract) {
  const pathSegments = contract.path.split("/").filter(Boolean)

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: SITE_NAME,
      item: SITE_URL,
    },
    ...pathSegments.map((segment, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      item: `${SITE_URL}/${pathSegments.slice(0, index + 1).join("/")}`,
    })),
  ]

  return {
    "@type": "BreadcrumbList",
    itemListElement,
  }
}

function buildFAQPage() {
  return {
    "@type": "FAQPage",
    mainEntity: [],
  }
}

function buildArticle(contract: SeoPageContract) {
  return {
    "@type": "Article",
    headline: contract.title,
    description: contract.description,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  }
}

// ──── Schema 分发器 ────────────────────────────────────────────

const schemaBuilders: Record<
  SchemaType,
  (contract: SeoPageContract) => object
> = {
  Organization: buildOrganization,
  WebSite: buildWebSite,
  BreadcrumbList: buildBreadcrumbList,
  FAQPage: buildFAQPage,
  Article: buildArticle,
}

// ──── 公共 API ──────────────────────────────────────────────────

/**
 * 最小 JSON-LD 片段：始终注入 Organization 和 WebSite（即使 seoMap 未声明）
 */
const BASE_SCHEMA_TYPES: SchemaType[] = ["Organization", "WebSite"]

/**
 * 根据 pageCode 生成 JSON-LD 结构化数据对象数组
 *
 * 始终注入 Organization 和 WebSite 作为基础 Schema，
 * 再根据 seoMap 中声明的 schemaTypes 追加页面特定的 Schema。
 *
 * @param pageCode - 页面唯一标识，对应 seoMap 中的 key
 * @returns JSON-LD 对象数组；若 pageCode 不存在则返回仅含基础 Schema 的数组
 */
export function generateJsonLd(pageCode: string): object[] {
  const contract = seoMap[pageCode]

  // 合并基础 + 页面声明的 schemaTypes，去重
  const types = [...new Set([...BASE_SCHEMA_TYPES, ...(contract?.schemaTypes ?? [])])]

  // 使用 seoMap 中的契约（若有），否则构造一个最小契约用于基础 Schema
  const effectiveContract: SeoPageContract = contract ?? {
    pageCode,
    pageType: "website",
    intent: "informational",
    path: "/",
    title: SITE_NAME,
    description: "",
    schemaTypes: [],
  }

  return types.map(type => ({
    "@context": JSON_LD_CONTEXT,
    ...schemaBuilders[type](effectiveContract),
  }))
}
