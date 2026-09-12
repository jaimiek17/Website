import re, html, json, sys

src = open('public/where-you-are.html').read()
LABELS = ['A year from now','Three words','Advice','What changed',
          'What matters','Small decisions','How long','Sorted out']

blocks = re.findall(r'data-step="([1-8])" hidden>(.*?)<button class="wya-back"', src, re.S)
if len(blocks) != 8:
    sys.exit('expected 8 question screens, found %d' % len(blocks))

qs = []
for step, blk in blocks:
    opts = re.findall(r'data-value="(\d)" data-text="([^"]*)"', blk)
    if len(opts) != 3:
        sys.exit('step %s has %d options' % (step, len(opts)))
    vals = [int(v) for v, _ in opts]
    if vals != [0, 1, 2]:
        sys.exit('step %s values are %s, expected 0,1,2' % (step, vals))
    qs.append([html.unescape(t) for _, t in opts])

out = json.dumps(qs, ensure_ascii=False, indent=2)
labels = json.dumps(LABELS, ensure_ascii=False, indent=2)

if len(sys.argv) > 1 and sys.argv[1] == '--check':
    cur = open('src/questions.js').read()
    ok = out in cur and labels in cur
    print('questions.js matches where-you-are.html' if ok else 'MISMATCH: regenerate src/questions.js')
    sys.exit(0 if ok else 1)

open('src/questions.js', 'w').write(
"""// Generated from public/where-you-are.html. Do not edit by hand.
// Regenerate after changing the questions, then run the --check mode to verify:
//   python3 tools/gen-questions.py
//
// The worker rebuilds each woman's answers from these, rather than trusting
// text posted by the browser. That way nothing an attacker types can end up
// inside an email sent from Jaimie's domain.

var LABELS = %s;

var OPTIONS = %s;

export { LABELS, OPTIONS };
""" % (labels, out))
print('wrote src/questions.js:', len(qs), 'questions,', sum(len(o) for o in qs), 'options')
