"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Mail } from "lucide-react"

export const OmFooter: React.FC = () => {
  const t = useTranslations("footer")
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {/* 左侧链接 */}
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground" aria-label="Footer navigation">
          <FooterLink href="/about">{t("linkAbout")}</FooterLink>
          <FooterLink href="/is-it-safe">{t("linkSafe")}</FooterLink>
          <FooterLink href="/privacy">{t("linkPrivacy")}</FooterLink>
          <FooterLink href="/terms">{t("linkTerms")}</FooterLink>
          <span className="hidden h-3 w-px bg-border/60 sm:inline-block" />
          <FooterLink href="/editor">{t("linkEditor")}</FooterLink>
          <FooterLink href="/batch">{t("linkBatch")}</FooterLink>
          <FooterLink href="/tools/word">{t("linkWord")}</FooterLink>
          <FooterLink href="/tools/excel">{t("linkExcel")}</FooterLink>
          <FooterLink href="/tools/pdf">{t("linkPdf")}</FooterLink>
        </nav>

        {/* 右侧版权 + 邮箱 */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground select-none">
          <a
            href={`mailto:${t("contactEmail")}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Mail className="h-3 w-3" />
            {t("contactEmail")}
          </a>
          <span className="h-3 w-px bg-border/60" />
          <span>{t("copyright", { year })}</span>
        </div>
      </div>
    </footer>
  )
}

const FooterLink: React.FC<React.PropsWithChildren<{ href: string }>> = ({ href, children }) => (
  <Link href={href} className="transition-colors hover:text-foreground">
    {children}
  </Link>
)

export default OmFooter

