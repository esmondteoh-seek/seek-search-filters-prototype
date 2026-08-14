"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AutosuggestProps<T> {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onSelect?: (item: T) => void
  suggestions: T[]
  getSuggestionLabel: (item: T) => string
  placeholder?: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function Autosuggest<T>({
  id,
  label,
  value,
  onChange,
  onSelect,
  suggestions,
  getSuggestionLabel,
  placeholder,
  description,
  icon,
  className,
}: AutosuggestProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter((item) =>
    getSuggestionLabel(item).toLowerCase().includes(value.toLowerCase()),
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      const item = filteredSuggestions[highlightedIndex]
      onChange(getSuggestionLabel(item))
      onSelect?.(item)
      setIsOpen(false)
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("relative flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-sm font-medium text-[#2E3849]">
        {label}
      </label>
      {description && <p className="text-sm text-[#5A6881]">{description}</p>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6881]">{icon}</span>}
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
            setHighlightedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-[#C8CED8] bg-white px-4 py-3 text-[#2E3849] outline-none transition-colors focus:border-[#0d3880]",
            icon && "pl-10",
          )}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
        />
      </div>
      {isOpen && filteredSuggestions.length > 0 && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#E8EAF0] bg-white py-1 shadow-lg"
        >
          {filteredSuggestions.map((item, index) => (
            <li
              key={index}
              role="option"
              aria-selected={index === highlightedIndex}
              className={cn(
                "cursor-pointer px-4 py-2",
                index === highlightedIndex ? "bg-[#F5F6F8]" : "hover:bg-[#F5F6F8]",
              )}
              onClick={() => {
                onChange(getSuggestionLabel(item))
                onSelect?.(item)
                setIsOpen(false)
              }}
            >
              {getSuggestionLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
