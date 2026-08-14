import type React from "react"
import { cn } from "@/lib/utils"

interface PageBlockProps {
  children: React.ReactNode
  width?: "medium" | "large" | "full"
  className?: string
}

export function PageBlock({ children, width = "large", className }: PageBlockProps) {
  const widthClasses = {
    medium: "max-w-4xl",
    large: "max-w-6xl",
    full: "max-w-full",
  }

  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widthClasses[width], className)}>{children}</div>
}
