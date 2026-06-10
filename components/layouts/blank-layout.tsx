"use client"

import React from "react"
import { ChromeWindowToolbar } from "@/components/chrome/chrome-window-toolbar"
import { OmFooter } from "@/components/layouts/om-footer"
import { OmHeader } from "@/components/layouts/om-header"

export interface BlankLayoutProps {
  header?: React.ReactNode
  enableWindowDragOverlay?: boolean
  hideFooter?: boolean
  /** Suppress the shared site nav (e.g. app screens that supply their own header). */
  hideSiteHeader?: boolean
}

export const BlankLayout: React.FC<React.PropsWithChildren<BlankLayoutProps>> = ({
  header,
  enableWindowDragOverlay,
  hideFooter = false,
  hideSiteHeader = false,
  children,
}) => {
  // Marketing pages pass no custom header → render the shared site nav.
  // App screens (editor/batch via PageLayout) pass their own header → keep it.
  const showSiteHeader = !header && !hideSiteHeader
  // The fixed Tauri drag overlay covers the top strip and intercepts clicks, so
  // never show it together with a real header (custom or the site nav).
  const showWindowDragOverlay = enableWindowDragOverlay ?? !(header || showSiteHeader)

  return (
    <main className="h-full w-full bg-background">
      {showWindowDragOverlay && <ChromeWindowToolbar />}
      <div className="flex h-full flex-col bg-background">
        {header}
        {showSiteHeader && <OmHeader />}
        <div className="flex min-h-0 flex-1 overflow-hidden">{children}</div>
        {!hideFooter && <OmFooter />}
      </div>
    </main>
  )
}

export default BlankLayout

