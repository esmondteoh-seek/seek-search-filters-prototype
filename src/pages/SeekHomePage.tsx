import { useEffect, useState } from "react"
import { IconLocation, IconSearch } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import {
  HomeClassificationSelect,
  HomeRecentSearchChip,
  HomeRecommendedCard,
  HomeRecommendedHeader,
  HomeSidebar,
  resolveRecentSearchQuery,
  resolveSavedSearchQuery,
} from "@/src/components/home/HomeFeedSections"
import { HomeMoreOptionsRow } from "@/src/components/home/HomeMoreOptionsRow"
import { SearchFieldClearButton } from "@/src/components/shared/SearchFieldClearButton"
import { SiteHeader } from "@/src/components/SiteHeader"
import { useScrollAwayHeader } from "@/src/hooks/useScrollAwayHeader"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import {
  HOME_RECENT_SEARCHES,
  HOME_RECOMMENDED_JOBS,
  HOME_SAVED_JOB,
  HOME_SIDEBAR_SAVED_SEARCHES,
} from "@/src/data/homeFeed"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import { markVersionBFromHome } from "@/src/lib/versionBHomeSession"

interface SeekHomePageProps {
  onSearch: (query: SearchQuery) => void
  filterState?: UseJobFiltersReturn
  userName?: string
  /** Force stacked mobile hero (PhoneFrame — ignores viewport width) */
  forceMobile?: boolean
  /** Hide global SiteHeader (frame provides its own chrome) */
  hideSiteHeader?: boolean
  /** Scroll feed inside parent flex column instead of page */
  contained?: boolean
}

/** SEEK Career Feed home — Figma Home-Career-Feed FY26 (desktop 12667:105561, mobile 12667:104931) */
export function SeekHomePage({
  onSearch,
  filterState,
  userName = "Michael",
  forceMobile = false,
  hideSiteHeader = false,
  contained = false,
}: SeekHomePageProps) {
  const [keywords, setKeywords] = useState("")
  const [classification, setClassification] = useState("")
  const [location, setLocation] = useState("")
  const [moreOptionsExpanded, setMoreOptionsExpanded] = useState(false)
  const [viewportMobile, setViewportMobile] = useState(forceMobile)

  useEffect(() => {
    if (forceMobile) return
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setViewportMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [forceMobile])

  const isMobileLayout = forceMobile || viewportMobile
  const pagePaddingX = isMobileLayout ? "px-4" : "px-4 md:px-0"
  const { hidden: headerHidden, instant: headerInstant } = useScrollAwayHeader(
    !hideSiteHeader && !isMobileLayout,
  )

  const submit = (query: SearchQuery = { keywords: keywords || classification, location }) => {
    markVersionBFromHome()
    onSearch({
      keywords: (query.keywords || classification).trim(),
      location: query.location.trim(),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div
      className={cn(
        "bg-white",
        contained ? "flex min-h-0 flex-1 flex-col overflow-hidden" : "min-h-screen",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>

      {!hideSiteHeader ? (
        <SiteHeader
          userName={userName}
          sticky={!isMobileLayout}
          hidden={headerHidden}
          instant={headerInstant}
        />
      ) : null}

      <main
        id="main-content"
        className={cn(contained && "min-h-0 flex-1 overflow-y-auto overscroll-contain")}
      >
        {/* Hero search */}
        <section className="relative overflow-visible bg-[#051A49]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -left-24 top-0 h-full w-[280px] opacity-90 md:-left-16 md:w-[360px]">
              <div
                className="absolute left-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(230,2,120,0.55) 0%, rgba(230,2,120,0.15) 45%, transparent 70%)",
                }}
              />
              <div
                className="absolute -left-12 top-8 h-[280px] w-[280px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,120,180,0.35) 0%, transparent 65%)",
                }}
              />
            </div>
          </div>

          <div className={cn("relative z-10 mx-auto max-w-[1280px] py-6 md:py-8", pagePaddingX)}>
            <h1 className="sr-only">Perform a job search</h1>

            {/* Desktop */}
            <div className={cn(isMobileLayout ? "hidden" : "hidden md:block")}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 min-w-0 flex-1 items-center overflow-hidden rounded-lg bg-white">
                  <label className="flex h-full min-w-0 flex-[1.6] items-center gap-3 border-r border-[#EAECF1] px-4">
                    <IconSearch className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
                    <span className="sr-only">What</span>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Describe what you're looking for (role, industry, skills...)"
                      className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                      aria-label="What"
                    />
                    <SearchFieldClearButton
                      visible={keywords.length > 0}
                      onClear={() => setKeywords("")}
                      label="Clear keywords"
                    />
                  </label>
                  <label className="flex h-full min-w-0 flex-1 items-center gap-3 px-4">
                    <IconLocation className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
                    <span className="sr-only">Where</span>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter suburb, city, or region"
                      className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                      aria-label="Where"
                    />
                    <SearchFieldClearButton
                      visible={location.length > 0}
                      onClear={() => setLocation("")}
                      label="Clear location"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => submit()}
                  className="h-12 shrink-0 rounded-lg bg-[#E60278] px-8 text-base font-medium text-white hover:bg-[#CC0269] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#051A49]"
                >
                  SEEK
                </button>
              </div>
            </div>

            {/* Mobile — What / Where labels per Figma */}
            <div className={cn("flex flex-col gap-6", !isMobileLayout && "md:hidden")}>
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-white">What</p>
                <div className="flex flex-col gap-2">
                  <label className="flex h-12 items-center gap-3 rounded-lg bg-white px-4">
                    <IconSearch className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Describe what you're looking for (role, industry, skills...)"
                      className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                      aria-label="Keywords"
                    />
                    <SearchFieldClearButton
                      visible={keywords.length > 0}
                      onClear={() => setKeywords("")}
                      label="Clear keywords"
                    />
                  </label>
                  <HomeClassificationSelect value={classification} onChange={setClassification} />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-base font-medium text-white">Where</p>
                <label className="flex h-12 items-center gap-3 rounded-lg bg-white px-4">
                  <IconLocation className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter suburb, city or region"
                    className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                    aria-label="Location"
                  />
                  <SearchFieldClearButton
                    visible={location.length > 0}
                    onClear={() => setLocation("")}
                    label="Clear location"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => submit()}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#E60278] text-base font-medium text-white hover:bg-[#CC0269] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                SEEK
              </button>
            </div>

            {filterState ? (
              <HomeMoreOptionsRow
                filterState={filterState}
                expanded={moreOptionsExpanded}
                onExpandedChange={setMoreOptionsExpanded}
                className={cn(isMobileLayout ? "mt-6" : "mt-4")}
              />
            ) : null}
          </div>
        </section>

        {/* Recent searches */}
        <section className={cn("border-b border-[#EAECF1] bg-white py-4", !isMobileLayout && "md:py-5")}>
          <div className={cn("mx-auto max-w-[1280px]", pagePaddingX)}>
            <div className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {HOME_RECENT_SEARCHES.map((item) => (
                <HomeRecentSearchChip
                  key={item.id}
                  keywords={item.keywords}
                  location={item.location}
                  onClick={() => submit(resolveRecentSearchQuery(item))}
                />
              ))}
            </div>

            <div className={cn("mt-4 flex flex-col gap-3", !isMobileLayout && "md:hidden")}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => submit(resolveSavedSearchQuery(HOME_SIDEBAR_SAVED_SEARCHES[0]))}
                  className="flex h-12 flex-1 items-center justify-center rounded-lg border-2 border-[#EAECF1] bg-[#F3F5F7] text-sm font-medium text-[#2E3849] hover:bg-[#EAECF1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
                >
                  Saved searches
                </button>
                <button
                  type="button"
                  onClick={() =>
                    submit({
                      keywords: HOME_SAVED_JOB.searchKeywords,
                      location: HOME_SAVED_JOB.searchLocation,
                    })
                  }
                  className="flex h-12 flex-1 items-center justify-center rounded-lg border-2 border-[#EAECF1] bg-[#F3F5F7] text-sm font-medium text-[#2E3849] hover:bg-[#EAECF1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
                >
                  Saved jobs
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {HOME_SIDEBAR_SAVED_SEARCHES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => submit(resolveSavedSearchQuery(item))}
                    className="rounded-xl border border-[#EAECF1] bg-white px-4 py-3 text-left text-sm font-medium text-[#2E3849] hover:border-[#D2D7DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feed + sidebar */}
        <section className={cn("bg-[#F7F8FB] py-8", !isMobileLayout && "md:py-10")}>
          <div
            className={cn(
              "mx-auto flex max-w-[1280px]",
              pagePaddingX,
              isMobileLayout ? "flex-col gap-6" : "gap-10 lg:gap-16",
            )}
          >
            <div className="min-w-0 flex-1">
              {isMobileLayout ? (
                <HomeRecommendedHeader mobile />
              ) : (
                <>
                  <div className="lg:hidden">
                    <HomeRecommendedHeader mobile />
                  </div>
                  <div className="hidden lg:block">
                    <HomeRecommendedHeader />
                  </div>
                </>
              )}
              <div className="mt-6 flex flex-col gap-6">
                {HOME_RECOMMENDED_JOBS.map((job) => (
                  <HomeRecommendedCard
                    key={job.id}
                    job={job}
                    compact={isMobileLayout}
                    onSelect={() =>
                      submit({
                        keywords: job.searchKeywords,
                        location: job.searchLocation,
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {!isMobileLayout ? (
              <HomeSidebar
                headerHidden={headerHidden}
                onSavedSearchSelect={(query) => submit(query)}
                onSavedJobSelect={(query) => submit(query)}
              />
            ) : null}
          </div>
        </section>

        {contained ? (
          <footer className="border-t border-[#EAECF1] bg-white py-6">
            <div className={pagePaddingX}>
              <nav
                className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5A6881]"
                aria-label="Footer"
              >
                {["About SEEK", "Terms & conditions", "Security & Privacy"].map((label) => (
                  <a key={label} href="#" className="hover:text-[#2E3849] hover:underline">
                    {label}
                  </a>
                ))}
              </nav>
              <p className="mt-4 text-xs text-[#5A6881]">© SEEK. All rights reserved</p>
            </div>
          </footer>
        ) : null}
      </main>

      {!contained ? (
      <footer className="border-t border-[#EAECF1] bg-white py-8">
        <div className={cn("mx-auto max-w-[1280px]", pagePaddingX)}>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-[#5A6881]" aria-label="Footer">
            {["About SEEK", "Terms & conditions", "Security & Privacy"].map((label) => (
              <a key={label} href="#" className="hover:text-[#2E3849] hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <p className="mt-6 text-xs text-[#5A6881]">© SEEK. All rights reserved</p>
        </div>
      </footer>
      ) : null}
    </div>
  )
}

/** Sets document title to match au.seek.com home vs SERP */
export function useSeekDocumentTitle(view: "home" | "jobs", search?: SearchQuery) {
  useEffect(() => {
    if (view === "home") {
      document.title = "SEEK - Australia's no. 1 jobs, employment, career and recruitment site"
      return
    }

    const kw = search?.keywords.trim()
    const loc = search?.location.trim()
    if (kw && loc) {
      document.title = `${kw} Jobs in ${loc} - SEEK`
    } else if (kw) {
      document.title = `${kw} Jobs - SEEK`
    } else if (loc) {
      document.title = `Jobs in ${loc} - SEEK`
    } else {
      document.title = "Job search - SEEK"
    }
  }, [view, search?.keywords, search?.location])
}
