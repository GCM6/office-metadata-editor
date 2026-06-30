import Link from "next/link"
import { seoMap } from "@/seo/seo-map"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { SeoContent } from "@/seo/components/SeoContent"
import BlankLayout from "@/components/layouts/blank-layout"
import { getLocale } from "next-intl/server"

const blogPosts = [
  {
    slug: "remove-original-author-docx",
    pageCode: "blog.remove-author-docx" as const,
  },
]

export default async function BlogPage() {
  const seo = seoMap["blog"]
  const researchSeo = seoMap["research.metadata-leak"]
  const locale = await getLocale()
  const jsonLdData = generateJsonLd("blog", locale)

  return (
    <BlankLayout>
      <div className="w-full">
        <main className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={jsonLdData} />

      <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">
        {locale === "en" ? (seo?.en?.h1 ?? "Office Document Metadata Knowledge Hub") : (seo?.h1 ?? "Office 文档元数据知识库")}
      </h1>
      <p className="mb-8 text-muted-foreground">
        {locale === "en"
          ? (seo?.en?.description ?? "Learn about Office document metadata, how to protect document privacy, modify properties, and clear hidden information.")
          : (seo?.description ?? "学习 Office 文档元数据相关知识，了解如何保护文档隐私、修改文档属性、清除隐藏信息。")}
      </p>

      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        {blogPosts.map((post) => {
          const postSeo = seoMap[post.pageCode]
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-lg border border-border/60 bg-card/60 p-6 transition-colors hover:border-primary/30 hover:bg-card/80"
            >
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                {postSeo?.h1 ?? "未命名文章"}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {postSeo?.description ?? ""}
              </p>
            </Link>
          )
        })}
      </section>

      {researchSeo && (
        <section className="mb-10">
          <Link
            href="/metadata-leak-study"
            className="block rounded-lg border border-primary/30 bg-primary/5 p-6 transition-colors hover:bg-primary/10"
          >
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              {locale === "en" ? (researchSeo.en?.h1 ?? researchSeo.h1) : researchSeo.h1}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {locale === "en" ? (researchSeo.en?.description ?? researchSeo.description) : researchSeo.description}
            </p>
          </Link>
        </section>
      )}

      <SeoContent pageCode="blog" />
        </main>
      </div>
    </BlankLayout>
  )
}
