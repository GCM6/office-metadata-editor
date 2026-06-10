import packageJson from "../package.json"

export const APP_PACKAGE_NAME = packageJson.name
/** 站点名称，用于 JSON-LD Organization / WebSite 等结构化数据 */
export const SITE_NAME = "MetaDocu"
/** 对外品牌名（UI 徽章、About、authors 等），保持实体一致，避免与 Metadoc/MetaDoc.AI 混淆 */
export const APP_NAME = SITE_NAME
export const APP_VERSION = packageJson.version ?? "0.1.0"
export const APP_WINDOW_TITLE = "MetaDocu Privacy Metadata Scanner"

/** 站点基础 URL，用于生成 Canonical、OG URL 等绝对地址 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"

/** 对外联系邮箱，用于 Organization / AboutPage 结构化数据 */
export const SITE_EMAIL = "mingicelucky@gmail.com"

/**
 * Organization `sameAs` 实体链接（GitHub / X / LinkedIn 等），用于 E-E-A-T 与 GEO
 * 实体消歧（v2.md §D1）。仅在此填入「真实存在」的官方主页 URL —— 留空即不输出 sameAs，
 * 切勿填写占位/虚构地址。建立真实账号后请把链接补进这里。
 */
export const SITE_SAME_AS: string[] = []

export const appConfig = {
  packageName: APP_PACKAGE_NAME,
  productName: APP_NAME,
  version: APP_VERSION,
  windowTitle: APP_WINDOW_TITLE,
} as const
