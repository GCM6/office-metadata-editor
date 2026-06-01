"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"

export function NotFoundContent() {
  const t = useTranslations("common")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground/40">404</h1>
      <p className="mt-4 text-lg font-medium text-foreground">{t("notFoundHeading")}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("notFoundDescription")}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t("notFoundBackHome")}
      </Link>
    </main>
  )
}
