import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

export default getRequestConfig(async ({ locale }) => {
  let cookieLocale: string | undefined
  try {
    const cookieStore = await cookies()
    cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  } catch {
    // Ignore error during static generation
  }

  const resolvedLocale = cookieLocale || locale || "zh-CN"

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
  }
})
