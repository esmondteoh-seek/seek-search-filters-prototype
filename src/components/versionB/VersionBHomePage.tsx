import { useEffect } from "react"
import { SeekLogo } from "@/components/seek-logo"
import { IconChevronDown } from "@/components/braid/icons"
import { SeekHomePage } from "@/src/pages/SeekHomePage"
import { PhoneFrame } from "@/src/components/shared/PhoneFrame"
import { VersionBRoot } from "@/src/components/versionB/VersionBRoot"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import { getVersionBSearch } from "@/src/data/versionBPresets"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import { navigateToHome } from "@/src/hooks/useAppNavigation"

interface VersionBHomePageProps {
  onSearch: (query: SearchQuery) => void
  platform?: VersionBPlatform
  previewState?: VersionBPreviewState
}

function VersionBMobileWebHomeFrame({ onSearch }: { onSearch: (query: SearchQuery) => void }) {
  return (
    <PhoneFrame className="bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-[#EAECF1] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigateToHome()}
          className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
          aria-label="SEEK Home"
        >
          <SeekLogo className="h-7 w-auto text-[#1E47A9]" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-[#2E3849] hover:bg-[#F5F7FA]"
          aria-haspopup="menu"
        >
          Menu
          <IconChevronDown className="h-4 w-4 text-[#5A6881]" aria-hidden />
        </button>
      </header>

      <SeekHomePage
        onSearch={onSearch}
        userName="Riccardo"
        forceMobile
        hideSiteHeader
        contained
      />

      <div className="flex shrink-0 justify-center pb-2 pt-1">
        <div className="h-1 w-28 rounded-full bg-[#2E3849]/20" aria-hidden />
      </div>
    </PhoneFrame>
  )
}

/** Version B Career Feed home — desktop full page; mobile web in phone frame */
export function VersionBHomePage({
  onSearch,
  platform = "desktop",
  previewState = "default",
}: VersionBHomePageProps) {
  const { view } = useAppNavigation()

  useEffect(() => {
    if (platform !== "app" || view !== "home") return
    onSearch(getVersionBSearch("app", previewState))
  }, [platform, previewState, view, onSearch])

  if (platform === "app") return null

  if (platform === "mobile-web") {
    return (
      <VersionBRoot className="bg-[#E8ECF2]">
        <VersionBMobileWebHomeFrame onSearch={onSearch} />
      </VersionBRoot>
    )
  }

  return (
    <VersionBRoot className="min-h-screen bg-white">
      <SeekHomePage onSearch={onSearch} userName="Riccardo" />
    </VersionBRoot>
  )
}
