import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type BadgeTone = "info" | "promote" | "positive" | "caution" | "critical" | "neutral"
type BadgeWeight = "strong" | "regular"

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  weight?: BadgeWeight
  bleedY?: boolean
  className?: string
}

const toneClasses: Record<BadgeTone, Record<BadgeWeight, string>> = {
  info: {
    strong: "bg-[#1D559D] text-white",
    regular: "bg-[#E3F2FB] text-[#1D559D]",
  },
  promote: {
    strong: "bg-[#7F35A9] text-white",
    regular: "bg-[#F9EBFD] text-[#7F35A9]",
  },
  positive: {
    strong: "bg-[#12784F] text-white",
    regular: "bg-[#E2F7F1] text-[#12784F]",
  },
  caution: {
    strong: "bg-[#B9800D] text-white",
    regular: "bg-[#FEF8DE] text-[#B9800D]",
  },
  critical: {
    strong: "bg-[#B91E1E] text-white",
    regular: "bg-[#FEF3F3] text-[#B91E1E]",
  },
  neutral: {
    strong: "bg-[#2E3849] text-white",
    regular: "bg-[#F3F5F7] text-[#2E3849]",
  },
}

export function Badge({ children, tone = "info", weight = "regular", bleedY = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded",
        toneClasses[tone][weight],
        bleedY && "-my-0.5",
        className,
      )}
    >
      {children}
    </span>
  )
}
