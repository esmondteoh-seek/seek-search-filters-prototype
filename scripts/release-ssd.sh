#!/usr/bin/env bash
# Ship Future Vision to SEEK Static Site Deploy (staging).
# Prerequisite: awsauth login in this shell (see INTERNAL_DEPLOY.md).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="$ROOT/.tools/bin:$PATH"
BUILD_VERSION="${BUILD_VERSION:-1}"
BRANCH="${BRANCH:-main}"
ENVIRONMENT="${ENVIRONMENT:-staging}"

echo "==> Checking AWS credentials…"
IDENTITY="$(aws sts get-caller-identity 2>&1)" || {
  echo "$IDENTITY"
  echo ""
  echo "ERROR: No AWS credentials. Run in this terminal first:"
  echo "  export PATH=\"$ROOT/.tools/bin:\$PATH\""
  echo "  awsauth --user esmondteoh@seekasia.com --auth-only"
  echo "  awsauth --user esmondteoh@seekasia.com -d -f apac-practices-sandbox"
  exit 1
}
echo "$IDENTITY"

if echo "$IDENTITY" | grep -qiE 'ReadOnly|BillingAndCosts|MetricsRead|BuildAgent'; then
  echo ""
  echo "ERROR: Current role cannot deploy SSD (read-only or metrics-only)."
  echo "Pick a sandbox Admin / Engineer / Privileged role, e.g.:"
  echo "  awsauth --user esmondteoh@seekasia.com -d -f apac-practices-sandbox"
  echo ""
  echo "In the menu, choose a role containing Admin, Engineer, or Privileged — not Read, Metrics, or Billing."
  echo "Then verify: aws sts get-caller-identity"
  exit 1
fi

echo ""
echo "==> Building SSD bundles (Future Vision share entry)…"
npm run build:ssd

echo ""
echo "==> Provisioning infrastructure (skip if bucket already exists)…"
npm run infrastructure || true

echo ""
echo "==> Deploy build ${BUILD_VERSION}…"
npm run deploy -- --buildVersion "$BUILD_VERSION" --branch "$BRANCH"

echo ""
echo "==> Release to ${ENVIRONMENT}…"
npm run release -- --environment "$ENVIRONMENT" --branch "$BRANCH" --buildVersion "$BUILD_VERSION"

echo ""
echo "==> Share URL:"
BASE_URL="$(npm run --silent url -- --buildVersion "$BUILD_VERSION" --branch "$BRANCH" --baseUrl "" 2>/dev/null || true)"
if [[ -n "$BASE_URL" ]]; then
  echo "${BASE_URL}/jobs?concept=future-vision&platform=desktop"
  echo "${BASE_URL}/jobs?concept=future-vision&platform=mobile-web"
  echo "${BASE_URL}/jobs?concept=future-vision&platform=app"
else
  echo "(Run: npm run --silent url -- --buildVersion ${BUILD_VERSION} --branch ${BRANCH} --baseUrl \"\")"
fi
