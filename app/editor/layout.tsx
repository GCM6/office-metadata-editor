import type { Metadata } from "next"
import { generateSeoMetadata } from "@/seo/generate-seo-metadata"

export const metadata: Metadata = generateSeoMetadata("editor")

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
