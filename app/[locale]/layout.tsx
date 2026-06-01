import type { Metadata, Viewport } from "next"
import { getLocale, getMessages, getTranslations } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
import { APP_NAME } from "@/lib/app-config"
import "@/style/base.css"
import "@/style/chrome.css"
import { ClientLayout } from "../client-layout"
import { GoogleTagManager } from "@next/third-parties/google"

export function generateStaticParams() {
  return [{ locale: "zh-CN" }, { locale: "en" }]
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://metadocu.com"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  let title = "Office Metadata Editor"
  let description = "A professional online Office metadata editor supporting Word, Excel, and PDF files."
  let ogTitle = "Office Metadata Editor"
  let ogDescription = description
  let ogImageAlt = "Office Metadata Editor"
  let twitterTitle = ogTitle
  let twitterDescription = ogDescription
  let appleWebAppTitle = "Office Metadata Editor"
  let titleTemplate = "%s | Office Metadata Editor"

  try {
    const t = await getTranslations("common")
    title = t("appTitle")
    description = t("layoutDescription")
    ogTitle = t("layoutOgTitle")
    ogDescription = t("layoutOgDescription")
    ogImageAlt = t("layoutOgImageAlt")
    twitterTitle = t("layoutTwitterTitle")
    twitterDescription = t("layoutTwitterDescription")
    appleWebAppTitle = t("layoutAppleWebAppTitle")
    titleTemplate = t("layoutTitleTemplate")
  } catch {
    // fallback during static generation
  }

  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE === "en" ? "en_US" : "zh_CN"

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: titleTemplate,
    },
    description,
    keywords: [
      "Office metadata editor",
      "edit document properties",
      "remove metadata online",
      "Word author editor",
      "PDF properties editor",
      "Excel metadata cleaner",
      "DOCX metadata editor",
      "free online metadata tool",
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
      locale,
      url: SITE_URL,
      siteName: ogTitle,
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
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
      title: appleWebAppTitle,
      statusBarStyle: "default",
    },

    formatDetection: {
      telephone: false,
    },

    icons: { icon: "/logo.svg" },
  }
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const resolvedParams = await params
  let locale = resolvedParams.locale || "zh-CN"
  let messages: Record<string, unknown> = {}
  let jsonLdOrgName = "Office Metadata Editor"
  let jsonLdOrgDesc = "A professional online Office metadata editor."
  let jsonLdWebSiteName = "Office Metadata Editor"

  try {
    messages = (await getMessages()) as Record<string, unknown>
    const t = await getTranslations("common")
    jsonLdOrgName = t("layoutJsonLdOrgName")
    jsonLdOrgDesc = t("layoutJsonLdOrgDesc")
    jsonLdWebSiteName = t("layoutJsonLdWebSiteName")
  } catch {
    // fallback during static generation (e.g. _global-error)
  }

  return (
    <html lang={locale} suppressHydrationWarning>
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
              name: jsonLdOrgName,
              url: SITE_URL,
              description: jsonLdOrgDesc,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: jsonLdWebSiteName,
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
