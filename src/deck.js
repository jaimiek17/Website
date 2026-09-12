// The email that delivers the free deck when she subscribes.
//
// The copy here is mine, not Jaimie's. There was no brief for it, so it is
// written plainly and meant to be replaced with her own words. No em dashes.

var BASE  = 'https://jaimiekozyra.com';
var GUIDE = BASE + '/downloads/the-narrative-loom-companion-guide.pdf';

// The 44 cards are not on the site yet. Until a file is put here the deck
// email does not send, because the copy promises the cards and the guide and
// sending half of it is worse than sending nothing. Set this and it turns on.
var CARDS = null;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ready() {
  return Boolean(CARDS);
}

function button(label, href) {
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
         'style="margin:0 0 12px"><tr><td style="background:#323232;border-radius:2px">' +
         '<a href="' + href + '" style="display:inline-block;padding:13px 24px;' +
         'font:600 14px/1 Helvetica,Arial,sans-serif;letter-spacing:.06em;' +
         'color:#FAF6F4;text-decoration:none">' + esc(label) + '</a></td></tr></table>';
}

function render(firstName) {
  if (!ready()) return null;

  var p = function (text) {
    return '<p style="margin:0 0 20px;font:17px/1.6 Georgia,serif;color:#323232">' +
           text + '</p>';
  };

  var body = [
    p('Hi ' + esc(firstName || 'there') + ','),
    p('Here it is. 44 cards and the 28 page guide, yours to keep.'),
    button('The 44 cards', CARDS),
    button('The companion guide', GUIDE),
    p('Save both somewhere you will actually find them again. The links do not expire.'),
    p('If you have not used a deck like this before, the guide opens with three ways ' +
      'to pull. Start with the single card. One question is plenty.'),
    p('It does not tell you anything. It just keeps asking until you answer, and that ' +
      'turns out to be most of it.'),
    '<p style="margin:28px 0 20px;font:italic 19px/1.4 Georgia,serif;color:#323232">Jaimie</p>',
    p('I write twice a month. Hit reply any time, I read every one.')
  ].join('');

  var html =
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>The Narrative Loom</title></head>' +
    '<body style="margin:0;padding:0;background:#FAF6F4">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
    'style="width:100%;background:#FAF6F4"><tr><td align="center" style="padding:32px 16px">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
    'style="width:100%;max-width:560px;text-align:left">' +
    '<tr><td style="padding:0 0 24px">' +
    '<p style="margin:0 0 6px;font:600 12px/1 Helvetica,Arial,sans-serif;' +
    'letter-spacing:.18em;text-transform:uppercase;color:#8a8a8a">Start here</p>' +
    '<h1 style="margin:0;font:italic 30px/1.25 Georgia,serif;color:#323232">' +
    'The Narrative Loom</h1></td></tr>' +
    '<tr><td>' + body + '</td></tr>' +
    '<tr><td style="padding:28px 0 0;border-top:1px solid #E3D5D1">' +
    '<p style="margin:0;font:13px/1.6 Helvetica,Arial,sans-serif;color:#8a8a8a">' +
    'Jaimie Kozyra &middot; <a href="' + BASE + '" style="color:#8a8a8a">' +
    'jaimiekozyra.com</a><br>' +
    'You got this because you asked for the deck on my website.</p>' +
    '</td></tr></table></td></tr></table></body></html>';

  var text = 'Hi ' + (firstName || 'there') + ',\n\n' +
    'Here it is. 44 cards and the 28 page guide, yours to keep.\n\n' +
    'The 44 cards: ' + CARDS + '\n' +
    'The companion guide: ' + GUIDE + '\n\n' +
    'Save both somewhere you will actually find them again. The links do not ' +
    'expire.\n\nIf you have not used a deck like this before, the guide opens with ' +
    'three ways to pull. Start with the single card. One question is plenty.\n\n' +
    'It does not tell you anything. It just keeps asking until you answer, and ' +
    'that turns out to be most of it.\n\nJaimie\n\n' +
    'I write twice a month. Hit reply any time, I read every one.\n';

  return { subject: 'The Narrative Loom, yours to keep', html: html, text: text };
}

export { render, ready };
