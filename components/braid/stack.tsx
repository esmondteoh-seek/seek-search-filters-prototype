import { cn } from "@/lib/utils"
import { type ReactNode, Children, isValidElement } from "react"

type SpaceValue =
  | "none"
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "gutter"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "xxxlarge"
type Align = "left" | "center" | "right"

interface StackProps {
  children: ReactNode
  space?: SpaceValue | { mobile?: SpaceValue; tablet?: SpaceValue; desktop?: SpaceValue }
  align?: Align
  dividers?: boolean
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
  xxlarge: "gap-12",
  xxxlarge: "gap-16",
}

const alignClasses: Record<Align, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
}

export function Stack({ children, space = "medium", align = "left", dividers = false, className }: StackProps) {
  const spaceClass =
    typeof space === "string"
      ? spaceClasses[space]
      : cn(
          space.mobile && spaceClasses[space.mobile],
          space.tablet && `md:${spaceClasses[space.tablet]}`,
          space.desktop && `lg:${spaceClasses[space.desktop]}`,
        )

  const validChildren = Children.toArray(children).filter(isValidElement)

  if (dividers) {
    return (
      <div className={cn("flex flex-col", alignClasses[align], className)}>
        {validChildren.map((child, index) => (
          <div key={index} className={cn(index > 0 && "border-t border-[#EAECF1]", spaceClass.replace("gap-", "py-"))}>
            {child}
          </div>
        ))}
      </div>
    )
  }

  return <div className={cn("flex flex-col", spaceClass, alignClasses[align], className)}>{children}</div>
}
