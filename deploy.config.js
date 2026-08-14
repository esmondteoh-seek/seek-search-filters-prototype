/**
 * Static Site Deploy config — SEEK internal hosting (not Vercel / Netlify).
 *
 * Package: @seek/static-site-deploy (private)
 * Docs: https://backstage.myseek.xyz/docs/default/component/static-site-deploy/
 *
 * REQUIRED before first `npm run infrastructure`:
 *   - costCentre  — must not stay "TODO"
 *   - owner / businessContact / bucket — confirm with your team
 *
 * See INTERNAL_DEPLOY.md for awsauth, deploy, release, and the Future Vision share URL.
 */
export default {
  // Confirm with your SEEK GitHub team / ownership values
  owner: "seek-design",
  businessContact: "seek-design@groups.myseek.xyz",
  costCentre: "CC400",
  systemName: "seek-search-filters-prototype",
  systemOrg: "seek",
  baseBranch: "main",

  // Single-bucket strategy (recommended for new static apps)
  bucket: "seek-search-filters-prototype",
  environments: [
    { name: "staging", prefix: "staging" },
    { name: "production", prefix: "production" },
  ],
  resources: {
    prefix: "static",
  },
}
