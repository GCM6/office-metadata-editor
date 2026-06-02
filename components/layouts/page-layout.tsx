"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { OmWindowTitleBar } from "@/components/om/om-window-title-bar"
import { BlankLayout } from "@/components/layouts/blank-layout"

export interface PageLayoutProps {
  backTo?: string
  header: React.ReactNode
  actions?: React.ReactNode
  showSidebarTrigger?: boolean
}

export const PageLayout: React.FC<React.PropsWithChildren<PageLayoutProps>> = ({
  children,
  backTo = "/",
  header,
  actions,
  showSidebarTrigger = false,
}) => {
  const router = useRouter()

  return (
    <BlankLayout
      hideFooter
      header={
        <OmWindowTitleBar
          leading={
            <>
              {showSidebarTrigger && (
                <SidebarTrigger className="rounded-lg">
                  <PanelLeft className="h-4 w-4" />
                </SidebarTrigger>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => router.push(backTo)}
                className="rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-border/80" />
              {header}
            </>
          }
          actions={actions}
        />
      }
    >
      {children}
    </BlankLayout>
  )
}

export default PageLayout
