import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { formatCombinedSearchLabel } from "@/src/utils/searchLabel"

export function useSearchBandForm(filterState: UseJobFiltersReturn) {
  const { draftSearch, search, updateDraftSearch, submitSearch } = filterState

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      submitSearch()
    }
  }

  const restoreKeywordsIfEmpty = () => {
    if (!draftSearch.keywords.trim()) updateDraftSearch({ keywords: search.keywords })
  }

  const combinedLabel = formatCombinedSearchLabel(search.keywords, search.location)
  const compactSearchLabel = draftSearch.keywords.trim() || search.keywords.trim() || combinedLabel

  return {
    draftSearch,
    handleKeyDown,
    restoreKeywordsIfEmpty,
    submitSearch,
    combinedLabel,
    compactSearchLabel,
  }
}
