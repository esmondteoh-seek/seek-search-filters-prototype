# Internal deploy (SEEK Static Site Deploy)

Share this prototype with SEEK colleagues through SEEK’s approved static hosting path. **Do not use public hosts (Vercel, Netlify).**

## Why this path

From internal SEEK guidance:

- Design Cursor companion: prototypes are shared via SEEK’s **internal deploy CLI**, not public hosts like Vercel/Netlify.
- Official static-app tooling: **`@seek/static-site-deploy`** (SSD) → S3, with UIV preview URLs (`?v=`).
- Information Classification: Internal material stays on SEEK-controlled locations, not a public website.

Primary docs:

- [Static Site Deploy](https://backstage.myseek.xyz/docs/default/component/static-site-deploy/)
- [SSD setup](https://backstage.myseek.xyz/docs/default/component/static-site-deploy/#setup)
- [SSD process](https://backstage.myseek.xyz/docs/default/component/static-site-deploy/process/)
- [Technical Onboarding (Sku + SSD)](https://myseek.atlassian.net/wiki/spaces/AWPT/pages/5237244115)
- [Private npm local setup](https://backstage.myseek.xyz/docs/default/component/artifact-management-docs/npm/access/#local-setup)
- [awsauth installation](https://backstage.myseek.xyz/docs/default/component/aws-auth-bash/#installation)

## Share URL (Future Vision)

`npm run build:ssd` sets `VITE_SHARE_CONCEPT=future-vision`. After release, send colleagues:

```
https://<ssd-host>/jobs?concept=future-vision&platform=desktop
```

The SSD host itself also opens Future Vision if they hit the origin with no query. Library remains at `/?folder=future-vision`. Use **Copy link** in the prototype chrome to copy the current surface (Desktop / Mobile web / App).

## What’s already prepared in this repo

| Item | Status |
|---|---|
| Same app functionality as local Vite | ✅ |
| `npm run build:ssd` → `dist/staging` + `dist/production` (Future Vision share entry) | ✅ |
| `deploy.config.js` (single-bucket template) | ⚠️ fill `costCentre` before infrastructure |
| package scripts: `infrastructure` / `deploy` / `release` / `url` | ✅ |
| Local AWS CLI under `.tools/bin/aws` | ✅ installed |
| Cloudsmith `~/.npmrc` + `@seek/static-site-deploy` | ✅ if you have already run setup |
| Local `awsauth` wrapper → `.tools/src/aws-auth-bash/auth.sh` | ✅ cloned (Okta login still needed) |
| Interactive setup script | ✅ `scripts/setup-internal-deploy.sh` |

## Ownership — fill before first `infrastructure`

Edit [deploy.config.js](./deploy.config.js). `costCentre` must **not** stay `"TODO"` or SSD will refuse to provision.

| Field | Current | You set |
|---|---|---|
| `owner` | `seek-design` | Confirm GitHub / ownership team |
| `businessContact` | `seek-design@groups.myseek.xyz` | Confirm group email |
| `costCentre` | `TODO` | **Required** — your team cost centre |
| `bucket` | `seek-search-filters-prototype` | Confirm unique in the sandbox account |
| `systemName` | `seek-search-filters-prototype` | Keep unless your platform team says otherwise |

## Blockers that need you (cannot be automated)

These require **your** Okta / AWS identity — the agent cannot complete them:

1. **`awsauth` Okta login** to a sandbox AWS account (interactive password + MFA)  
   Docs: [awsauth](https://backstage.myseek.xyz/docs/default/component/aws-auth-bash/#installation) · newer option: [seek-auth-cli](https://backstage.myseek.xyz/docs/default/component/aws-identity-center/aws-cli-access/)
2. **Team ownership values** in `deploy.config.js` (`costCentre` especially)
3. **Unpublish the old public Vercel site** at https://seek-search-filters-prototype.vercel.app (Vercel dashboard → project → delete or unpublish production) so SEEK-branded UI is not on the public internet
4. Ideally a **SEEK-Jobs** GitHub repo + Buildkite (SSD is designed for that paved road)

## Fastest path to a working internal URL

Run this in your own terminal (interactive prompts for Cloudsmith):

```bash
cd "/Users/esmondteoh/Desktop/SEEK/Work/AI/Discover-Search Filters"
./scripts/setup-internal-deploy.sh
```

That script will:

1. Prompt for Cloudsmith username + API key
2. Write `~/.npmrc`
3. Install `@seek/static-site-deploy`
4. Run `npx @seek/static-site-deploy init`
5. Run `npm run build:ssd`

Then finish AWS + ship:

```bash
export PATH="$PWD/.tools/bin:$PATH"   # local aws + awsauth

# First-time Okta login (interactive — password + phone MFA):
awsauth --auth-only
# Then assume a sandbox role, e.g. APAC Practices Sandbox (example from internal docs):
awsauth -f apac-practices-sandbox
# or: awsauth -f <YOUR_SANDBOX_ACCOUNT_ID>
aws sts get-caller-identity

# Edit deploy.config.js ownership fields (costCentre must not be TODO), then:
npm run infrastructure
npm run build:ssd
npm run deploy -- --buildVersion 1 --branch main
npm run release -- --environment staging --branch main --buildVersion 1
npm run --silent url -- --buildVersion 1 --branch main --baseUrl ""
```

Append `?concept=future-vision&platform=desktop` to the printed URL (or rely on the share-build default).

## Manual Cloudsmith ~/.npmrc (if you prefer)

```bash
npm config set '@seek:registry' https://npm.cloudsmith.io/seek/npm/
# Then add to ~/.npmrc:
# //npm.cloudsmith.io/seek/npm/:_authToken=<YOUR_API_KEY>
```

Or:

```bash
npm login --auth-type=legacy --registry=https://npm.cloudsmith.io/seek/npm/
# username = Cloudsmith login; password = API key
```

## Local vs internal share

| | Local | Internal SSD |
|---|---|---|
| App code | Same | Same |
| Build | `npm run build` / `npm run dev` | `npm run build:ssd` (`VITE_SHARE_CONCEPT=future-vision`) |
| Host | localhost | SEEK S3 via `@seek/static-site-deploy` |
| Landing | Prototype library | Future Vision SERP |
| Share URL | Do not share localhost | Staging/prod + UIV `?v=` |

Keep using `npm run dev` for day-to-day iteration. Use SSD when you need an internal shareable URL.
