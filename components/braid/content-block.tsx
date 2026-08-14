import type React from "react"
import { cn } from "@/lib/utils"

interface ContentBlockProps {
  children: React.ReactNode
  width?: "xsmall" | "small" | "medium" | "large" | "full"
  className?: string
}

export function ContentBlock({ children, width = "large", className }: ContentBlockProps) {
  const widthClasses = {
    xsmall: "max-w-sm",
    small: "max-w-xl",
    medium: "max-w-3xl",
    large: "max-w-5xl",
    full: "max-w-full",
  }

  return <div className={cn("mx-auto w-full px-4", widthClasses[width], className)}>{children}</div>
}
