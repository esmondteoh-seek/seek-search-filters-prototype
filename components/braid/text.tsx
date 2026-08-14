import { cn } from "@/lib/utils"
import { type ReactNode, forwardRef, type ElementType } from "react"

type TextSize = "xsmall" | "small" | "standard" | "large"
type TextWeight = "regular" | "medium" | "strong"
type TextTone =
  | "neutral"
  | "secondary"
  | "critical"
  | "positive"
  | "caution"
  | "info"
  | "promote"
  | "link"
  | "formAccent"
type TextAlign = "left" | "center" | "right"

interface TextProps {
  children: ReactNode
  size?: TextSize
  weight?: TextWeight
  tone?: TextTone
  align?: TextAlign | { mobile?: TextAlign; tablet?: TextAlign; desktop?: TextAlign }
  component?: ElementType
  maxLines?: number
  className?: string
  id?: string
  icon?: ReactNode
}

const sizeClasses: Record<TextSize, string> = {
  xsmall: "text-xs leading-4",
  small: "text-sm leading-5",
  standard: "text-base leading-6",
  large: "text-lg leading-7",
}

const weightClasses: Record<TextWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  strong: "font-semibold",
}

const toneClasses: Record<TextTone, string> = {
  neutral: "text-[#2E3849]",
  secondary: "text-[#5A6881]",
  critical: "text-[#B91E1E]",
  positive: "text-[#12784F]",
  caution: "text-[#B9800D]",
  info: "text-[#1D559D]",
  promote: "text-[#7F35A9]",
  link: "text-[#1E47A9]",
  formAccent: "text-[#1E47A9]",
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    children,
    size = "standard",
    weight = "regular",
    tone = "neutral",
    align,
    component: Component = "span",
    maxLines,
    className,
    id,
    icon,
  },
  ref,
) {
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

  const lineClampClass = maxLines === 1 ? "truncate" : maxLines ? `line-clamp-${maxLines}` : ""

  return (
    <Component
      ref={ref}
      id={id}
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        toneClasses[tone],
        alignClass,
        lineClampClass,
        icon && "inline-flex items-center gap-1.5",
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </Component>
  )
})
