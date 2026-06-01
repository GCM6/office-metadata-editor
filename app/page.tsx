import { redirect } from "next/navigation"
import { routing } from "@/i18n/routing"

// 根路径 fallback：当 next-intl 中间件在开发模式下未能正确重写 `/` 时，
// 由此页面兜底跳转到默认语言的首页。
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
