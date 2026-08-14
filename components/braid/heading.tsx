import { cn } from "@/lib/utils"
import { type ReactNode, forwardRef } from "react"

type HeadingLevel = "1" | "2" | "3" | "4"
type HeadingWeight = "regular" | "medium" | "strong"
type HeadingAlign = "left" | "center" | "right"

interface HeadingProps {
  children: ReactNode
  level: HeadingLevel
  weight?: HeadingWeight
  align?: HeadingAlign | { mobile?: HeadingAlign; tablet?: HeadingAlign; desktop?: HeadingAlign }
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p"
  className?: string
  id?: string
}

const levelClasses: Record<HeadingLevel, string> = {
  "1": "text-4xl md:text-5xl leading-tight",
  "2": "text-2xl md:text-3xl leading-snug",
  "3": "text-xl md:text-2xl leading-snug",
  "4": "text-lg md:text-xl leading-normal",
}

const weightClasses: Record<HeadingWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  strong: "font-bold",
}

const levelToComponent: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4"> = {
  "1": "h1",
  "2": "h2",
  "3": "h3",
  "4": "h4",
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { children, level, weight = "strong", align, component, className, id },
  ref,
) {
  const Component = component || levelToComponent[level]

  const alignClass =
    typeof align === "string"
      ? `text-${align}`
      : align
        ? cn(
            align.mobile && `text-${align.mobile}`,
            align.tablet && `md:text-${align.tablet}`,
            align.desktop && `lg:text-${align.desktop}`,
          )
        : ""

  return (
    <Component
      ref={ref}
      id={id}
      className={cn(levelClasses[level], weightClasses[weight], "text-[#2E3849]", alignClass, className)}
    >
      {children}
    </Component>
  )
})
