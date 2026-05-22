"use client"

import React, { useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "./navigation"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("common")
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const nextLocale = locale === "zh-CN" ? "en" : "zh-CN"
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
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
