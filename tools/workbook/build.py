#!/usr/bin/env python3
"""Build the YOU LEFT YOURSELF OUT workbook.

Two outputs, from one source:

    python3 tools/workbook/build.py

    dist/you-left-yourself-out.pdf         fillable, tagged, for screens
    dist/you-left-yourself-out-print.pdf   same pages, ruled boxes instead of
                                           form fields, for printing

The copy lives in content.py. Pages carried over from v3 unchanged live in
pages.json as their original drawing instructions, so they come out exactly as
they were. Everything else is laid out by the block engine below, using the
same measurements the original file used.
"""

import json
import os
import sys

from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import content as C  # noqa: E402

# ---------------------------------------------------------------- design ----

PAGE_W, PAGE_H = 612, 792
MARGIN_L, MARGIN_R = 54, 558
COL_W = MARGIN_R - MARGIN_L

INK = "#323232"
ACCENT = "#D11371"
GREY = "#888888"
LABEL_GREY = "#5E5E5E"   # grey that still passes contrast at small sizes
CREAM = "#F4EFE7"
FIELD_BG = "#FAF6F9"
FIELD_BC = "#888888"

BODY_SIZE = 11
BODY_LEAD = 17
PARA_GAP = 10

H1_SIZE = 22
H1_BASE = 715.4
TOP_BODY = 683.2
BOTTOM = 56

KICKER_BASE = 727.2
TITLE_SIZE = 26
TITLE_LEAD = 32
LABEL_BASE = 705.6

HEADER_RULE_Y = 752.4
FOOTER_RULE_Y = 39.6
FOOTER_TEXT_Y = 29

FONTS = {"F1": "Helvetica", "F2": "Helvetica-Bold", "F3": "Helvetica-Oblique"}
REG, BOLD, ITAL = FONTS["F1"], FONTS["F2"], FONTS["F3"]


def wrap(text, font, size, width):
    """Greedy wrap, the way the original file was set."""
    words, lines, line = text.split(), [], ""
    for w in words:
        trial = (line + " " + w).strip()
        if pdfmetrics.stringWidth(trial, font, size) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


# ----------------------------------------------------------------- writer ----


class Builder:
    def __init__(self, path, print_mode=False):
        self.print_mode = print_mode
        self.c = canvas.Canvas(path, pagesize=(PAGE_W, PAGE_H))
        self.c.setTitle("You Left Yourself Out")
        self.c.setAuthor("Jaimie Kozyra")
        self.c.setSubject("A 7-day guided self-audit")
        self.c.setKeywords("self-audit, workbook, Misalignment Map")
        self.page_no = 0
        self.mcid = 0
        self.struct = []       # [{page, mcid, role}]
        self.fields = []        # inventory rows
        self.group_tips = {}    # radio group name -> tooltip for the group
        self.y = TOP_BODY
        self.verbatim = json.load(open(os.path.join(HERE, "pages.json")))

    # -- page chrome -------------------------------------------------------

    def start_page(self, chrome=True):
        self.page_no += 1
        self.mcid = 0
        self.y = TOP_BODY
        if chrome:
            self._artifact_start()
            self.c.setStrokeColor(HexColor(ACCENT))
            self.c.setLineWidth(0.5)
            self.c.line(MARGIN_L, HEADER_RULE_Y, 180, HEADER_RULE_Y)
            self.c.line(MARGIN_L, FOOTER_RULE_Y, MARGIN_R, FOOTER_RULE_Y)
            self.c.setFillColor(HexColor(GREY))
            self.c.setFont(ITAL, 8)
            self.c.drawString(MARGIN_L, FOOTER_TEXT_Y, "YOU LEFT YOURSELF OUT")
            self.c.setFont(REG, 8)
            self.c.drawRightString(MARGIN_R, FOOTER_TEXT_Y, str(self.page_no))
            self._artifact_end()

    def end_page(self):
        self.c.showPage()

    def _artifact_start(self):
        self.c._code.append("/Artifact BMC")

    def _artifact_end(self):
        self.c._code.append("EMC")

    # -- primitives --------------------------------------------------------

    def draw_text(self, x, y, s, font=REG, size=BODY_SIZE, color=INK,
                  role="P", align="left"):
        self.c._code.append("/%s <</MCID %d>> BDC" % (role, self.mcid))
        self.struct.append({"page": self.page_no, "mcid": self.mcid, "role": role})
        self.mcid += 1
        self.c.setFillColor(HexColor(color))
        self.c.setFont(font, size)
        if align == "right":
            self.c.drawRightString(x, y, s)
        elif align == "center":
            self.c.drawCentredString(x, y, s)
        else:
            self.c.drawString(x, y, s)
        self.c._code.append("EMC")

    def draw_rule(self, y, x1=MARGIN_L, x2=MARGIN_R, color=GREY, width=0.5):
        self._artifact_start()
        self.c.setStrokeColor(HexColor(color))
        self.c.setLineWidth(width)
        self.c.line(x1, y, x2, y)
        self._artifact_end()

    def draw_box(self, x, y, w, h, color=GREY, width=0.5, fill=None):
        self._artifact_start()
        self.c.setStrokeColor(HexColor(color))
        self.c.setLineWidth(width)
        if fill:
            self.c.setFillColor(HexColor(fill))
            self.c.rect(x, y, w, h, stroke=1, fill=1)
        else:
            self.c.rect(x, y, w, h, stroke=1, fill=0)
        self._artifact_end()

    def check_room(self, needed):
        if self.y - needed < BOTTOM:
            raise RuntimeError(
                "page %d overflows: needs %.0fpt, has %.0fpt"
                % (self.page_no, needed, self.y - BOTTOM))

    # -- form fields -------------------------------------------------------

    def text_field(self, name, tip, x, y, w, h, multiline=False, size=10):
        self.fields.append({"name": name, "type": "Text (multiline)" if multiline
                            else "Text", "tooltip": tip, "page": self.page_no})
        if self.print_mode:
            self.draw_box(x, y, w, h, color=GREY, width=0.5)
            return
        self.c.acroForm.textfield(
            name=name, tooltip=tip, x=x, y=y, width=w, height=h,
            borderStyle="solid", borderWidth=0.5,
            borderColor=HexColor(FIELD_BC), fillColor=HexColor(FIELD_BG),
            textColor=HexColor(INK), forceBorder=True,
            fontName="Helvetica", fontSize=size, maxlen=None,
            fieldFlags="multiline" if multiline else "",
        )

    def radio_group(self, name, tip, values, x, y, size, gap,
                    labels=None, label_size=11):
        """One group, one answer. Labels sit beside each button."""
        labels = labels or values
        self.fields.append({"name": name, "type": "Radio group (%s)" % "/".join(values),
                            "tooltip": tip, "page": self.page_no})
        self.group_tips[name] = tip
        for i, v in enumerate(values):
            bx = x + i * gap
            if self.print_mode:
                self._artifact_start()
                self.c.setStrokeColor(HexColor(INK))
                self.c.setLineWidth(0.7)
                self.c.circle(bx + size / 2.0, y + size / 2.0, size / 2.0,
                              stroke=1, fill=0)
                self._artifact_end()
            else:
                self.c.acroForm.radio(
                    name=name, tooltip="%s: %s" % (tip, labels[i]), value=v,
                    x=bx, y=y, size=size, selected=False,
                    buttonStyle="circle", shape="circle",
                    borderStyle="solid", borderWidth=0.8,
                    borderColor=HexColor(INK), fillColor=HexColor("#FFFFFF"),
                    textColor=HexColor(ACCENT), forceBorder=True,
                    fieldFlags="radio noToggleToOff",
                )
            self.draw_text(bx + size + 5, y + (size - label_size) / 2.0 + 1.5,
                           labels[i], REG, label_size, INK, role="Span")

    # -- blocks ------------------------------------------------------------

    def render(self, blocks):
        for b in blocks:
            getattr(self, "_b_" + b["b"])(b)

    def _b_h1(self, b):
        self.y = H1_BASE
        lines = wrap(b["text"], BOLD, H1_SIZE, COL_W)
        for line in lines:
            self.draw_text(MARGIN_L, self.y, line, BOLD, H1_SIZE, INK, role="H1")
            self.y -= 26
        self.y = TOP_BODY - 26 * (len(lines) - 1)

    def _b_kicker(self, b):
        self.y = KICKER_BASE
        self.draw_text(MARGIN_L, self.y, b["text"], REG, 11, ACCENT, role="H2")

    def _b_label(self, b):
        self.y = LABEL_BASE
        self.draw_text(MARGIN_L, self.y, b["text"], ITAL, 8, LABEL_GREY, role="H2")
        self.y = TOP_BODY

    def _b_title(self, b):
        y = 690.2
        for line in b["lines"]:
            self.draw_text(MARGIN_L, y, line, BOLD, TITLE_SIZE, INK, role="H1")
            y -= TITLE_LEAD
        self.y = y - 15

    def _b_p(self, b):
        self._para(b["text"], REG, BODY_SIZE, INK)

    def _b_lead(self, b):
        self._para(b["text"], ITAL, BODY_SIZE, INK)

    def _b_strong(self, b):
        self._para(b["text"], BOLD, BODY_SIZE, INK)

    def _b_small(self, b):
        self._para(b["text"], REG, 9.5, LABEL_GREY, lead=13)

    def _b_subhead(self, b):
        self.y -= 4
        self._para(b["text"], BOLD, 12, INK, lead=15)

    def _para(self, text, font, size, color, lead=BODY_LEAD, width=COL_W,
              x=MARGIN_L, role="P", gap=PARA_GAP):
        lines = wrap(text, font, size, width)
        self.check_room(len(lines) * lead + gap)
        for line in lines:
            self.draw_text(x, self.y, line, font, size, color, role=role)
            self.y -= lead
        self.y -= gap

    def _b_space(self, b):
        self.y -= b["h"]

    def _b_rule(self, b):
        self.y -= 6
        self.draw_rule(self.y, color=b.get("color", GREY))
        self.y -= 14

    def _b_bullets(self, b):
        for item in b["items"]:
            lines = wrap(item, REG, BODY_SIZE, COL_W - 16)
            self.check_room(len(lines) * BODY_LEAD + 4)
            self.draw_text(MARGIN_L + 2, self.y, "·", REG, BODY_SIZE, ACCENT,
                           role="Span")
            for i, line in enumerate(lines):
                self.draw_text(MARGIN_L + 16, self.y, line, REG, BODY_SIZE, INK,
                               role="LBody")
                self.y -= BODY_LEAD
            self.y -= 4
        self.y -= 6

    def _b_numbers(self, b):
        for i, item in enumerate(b["items"], 1):
            head, detail = item if isinstance(item, (list, tuple)) else (item, None)
            self.check_room(BODY_LEAD + (BODY_LEAD if detail else 0) + 6)
            self.draw_text(MARGIN_L, self.y, "%d." % i, BOLD, BODY_SIZE, ACCENT,
                           role="Span")
            for line in wrap(head, BOLD, BODY_SIZE, COL_W - 24):
                self.draw_text(MARGIN_L + 24, self.y, line, BOLD, BODY_SIZE, INK,
                               role="LBody")
                self.y -= BODY_LEAD
            if detail:
                for line in wrap(detail, REG, BODY_SIZE, COL_W - 24):
                    self.draw_text(MARGIN_L + 24, self.y, line, REG, BODY_SIZE, INK,
                                   role="LBody")
                    self.y -= BODY_LEAD
            self.y -= 6
        self.y -= 4

    def _b_box(self, b):
        """Thin bordered box. Measured first, then drawn behind the text."""
        pad = b.get("pad", 14)
        inner = COL_W - 2 * pad
        height = pad
        measured = []
        for sub in b["blocks"]:
            if sub["b"] == "boxhead":
                lines = wrap(sub["text"], BOLD, 11, inner)
                measured.append((sub, lines, BOLD, 11, 15))
                height += len(lines) * 15 + 8
            elif sub["b"] == "bullet":
                lines = wrap(sub["text"], REG, 10.5, inner - 14)
                measured.append((sub, lines, REG, 10.5, 14))
                height += len(lines) * 14 + 4
            else:
                size = sub.get("size", 10.5)
                lines = wrap(sub["text"], REG, size, inner)
                measured.append((sub, lines, REG, size, 14))
                height += len(lines) * 14 + 8
        height += pad - 5
        self.check_room(height + 12)
        top = self.y + 11
        self.draw_box(MARGIN_L, top - height, COL_W, height,
                      color=b.get("color", GREY), width=0.5, fill=b.get("fill"))
        self.y = top - pad - 7
        for sub, lines, font, size, lead in measured:
            for i, line in enumerate(lines):
                x = MARGIN_L + pad + (14 if sub["b"] == "bullet" else 0)
                if sub["b"] == "bullet" and i == 0:
                    self.draw_text(MARGIN_L + pad + 2, self.y, "·", REG, size,
                                   ACCENT, role="Span")
                self.draw_text(x, self.y, line, font, size,
                               INK if sub["b"] != "small" else GREY,
                               role="H3" if sub["b"] == "boxhead" else "P")
                self.y -= lead
            self.y -= 8 if sub["b"] != "bullet" else 4
        self.y = top - height - 16

    def _b_flow(self, b):
        """Four connected boxes: SEE IT > FIND IT > MOVE IT > STAY IN IT."""
        steps = b["steps"]
        n = len(steps)
        arrow = 16
        bw = (COL_W - arrow * (n - 1)) / float(n)
        body_lines = [wrap(d, REG, 9, bw - 16) for _, d in steps]
        bh = 30 + max(len(l) for l in body_lines) * 12
        self.check_room(bh + 18)
        top = self.y + 8
        for i, (head, detail) in enumerate(steps):
            x = MARGIN_L + i * (bw + arrow)
            self.draw_box(x, top - bh, bw, bh, color=GREY, width=0.5)
            self.draw_text(x + bw / 2.0, top - 20, head, BOLD, 10.5, INK,
                           role="H3", align="center")
            yy = top - 36
            for line in body_lines[i]:
                self.draw_text(x + bw / 2.0, yy, line, REG, 9, INK, role="P",
                               align="center")
                yy -= 12
            if i < n - 1:
                self.draw_text(x + bw + arrow / 2.0, top - bh / 2.0 - 4,
                               "→", BOLD, 12, ACCENT, role="Span",
                               align="center")
        self.y = top - bh - 18

    def _b_path(self, b):
        """One line of labels joined by arrows, e.g. 10 STATEMENTS > 7 AREAS."""
        labels = b["labels"]
        size = b.get("size", 10)
        gap = 14
        widths = [pdfmetrics.stringWidth(l, BOLD, size) for l in labels]
        arrow_w = pdfmetrics.stringWidth("→", BOLD, size)
        total = sum(widths) + (len(labels) - 1) * (arrow_w + 2 * gap)
        x = MARGIN_L + (COL_W - total) / 2.0
        self.check_room(size + 18)
        y = self.y
        for i, l in enumerate(labels):
            self.draw_text(x, y, l, BOLD, size, INK, role="Span")
            x += widths[i]
            if i < len(labels) - 1:
                self.draw_text(x + gap, y, "→", BOLD, size, ACCENT, role="Span")
                x += arrow_w + 2 * gap
        self.y -= size + 16

    def _b_table(self, b):
        """Two columns, thin rules, no fills."""
        left_w = b.get("left_w", 130)
        head = b.get("head")
        rows = b["rows"]
        self.y -= 2
        if head:
            self.check_room(20)
            self.draw_text(MARGIN_L, self.y, head[0], BOLD, 9, LABEL_GREY,
                           role="TH")
            self.draw_text(MARGIN_L + left_w, self.y, head[1], BOLD, 9,
                           LABEL_GREY, role="TH")
            self.y -= 8
            self.draw_rule(self.y, color=GREY, width=0.5)
            self.y -= 15
        for left, right in rows:
            lines = wrap(right, REG, 10.5, COL_W - left_w)
            self.check_room(len(lines) * 14 + 10)
            self.draw_text(MARGIN_L, self.y, left, BOLD, 10.5, INK, role="TD")
            for line in lines:
                self.draw_text(MARGIN_L + left_w, self.y, line, REG, 10.5, INK,
                               role="TD")
                self.y -= 14
            self.y -= 4
            self.draw_rule(self.y + 4, color="#DDDDDD", width=0.4)
            self.y -= 6
        self.y -= 6

    def _b_twocol(self, b):
        """Side by side comparison, one thin divider."""
        gap = 24
        cw = (COL_W - gap) / 2.0
        left_lines = wrap(b["left_text"], REG, 10.5, cw)
        right_lines = wrap(b["right_text"], REG, 10.5, cw)
        rows = max(len(left_lines), len(right_lines))
        self.check_room(rows * 14 + 40)
        top = self.y
        self.draw_text(MARGIN_L, top, b["left_head"], BOLD, 9, LABEL_GREY,
                       role="TH")
        self.draw_text(MARGIN_L + cw + gap, top, b["right_head"], BOLD, 9,
                       LABEL_GREY, role="TH")
        self.draw_rule(top - 8, color=GREY, width=0.5)
        y = top - 24
        for line in left_lines:
            self.draw_text(MARGIN_L, y, line, REG, 10.5, INK, role="TD")
            y -= 14
        y = top - 24
        for line in right_lines:
            self.draw_text(MARGIN_L + cw + gap, y, line, REG, 10.5, INK, role="TD")
            y -= 14
        self._artifact_start()
        self.c.setStrokeColor(HexColor("#DDDDDD"))
        self.c.setLineWidth(0.4)
        self.c.line(MARGIN_L + cw + gap / 2.0, top - 14,
                    MARGIN_L + cw + gap / 2.0, top - 24 - rows * 14 + 8)
        self._artifact_end()
        self.y = top - 24 - rows * 14 - 8

    def _b_linefield(self, b):
        """A label with its field on the same line."""
        label_w = pdfmetrics.stringWidth(b["label"], BOLD, 11) + 10
        h = b.get("h", 22)
        self.check_room(h + 12)
        self.draw_text(MARGIN_L, self.y - h + 8, b["label"], BOLD, 11, INK, role="P")
        self.text_field(b["name"], b["tip"], MARGIN_L + label_w, self.y - h + 2,
                        b.get("w", 90), h, size=b.get("size", 11))
        if b.get("suffix"):
            self.draw_text(MARGIN_L + label_w + b.get("w", 90) + 8, self.y - h + 8,
                           b["suffix"], REG, 11, INK, role="Span")
        self.y -= h + 14

    def _b_field(self, b):
        label = b.get("label")
        h = b.get("h", 20)
        if label:
            self.check_room(h + 26)
            self.draw_text(MARGIN_L, self.y, label, b.get("font", REG),
                           b.get("label_size", 11), INK, role="P")
            self.y -= b.get("label_gap", 6)
        else:
            self.check_room(h + 10)
        self.text_field(b["name"], b["tip"], MARGIN_L, self.y - h, COL_W, h,
                        multiline=b.get("multiline", False), size=b.get("size", 10))
        self.y -= h + b.get("gap", 14)

    def _b_statement(self, b):
        """A diagnostic statement with its own 1 to 5 group."""
        lines = wrap(b["text"], REG, BODY_SIZE, COL_W - 22)
        self.check_room(len(lines) * BODY_LEAD + 50)
        self.draw_text(MARGIN_L, self.y, b["num"], BOLD, BODY_SIZE, ACCENT,
                       role="Span")
        for line in lines:
            self.draw_text(MARGIN_L + 22, self.y, line, REG, BODY_SIZE, INK, role="P")
            self.y -= BODY_LEAD
        self.y -= 2
        self.radio_group(b["name"], b["tip"], ["1", "2", "3", "4", "5"],
                         MARGIN_L + 22, self.y - 18, 18, 58)
        self.y -= 48

    def _b_choice(self, b):
        """Yes / No / Not sure, one answer."""
        self.check_room(46)
        self.draw_text(MARGIN_L, self.y, b["label"], REG, BODY_SIZE, INK, role="P")
        self.y -= 24
        self.radio_group(b["name"], b["tip"], b["values"], MARGIN_L, self.y, 16,
                         b.get("gap", 110), labels=b.get("labels"))
        self.y -= b.get("after", 30)

    def _b_button(self, b):
        """The one link in the file."""
        w, h = b.get("w", 300), b.get("h", 40)
        x = MARGIN_L + (COL_W - w) / 2.0
        self.check_room(h + 20)
        top = self.y
        self.draw_box(x, top - h, w, h, color=ACCENT, width=1.2, fill=ACCENT)
        self.draw_text(x + w / 2.0, top - h + 14, b["text"], BOLD, 12, "#FFFFFF",
                       role="Span", align="center")
        if b.get("url"):
            self.c.linkURL(b["url"], (x, top - h, x + w, top), relative=0,
                           thickness=0)
        self.y = top - h - 18

    def _b_toc(self, b):
        """Contents list. Accent for the parts, ink for the rest."""
        for text, style in b["items"]:
            lines = wrap(text, REG, BODY_SIZE, COL_W)
            self.check_room(len(lines) * BODY_LEAD + 6)
            for line in lines:
                self.draw_text(MARGIN_L, self.y, line,
                               BOLD if style == "part" else REG, BODY_SIZE,
                               ACCENT if style == "part" else INK,
                               role="H2" if style == "part" else "P")
                self.y -= BODY_LEAD
            self.y -= 6

    def _b_verbatim(self, b):
        """Draw a v3 page exactly as it was."""
        for it in self.verbatim[str(b["page"])]:
            if it["t"] == "text":
                role = "H1" if it["size"] >= 20 else (
                    "H2" if it["color"] == ACCENT and it["size"] <= 12 else "P")
                self.draw_text(it["x"], it["y"], it["text"], FONTS[it["font"]],
                               it["size"], it["color"], role=role)
            elif it["t"] == "line":
                self.draw_rule(it["y1"], it["x1"], it["x2"], it["color"], it["w"])
            elif it["t"] == "rect":
                self._artifact_start()
                self.c.setLineWidth(it["lw"])
                self.c.setStrokeColor(HexColor(it["stroke"]))
                self.c.setFillColor(HexColor(it["fill"]))
                fill = 1 if it["op"] in ("f", "f*", "B") else 0
                stroke = 1 if it["op"] in ("S", "B") else 0
                self.c.rect(it["x"], it["y"], it["w"], it["h"], stroke=stroke,
                            fill=fill)
                self._artifact_end()

    # -- save --------------------------------------------------------------

    def save(self):
        self.c.save()


# ------------------------------------------------------------------ tags ----


def add_tags(path, builder):
    """Give the file a structure tree, a language and a title.

    Readers and screen readers use this to know a heading from a paragraph and
    to read the form fields in the right order.
    """
    import pikepdf
    from pikepdf import Array, Dictionary, Name, String

    pdf = pikepdf.open(path, allow_overwriting_input=True)
    pages = list(pdf.pages)

    struct_root = pdf.make_indirect(Dictionary(Type=Name.StructTreeRoot))
    doc_elem = pdf.make_indirect(Dictionary(
        Type=Name.StructElem, S=Name.Document, P=struct_root, K=Array()))
    struct_root.K = doc_elem

    by_page = {}
    for rec in builder.struct:
        by_page.setdefault(rec["page"], {})[rec["mcid"]] = rec["role"]
    nums = []
    next_annot_key = len(pages)
    for pno, page in enumerate(pages, 1):
        page_obj = page.obj
        mcid_map = by_page.get(pno, {})
        kids = Array()
        for mcid in range(max(mcid_map) + 1 if mcid_map else 0):
            role = mcid_map.get(mcid, "P")
            elem = pdf.make_indirect(Dictionary(
                Type=Name.StructElem, S=Name("/" + role), P=doc_elem, Pg=page_obj,
                K=mcid))
            doc_elem.K.append(elem)
            kids.append(elem)
        page_obj.StructParents = pno - 1
        nums.extend([pno - 1, pdf.make_indirect(kids)])

        for annot in page_obj.get("/Annots") or []:
            is_link = annot.get("/Subtype") == Name.Link
            alt = str(annot.get("/TU") or "")
            if not alt and "/Parent" in annot:
                alt = str(annot.Parent.get("/TU") or "")
            elem = pdf.make_indirect(Dictionary(
                Type=Name.StructElem, S=Name.Link if is_link else Name.Form,
                P=doc_elem, Pg=page_obj,
                K=Dictionary(Type=Name.OBJR, Obj=annot)))
            if alt:
                elem.Alt = String(alt)
            doc_elem.K.append(elem)
            annot.StructParent = next_annot_key
            nums.extend([next_annot_key, elem])
            next_annot_key += 1
        page_obj.Tabs = Name.S

    acro = pdf.Root.get("/AcroForm")
    if acro is not None:
        for field in acro.get("/Fields") or []:
            tip = builder.group_tips.get(str(field.get("/T") or ""))
            if tip and "/Kids" in field:
                field.TU = String(tip)

    struct_root.ParentTree = pdf.make_indirect(Dictionary(Nums=Array(nums)))
    struct_root.ParentTreeNextKey = next_annot_key
    pdf.Root.StructTreeRoot = struct_root
    pdf.Root.MarkInfo = Dictionary(Marked=True)
    pdf.Root.Lang = String("en-CA")
    pdf.Root.ViewerPreferences = Dictionary(DisplayDocTitle=True)
    if "/AcroForm" in pdf.Root:
        # Left false on purpose: ReportLab writes its own appearance streams,
        # and readers that regenerate them tend to drop the field borders.
        pdf.Root.AcroForm.NeedAppearances = False
    with pdf.open_metadata() as meta:
        meta["dc:title"] = "You Left Yourself Out"
        meta["dc:creator"] = ["Jaimie Kozyra"]
        meta["dc:description"] = "A 7-day guided self-audit"
        meta["dc:language"] = ["en-CA"]
    pdf.save(path)
    pdf.close()


# ------------------------------------------------------------------ main ----


def build(path, print_mode):
    b = Builder(path, print_mode=print_mode)
    for page in C.DOCUMENT:
        b.start_page(chrome=page.get("chrome", True))
        b.render(page["blocks"])
        b.end_page()
    b.save()
    add_tags(path, b)
    return b


def main():
    out_dir = os.path.join(HERE, "dist")
    os.makedirs(out_dir, exist_ok=True)
    screen = os.path.join(out_dir, "you-left-yourself-out.pdf")
    printable = os.path.join(out_dir, "you-left-yourself-out-print.pdf")

    b = build(screen, print_mode=False)
    build(printable, print_mode=True)

    with open(os.path.join(HERE, "form-fields.md"), "w") as fh:
        fh.write("# Form fields\n\n")
        fh.write("Generated by build.py. %d fields.\n\n" % len(b.fields))
        fh.write("| Page | Field name | Type | Tooltip |\n|---|---|---|---|\n")
        for f in b.fields:
            fh.write("| %d | `%s` | %s | %s |\n"
                     % (f["page"], f["name"], f["type"], f["tooltip"]))
    print("%d pages, %d fields" % (b.page_no, len(b.fields)))
    print(screen)
    print(printable)


if __name__ == "__main__":
    main()
