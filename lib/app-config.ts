import packageJson from "../package.json"

export const APP_PACKAGE_NAME = packageJson.name
export const APP_NAME = packageJson.name
export const APP_VERSION = packageJson.version ?? "0.1.0"
export const APP_WINDOW_TITLE = "MetaDocu 隐私元数据扫描器"

/** 站点基础 URL，用于生成 Canonical、OG URL 等绝对地址 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"
/** 站点名称，用于 JSON-LD Organization / WebSite 等结构化数据 */
export const SITE_NAME = "MetaDocu"

export const appConfig = {
  packageName: APP_PACKAGE_NAME,
  productName: APP_NAME,
  version: APP_VERSION,
  windowTitle: APP_WINDOW_TITLE,
} as const
