"use client"

import "@/style/base.css"
import "@/style/chrome.css"
import zhCN from "../messages/zh-CN.json"
import en from "../messages/en.json"

function getLocale(): string {
  if (typeof document === "undefined") return "zh-CN"
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/)
  return match?.[1] === "en" ? "en" : "zh-CN"
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset(): void
}) {
  const locale = getLocale()
  const msgs = locale === "en" ? en : zhCN

  return (
    <html lang={locale}>
      <body className="flex min-h-screen items-center justify-center bg-background font-sans antialiased">
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
      </body>
    </html>
  )
}
