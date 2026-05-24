import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/app-config"
import { seoMap } from "./seo-map"
import type { SeoPageContract } from "./seo-types"

/**
 * 根据 pageCode 从 seoMap 中获取 SEO 契约
 * 未找到时返回 undefined
 */
function getSeoContract(pageCode: string): SeoPageContract | undefined {
  return seoMap[pageCode]
}

/**
 * 拼接完整的 canonical/og URL
 */
function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalizedPath}`
}

/**
 * 根据 SEO 契约中的配置生成 robots 元数据
 */
function generateRobots(contract: SeoPageContract): Metadata["robots"] {
  const index = contract.noIndex !== true
  return {
    index,
    follow: index,
    googleBot: {
      index,
      follow: index,
    },
  }
}

/**
 * 根据 SEO 契约生成 Open Graph 元数据
 */
function generateOpenGraph(
  contract: SeoPageContract,
): Metadata["openGraph"] {
  const og: NonNullable<Metadata["openGraph"]> = {
    type: contract.pageType,
    siteName: SITE_NAME,
    title: contract.title,
    description: contract.description,
    url: absoluteUrl(contract.path),
    locale: "zh_CN",
  }

  if (contract.ogImage) {
    og.images = [
      {
        url: contract.ogImage.startsWith("http")
          ? contract.ogImage
          : absoluteUrl(contract.ogImage),
        alt: contract.ogImageAlt ?? contract.title,
      },
    ]
  }

  return og
}

/**
 * 根据 SEO 契约生成 Twitter 卡片元数据
 */
function generateTwitter(
  contract: SeoPageContract,
): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: contract.title,
    description: contract.description,
    images: contract.ogImage
      ? [
          contract.ogImage.startsWith("http")
            ? contract.ogImage
            : absoluteUrl(contract.ogImage),
        ]
      : undefined,
  }
}

/**
 * 根据 SEO 契约生成 alternates（多语言/Canonical）元数据
 */
function generateAlternates(
  contract: SeoPageContract,
): Metadata["alternates"] {
  const canonical = contract.canonical ?? absoluteUrl(contract.path)

  const alternates: NonNullable<Metadata["alternates"]> = {
    canonical,
  }

  if (contract.alternates?.languages) {
    alternates.languages = contract.alternates.languages
  }

  return alternates
}

/**
 * 核心函数：根据 pageCode 生成完整的 Next.js Metadata 对象
 *
 * 返回的 Metadata 包含：
 * - title / description / keywords（基础 TDK）
 * - openGraph（OG 社交分享标签）
 * - twitter（Twitter 卡片标签）
 * - alternates（Canonical URL + 多语言）
 * - robots（索引策略）
 * - 其他标准 metadata 字段
 *
 * @param pageCode - 页面唯一标识，对应 seoMap 中的 key
 * @returns Next.js Metadata 对象；若 pageCode 不存在则返回 undefined
 */
export function generateSeoMetadata(pageCode: string): Metadata | undefined {
  const contract = getSeoContract(pageCode)
  if (!contract) return undefined

  return {
    title: contract.title,
    description: contract.description,
    keywords: contract.keywords,
    robots: generateRobots(contract),
    openGraph: generateOpenGraph(contract),
    twitter: generateTwitter(contract),
    alternates: generateAlternates(contract),
  }
}
