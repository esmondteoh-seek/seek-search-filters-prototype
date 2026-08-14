import { IconTick } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { FilterSurfaceButton, FilterTick } from "@/src/components/motion/FilterSurfaceButton"
import { formatSmartFilterBadgeLabel } from "@/src/hooks/useJobFilters"

const chipThemes = {
  navy: {
    rounded: "rounded-full",
    activeBg: "bg-[#2455C9]",
    inactiveBorder: "border-2 border-white/25",
    inactiveBg: "bg-transparent",
    textActive: "text-white focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
    textInactive: "text-white hover:bg-white/5 focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
  },
  bar: {
    rounded: "rounded-lg",
    activeBg: "bg-[#2E3849]",
    inactiveBorder: "border-2 border-[#EAECF1]",
    inactiveBg: "bg-white",
    textActive: "text-white focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
    textInactive:
      "text-[#2E3849] hover:bg-[#F7F8FB] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
  },
} as const

interface SmartFilterChipProps {
  label: string
  count: number
  active: boolean
  showBadge?: boolean
  onToggle: () => void
  className?: string
  /** bar = white row; navy = inline on search band (Concept 2) */
  variant?: "bar" | "navy"
}

/** Smart filter chip — tick when active per Figma 4174 */
export function SmartFilterChip({
  label,
  count,
  active,
  showBadge = true,
  onToggle,
  className,
  variant = "bar",
}: SmartFilterChipProps) {
  const countLabel = formatSmartFilterBadgeLabel(count)
  const theme = chipThemes[variant]
  const isNavy = variant === "navy"

  return (
    <FilterSurfaceButton
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      active={active}
      theme={theme}
      className={cn(
        "text-base",
        isNavy && (active ? "h-10 gap-2 px-4" : "h-10 gap-1.5 px-3"),
        !isNavy && "px-3 py-2",
        className,
      )}
      contentClassName={isNavy ? (active ? "gap-2" : "gap-1.5") : "gap-2"}
    >
      <FilterTick visible={active}>
        <IconTick className="h-5 w-5" />
      </FilterTick>
      <span className="whitespace-nowrap">{label}</span>
      {showBadge && count > 0 && (
        <span
          className={cn(
            "inline-flex items-center text-xs font-medium tabular-nums",
            isNavy ? "rounded-full bg-[#F3F5F7] px-2 py-1 text-[#2E3849]" : "rounded-lg bg-[#F3F5F7] px-2 py-1 text-[#2E3849]",
          )}
          aria-label={`${count.toLocaleString("en-AU")} jobs`}
        >
          {countLabel}
        </span>
      )}
    </FilterSurfaceButton>
  )
}
