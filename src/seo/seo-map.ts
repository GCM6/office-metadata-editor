import type { SeoMap } from "./seo-types"

/**
 * 全局 SEO 契约 Map
 *
 * 以 pageCode 为 key，集中管理所有页面的 SEO 元数据。
 * 新增页面时只需在此 Map 中添加对应条目即可。
 */
export const seoMap: SeoMap = {
  home: {
    pageCode: "home",
    pageType: "website",
    intent: "informational",
    path: "/",
    title: "Office 元数据编辑器 - 在线查看、编辑、清理 Office 文档元数据",
    description:
      "一款免费的在线 Office 文档元数据编辑器，支持 Word、Excel、PowerPoint 等格式的元数据查看、编辑、清理，支持批量处理，全程本地运行确保数据安全。",
    keywords: [
      "Office",
      "元数据",
      "编辑器",
      "Word",
      "Excel",
      "PowerPoint",
      "清理",
      "批量处理",
      "在线工具",
    ],
    ogImage: "/logo.svg",
    ogImageAlt: "Office 元数据编辑器",
    schemaTypes: ["Organization", "WebSite"],
  },
  editor: {
    pageCode: "editor",
    pageType: "website",
    intent: "transactional",
    path: "/editor",
    title: "编辑文档元数据 - Office 元数据编辑器",
    description:
      "在线编辑 Office 文档元数据，支持可视化字段编辑、拖拽排序、实时预览，编辑完成后一键导出，数据全程本地处理。",
    keywords: ["元数据编辑", "Office", "文档属性", "在线编辑", "字段修改"],
    noIndex: true,
    schemaTypes: ["BreadcrumbList"],
  },
  batch: {
    pageCode: "batch",
    pageType: "website",
    intent: "transactional",
    path: "/batch",
    title: "批处理文档元数据 - Office 元数据编辑器",
    description:
      "批量处理多个 Office 文档的元数据，支持一键清理、批量复制、统一替换等操作，大幅提升文档管理效率。",
    keywords: ["批量处理", "元数据", "Office", "批处理", "文档管理", "批量清理"],
    noIndex: true,
    schemaTypes: ["BreadcrumbList"],
  },
} as const
