import { useEffect, useId, useRef, useState } from "react"
import { IconClose, IconLocation } from "@/components/braid/icons"
import { SearchFieldClearButton } from "@/src/components/shared/SearchFieldClearButton"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import {
  suggestFutureVisionLocations,
  type FutureVisionLocation,
} from "@/src/data/futureVisionLocations"
import { cn } from "@/lib/utils"

interface FutureVisionLocationFieldProps {
  onSubmit?: () => void
  className?: string
  inputClassName?: string
  /** In-field pills + rest summary (overlay / desktop Where) */
  withFieldChrome?: boolean
  /** Focus ring offset against navy band vs overlay sheet */
  focusRingOffset?: "navy" | "overlay"
  /** Desktop multi-pills: selected locations in the suggestion panel, field stays h-12 */
  pillPlacement?: "field" | "dropdown"
}

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

function LocationPill({
  label,
  index,
  onRemove,
}: {
  label: string
  index: number
  onRemove: (index: number) => void
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-[#F5F7FA] py-1 pl-2 pr-1 text-sm text-[#2E3849]">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onRemove(index)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#5A6881] hover:bg-[#EAECF1] hover:text-[#2E3849] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
        aria-label={`Remove ${label}`}
      >
        <IconClose className="h-3.5 w-3.5" aria-hidden />
      </button>
    </span>
  )
}

const fieldChromeBase =
  "flex min-w-0 items-center gap-3 rounded-xl bg-white px-4 transition-shadow focus-within:ring-2 focus-within:ring-[#1E47A9] focus-within:ring-offset-2"

/** Where field with production-like prefix autosuggest (AU + MY) */
export function FutureVisionLocationField({
  onSubmit,
  className,
  inputClassName,
  withFieldChrome = false,
  focusRingOffset,
  pillPlacement = "field",
}: FutureVisionLocationFieldProps) {
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const {
    locations,
    locationQuery,
    isEditingLocation,
    setLocationQuery,
    startEditingLocation,
    stopEditingLocation,
    selectSuggestion,
    removeLocationPill,
    clearLocations,
  } = useFutureVisionLocations()

  const [fieldFocused, setFieldFocused] = useState(false)

  const locationCount = locations.length
  const locationCountLabel = `${locationCount} locations`
  const overlayPillMode = withFieldChrome
  const pillsInDropdown = overlayPillMode && pillPlacement === "dropdown"
  const pillsInField = overlayPillMode && pillPlacement === "field"
  const ringOffsetClass =
    (focusRingOffset ?? (withFieldChrome ? "overlay" : "navy")) === "navy"
      ? "focus-within:ring-offset-[#051A49]"
      : "focus-within:ring-offset-[#2E3849]"
  const overlayShowRest =
    overlayPillMode && !fieldFocused && !isEditingLocation && locationCount > 0
  const overlayShowPills = pillsInField && (fieldFocused || isEditingLocation)
  const overlayRestLabel = locationCount === 1 ? locations[0] : locationCountLabel
  const showSummary = !overlayPillMode && locationCount > 1 && !isEditingLocation
  const displayValue = overlayPillMode
    ? locationQuery
    : showSummary
      ? locationCountLabel
      : isEditingLocation
        ? locationQuery
        : locationQuery || locations[0] || ""

  const suggestions = suggestFutureVisionLocations(locationQuery)
  const showFieldClear = overlayPillMode
    ? locations.length > 0 || locationQuery.length > 0
    : displayValue.length > 0

  const shouldOpenDropdown = (query: string) =>
    locations.length > 0 || query.trim().length >= 2

  const showDropdownPanel =
    isOpen &&
    (pillsInDropdown
      ? locations.length > 0 || suggestions.length > 0
      : suggestions.length > 0)

  useEffect(() => {
    if (overlayShowPills && fieldFocused) {
      inputRef.current?.focus()
    }
  }, [overlayShowPills, fieldFocused])

  useEffect(() => {
    setHighlightedIndex(suggestions.length > 0 ? 0 : -1)
  }, [suggestions.length, locationQuery, isEditingLocation])

  const handleSelect = (location: FutureVisionLocation) => {
    selectSuggestion(location)
    if (pillsInDropdown) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const handleFocus = () => {
    setFieldFocused(true)
    if (showSummary) {
      startEditingLocation()
      setIsOpen(false)
      return
    }
    if (!isEditingLocation) {
      startEditingLocation()
      if (!overlayPillMode && locations.length === 1) {
        setLocationQuery("")
      }
    }
    if (pillsInDropdown) {
      setIsOpen(shouldOpenDropdown(locationQuery))
    } else {
      setIsOpen(locationQuery.trim().length >= 2)
    }
  }

  const handleChange = (value: string) => {
    if (showSummary) startEditingLocation()
    if (!isEditingLocation) startEditingLocation()
    setLocationQuery(value)
    if (pillsInDropdown) {
      setIsOpen(shouldOpenDropdown(value))
    } else {
      setIsOpen(value.trim().length >= 2)
    }
  }

  const handleClearAll = () => {
    if (overlayPillMode) {
      clearLocations()
    } else {
      setLocationQuery("")
      startEditingLocation()
    }
    inputRef.current?.focus()
    if (pillsInDropdown) {
      setIsOpen(false)
    }
  }

  const handleRemovePill = (index: number) => {
    removeLocationPill(index)
    inputRef.current?.focus()
    if (pillsInDropdown) {
      setIsOpen(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
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

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
      setFieldFocused(false)
      if (overlayPillMode && locations.length > 0) {
        stopEditingLocation()
      }
    }, 150)
  }

  const handleFocusRest = () => {
    setFieldFocused(true)
    startEditingLocation()
    inputRef.current?.focus()
    if (pillsInDropdown) {
      setIsOpen(shouldOpenDropdown(locationQuery))
    }
  }

  const showPlaceholder =
    pillsInDropdown
      ? !overlayShowRest
      : !(overlayPillMode && (locations.length > 0 || overlayShowRest))

  const inputElement = (
    <input
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={(e) => handleChange(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={showPlaceholder ? "Enter suburb, city, or region" : undefined}
      spellCheck={false}
      autoComplete="off"
      className={cn(
        "search-input-no-clear min-w-0 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]",
        overlayPillMode ? "min-w-0 flex-1" : "min-w-0 flex-1",
        pillsInField && "min-w-[8rem]",
        showSummary && "cursor-pointer",
        inputClassName,
      )}
      aria-label={showSummary ? locationCountLabel : "Location"}
      aria-expanded={showDropdownPanel}
      aria-controls={listboxId}
      aria-autocomplete="list"
      role="combobox"
    />
  )

  const fieldInner = pillsInDropdown ? (
    overlayShowRest ? (
      <>
        <IconLocation className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
        <button
          type="button"
          onClick={handleFocusRest}
          className="min-w-0 flex-1 truncate text-left text-base text-[#2E3849] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
          aria-label={overlayRestLabel}
        >
          {overlayRestLabel}
        </button>
        <input
          ref={inputRef}
          type="text"
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SearchFieldClearButton
          visible={showFieldClear}
          onClear={handleClearAll}
          label="Clear all locations"
        />
      </>
    ) : (
      <>
        <IconLocation className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
        {inputElement}
        <SearchFieldClearButton
          visible={showFieldClear}
          onClear={handleClearAll}
          label="Clear all locations"
        />
      </>
    )
  ) : overlayPillMode ? (
    overlayShowRest ? (
      <>
        <IconLocation className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
        <button
          type="button"
          onClick={handleFocusRest}
          className="min-w-0 flex-1 truncate py-2 text-left text-base text-[#2E3849] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
          aria-label={overlayRestLabel}
        >
          {overlayRestLabel}
        </button>
        <input
          ref={inputRef}
          type="text"
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SearchFieldClearButton
          visible={showFieldClear}
          onClear={handleClearAll}
          label="Clear all locations"
        />
      </>
    ) : (
      <>
        <IconLocation className="h-5 w-5 shrink-0 self-start pt-2.5 text-[#5A6881]" aria-hidden />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 py-2">
          {overlayShowPills
            ? locations.map((label, index) => (
                <LocationPill
                  key={`${label}-${index}`}
                  label={label}
                  index={index}
                  onRemove={removeLocationPill}
                />
              ))
            : null}
          {inputElement}
        </div>
        <SearchFieldClearButton
          visible={showFieldClear}
          onClear={handleClearAll}
          label="Clear all locations"
          className="self-start pt-2.5"
        />
      </>
    )
  ) : (
    <>
      <IconLocation className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
      {inputElement}
      <SearchFieldClearButton
        visible={showFieldClear}
        onClear={handleClearAll}
        label="Clear location"
      />
    </>
  )

  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <div
        className={cn(
          fieldChromeBase,
          pillsInDropdown || overlayShowRest || !overlayPillMode
            ? "h-12 items-center"
            : "min-h-12 items-start",
          ringOffsetClass,
        )}
      >
        {fieldInner}
      </div>

      {showDropdownPanel ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-72 overflow-auto rounded-xl border border-[#EAECF1] bg-white shadow-lg"
        >
          {pillsInDropdown && locations.length > 0 ? (
            <div
              className="flex flex-wrap gap-2 border-b border-[#EAECF1] px-4 py-3"
              aria-label="Selected locations"
            >
              {locations.map((label, index) => (
                <LocationPill
                  key={`${label}-${index}`}
                  label={label}
                  index={index}
                  onRemove={handleRemovePill}
                />
              ))}
            </div>
          ) : null}
          {suggestions.length > 0 ? (
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
                    {highlightProduction(item.displayName, locationQuery)}
                  </span>
                  {item.secondaryLabel ? (
                    <span className="mt-0.5 block text-sm text-[#2E3849]">
                      {highlightProduction(item.secondaryLabel, locationQuery)}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
