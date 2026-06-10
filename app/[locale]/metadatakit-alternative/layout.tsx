import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { generateSeoMetadata } from "@/seo/generate-seo-metadata"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generateSeoMetadata("compare.metadatakit", locale)
}

export default function MetadatakitAlternativeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
