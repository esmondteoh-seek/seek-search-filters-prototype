import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react"
import { concepts, getConceptById } from "@/src/concepts/index"
import { applyShareConceptIfNeeded } from "@/src/hooks/shareEntry"
import { subscribeNavigation } from "@/src/hooks/navigationEvents"

const PARAM = "concept"

export function readConceptFromUrl(): string | null {
  if (typeof window === "undefined") return null
  applyShareConceptIfNeeded()
  const id = new URLSearchParams(window.location.search).get(PARAM)
  if (!id || !getConceptById(id)) return null
  return id
}

export function isPrototypeMode(): boolean {
  return readConceptFromUrl() !== null
}

function writeConceptToUrl(id: string | null) {
  const url = new URL(window.location.href)
  if (id) url.searchParams.set(PARAM, id)
  else url.searchParams.delete(PARAM)
  window.history.replaceState(null, "", url.toString())
}

export function useConceptParam() {
  const conceptId = useSyncExternalStore(
    subscribeNavigation,
    readConceptFromUrl,
    () => null,
  )

  useEffect(() => {
    if (conceptId) writeConceptToUrl(conceptId)
  }, [conceptId])

  const setConceptId = useCallback((id: string) => {
    if (!getConceptById(id)) return
    const url = new URL(window.location.href)
    url.searchParams.set(PARAM, id)
    window.history.pushState(null, "", url.toString())
    window.dispatchEvent(new Event("seek-navigation-change"))
  }, [])

  const clearConcept = useCallback(() => {
    writeConceptToUrl(null)
    window.dispatchEvent(new Event("seek-navigation-change"))
  }, [])

  const activeConcept = useMemo(
    () => (conceptId ? getConceptById(conceptId) : undefined),
    [conceptId],
  )

  return { conceptId, setConceptId, clearConcept, activeConcept, inPrototypeMode: conceptId !== null }
}

export { concepts }
