import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { NotFoundContent } from "./not-found-content"

export async function generateMetadata(): Promise<Metadata> {
  let title = "Page Not Found | MetaDocu"
  try {
    const t = await getTranslations("common")
    title = t("notFoundTitle")
  } catch {
    // fallback during static generation
  }

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function NotFound() {
  return <NotFoundContent />
}
