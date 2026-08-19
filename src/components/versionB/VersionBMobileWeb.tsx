import { SeekLogo } from "@/components/seek-logo"
import { IconChevronDown } from "@/components/braid/icons"
import { MobileSearchSheet } from "@/src/components/MobileSearchSheet"
import {
  VersionBFilterChips,
  VersionBNavyBand,
} from "@/src/components/versionB/VersionBFilterChips"
import { VersionBResults } from "@/src/components/versionB/VersionBResults"
import { VersionBMobileSearchPill } from "@/src/components/versionB/VersionBSearchForm"
import { PhoneFrame } from "@/src/components/shared/PhoneFrame"
import { useMobileSearchSheet } from "@/src/hooks/useMobileSearchSheet"
import { navigateToHome } from "@/src/hooks/useAppNavigation"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { patchClearingBlankSa } from "@/src/lib/isBlankSearch"
import { formatVersionBCompactSearchLabel, getVersionBScaledJobCount } from "@/src/data/versionBPresets"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"

interface VersionBMobileWebProps {
  filterState: UseJobFiltersReturn
  previewState: VersionBPreviewState
}

/** Version B mobile web — seek + Menu, navy band, chrome outside the scroller */
export function VersionBMobileWeb({ filterState, previewState }: VersionBMobileWebProps) {
  const { mobileDetailOpen, search } = filterState
  const hideSearchChrome = mobileDetailOpen
  const { open: mobileSearchOpen, openSheet, closeSheet } = useMobileSearchSheet(filterState)
  const pillLabel = formatVersionBCompactSearchLabel(search)

  return (
    <PhoneFrame className="bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-[#EAECF1] bg-white px-5 py-3">
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

      {!hideSearchChrome ? (
        <div className="shrink-0">
          <VersionBNavyBand className="p-4" contentClassName="gap-3">
            <VersionBMobileSearchPill label={pillLabel} onOpen={openSheet} />
            <VersionBFilterChips
              filterState={filterState}
              platform="mobile-web"
              previewState={previewState}
              layout="inline"
              onMoreClick={openSheet}
            />
          </VersionBNavyBand>
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain" data-version-b-scroll>
        <VersionBResults
          filterState={filterState}
          platform="mobile-web"
          previewState={previewState}
          singleColumn
        />
      </div>

      <div className="flex shrink-0 justify-center pb-2 pt-1">
        <div className="h-1 w-28 rounded-full bg-[#2E3849]/20" aria-hidden />
      </div>

      <MobileSearchSheet
        open={mobileSearchOpen}
        onClose={closeSheet}
        filterState={filterState}
        showLocationRadius={false}
        brandSeekButton
        contained
        slideFromRight
        applyOnChange
        mapPreviewCount={(filters, query) =>
          getVersionBScaledJobCount("mobile-web", previewState, filters, query)
        }
        onApplyFilters={(patch) =>
          filterState.applyFilters(
            patchClearingBlankSa(filterState.search, filterState.filters, patch),
          )
        }
      />
    </PhoneFrame>
  )
}
