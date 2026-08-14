import { DeliverySegmentBar } from "@/src/components/delivery/DeliverySegmentBar"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"

interface VersionATopFilterBarProps {
  filterState: UseJobFiltersReturn
  jobCount: number
  isLoading?: boolean
  newToYouCount?: number
  strongApplicantCount?: number
}

export function VersionATopFilterBar(props: VersionATopFilterBarProps) {
  return <DeliverySegmentBar {...props} />
}
