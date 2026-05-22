"use client"

import "@/style/base.css"
import "@/style/chrome.css"

export const dynamic = "force-dynamic"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset(): void
}) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen items-center justify-center bg-background font-sans antialiased">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">出了点问题</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button
            type="button"
            className="mt-4 cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => reset()}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  )
}
