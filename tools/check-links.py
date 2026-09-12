#!/usr/bin/env python3
"""Check every internal link on the site, fragments included.

The earlier version of this stripped "#..." off the end before checking, which
is how four buttons pointing at a #free-deck anchor that did not exist stayed
broken. Fragments are the whole point now.
"""
import os, re, sys, glob

ROOT = 'public'
pages = sorted(glob.glob(ROOT + '/**/*.html', recursive=True))

ids = {}
for f in pages:
    src = open(f).read()
    ids[f] = set(re.findall(r'\bid="([^"]+)"', src))

def resolve(page, href):
    """Turn an href into (file on disk, fragment) or None for external."""
    if re.match(r'^(https?:|mailto:|tel:|data:)', href):
        return None
    path, _, frag = href.partition('#')
    if not path:
        return page, frag
    if path.startswith('/'):
        base = ROOT + path
    else:
        base = os.path.normpath(os.path.join(os.path.dirname(page), path))
    if base.endswith('/'):
        base += 'index.html'
    for cand in (base, base + '.html', os.path.join(base, 'index.html')):
        if os.path.isfile(cand):
            return cand, frag
    return 'MISSING:' + base, frag

problems = []
checked = 0
for page in pages:
    src = open(page).read()
    src = re.sub(r'<!--.*?-->', '', src, flags=re.S)   # skip the GA4 placeholder
    for href in re.findall(r'(?:href|src)="([^"]+)"', src):
        got = resolve(page, href.split('?')[0])
        if got is None:
            continue
        checked += 1
        target, frag = got
        if target.startswith('MISSING:'):
            problems.append('%s -> %s (no such file)' % (page, href))
        elif frag and frag not in ids.get(target, set()):
            problems.append('%s -> %s (no id="%s" in %s)' % (page, href, frag, target))

print('checked %d internal links across %d pages' % (checked, len(pages)))
if problems:
    print('\n%d problem(s):' % len(problems))
    for p in problems:
        print('  ' + p)
    sys.exit(1)
print('all internal links and fragments resolve')
