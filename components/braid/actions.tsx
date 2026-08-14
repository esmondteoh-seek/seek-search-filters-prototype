import type * as React from "react"
import { cn } from "@/lib/utils"

interface ActionsProps {
  children: React.ReactNode
  className?: string
}

export function Actions({ children, className }: ActionsProps) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
}
