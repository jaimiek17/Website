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
soul-map.html           Main sales page, $67
pre-work-intensive.html 90 minute 1:1
stripped-back.html      6 month container, waitlist only
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

| Token | Value | Use |
| --- | --- | --- |
| `--charcoal` | `#323232` | Brand charcoal, dark bands, body text |
| `--pink` | `#D11371` | Brand pink, on light backgrounds only |
| `--pink-light` | `#FF9EC4` | Pink for use **on** charcoal. Brand pink fails contrast there |
| `--paper` | `#FAF8F6` | Page background |
| `--gold` | `#D4BF6C` | Accent from the July brand notes. Defined, deliberately unused. Passes contrast on charcoal only |

Type is Fraunces for headings and Inter for body, both from Google Fonts.

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

## Placeholders

Every unfinished item is marked in the HTML with a `todo` box that is visible on the
page. There are 15 of them right now. Find them all:

```
grep -rn 'class="todo' *.html
```

Delete the box once you have filled the real thing in.

## READ THIS BEFORE TOUCHING DNS

**`jaimiek.com` is currently serving the Beacons store.** The whole shop lives on it:

```
https://jaimiek.com/shop/f30220e2-...   The Soul Map          $65
https://jaimiek.com/shop/914f53d0-...   You Left Yourself Out $27
https://jaimiek.com/shop/ed50bdba-...   Pre-Work Intensive    $222
https://jaimiek.com/shop/7a975967-...   The Narrative Loom    $12
```

Every buy button on this site points at one of those URLs. **If you repoint
`jaimiek.com` at Netlify, all four checkouts break, the link in your bio breaks,
and anyone who saved a product link gets a dead page.** Do not move the domain
until the store has somewhere else to live.

Three ways through it, best first:

1. **Move the store to `shop.jaimiek.com`** in Beacons, confirm the four product
   URLs work on the subdomain, then repoint `jaimiek.com` here and update the
   links (one command, below). This is the clean end state.
2. **Launch on the free Netlify subdomain first** (`something.netlify.app`), live
   with it for a week, then do option 1. Zero risk, nothing breaks.
3. **Put this site on `www.jaimiek.com`** and leave the store on the apex. It
   works, but two domains for one brand is confusing and the `netlify.toml`
   www redirect has to be removed first.

Updating every checkout link after a store move is one command:

```
sed -i 's|https://jaimiek.com/shop/|https://shop.jaimiek.com/shop/|g' *.html
```

## Deploying

Netlify, free tier:

1. Netlify, Add new site, Import an existing project, pick this repo and branch.
2. Build command: leave empty. Publish directory: `.`
3. Domain: read the DNS warning above first.

To make the contact and opt-in forms work on Netlify, add `netlify` and
`netlify-honeypot="bot-field"` to each `<form>` tag, plus a hidden bot-field input.
They are deliberately not wired up yet so they do not fail silently on another host.
