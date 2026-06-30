"use client"

import React from "react"
import { useTranslations } from "next-intl"
import BlankLayout from "@/components/layouts/blank-layout"

export default function TermsPage() {
  const t = useTranslations("terms")
  const sections = t.raw("sections") as Array<{ heading: string; content: string }>

  return (
    <BlankLayout>
      <div className="relative w-full">
        <div className="relative flex flex-col px-5 py-6 sm:px-8 sm:py-8">
          <article className="mx-auto w-full max-w-3xl">
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
