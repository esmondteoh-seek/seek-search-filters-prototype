# Multi-location search — discovery one-pager

**Audience:** Discover Search Q2 design discussion (20 Aug 2026) and OKR discovery  
**Status:** Definition locked. Result model recommended. Baseline metrics and AIPS/SEO still open.  
**Not this problem:** Hirer multi-location posting, location radius, showing every location on a multi-location job ad.

---

## Definition (locked)

Multi-location search lets a **candidate** search the **same role** (keyword + the same filters) **across more than one city, suburb, or region in a single search**, instead of repeating the query location by location.

**Candidate job:** “I would take this role in more than one place. Don’t make me start the search again.”

**In:** Candidate search; Career Agent / agentic URL that already asks for several places.  
**Out:** Hirer posting, cross-country search, SERP display of every location on a multi-posted ad, radius as the solution.

FY27 Q2 is **discovery only**, all platforms, all markets. Goal: fewer repeated location searches; more application starts. ([OKR](https://myseek.atlassian.net/wiki/spaces/AJDT/pages/5746360792))

---

## Today

Unified search supports **one location**. Product: “Multiple locations is unavailable currently.” JobsDB allowed multi-select; unification mapped those URLs to one location or dropped location. Career Agent still emits concatenated locations and gets a blank SRP ([AGNT-140](https://myseek.atlassian.net/browse/AGNT-140)).

This repo’s Future Vision is a **concept**, not production: tab chips or multi-pills, with results **scoped to the selected tab**.

---

## Result model (locked for discovery)

Split **input chrome** from **what the SERP is**. Pills vs tabs is chrome. Merged vs tab-scoped is the product.

| | Concept A (recommended default) | Concept B (already in this repo) |
| --- | --- | --- |
| Input | Multi-pills in the where-box | Hanging location tab chips |
| Results | **Merged OR** — one list, jobs in any selected place | **Tab-scoped** — switch place, see that place only |
| Why | HK asked for one view; JobsDB was this; one URL for Agent/SEO | Lets candidates compare density per place; Future Vision already builds it |

**Lock:** Discovery tests **Concept A as the primary hypothesis**. Keep **Concept B** as the alternative to walk on 20 Aug — do not polish chrome until this choice is validated.

**Working assumptions (pending AIPS):** max **5** locations; **same radius** on every selected place; markets = all (OKR), with discovery attention on **HK** (2026 voice) and **MY** (highest 2022 saved-search ceiling).

---

## Evidence (do not size KRs from 2022)

- **2026:** HK GTM, 1 item — “job search-multi location should be added”; want the same role across places in one view. ([feedback](https://myseek.atlassian.net/wiki/spaces/AJDT/pages/5356781616))
- **2022, stale:** saved searches with multiple locations HK &lt;2%, TH &lt;5%, SG &lt;2%, MY &lt;10%, ID &lt;6%, PH &lt;3%. Minority behaviour, not FY27 opportunity size.
- **Radius experiment (adjacent):** high adoption, no apply-start lift; ID/PH SRP apply starts down ~2.5–2.9%. More location control can starve recall. Multi-location expands places — still needs a recall guardrail.

---

## Success (unbaselined)

OKR placeholders until DA returns numbers:

1. Application starts per multi-location search vs control
2. Search-session → first application rate (time to first apply)

---

## Ask DA — Yong Han Wong

Do **not** use 2022 saved-search % as FY27 size. Need a current workaround baseline:

1. Sessions (and unique visitors) where the same keyword is searched with **2+ distinct locations** within 30 minutes.
2. Share of all search sessions, by **market** and **platform**.
3. **Apply starts** and **minutes to first apply** for those sessions vs single-location sessions (same keyword, one location).
4. Median locations per such session; % that also change other filters.
5. If still queryable: refresh the 2022 saved-search multi-location % by market.

Until this lands, KR “X%” stays blank.

---

## Tech constraints (confirmed vs open)

**Confirmed**

- Search **UI** is single-location. 2022: **Search API could accept multiple locations; UI could not.** Reconfirm on Job Search **v7** / Smarter Search v5 with AIPS.
- Web **URL contract** is one location in the SEO path (`/react-jobs-in-sydney`) via `@seek/seek-jobs-seo`. Multi-location needs an agreed path, query param, title, and canonical. Chia Lun Cheng flagged this in OKR planning even for discovery.
- Career Agent has **no valid multi-location SRP URL** (AGNT-140). Concatenating names into `location=` blanks the page.

**Still confirm with AIPS + SEO + FES (Chia Lun Cheng)**

- Does JSv7 / SSv5 accept multiple location IDs, ranking, and latency at 2–5 locations?
- URL + `<title>` + canonical for two+ places (index vs `noindex`)?
- Saved search and last-search: store a list, or first location only?
- Agent URL contract: structured list, not a concatenated string. Max locations.

**No production build** until those four are written down.

---

## 20 Aug design discussion — Riccardo

Walk this, not chrome polish:

1. Locked definition and non-goals (2 min)
2. Concept A vs B table — pick what Future Vision should represent this quarter (10 min)
3. Max 5 / same radius / HK+MY attention (5 min)
4. What we need from DA and AIPS/SEO before any experiment (5 min)
5. Next: one concept in Future Vision labelled as the discovery default; the other kept as the alternative

Prototype paths: Future Vision folder — `tab-chips` (Concept B today) and `multi-pills` (Concept A input).
