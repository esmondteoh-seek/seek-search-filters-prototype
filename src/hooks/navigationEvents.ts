/** Fired after programmatic history changes so URL-driven hooks re-read state */
export const NAVIGATION_EVENT = "seek-navigation-change"

export function notifyNavigationChange() {
  window.dispatchEvent(new PopStateEvent("popstate"))
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export function subscribeNavigation(onStoreChange: () => void) {
  const handler = () => onStoreChange()
  window.addEventListener("popstate", handler)
  window.addEventListener(NAVIGATION_EVENT, handler)
  return () => {
    window.removeEventListener("popstate", handler)
    window.removeEventListener(NAVIGATION_EVENT, handler)
  }
}
