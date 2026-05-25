import { seoMap } from "@/seo/seo-map"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { SeoContent } from "@/seo/components/SeoContent"

export default function ToolPdfPage() {
  const seo = seoMap["tool.pdf"]
  const jsonLdData = generateJsonLd("tool.pdf")

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={jsonLdData} />

      <h1 className="mb-6 text-3xl font-bold text-foreground">
        {seo?.h1 ?? "PDF 文档元数据在线编辑器"}
      </h1>

      <section className="mb-10 rounded-lg border border-dashed border-border/60 bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground">
          工具交互区域 — PDF 文档元数据编辑功能即将上线
        </p>
      </section>

      <SeoContent pageCode="tool.pdf" />
    </main>
  )
}
