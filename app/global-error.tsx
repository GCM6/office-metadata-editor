"use client"

import "@/style/base.css"
import "@/style/chrome.css"

export const dynamic = "force-dynamic"

interface Messages {
  error: { somethingWentWrong: string; retry: string }
}

const zhCN: Messages = {
  error: { somethingWentWrong: "出了点问题", retry: "重试" },
}

const en: Messages = {
  error: { somethingWentWrong: "Something went wrong", retry: "Retry" },
}

function getMessages(): Messages {
  if (typeof document === "undefined") return zhCN
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/)
  return match?.[1] === "en" ? en : zhCN
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset(): void
}) {
  const msgs = getMessages()

  return (
    <html lang={typeof document !== "undefined" && getMessages() === en ? "en" : "zh-CN"}>
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