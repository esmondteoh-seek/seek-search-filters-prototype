/** Combined mobile search bar label — Figma SERP B (Concept 1) */
export function formatCombinedSearchLabel(keywords: string, location: string): string {
  const k = keywords.trim()
  const l = location.trim()
  if (k && l) return `${k} in ${l}`
  if (k) return k
  if (l) return l
  return "Start your search"
}

/** Bullet-separated search label — Concept 2 unified bar */
export function formatBulletSearchLabel(keywords: string, location: string): string {
  const k = keywords.trim()
  const l = location.trim()
  const where = l || "All Australia"
  if (k) return `${k} • ${where}`
  if (l) return l
  return "Start your search"
}
