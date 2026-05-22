import type { Metadata } from "next"
import { APP_NAME, APP_WINDOW_TITLE } from "@/lib/app-config"
import "@/style/base.css"
import "@/style/chrome.css"
import { ClientLayout } from "./client-layout"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: APP_WINDOW_TITLE,
  description: APP_NAME,
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </head>
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
