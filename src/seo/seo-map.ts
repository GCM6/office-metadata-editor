import type { SeoPageContract } from "./seo-types"

export const seoMap: SeoPageContract[] = [
  {
    path: "/",
    title: "Office 元数据编辑器 — 在线编辑 Office 文件元数据",
    description: "免费在线 Office 元数据编辑器，支持 Word、Excel、PowerPoint、PDF 文件元数据的读取、编辑和批量处理。全程本地运行，无需上传。",
    keywords: "Office, 元数据, 编辑器, Word, Excel, PowerPoint, PDF, 批量处理",
    canonical: "https://office-metadata-editor.vercel.app",
    indexable: true,
    depth: 1,
  },
  {
    path: "/editor",
    title: "元数据编辑 — Office 元数据编辑器",
    description: "在线编辑 Office 文件元数据，支持标题、作者、主题、关键词等字段的读取与修改。",
    keywords: "元数据, 编辑, Office, 文件属性",
    canonical: "https://office-metadata-editor.vercel.app/editor",
    indexable: true,
    depth: 2,
  },
  {
    path: "/batch",
    title: "批量处理 — Office 元数据编辑器",
    description: "批量处理 Office 文件元数据，一次操作多个文件的元数据编辑与清理。",
    keywords: "批量处理, 元数据, Office, 批量编辑",
    canonical: "https://office-metadata-editor.vercel.app/batch",
    indexable: true,
    depth: 2,
  },
]
