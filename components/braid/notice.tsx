import type React from "react"
import { IconInfo, IconCritical, IconPositive, IconCaution } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface NoticeProps {
  tone?: "info" | "promote" | "positive" | "caution" | "critical"
  children: React.ReactNode
  className?: string
}

export function Notice({ tone = "info", children, className }: NoticeProps) {
  const toneConfig = {
    info: {
      bg: "bg-[#E8F4FC]",
      border: "border-[#1E47A9]",
      Icon: IconInfo,
      iconColor: "text-[#1E47A9]",
    },
    promote: {
      bg: "bg-[#F0D6FA]",
      border: "border-[#9556B7]",
      Icon: IconInfo,
      iconColor: "text-[#9556B7]",
    },
    positive: {
      bg: "bg-[#D4F7E5]",
      border: "border-[#007833]",
      Icon: IconPositive,
      iconColor: "text-[#007833]",
    },
    caution: {
      bg: "bg-[#FFECD4]",
      border: "border-[#A86500]",
      Icon: IconCaution,
      iconColor: "text-[#A86500]",
    },
    critical: {
      bg: "bg-[#FFD9D9]",
      border: "border-[#B91E1E]",
      Icon: IconCritical,
      iconColor: "text-[#B91E1E]",
    },
  }

  const config = toneConfig[tone]
  const Icon = config.Icon

  return (
    <div className={cn("flex gap-3 rounded-lg border-l-4 p-4", config.bg, config.border, className)} role="status">
      <Icon className={cn("h-5 w-5 shrink-0", config.iconColor)} />
      <div className="text-[#2E3849]">{children}</div>
    </div>
  )
}
