# Version B — Production audit

Last run: 2026-08-13 (from-scratch rebuild)  
Baseline: production **control** chrome (Chalice / seekJobs tokens). Filter row = **experiment variant** (nine attached frames).

## Pass gate

Default screen must Pass production control chrome. Filter + scrolled band must Pass the nine attached frames.

| # | Layer | Pass criteria | Prototype path | Production SoT | Status |
|---|-------|---------------|----------------|----------------|--------|
| 1 | Global header | Nav, Riccardo, Job search underline; **visible on desktop scrolled** | `SiteHeader.tsx` + `VersionBDesktop.tsx` | Chalice header | Pass |
| 2 | Search band (expanded) | What / Where / SEEK; flat `#051A49` navy | `VersionBSearchForm.tsx` + `VersionBNavyBand` | Chalice search form | Pass |
| 2b | Search band (scrolled) | Single search pill + NTY + Strong + More (5); flat band | `VersionBDesktop.tsx` compact row | Chalice sticky SRP | Pass |
| 3 | Filter row (experiment) | Mint NTY dot + white ring; outline diamond; More `IconFilter` (5); no sort on band | `VersionBFilterChips.tsx` | Delivery frames | Pass |
| 4 | Results header | Frame job counts; `IconSort` on results header | `VersionBResults.tsx` | Chalice count | Pass |
| 4b | Location radius | Showing jobs within **50 km**… | `VersionBResults.tsx` | Chalice distance copy | Pass |
| 5 | Job cards | Circular logo (web) / square (app); NTY, Strong, Early applicant; chevron + bookmark | `VersionBJobCard.tsx` | Chalice job card | Pass |
| 6 | Job detail | Split pane desktop; delivery chrome | `JobDetailPanel.tsx` | Chalice JDV | Pass |
| 7 | Mobile web shell | Phone frame; seek + Menu; sticky navy | `VersionBMobileWeb.tsx` | Chalice mobile web | Pass |
| 8 | App shell | Back + `IconFilter` (badge 5); white pill row; Home + Recommended 99+ tabs | `VersionBApp.tsx` | Native SRP | Pass |
| 9 | Typography | SeekSans on Version B root | `VersionBRoot.tsx` | Production font stack | Pass |
| 10 | Isolation | No shared `JobCard` / `SearchBandShell` / `FiltersEntryControl` | Dedicated Version B tree | — | Pass |

## Token lock (Version B)

| Role | Value |
|------|-------|
| Search band | `#051A49` flat (Chalice brand) |
| SEEK button | `#E60278` |
| Selected pills | `#2455C9` + white text |
| NTY dot | `#00C389` outer ring + `#12784F` inner dot; hidden when all NTY jobs on page seen |
| Page bg | `#F7F8FB` |

## Component tree (from-scratch)

```
VersionBPage
├── VersionBDesktop (desktop)
├── VersionBMobileWeb (mobile-web)
└── VersionBApp (app)
    ├── VersionBNavyBand / VersionBSearchForm
    ├── VersionBFilterChips
    ├── VersionBResults → VersionBJobCard
    └── JobDetailPanel (desktop split only)
```

## Frame matrix (prototype chrome)

| State | Desktop | Mobile web | App |
|-------|---------|------------|-----|
| Default | `?platform=desktop&vbState=default` | `?platform=mobile-web&vbState=default` | `?platform=app&vbState=default` |
| Selected | `?platform=desktop&vbState=selected` | `?platform=mobile-web&vbState=selected` | `?platform=app&vbState=selected` |
| Scrolled | `?platform=desktop&vbState=scrolled` | Sticky in phone shell | Sticky header + white pills |

## Non-blockers

- Company logos use brand-colour initials (no production CDN assets in prototype).
- Filter popovers reuse shared `FilterBar` content; dropdown chrome not pixel-matched.
- Chalice file paths not verified via live GitHub in this session.

## Verify locally

```bash
npm run dev
```

Open Delivery → Version B. Use prototype chrome: **Desktop | Mobile web | App** × **Default | Selected | Scrolled**.

```bash
npm run build
```
