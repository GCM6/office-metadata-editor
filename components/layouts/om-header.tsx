"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CloudSun, Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { LanguageSwitcher } from "@/i18n/language-switcher"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { APP_NAME } from "@/lib/app-config"

interface NavItem {
  href: string
  key: "word" | "excel" | "pdf" | "isItSafe" | "blog" | "about"
}

// Header surfaces our own core assets (tool hubs + trust + blog/about). The
// competitor-comparison page is deliberately NOT here: it's a bottom-funnel
// landing page reached via search / AI, and putting a competitor-branded page in
// global nav would funnel site-wide internal-link weight to it on every page.
const NAV_ITEMS: NavItem[] = [
  { href: "/tools/word", key: "word" },
  { href: "/tools/excel", key: "excel" },
  { href: "/tools/pdf", key: "pdf" },
  { href: "/is-it-safe", key: "isItSafe" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
]

/**
 * Site-wide top navigation. Uses plain, always-rendered anchor links (not a
 * JS-only dropdown) so the internal links to the level-1 tool hubs are present
 * in the static HTML — crawlable for SEO and the GEO internal-link reflow.
 */
export const OmHeader: React.FC = () => {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <header className="z-40 border-b border-border/60 bg-card/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={APP_NAME}>
          <Image src="/logo.svg" alt="" width={26} height={26} className="h-[26px] w-[26px]" />
          <span className="text-base font-bold tracking-tight text-foreground">{APP_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/75 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="border-t border-border/60 bg-card/95 px-5 py-3 backdrop-blur-md md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/90 hover:bg-muted/60"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
          <div className="mt-3 border-t border-border/50 pt-3 sm:hidden">
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  )
}

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const tc = useTranslations("common")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={tc("theme")}
          className="gap-2 rounded-full bg-card/75 backdrop-blur-sm"
        >
          {!mounted ? (
            <Sun className="h-4 w-4" />
          ) : theme === "system" ? (
            <CloudSun className="h-4 w-4" />
          ) : resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{tc("theme")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as "dark" | "light" | "system")}
        >
          <DropdownMenuRadioItem value="light">{tc("light")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">{tc("dark")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">{tc("systemFollow")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default OmHeader
