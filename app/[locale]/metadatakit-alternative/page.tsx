import { getTranslations, getLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { GitCompareArrows, Check, FileText, FileType, ShieldCheck } from "lucide-react"
import BlankLayout from "@/components/layouts/blank-layout"
import { OmBreadcrumbs } from "@/components/om/om-breadcrumbs"
import { SeoContent } from "@/seo/components/SeoContent"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { seoMap } from "@/seo/seo-map"

const PAGE_CODE = "compare.metadatakit"

export default async function MetadatakitAlternativePage() {
  const t = await getTranslations("compareKit")
  const locale = await getLocale()
  const isEn = locale === "en"

  const seo = seoMap[PAGE_CODE]
  const h1 = isEn ? (seo.en?.h1 ?? seo.h1) : seo.h1
  const jsonLdData = generateJsonLd(PAGE_CODE, locale)

  const tableRows = t.raw("tableRows") as Array<{ feature: string; metadocu: string; metadatakit: string }>
  const chooseKitItems = t.raw("chooseKitItems") as string[]
  const chooseDocuItems = t.raw("chooseDocuItems") as string[]

  return (
    <BlankLayout>
      <JsonLd data={jsonLdData} />
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_15%,oklch(0.9_0.08_280/0.14),transparent_50%),radial-gradient(circle_at_82%_85%,oklch(0.88_0.09_162/0.14),transparent_50%)] dark:bg-[radial-gradient(circle_at_18%_15%,oklch(0.36_0.08_280/0.2),transparent_50%),radial-gradient(circle_at_82%_85%,oklch(0.36_0.09_162/0.2),transparent_50%)]" />

        <div className="relative flex flex-col px-5 py-6 sm:px-8 sm:py-8">
          <article className="mx-auto w-full max-w-4xl">
            <OmBreadcrumbs pageCode={PAGE_CODE} />

            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <GitCompareArrows className="h-3.5 w-3.5" />
              {t("badge")}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{h1}</h1>

            {/* Answer-first lead (GEO citability) */}
            <div className="mt-6 rounded-xl border border-primary/20 bg-card/70 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-sm leading-7 text-foreground/90">{t("answerLead")}</p>
            </div>

            {/* Comparison table */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">{t("tableTitle")}</h2>
              <p className="mt-2 mb-6 text-sm text-muted-foreground">{t("tableIntro")}</p>
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">{t("tableHeaderFeature")}</th>
                      <th className="px-4 py-3 font-semibold text-primary">{t("tableHeaderMetadocu")}</th>
                      <th className="px-4 py-3 font-semibold">{t("tableHeaderMetadatakit")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, i) => (
                      <tr key={i} className="border-t border-border/50 align-top">
                        <td className="px-4 py-3 font-medium text-foreground">{row.feature}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.metadocu}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.metadatakit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Choose which */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">{t("chooseTitle")}</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ChooseCard title={t("chooseDocuTitle")} items={chooseDocuItems} highlight />
                <ChooseCard title={t("chooseKitTitle")} items={chooseKitItems} />
              </div>
              <p className="mt-6 rounded-xl border border-border/60 bg-muted/40 p-5 text-sm leading-7 text-muted-foreground">
                {t("honestNote")}
              </p>
            </section>

            {/* CTA */}
            <section className="mt-12 rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-foreground">{t("ctaTitle")}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("ctaDesc")}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <CtaLink href="/tools/word" icon={<FileText className="h-4 w-4 text-blue-500" />} label={t("ctaWord")} />
                <CtaLink href="/tools/pdf" icon={<FileType className="h-4 w-4 text-red-500" />} label={t("ctaPdf")} />
                <CtaLink href="/is-it-safe" icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />} label={t("ctaSafe")} />
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

function ChooseCard({ title, items, highlight }: { title: string; items: string[]; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm backdrop-blur-sm ${
        highlight ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card/60"
      }`}
    >
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
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
