import type { Metadata } from "next"
import { getLocale, getMessages, getTranslations } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
import { APP_NAME } from "@/lib/app-config"
import "@/style/base.css"
import "@/style/chrome.css"
import { ClientLayout } from "./client-layout"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const t = await getTranslations("common")
    return {
      title: t("appTitle"),
      description: APP_NAME,
      icons: { icon: "/logo.svg" },
    }
  } catch {
    return {
      title: APP_NAME,
      description: APP_NAME,
      icons: { icon: "/logo.svg" },
    }
  }
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let locale = "zh-CN"
  let messages: Record<string, unknown> = {}
  try {
    locale = await getLocale()
    messages = (await getMessages()) as Record<string, unknown>
  } catch {
    // fallback during static generation (e.g. _global-error)
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
