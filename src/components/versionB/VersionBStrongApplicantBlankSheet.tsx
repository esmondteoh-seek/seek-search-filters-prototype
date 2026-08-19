import { VersionBAppBottomSheet } from "@/src/components/versionB/VersionBAppBottomSheet"
import { VersionBNoSearchResultDarkSpotIllustration } from "@/src/components/versionB/VersionBSpotIllustrations"

interface VersionBStrongApplicantBlankSheetProps {
  open: boolean
  onClose: () => void
  onEditSearch: () => void
}

/** App blank search + Strong applicant — bottom sheet (Figma 4433:45408) */
export function VersionBStrongApplicantBlankSheet({
  open,
  onClose,
  onEditSearch,
}: VersionBStrongApplicantBlankSheetProps) {
  return (
    <VersionBAppBottomSheet
      open={open}
      onClose={onClose}
      titleId="vb-refine-search-title"
      illustration={<VersionBNoSearchResultDarkSpotIllustration />}
      title="Refine your search"
      description="Enter keywords or use filters to see if you have strong applicant jobs."
      primaryAction={{
        label: "Edit search filters",
        onClick: () => {
          onEditSearch()
          onClose()
        },
      }}
    />
  )
}
