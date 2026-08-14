import type * as React from "react"
import { cn } from "@/lib/utils"

interface FieldMessageProps {
  id: string
  message?: string
  secondaryMessage?: React.ReactNode
  tone?: "neutral" | "critical" | "positive" | "caution"
  disabled?: boolean
  reserveMessageSpace?: boolean
  className?: string
}

export function FieldMessage({
  id,
  message,
  secondaryMessage,
  tone = "neutral",
  disabled = false,
  reserveMessageSpace = true,
  className,
}: FieldMessageProps) {
  if (disabled) return null

  const toneStyles = {
    neutral: "text-[#5a6881]",
    critical: "text-[#d0011b]",
    positive: "text-[#138a08]",
    caution: "text-[#8a4800]",
  }

  if (!message && !secondaryMessage) {
    return reserveMessageSpace ? <div className="h-5" aria-hidden /> : null
  }

  return (
    <div id={id} className={cn("flex items-baseline justify-between text-sm", className)}>
      {message && <span className={toneStyles[tone]}>{message}</span>}
      {secondaryMessage && <span className="text-[#5a6881]">{secondaryMessage}</span>}
    </div>
  )
}
