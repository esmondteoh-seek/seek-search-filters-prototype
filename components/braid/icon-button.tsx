import type * as React from "react"
import { cn } from "@/lib/utils"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: React.ReactNode
  size?: "standard" | "small" | "large"
  tone?: "neutral" | "brandAccent" | "critical" | "formAccent"
  variant?: "solid" | "ghost" | "soft"
  loading?: boolean
}

export function IconButton({
  label,
  icon,
  size = "standard",
  tone = "neutral",
  variant = "ghost",
  loading = false,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    small: "h-8 w-8",
    standard: "h-10 w-10",
    large: "h-12 w-12",
  }

  const iconSizeStyles = {
    small: "[&_svg]:h-4 [&_svg]:w-4",
    standard: "[&_svg]:h-5 [&_svg]:w-5",
    large: "[&_svg]:h-6 [&_svg]:w-6",
  }

  const variantToneStyles = {
    solid: {
      neutral: "bg-[#2d3648] text-white hover:bg-[#1c2230]",
      brandAccent: "bg-[#e60278] text-white hover:bg-[#d1006d]",
      critical: "bg-[#d0011b] text-white hover:bg-[#b80017]",
      formAccent: "bg-[#2765cf] text-white hover:bg-[#1e47a9]",
    },
    ghost: {
      neutral: "text-[#2d3648] hover:bg-[#f5f6f8]",
      brandAccent: "text-[#e60278] hover:bg-[#fff5f8]",
      critical: "text-[#d0011b] hover:bg-[#fff1f3]",
      formAccent: "text-[#2765cf] hover:bg-[#eef4ff]",
    },
    soft: {
      neutral: "bg-[#f5f6f8] text-[#2d3648] hover:bg-[#e6e9ed]",
      brandAccent: "bg-[#fff5f8] text-[#e60278] hover:bg-[#ffe6f0]",
      critical: "bg-[#fff1f3] text-[#d0011b] hover:bg-[#ffe4e8]",
      formAccent: "bg-[#eef4ff] text-[#2765cf] hover:bg-[#dde9ff]",
    },
  }

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2765cf] focus-visible:ring-offset-2",
        sizeStyles[size],
        iconSizeStyles[size],
        variantToneStyles[variant][tone],
        (disabled || loading) && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon
      )}
    </button>
  )
}
