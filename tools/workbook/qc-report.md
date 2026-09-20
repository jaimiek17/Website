# Quality control

Run against `dist/you-left-yourself-out.pdf`, 50 pages, 86 fields.

## Checked and passing

| Check | Result |
|---|---|
| Every field has a unique, meaningful name | 86 of 86 |
| Every field has a tooltip | 86 of 86, none empty |
| Radio groups allow one answer only | 25 of 25 carry the radio and no-toggle-off flags |
| Diagnostic groups have exactly five options | 20 groups, values 1 to 5 |
| Multiline where a longer answer is expected | 45 fields |
| Tab order top to bottom, left to right | correct on all 50 pages, `/Tabs /S` set |
| Text is searchable | all copy extracts as text, no images of words |
| Tagged | structure tree present, 947 elements, headings, paragraphs, table cells, list bodies and form fields |
| Document language | en-CA |
| Document title shown in the title bar | "You Left Yourself Out" |
| Links | one link, the booking button, resolves to your store page |
| Can be filled and saved | filled, saved, reopened, values still there |
| Typed text is dark and readable | ink #323232 on a near-white field |
| Small grey text passes contrast | darkened to #5E5E5E, about 6.5:1 on white |
| Nothing relies on colour alone | selected buttons show a filled dot, not just a colour |
| Prints cleanly as it is | field boxes print as outlines, no separate print file needed |
| v3 pages carried over unchanged | all 24 compared against the original, no differences |
| Banned words | none added; three v3 instances left in place, listed in CHANGELOG.md |

## Where it was tested

Rendered and form-filled through PDFium, the engine Chrome and Edge use, at
every page. Fill-and-save was tested by writing values in, saving, and reading
them back.

Not tested, because I cannot install them here: Adobe Acrobat Reader on desktop,
Apple Preview, and phone readers. Nothing in the file is unusual for those
readers, but check one page in Acrobat and one on your phone before you sell it.

## Two things worth knowing

**No auto-calculated total.** It needs JavaScript inside the PDF, which is dead
in Apple Preview, Chrome and most phone readers. The total is a plain field you
type into, as your brief allowed.

**Filling on a phone depends on the app.** Adobe Acrobat Reader and Apple Files
let her fill and save. Gmail and Google Drive previews are view-only, for any
PDF. Nothing in this file changes that.
