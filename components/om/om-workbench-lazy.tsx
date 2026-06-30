"use client"

import dynamic from "next/dynamic"
import type { WorkbenchScope } from "@/components/om/om-workbench"

/**
 * Lazy boundary for {@link OmWorkbench}.
 *
 * The workbench drags in the whole document-processing engine (the WASM audit
 * worker, `jszip`, and `pdf-lib` — ~700KB+). On marketing / SEO pages the
 * visitor first sees the hero, feature cards and FAQ, and doesn't need that
 * engine until they actually drop a file. Loading it through `next/dynamic`
 * (client-only) keeps it out of the page's first-load JS, so LCP/TBT/INP are
 * driven only by the lightweight above-the-fold content.
 *
 * A fixed-height skeleton stands in while the chunk loads to avoid layout shift.
 *
 * Use this on content pages (home, tool hubs, landing pages). The dedicated
 * `/editor` and `/batch` workspaces import {@link OmWorkbench} directly, since
 * the user navigated there specifically to use the tool.
 */
const OmWorkbench = dynamic(
  () => import("@/components/om/om-workbench").then((m) => m.OmWorkbench),
  {
    ssr: false,
    loading: () => <OmWorkbenchSkeleton />,
  },
)

function OmWorkbenchSkeleton() {
  return (
    <div
      className="min-h-[360px] w-full animate-pulse rounded-xl border border-border/60 bg-card/60 p-6 shadow-md backdrop-blur-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mb-5 h-9 w-full rounded-lg bg-muted/60" />
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/60 bg-muted/30">
        <div className="h-10 w-10 rounded-full bg-muted/60" />
        <div className="h-3 w-40 rounded bg-muted/60" />
        <div className="h-3 w-28 rounded bg-muted/50" />
      </div>
    </div>
  )
}

export function OmWorkbenchLazy({ scope = "all" }: { scope?: WorkbenchScope }) {
  return <OmWorkbench scope={scope} />
}
