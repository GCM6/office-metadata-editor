"use client"

import React from "react"
import { ChromeWindowToolbar } from "@/components/chrome/chrome-window-toolbar"
import { OmFooter } from "@/components/layouts/om-footer"

export interface BlankLayoutProps {
  header?: React.ReactNode
  enableWindowDragOverlay?: boolean
  hideFooter?: boolean
}

export const BlankLayout: React.FC<React.PropsWithChildren<BlankLayoutProps>> = ({
  header,
  enableWindowDragOverlay,
  hideFooter = false,
  children,
}) => {
  const showWindowDragOverlay = enableWindowDragOverlay ?? !header

  return (
    <main className="h-full w-full bg-background">
      {showWindowDragOverlay && <ChromeWindowToolbar />}
      <div className="flex h-full flex-col bg-background">
        {header}
        <div className="flex min-h-0 flex-1 overflow-hidden">{children}</div>
        {!hideFooter && <OmFooter />}
      </div>
    </main>
  )
}

export default BlankLayout

