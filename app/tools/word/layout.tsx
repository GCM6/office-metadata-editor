import { generateSeoMetadata } from "@/seo/generate-seo-metadata"

export const metadata = generateSeoMetadata("tool.word")

export default function ToolWordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
