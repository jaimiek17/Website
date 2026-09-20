// The three outcome emails for the "Where you are" sorting tool.
//
// Jaimie's copy, verbatim from her brief. Do not rephrase, shorten or polish
// anything in here. No em dashes anywhere.

import { shell, button, signature, p as para, esc, PINK, INK, QUIET, HAIRLINE } from './mail.js';

var WORKBOOK = 'https://jaimiekozyra.com/you-left-yourself-out';
var DECK     = 'https://jaimiekozyra.com/narrative-loom#get';

var BANDS = {
  adjusting: {
    subject: "your answer: you're adjusting",
    head: 'You’re adjusting.',
    body: [
      { p: 'Something changed and you’re recalibrating around it. That’s real work and it’s tiring, and it isn’t the same thing as an identity transition.' },
      { p: 'Here’s how I can tell. You can still describe what you want. You can still rank what matters. Advice still lands. That means the part of you that sorts and decides came through this intact. It’s working harder than usual, but it’s working.' },
      { p: '<strong>Why that matters.</strong> Who you are is also how you decide. It runs in the background, sorting everything coming at you into matters and doesn’t matter, so fast you never notice. When that survives a hard thing, you can still steer. You’re just steering through weather.' },
      { p: 'Most women assume any big change is a transformation. A lot of the time it isn’t, and finding that out is a relief, because a plan actually works on an adjustment. It does nothing for the other thing.' },
      { p: '<strong>What I’d do with this.</strong> Pick the one area that’s loudest right now and make a plan for that one only. Not all of it. Your capacity is lower than usual and spreading it thin is what makes an adjustment feel like a collapse.' },
      { p: 'If you want the structured version of that, You Left Yourself Out is a $27 workbook that walks seven areas of your actual life one at a time and hands you a one-page map of which three or four are actually off. It’s built for exactly what you’re in, a structure problem, not a self problem. It’s the only thing I’ll point you at today.' },
      { btn: ['See the workbook', WORKBOOK] },
      { p: '<strong>One thing to watch.</strong> If in a few months you can no longer answer question one, come back and answer these again. Adjustments sometimes turn into the other thing, and it’s worth knowing when it happens.' },
      { sig: true },
      { p: 'Hit reply and tell me what’s going on. I read every one.' }
    ]
  },

  between: {
    subject: "your answer: you're somewhere in between",
    head: 'You’re somewhere in between.',
    body: [
      { p: 'Part of your sorting still works and part of it doesn’t. Read your own answers back and you’ll probably see it. Some of them came easily and some of them didn’t, and the split isn’t random.' },
      { p: '<strong>Why that happens.</strong> Who you are is also how you decide. It’s a filter, and it sorts everything into matters and doesn’t matter without you noticing. Sometimes a change takes the whole filter. More often it only takes part of it, and you’re left able to decide clearly about work and not about anyone you love. Or the reverse. The half that still works is what makes you think you should be able to handle the other half, and that’s the part that’s unfair.' },
      { p: '<strong>Here’s the useful thing.</strong> The areas where you still know what you want are the ones built by a version of you that’s still accurate. The areas where you can’t are the ones built by a version who isn’t running anymore. That’s the actual line, and it’s more specific than anything general I could tell you.' },
      { p: '<strong>What I’d do with this.</strong> Take the one area where you genuinely can’t say what you want, and stop making decisions in it for now. Not forever. Just stop treating the blank as a problem to solve this month. Then go and be competent in the areas that still work, because you are, and it’s evidence.' },
      { p: '<strong>What I’d watch for.</strong> Two things move you off this line. If the blank area starts spreading into the ones that were fine, that’s the front end of something bigger. If you start being able to describe what you want in the blank area, it’s closing. Give it a month and answer these eight again. Most people can’t tell which way it’s going from inside a single week.' },
      { p: 'If you want something to do in the meantime, the deck is free. 44 cards and a guide, one honest question at a time, and it’s built for exactly this. You don’t need a plan yet, you need contact with your own material.' },
      { btn: ['Get the deck', DECK] },
      { sig: true },
      { p: 'Hit reply and tell me which area went blank. I read every one, and it’s the thing I most want to know.' }
    ]
  },

  transition: {
    subject: "your answer: you're in a transition",
    head: 'You’re in a transition.',
    body: [
      { p: 'You can’t name what you’re moving toward. Not because you haven’t thought about it hard enough. Because it doesn’t exist yet.' },
      { p: '<strong>Here’s what’s actually happening.</strong>' },
      { p: 'Who you are is also how you decide. When someone asks if you want to do something, you don’t run a calculation, you already know. That’s your identity doing the work in the background, sorting everything into matters and doesn’t matter, so fast you never notice it.' },
      { p: 'Then something changed, and that version of you stopped being accurate.' },
      { p: 'The filter went with her.' },
      { p: 'So now nothing sorts. Someone asks what you want and there’s no quick answer, because the thing that used to produce the quick answer isn’t running. Someone gives you good advice and it slides off, because advice gets sorted by the same filter. Small decisions cost what big ones used to, because every one of them is being worked out from scratch.' },
      { p: 'You probably also find two opposite things true at the same time. I want to leave and I want to stay. I’m fine and I’m not. That’s the same thing showing up differently. With no filter, both sides stay equally weighted, and nothing breaks the tie.' },
      { p: '<strong>This isn’t indecision.</strong> Indecision is knowing what you want and not being able to commit. You don’t know what you want, because the part of you that knew isn’t there right now.' },
      { p: '<strong>You’re not lost. You’re without a filter.</strong>' },
      { p: 'This state has been documented for a hundred years. Anthropologists call it liminality. William Bridges called it the neutral zone. Psychologists measure it as a drop in self-concept clarity. It has a shape, it has a name, and it is not evidence that something is wrong with you.' },
      { p: '<strong>What I’d do with this.</strong> Stop trying to decide anything big. You can’t sort yet, and decisions made without a filter are usually somebody else’s decision wearing your name. Collect information about yourself instead. What you actually do with a free hour. What you say yes to and immediately regret.' },
      { p: '<strong>One warning.</strong> The pull right now is to grab the nearest available identity to make the discomfort stop. A program, a plan, a version of yourself somebody else is selling. It works right up until the first time it gets tested.' },
      { p: '<strong>Why I know this.</strong> I’m in one right now. Mine started with a divorce and then took nearly everything else with it. That’s not a credential, it’s just why I recognize this so fast in other people. I spent a long time thinking something was wrong with me before I understood it had a name.' },
      { p: 'That’s the whole answer. Read it twice if you want, then leave it alone for a few days.' },
      { sig: true },
      { p: 'Hit reply and tell me what your something was. I read every one.' },
      { p: 'One more thing, and I’m aware of the irony after what I just said about people selling you a version of yourself. The deck is free. 44 cards and a guide, one honest question at a time. It doesn’t tell you anything. It just keeps asking until you answer, and that’s about the only thing that’s any use right now.' },
      { btn: ['Get the deck', DECK] }
    ]
  }
};

// Her eight answers, one per line, as a quoted block in her pink.
function playback(answers) {
  var rows = answers.map(function (a) {
    return '<tr><td style="padding:0 0 12px;font:15px/1.5 Georgia,serif;color:' + INK + '">' +
           '<span style="font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.12em;' +
           'text-transform:uppercase;color:' + PINK + '">' + esc(a.label) + '</span><br>' +
           esc(a.text) + '</td></tr>';
  }).join('');
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
         'style="width:100%;margin:0 0 28px"><tr>' +
         '<td width="2" bgcolor="' + PINK + '" style="width:2px;background:' + PINK + '">&nbsp;</td>' +
         '<td style="padding:2px 0 2px 18px"><table role="presentation" cellpadding="0" ' +
         'cellspacing="0" border="0" style="width:100%">' + rows + '</table></td>' +
         '</tr></table>';
}

function render(tag, firstName, answers) {
  var band = BANDS[tag];
  if (!band) return null;

  var parts = [
    para('Hi ' + esc(firstName || 'there') + ','),
    para('Here\u2019s what your answers say.'),
    playback(answers)
  ];

  band.body.forEach(function (item) {
    if (item.btn) { parts.push(button(item.btn[0], item.btn[1])); return; }
    if (item.sig) { parts.push(signature()); return; }
    parts.push(para(item.p));
  });

  var html = shell({
    label: 'Where you are',
    head: band.head,
    body: parts.join(''),
    footnote: 'You got this because you answered the eight questions on my website. ' +
              'Unsubscribe any time.'
  });

  var text = 'Hi ' + (firstName || 'there') + ',\n\nHere\u2019s what your answers say.\n\n' +
    answers.map(function (a) { return a.label + '\n' + a.text; }).join('\n\n') +
    '\n\n' + band.body.map(function (item) {
      if (item.btn) return item.btn[0] + ': ' + item.btn[1];
      if (item.sig) return 'Jaimie';
      return item.p.replace(/<[^>]+>/g, '');
    }).join('\n\n') + '\n\nUnsubscribe any time.\n';

  return { subject: band.subject, html: html, text: text };
}

export { render, BANDS };
