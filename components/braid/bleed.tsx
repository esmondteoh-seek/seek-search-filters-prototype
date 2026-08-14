import type * as React from "react"
import { cn } from "@/lib/utils"

type Space = "none" | "xsmall" | "small" | "medium" | "gutter" | "large" | "xlarge" | "xxlarge"

interface BleedProps {
  horizontal?: Space
  vertical?: Space
  top?: Space
  bottom?: Space
  left?: Space
  right?: Space
  space?: Space
  children: React.ReactNode
  className?: string
}

const negativeSpaceMap: Record<Space, string> = {
  none: "",
  xsmall: "-m-1",
  small: "-m-2",
  medium: "-m-4",
  gutter: "-m-6",
  large: "-m-8",
  xlarge: "-m-10",
  xxlarge: "-m-12",
}

const negativeHorizontalMap: Record<Space, string> = {
  none: "",
  xsmall: "-mx-1",
  small: "-mx-2",
  medium: "-mx-4",
  gutter: "-mx-6",
  large: "-mx-8",
  xlarge: "-mx-10",
  xxlarge: "-mx-12",
}

const negativeVerticalMap: Record<Space, string> = {
  none: "",
  xsmall: "-my-1",
  small: "-my-2",
  medium: "-my-4",
  gutter: "-my-6",
  large: "-my-8",
  xlarge: "-my-10",
  xxlarge: "-my-12",
}

export function Bleed({ horizontal, vertical, top, bottom, left, right, space, children, className }: BleedProps) {
  const classes = cn(
    space && negativeSpaceMap[space],
    horizontal && negativeHorizontalMap[horizontal],
    vertical && negativeVerticalMap[vertical],
    top &&
      `-mt-${top === "xsmall" ? "1" : top === "small" ? "2" : top === "medium" ? "4" : top === "gutter" ? "6" : top === "large" ? "8" : top === "xlarge" ? "10" : "12"}`,
    bottom &&
      `-mb-${bottom === "xsmall" ? "1" : bottom === "small" ? "2" : bottom === "medium" ? "4" : bottom === "gutter" ? "6" : bottom === "large" ? "8" : bottom === "xlarge" ? "10" : "12"}`,
    left &&
      `-ml-${left === "xsmall" ? "1" : left === "small" ? "2" : left === "medium" ? "4" : left === "gutter" ? "6" : left === "large" ? "8" : left === "xlarge" ? "10" : "12"}`,
    right &&
      `-mr-${right === "xsmall" ? "1" : right === "small" ? "2" : right === "medium" ? "4" : right === "gutter" ? "6" : right === "large" ? "8" : right === "xlarge" ? "10" : "12"}`,
    className,
  )

  return <div className={classes}>{children}</div>
}
