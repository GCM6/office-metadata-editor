import type { Metadata } from "next"
import { generateSeoMetadata } from "@/seo/generate-seo-metadata"

export const metadata: Metadata = generateSeoMetadata("batch")

export default function BatchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
