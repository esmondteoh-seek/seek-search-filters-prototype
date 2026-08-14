import type { ComponentType } from "react"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"

export interface ConceptPageProps {
  filterState: UseJobFiltersReturn
}

export interface ConceptDef {
  id: string
  label: string
  component: ComponentType<ConceptPageProps>
}
