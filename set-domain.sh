#!/bin/sh
# Point the site at its real address.
#
#   ./set-domain.sh jaimiekozyra.netlify.app
#   ./set-domain.sh jaimiek.com
#
# Adds the canonical, og:url and og:image tags to every page, and rewrites
# sitemap.xml and robots.txt. Safe to run again whenever the address changes.
#
# It deliberately does NOT touch the /shop/ checkout links. Those point at the
# Beacons store and are correct as they are.

set -eu

[ $# -eq 1 ] || { echo "usage: $0 <hostname, no https and no trailing slash>" >&2; exit 1; }
HOST=$(printf '%s' "$1" | sed 's|^https\{0,1\}://||; s|/$||')
BASE="https://$HOST"
echo "Setting site address to $BASE"

for f in *.html; do
  # clear anything a previous run left behind
  sed -i '/<link rel="canonical"/d; /<meta property="og:url"/d; /<meta property="og:image"/d' "$f"

  slug=$f
  [ "$f" = "index.html" ] && slug=""

  # canonical goes above og:type, og:url and og:image below og:description
  sed -i "s|<meta property=\"og:type\"|<link rel=\"canonical\" href=\"$BASE/$slug\">\n<meta property=\"og:type\"|" "$f"
  sed -i "/<meta property=\"og:description\"/a\\
<meta property=\"og:url\" content=\"$BASE/$slug\">\\
<meta property=\"og:image\" content=\"$BASE/assets/logo-full.png\">" "$f"
done

# stripped-back.html is unlinked and noindex, so it stays out of the sitemap
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  for p in "index.html 1.0" "soul-map.html 0.9" "work-with-me.html 0.9" \
           "you-left-yourself-out.html 0.9" "about.html 0.8" \
           "pre-work-intensive.html 0.7" "narrative-loom.html 0.7" \
           "newsletter.html 0.7" "contact.html 0.5" "privacy.html 0.2" "terms.html 0.2"; do
    slug=${p% *}; pri=${p#* }
    [ "$slug" = "index.html" ] && slug=""
    echo "  <url><loc>$BASE/$slug</loc><priority>$pri</priority></url>"
  done
  echo '</urlset>'
} > sitemap.xml

printf 'User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n' "$BASE" > robots.txt

echo "Done. $(grep -c '<link rel="canonical"' index.html) canonical tag on index.html, sitemap and robots rewritten."
