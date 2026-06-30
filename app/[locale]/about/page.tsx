"use client"

import React from "react"
import { useTranslations, useLocale } from "next-intl"
import { ShieldCheck, Layers, Sparkles, FileStack, Mail } from "lucide-react"
import BlankLayout from "@/components/layouts/blank-layout"
import { SITE_NAME, SITE_URL } from "@/lib/app-config"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"

export default function AboutPage() {
  const t = useTranslations("about")
  const locale = useLocale()
  const whyItems = t.raw("whyItems") as Array<{ title: string; desc: string }>

  const jsonLdData = [
    ...generateJsonLd("about", locale),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: t("heroTitle"),
      url: `${SITE_URL}/about`,
      description: t("heroSubtitle"),
      mainEntity: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        email: "mingicelucky@gmail.com",
      },
    },
  ]

  const icons = [ShieldCheck, Layers, Sparkles, FileStack]

  return (
    <BlankLayout>
      <JsonLd data={jsonLdData} />
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.9_0.08_280/0.14),transparent_50%),radial-gradient(circle_at_70%_80%,oklch(0.88_0.06_180/0.12),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,oklch(0.35_0.08_280/0.2),transparent_50%),radial-gradient(circle_at_70%_80%,oklch(0.35_0.06_180/0.18),transparent_50%)]" />

        <div className="relative flex flex-col px-5 py-6 sm:px-8 sm:py-8">
          <article className="mx-auto w-full max-w-3xl">
            {/* Hero */}
            <header className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("heroTitle")}
              </h1>
              <p className="mt-3 text-base text-muted-foreground">{t("heroSubtitle")}</p>
            </header>

            {/* Mission */}
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold text-foreground">{t("missionTitle")}</h2>
              <div className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {t("missionContent")}
              </div>
            </section>

            {/* Technology */}
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold text-foreground">{t("techTitle")}</h2>
              <div className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {t("techContent")}
              </div>
            </section>

            {/* Why MetaDocu */}
            <section className="mb-10">
              <h2 className="mb-6 text-xl font-semibold text-foreground">{t("whyTitle")}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {whyItems.map((item, index) => {
                  const Icon = icons[index % icons.length]
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Contact */}
            <section className="mb-12 rounded-xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm">
              <h2 className="mb-3 text-lg font-semibold text-foreground">{t("contactTitle")}</h2>
              <p className="mb-3 text-sm text-muted-foreground">{t("contactContent")}</p>
              <a
                href="mailto:mingicelucky@gmail.com"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                <Mail className="h-4 w-4" />
                mingicelucky@gmail.com
              </a>
            </section>
          </article>
        </div>
      </div>
    </BlankLayout>
  )
}
