"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { seoMap } from "../seo-map"
import { RelatedLinks } from "./RelatedLinks"
import { questionToKey } from "../faq-keys"

interface SeoContentProps {
  pageCode: string
  additionalContent?: React.ReactNode
}

export function SeoContent({ pageCode, additionalContent }: SeoContentProps) {
  const seo = seoMap[pageCode]
  const t = useTranslations("seo")

  if (!seo || seo.status !== "published") {
    return null
  }

  const hasFAQ = seo.paaQuestions && seo.paaQuestions.length > 0
  const hasRelatedLinks = seo.internalLinksTo && seo.internalLinksTo.length > 0

  if (!hasFAQ && !hasRelatedLinks && !additionalContent) return null

  const faqAnswers = t.raw("faqAnswers") as Record<string, string>

  return (
    <div className="seo-content space-y-10">
      {additionalContent}

      {hasFAQ && (
        <section className="faq-section">
          <h2 className="mb-6 text-2xl font-bold text-foreground">{t("faqTitle")}</h2>
          <div className="space-y-5">
            {seo.paaQuestions!.map((question, index) => {
              const key = questionToKey(question)
              return (
                <div key={index} className="faq-item">
                  <h3 className="text-base font-semibold text-foreground/90">
                    {t(`faqQuestions.${key}`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faqAnswers[key] ?? faqAnswers["online-metadata-security"]}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {hasRelatedLinks && (
        <RelatedLinks currentPageCode={pageCode} />
      )}
    </div>
  )
}
