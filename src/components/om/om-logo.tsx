import React from "react"
import { APP_NAME } from "@/lib/app-config"
import logo from "@/assets/logo.svg"

export const OmLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="应用 Logo" className="h-6 w-6 rounded-md" />
      <span className="text-sm font-medium text-foreground">{APP_NAME}</span>
    </div>
  )
}

export default OmLogo
