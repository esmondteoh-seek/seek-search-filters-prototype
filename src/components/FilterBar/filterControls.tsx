import { Checkbox } from "@/components/braid"
import { Stack } from "@/components/braid"
import { Text } from "@/components/braid"
import { IconAdd, IconChevronDown, IconClear } from "@/components/braid/icons"
import {
  CLASSIFICATIONS,
  DISTANCE_FILTER_OPTIONS,
  LISTING_TIME_OPTIONS,
  PAY_FROM_AMOUNTS,
  PAY_PERIODS,
  PAY_TO_AMOUNTS,
  PAY_TO_OPEN,
  REMOTE_OPTIONS,
  WORK_TYPES,
  formatPayFilterAmount,
  formatPayRange,
  type PayPeriod,
} from "@/src/data/jobs"
import type { FilterState } from "@/src/hooks/useJobFilters"
import { cn } from "@/lib/utils"
import { useFilterControlState } from "./FilterDraftContext"

interface FilterControlsProps {
  filters?: FilterState
  onChange?: (patch: Partial<FilterState>) => void
  /** Compact layout for popovers vs spacious for sheet vs full-bleed modal vs drawer */
  variant?: "popover" | "sheet" | "modal" | "drawer"
}

function PayRangeSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label htmlFor={id} className="text-base font-medium text-[#2E3849]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none rounded-lg border border-[#D2D7DF] bg-white",
            "px-3 py-2.5 pr-9 text-base text-[#2E3849] outline-none",
            "transition-colors focus:border-[#1E47A9] focus:ring-2 focus:ring-[#1E47A9]/20",
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6881]" />
      </div>
    </div>
  )
}

function DrawerRadioOption({
  checked,
  label,
  onSelect,
}: {
  checked: boolean
  label: string
  onSelect: () => void
  name: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className="flex w-full cursor-pointer items-center gap-4 rounded-lg py-0.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-[#1E47A9] bg-[#1E47A9]" : "border-[#5A6881] bg-white",
        )}
        aria-hidden
      >
        {checked ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
      </span>
      <span className="text-sm text-[#2E3849]">{label}</span>
    </button>
  )
}

export function PayFilterContent({ filters, onChange, variant = "popover" }: FilterControlsProps) {
  const { draft, patchDraft } = useFilterControlState(filters, onChange)
  const period = draft.payPeriod ?? "annual"

  const fromOptions = [
    { value: "", label: "Any" },
    ...PAY_FROM_AMOUNTS.map((amount) => ({
      value: String(amount),
      label: formatPayFilterAmount(amount, period),
    })),
  ]

  const toOptions = PAY_TO_AMOUNTS.map((amount) => ({
    value: amount === PAY_TO_OPEN ? "open" : String(amount),
    label: formatPayFilterAmount(amount, period, amount === PAY_TO_OPEN),
  }))

  const fromValue = draft.payMin != null ? String(draft.payMin) : ""
  const toValue = draft.payMax != null ? String(draft.payMax) : "open"

  const handleFromChange = (value: string) => {
    patchDraft({ payMin: value ? Number(value) : null })
  }

  const handleToChange = (value: string) => {
    if (value === "open") {
      patchDraft({ payMax: null })
      return
    }
    patchDraft({ payMax: Number(value) })
  }

  const handlePeriodChange = (nextPeriod: PayPeriod) => {
    patchDraft({ payPeriod: nextPeriod })
  }

  if (variant === "drawer") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {PAY_PERIODS.map(({ value, label }) => (
            <DrawerRadioOption
              key={value}
              name="payPeriod"
              label={label}
              checked={period === value}
              onSelect={() => handlePeriodChange(value)}
            />
          ))}
        </div>
        <div className="flex gap-4">
          <PayRangeSelect
            id="pay-from-drawer"
            label="From • AUD"
            value={fromValue}
            onChange={handleFromChange}
            options={fromOptions}
          />
          <PayRangeSelect
            id="pay-to-drawer"
            label="To • AUD"
            value={toValue}
            onChange={handleToChange}
            options={toOptions}
          />
        </div>
      </div>
    )
  }

  return (
    <Stack space={variant === "sheet" ? "medium" : "small"}>
      <div className="border-b border-[#EAECF1]">
        <div className="flex gap-6" role="tablist" aria-label="Pay period">
          {PAY_PERIODS.map(({ value, label }) => {
            const selected = period === value
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => handlePeriodChange(value)}
                className={cn(
                  "relative pb-3 text-base font-medium transition-colors",
                  selected ? "text-[#1E47A9]" : "text-[#5A6881] hover:text-[#2E3849]",
                )}
              >
                {label}
                {selected && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-sm bg-[#1E47A9]" aria-hidden />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className={cn("grid gap-4", variant === "sheet" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2")}>
        <PayRangeSelect
          id="pay-from"
          label="From • AUD"
          value={fromValue}
          onChange={handleFromChange}
          options={fromOptions}
        />
        <PayRangeSelect
          id="pay-to"
          label="To • AUD"
          value={toValue}
          onChange={handleToChange}
          options={toOptions}
        />
      </div>
    </Stack>
  )
}

export function ClassificationFilterContent({ filters, onChange, variant = "popover" }: FilterControlsProps) {
  const { draft, patchDraft } = useFilterControlState(filters, onChange)

  const toggle = (classification: string) => {
    const next = draft.classifications.includes(classification)
      ? draft.classifications.filter((c) => c !== classification)
      : [...draft.classifications, classification]
    patchDraft({ classifications: next })
  }

  if (variant === "modal" || variant === "drawer") {
    return (
      <div className="box-border h-[416px] max-h-[416px] w-full min-w-0 overflow-y-auto overscroll-contain rounded-lg bg-[#E4E8ED] px-5 py-5">
        <div className="flex w-full min-w-0 flex-col gap-4">
          {CLASSIFICATIONS.map((classification) => {
            const checked = draft.classifications.includes(classification)
            const inputId = `classification-${classification.replace(/\W+/g, "-").toLowerCase()}`
            return (
              <label
                key={classification}
                htmlFor={inputId}
                className="flex w-full min-w-0 cursor-pointer items-start gap-3"
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(classification)}
                  className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-lg border-2 border-[#838FA5] text-[#1E47A9] focus:ring-2 focus:ring-[#1E47A9] focus:ring-offset-2"
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 text-base leading-[25px] text-[#2E3849]",
                    checked ? "font-medium" : "font-normal",
                  )}
                >
                  {classification}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  const list = (
    <Stack space={variant === "sheet" ? "small" : "xsmall"} className="w-full">
      {CLASSIFICATIONS.map((classification) => (
        <Checkbox
          key={classification}
          label={classification}
          size="small"
          checked={draft.classifications.includes(classification)}
          onChange={() => toggle(classification)}
          className="w-full"
        />
      ))}
    </Stack>
  )

  if (variant === "sheet") {
    return (
      <div className="max-h-[360px] overflow-y-auto overscroll-contain rounded-lg bg-[#F3F5F7] p-3">
        {list}
      </div>
    )
  }

  return <div className="max-h-56 overflow-y-auto overscroll-contain">{list}</div>
}

export function WorkTypeFilterContent({ filters, onChange, variant = "popover" }: FilterControlsProps) {
  const { draft, patchDraft } = useFilterControlState(filters, onChange)

  const toggle = (workType: (typeof WORK_TYPES)[number]) => {
    const next = draft.workTypes.includes(workType)
      ? draft.workTypes.filter((w) => w !== workType)
      : [...draft.workTypes, workType]
    patchDraft({ workTypes: next })
  }

  const drawerLabels: Record<(typeof WORK_TYPES)[number], string> = {
    "Full time": "Full time",
    "Part time": "Part time",
    Contract: "Contract/Temp",
    Casual: "Casual/Vacation",
  }

  if (variant === "drawer") {
    return (
      <div className="flex flex-wrap gap-[11px]">
        {WORK_TYPES.map((workType) => {
          const selected = draft.workTypes.includes(workType)
          return (
            <button
              key={workType}
              type="button"
              onClick={() => toggle(workType)}
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-base transition-colors",
                selected
                  ? "bg-[#242C39] text-white hover:bg-[#1C2330]"
                  : "border-2 border-[#EAECF1] text-[#2E3849] hover:border-[#D2D7DF]",
              )}
            >
              <span>{drawerLabels[workType]}</span>
              {selected ? (
                <IconClear className="h-[18px] w-[18px] shrink-0" aria-hidden />
              ) : (
                <IconAdd className="h-3.5 w-3.5 shrink-0" aria-hidden />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <Stack space="xsmall">
      {WORK_TYPES.map((workType) => (
        <Checkbox
          key={workType}
          label={workType}
          size="small"
          checked={draft.workTypes.includes(workType)}
          onChange={() => toggle(workType)}
        />
      ))}
    </Stack>
  )
}

export function RemoteFilterContent({ filters, onChange, variant = "popover" }: FilterControlsProps) {
  const { draft, patchDraft } = useFilterControlState(filters, onChange)

  const toggle = (option: (typeof REMOTE_OPTIONS)[number]) => {
    const next = draft.remoteOptions.includes(option)
      ? draft.remoteOptions.filter((o) => o !== option)
      : [...draft.remoteOptions, option]
    patchDraft({ remoteOptions: next })
  }

  if (variant === "drawer") {
    return (
      <div className="flex flex-col gap-4">
        {REMOTE_OPTIONS.map((option) => {
          const checked = draft.remoteOptions.includes(option)
          const inputId = `remote-drawer-${option.replace(/\W+/g, "-").toLowerCase()}`
          return (
            <label
              key={option}
              htmlFor={inputId}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="h-6 w-6 shrink-0 cursor-pointer rounded-lg border-2 border-[#838FA5] text-[#1E47A9] focus:ring-2 focus:ring-[#1E47A9] focus:ring-offset-2"
              />
              <span className={cn("text-base text-[#2E3849]", checked && "font-medium")}>
                {option === "Fully remote" ? "Remote" : option}
              </span>
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <Stack space="xsmall">
      {REMOTE_OPTIONS.map((option) => (
        <Checkbox
          key={option}
          label={option}
          size="small"
          checked={draft.remoteOptions.includes(option)}
          onChange={() => toggle(option)}
        />
      ))}
    </Stack>
  )
}

export function ListingTimeFilterContent({ filters, onChange, variant = "popover" }: FilterControlsProps) {
  const { draft, patchDraft } = useFilterControlState(filters, onChange)

  if (variant === "drawer") {
    return (
      <div className="flex flex-col gap-4">
        {LISTING_TIME_OPTIONS.map((option) => (
          <DrawerRadioOption
            key={option.value}
            name="listingTime"
            label={option.label}
            checked={draft.listingTime === option.value}
            onSelect={() => patchDraft({ listingTime: option.value })}
          />
        ))}
      </div>
    )
  }

  return (
    <Stack space="xsmall">
      {LISTING_TIME_OPTIONS.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-4 rounded-lg py-1 hover:bg-[#F7F8FB]"
        >
          <input
            type="radio"
            name="listingTime"
            checked={draft.listingTime === option.value}
            onChange={() => patchDraft({ listingTime: option.value })}
            className="sr-only"
          />
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              draft.listingTime === option.value
                ? "border-[#1E47A9] bg-[#1E47A9]"
                : "border-[#838FA5] bg-white",
            )}
            aria-hidden
          >
            {draft.listingTime === option.value && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
          </span>
          <Text size="standard">{option.label}</Text>
        </label>
      ))}
    </Stack>
  )
}

/** Distance radius options — Figma node 4138:23592 */
export function DistanceFilterContent({ filters, onChange }: FilterControlsProps) {
  const { draft, patchDraft } = useFilterControlState(filters, onChange)

  return (
    <div className="flex flex-col gap-2">
      {DISTANCE_FILTER_OPTIONS.map((option) => {
        const selected = draft.distanceKm === option.value
        return (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-4 rounded-lg py-1 hover:bg-[#F7F8FB]"
          >
            <input
              type="radio"
              name="distance"
              checked={selected}
              onChange={() => patchDraft({ distanceKm: option.value })}
              className="sr-only"
            />
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                selected ? "border-[#1E47A9] bg-[#1E47A9]" : "border-[#838FA5] bg-white",
              )}
              aria-hidden
            >
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
            </span>
            <span className="text-base text-[#2E3849]">{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export function getPayAppliedLabel(filters: FilterState): string | undefined {
  if (filters.payMin == null && filters.payMax == null) return undefined
  if (filters.payMin != null && filters.payMax == null) {
    return `From $${Math.round(filters.payMin / 1000)}K`
  }
  return formatPayRange(filters.payMin, filters.payMax)
}

export function getClassificationAppliedLabel(filters: FilterState): string | undefined {
  const count = filters.classifications.length
  if (count === 0) return undefined
  return `${count} ${count === 1 ? "classification" : "classifications"}`
}

export function getWorkTypeAppliedLabel(filters: FilterState): string | undefined {
  const count = filters.workTypes.length
  if (count === 0) return undefined
  return `${count} ${count === 1 ? "work type" : "work types"}`
}

export function getRemoteAppliedLabel(filters: FilterState): string | undefined {
  const count = filters.remoteOptions.length
  if (count === 0) return undefined
  return `${count} ${count === 1 ? "remote option" : "remote options"}`
}

export function getListingTimeAppliedLabel(filters: FilterState, delivery = false): string | undefined {
  if (filters.listingTime === "any") return undefined
  if (delivery && filters.listingTime === "3d") return "Listed in last 3 days"
  return LISTING_TIME_OPTIONS.find((o) => o.value === filters.listingTime)?.label
}

export function getDistanceDisplayLabel(distanceKm: number): string {
  return DISTANCE_FILTER_OPTIONS.find((o) => o.value === distanceKm)?.label ?? `${distanceKm} km`
}

export function getDistanceAppliedLabel(filters: FilterState): string | undefined {
  if (filters.distanceKm === 50) return undefined
  return getDistanceDisplayLabel(filters.distanceKm)
}
