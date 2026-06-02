"use client"

import React from "react"
import { Link } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { seoMap } from "@/seo/seo-map"
import { ChevronRight, Home } from "lucide-react"

interface OmBreadcrumbsProps {
  pageCode: string
}

export const OmBreadcrumbs: React.FC<OmBreadcrumbsProps> = ({ pageCode }) => {
  const locale = useLocale()
  const isEn = locale === "en"

  const currentSeo = seoMap[pageCode]
  if (!currentSeo) return null

  const chain: Array<{ label: string; path: string }> = []

  // 1. 获取父级链
  if (currentSeo.parentPageCode) {
    const parentSeo = seoMap[currentSeo.parentPageCode]
    if (parentSeo) {
      const label = isEn
        ? (parentSeo.en?.h1 || parentSeo.en?.title || "Home")
        : (parentSeo.h1 || parentSeo.title || "首页")
      chain.push({ label, path: parentSeo.path })
    }
  } else if (currentSeo.pageCode !== "home") {
    const homeSeo = seoMap["home"]
    if (homeSeo) {
      const label = isEn ? "Home" : "首页"
      chain.push({ label, path: homeSeo.path })
    }
  }

  // 2. 添加当前页
  const currentLabel = isEn
    ? (currentSeo.en?.h1 || currentSeo.en?.title || currentSeo.primaryKeyword)
    : (currentSeo.h1 || currentSeo.title || currentSeo.primaryKeyword)
  
  chain.push({ label: currentLabel, path: currentSeo.path })

  return (
    <nav aria-label="Breadcrumb" className="mb-6 select-none">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {chain.map((item, index) => {
          const isLast = index === chain.length - 1
          
          // 如果当前页是 home 且面包屑已经添加了 Home，不要重复显示
          if (item.path === "/" && index === 0 && chain.length > 1) {
            return null
          }

          return (
            <li key={item.path} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              {isLast ? (
                <span className="font-medium text-foreground truncate max-w-50 sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default OmBreadcrumbs
