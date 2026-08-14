"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface MenuItemProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  tone?: "neutral" | "critical"
  icon?: React.ReactNode
  id?: string
  disabled?: boolean
  className?: string
}

export function MenuItem({
  children,
  onClick,
  tone = "neutral",
  icon,
  id,
  disabled = false,
  className,
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
        "focus:outline-none focus-visible:bg-[#f5f6f8]",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "hover:bg-[#f5f6f8]",
        tone === "critical" ? "text-[#d0011b]" : "text-[#2d3648]",
        className,
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}

export function MenuItemCheckbox({
  children,
  checked,
  onChange,
  id,
  disabled = false,
  className,
}: {
  children: React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[#2d3648] transition-colors",
        "focus:outline-none focus-visible:bg-[#f5f6f8]",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "hover:bg-[#f5f6f8]",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
          checked ? "border-[#2765cf] bg-[#2765cf]" : "border-[#878f9b]",
        )}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span>{children}</span>
    </button>
  )
}

export function MenuItemDivider() {
  return <div role="separator" className="my-1 h-px bg-[#e6e9ed]" />
}
