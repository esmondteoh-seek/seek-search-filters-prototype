import type * as React from "react"
import { cn } from "@/lib/utils"

interface StrongProps {
  children: React.ReactNode
  className?: string
}

export function Strong({ children, className }: StrongProps) {
  return <strong className={cn("font-semibold", className)}>{children}</strong>
}
