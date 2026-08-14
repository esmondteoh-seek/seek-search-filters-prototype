"use client"

import * as React from "react"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface DropdownOption {
  value: string
  label: string
}

interface DropdownGroup {
  label: string
  options: DropdownOption[]
}

interface DropdownProps {
  id?: string
  label?: string
  secondaryLabel?: string
  tertiaryLabel?: React.ReactNode
  description?: string
  value: string
  onChange: (value: string) => void
  options?: DropdownOption[]
  groups?: DropdownGroup[]
  placeholder?: string
  disabled?: boolean
  message?: string
  tone?: "neutral" | "critical" | "positive" | "caution"
  icon?: React.ReactNode
  "aria-label"?: string
  "aria-labelledby"?: string
  className?: string
}

export function Dropdown({
  id,
  label,
  secondaryLabel,
  tertiaryLabel,
  description,
  value,
  onChange,
  options = [],
  groups = [],
  placeholder = "Please select",
  disabled = false,
  message,
  tone = "neutral",
  icon,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  className,
}: DropdownProps) {
  const fieldId = React.useId()
  const descriptionId = description ? `${fieldId}-description` : undefined
  const messageId = message ? `${fieldId}-message` : undefined

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
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex items-baseline justify-between">
          <label htmlFor={fieldId} className={cn("font-medium text-[#2d3648]", disabled && "opacity-50")}>
            {label}
            {secondaryLabel && <span className="ml-1 font-normal text-[#5a6881]">({secondaryLabel})</span>}
          </label>
          {tertiaryLabel && <span className="text-sm">{tertiaryLabel}</span>}
        </div>
      )}

      {description && (
        <p id={descriptionId} className="text-sm text-[#5a6881]">
          {description}
        </p>
      )}

      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6881]">{icon}</span>}
        <select
          id={id || fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={[descriptionId, messageId].filter(Boolean).join(" ") || undefined}
          aria-invalid={tone === "critical"}
          className={cn(
            "w-full appearance-none rounded-md border-2 bg-white py-2.5 pr-10 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#2765cf]/20",
            icon ? "pl-10" : "pl-3",
            toneStyles[message ? tone : "neutral"],
            disabled && "cursor-not-allowed bg-[#f5f6f8] opacity-50",
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5a6881]" />
      </div>

      {message && (
        <p id={messageId} className={cn("text-sm", messageToneStyles[tone])}>
          {message}
        </p>
      )}
    </div>
  )
}
