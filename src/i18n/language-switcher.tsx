"use client"

import React, { useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations("common")
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const nextLocale = locale === "zh-CN" ? "en" : "zh-CN"
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
      window.location.reload()
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className="gap-2 rounded-full bg-card/75 backdrop-blur-sm"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">{locale === "zh-CN" ? t("langEn") : t("langZh")}</span>
    </Button>
  )
}
