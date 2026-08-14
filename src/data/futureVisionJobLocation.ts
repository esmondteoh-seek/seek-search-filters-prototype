import type { Job } from "@/src/data/jobs"

/** Suburb lines per city — rotates by job index for plausible card locations */
const LOCATION_LINES: Record<string, { suburb: string; location: string }[]> = {
  sydney: [
    { suburb: "Sydney", location: "Sydney NSW" },
    { suburb: "Parramatta", location: "Parramatta, Sydney NSW" },
    { suburb: "North Sydney", location: "North Sydney, Sydney NSW" },
  ],
  melbourne: [
    { suburb: "Melbourne", location: "Melbourne VIC" },
    { suburb: "Richmond", location: "Richmond, Melbourne VIC" },
    { suburb: "Docklands", location: "Docklands, Melbourne VIC" },
    { suburb: "CBD & Inner Suburbs", location: "CBD & Inner Suburbs, Melbourne VIC" },
  ],
  brisbane: [
    { suburb: "Brisbane", location: "Brisbane QLD" },
    { suburb: "Fortitude Valley", location: "Fortitude Valley, Brisbane QLD" },
    { suburb: "South Brisbane", location: "South Brisbane, Brisbane QLD" },
  ],
  perth: [
    { suburb: "Perth", location: "Perth WA" },
    { suburb: "Fremantle", location: "Fremantle, Perth WA" },
  ],
  kuala: [
    { suburb: "Kuala Lumpur", location: "Kuala Lumpur" },
    { suburb: "KL City Centre", location: "KL City Centre, Kuala Lumpur" },
  ],
  default: [
    { suburb: "Inner city", location: "Inner city" },
    { suburb: "Metro", location: "Metro area" },
  ],
}

function cityKeyFromDisplayName(displayName: string): string {
  const lower = displayName.toLowerCase()
  if (lower.includes("sydney")) return "sydney"
  if (lower.includes("melbourne")) return "melbourne"
  if (lower.includes("brisbane")) return "brisbane"
  if (lower.includes("perth")) return "perth"
  if (lower.includes("kuala") || lower.includes("kl")) return "kuala"
  return "default"
}

/** Card/detail location line for the active location tab */
export function getFutureVisionJobLocationLine(
  selectedDisplayName: string,
  jobIndex: number,
): { suburb: string; location: string } {
  const key = cityKeyFromDisplayName(selectedDisplayName)
  const lines = LOCATION_LINES[key] ?? LOCATION_LINES.default
  return lines[jobIndex % lines.length]
}

/** Remap a job's location to match the selected Future Vision tab */
export function applySelectedLocationToJob(
  job: Job,
  selectedDisplayName: string,
  jobIndex: number,
): Job {
  if (!selectedDisplayName.trim()) return job
  const { suburb, location } = getFutureVisionJobLocationLine(selectedDisplayName, jobIndex)
  return { ...job, suburb, location }
}
