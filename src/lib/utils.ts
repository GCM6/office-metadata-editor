import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, locale = "zh-CN"): string {
  if (!dateString) return "-"
  try {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

export function formatRelativeTime(dateString: string, locale = "zh-CN"): string {
  if (!dateString) return "-"

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "-"

  const now = Date.now()
  const diffMs = date.getTime() - now
  const absMs = Math.abs(diffMs)

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (absMs < minute) return rtf.format(0, "minute")
  if (absMs < hour) return rtf.format(Math.round(diffMs / minute), "minute")
  if (absMs < day) return rtf.format(Math.round(diffMs / hour), "hour")
  if (absMs < week) return rtf.format(Math.round(diffMs / day), "day")
  if (absMs < month) return rtf.format(Math.round(diffMs / week), "week")
  if (absMs < year) return rtf.format(Math.round(diffMs / month), "month")
  return rtf.format(Math.round(diffMs / year), "year")
}

export function formatNumber(num: number, locale = "zh-CN"): string {
  return num.toLocaleString(locale)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
