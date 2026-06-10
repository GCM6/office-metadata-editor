import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { generateSeoMetadata } from "@/seo/generate-seo-metadata"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return generateSeoMetadata("trust.is-it-safe", locale)
}

export default function IsItSafeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
