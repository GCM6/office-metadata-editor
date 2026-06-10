import React from "react"
import {
  METADATA_EXPOSURE_FIELDS,
  EXPOSURE_FORMAT_LABELS,
  type ExposureFormat,
  type ExposureRisk,
  type MetadataExposureField,
} from "@/lib/seo-data/metadata-exposure"

interface OmMetadataExposureTableProps {
  locale: string
  /** Restrict to a single format (e.g. for a per-format scenario page). Omit to show all. */
  format?: ExposureFormat
  /** Column headers, localized by the caller. */
  labels: {
    field: string
    formats: string
    exposes: string
    risk: string
    removal: string
  }
  riskLabels: Record<ExposureRisk, string>
}

const RISK_STYLES: Record<ExposureRisk, string> = {
  high: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  low: "bg-primary/10 text-primary border border-primary/20",
}

/**
 * Renders the D3 metadata-exposure dataset as a citable HTML table — the kind of
 * fact-rich, self-contained structure AI answer engines preferentially quote.
 */
export function OmMetadataExposureTable({
  locale,
  format,
  labels,
  riskLabels,
}: OmMetadataExposureTableProps) {
  const isEn = locale === "en"
  const rows: MetadataExposureField[] = format
    ? METADATA_EXPOSURE_FIELDS.filter(row => row.formats.includes(format))
    : METADATA_EXPOSURE_FIELDS

  const pick = (t: { en: string; zh: string }) => (isEn ? t.en : t.zh)

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-semibold">{labels.field}</th>
            {!format && <th className="px-4 py-3 font-semibold">{labels.formats}</th>}
            <th className="px-4 py-3 font-semibold">{labels.exposes}</th>
            <th className="px-4 py-3 font-semibold">{labels.risk}</th>
            <th className="px-4 py-3 font-semibold">{labels.removal}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-t border-border/50 align-top">
              <td className="px-4 py-3">
                <div className="font-semibold text-foreground">{pick(row.field)}</div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{row.technicalKey}</div>
              </td>
              {!format && (
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {row.formats.map(f => pick(EXPOSURE_FORMAT_LABELS[f])).join(", ")}
                </td>
              )}
              <td className="px-4 py-3 text-muted-foreground">{pick(row.exposes)}</td>
              <td className="px-4 py-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${RISK_STYLES[row.risk]}`}>
                  {riskLabels[row.risk]}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{pick(row.removal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OmMetadataExposureTable
