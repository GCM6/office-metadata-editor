"use client"

export const dynamic = "force-dynamic"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/i18n/language-switcher"
import { useFileContext } from "@/contexts/file-context"
import { useTheme } from "@/components/theme-provider"
import { OmFileUploadZone } from "@/components/om/om-file-upload-zone"
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
import {
  ArrowRight,
  CloudSun,
  Layers3,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  Zap,
  FileText,
  FileSpreadsheet,
  FileType,
} from "lucide-react"
import { SUPPORTED_FILE_EXTENSIONS } from "@/lib/documents/supported-formats"
import { APP_NAME } from "@/lib/app-config"
import BlankLayout from "@/layouts/blank-layout"

export default function HomePage() {
  const router = useRouter()
  const { openFiles, isLoading, clearFiles } = useFileContext()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const t = useTranslations("home")
  const tc = useTranslations("common")
  const [mounted, setMounted] = useState(false)
  const faqItems = t.raw("faqItems") as Array<{ q: string; a: string }>
  const quickLinks = t.raw("quickLinks") as Array<{ label: string; href: string }>

  useEffect(() => {
    setMounted(true)
    clearFiles()
  }, [clearFiles])

  const handleOpenFiles = async () => {
    const added = await openFiles()
    if (added === 0) return

    router.push("/editor")
  }

  return (
    <BlankLayout>
      <div className="relative h-full w-full overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_14%_12%,oklch(0.9_0.11_245/0.18),transparent_48%),radial-gradient(circle_at_86%_78%,oklch(0.88_0.1_162/0.16),transparent_46%)] dark:bg-[radial-gradient(circle_at_14%_12%,oklch(0.4_0.11_245/0.24),transparent_48%),radial-gradient(circle_at_86%_78%,oklch(0.4_0.08_162/0.22),transparent_46%)]" />

        <div className="relative flex flex-col px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="rounded-full border border-border/70 bg-card/75 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm select-none">
              {APP_NAME}
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
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
                  onValueChange={value => setTheme(value as "dark" | "light" | "system")}
                >
                  <DropdownMenuRadioItem value="light">{tc("light")}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">{tc("dark")}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">{tc("systemFollow")}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </div>

          <div className="mx-auto w-full max-w-6xl">
            <div className="grid grid-cols-1 items-center gap-6 py-4 lg:grid-cols-[1.05fr_0.95fr]">
              <section className="rounded-xl border border-border/70 bg-card/72 p-6 shadow-xl backdrop-blur-sm sm:p-9">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary select-none">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("enterWorkState")}
                </p>
                <h1 className="text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl select-none">
                  {tc("appTitle")}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base select-none">
                  {t("description")}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <OmFeatureItem icon={ShieldCheck} text={t("featureLocal")} />
                  <OmFeatureItem icon={Upload} text={t("featureDragDrop")} />
                  <OmFeatureItem icon={Zap} text={t("featureBatch")} />
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <button
                    type="button"
                    onClick={() => router.push("/batch")}
                    className="group flex items-center justify-between rounded-2xl border border-primary/25 bg-primary/12 px-4 py-3 text-left transition-colors hover:bg-primary/18"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Layers3 className="h-4 w-4" />
                      {t("openBatchWorkspace")}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <Button
                    variant="secondary"
                    className="rounded-xl"
                    onClick={() => void handleOpenFiles()}
                  >
                    {t("startEditing")}
                  </Button>
                </div>

                <p className="mt-4 text-xs text-muted-foreground select-none">{t("moreComing")}</p>
              </section>

              <section className="mx-auto w-full max-w-125 rounded-xl border border-border/70 bg-card/82 p-5 shadow-xl backdrop-blur-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3 select-none">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t("dragUploadStart")}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("singleOrBatchDesc")}
                    </p>
                  </div>
                </div>

                <OmFileUploadZone onOpenFiles={handleOpenFiles} isLoading={isLoading} />

                <div className="mt-8">
                  <p className="mb-2 text-xs font-medium text-muted-foreground select-none">{t("supportedFileTypes")}</p>
                  <div className="flex flex-wrap gap-2">
                    {SUPPORTED_FILE_EXTENSIONS.map(type => (
                      <OmFileTypeBadge key={type} type={type} supported />
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <section className="mt-8 mb-12">
              <h2 className="mb-6 text-center text-xl font-bold text-foreground sm:text-2xl">
                {t("seoSectionTitle")}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
                {t.rich("seoSectionDesc", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
                  <FileText className="mb-3 h-8 w-8 text-blue-500" />
                  <h3 className="mb-2 text-base font-semibold text-foreground">{t("featureWordTitle")}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("featureWordDesc")}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
                  <FileSpreadsheet className="mb-3 h-8 w-8 text-green-500" />
                  <h3 className="mb-2 text-base font-semibold text-foreground">{t("featureExcelTitle")}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("featureExcelDesc")}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
                  <FileType className="mb-3 h-8 w-8 text-red-500" />
                  <h3 className="mb-2 text-base font-semibold text-foreground">{t("featurePdfTitle")}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("featurePdfDesc")}
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">{t("faqTitle")}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {faqItems.map((item, index) => (
                  <FaqItem key={index} question={item.q} answer={item.a} />
                ))}
              </div>
            </section>

            <section className="mb-8 rounded-lg border border-border/60 bg-muted/40 p-6">
              <h4 className="mb-3 text-sm font-semibold text-foreground">{t("quickEntry")}</h4>
              <div className="flex flex-wrap gap-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </BlankLayout>
  )
}

interface OmFeatureItemProps {
  icon: React.FC<{ className?: string }>
  text: string
}

const OmFeatureItem: React.FC<OmFeatureItemProps> = ({ icon: Icon, text }) => {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-muted-foreground">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs font-medium select-none">{text}</span>
    </div>
  )
}

interface OmFileTypeBadgeProps {
  type: string
  supported: boolean
}

const OmFileTypeBadge: React.FC<OmFileTypeBadgeProps> = ({ type, supported }) => {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-medium ${
        supported
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground line-through opacity-50"
      }`}
    >
      .{type}
    </span>
  )
}

interface FaqItemProps {
  question: string
  answer: string
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 p-4 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-foreground/90">{question}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{answer}</p>
    </div>
  )
}
