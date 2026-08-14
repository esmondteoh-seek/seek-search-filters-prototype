export interface SearchQuery {
  keywords: string
  location: string
}

export const DEFAULT_SEARCH: SearchQuery = {
  keywords: "Marketing lead",
  location: "Melbourne, VIC 3000",
}

/** True when the search includes a location (radius filter only applies then) */
export function searchHasLocation(search: SearchQuery): boolean {
  return search.location.trim().length > 0
}

/** Never submit blank keywords — location may be omitted for nationwide search */
export function normalizeSearchQuery(draft: SearchQuery, fallback: SearchQuery = DEFAULT_SEARCH): SearchQuery {
  return {
    keywords: draft.keywords.trim() || fallback.keywords,
    location: draft.location.trim(),
  }
}

/** Extract meaningful location tokens for matching job locations */
export function getLocationTokens(location: string): string[] {
  const trimmed = location.trim().toLowerCase()
  if (!trimmed) return []

  const tokens = new Set<string>()
  if (trimmed.includes("melbourne")) tokens.add("melbourne")
  if (trimmed.includes("sydney")) tokens.add("sydney")
  if (trimmed.includes("brisbane")) tokens.add("brisbane")
  if (trimmed.includes("perth")) tokens.add("perth")
  if (trimmed.includes("adelaide")) tokens.add("adelaide")

  trimmed
    .split(/[,\s]+/)
    .map((p) => p.replace(/\d+/g, "").trim())
    .filter((p) => p.length > 2)
    .forEach((p) => tokens.add(p))

  return [...tokens]
}

export function matchesSearchKeywords(
  job: { title: string; company: string; classification: string; description: string; teaser: string[] },
  keywords: string,
): boolean {
  const kw = keywords.trim().toLowerCase()
  if (!kw) return true

  const haystack = [job.title, job.company, job.classification, job.description, ...job.teaser]
    .join(" ")
    .toLowerCase()

  return kw.split(/\s+/).every((term) => haystack.includes(term))
}

/** Looser match — any keyword term hits (used when strict search returns too few jobs) */
export function matchesSearchKeywordsPartial(
  job: { title: string; company: string; classification: string; description: string; teaser: string[] },
  keywords: string,
): boolean {
  const kw = keywords.trim().toLowerCase()
  if (!kw) return true

  const haystack = [job.title, job.company, job.classification, job.description, ...job.teaser]
    .join(" ")
    .toLowerCase()

  return kw.split(/\s+/).some((term) => term.length > 2 && haystack.includes(term))
}

export function matchesSearchLocation(job: { location: string; suburb: string }, location: string): boolean {
  const tokens = getLocationTokens(location)
  if (tokens.length === 0) return true

  const jobText = `${job.location} ${job.suburb}`.toLowerCase()
  return tokens.some((token) => jobText.includes(token))
}

/**
 * Major Australian employers — used to surface company smart filters (e.g. Jobs at SEEK).
 * Includes ASX leaders, banks, retailers, telcos, miners, airlines, and consultancies.
 */
export const AUSTRALIAN_COMPANY_NAMES = [
  "SEEK",
  "SEEK Limited",
  "REA Group",
  "REA",
  "Commonwealth Bank",
  "CommBank",
  "CBA",
  "National Australia Bank",
  "NAB",
  "ANZ",
  "Westpac",
  "Macquarie Group",
  "Macquarie",
  "Atlassian",
  "Canva",
  "Xero",
  "Afterpay",
  "Block",
  "WiseTech Global",
  "WiseTech",
  "Employment Hero",
  "Telstra",
  "Optus",
  "TPG Telecom",
  "TPG",
  "Vodafone",
  "BHP",
  "Rio Tinto",
  "Fortescue",
  "Fortescue Metals",
  "Newcrest",
  "Woodside",
  "Woodside Energy",
  "Origin Energy",
  "Origin",
  "AGL Energy",
  "AGL",
  "Santos",
  "Qantas",
  "Virgin Australia",
  "Jetstar",
  "Woolworths Group",
  "Woolworths",
  "Coles Group",
  "Coles",
  "Wesfarmers",
  "Bunnings",
  "Kmart",
  "Officeworks",
  "JB Hi-Fi",
  "Harvey Norman",
  "Myer",
  "David Jones",
  "Deloitte",
  "PwC",
  "PricewaterhouseCoopers",
  "KPMG",
  "EY",
  "Ernst & Young",
  "Accenture",
  "McKinsey",
  "BCG",
  "Boston Consulting Group",
  "Salesforce",
  "Amazon",
  "AWS",
  "Google",
  "Microsoft",
  "IBM",
  "Oracle",
  "CSL",
  "ResMed",
  "Cochlear",
  "Ramsay Health Care",
  "Ramsay",
  "Sonic Healthcare",
  "IAG",
  "Suncorp",
  "QBE Insurance",
  "QBE",
  "Mirvac",
  "Stockland",
  "Lendlease",
  "GPT Group",
  "Goodman Group",
  "Dexus",
  "Scentre Group",
  "Transurban",
  "Aurizon",
  "Toll Group",
  "Toll",
  "Australia Post",
  "StarTrack",
  "University of Sydney",
  "University of Melbourne",
  "Monash University",
  "UNSW",
  "Transport for NSW",
  "NSW Health",
  "Ticketek",
  "Ogilvy",
  "WPP",
  "Publicis",
  "Commonwealth Bank of Australia",
] as const

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function queryMentionsCompany(query: string, company: string): boolean {
  const name = company.toLowerCase().trim()
  if (!name) return false

  // Longer names: substring match handles "marketing at commonwealth bank"
  if (name.length >= 5 && query.includes(name)) return true

  // Short names / abbreviations: word boundary to avoid false positives
  const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, "i")
  return pattern.test(query)
}

/** True when keywords mention a known Australian employer — shows company filter chips */
export function searchIncludesCompanyName(keywords: string): boolean {
  const kw = keywords.trim().toLowerCase()
  if (!kw) return false

  // Longest names first so "Commonwealth Bank" wins over "Commonwealth"
  const sorted = [...AUSTRALIAN_COMPANY_NAMES].sort((a, b) => b.length - a.length)

  return sorted.some((company) => queryMentionsCompany(kw, company))
}

/** Matched employer for dynamic filter labelling (defaults to SEEK when multiple match) */
export function getMatchedCompanyName(keywords: string): string | null {
  const kw = keywords.trim().toLowerCase()
  if (!kw) return null

  const sorted = [...AUSTRALIAN_COMPANY_NAMES].sort((a, b) => b.length - a.length)
  const match = sorted.find((company) => queryMentionsCompany(kw, company))
  return match ?? null
}
