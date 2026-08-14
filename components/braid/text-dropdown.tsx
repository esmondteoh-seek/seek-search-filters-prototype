"use client"
import { useState, useRef, useEffect } from "react"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface TextDropdownOption {
  value: string
  label: string
}

interface TextDropdownProps {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  options: TextDropdownOption[]
  size?: "standard" | "small" | "large"
  weight?: "regular" | "medium" | "strong"
  className?: string
}

export function TextDropdown({
  id,
  label,
  value,
  onChange,
  options,
  size = "standard",
  weight = "regular",
  className,
}: TextDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  const sizeStyles = {
    small: "text-sm",
    standard: "text-base",
    large: "text-lg",
  }

  const weightStyles = {
    regular: "font-normal",
    medium: "font-medium",
    strong: "font-semibold",
  }

  return (
    <div ref={dropdownRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
        className={cn(
          "inline-flex items-center gap-1 text-[#2765cf] transition-colors hover:text-[#0d3880]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2765cf] focus-visible:ring-offset-2",
          sizeStyles[size],
          weightStyles[weight],
        )}
      >
        <span className="underline">{selectedOption?.label || label}</span>
        <IconChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                "w-full px-4 py-2 text-left transition-colors hover:bg-[#f5f6f8]",
                option.value === value ? "font-medium text-[#2765cf]" : "text-[#2d3648]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
