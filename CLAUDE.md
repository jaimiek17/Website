# Working with Jaimie

## How to reply

Minimal and direct. The outcome, not the process.

- Do not narrate what was done, in what order, or what was tested
- No summaries of the work unless asked
- If she needs to do something, give the steps plainly and nothing else
- If nothing is needed from her, say it is done and stop
- Detail creates confusion and overwhelm. Leave it out

Say something only if it changes what she does or decides. A bug found and
fixed does not need explaining. A bug that is still open, or that needs her,
does.

## The site

Static HTML in `public/`, a Cloudflare Worker in `src/` for the forms and
emails. Push to `main` deploys. Bump the `?v=` on css and js every time
either changes.

Voice rules for anything published or emailed live in
`docs/newsletter-brief.md`. No em dashes, ever.
