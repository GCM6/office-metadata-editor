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
                一站式 Office 文档元数据处理
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
                Office元数据编辑器是一款专业的在线Office文档属性管理工具。
                无论您需要<strong>修改Word文档作者信息</strong>、<strong>清除PDF文件中的隐藏属性</strong>、
                还是<strong>批量处理Excel工作簿元数据</strong>，都能在浏览器中一站式完成。
                所有处理均在本地执行，文件不会离开您的设备，完全保障数据安全与文档隐私。
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
                  <FileText className="mb-3 h-8 w-8 text-blue-500" />
                  <h3 className="mb-2 text-base font-semibold text-foreground">Word 文档元数据</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    在线修改 DOCX 文档的作者、标题、公司、创建时间等属性。支持清除修订历史、隐藏信息等敏感元数据，保护您的文档隐私不被泄露。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
                  <FileSpreadsheet className="mb-3 h-8 w-8 text-green-500" />
                  <h3 className="mb-2 text-base font-semibold text-foreground">Excel 工作簿属性</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    编辑 XLSX 工作簿的作者、标题、标签、备注等信息。批量清除多个 Excel
                    文件的元数据，适用于企业文件合规检查与信息安全管理场景。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
                  <FileType className="mb-3 h-8 w-8 text-red-500" />
                  <h3 className="mb-2 text-base font-semibold text-foreground">PDF 属性编辑</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    在线编辑 PDF 文件的标题、作者、主题、关键词等元数据信息。无需安装 Adobe
                    Acrobat，浏览器直接操作，安全高效。
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">常见问题</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FaqItem
                  question="如何在线修改Word文档的作者信息？"
                  answer="打开Office元数据编辑器，上传Word文档，在编辑器界面中找到作者字段，修改后保存即可。整个过程在浏览器本地完成，文档不会上传到任何服务器。"
                />
                <FaqItem
                  question="Office文档元数据包含哪些信息？"
                  answer="元数据包括作者名称、创建时间、修改时间、公司名称、标题、主题、标签、备注等。这些信息可能在不经意间泄露您的个人或公司隐私。"
                />
                <FaqItem
                  question="PDF文件的属性信息可以修改吗？"
                  answer="可以。通过在线Office元数据编辑器上传PDF文件，即可编辑标题、作者、主题等属性信息。所有处理在浏览器本地完成，安全便捷。"
                />
                <FaqItem
                  question="如何批量清除多个文档的元数据？"
                  answer="打开批量处理工作台，添加多个文件，选择批量清除功能即可一键清除所有文件的元数据信息。支持Word、Excel、PDF文件混合批量处理。"
                />
                <FaqItem
                  question="在线修改文档元数据安全吗？"
                  answer="非常安全。本工具全程在浏览器本地处理，您的文件不会上传到任何服务器，所有操作都在您的设备上完成，完全保护数据隐私。"
                />
                <FaqItem
                  question="修改Word文档属性后对方能发现吗？"
                  answer="不会。一旦使用本编辑器修改或清除元数据字段（如原始作者、创建日期、修订历史），原有信息将被永久覆盖或删除，文件看起来像是新建的。"
                />
              </div>
            </section>

            <section className="mb-8 rounded-lg border border-border/60 bg-muted/40 p-6">
              <h4 className="mb-3 text-sm font-semibold text-foreground">快速入口</h4>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/editor"
                  className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
                >
                  在线编辑Word文档属性
                </Link>
                <Link
                  href="/editor"
                  className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
                >
                  修改DOCX作者信息
                </Link>
                <Link
                  href="/editor"
                  className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
                >
                  清除Office文档元数据
                </Link>
                <Link
                  href="/batch"
                  className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
                >
                  批量修改文档属性
                </Link>
                <Link
                  href="/editor"
                  className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
                >
                  在线PDF属性编辑
                </Link>
                <Link
                  href="/batch"
                  className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary/60"
                >
                  批量清除Excel元数据
                </Link>
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
