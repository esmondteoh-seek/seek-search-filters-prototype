"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { Text } from "./text"

type AlertTone = "info" | "promote" | "positive" | "caution" | "critical"

interface AlertProps {
  children: ReactNode
  tone?: AlertTone
  closeLabel?: string
  onClose?: () => void
  className?: string
}

const toneClasses: Record<AlertTone, { bg: string; border: string; icon: string }> = {
  info: {
    bg: "bg-[#E3F2FB]",
    border: "border-l-4 border-l-[#1D559D]",
    icon: "text-[#1D559D]",
  },
  promote: {
    bg: "bg-[#F9EBFD]",
    border: "border-l-4 border-l-[#7F35A9]",
    icon: "text-[#7F35A9]",
  },
  positive: {
    bg: "bg-[#E2F7F1]",
    border: "border-l-4 border-l-[#12784F]",
    icon: "text-[#12784F]",
  },
  caution: {
    bg: "bg-[#FEF8DE]",
    border: "border-l-4 border-l-[#B9800D]",
    icon: "text-[#B9800D]",
  },
  critical: {
    bg: "bg-[#FEF3F3]",
    border: "border-l-4 border-l-[#B91E1E]",
    icon: "text-[#B91E1E]",
  },
}

const toneIcons: Record<AlertTone, ReactNode> = {
  info: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  promote: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
  positive: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  caution: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  critical: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
}

export function Alert({ children, tone = "info", closeLabel = "Close", onClose, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("flex gap-3 p-4 rounded-lg", toneClasses[tone].bg, toneClasses[tone].border, className)}
    >
      <span className={cn("shrink-0", toneClasses[tone].icon)}>{toneIcons[tone]}</span>
      <div className="flex-1">
        <Text>{children}</Text>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className={cn("shrink-0 p-1 -m-1 rounded hover:bg-black/5 transition-colors", toneClasses[tone].icon)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
