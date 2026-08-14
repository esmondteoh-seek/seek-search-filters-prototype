"use client"
import { cn } from "@/lib/utils"

interface ToggleProps {
  id: string
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: "standard" | "small"
  disabled?: boolean
  className?: string
}

export function Toggle({
  id,
  label,
  checked = false,
  onChange,
  size = "standard",
  disabled = false,
  className,
}: ToggleProps) {
  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  const sizeClasses = {
    standard: {
      track: "h-6 w-11",
      thumb: "h-5 w-5",
      translate: checked ? "translate-x-5" : "translate-x-0.5",
    },
    small: {
      track: "h-5 w-9",
      thumb: "h-4 w-4",
      translate: checked ? "translate-x-4" : "translate-x-0.5",
    },
  }

  return (
    <label
      htmlFor={id}
      className={cn("flex cursor-pointer items-center gap-3", disabled && "cursor-not-allowed opacity-50", className)}
    >
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        onClick={handleChange}
        disabled={disabled}
        className={cn(
          "relative inline-flex shrink-0 rounded-full transition-colors duration-200",
          sizeClasses[size].track,
          checked ? "bg-[#0d3880]" : "bg-[#C8CED8]",
          disabled && "cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "inline-block transform rounded-full bg-white shadow-sm transition-transform duration-200",
            sizeClasses[size].thumb,
            sizeClasses[size].translate,
            "mt-0.5",
          )}
        />
      </button>
      <span className="text-[#2E3849]">{label}</span>
    </label>
  )
}
