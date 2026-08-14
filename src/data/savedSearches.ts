export interface SavedSearchItem {
  id: string
  title: string
  filtersSummary: string
  newCount: number
}

export const LAST_SEARCH: SavedSearchItem = {
  id: "last",
  title: "Senior product designer",
  filtersSummary: "From $80K • Full time",
  newCount: 8,
}

export const SAVED_SEARCHES: SavedSearchItem[] = [
  {
    id: "saved-1",
    title: "Senior product designer",
    filtersSummary: "From $80K • Full time",
    newCount: 5,
  },
  {
    id: "saved-2",
    title: "Project manager in Sydney",
    filtersSummary: "Full time, Part time • Remote, Hy…",
    newCount: 16,
  },
  {
    id: "saved-3",
    title: "Senior project manager",
    filtersSummary: "",
    newCount: 3,
  },
]
