import { VersionBAppBottomSheet } from "@/src/components/versionB/VersionBAppBottomSheet"
import { VersionBNoSearchResultDarkSpotIllustration } from "@/src/components/versionB/VersionBSpotIllustrations"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"

interface VersionBStrongApplicantBlankSheetProps {
  open: boolean
  onClose: () => void
  onEditSearch: () => void
  previewState?: VersionBPreviewState
}

/** App blank search + Strong applicant — bottom sheet (Figma 4433:45408) */
export function VersionBStrongApplicantBlankSheet({
  open,
  onClose,
  onEditSearch,
  previewState = "filters",
}: VersionBStrongApplicantBlankSheetProps) {
  return (
    <VersionBAppBottomSheet
      open={open}
      onClose={onClose}
      titleId="vb-refine-search-title"
      illustration={<VersionBNoSearchResultDarkSpotIllustration />}
      title="Refine your search"
      description="Enter keywords or use filters to see if you have strong applicant jobs."
      spotlight={previewState === "blank" ? "blank" : undefined}
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
