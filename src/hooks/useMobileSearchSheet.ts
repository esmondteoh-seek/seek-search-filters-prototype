import { useCallback, useState } from "react"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"

/** Shared Concept 1 / Concept 2 mobile full-screen search sheet state */
export function useMobileSearchSheet(filterState: UseJobFiltersReturn) {
  const [open, setOpen] = useState(false)

  const openSheet = useCallback(() => {
    filterState.updateDraftSearch(filterState.search)
    setOpen(true)
  }, [filterState])

  const closeSheet = useCallback(() => {
    filterState.updateDraftSearch(filterState.search)
    setOpen(false)
  }, [filterState])

  return { open, openSheet, closeSheet }
}
