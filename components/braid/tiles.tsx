import type * as React from "react"
import { cn } from "@/lib/utils"

type Space = "none" | "xsmall" | "small" | "medium" | "gutter" | "large" | "xlarge" | "xxlarge"

interface TilesProps {
  columns: 1 | 2 | 3 | 4 | 5 | 6
  space?: Space
  children: React.ReactNode
  className?: string
}

const spaceMap: Record<Space, string> = {
  none: "gap-0",
  xsmall: "gap-1",
  small: "gap-2",
  medium: "gap-4",
  gutter: "gap-6",
  large: "gap-8",
  xlarge: "gap-10",
  xxlarge: "gap-12",
}

const columnMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
}

export function Tiles({ columns, space = "medium", children, className }: TilesProps) {
  return <div className={cn("grid", columnMap[columns], spaceMap[space], className)}>{children}</div>
}
