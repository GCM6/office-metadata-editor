import { getTranslations, getLocale } from "next-intl/server"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { SeoContent } from "@/seo/components/SeoContent"
import { OmBreadcrumbs } from "@/components/om/om-breadcrumbs"
import { OmWorkbenchLazy } from "@/components/om/om-workbench-lazy"
import BlankLayout from "@/components/layouts/blank-layout"

export default async function ToolPdfPage() {
  const t = await getTranslations("tools")
  const locale = await getLocale()
  const jsonLdData = generateJsonLd("tool.pdf", locale)

  return (
    <BlankLayout>
      <div className="w-full">
        <main className="mx-auto max-w-4xl px-4 py-8">
          <JsonLd data={jsonLdData} />

          <OmBreadcrumbs pageCode="tool.pdf" />

          <h1 className="mb-6 text-2xl sm:text-3xl font-bold text-foreground">
            {t("pdfTitle")}
          </h1>

          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-xl">
              <OmWorkbenchLazy scope="pdf" />
            </div>
          </div>

          <SeoContent pageCode="tool.pdf" />
        </main>
      </div>
    </BlankLayout>
  )
}
