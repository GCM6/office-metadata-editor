"use client"

import React from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Mail } from "lucide-react"
import { getPublishedPages } from "@/seo/seo-map"
import type { SeoPageContract } from "@/seo/seo-types"

// Surface every indexable long-tail landing page (comparisons / guides /
// scenarios / research) site-wide. These pages otherwise get NO global internal
// links (header + footer only pointed at the tool hubs), which starves them of
// internal PageRank and is the main reason Google reports them as
// "Discovered – currently not indexed". A site-wide footer link from a
// high-crawl-frequency location is the highest-leverage fix.
const GUIDE_PREFIXES = ["compare.", "guide.", "scenario.", "research."]

function getGuideLinks(): SeoPageContract[] {
  return getPublishedPages()
    .filter((p) => GUIDE_PREFIXES.some((prefix) => p.pageCode.startsWith(prefix)))
    .sort((a, b) => a.pageCode.localeCompare(b.pageCode))
}

export const OmFooter: React.FC = () => {
  const t = useTranslations("footer")
  const locale = useLocale()
  const isEn = locale === "en"
  const year = new Date().getFullYear()

  const guideLinks = getGuideLinks()

  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:px-8">
        {/* Guides & scenarios — site-wide internal links for crawl/indexation */}
        {guideLinks.length > 0 && (
          <nav
            className="flex flex-col gap-2 border-b border-border/50 pb-4"
            aria-label={t("guidesTitle")}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground/70">
              {t("guidesTitle")}
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
              {guideLinks.map((page) => (
                <FooterLink key={page.pageCode} href={page.path}>
                  {isEn ? (page.en?.h1 ?? page.h1) : page.h1}
                </FooterLink>
              ))}
            </div>
          </nav>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Tools + legal */}
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground"
            aria-label="Footer navigation"
          >
            <FooterLink href="/tools/word">{t("linkWord")}</FooterLink>
            <FooterLink href="/tools/excel">{t("linkExcel")}</FooterLink>
            <FooterLink href="/tools/pdf">{t("linkPdf")}</FooterLink>
            <span className="hidden h-3 w-px bg-border/60 sm:inline-block" />
            <FooterLink href="/about">{t("linkAbout")}</FooterLink>
            <FooterLink href="/is-it-safe">{t("linkSafe")}</FooterLink>
            <FooterLink href="/privacy">{t("linkPrivacy")}</FooterLink>
            <FooterLink href="/terms">{t("linkTerms")}</FooterLink>
          </nav>

          {/* Copyright + email */}
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
