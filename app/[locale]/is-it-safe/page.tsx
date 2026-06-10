import { getTranslations, getLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ShieldCheck, Lock, CheckCircle2, XCircle, FileText, FileSpreadsheet, FileType } from "lucide-react"
import BlankLayout from "@/components/layouts/blank-layout"
import { OmBreadcrumbs } from "@/components/om/om-breadcrumbs"
import { OmMetadataExposureTable } from "@/components/om/om-metadata-exposure-table"
import { SeoContent } from "@/seo/components/SeoContent"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { seoMap } from "@/seo/seo-map"

const PAGE_CODE = "trust.is-it-safe"

export default async function IsItSafePage() {
  const t = await getTranslations("trustSafe")
  const locale = await getLocale()
  const isEn = locale === "en"

  const seo = seoMap[PAGE_CODE]
  const h1 = isEn ? (seo.en?.h1 ?? seo.h1) : seo.h1
  const jsonLdData = generateJsonLd(PAGE_CODE, locale)

  const howSteps = t.raw("howSteps") as Array<{ title: string; desc: string }>
  const compareRows = t.raw("compareRows") as Array<{ aspect: string; local: string; upload: string }>

  return (
    <BlankLayout>
      <JsonLd data={jsonLdData} />
      <div className="relative h-full w-full overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_15%,oklch(0.9_0.09_162/0.16),transparent_50%),radial-gradient(circle_at_80%_85%,oklch(0.88_0.1_245/0.14),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_15%,oklch(0.38_0.09_162/0.22),transparent_50%),radial-gradient(circle_at_80%_85%,oklch(0.38_0.1_245/0.2),transparent_50%)]" />

        <div className="relative flex flex-col px-5 py-6 sm:px-8 sm:py-8">
          <article className="mx-auto w-full max-w-4xl">
            <OmBreadcrumbs pageCode={PAGE_CODE} />

            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t("badge")}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{h1}</h1>

            {/* Answer-first lead block (GEO citability) */}
            <div className="mt-6 rounded-xl border border-primary/20 bg-card/70 p-6 shadow-sm backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                <Lock className="h-4 w-4" />
                {isEn ? "Short answer" : "简短回答"}
              </div>
              <p className="text-sm leading-7 text-foreground/90">{t("answerLead")}</p>
            </div>

            {/* How it works */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">{t("howTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("howIntro")}</p>
              <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {howSteps.map((step, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Local vs upload comparison */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">{t("compareTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("compareIntro")}</p>
              <div className="mt-6 overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">{t("compareHeaderAspect")}</th>
                      <th className="px-4 py-3 font-semibold text-primary">{t("compareHeaderLocal")}</th>
                      <th className="px-4 py-3 font-semibold">{t("compareHeaderUpload")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((row, i) => (
                      <tr key={i} className="border-t border-border/50 align-top">
                        <td className="px-4 py-3 font-medium text-foreground">{row.aspect}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-start gap-1.5 text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {row.local}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-start gap-1.5 text-muted-foreground">
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            {row.upload}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Exposure table (D3 dataset) */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">{t("exposureTitle")}</h2>
              <p className="mt-2 mb-6 text-sm text-muted-foreground">{t("exposureIntro")}</p>
              <OmMetadataExposureTable
                locale={locale}
                labels={{
                  field: t("exposureColField"),
                  formats: t("exposureColFormats"),
                  exposes: t("exposureColExposes"),
                  risk: t("exposureColRisk"),
                  removal: t("exposureColRemoval"),
                }}
                riskLabels={{
                  high: t("riskHigh"),
                  medium: t("riskMedium"),
                  low: t("riskLow"),
                }}
              />
            </section>

            {/* CTA to tool hubs */}
            <section className="mt-12 rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-foreground">{t("ctaTitle")}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("ctaDesc")}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <CtaLink href="/tools/word" icon={<FileText className="h-4 w-4 text-blue-500" />} label={t("ctaWord")} />
                <CtaLink href="/tools/excel" icon={<FileSpreadsheet className="h-4 w-4 text-green-500" />} label={t("ctaExcel")} />
                <CtaLink href="/tools/pdf" icon={<FileType className="h-4 w-4 text-red-500" />} label={t("ctaPdf")} />
              </div>
            </section>

            <div className="mt-12">
              <SeoContent pageCode={PAGE_CODE} />
            </div>
          </article>
        </div>
      </div>
    </BlankLayout>
  )
}

function CtaLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
    >
      {icon}
      {label}
    </Link>
  )
}
