# -*- coding: utf-8 -*-
"""The workbook copy, page by page.

Edit the words here, then run build.py. Nothing else needs touching.

    {"b": "verbatim", "page": N}   a v3 page carried over word for word,
                                   drawn from pages.json
    everything else                laid out by the block engine in build.py

Field names are the handles the PDF uses. Keep them unique and do not rename
one after the file is out in the world, or a half-filled copy loses its answer.
"""

# The button on the last page points here. Change this line to change the link.
BOOKING_URL = "https://jaimiek.com/shop/ed50bdba-2100-4a38-81d4-36c8dba328cc"


def H1(text):
    return {"b": "h1", "text": text}


def KICKER(text):
    return {"b": "kicker", "text": text}


def LABEL(text):
    return {"b": "label", "text": text}


def TITLE(*lines):
    return {"b": "title", "lines": list(lines)}


def P(text):
    return {"b": "p", "text": text}


def LEAD(text):
    return {"b": "lead", "text": text}


def STRONG(text):
    return {"b": "strong", "text": text}


def SUBHEAD(text):
    return {"b": "subhead", "text": text}


def SMALL(text):
    return {"b": "small", "text": text}


def SPACE(h):
    return {"b": "space", "h": h}


def RULE(color="#888888"):
    return {"b": "rule", "color": color}


def BULLETS(*items):
    return {"b": "bullets", "items": list(items)}


def NUMBERS(*items):
    return {"b": "numbers", "items": list(items)}


def BOX(*blocks, **kw):
    return {"b": "box", "blocks": list(blocks), "pad": kw.get("pad", 14),
            "color": kw.get("color", "#888888")}


def BOXHEAD(text):
    return {"b": "boxhead", "text": text}


def BOXLINE(text, size=10.5):
    return {"b": "boxline", "text": text, "size": size}


def BOXBULLET(text):
    return {"b": "bullet", "text": text}


def FLOW(*steps):
    return {"b": "flow", "steps": list(steps)}


def PATH(*labels, **kw):
    return {"b": "path", "labels": list(labels), "size": kw.get("size", 10)}


def TABLE(rows, head=None, left_w=130):
    return {"b": "table", "rows": rows, "head": head, "left_w": left_w}


def TWOCOL(left_head, left_text, right_head, right_text):
    return {"b": "twocol", "left_head": left_head, "left_text": left_text,
            "right_head": right_head, "right_text": right_text}


def FIELD(label, name, tip, h=20, multiline=False, size=10, label_size=11,
          gap=14):
    return {"b": "field", "label": label, "name": name, "tip": tip, "h": h,
            "multiline": multiline, "size": size, "label_size": label_size,
            "gap": gap}


def LINEFIELD(label, name, tip, w=90, suffix=None, h=22):
    return {"b": "linefield", "label": label, "name": name, "tip": tip, "w": w,
            "suffix": suffix, "h": h}


def STATEMENT(num, text, name, tip):
    return {"b": "statement", "num": num, "text": text, "name": name, "tip": tip}


def CHOICE(label, name, tip, values, labels=None, gap=110, after=30):
    return {"b": "choice", "label": label, "name": name, "tip": tip,
            "values": values, "labels": labels, "gap": gap, "after": after}


def BUTTON(text, url=None, w=320, h=42):
    return {"b": "button", "text": text, "url": url, "w": w, "h": h}


def VERBATIM(page):
    return {"b": "verbatim", "page": page}


# --------------------------------------------------------------------------
# The ten diagnostic statements. Used twice: Chapter 4 and Worksheet 1.
# --------------------------------------------------------------------------

STATEMENTS = [
    "The roles I play every day feel chosen and current, not inherited or "
    "performed.",
    "My days are built around how my energy actually works, not around "
    "everyone else's needs first.",
    "My home looks like the woman I am now.",
    "My closest relationships feel chosen, not held together only by history "
    "or habit.",
    "My work feels like mine, not something I fell into and never re-chose.",
    "The way I dress and present myself feels like me.",
    "What I say out loud usually matches what I actually think.",
    "When I say yes, it is usually because I want to.",
    "My free time includes me, not only everyone else's leftovers.",
    "When I move through my day, the life I am living feels like mine.",
]

SHORT_TIPS = [
    "roles", "days", "home", "relationships", "work", "dress and present",
    "what I say out loud", "my yes", "free time", "the life itself",
]

KEY_LINE = ("1 = mostly inherited or automatic  ·  3 = mixed or unclear  "
            "·  5 = mostly chosen and current")


def statements(first, last, prefix):
    """Statement blocks first..last, numbered as in the guide."""
    out = []
    for i in range(first, last + 1):
        out.append(STATEMENT(
            "%d." % i, STATEMENTS[i - 1], "%s_%d" % (prefix, i),
            "Statement %d, %s. Choose 1 to 5" % (i, SHORT_TIPS[i - 1])))
    return out


MAP_AREAS = ["1. Roles", "2. Schedule", "3. Home", "4. Relationships",
             "5. Work", "6. Body", "7. Voice"]


def map_area(n):
    """One area of the Misalignment Map worksheet."""
    name = MAP_AREAS[n - 1]
    key = name.split(". ")[1].lower()
    return [
        SUBHEAD(name.upper()),
        FIELD("WHAT THIS LOOKS LIKE IN MY LIFE RIGHT NOW",
              "map_%s_now" % key,
              "%s: what this looks like in my life right now" % key.capitalize(),
              h=40, multiline=True, size=9, label_size=8.5, gap=10),
        FIELD("WHAT THIS WOULD LOOK LIKE IF IT WERE SHAPED BY ME",
              "map_%s_mine" % key,
              "%s: what this would look like if it were shaped by me"
              % key.capitalize(),
              h=40, multiline=True, size=9, label_size=8.5, gap=10),
        FIELD("THE SMALLEST GAP I CAN SEE", "map_%s_gap" % key,
              "%s: the smallest gap I can see" % key.capitalize(),
              h=20, size=9, label_size=8.5, gap=8),
        SPACE(8),
    ]


def receipts(piece, prefix):
    """One piece of Worksheet 2."""
    return [
        H1("WORKSHEET 2 · THE RECEIPTS · PIECE %d" % piece),
        FIELD("Area:", "%s_area" % prefix,
              "Piece %d: which of the seven areas this belongs to" % piece,
              h=22, gap=16),
        FIELD("The specific piece of my life this points to:",
              "%s_piece" % prefix,
              "Piece %d: the specific role, commitment, rule or relationship"
              % piece, h=90, multiline=True, gap=16),
        FIELD("When I first started doing it this way:", "%s_when" % prefix,
              "Piece %d: when you first started doing it this way" % piece,
              h=60, multiline=True, gap=16),
        FIELD("The source (person, season, place) I most likely got it from:",
              "%s_source" % prefix,
              "Piece %d: the person, season or place it came from" % piece,
              h=80, multiline=True, gap=16),
        FIELD("What I would do differently if it had never been handed to me:",
              "%s_different" % prefix,
              "Piece %d: what you would do differently" % piece,
              h=110, multiline=True, gap=16),
        CHOICE("Is this still right for me?", "%s_still_right" % prefix,
               "Piece %d: is this still right for me" % piece,
               ["Yes", "No", "NotSure"], labels=["Yes", "No", "Not sure"]),
    ]


# --------------------------------------------------------------------------
# The document, in order.
# --------------------------------------------------------------------------

DOCUMENT = [

    # 1 cover
    {"chrome": False, "blocks": [VERBATIM(1)]},

    # 2 before you start
    {"blocks": [
        H1("BEFORE YOU START"),
        P("You're not here because you forgot who you are. You're here because "
          "you built a life around the version of you that didn't know any "
          "better yet. And now the life doesn't fit."),
        P("You did everything you were supposed to do. Built the life, played "
          "the roles, kept going, held it together. And somewhere along the way "
          "you stopped feeling connected to the woman living it. Now it feels "
          "blah. You're performing instead of participating."),
        P("This isn't more inner work. You've done inner work. You've read the "
          "books, sat with the feelings, grown. That part is handled."),
        P("What hasn't been handled is the actual life. The roles. The "
          "schedule. The relationships. The work. The way you show up and "
          "speak. Those things were built by earlier versions of you, and they "
          "sit exactly where you built them until you go back in and move "
          "them."),
        P("That's what this workbook is. Going back in. Moving things."),
        SPACE(10),
        BOX(BOXLINE(
            "This guide is for noticing where your life no longer fits. It is "
            "not therapy, medical care, or a substitute for professional "
            "support. If what you are dealing with includes abuse, immediate "
            "safety concerns, addiction, trauma, depression, or a mental-health "
            "crisis, use this guide alongside appropriate professional support, "
            "not instead of it.", size=10)),
    ]},

    # 3 how to use this guide
    {"blocks": [
        H1("HOW TO USE THIS GUIDE"),
        P("This is a 7-day guided self-audit."),
        P("You are not meant to finish it in one sitting."),
        STRONG("Day 1:"),
        P("Read Part One. Complete the ten-minute diagnostic. Circle the places "
          "that feel least like you."),
        STRONG("Days 2 to 5:"),
        P("Read Part Two. Look at one area of your life at a time. Complete The "
          "Receipts and build your Misalignment Map."),
        STRONG("Day 6:"),
        P("Read Part Three. Pick one small move. Do it within 48 hours."),
        STRONG("Day 7 and after:"),
        P("Read Part Four after you have held the move for at least a week. Use "
          "the 30-Day Check to keep the map current."),
        SPACE(4),
        P("You finish this guide when one thing in your actual life has "
          "changed. Not a reinvention. Not a new you. One specific thing you "
          "can point to and say: that's mine now."),
        SPACE(6),
        BOX(BOXHEAD("BY THE END OF THIS GUIDE, YOU WILL HAVE:"),
            BOXBULLET("The areas of your life that feel least like you."),
            BOXBULLET("A completed Misalignment Map."),
            BOXBULLET("A clearer sense of what is yours and what was handed to "
                      "you."),
            BOXBULLET("One small move you can make in real life."),
            BOXBULLET("A way to check new advice before you build it into your "
                      "life.")),
        SPACE(16),
        FLOW(("SEE IT", "Notice where your life no longer feels like yours."),
             ("FIND IT", "Separate what you chose from what you absorbed."),
             ("MOVE IT", "Make one small change in real life."),
             ("STAY IN IT", "Keep checking that your life still looks like "
                            "you.")),
    ]},

    # 5 one thing before we start
    {"blocks": [VERBATIM(3)]},

    # 6 contents
    {"blocks": [
        H1("CONTENTS"),
        {"b": "toc", "items": [
            ("PART ONE — SEE IT", "part"),
            ("01. You didn't lose yourself. You left yourself out.", "plain"),
            ("02. How the misfit actually happened.", "plain"),
            ("03. The seven places it shows up.", "plain"),
            ("04. Where you are right now.", "plain"),
            ("PART TWO — FIND IT", "part"),
            ("05. Your voice vs. the voice you learned.", "plain"),
            ("06. The receipts.", "plain"),
            ("07. The Misalignment Map.", "plain"),
            ("PART THREE — MOVE IT", "part"),
            ("One Real Example", "plain"),
            ("08. Thinking about it won't move it.", "plain"),
            ("09. The one-move method.", "plain"),
            ("10. When 'you' feels blurry.", "plain"),
            ("PART FOUR — STAY IN IT", "part"),
            ("11. When you slip back into performing.", "plain"),
            ("12. The 30-day check.", "plain"),
            ("13. When advice tries to pull you out.", "plain"),
            ("14. The standard going forward.", "plain"),
            ("WORKSHEETS", "part"),
            ("The Diagnostic · The Receipts · The Misalignment Map "
             "· The One-Move Protocol · The 30-Day Check · "
             "The Advice Filter", "plain"),
        ]},
    ]},

    # 7-12 chapters one to three, unchanged
    {"blocks": [VERBATIM(5)]},
    {"blocks": [VERBATIM(6)]},
    {"blocks": [VERBATIM(7)]},
    {"blocks": [VERBATIM(8)]},
    {"blocks": [VERBATIM(9)]},
    {"blocks": [VERBATIM(10)]},

    # 13 chapter 4 opening
    {"blocks": [
        KICKER("CHAPTER 04"),
        TITLE("Where you are right now."),
        P("Ten questions. Ten minutes."),
        P("For each statement, give yourself a number from 1 to 5."),
        SPACE(6),
        BOX(BOXLINE("1 = This mostly feels inherited, automatic, or no longer "
                    "like me."),
            BOXLINE("3 = I'm not sure. Some of it fits. Some of it doesn't."),
            BOXLINE("5 = This mostly feels chosen, current, and like me.")),
        SPACE(8),
        P("There are no good or bad answers here. A low number does not mean "
          "you have failed. It only tells you where your life may need a closer "
          "look."),
        P("When you are finished, circle your three lowest numbers. Those are "
          "the places we will look at first."),
    ]},

    # 14 statements 1 to 5
    {"blocks": [
        LABEL("CHAPTER 04 · THE TEN STATEMENTS"),
        SMALL(KEY_LINE),
        SPACE(6),
    ] + statements(1, 5, "d")},

    # 15 statements 6 to 10, then the score
    {"blocks": [
        LABEL("CHAPTER 04 · THE TEN STATEMENTS · CONTINUED"),
        SMALL(KEY_LINE),
        SPACE(6),
    ] + statements(6, 10, "d") + [
        SPACE(4),
        LINEFIELD("My total:", "d_total", "Your total out of 50", w=70,
                  suffix="/ 50"),
        P("The three statements I scored lowest on:"),
        FIELD(None, "d_low1", "Lowest statement, first of three", h=28,
              multiline=True, gap=8),
        FIELD(None, "d_low2", "Lowest statement, second of three", h=28,
              multiline=True, gap=8),
        FIELD(None, "d_low3", "Lowest statement, third of three", h=28,
              multiline=True, gap=12),
        FIELD("The one or two map areas these point to:", "d_areas",
              "The one or two map areas your three lowest point to", h=28,
              multiline=True),
    ]},

    # 16 how to read what you wrote
    {"blocks": [
        H1("HOW TO READ WHAT YOU WROTE"),
        STRONG("40–50"),
        P("Most of your life still looks like you. Good. You do not need to "
          "pull apart everything. Use the rest of this guide on the one area "
          "that still feels off."),
        STRONG("25–39"),
        P("Some of your life is yours. Some of it is still running on an older "
          "version of you. This is the messy middle. The rest of this guide is "
          "built for this."),
        STRONG("10–24"),
        P("A lot of your life may be running on expectations, roles, or choices "
          "that no longer fit. This is not a judgment. It is useful "
          "information. You can see enough now to begin moving one thing at a "
          "time."),
        SPACE(8),
        STRONG("NOW LOOK AT YOUR THREE LOWEST NUMBERS."),
        P("Those are not three things you need to fix. They are the first three "
          "places you are going to examine."),
    ]},

    # 17 ten questions to seven areas
    {"blocks": [
        H1("HOW THE TEN QUESTIONS BECOME THE SEVEN AREAS"),
        P("The ten questions help you notice your life from a few different "
          "angles. The map gathers what you found into seven places."),
        SPACE(2),
        PATH("10 STATEMENTS", "7 AREAS", "1 MISALIGNMENT MAP", "1 SMALL MOVE",
             size=9.5),
        SPACE(4),
        TABLE([
            ("Roles", "The roles I play every day."),
            ("Schedule", "My days, my yes, and my free time."),
            ("Home", "My home."),
            ("Relationships", "My closest relationships."),
            ("Work", "My work."),
            ("Body", "The way I dress and present myself."),
            ("Voice", "What I say out loud and what I edit out."),
            ("The life itself", "Use this as your overall check. It may point "
                                "to more than one area."),
        ], head=("AREA", "THE STATEMENTS IT GATHERS")),
        P("If two low answers belong in the same area, keep them together."),
        P("For example: if “My days” and “My free time” are "
          "both low, they both belong under Schedule."),
        P("You are not looking for seven problems. You are looking for the one "
          "or two areas that feel loudest."),
    ]},

    # 18-21 chapters five and six, unchanged
    {"blocks": [VERBATIM(14)]},
    {"blocks": [VERBATIM(15)]},
    {"blocks": [VERBATIM(16)]},
    {"blocks": [VERBATIM(17)]},

    # 22 chapter 7, with the bridge paragraph added
    {"blocks": [
        KICKER("CHAPTER 07"),
        TITLE("The Misalignment Map."),
        P("This is the artifact. The piece of paper you'll be holding when this "
          "workbook ends."),
        P("On one page, you fill in seven boxes. One for each area. Each box "
          "has two halves."),
        P("The diagnostic gave you ten ways to notice the misfit. This map "
          "gathers what you found into the seven areas where it actually "
          "lives."),
        P("LEFT SIDE: What this looks like in my life right now."),
        P("RIGHT SIDE: What this would look like if it were shaped by me, not "
          "by what I absorbed."),
        P("The right side might look almost identical to the left. That's fine. "
          "It means this area is already you. The space between the two sides, "
          "across all seven areas, is the work."),
        P("A few things before you fill it in. The right side is not your "
          "fantasy version. Not the run-away-to-a-new-city version. It's the "
          "smallest, most honest answer to: what would I do here if no one had "
          "told me how?"),
        P("If you can't fill in the right side for an area, leave it blank. "
          "Chapter 10 is for that."),
        P("Don't change anything in your life yet. We're still seeing."),
        P("Do one area per sitting. Half an hour each. You'll have the full map "
          "within a week. Fill it in by hand if you can. Typing makes this feel "
          "like a planning exercise, and it isn't. This is closer to a "
          "confession than a spreadsheet."),
        P("When the map is complete, look at it for a long time. Don't analyze "
          "it. Just look."),
    ]},

    # 23 prompt, unchanged
    {"blocks": [VERBATIM(19)]},

    # 24 one real example
    {"blocks": [
        H1("ONE REAL EXAMPLE"),
        STRONG("Inherited rule:"),
        LEAD("“My schedule should stay open for everyone else.”"),
        SPACE(6),
        TWOCOL("WHAT IT LOOKS LIKE NOW",
               "I say yes to every request. Most evenings are spoken for. I "
               "have no time that belongs to me before someone else needs "
               "something.",
               "WHAT IT WOULD LOOK LIKE IF SHAPED BY ME",
               "One evening each week is left empty. I do not explain or "
               "apologize for protecting it."),
        SPACE(10),
        STRONG("The smallest move:"),
        P("I decline one Thursday obligation and leave the evening empty."),
        STRONG("What I am watching for:"),
        P("Does the empty space feel like relief, guilt, boredom, fear, or "
          "something else?"),
        STRONG("After seven days:"),
        P("I notice what changes when one part of the week is not built around "
          "everyone else."),
        RULE(),
        STRONG("YOUR TURN"),
        P("You do not need to start with the biggest gap. Start with the "
          "smallest honest thing you could move this week."),
    ]},

    # 25-26 chapter 8, unchanged
    {"blocks": [VERBATIM(20)]},
    {"blocks": [VERBATIM(21)]},

    # 27 chapter 9
    {"blocks": [
        KICKER("CHAPTER 09"),
        TITLE("The one-move method."),
        P("The protocol is small enough to fit inside a real week."),
        SPACE(2),
        NUMBERS(
            ("Look at the map.", None),
            ("Choose the smallest gap.",
             "Pick one item where the gap between LEFT and RIGHT is small. Not "
             "your biggest misalignment. Your smallest."),
            ("Pick a move that closes it by about 20 percent.",
             "Not 100. Twenty."),
            ("Schedule it within 48 hours.", None),
            ("Do it.", None),
            ("Hold it for seven days.", "Don't change anything else."),
            ("Return to the map.", None),
        ),
        P("Why this works. Most women try to reinvent, relocate, or "
          "burn-it-all-down their way to a life that fits."),
        P("Big changes are easy to promise and hard to hold. Most people go "
          "hard for a few weeks, then quietly return to the old shape."),
        P("Small is easier to keep. Repeatable is what changes a life. Move one "
          "thing and see what happens."),
        P("A few examples of small moves."),
        BULLETS(
            "Cancel the standing commitment you dread, and replace it with "
            "nothing",
            "Answer 'how are you' with the true answer, once, to one safe "
            "person",
            "Clear one shelf or drawer that belongs to a version of you that's "
            "gone",
            "Say no without an explanation attached. Once.",
            "Take back one hour on the calendar and put nothing in it",
            "Wear the thing you keep saving for a version of your life that "
            "never arrives",
            "Tell one person one true thing you've been editing out",
        ),
        P("Pick yours. Do it by Friday. Use Worksheet 4 in the back."),
    ]},

    # 29-38 chapters ten to fourteen, unchanged
    {"blocks": [VERBATIM(23)]},
    {"blocks": [VERBATIM(24)]},
    {"blocks": [VERBATIM(25)]},
    {"blocks": [VERBATIM(26)]},
    {"blocks": [VERBATIM(27)]},
    {"blocks": [VERBATIM(28)]},
    {"blocks": [VERBATIM(29)]},
    {"blocks": [VERBATIM(30)]},
    {"blocks": [VERBATIM(31)]},
    {"blocks": [VERBATIM(32)]},

    # 39 before you go. Self-contained: lift this whole page out and nothing
    # else in the guide changes.
    {"blocks": [
        H1("BEFORE YOU GO"),
        SUBHEAD("What the map can't do."),
        P("The map can show you what no longer fits. It can show you which "
          "roles, commitments, rules, and answers are still being run by an "
          "older version of you."),
        P("But sometimes the map gets you to a question it cannot answer "
          "alone:"),
        LEAD("“Okay. If I stop building around what isn't mine, what do I "
             "do now?”"),
        P("That is not a workbook question. That is a conversation."),
        RULE(),
        SUBHEAD("THE TRANSITION SESSION"),
        P("A private 75-minute session for the thing you cannot see clearly "
          "from inside it."),
        P("You bring the decision you keep circling, the role that no longer "
          "fits, the part of your life that has gone flat, or the feeling that "
          "something has changed and you cannot yet say what comes next."),
        P("Together, we name what no longer fits and find one move you are "
          "actually going to make."),
        P("You leave with:"),
        BULLETS(
            "A clearer sense of what no longer fits.",
            "One thing named out loud.",
            "One small move you are actually going to make.",
            "This guide to return to afterward.",
        ),
        P("One session. We name what no longer fits. One move you are actually "
          "going to make."),
        STRONG("75 minutes · $222"),
        SPACE(4),
        BUTTON("BOOK YOUR TRANSITION SESSION", BOOKING_URL),
    ]},

    # 40 worksheets divider
    {"blocks": [VERBATIM(34)]},

    # 41 worksheet 1, statements 1 to 5
    {"blocks": [
        H1("WORKSHEET 1 · THE DIAGNOSTIC"),
        SMALL(KEY_LINE),
        SPACE(6),
    ] + statements(1, 5, "w1")},

    # 42 worksheet 1, statements 6 to 10 and the score
    {"blocks": [
        LABEL("WORKSHEET 1 · THE DIAGNOSTIC · CONTINUED"),
        SMALL(KEY_LINE),
        SPACE(6),
    ] + statements(6, 10, "w1") + [
        SPACE(4),
        LINEFIELD("My total:", "w1_total", "Your total out of 50", w=70,
                  suffix="/ 50"),
        P("The three statements I scored lowest on:"),
        FIELD(None, "w1_low1", "Lowest statement, first of three", h=28,
              multiline=True, gap=8),
        FIELD(None, "w1_low2", "Lowest statement, second of three", h=28,
              multiline=True, gap=8),
        FIELD(None, "w1_low3", "Lowest statement, third of three", h=28,
              multiline=True, gap=12),
        FIELD("The one or two map areas these point to:", "w1_areas",
              "The one or two map areas your three lowest point to", h=28,
              multiline=True),
    ]},

    # 43-45 worksheet 2
    {"blocks": receipts(1, "r1")},
    {"blocks": receipts(2, "r2")},
    {"blocks": receipts(3, "r3")},

    # 46-48 worksheet 3, the map
    {"blocks": [
        H1("WORKSHEET 3 · THE MISALIGNMENT MAP"),
        P("Seven areas. The gap between what is there now and what would be "
          "yours, across all seven, is the work."),
        PATH("NOW", "THE GAP", "SHAPED BY ME"),
        SPACE(4),
    ] + map_area(1) + map_area(2) + map_area(3)},

    {"blocks": [
        LABEL("WORKSHEET 3 · THE MISALIGNMENT MAP · CONTINUED"),
        PATH("NOW", "THE GAP", "SHAPED BY ME"),
        SPACE(4),
    ] + map_area(4) + map_area(5) + map_area(6)},

    {"blocks": [
        LABEL("WORKSHEET 3 · THE MISALIGNMENT MAP · CONTINUED"),
        PATH("NOW", "THE GAP", "SHAPED BY ME"),
        SPACE(4),
    ] + map_area(7) + [
        SPACE(10),
        P("When the map is complete, look at it for a long time. Don't analyze "
          "it. Just look."),
    ]},

    # 49 worksheet 4
    {"blocks": [
        H1("WORKSHEET 4 · THE ONE-MOVE PROTOCOL"),
        LEAD("One small move. One week. Don't change anything else."),
        FIELD("This week's move:", "w4_move", "The one move you are making "
              "this week", h=64, multiline=True, gap=16),
        FIELD("Which area on the map this addresses:", "w4_area",
              "Which of the seven areas this move addresses", h=22, gap=16),
        FIELD("The smallest action that closes the gap by about 20 percent:",
              "w4_action", "The smallest action that closes the gap by about "
              "20 percent", h=70, multiline=True, gap=16),
        FIELD("By when:", "w4_when", "The day and time you will do it, within "
              "48 hours", h=22, gap=16),
        FIELD("What I'm leaving alone for the next seven days:", "w4_leave",
              "What you are leaving alone for the next seven days", h=64,
              multiline=True, gap=16),
        FIELD("Notes after seven days (what changed, what stayed, what I "
              "noticed):", "w4_notes", "Notes after seven days", h=86,
              multiline=True),
    ]},

    # 50 worksheet 5
    {"blocks": [
        H1("WORKSHEET 5 · THE 30-DAY CHECK"),
        LEAD("Ten minutes. Same day every month. Write the answers down."),
        FIELD("Date:", "w5_date", "The date you are doing this check", h=22,
              gap=16),
        FIELD("1. What I added to my life in the last 30 days:", "w5_added",
              "What you added to your life in the last 30 days", h=64,
              multiline=True, gap=16),
        FIELD("2. What looks like me:", "w5_mine", "Of those things, what looks "
              "like you", h=64, multiline=True, gap=16),
        FIELD("3. What got added because someone expected it and I reacted:",
              "w5_reacted", "What got added because someone expected it", h=64,
              multiline=True, gap=16),
        FIELD("4. What I want to move on the map this month:", "w5_move",
              "What you want to move on the map this month", h=64,
              multiline=True, gap=16),
        FIELD("5. What's actually closed now:", "w5_closed", "What is actually "
              "closed now", h=64, multiline=True),
    ]},

    # 51 worksheet 6
    {"blocks": [
        H1("WORKSHEET 6 · THE ADVICE FILTER"),
        LEAD("Run new advice through this before adopting it."),
        FIELD("The advice:", "w6_advice", "The advice you are weighing", h=80,
              multiline=True, gap=16),
        FIELD("Who it came from:", "w6_source", "Who the advice came from",
              h=22, gap=18),
        CHOICE("Does their life look like what mine wants to be?", "w6_life",
               "Does their life look like what yours wants to be",
               ["Yes", "No", "Unsure"], gap=100, after=34),
        CHOICE("Does adopting this close a gap on my map, or create one?",
               "w6_gap", "Does adopting this close a gap or create one",
               ["Close", "Create", "Unsure"], gap=100, after=34),
        FIELD("My decision:", "w6_decision", "Your decision", h=80,
              multiline=True, gap=16),
        SMALL("If close: adopt it. If create: let it go. If unsure: wait 72 "
              "hours and run the filter again before doing anything."),
    ]},

    # 52 the work continues
    {"blocks": [VERBATIM(43)]},
]
