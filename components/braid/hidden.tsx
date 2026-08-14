import type React from "react"
import { cn } from "@/lib/utils"

interface HiddenProps {
  children: React.ReactNode
  above?: "mobile" | "tablet" | "desktop" | "wide"
  below?: "mobile" | "tablet" | "desktop" | "wide"
  screen?: boolean
  print?: boolean
  inline?: boolean
  className?: string
}

export function Hidden({
  children,
  above,
  below,
  screen = false,
  print = false,
  inline = false,
  className,
}: HiddenProps) {
  const breakpointClasses = {
    mobile: { above: "sm:hidden", below: "hidden sm:block" },
    tablet: { above: "md:hidden", below: "hidden md:block" },
    desktop: { above: "lg:hidden", below: "hidden lg:block" },
    wide: { above: "xl:hidden", below: "hidden xl:block" },
  }

  const classes = cn(
    above && breakpointClasses[above]?.above,
    below && breakpointClasses[below]?.below,
    screen && "hidden",
    print && "print:hidden",
    inline ? "inline" : "block",
    className,
  )

  return <span className={classes}>{children}</span>
}

interface HiddenVisuallyProps {
  children: React.ReactNode
}

export function HiddenVisually({ children }: HiddenVisuallyProps) {
  return <span className="sr-only">{children}</span>
}
