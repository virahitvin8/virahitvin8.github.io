#!/usr/bin/env bash
#
# Point every hard-coded URL at your real domain.
#
#   ./set-domain.sh https://akshitvinay.dpdns.org
#   ./set-domain.sh https://virahitvin8.github.io      # back to GitHub Pages
#
# Rewrites the host in:
#   index.html   canonical, og:url, og:image, twitter:image, JSON-LD url
#   robots.txt   Sitemap line
#   sitemap.xml  every <loc>
#   404.html     any host reference it still carries
#   CNAME        created for a custom domain, removed on *.github.io
#
# The host to replace is detected from the current canonical URL, so this is
# genuinely re-runnable: setting a domain, then changing your mind, then
# changing it back all work.

set -euo pipefail

NEW="${1:-}"
if [ -z "$NEW" ]; then
  echo "usage: ./set-domain.sh https://your-domain.com" >&2
  exit 1
fi

NEW="${NEW%/}"                          # strip a trailing slash

if [[ ! "$NEW" =~ ^https?:// ]]; then
  echo "error: include the scheme, e.g. https://akshitvinay.dpdns.org" >&2
  exit 1
fi

cd "$(dirname "$0")"

FILES=(index.html robots.txt sitemap.xml 404.html)
PRESENT=()
for f in "${FILES[@]}"; do [ -f "$f" ] && PRESENT+=("$f"); done

# ── 1. work out which host is currently baked in ──────────────────────────
CURRENT="$(grep -o 'rel="canonical" href="https://[^"/]*' index.html 2>/dev/null \
           | head -1 | sed 's|.*https://||')"

if [ -z "$CURRENT" ]; then
  # no canonical yet — fall back to the sitemap, then to the legacy list
  CURRENT="$(grep -o '<loc>https://[^/<]*' sitemap.xml 2>/dev/null \
             | head -1 | sed 's|.*https://||')"
fi

OLD_HOSTS=()
[ -n "$CURRENT" ] && OLD_HOSTS+=("https://$CURRENT")
# legacy placeholders, in case a very old copy is being migrated
OLD_HOSTS+=(
  "https://virahitvin8.github.io"
  "https://akshitvinay.github.io"
  "https://akshit-vinay.github.io"
)

changed=0
seen=""

for host in "${OLD_HOSTS[@]}"; do
  [ "$host" = "$NEW" ] && continue
  case "$seen" in *"|$host|"*) continue ;; esac
  seen="$seen|$host|"

  for file in "${PRESENT[@]}"; do
    if grep -qF "$host" "$file" 2>/dev/null; then
      # macOS and GNU sed disagree about -i, so go via a temp file
      sed "s|${host}|${NEW}|g" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
      echo "  updated  $file   ($host -> $NEW)"
      changed=$((changed + 1))
    fi
  done
done

# ── 2. GitHub Pages needs a CNAME file for a custom domain ────────────────
# Without it, the next deploy silently falls back to *.github.io.
if [[ "$NEW" != *".github.io"* ]]; then
  printf '%s\n' "${NEW#*://}" > CNAME
  echo "  created  CNAME    (${NEW#*://})"
  changed=$((changed + 1))
elif [ -f CNAME ]; then
  rm -f CNAME
  echo "  removed  CNAME    (back on a *.github.io host)"
  changed=$((changed + 1))
fi

echo
if [ "$changed" -eq 0 ]; then
  echo "Nothing left to change. Current canonical:"
  grep -o 'rel="canonical" href="[^"]*"' index.html 2>/dev/null || true
  exit 0
fi

echo "Done. Now verify nothing still points at the old host:"
echo "  grep -rn 'github.io' . --include='*.html' --include='*.txt' --include='*.xml'"
echo
echo "Then submit ${NEW}/sitemap.xml in Google Search Console."
