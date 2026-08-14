"use client"

import * as React from "react"
import { IconSearch, IconClear } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface SearchFieldProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  onSubmit?: () => void
  placeholder?: string
  disabled?: boolean
  "aria-label"?: string
  className?: string
}

export function SearchField({
  id,
  label,
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = "Search",
  disabled = false,
  "aria-label": ariaLabel,
  className,
}: SearchFieldProps) {
  const fieldId = React.useId()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleClear = () => {
    onChange("")
    onClear?.()
  }

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label htmlFor={fieldId} className={cn("block font-medium text-[#2d3648]", disabled && "opacity-50")}>
          {label}
        </label>
      )}

      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5a6881]" />
        <input
          id={fieldId}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel || label || placeholder}
          className={cn(
            "w-full rounded-md border-2 border-[#878f9b] bg-white py-2.5 pl-10 pr-10 transition-colors",
            "focus:border-[#2765cf] focus:outline-none focus:ring-2 focus:ring-[#2765cf]/20",
            disabled && "cursor-not-allowed bg-[#f5f6f8] opacity-50",
          )}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#5a6881] hover:bg-[#f5f6f8] hover:text-[#2d3648]"
          >
            <IconClear className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
