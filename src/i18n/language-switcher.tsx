"use client"

import React, { useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations("common")
  const [isPending, startTransition] = useTransition()

  const isZh = locale.toLowerCase().startsWith("zh")

  const handleToggle = () => {
    const nextLocale = isZh ? "en" : "zh-CN"
    startTransition(() => {
      // 写入最强兼容性的双层 Cookie，确保无论在 Electron/Tauri Webview 还是普通浏览器中都能被写入并持久化
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/`
      
      // 写入 localStorage 作为双保险备用
      try {
        localStorage.setItem("NEXT_LOCALE", nextLocale)
      } catch {
        // Ignore
      }

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
      <span className="text-xs font-medium">{isZh ? t("langEn") : t("langZh")}</span>
    </Button>
  )
}
