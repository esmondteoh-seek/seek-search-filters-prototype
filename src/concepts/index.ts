import { Concept1Page } from "@/src/concepts/Concept1Page"
import { Concept2Page } from "@/src/concepts/Concept2Page"
import { Concept3Page } from "@/src/concepts/Concept3Page"
import { StrongApplicantFilterPage } from "@/src/concepts/StrongApplicantFilterPage"
import { VersionAPage } from "@/src/concepts/VersionAPage"
import { VersionBPage } from "@/src/concepts/VersionBPage"
import { FutureVisionPage } from "@/src/concepts/FutureVisionPage"
import { MultiLocationFramingPage } from "@/src/pages/MultiLocationFramingPage"
import { VersionBContextPage } from "@/src/pages/VersionBContextPage"
import type { ConceptDef, ConceptPageProps } from "@/src/concepts/types"
import type { FutureVisionLocationChrome } from "@/src/data/futureVisionPresets"

export const concepts: ConceptDef[] = [
  {
    id: "concept-1",
    label: "Concept 1 (Thick | Hide fixed filters)",
    component: Concept3Page,
  },
  {
    id: "concept-2",
    label: "Concept 2 (Compact | Horizontal filters)",
    component: Concept1Page,
  },
  {
    id: "concept-3",
    label: "Concept 3 (Compact | Filter drawer)",
    component: Concept2Page,
  },
  {
    id: "version-a",
    label: "Version A",
    component: VersionAPage,
  },
  {
    id: "version-b",
    label: "Version B",
    component: VersionBPage,
  },
  {
    id: "strong-applicant-filter",
    label: "vSAB",
    component: StrongApplicantFilterPage,
  },
  {
    id: "tab-chips",
    label: "Tab chips",
    component: FutureVisionPage,
  },
  {
    id: "multi-pills",
    label: "Multi-pills",
    component: FutureVisionPage,
  },
  {
    id: "future-vision",
    label: "Multi-pills",
    component: FutureVisionPage,
  },
  {
    id: "vb-context",
    label: "Context",
    component: VersionBContextPage,
  },
  {
    id: "mls-framing",
    label: "Multi-location framing",
    component: MultiLocationFramingPage,
  },
]

/** Concepts shown in Concept Testing folder */
export const conceptTestingIds = ["concept-1", "concept-2", "concept-3"] as const

/** Concepts shown in Delivery folder */
export const deliveryIds = ["version-a", "version-b", "strong-applicant-filter"] as const

export function getConceptById(id: string): ConceptDef | undefined {
  return concepts.find((c) => c.id === id)
}

export function getDefaultConceptId(): string {
  return concepts[0]?.id ?? "concept-1"
}

export function isFutureVisionConcept(id: string | null | undefined): boolean {
  return id === "future-vision" || id === "tab-chips" || id === "multi-pills"
}

export function getFutureVisionLocationChrome(
  id: string | null | undefined,
): FutureVisionLocationChrome {
  return id === "tab-chips" ? "tab-chips" : "multi-pills"
}

export type { ConceptPageProps, ConceptDef }
