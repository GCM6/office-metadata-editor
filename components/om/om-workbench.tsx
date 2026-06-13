"use client"

import React, { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useFileContext } from "@/contexts/file-context"
import { OmFileUploadZone } from "@/components/om/om-file-upload-zone"
import { OmAuditReport } from "@/components/om/om-audit-report"
import { SUPPORTED_FILE_EXTENSIONS } from "@/lib/documents/supported-formats"

export type WorkbenchScope = "all" | "word" | "excel" | "pdf"

type WorkbenchTab = "scan" | "edit" | "batch"

/** Which file extensions each scope accepts. `null` means "all supported formats". */
const SCOPE_EXTENSIONS: Record<WorkbenchScope, readonly string[] | null> = {
  all: null,
  word: ["docx", "doc"],
  excel: ["xlsx"],
  pdf: ["pdf"],
}

export interface OmWorkbenchProps {
  /** Pre-scope the workbench to a single document family. Defaults to "all". */
  scope?: WorkbenchScope
}

/**
 * The interactive privacy workbench shared by the home page and the per-format
 * tool pages: a scan / edit / batch segmented control, a drop zone, and the
 * in-place audit + one-click clean + verification report flow.
 *
 * When `scope` is a specific format, the file picker and the supported-format
 * badges are restricted to that format so the page stays focused.
 */
export const OmWorkbench: React.FC<OmWorkbenchProps> = ({ scope = "all" }) => {
  const router = useRouter()
  const { files, openFiles, isLoading, clearFiles } = useFileContext()
  const tw = useTranslations("workbench")
  const th = useTranslations("home")

  const [activeTab, setActiveTab] = useState<WorkbenchTab>("scan")
  const [auditFile, setAuditFile] = useState<{ id: string; filePath: string; fileName: string } | null>(null)
  const [isInitialClearDone, setIsInitialClearDone] = useState(false)

  const scopeExtensions = SCOPE_EXTENSIONS[scope]
  const displayExtensions = scopeExtensions ?? SUPPORTED_FILE_EXTENSIONS

  // Start every mount from a clean slate so the scan flow is deterministic.
  useEffect(() => {
    clearFiles()
    setIsInitialClearDone(true)
  }, [clearFiles])

  // In scan mode, intercept the newly added file and inject the audit state.
  // If we are in a scoped tool page (scope !== "all"), we immediately redirect to the editor instead of auditing locally.
  useEffect(() => {
    if (isInitialClearDone && files.length > 0) {
      if (scope !== "all") {
        router.push("/editor")
        return
      }
      if (activeTab === "scan" && !auditFile) {
        const latest = files[files.length - 1]
        if (latest && (latest.status === "idle" || latest.status === "reading" || latest.status === "ready")) {
          setAuditFile({
            id: latest.id,
            filePath: latest.filePath,
            fileName: latest.fileName,
          })
        }
      }
    }
  }, [files, activeTab, auditFile, isInitialClearDone, scope, router])

  const handleOpenFiles = async () => {
    const added = await openFiles(scopeExtensions ? { extensions: scopeExtensions } : undefined)
    if (added === 0) return

    if (scope !== "all") {
      router.push("/editor")
    } else {
      if (activeTab === "batch") {
        router.push("/batch")
      } else if (activeTab === "edit") {
        router.push("/editor")
      }
    }
  }

  const handleCloseAudit = () => {
    setAuditFile(null)
    clearFiles()
  }

  return (
    <>
      {/* Segmented control: scan / edit / batch */}
      {!auditFile && (
        <div className="mb-5 flex items-center justify-center">
          <div className="flex rounded-full border border-border/60 bg-card/65 p-1 shadow-sm backdrop-blur-sm select-none">
            <WorkbenchTabButton active={activeTab === "scan"} onClick={() => setActiveTab("scan")}>
              {tw("tabScan")}
            </WorkbenchTabButton>
            <WorkbenchTabButton active={activeTab === "edit"} onClick={() => setActiveTab("edit")}>
              {tw("tabEdit")}
            </WorkbenchTabButton>
            <WorkbenchTabButton active={activeTab === "batch"} onClick={() => setActiveTab("batch")}>
              {tw("tabBatch")}
            </WorkbenchTabButton>
          </div>
        </div>
      )}

      {auditFile ? (
        <OmAuditReport
          fileId={auditFile.id}
          filePath={auditFile.filePath}
          fileName={auditFile.fileName}
          onClose={handleCloseAudit}
        />
      ) : (
        <section className="rounded-xl border border-border/70 bg-card/82 p-5 shadow-xl backdrop-blur-sm transition-all duration-500 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 select-none">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {activeTab === "scan" ? tw("scanHeading") : th("dragUploadStart")}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activeTab === "scan" ? tw("scanDesc") : th("singleOrBatchDesc")}
              </p>
            </div>
          </div>

          <OmFileUploadZone onOpenFiles={handleOpenFiles} isLoading={isLoading} />

          <div className="mt-8">
            <p className="mb-2 text-xs font-medium text-muted-foreground select-none">{th("supportedFileTypes")}</p>
            <div className="flex flex-wrap gap-2">
              {displayExtensions.map(type => (
                <span
                  key={type}
                  className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  .{type}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

interface WorkbenchTabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

const WorkbenchTabButton: React.FC<WorkbenchTabButtonProps> = ({ active, onClick, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-300 ${
        active
          ? "scale-102 bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

export default OmWorkbench
