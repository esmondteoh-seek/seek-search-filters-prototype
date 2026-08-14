"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type IconSize = "xsmall" | "small" | "standard" | "large" | "fill"
export type IconTone =
  | "neutral"
  | "secondary"
  | "critical"
  | "caution"
  | "positive"
  | "info"
  | "promote"
  | "formAccent"
  | "brandAccent"

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: IconSize
  tone?: IconTone
  title?: string
  alignY?: "uppercase" | "lowercase"
}

const sizeClasses: Record<IconSize, string> = {
  xsmall: "w-3 h-3",
  small: "w-4 h-4",
  standard: "w-5 h-5",
  large: "w-6 h-6",
  fill: "w-full h-full",
}

const toneClasses: Record<IconTone, string> = {
  neutral: "text-[#2E3849]",
  secondary: "text-[#5A6881]",
  critical: "text-[#B91E1E]",
  caution: "text-[#7A5300]",
  positive: "text-[#007A4B]",
  info: "text-[#1E47A9]",
  promote: "text-[#7A32AC]",
  formAccent: "text-[#1E47A9]",
  brandAccent: "text-[#0D3880]",
}

export function createIcon(displayName: string, path: React.ReactNode): React.FC<IconProps> {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = "standard", tone, title, alignY = "uppercase", className, ...props }, ref) => {
      const id = React.useId()

      return (
        <svg
          ref={ref}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          role={title ? "img" : undefined}
          aria-hidden={!title}
          aria-labelledby={title ? id : undefined}
          className={cn(
            sizeClasses[size],
            tone && toneClasses[tone],
            alignY === "lowercase" && "translate-y-[0.1em]",
            "inline-block shrink-0",
            className,
          )}
          {...props}
        >
          {title && <title id={id}>{title}</title>}
          {path}
        </svg>
      )
    },
  )
  Icon.displayName = displayName
  return Icon as React.FC<IconProps>
}

/** Filled Braid icons (e.g. IconSort) — no stroke, custom viewBox */
export function createFilledIcon(
  displayName: string,
  path: React.ReactNode,
  viewBox = "0 0 24 24",
): React.FC<IconProps> {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = "standard", tone, title, alignY = "uppercase", className, ...props }, ref) => {
      const id = React.useId()

      return (
        <svg
          ref={ref}
          viewBox={viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role={title ? "img" : undefined}
          aria-hidden={!title}
          aria-labelledby={title ? id : undefined}
          className={cn(
            sizeClasses[size],
            tone && toneClasses[tone],
            alignY === "lowercase" && "translate-y-[0.1em]",
            "inline-block shrink-0",
            className,
          )}
          {...props}
        >
          {title && <title id={id}>{title}</title>}
          {path}
        </svg>
      )
    },
  )
  Icon.displayName = displayName
  return Icon as React.FC<IconProps>
}
