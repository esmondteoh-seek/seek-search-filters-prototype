# SEEK Search Results — Filter Bar Prototype

Aligned with [Figma SERP C (desktop)](https://www.figma.com/design/i9aNsiKQtPlC9xkc10GGbf/Optimise-Search-Filters?node-id=4128-19154) and [SERP B (mobile)](https://www.figma.com/design/i9aNsiKQtPlC9xkc10GGbf/Optimise-Search-Filters?node-id=4128-19308).

## Run

```bash
npm install && npm run dev
```

Local `npm run dev` opens the prototype library. Use it for day-to-day iteration.

## Share internally (SEEK Static Site Deploy)

Do **not** host this prototype on public Vercel/Netlify. SEEK colleagues should open it on **Static Site Deploy** (SSD → S3).

```bash
npm run build:ssd                    # share build: opens Future Vision by default
./scripts/setup-internal-deploy.sh   # Cloudsmith + @seek/static-site-deploy
```

See **[INTERNAL_DEPLOY.md](./INTERNAL_DEPLOY.md)** for awsauth, ownership fields, deploy/release, and the share URL format.

SSD builds set `VITE_SHARE_CONCEPT=future-vision`, so the staging URL lands on Future Vision (desktop). The library stays at `/?folder=future-vision`.

## Layout (two filter rows)

1. **Navy search band** — keyword + location inputs, SEEK button, save heart, then **standard filters**: Pay, Classification, Work type, Remote, Listing time
2. **White personalised row** — **50 km** (only when location is in the submitted search), New to you, Strong applicant, Jobs at SEEK

## Search

- Press **SEEK** or **Enter** to run the search
- Results filter by keywords (title, company, classification, description) and location (city/suburb tokens)
- Filters apply live; search applies on submit

## Stack

React · TypeScript · Vite · `@/components/braid`
