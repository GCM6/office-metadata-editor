"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PageLayout } from "@/components/layouts/page-layout"
import { OmBatchToolbar } from "@/components/om/om-batch-toolbar"
import { type FileStatus, useFileContext } from "@/contexts/file-context"
import { useMetadata } from "@/contexts/metadata-context"
import { formatFileSize } from "@/lib/utils"
import { seoMap } from "@/seo/seo-map"

export default function BatchPage() {
  const { files, openFiles, removeFile, clearFiles } = useFileContext()
  const { documents, saveDocument, clearAndSaveDocument, batchSaveAll, batchClearAndSave } =
    useMetadata()
  const t = useTranslations("batch")
  const tp = useTranslations("progress")
  const locale = useLocale()

  const isEn = locale === "en"
  const h1Text = isEn ? (seoMap.batch.en?.h1 || seoMap.batch.h1) : seoMap.batch.h1

  const [actionStatus, setActionStatus] = useState<string | null>(null)


  useEffect(() => {
    clearFiles()
  }, [clearFiles])

  const documentMap = useMemo(() => {
    return new Map(documents.map(item => [item.id, item]))
  }, [documents])

  const rows = useMemo(
    () =>
      files.map(item => {
        const doc = documentMap.get(item.id)!
        return {
          id: item.id,
          fileName: doc.metadata.fileName,
          filePath: item.filePath,
          author: doc.metadata.documentProperties.creator || "-",
          modified: doc.metadata.documentProperties.modified || "-",
          hasChanges: doc.hasChanges,
          fileType: doc.metadata.fileType || "-",
          fileSize: doc.metadata.fileSize || 0,
          status: item.status,
          progressMessage: item.progressMessage,
          error: item.error,
        }
      }),
    [files, documentMap],
  )

  const statusCounts = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc[row.status] += 1
        if (row.hasChanges) acc.pending += 1
        if (row.error) acc.error += 1
        return acc
      },
      {
        idle: 0,
        reading: 0,
        ready: 0,
        processing: 0,
        error: 0,
        pending: 0,
      } as Record<FileStatus | "pending", number>,
    )
  }, [rows])

  const isBusy = statusCounts.processing > 0 || statusCounts.reading > 0 || actionStatus !== null

  const runAction = async (statusText: string, action: () => Promise<void>) => {
    if (isBusy) return

    setActionStatus(statusText)
    try {
      await action()
    } finally {
      setActionStatus(null)
    }
  }

  const handleOpenFiles = async () => {
    await openFiles()
  }

  const handleSaveOne = async (id: string) => {
    await runAction(t("savingFile"), async () => {
      await saveDocument(id)
    })
  }

  const handleClearAndSaveOne = async (id: string) => {
    await runAction(t("clearingAndSaving"), async () => {
      await clearAndSaveDocument(id)
    })
  }

  const handleBatchSave = async () => {
    if (rows.length === 0) return

    await runAction(t("batchSaving"), async () => {
      await batchSaveAll()
    })
  }

  const handleBatchClearAndSave = async () => {
    if (rows.length === 0) return

    await runAction(t("batchClearingAndSaving"), async () => {
      await batchClearAndSave()
    })
  }

  const handleRemoveFile = (id: string) => {
    removeFile(id)
  }

  const handleClearAll = () => {
    clearFiles()
  }

  return (
    <PageLayout
      backTo="/"
      header={
        <div className="flex flex-col leading-tight select-none">
          <span className="text-sm font-medium text-foreground">{t("title")}</span>
        </div>
      }
      actions={
        <OmBatchToolbar
          hasFiles={rows.length > 0}
          isBusy={isBusy}
          busyText={actionStatus ?? (isBusy ? t("processing") : undefined)}
          onAddFiles={handleOpenFiles}
          onBatchSave={handleBatchSave}
          onBatchClearAndSave={handleBatchClearAndSave}
          onClearAll={handleClearAll}
        />
      }
    >
      <div className="flex h-full w-full flex-col gap-4 p-3 sm:p-4 overflow-y-auto">
        <h1 className="sr-only">{h1Text}</h1>

        {/* 移动端卡片列表布局 - md以下显示 */}
        <div className="flex flex-col gap-3 md:hidden">
          {rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 bg-card/45 p-10 text-center text-sm text-muted-foreground select-none">
              {t("noFiles")}
            </div>
          ) : (
            rows.map(row => {
              const statusMessage =
                row.error || row.progressMessage || (row.hasChanges ? tp("pending") : tp("synced"))
              const disableActions =
                isBusy || row.status === "processing" || row.status === "reading"

              return (
                <div key={row.id} className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card/50 p-4 shadow-xs backdrop-blur-xs">
                  {/* 卡片头部 */}
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm font-semibold text-foreground/90" title={row.fileName}>
                        {row.fileName}
                      </span>
                      <span className="mt-1 text-[10px] text-muted-foreground truncate max-w-full">
                        {row.filePath}
                      </span>
                    </div>
                    <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      {row.fileType.toUpperCase()}
                    </span>
                  </div>

                  {/* 属性信息区 */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-2 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">{t("author")}</span>
                      <span className="font-medium truncate block text-foreground/90">{row.author}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">{t("modified")}</span>
                      <span className="font-medium truncate block text-foreground/90">{row.modified}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-muted-foreground block">{t("size")}</span>
                      <span className="font-medium text-foreground/90">{formatFileSize(row.fileSize)}</span>
                    </div>
                  </div>

                  {/* 状态区 */}
                  <div className="flex items-center justify-between text-xs border-t border-border/30 pt-2">
                    <span className="text-muted-foreground">{t("status")}</span>
                    <span className={`font-medium truncate max-w-50 ${row.error ? "text-destructive" : row.hasChanges ? "text-primary" : "text-green-500"}`}>
                      {statusMessage}
                    </span>
                  </div>

                  {/* 按钮操作区 */}
                  <div className="flex gap-2 justify-end border-t border-border/30 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={disableActions}
                      onClick={() => handleRemoveFile(row.id)}
                      className="flex-1 text-xs"
                    >
                      {t("remove")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={disableActions}
                      onClick={() => void handleClearAndSaveOne(row.id)}
                      className="flex-1 text-xs"
                    >
                      {t("clearAndSave")}
                    </Button>
                    <Button
                      size="sm"
                      disabled={disableActions}
                      onClick={() => void handleSaveOne(row.id)}
                      className="flex-1 text-xs"
                    >
                      {t("save")}
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* 桌面端表格布局 - md及以上显示 */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("fileName")}</TableHead>
                <TableHead>{t("author")}</TableHead>
                <TableHead>{t("modified")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    {t("noFiles")}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(row => {
                  const statusMessage =
                    row.error || row.progressMessage || (row.hasChanges ? tp("pending") : tp("synced"))
                  const disableActions =
                    isBusy || row.status === "processing" || row.status === "reading"

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="max-w-[320px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block cursor-help truncate font-medium">
                              {row.fileName}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="start" className="max-w-xs">
                            <div className="space-y-1 text-xs">
                              <div>{t("path")}：{row.filePath}</div>
                              <div>{t("type")}：{row.fileType}</div>
                              <div>{t("size")}：{formatFileSize(row.fileSize)}</div>
                              <div>{t("author")}：{row.author}</div>
                              <div>{t("modified")}：{row.modified}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{row.author}</TableCell>
                      <TableCell>{row.modified}</TableCell>
                      <TableCell className="max-w-55">
                        <span className="block truncate text-muted-foreground" title={statusMessage}>
                          {statusMessage}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={disableActions}
                            onClick={() => handleRemoveFile(row.id)}
                          >
                            {t("remove")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={disableActions}
                            onClick={() => void handleClearAndSaveOne(row.id)}
                          >
                            {t("clearAndSave")}
                          </Button>
                          <Button
                            size="sm"
                            disabled={disableActions}
                            onClick={() => void handleSaveOne(row.id)}
                          >
                            {t("save")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  )
}
