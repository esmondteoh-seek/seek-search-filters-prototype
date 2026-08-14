"use client"

import type React from "react"
import { IconClear } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface TagProps {
  children: React.ReactNode
  onClear?: () => void
  className?: string
}

export function Tag({ children, onClear, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[#E8EAF0] px-3 py-1 text-sm text-[#2E3849]",
        className,
      )}
    >
      {children}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="ml-1 rounded-full p-0.5 hover:bg-[#C8CED8]"
          aria-label="Remove"
        >
          <IconClear className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
