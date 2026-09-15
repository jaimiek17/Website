# NEWSLETTER TEMPLATES

Four layouts, one skeleton. They share the foil band, the paper card, the
blush ground, the pink eyebrow and signature, and the same footer, so a reader
never has to work out whether an email is from Jaimie.

Pink highlighted text is a slot to be replaced. Nothing in these files is
finished copy.

| File | When to use it |
|---|---|
| `1-column.html` | The default. One idea, start to finish. Most issues. |
| `2-picture-lead.html` | An issue built around a card, a photo, or a page. |
| `3-notes.html` | A short issue. Three observations, no essay. |
| `4-with-an-offer.html` | Rare. The idea is still given away in full first. |

## Building it once in Brevo

Brevo's drag and drop editor is where the typing happens. Build it once, save
it as a template, duplicate it every issue.

**Page**
- Background `#F8F1EF`
- Content block background `#FDFBFA`, width 560px, padding 32px 28px

**The band across the top**
- A 5px tall block, background `#D11371`, full content width

**Type**
- Eyebrow: Helvetica or Arial, 12px, bold, uppercase, letter spacing wide,
  colour `#D11371`
- Headline: Georgia italic, 30px, colour `#323232`
- Body: Georgia, 17px, line height 1.6, colour `#323232`
- Subheading: Helvetica or Arial, 13px, bold, uppercase, colour `#D11371`
- Signature: Georgia italic, 19px, colour `#D11371`
- Footer: Helvetica or Arial, 12px, colour `#8a7f7c`

**Buttons**
- Background `#D11371`, white text, 14px bold, uppercase, 3px corners,
  padding 14px 26px

**Rules and quotes**
- Hairline: 1px, `#E8D7D1`
- Pull quote: a 2px `#D11371` bar on the left, text Georgia italic 21px

Fraunces and Archivo are the website fonts. Email clients cannot be relied on
to load either, so Georgia and Helvetica stand in. They are the same fallbacks
the site already uses, so nothing looks wrong.

## Importing the HTML instead

Brevo takes an HTML template. That gives an exact match but the text is then
edited as code, not in boxes. Only worth it if the drag and drop version turns
out to look off.
