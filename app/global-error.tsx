"use client"

import "@/styles/base.css"
import "@/styles/chrome.css"
import { NextIntlClientProvider } from "next-intl"
import zhCN from "../messages/zh-CN.json"
import en from "../messages/en.json"

function getLocale(): string {
  if (typeof document === "undefined") return "en"
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/)
  return match?.[1] === "zh-CN" ? "zh-CN" : "en"
}

function ErrorDisplay({
  error,
  reset,
  msgs,
}: {
  error: Error & { digest?: string }
  reset(): void
  msgs: { error: { somethingWentWrong: string; retry: string } }
}) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-foreground">{msgs.error.somethingWentWrong}</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <button
        type="button"
        className="mt-4 cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground"
        onClick={() => reset()}
      >
        {msgs.error.retry}
      </button>
    </div>
  )
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset(): void
}) {
  const locale = getLocale()
  const messages = locale === "en" ? en : zhCN

  return (
    <html lang={locale}>
      <body className="flex min-h-screen items-center justify-center bg-background font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorDisplay error={error} reset={reset} msgs={messages} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
