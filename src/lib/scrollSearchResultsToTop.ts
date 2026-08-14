export const VERSION_B_SMART_FILTER_EVENT = "version-b:smart-filter-toggle"

/** Production SRP — jump to top when personalised filters change while scrolled */
export function scrollSearchResultsToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" })

  document.querySelectorAll("[data-version-b-scroll]").forEach((node) => {
    if (node instanceof HTMLElement) node.scrollTop = 0
  })

  window.dispatchEvent(new CustomEvent(VERSION_B_SMART_FILTER_EVENT))
}
