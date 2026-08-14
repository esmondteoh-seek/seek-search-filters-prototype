import { IconFilter } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { FilterSurfaceButton } from "@/src/components/motion/FilterSurfaceButton"

interface FiltersEntryControlProps {
  appliedCount: number
  onClick?: () => void
  /** Mobile opens full search form (Figma 4128:21899) instead of filters modal */
  opensSearchForm?: boolean
  /** Icon-only square button for compact sticky row */
  iconOnly?: boolean
  /** Non-interactive when no handler */
  readOnly?: boolean
  /** pill = 48px radius inline row; standard = 8px radius expanded filter row */
  shape?: "pill" | "standard"
  /** Inline compact row uses "More" per Figma 4174:25410 */
  label?: string
}

const filtersTheme = {
  default: {
    rounded: "rounded-lg",
    activeBg: "bg-[#2455C9]",
    inactiveBorder: "border-2 border-white/25",
    inactiveBg: "bg-transparent",
    textActive: "text-white focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
    textInactive:
      "text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
  },
  pill: {
    rounded: "rounded-full",
    activeBg: "bg-[#2455C9]",
    inactiveBorder: "border-2 border-white/25",
    inactiveBg: "bg-transparent",
    textActive: "text-white focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
    textInactive:
      "text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
  },
  iconOnly: {
    rounded: "rounded-full",
    activeBg: "bg-[#2455C9]",
    inactiveBorder: "border-2 border-white/65",
    inactiveBg: "bg-transparent",
    textActive: "text-white focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
    textInactive:
      "text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
  },
} as const

/** Concept 2 Filters entry — pill shape on navy band (Figma 4174) */
export function FiltersEntryControl({
  appliedCount,
  onClick,
  opensSearchForm = false,
  iconOnly = false,
  readOnly = false,
  shape = "standard",
  label = "Filters",
}: FiltersEntryControlProps) {
  const hasApplied = appliedCount > 0
  const theme = iconOnly ? filtersTheme.iconOnly : shape === "pill" ? filtersTheme.pill : filtersTheme.default

  const content = (
    <>
      <IconFilter className="h-5 w-5 shrink-0" aria-hidden />
      {!iconOnly ? <span>{label}</span> : null}
      {hasApplied ? (
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-white font-medium leading-none tabular-nums text-black",
            iconOnly
              ? "absolute -right-1 -top-1 z-20 size-4 text-[10px]"
              : "size-6 shrink-0 text-sm",
          )}
          aria-hidden
        >
          {appliedCount}
        </span>
      ) : null}
    </>
  )

  const shellClass = cn(
    "relative text-base font-normal text-white",
    iconOnly ? "size-10 justify-center" : "h-10 gap-2 px-3",
  )

  if (readOnly || !onClick) {
    return (
      <span
        className={cn(shellClass, theme.rounded, hasApplied ? theme.activeBg : theme.inactiveBorder)}
        title={
          hasApplied
            ? `${appliedCount} filter${appliedCount === 1 ? "" : "s"} applied`
            : label
        }
      >
        {content}
      </span>
    )
  }

  const ariaLabel = opensSearchForm
    ? hasApplied
      ? `Open search and filters, ${appliedCount} filter${appliedCount === 1 ? "" : "s"} applied`
      : "Open search and filters"
    : hasApplied
      ? `Open ${label.toLowerCase()}, ${appliedCount} filter${appliedCount === 1 ? "" : "s"} applied`
      : `Open ${label.toLowerCase()}`

  return (
    <FilterSurfaceButton
      onClick={onClick}
      active={hasApplied}
      theme={theme}
      className={shellClass}
      contentClassName={cn("gap-2", iconOnly && "justify-center")}
      aria-label={ariaLabel}
    >
      {content}
    </FilterSurfaceButton>
  )
}
