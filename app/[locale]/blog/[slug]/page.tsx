import type { Metadata } from "next"
import Link from "next/link"
import { seoMap } from "@/seo/seo-map"
import { generateSeoMetadata } from "@/seo/generate-seo-metadata"
import { JsonLd } from "@/seo/json-ld"
import { generateJsonLd } from "@/seo/generate-json-ld"
import { SeoContent } from "@/seo/components/SeoContent"

import { getLocale } from "next-intl/server"

const slugToPageCode: Record<string, string> = {
  "remove-original-author-docx": "blog.remove-author-docx",
}

export function generateStaticParams() {
  return [{ slug: "remove-original-author-docx" }]
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const pageCode = slugToPageCode[slug]
  const locale = await getLocale()
  if (!pageCode) return { title: locale === "en" ? "Article Not Found" : "文章未找到" }
  return generateSeoMetadata(pageCode, locale)
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const pageCode = slugToPageCode[slug]
  const locale = await getLocale()
  const isEn = locale === "en"
  const seo = pageCode ? seoMap[pageCode] : undefined
  const h1 = isEn ? (seo?.en?.h1 ?? seo?.h1) : seo?.h1
  const jsonLdData = pageCode ? generateJsonLd(pageCode, locale) : []

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={jsonLdData} />

      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <h1>{h1 ?? (isEn ? "Article Not Found" : "文章未找到")}</h1>

        <p className="lead">
          Word 文档在日常办公中无处不在，但很多人不知道的是，每个 Word
          文档都携带着大量隐藏的元数据——包括原始作者姓名、公司名称、创建时间和修改历史。
          当你将文档发送给客户、合作伙伴或公开发布时，这些信息可能在不经意间泄露你的个人隐私或商业机密。
        </p>

        <h2>Word 文档中隐藏了哪些元数据？</h2>
        <p>
          当你创建一个 Word 文档时，Office
          会自动将以下信息嵌入到文档内部：文档作者（通常是安装
          Office 时填写的用户名）、公司名称、创建日期和修改日期、文档标题和主题、
          文档统计信息（编辑时长、修订次数、页数等）、修订痕迹和批注历史，
          甚至可能包括打印机路径和网络共享路径。
        </p>

        <h2>为什么需要删除这些信息？</h2>
        <p>
          这些元数据可能会导致以下问题：向客户发送合同时暴露内部审阅者姓名和修改时间线；
          公开发布政策文件时泄露起草者的个人信息；将文档提交至监管机构时暴露内部讨论痕迹；
          学术论文投稿时泄露同行评审相关信息。彻底清除这些信息，是保护隐私和职业声誉的必要步骤。
        </p>

        <h2>如何彻底删除 Word 文档中的原始作者信息</h2>
        <ol>
          <li>
            <strong>使用在线元数据编辑器</strong>：打开 Office
            元数据编辑器，上传你的 Word 文档，在编辑器界面中清空作者、公司、标题、
            备注等所有字段，保存后下载即可。整个处理过程在浏览器本地完成，
            文件不会上传到服务器。
          </li>
          <li>
            <strong>检查自定义属性</strong>：除了标准属性外，Word 文档还可能包含
            自定义属性字段，这些字段也应一并清理。
          </li>
          <li>
            <strong>验证清理结果</strong>：下载处理后的文件，在 Word
            中打开并检查「文件」→「信息」→「属性」，确认所有字段均已清空。
          </li>
        </ol>

        <h2>常见误区</h2>
        <p>
          许多人认为只要在 Word 的「属性」面板中手动删除作者名就可以了，但实际上，
          文档内部的 XML 结构中仍然保留着原始信息。专业的元数据编辑工具会直接操作文档的
          底层 XML 结构，确保信息被物理移除而非仅从界面隐藏。
        </p>
      </article>

      {/* 硬编码内链：因 tool.word 的 indexable 为 false，RelatedLinks 不会渲染 */}
      <div className="mt-10 rounded-lg border border-border/60 bg-muted/40 p-6">
        <h4 className="mb-3 text-sm font-semibold text-foreground">相关工具推荐</h4>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tools/word"
            className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
          >
            在线修改Word文档属性
          </Link>
        </div>
      </div>

      {pageCode && <SeoContent pageCode={pageCode} />}
    </main>
  )
}
