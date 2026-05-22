"use client"

export const dynamic = "force-dynamic"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { SUPPORTED_FILE_EXTENSIONS } from "@/lib/documents/supported-formats"
import { APP_NAME } from "@/lib/app-config"
import BlankLayout from "@/layouts/blank-layout"

export default function HomePage() {
  const router = useRouter()
  const { openFiles, isLoading, clearFiles } = useFileContext()
  const { theme, resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    clearFiles()
  }, [clearFiles])

  const handleOpenFiles = async () => {
    const added = await openFiles()
    if (added === 0) return

    router.push("/editor")
  }

  return (
    <BlankLayout>
      <div className="relative h-full w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_14%_12%,oklch(0.9_0.11_245/0.18),transparent_48%),radial-gradient(circle_at_86%_78%,oklch(0.88_0.1_162/0.16),transparent_46%)] dark:bg-[radial-gradient(circle_at_14%_12%,oklch(0.4_0.11_245/0.24),transparent_48%),radial-gradient(circle_at_86%_78%,oklch(0.4_0.08_162/0.22),transparent_46%)]" />

        <div className="relative flex h-full flex-col px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="rounded-full border border-border/70 bg-card/75 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm select-none">
              {APP_NAME}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full bg-card/75 backdrop-blur-sm"
                >
                  {theme === "system" ? (
                    <CloudSun className="h-4 w-4" />
                  ) : resolvedTheme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>主题</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={value => setTheme(value as "dark" | "light" | "system")}
                >
                  <DropdownMenuRadioItem value="light">白天</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">暗黑</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">跟随系统</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-6 py-4 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-xl border border-border/70 bg-card/72 p-6 shadow-xl backdrop-blur-sm sm:p-9">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary select-none">
                <Sparkles className="h-3.5 w-3.5" />
                一秒进入工作状态
              </p>
              <h1 className="text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl select-none">
                Office 元数据编辑器
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base select-none">
                读取、编辑、清理、批处理全部本地完成，支持多格式文档的元数据处理。
              </p>

              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <OmFeatureItem icon={ShieldCheck} text="全程本地" />
                <OmFeatureItem icon={Upload} text="拖拽即用" />
                <OmFeatureItem icon={Zap} text="批量提速" />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <button
                  type="button"
                  onClick={() => router.push("/batch")}
                  className="group flex items-center justify-between rounded-2xl border border-primary/25 bg-primary/12 px-4 py-3 text-left transition-colors hover:bg-primary/18"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Layers3 className="h-4 w-4" />
                    打开批量处理工作台
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
                </button>
                <Button
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => void handleOpenFiles()}
                >
                  直接开始编辑
                </Button>
              </div>

              <p className="mt-4 text-xs text-muted-foreground select-none">更多高级能力正在路上，敬请期待。</p>
            </section>

            <section className="mx-auto w-full max-w-125 rounded-xl border border-border/70 bg-card/82 p-5 shadow-xl backdrop-blur-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3 select-none">
                <div>
                  <p className="text-sm font-semibold text-foreground">拖拽上传并开始</p>
                  <p className="text-xs text-muted-foreground">
                    单文件编辑或多文件批处理都可从这里进入
                  </p>
                </div>
              </div>

              <OmFileUploadZone onOpenFiles={handleOpenFiles} isLoading={isLoading} />

              <div className="mt-8">
                <p className="mb-2 text-xs font-medium text-muted-foreground select-none">支持的文件类型</p>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_FILE_EXTENSIONS.map(type => (
                    <OmFileTypeBadge key={type} type={type} supported />
                  ))}
                </div>
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
