import React, { useEffect, useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { useWasmWorker } from "@/hooks/useWasmWorker"
import { getFileData, setFileData } from "@/lib/resources/file-store"
import { normalizeDocumentFileType } from "@/lib/documents/file-type"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  RotateCw,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  ArrowLeft,
  CheckCircle2,
  FileText,
} from "lucide-react"
import { useRouter } from "@/i18n/navigation"

// 定义敏感审计字段类型
interface SensitiveField {
  id: string
  key: string
  category: "identity" | "organization" | "path" | "history" | "media" | "software"
  label: string
  value: string
  riskLevel: "high" | "medium" | "low"
}

export interface OmAuditReportProps {
  fileId: string
  filePath: string
  fileName: string
  onClose: () => void
}

export const OmAuditReport: React.FC<OmAuditReportProps> = ({
  filePath,
  fileName,
  onClose,
}) => {
  const router = useRouter()
  const t = useTranslations("audit")
  const tf = useTranslations("fields")

  // 1. Worker 与文件字节准备
  const { worker, ready } = useWasmWorker()
  const originalBytes = useMemo(() => getFileData(filePath), [filePath])

  // 2. 状态机管理
  const [activeStep, setActiveStep] = useState(0)
  const [isScanning, setIsScanning] = useState(true)
  const [metadata, setMetadata] = useState<any>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isCleaning, setIsCleaning] = useState(false)
  const [cleanedBytes, setCleanedBytes] = useState<Uint8Array | null>(null)
  const [showFullValues, setShowFullValues] = useState<Record<string, boolean>>({})
  const [scanTime, setScanTime] = useState(0.8)

  const fileExt = useMemo(() => {
    return normalizeDocumentFileType(fileName.split(".").pop() || "")
  }, [fileName])

  // 3. 4步骤渐进打勾扫描动画
  useEffect(() => {
    if (!ready || !worker || !originalBytes) return

    let currentStep = 0
    setActiveStep(0)
    setIsScanning(true)

    const interval = setInterval(() => {
      currentStep += 1
      setActiveStep(currentStep)
      if (currentStep >= 4) {
        clearInterval(interval)
        
        // 扫描完成，向 Worker 发送解析请求
        const startTime = performance.now()
        worker.postMessage({
          type: "PARSE",
          fileBytes: originalBytes,
          fileName,
        })

        const handleWorkerMessage = (e: MessageEvent) => {
          const { success, type, data, error } = e.data
          if (success && type === "PARSE_SUCCESS") {
            const duration = ((performance.now() - startTime) / 1000).toFixed(2)
            setScanTime(Number(duration) || 0.6)
            setMetadata(data)
            setTimeout(() => {
              setIsScanning(false)
            }, 300)
          } else {
            console.error("Wasm 解析失败:", error)
            setTimeout(() => {
              setIsScanning(false)
            }, 300)
          }
          worker.removeEventListener("message", handleWorkerMessage)
        }

        worker.addEventListener("message", handleWorkerMessage)
      }
    }, 600) // 步长 600ms 营造扎实的沙箱审计质感

    return () => clearInterval(interval)
  }, [ready, worker, originalBytes, fileName])

  // 4. 分析提取敏感审计字段
  const sensitiveFields = useMemo<SensitiveField[]>(() => {
    if (!metadata) return []

    const fields: SensitiveField[] = []
    const docProps = metadata.documentProperties || {}
    const appProps = metadata.appProperties || {}

    // A. 身份泄露 (Identity)
    const creator = docProps.creator || metadata.coreProperties?.dcCreator || ""
    if (creator && creator.trim() !== "") {
      fields.push({
        id: "creator",
        key: "creator",
        category: "identity",
        label: tf("labels.creator", { defaultValue: "Creator" }),
        value: creator,
        riskLevel: "medium",
      })
    }
    const lastModifier = docProps.lastModifiedBy || ""
    if (lastModifier && lastModifier.trim() !== "") {
      fields.push({
        id: "lastModifiedBy",
        key: "lastModifiedBy",
        category: "identity",
        label: tf("labels.lastModifiedBy", { defaultValue: "Last Modified By" }),
        value: lastModifier,
        riskLevel: "medium",
      })
    }
    const manager = appProps.manager || ""
    if (manager && manager.trim() !== "") {
      fields.push({
        id: "manager",
        key: "manager",
        category: "identity",
        label: tf("labels.manager", { defaultValue: "Manager" }),
        value: manager,
        riskLevel: "medium",
      })
    }

    // B. 公司与组织泄露 (Organization)
    const company = appProps.company || ""
    if (company && company.trim() !== "") {
      fields.push({
        id: "company",
        key: "company",
        category: "organization",
        label: tf("labels.company", { defaultValue: "Company" }),
        value: company,
        riskLevel: "medium",
      })
    }

    // C. 绝对路径暴露 (Local Path)
    const template = appProps.template || ""
    if (template && template.trim() !== "") {
      const isAbsolutePath =
        template.includes("\\") ||
        template.includes("/") ||
        template.includes("Users") ||
        template.includes("AppData")
      
      if (isAbsolutePath) {
        fields.push({
          id: "template",
          key: "template",
          category: "path",
          label: tf("labels.template", { defaultValue: "Template Absolute Path" }),
          value: template,
          riskLevel: "high",
        })
      }
    }

    // D. 软件版本暴露 (Software Fingerprint)
    const application = appProps.application || ""
    if (application && application.trim() !== "") {
      fields.push({
        id: "application",
        key: "application",
        category: "software",
        label: tf("labels.application", { defaultValue: "Software Fingerprint" }),
        value: `${application} (v${appProps.appVersion || t("unknownVersion")})`,
        riskLevel: "low",
      })
    }

    // E. 协作次数历史 (History)
    const revision = docProps.revision || ""
    if (revision && parseInt(revision, 10) > 1) {
      fields.push({
        id: "revision",
        key: "revision",
        category: "history",
        label: tf("labels.revision", { defaultValue: "Revision Count" }),
        value: t("revisionValue", { count: revision }),
        riskLevel: "medium",
      })
    }

    // F. Office 文档嵌套多媒体多图 GPS 隐患
    if (fileExt === "docx" || fileExt === "xlsx") {
      fields.push({
        id: "embedded_media",
        key: "embedded_media",
        category: "media",
        label: t("mediaLabel"),
        value: t("mediaValue"),
        riskLevel: "medium",
      })
    }

    return fields
  }, [metadata, t, tf, fileExt])

  // 5. 计算总体风险等级
  const overallRisk = useMemo<"high" | "medium" | "low">(() => {
    if (sensitiveFields.length === 0) return "low"
    const hasHigh = sensitiveFields.some(f => f.riskLevel === "high")
    if (hasHigh) return "high"
    return "medium"
  }, [sensitiveFields])

  // 6. 路径与敏感字符自动脱敏折叠函数
  const redactValue = (val: string, category: string, fieldId: string) => {
    if (showFullValues[fieldId]) return val

    if (category === "path" || val.includes("\\") || val.includes("/")) {
      // 对物理路径脱敏：保留盘符或根目录，中间截断隐藏
      const parts = val.split(/[\\/]/)
      if (parts.length > 2) {
        const start = parts[0]
        const file = parts[parts.length - 1]
        return `${start}\\...\\***\\${file}`
      }
      return `${val.substring(0, 5)}***${val.substring(val.length - 5)}`
    }

    if (category === "identity" && val.length > 1) {
      // 对作者名等脱敏
      return val.substring(0, 1) + "***"
    }

    if (category === "organization" && val.length > 3) {
      return val.substring(0, 2) + "***"
    }

    return val
  }

  // 7. 一键本地脱敏清理 (Remove Metadata Locally)
  const handleRemoveMetadata = () => {
    if (!worker || !originalBytes || isCleaning) return

    setIsCleaning(true)
    
    // 向 Worker 线程投递清理指令
    worker.postMessage({
      type: "CLEAN",
      fileBytes: originalBytes,
      fileName,
    })

    const handleCleanMessage = (e: MessageEvent) => {
      const { success, type, data, error } = e.data
      if (success && type === "CLEAN_SUCCESS") {
        const cleaned: Uint8Array = data
        setCleanedBytes(cleaned)
        // 将清理后的文件存回内存中，同步更新状态
        setFileData(filePath, cleaned)

        setTimeout(() => {
          setIsCleaning(false)
          setIsFlipped(true) // 3D 翻转卡片到背面！
          
          // 自动触发无网络安全下载
          triggerFileDownload(cleaned)
        }, 600)
      } else {
        console.error("Wasm 清理失败:", error)
        setIsCleaning(false)
      }
      worker.removeEventListener("message", handleCleanMessage)
    }

    worker.addEventListener("message", handleCleanMessage)
  }

  // 8. 触发无网络前端 Blob 下载
  const triggerFileDownload = (bytes: Uint8Array) => {
    const mimeTypes: Record<string, string> = {
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pdf: "application/pdf",
    }
    const type = mimeTypes[fileExt] || "application/octet-stream"
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type })
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = downloadUrl
    
    // 加入 [Cleaned] 后缀
    const parts = fileName.split(".")
    const ext = parts.pop()
    const cleanName = `${parts.join(".")}_[Cleaned].${ext}`
    
    link.download = cleanName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 延时撤销 Object URL，保障垃圾回收
    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl)
    }, 5000)
  }

  // 9. 切换脱敏字段显隐状态
  const toggleRedact = (fieldId: string) => {
    setShowFullValues(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full select-none">
      {/* 3D 动画翻转效果专有 inline style */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}} />

      {/* 扫描进行中的极客分步动画 */}
      {isScanning ? (
        <Card className="w-full max-w-xl bg-card/85 border border-border/80 p-8 shadow-2xl rounded-2xl backdrop-blur-md">
          <div className="flex flex-col items-center justify-center py-6">
            <RotateCw className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-1 select-none">
              Scanning locally...
            </h3>
            <p className="text-xs text-muted-foreground mb-8">
              🔒 100% Local · Your files never leave your device
            </p>

            <div className="w-full max-w-sm space-y-4">
              <StepItem
                label={t("steps.reading")}
                status={activeStep > 0 ? "success" : activeStep === 0 ? "active" : "pending"}
              />
              <StepItem
                label={t("steps.extracting")}
                status={activeStep > 1 ? "success" : activeStep === 1 ? "active" : "pending"}
              />
              <StepItem
                label={t("steps.checking")}
                status={activeStep > 2 ? "success" : activeStep === 2 ? "active" : "pending"}
              />
              <StepItem
                label={t("steps.generating")}
                status={activeStep > 3 ? "success" : activeStep === 3 ? "active" : "pending"}
              />
            </div>
          </div>
        </Card>
      ) : (
        /* 3D 正反翻转卡片容器 */
        <div className="perspective-1000 w-full max-w-xl min-h-130 aspect-[4.2/3] relative">
          <div 
            className="relative w-full h-full preserve-3d transition-transform duration-700 ease-out"
            style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            
            {/* ==================== A. 卡片正面：高危风险审计报告 ==================== */}
            <div className="absolute inset-0 w-full h-full bg-card/90 border border-border/80 shadow-2xl rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between backface-hidden z-10">
              
              {/* 正面头部 */}
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`h-5 w-5 ${
                      overallRisk === "high" ? "text-red-500" : "text-amber-500"
                    }`} />
                    <h3 className="text-base font-bold text-foreground">{t("title")}</h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground bg-muted/65 px-2 py-0.5 rounded-full font-mono">
                    {t("scanTime", { time: scanTime })}
                  </span>
                </div>

                {/* 风险摘要栏 */}
                <div className={`p-4 rounded-xl border mb-4 flex items-center justify-between gap-4 ${
                  overallRisk === "high"
                    ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                }`}>
                  <div>
                    <p className="text-xs font-semibold">{t("riskLevel")}: {
                      overallRisk === "high" ? t("riskHigh") : t("riskMedium")
                    }</p>
                    <p className="text-lg leading-tight font-bold mt-1">
                      {t("risksFound", { count: sensitiveFields.length })}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground bg-background/60 p-2 rounded-md">
                    <p>{t("fileType")}: {fileExt.toUpperCase()}</p>
                    <p>{t("noUpload")}</p>
                  </div>
                </div>

                {/* 滚动显示敏感字段列表 */}
                <div className="max-h-55 overflow-y-auto space-y-3 pr-1.5 scrollbar-thin select-text">
                  {sensitiveFields.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      {t("noRisksFound")}
                    </div>
                  ) : (
                    sensitiveFields.map(field => {
                      const isFull = showFullValues[field.id];
                      return (
                        <div key={field.id} className="p-3 bg-muted/30 border border-border/30 rounded-xl flex flex-col gap-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              {t(`categories.${field.category}`)}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                              field.riskLevel === "high"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : field.riskLevel === "medium"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-primary/10 text-primary border border-primary/20"
                            }`}>
                              {field.riskLevel.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between gap-3 bg-background/50 border border-border/40 px-2 py-1.5 rounded-lg">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-medium text-muted-foreground">
                                {field.label}
                              </span>
                              <span className="text-xs font-mono font-medium text-foreground select-all leading-normal break-all mt-0.5">
                                {redactValue(field.value, field.category, field.id)}
                              </span>
                            </div>
                            
                            {/* 脱敏切换眼睛按钮 */}
                            {field.category !== "media" && field.category !== "history" && (
                              <button
                                type="button"
                                onClick={() => toggleRedact(field.id)}
                                className="shrink-0 p-1 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                              >
                                {isFull ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* 正面底部 CTA 控制面板 */}
              <div className="border-t border-border/40 pt-4 mt-4">
                {/* 温馨提示 */}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-3 leading-relaxed">
                  <Lock className="h-3 w-3 shrink-0 text-primary" />
                  <p>{t("localRunning")}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl px-3" onClick={onClose} title={t("scanAnother")}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="rounded-xl flex-1 gap-1.5 text-xs font-semibold" onClick={() => router.push("/editor")}>
                    <FileText className="h-4 w-4" />
                    {t("manualEdit")}
                  </Button>
                  <Button
                    className="rounded-xl flex-1 bg-primary hover:bg-primary/90 text-primary-foreground relative overflow-hidden"
                    onClick={handleRemoveMetadata}
                    disabled={isCleaning}
                  >
                    {isCleaning ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <RotateCw className="h-4 w-4 animate-spin" />
                        {t("cleaningInProgress")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 justify-center">
                        <Sparkles className="h-4 w-4" />
                        {t("removeLocally")}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* ==================== B. 卡片背面：全绿零风险安全报告 ==================== */}
            <div 
              className="absolute inset-0 w-full h-full bg-card/95 border border-border/80 shadow-2xl rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between backface-hidden z-0"
              style={{ transform: "rotateY(180deg)" }}
            >
              
              {/* 背面头部 */}
              <div>
                <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-base font-bold text-foreground">{t("title")}</h3>
                  </div>
                  <span className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono font-medium">
                    100% CLEAN
                  </span>
                </div>

                {/* 盾牌圆盘勾选大效果 */}
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="relative mb-4 flex items-center justify-center">
                    {/* 发光背景环 */}
                    <div className="absolute inset-0 bg-emerald-500/15 rounded-full blur-xl animate-pulse" />
                    <div className="relative border-4 border-emerald-500 bg-emerald-500/10 rounded-full p-4">
                      <ShieldCheck className="h-16 w-16 text-emerald-500" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-1 select-none">
                    {t("cleanSuccess")}
                  </h4>
                  <p className="text-xs text-muted-foreground select-none max-w-sm leading-relaxed px-4">
                    {t("cleanSuccessDesc")}
                  </p>
                </div>

                {/* 安全审计概要 */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {t("riskLevel")}: {t("riskLow")}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 select-none">
                      {t("sandboxSelfCheck")}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground bg-background/60 p-2 rounded-md">
                    <p>Format: {fileExt.toUpperCase()}</p>
                    <p>{t("noUpload")}</p>
                  </div>
                </div>
              </div>

              {/* 背面底部控制 */}
              <div>
                <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
                  <Button
                    className="rounded-xl w-full bg-emerald-600 hover:bg-emerald-600/90 text-white"
                    onClick={() => cleanedBytes && triggerFileDownload(cleanedBytes)}
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    {t("downloadReport")}
                  </Button>
                  <Button variant="outline" className="rounded-xl w-full" onClick={() => {
                    setIsFlipped(false)
                    setTimeout(() => {
                      onClose()
                    }, 350)
                  }}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    {t("scanAnother")}
                  </Button>
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-3 select-none">
                  {t("localClosedLoop")}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

// 步进分步勾选加载状态项组件
interface StepItemProps {
  label: string
  status: "pending" | "active" | "success"
}

const StepItem: React.FC<StepItemProps> = ({ label, status }) => {
  return (
    <div className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-300 ${
      status === "success"
        ? "bg-emerald-500/5 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
        : status === "active"
        ? "bg-primary/10 border-primary/20 text-primary scale-[1.01]"
        : "bg-background/40 border-border/40 text-muted-foreground"
    }`}>
      <span className="text-xs font-semibold select-none">{label}</span>
      {status === "success" ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : status === "active" ? (
        <RotateCw className="h-3.5 w-3.5 text-primary shrink-0 animate-spin" />
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border-2 border-border/60 shrink-0" />
      )}
    </div>
  )
}
export default OmAuditReport;
