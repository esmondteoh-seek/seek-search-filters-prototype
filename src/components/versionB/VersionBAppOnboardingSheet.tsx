import { VersionBAppBottomSheet } from "@/src/components/versionB/VersionBAppBottomSheet"
import { VersionBControlDarkSpotIllustration } from "@/src/components/versionB/VersionBSpotIllustrations"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import { useVersionBSerpOnboarding } from "@/src/hooks/useVersionBSerpOnboarding"

interface VersionBAppOnboardingSheetProps {
  open: boolean
  onClose: () => void
  previewState?: VersionBPreviewState
}

/** App first-visit SERP onboarding sheet (Figma 4444:43821) */
export function VersionBAppOnboardingSheet({
  open,
  onClose,
  previewState = "filters",
}: VersionBAppOnboardingSheetProps) {
  const { dismiss } = useVersionBSerpOnboarding()

  const handleDismiss = () => {
    dismiss()
    onClose()
  }

  return (
    <VersionBAppBottomSheet
      open={open}
      onClose={handleDismiss}
      titleId="vb-app-onboarding-title"
      illustration={<VersionBControlDarkSpotIllustration />}
      title="Filter for better results"
      description="Use filters to find the right jobs for you."
      spotlight={previewState === "onboarding" ? "onboarding" : undefined}
      primaryAction={{
        label: "Continue",
        onClick: handleDismiss,
      }}
    />
  )
}
