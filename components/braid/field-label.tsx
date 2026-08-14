import type * as React from "react"
import { cn } from "@/lib/utils"

interface FieldLabelProps {
  htmlFor: string
  label: string
  secondaryLabel?: string
  tertiaryLabel?: React.ReactNode
  description?: string
  descriptionId?: string
  disabled?: boolean
  className?: string
}

export function FieldLabel({
  htmlFor,
  label,
  secondaryLabel,
  tertiaryLabel,
  description,
  descriptionId,
  disabled = false,
  className,
}: FieldLabelProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className={cn("font-medium text-[#2d3648]", disabled && "opacity-50")}>
          {label}
          {secondaryLabel && <span className="ml-1 font-normal text-[#5a6881]">({secondaryLabel})</span>}
        </label>
        {tertiaryLabel && <span className="text-sm">{tertiaryLabel}</span>}
      </div>
      {description && (
        <p id={descriptionId} className="text-sm text-[#5a6881]">
          {description}
        </p>
      )}
    </div>
  )
}
