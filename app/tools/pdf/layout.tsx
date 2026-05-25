import { generateSeoMetadata } from "@/seo/generate-seo-metadata"

export const metadata = generateSeoMetadata("tool.pdf")

export default function ToolPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
