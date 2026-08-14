export type LibraryFolderId = "concept-testing" | "delivery" | "future-vision"

export type LibraryItem =
  | { type: "folder"; id: LibraryFolderId; label: string; description?: string }
  | { type: "prototype"; id: string; label: string; description?: string }

export const LIBRARY_TITLE = "optimise search filters"

export const rootItems: LibraryItem[] = [
  {
    type: "folder",
    id: "concept-testing",
    label: "Concept Testing Q1 FY27",
    description: "Research concepts tested in Q1 FY27 evaluative study",
  },
  {
    type: "folder",
    id: "delivery",
    label: "Delivery Q1 FY27",
    description: "Delivery prototypes for product implementation",
  },
  {
    type: "folder",
    id: "future-vision",
    label: "Future Vision",
    description: "Multi-location search — one location default, chips when 2+",
  },
]

export const folderItems: Record<LibraryFolderId, LibraryItem[]> = {
  "concept-testing": [
    {
      type: "prototype",
      id: "concept-1",
      label: "Concept 1",
      description: "Thick band | Hide fixed filters on scroll",
    },
    {
      type: "prototype",
      id: "concept-2",
      label: "Concept 2",
      description: "Compact | Horizontal filters",
    },
    {
      type: "prototype",
      id: "concept-3",
      label: "Concept 3",
      description: "Compact | Filter drawer",
    },
  ],
  delivery: [
    {
      type: "prototype",
      id: "version-a",
      label: "Version A",
      description: "Strong Applicant filter — narrows results",
    },
    {
      type: "prototype",
      id: "version-b",
      label: "Version B",
      description: "Grouped filters delivery — web & app",
    },
    {
      type: "prototype",
      id: "strong-applicant-filter",
      label: "vSAB",
      description: "Very Strong Applicant Badge prototype",
    },
  ],
  "future-vision": [
    {
      type: "prototype",
      id: "future-vision",
      label: "Future Vision",
      description: "Multi-location SERP — desktop, mobile web & app",
    },
  ],
}

export function getFolderForConcept(conceptId: string): LibraryFolderId | null {
  if (folderItems["concept-testing"].some((item) => item.type === "prototype" && item.id === conceptId)) {
    return "concept-testing"
  }
  if (folderItems.delivery.some((item) => item.type === "prototype" && item.id === conceptId)) {
    return "delivery"
  }
  if (folderItems["future-vision"].some((item) => item.type === "prototype" && item.id === conceptId)) {
    return "future-vision"
  }
  return null
}

export function getFolderLabel(folderId: LibraryFolderId): string {
  return rootItems.find((item) => item.type === "folder" && item.id === folderId)?.label ?? folderId
}

export function isValidFolderId(id: string | null): id is LibraryFolderId {
  return id === "concept-testing" || id === "delivery" || id === "future-vision"
}
