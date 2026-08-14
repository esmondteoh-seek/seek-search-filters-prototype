export type FutureVisionMarket = "AU" | "MY"

export interface FutureVisionLocation {
  id: string
  market: FutureVisionMarket
  displayName: string
  /** Optional second line in autosuggest dropdown */
  secondaryLabel?: string
  aliases: string[]
}

/** Prototype catalog — AU/MY display names aligned with in-market candidate search */
export const FUTURE_VISION_LOCATION_CATALOG: FutureVisionLocation[] = [
  {
    id: "au-sydney",
    market: "AU",
    displayName: "Sydney, NSW 2000",
    aliases: ["sydney", "sydney nsw", "sydney nsw 2000", "2000"],
  },
  {
    id: "au-melbourne",
    market: "AU",
    displayName: "Melbourne, VIC 3000",
    aliases: ["melbourne", "melbourne vic", "melbourne vic 3000", "3000"],
  },
  {
    id: "au-brisbane",
    market: "AU",
    displayName: "Brisbane QLD 4000",
    aliases: ["brisbane", "brisbane qld", "brisbane qld 4000"],
  },
  {
    id: "au-brisbane-cbd",
    market: "AU",
    displayName: "Brisbane CBD & Inner Suburbs",
    secondaryLabel: "Brisbane QLD",
    aliases: ["brisbane cbd", "brisbane cbd inner suburbs", "brisbane inner suburbs"],
  },
  {
    id: "au-brisbane-market",
    market: "AU",
    displayName: "Brisbane Market QLD 4106",
    aliases: ["brisbane market", "brisbane market qld"],
  },
  {
    id: "au-brisbane-airport",
    market: "AU",
    displayName: "Brisbane Airport QLD 4008",
    aliases: ["brisbane airport", "brisbane airport qld"],
  },
  {
    id: "au-brisk-bay",
    market: "AU",
    displayName: "Brisk Bay QLD 4805",
    aliases: ["brisk bay", "brisk bay qld"],
  },
  {
    id: "au-brisbane-grove",
    market: "AU",
    displayName: "Brisbane Grove NSW 2580",
    aliases: ["brisbane grove", "brisbane grove nsw"],
  },
  {
    id: "au-all-brisbane",
    market: "AU",
    displayName: "All Brisbane QLD",
    aliases: ["all brisbane", "all brisbane qld"],
  },
  {
    id: "au-southern-suburbs-logan",
    market: "AU",
    displayName: "Southern Suburbs & Logan",
    secondaryLabel: "Brisbane QLD",
    aliases: ["southern suburbs logan", "logan", "brisbane"],
  },
  {
    id: "au-perth",
    market: "AU",
    displayName: "Perth WA 6000",
    aliases: ["perth", "perth wa", "perth wa 6000", "6000"],
  },
  {
    id: "au-adelaide",
    market: "AU",
    displayName: "Adelaide SA 5000",
    aliases: ["adelaide", "adelaide sa", "adelaide sa 5000", "5000"],
  },
  {
    id: "au-canberra",
    market: "AU",
    displayName: "Canberra ACT 2600",
    aliases: ["canberra", "canberra act", "canberra act 2600", "2600"],
  },
  {
    id: "au-richmond",
    market: "AU",
    displayName: "Richmond VIC 3121",
    aliases: ["richmond", "richmond vic", "richmond vic 3121", "3121"],
  },
  {
    id: "au-cremorne",
    market: "AU",
    displayName: "Cremorne VIC 3121",
    aliases: ["cremorne", "cremorne vic", "cremorne vic 3121"],
  },
  {
    id: "au-parramatta",
    market: "AU",
    displayName: "Parramatta NSW 2150",
    aliases: ["parramatta", "parramatta nsw", "parramatta nsw 2150", "2150"],
  },
  {
    id: "my-kuala-lumpur",
    market: "MY",
    displayName: "Kuala Lumpur",
    aliases: ["kuala lumpur", "kl", "kuala"],
  },
  {
    id: "my-mont-kiara",
    market: "MY",
    displayName: "Mont Kiara, Kuala Lumpur",
    aliases: ["mont kiara", "mont kiara kuala lumpur"],
  },
  {
    id: "my-petaling-jaya",
    market: "MY",
    displayName: "Petaling Jaya, Selangor",
    aliases: ["petaling jaya", "petaling jaya selangor", "pj"],
  },
  {
    id: "my-george-town",
    market: "MY",
    displayName: "George Town, Penang",
    aliases: ["george town", "george town penang", "penang"],
  },
  {
    id: "my-johor-bahru",
    market: "MY",
    displayName: "Johor Bahru, Johor",
    aliases: ["johor bahru", "johor bahru johor", "jb"],
  },
  {
    id: "my-shah-alam",
    market: "MY",
    displayName: "Shah Alam, Selangor",
    aliases: ["shah alam", "shah alam selangor"],
  },
  {
    id: "my-cyberjaya",
    market: "MY",
    displayName: "Cyberjaya, Selangor",
    aliases: ["cyberjaya", "cyberjaya selangor"],
  },
]

export const FUTURE_VISION_DEFAULT_LOCATION_ID = "au-sydney"

const catalogById = new Map(FUTURE_VISION_LOCATION_CATALOG.map((loc) => [loc.id, loc]))
const catalogByDisplayName = new Map(
  FUTURE_VISION_LOCATION_CATALOG.map((loc) => [loc.displayName.toLowerCase(), loc]),
)

/** Sorted longest displayName first for greedy resolution */
const catalogByLength = [...FUTURE_VISION_LOCATION_CATALOG].sort(
  (a, b) => b.displayName.length - a.displayName.length,
)

export function getFutureVisionLocationById(id: string): FutureVisionLocation | undefined {
  return catalogById.get(id)
}

export function getFutureVisionDefaultLocation(): FutureVisionLocation {
  return catalogById.get(FUTURE_VISION_DEFAULT_LOCATION_ID)!
}

export function getFutureVisionDisplayNames(ids: string[]): string[] {
  return ids
    .map((id) => catalogById.get(id)?.displayName)
    .filter((name): name is string => Boolean(name))
}

const MIN_SUGGEST_LENGTH = 2
const MAX_SUGGESTIONS = 8

function normalizeForMatch(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim()
}

function searchableTexts(location: FutureVisionLocation): string[] {
  const texts = [
    normalizeForMatch(location.displayName),
    ...(location.secondaryLabel ? [normalizeForMatch(location.secondaryLabel)] : []),
    ...location.aliases.map(normalizeForMatch),
  ]
  return [...new Set(texts.filter(Boolean))]
}

/** Prefix or in-word match — production Where behaviour */
function matchesQuery(location: FutureVisionLocation, query: string): boolean {
  const q = normalizeForMatch(query)
  if (q.length < MIN_SUGGEST_LENGTH) return false

  for (const text of searchableTexts(location)) {
    if (text.startsWith(q)) return true

    let fromIndex = 0
    while (fromIndex < text.length) {
      const idx = text.indexOf(q, fromIndex)
      if (idx === -1) break
      if (idx === 0 || text[idx - 1] === " ") return true
      fromIndex = idx + 1
    }
  }

  return false
}

/** Prefix autosuggest — production-like candidate Where behaviour */
export function suggestFutureVisionLocations(query: string): FutureVisionLocation[] {
  const q = normalizeForMatch(query)
  if (q.length < MIN_SUGGEST_LENGTH) return []

  const auMatches: FutureVisionLocation[] = []
  const myMatches: FutureVisionLocation[] = []

  for (const loc of FUTURE_VISION_LOCATION_CATALOG) {
    if (!matchesQuery(loc, q)) continue
    if (loc.market === "AU") auMatches.push(loc)
    else myMatches.push(loc)
  }

  return [...auMatches, ...myMatches].slice(0, MAX_SUGGESTIONS)
}

/** Resolve a single typed value to one catalog entry (exact or prefix) */
export function resolveFutureVisionLocation(raw: string): FutureVisionLocation | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const normalized = normalizeForMatch(trimmed)
  const exact = catalogByDisplayName.get(normalized)
  if (exact) return exact

  for (const loc of catalogByLength) {
    if (loc.aliases.includes(normalized)) return loc
  }

  const suggestions = suggestFutureVisionLocations(trimmed)
  if (suggestions.length === 1) return suggestions[0]
  if (suggestions.length > 1 && normalizeForMatch(suggestions[0].displayName) === normalized) {
    return suggestions[0]
  }

  return null
}

/** Find catalog entries embedded in a string — longest-name-first, non-overlapping, order preserved */
export function resolveFutureVisionLocations(raw: string): FutureVisionLocation[] {
  const text = normalizeForMatch(raw)
  if (!text) return []

  const matches: { loc: FutureVisionLocation; start: number }[] = []
  const usedIds = new Set<string>()
  const usedRanges: Array<[number, number]> = []

  for (const loc of catalogByLength) {
    if (usedIds.has(loc.id)) continue

    const patterns = [
      normalizeForMatch(loc.displayName),
      ...(loc.secondaryLabel ? [normalizeForMatch(loc.secondaryLabel)] : []),
      ...loc.aliases,
    ].sort((a, b) => b.length - a.length)

    for (const pattern of patterns) {
      if (pattern.length < MIN_SUGGEST_LENGTH) continue
      const idx = text.indexOf(pattern)
      if (idx === -1) continue

      const end = idx + pattern.length
      const overlaps = usedRanges.some(([start, stop]) => !(end <= start || idx >= stop))
      if (overlaps) continue

      matches.push({ loc, start: idx })
      usedIds.add(loc.id)
      usedRanges.push([idx, end])
      break
    }
  }

  matches.sort((a, b) => a.start - b.start)
  const result = matches.map((m) => m.loc)

  if (result.length === 0) {
    const single = resolveFutureVisionLocation(raw)
    if (single) return [single]
  }

  return result
}
