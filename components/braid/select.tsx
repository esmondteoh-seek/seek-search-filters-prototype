"use client"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  id: string
  label: string
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  description?: string
  message?: string
  tone?: "neutral" | "critical" | "positive"
  disabled?: boolean
  className?: string
}

export function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Please select",
  description,
  message,
  tone = "neutral",
  disabled = false,
  className,
}: SelectProps) {
  const toneClasses = {
    neutral: "border-[#C8CED8] focus:border-[#0d3880]",
    critical: "border-[#B91E1E] focus:border-[#B91E1E]",
    positive: "border-[#007833] focus:border-[#007833]",
  }

  const messageToneClasses = {
    neutral: "text-[#5A6881]",
    critical: "text-[#B91E1E]",
    positive: "text-[#007833]",
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-sm font-medium text-[#2E3849]">
        {label}
      </label>
      {description && <p className="text-sm text-[#5A6881]">{description}</p>}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-lg border bg-white px-4 py-3 pr-10 text-[#2E3849] outline-none transition-colors",
            toneClasses[tone],
            disabled && "cursor-not-allowed bg-[#F5F6F8] opacity-50",
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5A6881]" />
      </div>
      {message && <p className={cn("text-sm", messageToneClasses[tone])}>{message}</p>}
    </div>
  )
}
