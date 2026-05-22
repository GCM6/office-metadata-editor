import packageJson from "../../package.json"

export const APP_PACKAGE_NAME = packageJson.name
export const APP_NAME = packageJson.name
export const APP_VERSION = packageJson.version ?? "0.1.0"
export const APP_WINDOW_TITLE = "Office 元数据编辑器"

export const appConfig = {
  packageName: APP_PACKAGE_NAME,
  productName: APP_NAME,
  version: APP_VERSION,
  windowTitle: APP_WINDOW_TITLE,
} as const
