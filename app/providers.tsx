"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FileProvider } from "@/contexts/file-context"
import { MetadataProvider } from "@/contexts/metadata-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider>
      <TooltipProvider>
        <FileProvider>
          <MetadataProvider>
            <main
              className="chrome-window-shell"
              data-ui-scroll-container
              data-mounted={mounted ? "true" : undefined}
            >
              {children}
            </main>
          </MetadataProvider>
        </FileProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
