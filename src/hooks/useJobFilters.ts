import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { scrollSearchResultsToTop } from "@/src/lib/scrollSearchResultsToTop"
import {
  type Job,
  type ListingTimeFilter,
  type PayPeriod,
  type RemoteOption,
  type SortOption,
  type WorkType,
  LISTING_TIME_OPTIONS,
  jobs,
} from "@/src/data/jobs"
import {
  DEFAULT_SEARCH,
  type SearchQuery,
  getLocationTokens,
  matchesSearchKeywords,
  matchesSearchKeywordsPartial,
  matchesSearchLocation,
  normalizeSearchQuery,
  searchHasLocation,
  searchIncludesCompanyName,
} from "@/src/hooks/searchQuery"

export interface FilterState {
  payMin: number | null
  payMax: number | null
  payPeriod: PayPeriod
  classifications: string[]
  workTypes: WorkType[]
  remoteOptions: RemoteOption[]
  listingTime: ListingTimeFilter
  distanceKm: number
  newToYou: boolean
  strongApplicant: boolean
  jobsAtSeek: boolean
  sort: SortOption
}

export const DEFAULT_FILTERS: FilterState = {
  payMin: null,
  payMax: null,
  payPeriod: "annual",
  classifications: [],
  workTypes: [],
  remoteOptions: [],
  listingTime: "any",
  distanceKm: 50,
  newToYou: false,
  strongApplicant: false,
  jobsAtSeek: false,
  sort: "relevance",
}

function matchesListingTime(ageDays: number, filter: ListingTimeFilter): boolean {
  const option = LISTING_TIME_OPTIONS.find((o) => o.value === filter)
  if (!option || option.maxDays === null) return true
  return ageDays <= option.maxDays
}

export type SmartFilterKey = "newToYou" | "strongApplicant" | "jobsAtSeek"

export interface SmartFilterCounts {
  newToYou: number
  strongApplicant: number
  jobsAtSeek: number
}

/** Badge label caps at 99+ when category has 100+ jobs */
export function formatSmartFilterBadgeLabel(count: number): string {
  if (count >= 100) return "99+"
  return String(count)
}

export function getFilteredJobs(filters: FilterState, search: SearchQuery = DEFAULT_SEARCH): Job[] {
  const strict = sortJobs(filterJobs(jobs, filters, search), filters.sort)
  return ensureMinimumSearchResults(jobs, filters, search, strict)
}

/** Prototype floor — every SERP shows at least this many job cards */
const MIN_SEARCH_RESULTS = 30

function smartOnlyFilters(filters: FilterState): FilterState {
  return {
    ...DEFAULT_FILTERS,
    newToYou: filters.newToYou,
    strongApplicant: filters.strongApplicant,
    jobsAtSeek: filters.jobsAtSeek,
    sort: filters.sort,
  }
}

function ensureMinimumSearchResults(
  allJobs: Job[],
  filters: FilterState,
  search: SearchQuery,
  strictResults: Job[],
): Job[] {
  if (strictResults.length >= MIN_SEARCH_RESULTS) return strictResults

  let padded = strictResults
  const keywords = search.keywords.trim()

  // Always keep submitted keywords — only relax location / facets / match strictness.
  const withKeywords = (location: string): SearchQuery => ({
    keywords,
    location,
  })

  const attempts: SearchQuery[] = []
  if (search.location.trim()) {
    attempts.push(withKeywords(""))
  }

  for (const attempt of attempts) {
    const results = sortJobs(filterJobs(allJobs, filters, attempt), filters.sort)
    padded = mergePreferStrict(padded, results)
    if (padded.length >= MIN_SEARCH_RESULTS) return padded
  }

  if (keywords) {
    const partialSameLocation = sortJobs(
      filterJobsPartialKeywords(allJobs, filters, search),
      filters.sort,
    )
    padded = mergePreferStrict(padded, partialSameLocation)
    if (padded.length >= MIN_SEARCH_RESULTS) return padded

    if (search.location.trim()) {
      const partialAnyLocation = sortJobs(
        filterJobsPartialKeywords(allJobs, filters, withKeywords("")),
        filters.sort,
      )
      padded = mergePreferStrict(padded, partialAnyLocation)
      if (padded.length >= MIN_SEARCH_RESULTS) return padded
    }
  }

  // Keep keywords + smart filters; drop pay / work type / classification / etc.
  const smartOnlyStrict = sortJobs(
    filterJobs(allJobs, smartOnlyFilters(filters), withKeywords("")),
    filters.sort,
  )
  padded = mergePreferStrict(padded, smartOnlyStrict)
  if (padded.length >= MIN_SEARCH_RESULTS) return padded

  if (keywords) {
    const smartOnlyPartial = sortJobs(
      filterJobsPartialKeywords(allJobs, smartOnlyFilters(filters), withKeywords("")),
      filters.sort,
    )
    padded = mergePreferStrict(padded, smartOnlyPartial)
    if (padded.length >= MIN_SEARCH_RESULTS) return padded
  }

  // Last resort: synthesised cards so the SERP still shows ≥30 jobs that
  // reflect the submitted search (or generic fillers when keywords are empty).
  padded = mergePreferStrict(padded, synthesizeKeywordJobs(allJobs, keywords, padded))
  if (padded.length >= MIN_SEARCH_RESULTS) return padded

  return mergePreferStrict(padded, allJobs)
}

/** Prototype filler — rewrite templates so every card includes the search keywords */
function synthesizeKeywordJobs(allJobs: Job[], keywords: string, existing: Job[]): Job[] {
  const needed = MIN_SEARCH_RESULTS - existing.length
  if (needed <= 0) return []

  const seen = new Set(existing.map((j) => j.id))
  const templates = allJobs.filter((job) => !seen.has(job.id))
  const pool = templates.length > 0 ? templates : allJobs
  if (pool.length === 0) return []

  const kw = keywords.trim()

  return Array.from({ length: needed }, (_, index) => {
    const template = pool[index % pool.length]
    if (!kw) {
      return {
        ...template,
        id: `pad-${index}-${template.id}`,
      }
    }
    return {
      ...template,
      id: `kw-${encodeURIComponent(kw).slice(0, 48)}-${index}-${template.id}`,
      title: kw,
      description: `${template.description}\n\nMatching your search for “${kw}”.`,
      teaser: [
        `Role aligned to “${kw}”`,
        template.teaser[1] ?? "Collaborate with cross-functional stakeholders",
        template.teaser[2] ?? "Deliver outcomes in a fast-paced environment",
      ] as [string, string, string],
    }
  })
}

function mergePreferStrict(strictResults: Job[], fallbackResults: Job[]): Job[] {
  if (strictResults.length >= MIN_SEARCH_RESULTS) return strictResults
  const seen = new Set(strictResults.map((j) => j.id))
  const merged = [...strictResults]
  for (const job of fallbackResults) {
    if (seen.has(job.id)) continue
    merged.push(job)
    if (merged.length >= MIN_SEARCH_RESULTS) break
  }
  return merged
}

/** Count smart-filter candidates using the same job pipeline as the results list */
export function getSmartFilterCounts(filters: FilterState, search: SearchQuery = DEFAULT_SEARCH): SmartFilterCounts {
  const withoutSmart: FilterState = {
    ...filters,
    newToYou: false,
    strongApplicant: false,
    jobsAtSeek: false,
  }

  return {
    newToYou: getFilteredJobs({ ...withoutSmart, newToYou: true }, search).length,
    strongApplicant: getFilteredJobs({ ...withoutSmart, strongApplicant: true }, search).length,
    jobsAtSeek: getFilteredJobs({ ...withoutSmart, jobsAtSeek: true }, search).length,
  }
}

function matchesDistance(job: Job, distanceKm: number, search: SearchQuery): boolean {
  const jobText = `${job.location} ${job.suburb}`.toLowerCase()
  const searchLoc = search.location.trim().toLowerCase()

  if (distanceKm === 0) {
    const tokens = getLocationTokens(search.location)
    return tokens.some((token) => jobText.includes(token))
  }

  const melbourneSearch = searchLoc.includes("melbourne")
  const melbourneJob = jobText.includes("melbourne")
  const sydneySearch = searchLoc.includes("sydney")
  const sydneyJob = jobText.includes("sydney")

  if ((sydneySearch && sydneyJob) || (!melbourneSearch && !melbourneJob)) {
    return matchesSearchLocation(job, search.location)
  }

  if (sydneySearch && !sydneyJob) return false
  if (melbourneSearch && !melbourneJob) return false

  const innerSuburbs = ["Melbourne CBD", "Southbank", "Docklands", "Richmond", "Carlton", "Cremorne"]
  const midSuburbs = [...innerSuburbs, "South Yarra", "Fitzroy", "Hawthorn", "Footscray"]
  const outerSuburbs = ["Dandenong", "Frankston", "Werribee", "Sunbury"]

  if (distanceKm <= 2) return innerSuburbs.slice(0, 4).includes(job.suburb)
  if (distanceKm <= 5) return innerSuburbs.includes(job.suburb)
  if (distanceKm <= 10) return innerSuburbs.includes(job.suburb)
  if (distanceKm <= 25) return !outerSuburbs.includes(job.suburb)
  if (distanceKm <= 30) return !outerSuburbs.includes(job.suburb)
  if (distanceKm <= 50) return midSuburbs.includes(job.suburb) || !outerSuburbs.includes(job.suburb)
  return true
}

function filterJobsPartialKeywords(allJobs: Job[], filters: FilterState, search: SearchQuery): Job[] {
  const hasLocation = searchHasLocation(search)

  return allJobs.filter((job) => {
    if (!matchesSearchKeywordsPartial(job, search.keywords)) return false
    if (!matchesSearchLocation(job, search.location)) return false

    if (filters.payMin != null && job.salaryMax < filters.payMin) return false
    if (filters.payMax != null && job.salaryMin > filters.payMax) return false
    if (filters.classifications.length > 0 && !filters.classifications.includes(job.classification)) return false
    if (filters.workTypes.length > 0 && !filters.workTypes.includes(job.workType)) return false
    if (filters.remoteOptions.length > 0 && !filters.remoteOptions.includes(job.remoteOption)) return false
    if (!matchesListingTime(job.listingAgeDays, filters.listingTime)) return false

    if (hasLocation && !matchesDistance(job, filters.distanceKm, search)) return false

    if (filters.newToYou && !job.isNewToYou) return false
    if (filters.strongApplicant && !job.isStrongApplicant) return false
    if (filters.jobsAtSeek && !job.isAtSeek) return false
    return true
  })
}

function filterJobs(allJobs: Job[], filters: FilterState, search: SearchQuery): Job[] {
  const hasLocation = searchHasLocation(search)

  return allJobs.filter((job) => {
    if (!matchesSearchKeywords(job, search.keywords)) return false
    if (!matchesSearchLocation(job, search.location)) return false

    if (filters.payMin != null && job.salaryMax < filters.payMin) return false
    if (filters.payMax != null && job.salaryMin > filters.payMax) return false
    if (filters.classifications.length > 0 && !filters.classifications.includes(job.classification)) return false
    if (filters.workTypes.length > 0 && !filters.workTypes.includes(job.workType)) return false
    if (filters.remoteOptions.length > 0 && !filters.remoteOptions.includes(job.remoteOption)) return false
    if (!matchesListingTime(job.listingAgeDays, filters.listingTime)) return false

    if (hasLocation && !matchesDistance(job, filters.distanceKm, search)) return false

    if (filters.newToYou && !job.isNewToYou) return false
    if (filters.strongApplicant && !job.isStrongApplicant) return false
    if (filters.jobsAtSeek && !job.isAtSeek) return false
    return true
  })
}

function sortJobs(filtered: Job[], sort: SortOption): Job[] {
  const copy = [...filtered]
  if (sort === "date") {
    copy.sort((a, b) => a.listingAgeDays - b.listingAgeDays)
  }
  return copy
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

/** Compare filter snapshots — used to detect draft edits inside filter popovers */
export function areFilterStatesEqual(a: FilterState, b: FilterState): boolean {
  return (
    a.payMin === b.payMin &&
    a.payMax === b.payMax &&
    a.payPeriod === b.payPeriod &&
    a.listingTime === b.listingTime &&
    a.distanceKm === b.distanceKm &&
    a.newToYou === b.newToYou &&
    a.strongApplicant === b.strongApplicant &&
    a.jobsAtSeek === b.jobsAtSeek &&
    a.sort === b.sort &&
    arraysEqual(a.classifications, b.classifications) &&
    arraysEqual(a.workTypes, b.workTypes) &&
    arraysEqual(a.remoteOptions, b.remoteOptions)
  )
}

/**
 * Return only the fields that changed between two filter snapshots.
 * Used so each filter popover commits a targeted patch (merged onto the live
 * state) instead of replacing the whole state — otherwise a pill opened with a
 * stale snapshot would wipe out selections made in another pill.
 */
export function diffFilterState(base: FilterState, next: FilterState): Partial<FilterState> {
  const patch: Partial<FilterState> = {}
  if (base.payMin !== next.payMin) patch.payMin = next.payMin
  if (base.payMax !== next.payMax) patch.payMax = next.payMax
  if (base.payPeriod !== next.payPeriod) patch.payPeriod = next.payPeriod
  if (base.listingTime !== next.listingTime) patch.listingTime = next.listingTime
  if (base.distanceKm !== next.distanceKm) patch.distanceKm = next.distanceKm
  if (base.newToYou !== next.newToYou) patch.newToYou = next.newToYou
  if (base.strongApplicant !== next.strongApplicant) patch.strongApplicant = next.strongApplicant
  if (base.jobsAtSeek !== next.jobsAtSeek) patch.jobsAtSeek = next.jobsAtSeek
  if (base.sort !== next.sort) patch.sort = next.sort
  if (!arraysEqual(base.classifications, next.classifications)) patch.classifications = next.classifications
  if (!arraysEqual(base.workTypes, next.workTypes)) patch.workTypes = next.workTypes
  if (!arraysEqual(base.remoteOptions, next.remoteOptions)) patch.remoteOptions = next.remoteOptions
  return patch
}

export function countActiveFilters(filters: FilterState, hasLocation: boolean): number {
  let count = 0
  if (filters.payMin != null || filters.payMax != null) count++
  if (filters.classifications.length > 0) count++
  if (filters.workTypes.length > 0) count++
  if (filters.remoteOptions.length > 0) count++
  if (filters.listingTime !== "any") count++
  if (hasLocation && filters.distanceKm !== 50) count++
  if (filters.newToYou) count++
  if (filters.strongApplicant) count++
  if (filters.jobsAtSeek) count++
  return count
}

/** Standard filters only — for Concept 2 Filters button badge */
export function countStandardFilters(filters: FilterState, hasLocation: boolean): number {
  let count = 0
  if (filters.payMin != null || filters.payMax != null) count++
  if (filters.classifications.length > 0) count++
  if (filters.workTypes.length > 0) count++
  if (filters.remoteOptions.length > 0) count++
  if (filters.listingTime !== "any") count++
  if (hasLocation && filters.distanceKm !== 50) count++
  return count
}

/** Filters applied via the Filters modal / standard filter controls — excludes distance (separate pill) */
export function countModalFilters(filters: FilterState): number {
  let count = 0
  if (filters.payMin != null || filters.payMax != null) count++
  if (filters.classifications.length > 0) count++
  if (filters.workTypes.length > 0) count++
  if (filters.remoteOptions.length > 0) count++
  if (filters.listingTime !== "any") count++
  return count
}

const EMPTY_DISMISSED_BADGES: Record<SmartFilterKey, boolean> = {
  newToYou: false,
  strongApplicant: false,
  jobsAtSeek: false,
}

export function useJobFilters(options?: { initialSearch?: SearchQuery }) {
  const startingSearch = options?.initialSearch ?? DEFAULT_SEARCH
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [draftSearch, setDraftSearch] = useState<SearchQuery>(startingSearch)
  const [search, setSearch] = useState<SearchQuery>(startingSearch)
  const draftSearchRef = useRef(draftSearch)
  draftSearchRef.current = draftSearch
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [dismissedBadges, setDismissedBadges] = useState(EMPTY_DISMISSED_BADGES)
  const [seenNewToYouJobIds, setSeenNewToYouJobIds] = useState<Set<string>>(() => new Set())
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)
  const [isSearchSaved, setIsSearchSaved] = useState(false)
  const smartFilterScrollRef = useRef(false)

  const hasLocation = searchHasLocation(draftSearch)
  const showCompanyFilter = useMemo(() => searchIncludesCompanyName(search.keywords), [search.keywords])
  const filteredJobs = useMemo(() => getFilteredJobs(filters, search), [filters, search])
  const smartFilterCounts = useMemo(() => getSmartFilterCounts(filters, search), [filters, search])

  const hasUnseenNewToYouOnPage = useMemo(
    () => filteredJobs.some((job) => job.isNewToYou && !seenNewToYouJobIds.has(job.id)),
    [filteredJobs, seenNewToYouJobIds],
  )

  useEffect(() => {
    setIsLoading(true)
    const timer = window.setTimeout(() => setIsLoading(false), 300)
    return () => window.clearTimeout(timer)
  }, [filters, search])

  /** After NTY / Strong toggle — select first result (production pos reset) */
  useEffect(() => {
    if (!smartFilterScrollRef.current) return
    smartFilterScrollRef.current = false
    if (filteredJobs.length > 0) {
      setSelectedJobId(filteredJobs[0].id)
    } else {
      setSelectedJobId(null)
    }
  }, [filters.newToYou, filters.strongApplicant, filteredJobs])

  useEffect(() => {
    if (!showCompanyFilter && filters.jobsAtSeek) {
      setFilters((prev) => ({ ...prev, jobsAtSeek: false }))
    }
  }, [showCompanyFilter, filters.jobsAtSeek])

  /** Drop radius filter when search has no location (applied or while editing draft) */
  useEffect(() => {
    if (!hasLocation && filters.distanceKm !== 50) {
      setFilters((prev) => ({ ...prev, distanceKm: 50 }))
    }
  }, [hasLocation, filters.distanceKm])

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJobId(null)
      return
    }
    if (!filteredJobs.some((j) => j.id === selectedJobId)) {
      setSelectedJobId(filteredJobs[0].id)
    }
  }, [filteredJobs, selectedJobId])

  const selectedJob = useMemo(
    () => filteredJobs.find((j) => j.id === selectedJobId) ?? null,
    [filteredJobs, selectedJobId],
  )

  const closeMobileDetail = useCallback(() => setMobileDetailOpen(false), [])
  const openMobileDetail = useCallback(() => setMobileDetailOpen(true), [])

  useEffect(() => {
    if (!selectedJob) setMobileDetailOpen(false)
  }, [selectedJob])

  const markNewToYouJobSeen = useCallback((jobId: string) => {
    const job = filteredJobs.find((j) => j.id === jobId)
    if (!job?.isNewToYou) return
    setSeenNewToYouJobIds((prev) => {
      if (prev.has(jobId)) return prev
      const next = new Set(prev)
      next.add(jobId)
      return next
    })
  }, [filteredJobs])

  const submitSearch = useCallback(() => {
    setSearch((prev) => {
      const normalized = normalizeSearchQuery(draftSearchRef.current, prev)
      setDraftSearch(normalized)
      return normalized
    })
    setDismissedBadges(EMPTY_DISMISSED_BADGES)
    setSeenNewToYouJobIds(new Set())
  }, [])

  const applySearchQuery = useCallback((query: SearchQuery) => {
    const next = {
      keywords: query.keywords.trim(),
      location: query.location.trim(),
    }
    setDraftSearch(next)
    setSearch(next)
    setDismissedBadges(EMPTY_DISMISSED_BADGES)
    setSeenNewToYouJobIds(new Set())
  }, [])

  const dismissSmartFilterBadge = useCallback((key: SmartFilterKey) => {
    setDismissedBadges((prev) => ({ ...prev, [key]: true }))
  }, [])

  const toggleSmartFilter = useCallback(
    (key: SmartFilterKey) => {
      setFilters((prev) => {
        const next = !prev[key]
        if (!next) dismissSmartFilterBadge(key)
        return { ...prev, [key]: next }
      })
      if (key === "newToYou" || key === "strongApplicant") {
        smartFilterScrollRef.current = true
        scrollSearchResultsToTop()
        setMobileDetailOpen(false)
      }
    },
    [dismissSmartFilterBadge],
  )

  const updateDraftSearch = useCallback((patch: Partial<SearchQuery>) => {
    setDraftSearch((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateFilters = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const applyFilters = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const replaceFilters = useCallback((next: FilterState) => {
    setFilters(next)
  }, [])

  const clearFilter = useCallback(
    (key: keyof FilterState) => {
      if (key === "newToYou" || key === "strongApplicant" || key === "jobsAtSeek") {
        dismissSmartFilterBadge(key)
      }
      setFilters((prev) => {
        switch (key) {
        case "payMin":
        case "payMax":
          return { ...prev, payMin: null, payMax: null, payPeriod: "annual" }
        case "classifications":
          return { ...prev, classifications: [] }
        case "workTypes":
          return { ...prev, workTypes: [] }
        case "remoteOptions":
          return { ...prev, remoteOptions: [] }
        case "listingTime":
          return { ...prev, listingTime: "any" }
        case "distanceKm":
          return { ...prev, distanceKm: 50 }
        case "newToYou":
          return { ...prev, newToYou: false }
        case "strongApplicant":
          return { ...prev, strongApplicant: false }
        case "jobsAtSeek":
          return { ...prev, jobsAtSeek: false }
        default:
          return prev
      }
    })
  }, [dismissSmartFilterBadge])

  const clearAllFilters = useCallback(() => {
    setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }))
  }, [])

  const toggleBookmark = useCallback((jobId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(jobId)) next.delete(jobId)
      else next.add(jobId)
      return next
    })
  }, [])

  const toggleSearchSaved = useCallback(() => {
    setIsSearchSaved((prev) => !prev)
  }, [])

  return {
    filters,
    updateFilters,
    applyFilters,
    replaceFilters,
    clearFilter,
    clearAllFilters,
    draftSearch,
    search,
    updateDraftSearch,
    submitSearch,
    applySearchQuery,
    hasLocation,
    showCompanyFilter,
    filteredJobs,
    smartFilterCounts,
    hasUnseenNewToYouOnPage,
    dismissedBadges,
    dismissSmartFilterBadge,
    toggleSmartFilter,
    markNewToYouJobSeen,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    isLoading,
    bookmarkedIds,
    toggleBookmark,
    isSearchSaved,
    toggleSearchSaved,
    activeFilterCount: countActiveFilters(filters, hasLocation),
    mobileDetailOpen,
    openMobileDetail,
    closeMobileDetail,
  }
}

export type UseJobFiltersReturn = ReturnType<typeof useJobFilters>
