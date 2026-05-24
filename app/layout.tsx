import type { Metadata, Viewport } from "next"
import { APP_NAME } from "@/lib/app-config"
import "@/style/base.css"
import "@/style/chrome.css"
import { ClientLayout } from "./client-layout"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://officemetadata-editor.vercel.app"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Office元数据在线编辑器 - 免费修改Word/Excel/PDF文档属性 | 全程本地处理",
    template: "%s | Office元数据编辑器",
  },
  description:
    "专业的在线Office元数据编辑器，支持Word(.docx)、Excel(.xlsx)、PDF文件，无需上传服务器，全程本地处理，保护您的文档隐私。可批量修改作者、创建时间等元数据属性。",
  keywords: [
    "Office元数据编辑器",
    "修改文档属性",
    "在线清除元数据",
    "Word作者修改",
    "PDF属性编辑",
    "Excel元数据清除",
    "DOCX元数据编辑器",
    "免费在线元数据工具",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: "Office元数据编辑器",
    title: "Office元数据在线编辑器 - 免费修改Word/Excel/PDF文档属性",
    description:
      "在线编辑Word、Excel、PDF元数据，无需上传服务器，保护文档隐私安全。支持批量处理，一键清除敏感信息。",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Office元数据编辑器",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Office元数据在线编辑器 - 免费修改文档属性，全程本地处理",
    description:
      "在线编辑Word、Excel、PDF元数据，无需上传服务器，保护文档隐私安全。支持批量处理，一键清除敏感信息。",
    images: ["/og-default.png"],
  },

  verification: {
    // Placeholder for Google/Bing/Baidu verification codes
    // google: "",
    // yandex: "",
    // other: { "baidu-site-verification": "" },
  },

  appleWebApp: {
    capable: true,
    title: "Office元数据编辑器",
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
  },
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
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="baidu-site-verification" content="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Office元数据编辑器",
              url: SITE_URL,
              description:
                "专业的在线Office元数据编辑器，支持Word、Excel、PDF文件元数据修改与清除，全程本地处理，保护文档隐私。",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Office元数据编辑器",
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
