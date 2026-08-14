import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type SpaceValue = "none" | "xxsmall" | "xsmall" | "small" | "medium" | "gutter" | "large" | "xlarge"
type Align = "left" | "center" | "right"
type AlignY = "top" | "center" | "bottom" | "stretch"

interface ColumnsProps {
  children: ReactNode
  space?: SpaceValue
  align?: Align
  alignY?: AlignY
  collapseBelow?: "tablet" | "desktop"
  className?: string
}

const spaceClasses: Record<SpaceValue, string> = {
  none: "gap-0",
  xxsmall: "gap-1",
  xsmall: "gap-2",
  small: "gap-3",
  medium: "gap-4",
  gutter: "gap-6",
  large: "gap-8",
  xlarge: "gap-10",
}

const alignClasses: Record<Align, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
}

const alignYClasses: Record<AlignY, string> = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
  stretch: "items-stretch",
}

const collapseClasses: Record<"tablet" | "desktop", string> = {
  tablet: "flex-col md:flex-row",
  desktop: "flex-col lg:flex-row",
}

export function Columns({
  children,
  space = "gutter",
  align = "left",
  alignY = "stretch",
  collapseBelow,
  className,
}: ColumnsProps) {
  return (
    <div
      className={cn(
        "flex",
        spaceClasses[space],
        alignClasses[align],
        alignYClasses[alignY],
        collapseBelow && collapseClasses[collapseBelow],
        className,
      )}
    >
      {children}
    </div>
  )
}

interface ColumnProps {
  children: ReactNode
  width?: "content" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5"
  className?: string
}

const widthClasses: Record<string, string> = {
  content: "flex-shrink-0",
  "1/2": "w-full md:w-1/2",
  "1/3": "w-full md:w-1/3",
  "2/3": "w-full md:w-2/3",
  "1/4": "w-full md:w-1/4",
  "3/4": "w-full md:w-3/4",
  "1/5": "w-full md:w-1/5",
  "2/5": "w-full md:w-2/5",
  "3/5": "w-full md:w-3/5",
  "4/5": "w-full md:w-4/5",
}

export function Column({ children, width, className }: ColumnProps) {
  return <div className={cn(width ? widthClasses[width] : "flex-1", className)}>{children}</div>
}
