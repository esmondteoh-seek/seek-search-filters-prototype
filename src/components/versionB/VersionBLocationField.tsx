import { useEffect, useId, useRef, useState } from "react"
import { IconLocation } from "@/components/braid/icons"
import { SearchFieldClearButton } from "@/src/components/shared/SearchFieldClearButton"
import {
  suggestFutureVisionLocations,
  type FutureVisionLocation,
} from "@/src/data/futureVisionLocations"
import { cn } from "@/lib/utils"

function highlightProduction(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const q = query.toLowerCase()
  const lower = text.toLowerCase()
  const parts: React.ReactNode[] = []
  let cursor = 0
  let partIndex = 0

  while (cursor < text.length) {
    const idx = lower.indexOf(q, cursor)
    if (idx === -1) {
      parts.push(
        <strong key={partIndex++} className="font-semibold">
          {text.slice(cursor)}
        </strong>,
      )
      break
    }

    if (idx > cursor) {
      parts.push(
        <strong key={partIndex++} className="font-semibold">
          {text.slice(cursor, idx)}
        </strong>,
      )
    }

    parts.push(<span key={partIndex++}>{text.slice(idx, idx + q.length)}</span>)
    cursor = idx + q.length
  }

  return <>{parts}</>
}

interface VersionBLocationFieldProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  /** Navy band vs overlay sheet focus ring offset */
  focusRingOffset?: "navy" | "overlay" | "none"
  className?: string
  inputClassName?: string
  iconClassName?: string
  /** h-12 default; app sheet uses text-sm inputs */
  size?: "default" | "compact"
  /** Standalone white pill vs inline segment inside a shared search bar */
  chrome?: "pill" | "embedded"
  rounded?: "xl" | "lg"
}

/** Single-select Where field with production-like prefix autosuggest */
export function VersionBLocationField({
  value,
  onChange,
  onSubmit,
  placeholder = "Enter suburb, city, or region",
  focusRingOffset = "none",
  className,
  inputClassName,
  iconClassName = "h-5 w-5",
  size = "default",
  chrome = "pill",
  rounded = "xl",
}: VersionBLocationFieldProps) {
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const suggestions = suggestFutureVisionLocations(value)
  const showDropdown = isOpen && suggestions.length > 0

  useEffect(() => {
    setHighlightedIndex(suggestions.length > 0 ? 0 : -1)
  }, [suggestions.length, value])

  const handleSelect = (location: FutureVisionLocation) => {
    onChange(location.displayName)
    setIsOpen(false)
  }

  const handleFocus = () => {
    if (value.trim().length >= 2) setIsOpen(true)
  }

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150)
  }

  const handleChange = (next: string) => {
    onChange(next)
    setIsOpen(next.trim().length >= 2)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (showDropdown && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelect(suggestions[highlightedIndex])
        return
      }
      onSubmit?.()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
      setIsOpen(true)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const ringOffsetClass =
    focusRingOffset === "navy"
      ? "focus-within:ring-offset-[#051A49]"
      : focusRingOffset === "overlay"
        ? "focus-within:ring-offset-[#2E3849]"
        : undefined

  const fieldInner = (
    <>
      <IconLocation className={cn("shrink-0 text-[#5A6881]", iconClassName)} aria-hidden />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        className={cn(
          "search-input-no-clear min-w-0 flex-1 bg-transparent text-[#2E3849] outline-none placeholder:text-[#5A6881]",
          size === "default" ? "text-base" : "text-sm",
          inputClassName,
        )}
        aria-label="Location"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        role="combobox"
      />
      <SearchFieldClearButton
        visible={value.length > 0}
        onClear={() => {
          onChange("")
          inputRef.current?.focus()
        }}
        label="Clear location"
      />
    </>
  )

  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      {chrome === "pill" ? (
        <label
          className={cn(
            "flex items-center gap-3 bg-white px-4 transition-shadow focus-within:ring-2 focus-within:ring-[#1E47A9] focus-within:ring-offset-2",
            rounded === "lg" ? "rounded-lg" : "rounded-xl",
            size === "default" ? "h-12" : "h-12",
            ringOffsetClass,
          )}
        >
          {fieldInner}
        </label>
      ) : (
        <div
          className={cn(
            "flex h-full min-w-0 flex-1 items-center gap-3",
            ringOffsetClass && "focus-within:ring-2 focus-within:ring-[#1E47A9] focus-within:ring-offset-2",
            ringOffsetClass,
          )}
        >
          {fieldInner}
        </div>
      )}

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[100] max-h-72 overflow-auto rounded-xl border border-[#EAECF1] bg-white shadow-lg">
          <ul id={listboxId} role="listbox" className="py-2">
            {suggestions.map((item, index) => (
              <li
                key={item.id}
                role="option"
                aria-selected={index === highlightedIndex}
                className={cn(
                  "cursor-pointer px-4 py-3 text-base text-[#2E3849]",
                  index === highlightedIndex ? "bg-[#F5F8FF]" : "hover:bg-[#F5F8FF]",
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
              >
                <span className="block min-w-0">
                  {highlightProduction(item.displayName, value)}
                </span>
                {item.secondaryLabel ? (
                  <span className="mt-0.5 block text-sm text-[#2E3849]">
                    {highlightProduction(item.secondaryLabel, value)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
