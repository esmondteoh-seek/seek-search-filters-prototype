#!/usr/bin/env bash
# Interactive setup for SEEK Static Site Deploy on this prototype.
# Docs: INTERNAL_DEPLOY.md + https://backstage.myseek.xyz/docs/default/component/static-site-deploy/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NPMRC="${HOME}/.npmrc"
REGISTRY="https://npm.cloudsmith.io/seek/npm/"

echo "==> SEEK internal deploy setup"
echo "    Project: $ROOT"
echo

# --- 1. Private npm (Cloudsmith) ---
if ! grep -q 'npm.cloudsmith.io/seek/npm' "$NPMRC" 2>/dev/null; then
  echo "==> Configure Cloudsmith private npm for @seek packages"
  echo "    Open: https://cloudsmith.com/ → SEEK org → API keys"
  echo "    Or: Backstage → Artifact Management → NPM local setup"
  open "https://cloudsmith.com/" 2>/dev/null || true
  open "https://backstage.myseek.xyz/docs/default/component/artifact-management-docs/npm/access/#local-setup" 2>/dev/null || true
  echo
  read -r -p "Cloudsmith username (usually your SEEK email local-part or Cloudsmith login): " CS_USER
  read -r -s -p "Cloudsmith API key (input hidden): " CS_TOKEN
  echo
  if [[ -z "${CS_TOKEN}" ]]; then
    echo "ERROR: API key required. Create one at cloudsmith.com then re-run."
    exit 1
  fi
  {
    echo ""
    echo "# SEEK private npm (Cloudsmith) — added by scripts/setup-internal-deploy.sh"
    echo "@seek:registry=${REGISTRY}"
    echo "//npm.cloudsmith.io/seek/npm/:_authToken=${CS_TOKEN}"
    echo "//npm.cloudsmith.io/seek/npm/:username=${CS_USER}"
    echo "//npm.cloudsmith.io/seek/npm/:always-auth=true"
  } >> "$NPMRC"
  chmod 600 "$NPMRC"
  echo "Wrote @seek registry + token to ~/.npmrc"
else
  echo "==> ~/.npmrc already has Cloudsmith @seek registry"
fi

echo
echo "==> Verifying @seek/static-site-deploy is reachable…"
if ! npm view @seek/static-site-deploy version; then
  echo "ERROR: Still cannot read @seek/static-site-deploy."
  echo "Check the API key and that you have SEEK Cloudsmith org access (#support-cloudsmith)."
  exit 1
fi

echo
echo "==> Installing @seek/static-site-deploy…"
npm install --save-dev @seek/static-site-deploy

echo
echo "==> Running SSD init (keeps existing deploy.config.js if present)…"
npx @seek/static-site-deploy init || true

echo
echo "==> Building SSD layout (dist/staging + dist/production)…"
npm run build:ssd

echo
echo "==> Next: AWS auth + infrastructure/deploy"
echo "    1. Install awsauth: https://backstage.myseek.xyz/docs/default/component/aws-auth-bash/#installation"
echo "    2. awsauth -f <sandbox-account-id>"
echo "    3. Edit deploy.config.js (owner, costCentre, bucket)"
echo "    4. npm run infrastructure"
echo "    5. npm run deploy -- --buildVersion 1 --branch main"
echo "    6. npm run release -- --environment staging --branch main --buildVersion 1"
echo
echo "Done as far as npm/package setup allows without AWS."
