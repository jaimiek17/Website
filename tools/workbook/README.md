# You Left Yourself Out, the workbook build

The source of the PDF lives here. v3 had no source, only the finished file, so
this is now the master. Edit here, rebuild, and the PDF comes out the same way
every time.

## Build

```
pip install reportlab pikepdf
python3 tools/workbook/build.py
```

Out come two files in `dist/`:

- `you-left-yourself-out.pdf` the fillable, tagged one you sell
- `you-left-yourself-out-print.pdf` same pages, plain ruled boxes instead of
  form fields, for anyone who wants to print it

It also rewrites `form-fields.md`, the list of every field in the file.

## Files

| File | What it is |
|---|---|
| `content.py` | all the copy, page by page. This is the one you edit |
| `pages.json` | the v3 pages that were carried over, as their original drawing instructions |
| `build.py` | the layout engine, the form fields and the tagging |
| `CHANGELOG.md` | what changed from v3 |
| `qc-report.md` | what was checked and what was not |
| `form-fields.md` | field name, type, tooltip, page |

## Changing things

**The booking link** is the first line of `content.py`.

**Copy** is in `DOCUMENT` at the bottom of `content.py`, in page order. A page
is a list of blocks. `P("...")` is a paragraph, `H1` a page heading, `FIELD` a
box someone types in, and so on. The helpers are all defined at the top of the
file.

**A carried-over page** looks like `VERBATIM(18)`. That is v3's page 18, drawn
exactly as it was. To change its words, replace the block with real copy blocks.

**Pages are checked as they build.** If a page runs past the bottom margin the
build stops and tells you which one, rather than quietly letting text fall off.

**Field names are permanent.** Rename one and any half-filled copy someone has
saved loses that answer.

The design numbers, margins, type sizes, leading and the pink, are read from the
v3 file and set at the top of `build.py`. Leave them alone unless the whole
guide is being redesigned.
