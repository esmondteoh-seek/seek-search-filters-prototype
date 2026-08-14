import type React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ButtonLinkProps {
  href: string
  children: React.ReactNode
  variant?: "solid" | "ghost" | "soft" | "transparent"
  tone?: "brandAccent" | "critical" | "neutral" | "formAccent"
  size?: "standard" | "small"
  className?: string
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  tone = "formAccent",
  size = "standard",
  className,
}: ButtonLinkProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors"

  const sizeClasses = {
    standard: "px-5 py-3 text-base",
    small: "px-4 py-2 text-sm",
  }

  const variantToneClasses = {
    solid: {
      brandAccent: "bg-[#E60278] text-white hover:bg-[#D10068]",
      critical: "bg-[#B91E1E] text-white hover:bg-[#9A1818]",
      neutral: "bg-[#2E3849] text-white hover:bg-[#1E2533]",
      formAccent: "bg-[#0d3880] text-white hover:bg-[#0A2D66]",
    },
    ghost: {
      brandAccent: "border-2 border-[#E60278] text-[#E60278] hover:bg-[#FFF0F7]",
      critical: "border-2 border-[#B91E1E] text-[#B91E1E] hover:bg-[#FFD9D9]",
      neutral: "border-2 border-[#2E3849] text-[#2E3849] hover:bg-[#F5F6F8]",
      formAccent: "border-2 border-[#0d3880] text-[#0d3880] hover:bg-[#E8F4FC]",
    },
    soft: {
      brandAccent: "bg-[#FFF0F7] text-[#E60278] hover:bg-[#FFE0EF]",
      critical: "bg-[#FFD9D9] text-[#B91E1E] hover:bg-[#FFC4C4]",
      neutral: "bg-[#F5F6F8] text-[#2E3849] hover:bg-[#E8EAF0]",
      formAccent: "bg-[#E8F4FC] text-[#0d3880] hover:bg-[#D0E8F9]",
    },
    transparent: {
      brandAccent: "text-[#E60278] hover:bg-[#FFF0F7]",
      critical: "text-[#B91E1E] hover:bg-[#FFD9D9]",
      neutral: "text-[#2E3849] hover:bg-[#F5F6F8]",
      formAccent: "text-[#0d3880] hover:bg-[#E8F4FC]",
    },
  }

  return (
    <Link href={href} className={cn(baseClasses, sizeClasses[size], variantToneClasses[variant][tone], className)}>
      {children}
    </Link>
  )
}
