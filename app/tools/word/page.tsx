import { getTranslations } from "next-intl/server"
import { seoMap } from "@/seo/seo-map"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { SeoContent } from "@/seo/components/SeoContent"

export default async function ToolWordPage() {
  const t = await getTranslations("tools")
  const seo = seoMap["tool.word"]
  const jsonLdData = generateJsonLd("tool.word")

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={jsonLdData} />

      <h1 className="mb-6 text-3xl font-bold text-foreground">
        {t("wordTitle")}
      </h1>

      <section className="mb-10 rounded-lg border border-dashed border-border/60 bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground">
          {t("wordComingSoon")}
        </p>
      </section>

      <SeoContent pageCode="tool.word" />
    </main>
  )
}
