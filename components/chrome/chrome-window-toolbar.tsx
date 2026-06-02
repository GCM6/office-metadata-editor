"use client"

import { useTranslations } from "next-intl"

export const WINDOW_CHROME_HEIGHT = 32

export function ChromeWindowToolbar() {
  const t = useTranslations("common")

  return (
    <div className="chrome-window-toolbar" aria-label={t("dragArea")} data-tauri-drag-region>
    </div>
  )
}
