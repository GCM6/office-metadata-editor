import { generateSeoMetadata } from "@/seo/generate-seo-metadata"

export const metadata = generateSeoMetadata("blog")

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
