#!/usr/bin/env bash
# Commit the current tree and push to origin/main so GitHub Pages deploys.
# Does not run on `npm run build` — call `npm run release:pages` to ship.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="seek-search-filters-prototype"
OWNER="esmondteoh-seek"
REMOTE="https://github.com/${OWNER}/${REPO}.git"

cd "$ROOT"

resolve_git() {
  if command -v git >/dev/null 2>&1 && git --version >/dev/null 2>&1; then
    command -v git
    return
  fi
  local candidate
  for candidate in \
    /Library/Developer/CommandLineTools/usr/bin/git \
    /Applications/Xcode.app/Contents/Developer/usr/bin/git
  do
    if [[ -x "$candidate" ]] && "$candidate" --version >/dev/null 2>&1; then
      echo "$candidate"
      return
    fi
  done
  return 1
}

GIT="$(resolve_git)" || {
  echo "git not found. Install Xcode Command Line Tools: xcode-select --install"
  exit 1
}

if [[ ! -d .git ]]; then
  "$GIT" init -b main
fi

if ! "$GIT" remote get-url origin >/dev/null 2>&1; then
  "$GIT" remote add origin "$REMOTE"
fi

"$GIT" add -A
if "$GIT" diff --cached --quiet; then
  echo "No changes to commit."
else
  "$GIT" commit -m "$(cat <<'EOF'
Ship Future Vision Tab chips and Multi-pills concepts.

Split multi-location chrome into switchable concepts and update GitHub Pages.
EOF
)"
fi

"$GIT" push -u origin HEAD:main

echo ""
echo "Pages will update after the Actions workflow finishes:"
echo "  https://${OWNER}.github.io/${REPO}/jobs?concept=multi-pills&platform=desktop"
echo "  https://${OWNER}.github.io/${REPO}/jobs?concept=tab-chips&platform=desktop"
echo "  https://${OWNER}.github.io/${REPO}/jobs?concept=future-vision&platform=desktop"
