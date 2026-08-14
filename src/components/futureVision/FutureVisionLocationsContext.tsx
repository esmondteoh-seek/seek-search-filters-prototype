import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  FUTURE_VISION_DEFAULT_LOCATION_ID,
  getFutureVisionDefaultLocation,
  getFutureVisionDisplayNames,
  getFutureVisionLocationById,
  resolveFutureVisionLocation,
  resolveFutureVisionLocations,
  type FutureVisionLocation,
} from "@/src/data/futureVisionLocations"
import { formatFutureVisionLocationSummaryFromIds } from "@/src/data/futureVisionPresets"

interface FutureVisionLocationsContextValue {
  locationIds: string[]
  locations: string[]
  isMultiLocation: boolean
  locationSummary: string
  selectedLocationIndex: number
  locationQuery: string
  isEditingLocation: boolean
  setLocationQuery: (query: string) => void
  startEditingLocation: () => void
  stopEditingLocation: () => void
  selectLocationTab: (index: number) => void
  selectSuggestion: (location: FutureVisionLocation) => void
  removeLocation: (index: number) => void
  /** Overlay field — remove pill without default fallback */
  removeLocationPill: (index: number) => void
  /** Overlay field — clear all locations while editing */
  clearLocations: () => void
  applyLocationInput: (raw: string) => void
  setLocationIds: (ids: string[]) => void
}

const FutureVisionLocationsContext = createContext<FutureVisionLocationsContextValue | null>(null)

function mergeLocationIds(existing: string[], incoming: string[]): string[] {
  const merged = [...existing]
  for (const id of incoming) {
    if (!merged.includes(id)) merged.push(id)
  }
  return merged
}

export function FutureVisionLocationsProvider({ children }: { children: ReactNode }) {
  const [locationIds, setLocationIdsState] = useState<string[]>([FUTURE_VISION_DEFAULT_LOCATION_ID])
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0)
  const [locationQuery, setLocationQuery] = useState("")
  const [isEditingLocation, setIsEditingLocation] = useState(false)

  const locations = useMemo(() => getFutureVisionDisplayNames(locationIds), [locationIds])
  const isMultiLocation = locationIds.length > 1
  const locationSummary = formatFutureVisionLocationSummaryFromIds(locationIds)

  const setLocationIds = useCallback((next: string[], options?: { preserveSelection?: boolean }) => {
    const valid = next.filter((id) => getFutureVisionLocationById(id))
    const finalIds = valid.length > 0 ? valid : [FUTURE_VISION_DEFAULT_LOCATION_ID]
    setLocationIdsState(finalIds)
    if (options?.preserveSelection) {
      setSelectedLocationIndex((prev) => Math.min(prev, finalIds.length - 1))
    } else {
      setSelectedLocationIndex(0)
    }
  }, [])

  const removeLocation = useCallback((index: number) => {
    setLocationIdsState((prev) => {
      const next = prev.filter((_, i) => i !== index)
      return next.length > 0 ? next : [FUTURE_VISION_DEFAULT_LOCATION_ID]
    })
    setSelectedLocationIndex((prev) => {
      if (prev === index) return Math.max(0, index - 1)
      if (prev > index) return prev - 1
      return prev
    })
  }, [])

  const removeLocationPill = useCallback((index: number) => {
    setLocationIdsState((prev) => prev.filter((_, i) => i !== index))
    setSelectedLocationIndex((prev) => {
      if (prev === index) return Math.max(0, index - 1)
      if (prev > index) return prev - 1
      return prev
    })
    setIsEditingLocation(true)
  }, [])

  const clearLocations = useCallback(() => {
    setLocationIdsState([])
    setSelectedLocationIndex(0)
    setLocationQuery("")
    setIsEditingLocation(true)
  }, [])

  const selectSuggestion = useCallback((location: FutureVisionLocation) => {
    setLocationIdsState((prev) => {
      if (prev.includes(location.id)) return prev
      if (prev.length > 1 || (prev.length === 1 && isEditingLocation)) {
        return [...prev, location.id]
      }
      return [location.id]
    })
    setLocationQuery("")
    setIsEditingLocation(false)
  }, [isEditingLocation])

  const applyLocationInput = useCallback((raw: string) => {
    const resolved = resolveFutureVisionLocations(raw)
    if (resolved.length === 0) {
      const single = resolveFutureVisionLocation(raw)
      if (single) {
        setLocationIdsState((prev) => {
          if (prev.includes(single.id)) return prev
          if (prev.length > 1 || isEditingLocation) return [...prev, single.id]
          return [single.id]
        })
      }
      setLocationQuery("")
      setIsEditingLocation(false)
      return
    }

    setLocationIdsState((prev) => {
      if (prev.length > 1 || isEditingLocation) {
        return mergeLocationIds(prev, resolved.map((loc) => loc.id))
      }
      return resolved.map((loc) => loc.id)
    })
    setLocationQuery("")
    setIsEditingLocation(false)
  }, [isEditingLocation])

  const startEditingLocation = useCallback(() => {
    setIsEditingLocation(true)
    setLocationQuery("")
  }, [])

  const stopEditingLocation = useCallback(() => {
    setIsEditingLocation(false)
    setLocationQuery("")
  }, [])

  const selectLocationTab = useCallback((index: number) => {
    setSelectedLocationIndex(index)
  }, [])

  const value = useMemo(
    () => ({
      locationIds,
      locations,
      isMultiLocation,
      locationSummary,
      selectedLocationIndex,
      locationQuery,
      isEditingLocation,
      setLocationQuery,
      startEditingLocation,
      stopEditingLocation,
      selectLocationTab,
      selectSuggestion,
      removeLocation,
      removeLocationPill,
      clearLocations,
      applyLocationInput,
      setLocationIds,
    }),
    [
      locationIds,
      locations,
      isMultiLocation,
      locationSummary,
      selectedLocationIndex,
      locationQuery,
      isEditingLocation,
      selectSuggestion,
      removeLocation,
      removeLocationPill,
      clearLocations,
      applyLocationInput,
      setLocationIds,
    ],
  )

  return (
    <FutureVisionLocationsContext.Provider value={value}>
      {children}
    </FutureVisionLocationsContext.Provider>
  )
}

export function useFutureVisionLocations() {
  const ctx = useContext(FutureVisionLocationsContext)
  if (!ctx) {
    throw new Error("useFutureVisionLocations must be used within FutureVisionLocationsProvider")
  }
  return ctx
}

export { getFutureVisionDefaultLocation }
