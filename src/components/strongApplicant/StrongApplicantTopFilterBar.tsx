import { DeliverySegmentBar } from "@/src/components/delivery/DeliverySegmentBar"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"

interface StrongApplicantTopFilterBarProps {
  filterState: UseJobFiltersReturn
  jobCount: number
  isLoading?: boolean
  newToYouCount?: number
  strongApplicantCount?: number
}

export function StrongApplicantTopFilterBar(props: StrongApplicantTopFilterBarProps) {
  return <DeliverySegmentBar {...props} />
}
