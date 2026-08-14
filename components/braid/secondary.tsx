import type * as React from "react"
import { cn } from "@/lib/utils"

interface SecondaryProps {
  children: React.ReactNode
  className?: string
}

export function Secondary({ children, className }: SecondaryProps) {
  return <span className={cn("text-[#5a6881]", className)}>{children}</span>
}
