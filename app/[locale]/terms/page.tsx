"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import BlankLayout from "@/components/layouts/blank-layout"
import { LanguageSwitcher } from "@/i18n/language-switcher"
import { APP_NAME } from "@/lib/app-config"

export default function TermsPage() {
  const t = useTranslations("terms")
  const sections = t.raw("sections") as Array<{ heading: string; content: string }>

  return (
    <BlankLayout>
      <div className="relative h-full w-full overflow-y-auto">
        <div className="relative flex flex-col px-5 py-6 sm:px-8 sm:py-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/75 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {APP_NAME}
              </Link>
            </div>
            <LanguageSwitcher />
          </div>

          <article className="mx-auto mt-8 w-full max-w-3xl">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>
            </header>

            <div className="flex flex-col gap-8">
              {sections.map((section, index) => (
                <section key={index}>
                  <h2 className="mb-3 text-lg font-semibold text-foreground">{section.heading}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{section.content}</p>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </BlankLayout>
  )
}
