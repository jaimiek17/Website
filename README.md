# jaimiek.com

Personal site for **Jaimie Kozyra / Soul Deep Coaching**.

Plain static HTML, CSS and a few lines of JavaScript. No build step, no framework,
no dependencies. Open any `.html` file in a browser and it works.

## Files

```
index.html              Home
about.html              Jaimie's story and how she works
work-with-me.html       All offers in one place, plus FAQ
you-left-yourself-out.html  Workbook sales page, $27
soul-map.html           Main sales page, $65
pre-work-intensive.html 90 minute 1:1
narrative-loom.html     44 card oracle deck
newsletter.html         Newsletter signup and socials
contact.html            Contact form
privacy.html            Privacy policy draft
terms.html              Terms and disclaimer draft
404.html                Not found

css/site.css            All styling, brand tokens at the top
js/site.js              Mobile nav toggle, footer year
assets/                 Logo files and favicons
netlify.toml            Headers, caching, www redirect
```

## Brand

Set in `css/site.css` under `:root`.

Five values. Nothing outside this list.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#2A2A2A` | Dark bands, headings |
| `--charcoal` | `#323232` | Body text |
| `--pink` | `#D11371` | Accent, buttons, hairline rules |
| `--blush` | `#F8F1EF` | Page background |
| `--paper` | `#FDFBFA` | Contrast blocks |

Two families. Fraunces for display, worked hard across its optical-size and weight
axes, and Archivo for body. No third font.

The type scale is a 1.25 ratio, set in `:root` as `--t-h1` through `--t-small`.
It resolves to exactly 68 / 44 / 26 / 24 / 19 / 16 at desktop and 40 / 30 / 22 / 20
/ 18 / 16 at 375px. Nothing on the site goes below 16px. Do not invent sizes
outside the scale.

**One exception to the five colours.** On the ink bands the secondary button and
its border use `--blush`, not `--pink`. Pink on ink is 2.8:1 and fails. Staying
inside the palette meant reaching for blush rather than adding a sixth value.

Logo files in `assets/` were derived from the supplied PNG. The white background was
made transparent and the mark was cropped out. The artwork itself was not redrawn.

Photography in `assets/` was cropped from two supplied portraits, framed on the face
rather than centre-cropped:

| File | Used on | Crop |
| --- | --- | --- |
| `jaimie-hero.jpg` | Home hero, Pre-Work Intensive hero | 4:5 |
| `jaimie-about.jpg` | About hero | 4:5 |
| `jaimie-square.jpg` | Home, "What I actually do" | 1:1 |

Three image slots are still placeholders, all product shots: the Soul Map cover
mockup, a Soul Map sample spread, and a Narrative Loom deck photo.

## Voice rules baked into the copy

- **No em dashes.** Anywhere. Ever.
- No coach-speak, no hype, no hedging, no AI-sounding phrasing.
- Direct "you", never "she" for the reader.
- No income claims of any kind.
- Astrology and Human Design stay background interpretive tools, never the product.
- Nothing invented: no fake testimonials, no unverified statistics, no made-up numbers.

## Open questions

The visible `todo` boxes were removed from the pages. They rendered to visitors.
Everything they said is preserved in `NOTES.md`.

`stripped-back.html` still exists but is unlinked, `noindex`, and out of the
sitemap. It goes back on the site after one real test session has run.

## The domain, and why the site is not on it

`jaimiek.com` was bought through Beacons, and Jaimie has no access to its DNS
records. That decides the plan.

Checked against public DNS and the .com registry on 2026-08-31:

| | |
| --- | --- |
| Registrar | Name.com, Inc. Beacons sells through them. |
| Nameservers | `ns1bqx` / `ns2fln` / `ns3bfm` / `ns4lpv.name.com` |
| Apex and www | Both A records to `34.49.161.242`, which is Beacons |
| Registered | 2026-07-31 |
| Registry status | `clientTransferProhibited` |

**The site ships on a Netlify subdomain.** Nothing else is available until the
domain can be moved, and nothing else is needed to start selling.

**The store keeps working exactly as it is.** All four checkout links point at
`jaimiek.com/shop/...` and stay there. Because the domain is not moving, the
risk that used to sit on this project is gone. Do not rewrite those links.

### When the domain can be moved

ICANN bars a registrar transfer for 60 days after registration. That clears
around **2026-09-29**. At that point, ask Beacons to unlock the domain and give
you the EPP authorisation code, then transfer it to a registrar where you hold
the account, such as Cloudflare or Porkbun. After that you control DNS and can
put the site on the apex with the store on `shop.jaimiek.com`.

Also worth asking Beacons whether the domain is tied to the subscription, and
what happens to it if the subscription ever lapses.

### Setting the address

Canonical, `og:url` and `og:image` tags have been removed from every page. They
pointed at `jaimiek.com`, which now serves the Beacons store, so they were
telling search engines the canonical version of each page was somebody else's
content. Leaving them in would have been worse than having none.

Run this once the real address is known, and again if it ever changes:

```
./set-domain.sh jaimiekozyra.netlify.app
```

It writes the canonical and Open Graph tags on all thirteen pages and rewrites
`sitemap.xml` and `robots.txt`. It does not touch the `/shop/` checkout links.

## Deploying

Netlify, free tier:

1. Netlify, Add new site, Import an existing project, pick this repo and branch.
2. Build command: leave empty. Publish directory: `.`
3. Domain: leave it on the Netlify subdomain. Then run `./set-domain.sh <your-subdomain>.netlify.app` and push.

To make the contact and opt-in forms work on Netlify, add `netlify` and
`netlify-honeypot="bot-field"` to each `<form>` tag, plus a hidden bot-field input.
They are deliberately not wired up yet so they do not fail silently on another host.
