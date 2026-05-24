import { generateJsonLd } from "./generate-json-ld"

/**
 * JSON-LD 注入组件
 *
 * 以 <script type="application/ld+json"> 方式将结构化数据注入页面 <head>。
 * 在 Next.js App Router 中，通常在 layout.tsx 或 page.tsx 的 metadata 生成时使用，
 * 或直接作为 JSX 组件插入 <head>。
 *
 * @param pageCode - 页面唯一标识，对应 seoMap 中的 key
 *
 * @example
 * ```tsx
 * // 在 layout.tsx 中使用
 * import { JsonLd } from "@/seo/json-ld"
 * // ...
 * <head>
 *   <JsonLd pageCode="home" />
 * </head>
 * ```
 */
export function JsonLd({ pageCode }: { pageCode: string }) {
  const jsonLdObjects = generateJsonLd(pageCode)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          jsonLdObjects.length === 1 ? jsonLdObjects[0] : jsonLdObjects,
        ),
      }}
    />
  )
}
