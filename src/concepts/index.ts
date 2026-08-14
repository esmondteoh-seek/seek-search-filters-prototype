import { Concept1Page } from "@/src/concepts/Concept1Page"
import { Concept2Page } from "@/src/concepts/Concept2Page"
import { Concept3Page } from "@/src/concepts/Concept3Page"
import { StrongApplicantFilterPage } from "@/src/concepts/StrongApplicantFilterPage"
import { VersionAPage } from "@/src/concepts/VersionAPage"
import { VersionBPage } from "@/src/concepts/VersionBPage"
import { FutureVisionPage } from "@/src/concepts/FutureVisionPage"
import type { ConceptDef, ConceptPageProps } from "@/src/concepts/types"

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
    id: "future-vision",
    label: "Future Vision",
    component: FutureVisionPage,
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

export type { ConceptPageProps, ConceptDef }
