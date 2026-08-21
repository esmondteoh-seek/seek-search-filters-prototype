export const VERSION_B_SERP_SEARCH_EVENT = "vb-serp-search"

/** Fired when the user submits a new keyword/location search on Version B SERP */
export function dispatchVersionBSerpSearch() {
  window.dispatchEvent(new Event(VERSION_B_SERP_SEARCH_EVENT))
}
