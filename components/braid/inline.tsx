import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type SpaceValue = "none" | "xxsmall" | "xsmall" | "small" | "medium" | "gutter" | "large" | "xlarge"
type Align = "left" | "center" | "right"
type AlignY = "top" | "center" | "bottom"

interface InlineProps {
  children: ReactNode
  space?: SpaceValue | { mobile?: SpaceValue; tablet?: SpaceValue; desktop?: SpaceValue }
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
}

const collapseClasses: Record<"tablet" | "desktop", string> = {
  tablet: "flex-col md:flex-row",
  desktop: "flex-col lg:flex-row",
}

export function Inline({
  children,
  space = "small",
  align = "left",
  alignY = "center",
  collapseBelow,
  className,
}: InlineProps) {
  const spaceClass =
    typeof space === "string"
      ? spaceClasses[space]
      : cn(
          space.mobile && spaceClasses[space.mobile],
          space.tablet && `md:${spaceClasses[space.tablet]}`,
          space.desktop && `lg:${spaceClasses[space.desktop]}`,
        )

  return (
    <div
      className={cn(
        "flex flex-wrap",
        spaceClass,
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
