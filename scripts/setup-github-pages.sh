#!/usr/bin/env bash
# One-time setup: init repo, push to GitHub, enable Pages (GitHub Actions).
# Requires: git, gh (logged in as esmondteoh-seek)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="seek-search-filters-prototype"
OWNER="esmondteoh-seek"

cd "$ROOT"

if ! command -v git >/dev/null 2>&1; then
  echo "git not found. Install Xcode Command Line Tools: xcode-select --install"
  exit 1
fi

if [[ ! -d .git ]]; then
  git init -b main
  git add -A
  git commit -m "$(cat <<'EOF'
Add GitHub Pages deploy for Future Vision share build.

Host the prototype on SEEK GitHub Pages with SPA fallback, base path routing,
and VITE_SHARE_CONCEPT=future-vision for direct share links.
EOF
)"
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/${OWNER}/${REPO}.git"
fi

git push -u origin main

echo ""
echo "After the Actions workflow completes, share:"
echo "  https://${OWNER}.github.io/${REPO}/jobs?concept=future-vision&platform=desktop"
echo "  https://${OWNER}.github.io/${REPO}/jobs?concept=future-vision&platform=mobile-web"
echo "  https://${OWNER}.github.io/${REPO}/jobs?concept=future-vision&platform=app"
echo ""
echo "Enable Pages: Repo → Settings → Pages → Source: GitHub Actions (if not auto-enabled)."
