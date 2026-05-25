import { generateSeoMetadata } from "@/seo/generate-seo-metadata"

export const metadata = generateSeoMetadata("tool.excel")

export default function ToolExcelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
