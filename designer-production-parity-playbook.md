# Designer playbook: Prototype ↔ Production pixel parity with Cursor

This playbook is **surface-agnostic** for SEEK **hirer** and **candidate** experiences. Use it whenever you need a design prototype to match production chrome and layout at pixel parity.

The **method** (production code as source of truth, layer-by-layer matching, Pass/Fail audit) is reusable. The **SoT map** for each surface is not — rediscover repos and packages per product.

**Worked example (this repo):** INFO-492 CAJA Admin/Retail Sidekicker classify prototype  
- Prototype: `SEEK-Jobs/info-492-caja-admin-retail`  
- Page SoT: `SEEK-Jobs/job-posting-frontends` (`SidekickerClassify`, `PageLayout`)  
- Shared chrome: `@seek/adv-header-footer` (metropolis)  
- Completed audit: [`chrome-production-audit.md`](./chrome-production-audit.md)

---

## Prerequisites

1. Cursor open on your **prototype** repo (**Agent** mode for implementation).
2. GitHub CLI authenticated (`gh auth status`) with access to SEEK-Jobs (and any other orgs that own the surface).
3. Know the **live URL** (spot-check only) and the likely **product / app** name.
4. Accept that **auth-gated live pages are not the SoT** — production source is.

---

## Mental model

```
Live URL  →  spot-check only (may 404 / need auth)
     ↓
Find production repo + file path
     ↓
Treat that code as SoT (tokens, structure, copy)
     ↓
Match prototype one chrome layer at a time
     ↓
Write Pass/Fail audit; default screen must Pass
```

Prefer **consuming the real package** (e.g. shared header/footer) over redrawing a facsimile. Facsimiles drift; packages stay closer to production pixels.

---

## Workflow (do this in order)

### 1. Name the page and the chrome layers

List layers top → bottom. Example shape (adapt per surface):

1. Global header  
2. Title / stepper / subnav band  
3. Page body shell (margins, content width)  
4. Page heading + subheading  
5. Primary interactive UI (cards, forms, lists)  
6. Experiment / variant body (only if in scope)  
7. Page actions / footer CTAs  
8. Global footer  

Prompt Cursor:

> List the chrome layers on this screen top to bottom. For each, guess the production SoT repo and component name. Do not edit code yet.

### 2. Find the production SoT

> Find where production implements [page/feature]. Search SEEK-Jobs with gh. Return repo, file paths, and which package owns header/footer vs page body.

Typical prompts:

- `Where does [product] render [HeaderComponent]?`
- `Find [PageName] [Component] in [app-repo]`
- `Is the header in this app or in a shared package?`

**Hirer vs candidate (illustrative — always verify):**

| Surface type | Typical SoT pattern |
|--------------|---------------------|
| Hirer / employer | App repo + often `@seek/adv-header-footer` + Braid `seekJobs` |
| Candidate / jobseeker | Different apps/packages and sometimes different Braid themes |
| Shared UI | Design-system / metropolis / shared packages — not only the page app |

### 3. Match one layer at a time

Never “make the whole page look like production” in one shot.

> Match only the [header \| stepper band \| choice cards \| footer actions] to production SoT at [path]. Use the same Braid tokens, spacing, and structure. Leave [out of scope] alone.

Rules of thumb:

- **Shared chrome** → import the real package when possible.  
- **Page-local UI** → mirror structure + design-system tokens from the SoT file.  
- **Copy** → pull from production vocab / translations when it exists.  
- **Out of scope** → say so (analytics, GraphQL, experiment variants).

### 4. Lock an audit baseline

Production parity usually means a **control** direction, not the latest experiment.

> Set the default variant to the production control. Keep a direction switcher for experiments. Plan a full chrome audit that must Pass against production.

### 5. Close with a Pass/Fail audit doc

> Create docs/…-production-audit.md with a layer Pass/Fail checklist, SoT paths, non-blockers, and how to verify locally. Fix any remaining pass-blocking gaps.

Verify: local app + checklist + breakpoints (mobile / tablet / desktop). Live URL = optional spot-check.

---

## Prompt library (copy into Cursor)

### Discovery

```
Where does this prototype live in SEEK-Jobs, and where does the production
version of this page live? Map header, stepper/band, body, and footer to repos.
This playbook applies to hirer and candidate surfaces — find the correct SoT
for *this* surface; do not assume CAJA paths.
```

```
I cannot load the live page (auth/404). Use production source as SoT.
Find [Header] / [Layout] / [PageName] and summarize tokens + structure.
```

### Layer matching

```
Match our React [layer] to production [Component] at [repo/path].
Pixel-parity on structure and design-system spacing. Do not change [out of scope].
Prefer consuming the real package over a facsimile.
```

```
Audit production [ComponentA] vs our [ComponentB]. List gaps only; then fix them.
```

### Full audit

```
Plan a full audit in React Chrome. Ensure the audit passes Production.
Baseline = production control variant. Experiment directions out of scope
for the pass gate. Leave a re-runnable Pass/Fail checklist in docs/.
```

### Constraints to paste with every prompt

```
- SoT = production code in SEEK-Jobs (or owning org), not the live HTML.
- Use the product’s design-system tokens; no one-off hex unless production does.
- One chrome layer per change set.
- Explicit out of scope: analytics, live session, experiment bodies.
- Do not edit the plan file unless asked.
```

---

## What “pixel parity” means here

| In scope | Out of scope |
|----------|--------------|
| Layout structure, design-system space/radius/shadow | Live GraphQL / real account |
| Shared header/footer package when one exists | Tracking / glean |
| Production control copy + demo data | Full i18n plumbing |
| Responsive stacking of actions | Experiment / exploration card bodies |
| Same testids / button ids when useful | Full form draft routing |

---

## Common pitfalls

1. **Redrawing shared chrome** instead of consuming the production package.  
2. **Using the live DOM** as SoT when the page is auth-gated.  
3. **Matching an experiment** and calling it a “production pass”.  
4. **One giant prompt** — layers blur; regressions hide.  
5. **Assuming CAJA / hirer paths** on a candidate (or other) surface.  
6. **Private packages** — may need Cloudsmith or a vendored bootstrap; ask eng if install fails.

---

## Checklist template (reuse per project)

Copy into `docs/<surface>-production-audit.md` and fill per surface.

| # | Layer | Pass criteria | Prototype path | Production SoT | Status |
|---|-------|---------------|----------------|----------------|--------|
| 1 | Header | … | … | … | |
| 2 | … | | | | |

**Non-blockers:** …  

**Last run:** date · baseline variant · Pass/Fail  

---

## Worked example trail (this repo)

1. Locate prototype + production (`info-492-caja-admin-retail` vs `job-posting-frontends`).  
2. Header/footer → real `@seek/adv-header-footer` (not facsimile).  
3. Stepper band → `PageLayout` surface tokens.  
4. Choice cards / `TempProfileRow` / `FooterActions` → `SidekickerClassify` SoT.  
5. Full chrome audit → [`chrome-production-audit.md`](./chrome-production-audit.md) (all 8 layers Pass).

Other designers: repeat steps 1–5 on **your** surface with a fresh SoT map and audit file.
