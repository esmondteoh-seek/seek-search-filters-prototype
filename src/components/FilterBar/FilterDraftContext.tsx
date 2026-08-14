import { createContext, useContext, type ReactNode } from "react"
import type { FilterState } from "@/src/hooks/useJobFilters"

interface FilterDraftContextValue {
  draft: FilterState
  patchDraft: (patch: Partial<FilterState>) => void
}

const FilterDraftContext = createContext<FilterDraftContextValue | null>(null)

export function FilterDraftProvider({
  draft,
  patchDraft,
  children,
}: FilterDraftContextValue & { children: ReactNode }) {
  return <FilterDraftContext.Provider value={{ draft, patchDraft }}>{children}</FilterDraftContext.Provider>
}

export function useFilterDraftContext(): FilterDraftContextValue | null {
  return useContext(FilterDraftContext)
}

/** Use draft context inside filter popovers, or fall back to controlled props */
export function useFilterControlState(
  filters?: FilterState,
  onChange?: (patch: Partial<FilterState>) => void,
): FilterDraftContextValue {
  const ctx = useFilterDraftContext()
  if (ctx) return ctx
  if (filters && onChange) {
    return {
      draft: filters,
      patchDraft: onChange,
    }
  }
  throw new Error("Filter control requires FilterDraftProvider or filters/onChange props")
}
