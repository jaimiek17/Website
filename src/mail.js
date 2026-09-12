// One shell for every email the site sends, so the five of them cannot drift
// apart. Brand colours are the same tokens the site uses.
//
// Email clients are not browsers. Layout is tables, colours are inline, and
// the gradient carries a solid colour underneath it for the clients that will
// not render one. No em dashes anywhere.

var PINK     = '#D11371';   // the middle of the foil, used solid
var FOIL     = 'linear-gradient(100deg,#A50E56 0%,#D11371 35%,#DA2C80 50%,#D11371 65%,#A50E56 100%)';
var INK      = '#323232';
var BLUSH    = '#F8F1EF';
var PAPER    = '#FDFBFA';
var QUIET    = '#8a7f7c';
var HAIRLINE = '#E8D7D1';
var BASE     = 'https://jaimiekozyra.com';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function p(text) {
  return '<p style="margin:0 0 20px;font:17px/1.6 Georgia,serif;color:' + INK + '">' +
         text + '</p>';
}

function button(label, href) {
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
         'style="margin:0 0 12px"><tr>' +
         '<td bgcolor="' + PINK + '" style="background:' + PINK + ';' +
         'background-image:' + FOIL + ';border-radius:3px">' +
         '<a href="' + href + '" style="display:inline-block;padding:14px 26px;' +
         'font:600 14px/1 Helvetica,Arial,sans-serif;letter-spacing:.06em;' +
         'color:#FFFFFF;text-decoration:none">' + esc(label) + '</a>' +
         '</td></tr></table>';
}

function signature() {
  return '<p style="margin:28px 0 20px;font:italic 19px/1.4 Georgia,serif;color:' +
         PINK + '">Jaimie</p>';
}

// A quiet line under the divider. The unsubscribe lives here rather than in
// the body, so it reads as a fact and not as an offer.
function shell(opts) {
  var head = esc(opts.head);
  var foot = opts.footnote ? '<br>' + opts.footnote : '';

  return '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="light only">' +
    '<title>' + head + '</title></head>' +
    '<body style="margin:0;padding:0;background:' + BLUSH + '">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
    'width="100%" bgcolor="' + BLUSH + '" style="background:' + BLUSH + '">' +
    '<tr><td align="center" style="padding:28px 16px 40px">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
    'style="width:100%;max-width:560px;text-align:left">' +

    // a thin band of the foil across the top, so it reads as hers on sight
    '<tr><td bgcolor="' + PINK + '" style="background:' + PINK + ';background-image:' +
    FOIL + ';height:5px;line-height:5px;font-size:0;border-radius:3px 3px 0 0">&nbsp;</td></tr>' +

    '<tr><td bgcolor="' + PAPER + '" style="background:' + PAPER + ';padding:32px 28px 28px">' +
    '<p style="margin:0 0 8px;font:600 12px/1 Helvetica,Arial,sans-serif;' +
    'letter-spacing:.18em;text-transform:uppercase;color:' + PINK + '">' +
    esc(opts.label) + '</p>' +
    '<h1 style="margin:0 0 24px;font:italic 30px/1.25 Georgia,serif;color:' + INK + '">' +
    head + '</h1>' +
    opts.body +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" ' +
    'style="margin:28px 0 0"><tr><td height="1" bgcolor="' + HAIRLINE + '" ' +
    'style="height:1px;line-height:1px;font-size:0">&nbsp;</td></tr></table>' +
    '<p style="margin:18px 0 0;font:12px/1.6 Helvetica,Arial,sans-serif;color:' + QUIET + '">' +
    'Jaimie Kozyra &middot; <a href="' + BASE + '" style="color:' + QUIET + '">' +
    'jaimiekozyra.com</a>' + foot + '</p>' +
    '</td></tr></table></td></tr></table></body></html>';
}

export { shell, button, signature, p, esc, PINK, INK, BLUSH, PAPER, QUIET, HAIRLINE, BASE };
