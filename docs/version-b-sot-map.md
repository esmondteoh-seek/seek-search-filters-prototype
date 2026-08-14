# Version B — Candidate SERP chrome SoT map

Last updated: 2026-08-13  
Baseline: production **control** chrome (Chalice). Filter experiment = attached Default / Selected / Scrolled frames.

| # | Layer | Prototype path | Production SoT (verify in SEEK-Jobs/chalice) | Notes |
|---|-------|----------------|---------------------------------------------|-------|
| 1 | Global header | `src/components/SiteHeader.tsx` | Candidate global nav / header module | Riccardo, Job search underline |
| 2 | Search band (expanded) | `src/components/versionB/VersionBSearchBand.tsx` | Search form / SRP search band | What / Where / SEEK pink |
| 2b | Search band (scrolled) | `SearchBandCompactRow` via Version B | Sticky condensed search pill | Single `What · Where` pill |
| 3 | Filter row | `src/components/versionB/VersionBFilterRow.tsx` | Filter pills / smart filters | Experiment — not control |
| 4 | Results header | `src/components/Results/ResultsHeader.tsx` | SRP results count | Display counts from frames |
| 4b | Location radius | `src/components/versionB/VersionBLocationLine.tsx` | Distance filter copy | `50 km` in results area |
| 5 | Job cards | `src/components/Results/JobCard.tsx` `variant="delivery"` | Job card component | Web: logo top-right; App: top-left |
| 6 | Job detail | `src/components/Results/JobDetailPanel.tsx` | Job detail / JDV panel | Desktop split only |
| 7 | App shell | `src/components/versionB/DeliveryAppShell.tsx` | Native iOS/Android SRP | Discover exact repo via `gh` |
| 7b | Mobile web shell | `src/components/versionB/MobileWebShell.tsx` | Chalice mobile web SRP | Phone frame, web header |

**Search serving (out of scope for UI):** Job Search API V6 via candidate-graphql-api.

**Do not use:** `@seek/adv-header-footer` (hirer), CAJA paths, live HTML as SoT.
