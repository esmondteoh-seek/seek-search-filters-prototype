"use client"

import * as React from "react"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

const DEFAULT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface MonthPickerProps {
  id?: string
  label?: string
  secondaryLabel?: string
  tertiaryLabel?: React.ReactNode
  description?: string
  value?: { month?: number; year?: number }
  onChange: (value: { month?: number; year?: number }) => void
  monthNames?: string[]
  monthLabel?: string
  yearLabel?: string
  minYear?: number
  maxYear?: number
  ascendingYears?: boolean
  disabled?: boolean
  message?: string
  tone?: "neutral" | "critical" | "positive" | "caution"
  "aria-label"?: string
  "aria-labelledby"?: string
  className?: string
}

export function MonthPicker({
  id,
  label,
  secondaryLabel,
  tertiaryLabel,
  description,
  value = {},
  onChange,
  monthNames = DEFAULT_MONTHS,
  monthLabel = "Month",
  yearLabel = "Year",
  minYear = new Date().getFullYear() - 100,
  maxYear = new Date().getFullYear() + 10,
  ascendingYears = false,
  disabled = false,
  message,
  tone = "neutral",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  className,
}: MonthPickerProps) {
  const fieldId = React.useId()
  const descriptionId = description ? `${fieldId}-description` : undefined
  const messageId = message ? `${fieldId}-message` : undefined

  const years = React.useMemo(() => {
    const arr = []
    for (let y = minYear; y <= maxYear; y++) {
      arr.push(y)
    }
    return ascendingYears ? arr : arr.reverse()
  }, [minYear, maxYear, ascendingYears])

  const toneStyles = {
    neutral: "border-[#878f9b] focus:border-[#2765cf]",
    critical: "border-[#d0011b] focus:border-[#d0011b]",
    positive: "border-[#138a08] focus:border-[#138a08]",
    caution: "border-[#8a4800] focus:border-[#8a4800]",
  }

  const messageToneStyles = {
    neutral: "text-[#5a6881]",
    critical: "text-[#d0011b]",
    positive: "text-[#138a08]",
    caution: "text-[#8a4800]",
  }

  return (
    <fieldset className={cn("space-y-1", className)} aria-label={ariaLabel} aria-labelledby={ariaLabelledby}>
      {label && (
        <legend className={cn("font-medium text-[#2d3648]", disabled && "opacity-50")}>
          {label}
          {secondaryLabel && <span className="ml-1 font-normal text-[#5a6881]">({secondaryLabel})</span>}
          {tertiaryLabel && <span className="ml-2 text-sm">{tertiaryLabel}</span>}
        </legend>
      )}

      {description && (
        <p id={descriptionId} className="text-sm text-[#5a6881]">
          {description}
        </p>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            aria-label={monthLabel}
            value={value.month ?? ""}
            onChange={(e) => onChange({ ...value, month: e.target.value ? Number(e.target.value) : undefined })}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-md border-2 bg-white py-2.5 pl-3 pr-10 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-[#2765cf]/20",
              toneStyles[message ? tone : "neutral"],
              disabled && "cursor-not-allowed bg-[#f5f6f8] opacity-50",
            )}
          >
            <option value="">{monthLabel}</option>
            {monthNames.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5a6881]" />
        </div>

        <div className="relative flex-1">
          <select
            aria-label={yearLabel}
            value={value.year ?? ""}
            onChange={(e) => onChange({ ...value, year: e.target.value ? Number(e.target.value) : undefined })}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-md border-2 bg-white py-2.5 pl-3 pr-10 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-[#2765cf]/20",
              toneStyles[message ? tone : "neutral"],
              disabled && "cursor-not-allowed bg-[#f5f6f8] opacity-50",
            )}
          >
            <option value="">{yearLabel}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5a6881]" />
        </div>
      </div>

      {message && (
        <p id={messageId} className={cn("text-sm", messageToneStyles[tone])}>
          {message}
        </p>
      )}
    </fieldset>
  )
}
