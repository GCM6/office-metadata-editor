import React from "react"
import { seoMap } from "../seo-map"
import { RelatedLinks } from "./RelatedLinks"

interface SeoContentProps {
  pageCode: string
  additionalContent?: React.ReactNode
}

export function SeoContent({ pageCode, additionalContent }: SeoContentProps) {
  const seo = seoMap[pageCode]
  if (!seo || seo.status !== "published") {
    return null
  }

  const hasFAQ = seo.paaQuestions && seo.paaQuestions.length > 0
  const hasRelatedLinks = seo.internalLinksTo && seo.internalLinksTo.length > 0

  if (!hasFAQ && !hasRelatedLinks && !additionalContent) return null

  return (
    <div className="seo-content space-y-10">
      {additionalContent}

      {hasFAQ && (
        <section className="faq-section">
          <h2 className="mb-6 text-2xl font-bold text-foreground">常见问题</h2>
          <div className="space-y-5">
            {seo.paaQuestions!.map((question, index) => (
              <div key={index} className="faq-item">
                <h3 className="text-base font-semibold text-foreground/90">{question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {getFAQAnswer(question)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasRelatedLinks && (
        <RelatedLinks currentPageCode={pageCode} />
      )}
    </div>
  )
}

function getFAQAnswer(question: string): string {
  const answers: Record<string, string> = {
    "如何在线修改Word文档的作者信息？":
      "打开Office元数据编辑器，上传Word文档，在编辑器界面中找到作者字段，修改后保存即可。整个过程在浏览器本地完成，文档不会上传到任何服务器。",
    "Office文档元数据包含哪些信息？":
      "元数据包括作者名称、创建时间、修改时间、公司名称、标题、主题、标签、备注等。这些信息可能在不经意间泄露您的个人或公司隐私。",
    "PDF文件的属性信息可以修改吗？":
      "可以。通过在线Office元数据编辑器上传PDF文件，即可编辑标题、作者、主题等属性信息。所有处理在浏览器本地完成，安全便捷。",
    "如何批量清除多个文档的元数据？":
      "打开批量处理工作台，添加多个文件，选择批量清除功能即可一键清除所有文件的元数据信息。支持Word、Excel、PDF文件混合批量处理。",
    "在线修改文档元数据安全吗？":
      "非常安全。本工具全程在浏览器本地处理，您的文件不会上传到任何服务器，所有操作都在您的设备上完成，完全保护数据隐私。",
    "Word文档的元数据在哪里查看？":
      "在Word中，点击「文件」→「信息」→「属性」中的「高级属性」可以查看完整的元数据信息，包括作者、修订次数、编辑时间等隐藏数据。",
    "修改Word文档属性后对方能发现吗？":
      "不会。一旦使用本编辑器修改或清除元数据字段（如原始作者、创建日期、修订历史），原有信息将被永久覆盖或删除，文件看起来像是新建的。",
    "如何彻底删除Word文档中的个人隐私信息？":
      "上传Word文档到编辑器，在元数据编辑区清空所有个人相关字段（作者、公司、备注等），保存后下载即可。建议同时检查文档属性中的自定义属性。",
    "Excel工作簿的元数据包含哪些信息？":
      "Excel工作簿元数据包括作者、创建日期、修改日期、公司名称、标题、主题、类别等。这些信息会随文件一起传输，可能泄露敏感信息。",
    "PDF文件的元数据存储在什么地方？":
      "PDF元数据存储在PDF文件头部的信息字典（Info Dictionary）中，包括标题、作者、主题、关键词、创建日期和修改日期等标准字段。",
    "将Word转为PDF后元数据会保留吗？":
      "可能会。将DOCX转换为PDF时，部分元数据（如原始创建者、公司名称）可能会被转移到PDF属性字段中。建议在转换前或使用PDF元数据编辑器清除敏感信息。",
    "Word文档中有哪些隐藏的元数据？":
      "除了文档属性中的作者、标题等，Word文档还可能包含修订痕迹、批注历史、隐藏文字、文档版本信息、打印机路径等不为人知的元数据。",
    "删除文档属性后对方还能看到吗？":
      "使用本工具彻底清除后对方无法看到。工具会从文档内部XML结构中移除相关字段，而非简单的界面隐藏，确保信息被永久删除。",
    "如何批量删除多个Word文档的隐私信息？":
      "使用批量处理工作台，一次添加多个Word文档，选择批量清除元数据功能，即可一键同时处理所有文件，大幅提升效率。",
    "如何批量修改多个Excel文件的属性？":
      "通过批量处理功能，一次导入多个Excel文件，统一编辑或清除属性信息。支持批量设置作者、公司等通用字段。",
    "Excel属性修改后会影响公式和图表吗？":
      "不会。元数据修改仅针对文档属性信息（如作者、标题等），不会触及工作簿内的数据、公式、图表或格式设置。",
    "如何彻底清除PDF中的所有隐藏信息？":
      "上传PDF文件后，在编辑器中清空所有属性字段，保存下载即可。工具使用pdf-lib库直接操作PDF结构，确保信息被完整移除。",
    "在线修改PDF属性需要上传文件吗？":
      "不需要上传到服务器。本工具在您的浏览器中本地运行，使用Web技术直接在客户端处理PDF文件，文件始终留在您的设备上。",
  }

  return answers[question] ?? "如需了解更多信息，请使用本工具实际操作体验，或联系客服获取帮助。"
}
