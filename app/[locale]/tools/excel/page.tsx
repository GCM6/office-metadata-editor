import { getTranslations, getLocale } from "next-intl/server"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { SeoContent } from "@/seo/components/SeoContent"
import { OmBreadcrumbs } from "@/components/om/om-breadcrumbs"
import { OmWorkbenchLazy } from "@/components/om/om-workbench-lazy"
import BlankLayout from "@/components/layouts/blank-layout"

export default async function ToolExcelPage() {
  const t = await getTranslations("tools")
  const locale = await getLocale()
  const jsonLdData = generateJsonLd("tool.excel", locale)

  return (
    <BlankLayout>
      <div className="h-full w-full overflow-y-auto">
        <main className="mx-auto max-w-4xl px-4 py-8">
          <JsonLd data={jsonLdData} />

          <OmBreadcrumbs pageCode="tool.excel" />

          <h1 className="mb-6 text-2xl sm:text-3xl font-bold text-foreground">
            {t("excelTitle")}
          </h1>

          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-xl">
              <OmWorkbenchLazy scope="excel" />
            </div>
          </div>

          <SeoContent pageCode="tool.excel" />
        </main>
      </div>
    </BlankLayout>
  )
}
