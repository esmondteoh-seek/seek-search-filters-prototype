import { IconClear } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface SearchFieldClearButtonProps {
  visible: boolean
  onClear: () => void
  label: string
  className?: string
}

/** Clear control for keyword/location search inputs — shown when field has text */
export function SearchFieldClearButton({ visible, onClear, label, className }: SearchFieldClearButtonProps) {
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={onClear}
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#5A6881]",
        "hover:bg-[#F3F5F7] hover:text-[#2E3849]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]",
        className,
      )}
      aria-label={label}
    >
      <IconClear className="h-4 w-4" aria-hidden />
    </button>
  )
}
