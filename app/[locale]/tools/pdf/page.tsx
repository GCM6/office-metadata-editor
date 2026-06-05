import { getTranslations, getLocale } from "next-intl/server"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { SeoContent } from "@/seo/components/SeoContent"
import { OmBreadcrumbs } from "@/components/om/om-breadcrumbs"

export default async function ToolPdfPage() {
  const t = await getTranslations("tools")
  const locale = await getLocale()
  const jsonLdData = generateJsonLd("tool.pdf", locale)

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={jsonLdData} />
      
      <OmBreadcrumbs pageCode="tool.pdf" />

      <h1 className="mb-6 text-2xl sm:text-3xl font-bold text-foreground">
        {t("pdfTitle")}
      </h1>

      <section className="mb-10 rounded-lg border border-dashed border-border/60 bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground">
          {t("pdfComingSoon")}
        </p>
      </section>

      <SeoContent pageCode="tool.pdf" />
    </main>
  )
}
