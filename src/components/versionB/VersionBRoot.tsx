import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { VERSION_B_FONT, VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"

interface VersionBRootProps {
  children: ReactNode
  className?: string
}

/** SeekSans wrapper for Version B surfaces */
export function VersionBRoot({ children, className }: VersionBRootProps) {
  return (
    <div
      className={cn("min-h-screen", className)}
      style={{ fontFamily: VERSION_B_FONT, backgroundColor: VERSION_B_TOKENS.pageBg }}
    >
      {children}
    </div>
  )
}
