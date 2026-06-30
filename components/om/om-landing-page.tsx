import { getLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Check, CheckCircle2, Sparkles } from "lucide-react"
import BlankLayout from "@/components/layouts/blank-layout"
import { OmBreadcrumbs } from "@/components/om/om-breadcrumbs"
import { OmWorkbenchLazy } from "@/components/om/om-workbench-lazy"
import { OmMetadataExposureTable } from "@/components/om/om-metadata-exposure-table"
import { SeoContent } from "@/seo/components/SeoContent"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { seoMap } from "@/seo/seo-map"
import { getLandingPage } from "@/lib/seo-data/landing-pages"
import type { LocalizedText } from "@/lib/seo-data/metadata-exposure"

/**
 * Shared template for the comparison / scenario / guide / research landing pages.
 * Driven entirely by the bilingual `LANDING_PAGES` data base and the page's
 * `seoMap` contract, so each route is a thin wrapper that passes a pageCode.
 */
export async function OmLandingPage({ pageCode }: { pageCode: string }) {
  const locale = await getLocale()
  const isEn = locale === "en"
  const pick = (t: LocalizedText) => (isEn ? t.en : t.zh)

  const seo = seoMap[pageCode]
  const content = getLandingPage(pageCode)
  if (!seo || !content) return null

  const h1 = isEn ? (seo.en?.h1 ?? seo.h1) : seo.h1
  const jsonLdData = generateJsonLd(pageCode, locale)

  return (
    <BlankLayout>
      <JsonLd data={jsonLdData} />
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_15%,oklch(0.9_0.08_280/0.14),transparent_50%),radial-gradient(circle_at_82%_85%,oklch(0.88_0.09_162/0.14),transparent_50%)] dark:bg-[radial-gradient(circle_at_18%_15%,oklch(0.36_0.08_280/0.2),transparent_50%),radial-gradient(circle_at_82%_85%,oklch(0.36_0.09_162/0.2),transparent_50%)]" />

        <div className="relative flex flex-col px-5 py-6 sm:px-8 sm:py-8">
          <article className="mx-auto w-full max-w-4xl">
            <OmBreadcrumbs pageCode={pageCode} />

            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {pick(content.badge)}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{h1}</h1>

            {content.updated && (
              <p className="mt-2 text-xs text-muted-foreground">
                {isEn ? "Last updated" : "最后更新"}: {content.updated}
              </p>
            )}

            {/* Answer-first lead (GEO citability) */}
            <div className="mt-6 rounded-xl border border-primary/20 bg-card/70 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-sm leading-7 text-foreground/90">{pick(content.answerLead)}</p>
            </div>

            {/* Embedded interactive tool */}
            {content.embedTool && (
              <section className="mt-10">
                {content.toolHeading && (
                  <h2 className="text-2xl font-bold text-foreground">{pick(content.toolHeading)}</h2>
                )}
                {content.toolDesc && (
                  <p className="mt-2 mb-6 text-sm text-muted-foreground">{pick(content.toolDesc)}</p>
                )}
                <div className={content.toolHeading && !content.toolDesc ? "mt-6" : ""}>
                  <OmWorkbenchLazy scope={content.embedTool} />
                </div>
              </section>
            )}

            {/* HowTo steps */}
            {content.howTo && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">{pick(content.howTo.title)}</h2>
                {content.howTo.intro && (
                  <p className="mt-2 text-sm text-muted-foreground">{pick(content.howTo.intro)}</p>
                )}
                <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {content.howTo.steps.map((step, i) => (
                    <li key={i} className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-foreground">{pick(step.title)}</h3>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">{pick(step.desc)}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Prose sections */}
            {content.sections?.map((section, i) => (
              <section key={i} className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">{pick(section.heading)}</h2>
                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="mt-3 text-sm leading-7 text-muted-foreground">
                    {pick(p)}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {pick(b)}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Comparison table */}
            {content.table && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">{pick(content.table.title)}</h2>
                {content.table.intro && (
                  <p className="mt-2 mb-6 text-sm text-muted-foreground">{pick(content.table.intro)}</p>
                )}
                <div className="overflow-x-auto rounded-xl border border-border/60">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                        {content.table.headers.map((header, i) => (
                          <th
                            key={i}
                            className={`px-4 py-3 font-semibold ${i === content.table!.highlightCol ? "text-primary" : ""}`}
                          >
                            {pick(header)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {content.table.rows.map((row, i) => (
                        <tr key={i} className="border-t border-border/50 align-top">
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={`px-4 py-3 ${j === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                            >
                              {j === content.table!.highlightCol && j !== 0 ? (
                                <span className="inline-flex items-start gap-1.5">
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                  {pick(cell)}
                                </span>
                              ) : (
                                pick(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Exposure dataset table */}
            {content.exposureTitle && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-foreground">{pick(content.exposureTitle)}</h2>
                {content.exposureIntro && (
                  <p className="mt-2 mb-6 text-sm text-muted-foreground">{pick(content.exposureIntro)}</p>
                )}
                <OmMetadataExposureTable
                  locale={locale}
                  format={content.exposureFormat}
                  labels={{
                    field: isEn ? "Hidden field" : "隐藏字段",
                    formats: isEn ? "Formats" : "格式",
                    exposes: isEn ? "What it exposes" : "暴露什么",
                    risk: isEn ? "Risk" : "风险",
                    removal: isEn ? "How MetaDocu removes it" : "MetaDocu 如何移除",
                  }}
                  riskLabels={{
                    high: isEn ? "High" : "高",
                    medium: isEn ? "Medium" : "中",
                    low: isEn ? "Low" : "低",
                  }}
                />
              </section>
            )}

            {/* FAQ */}
            {content.faqs.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-foreground">
                  {isEn ? "Frequently asked questions" : "常见问题"}
                </h2>
                <div className="space-y-5">
                  {content.faqs.map((faq, i) => (
                    <div key={i}>
                      <h3 className="text-base font-semibold text-foreground/90">{pick(faq.q)}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick(faq.a)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="mt-12 rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-foreground">{pick(content.ctaTitle)}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{pick(content.ctaDesc)}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {content.ctas.map((cta) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {pick(cta.label)}
                  </Link>
                ))}
              </div>
            </section>

            {/* Internal-link reflow (FAQ here is sourced from the data base above) */}
            <div className="mt-12">
              <SeoContent pageCode={pageCode} />
            </div>
          </article>
        </div>
      </div>
    </BlankLayout>
  )
}

export default OmLandingPage
