// Signing up, confirming, and landing on the deck.
//
// This used to go through a Brevo hosted form. That form accepted the signup,
// told her to check her email, and never sent anything, so nobody reached the
// list. Everything below runs on Jaimie's own site instead. Brevo is only
// asked to store the contact and to put one email in the post, and that path
// is the one that has been reliable.
//
// The copy in the confirmation email is mine, not Jaimie's. There was no
// brief for it. No em dashes.

var BASE   = 'https://jaimiekozyra.com';
var DECK   = BASE + '/narrative-loom/deck';
var DAYS   = 7;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function b64url(bytes) {
  var s = btoa(String.fromCharCode.apply(null, new Uint8Array(bytes)));
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  var bin = atob(s);
  var out = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
}

// The link she clicks carries who she is and when it stops working, signed so
// it cannot be edited into someone else's address.
async function makeToken(secret, email, firstName) {
  var body = { e: email, n: firstName || '', x: Date.now() + DAYS * 86400000 };
  var payload = b64url(new TextEncoder().encode(JSON.stringify(body)));
  var key = await hmacKey(secret);
  var sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return payload + '.' + b64url(sig);
}

async function readToken(secret, token) {
  if (typeof token !== 'string' || token.indexOf('.') === -1) return null;
  var parts = token.split('.');
  if (parts.length !== 2) return null;

  var key = await hmacKey(secret);
  var want = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(parts[0]));
  var got;
  try { got = unb64url(parts[1]); } catch (err) { return null; }

  var mine = new Uint8Array(want);
  if (mine.length !== got.length) return null;
  var diff = 0;
  for (var i = 0; i < mine.length; i++) diff |= mine[i] ^ got[i];
  if (diff !== 0) return null;

  var body;
  try { body = JSON.parse(new TextDecoder().decode(unb64url(parts[0]))); }
  catch (err) { return null; }

  if (!body || typeof body.e !== 'string') return null;
  if (!body.x || Date.now() > body.x) return { expired: true, email: body.e };
  return { email: body.e, firstName: body.n || '' };
}

function confirmEmail(firstName, link) {
  var p = function (t) {
    return '<p style="margin:0 0 20px;font:17px/1.6 Georgia,serif;color:#323232">' + t + '</p>';
  };
  var body =
    p('Hi ' + esc(firstName || 'there') + ',') +
    p('One click and the deck is yours. 44 cards and the 28 page guide.') +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
    'style="margin:0 0 24px"><tr><td style="background:#323232;border-radius:2px">' +
    '<a href="' + link + '" style="display:inline-block;padding:14px 26px;' +
    'font:600 14px/1 Helvetica,Arial,sans-serif;letter-spacing:.06em;' +
    'color:#FAF6F4;text-decoration:none">Confirm and get the deck</a></td></tr></table>' +
    p('I write twice a month after that. Unsubscribe any time.') +
    p('<span style="color:#8a8a8a;font-size:15px">If you did not ask for this, ignore ' +
      'this email. Nothing happens until you click, and the link stops working in a week.</span>');

  var html =
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Confirm your email</title></head>' +
    '<body style="margin:0;padding:0;background:#FAF6F4">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
    'style="width:100%;background:#FAF6F4"><tr><td align="center" style="padding:32px 16px">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" ' +
    'style="width:100%;max-width:560px;text-align:left">' +
    '<tr><td style="padding:0 0 24px">' +
    '<p style="margin:0 0 6px;font:600 12px/1 Helvetica,Arial,sans-serif;' +
    'letter-spacing:.18em;text-transform:uppercase;color:#8a8a8a">One more step</p>' +
    '<h1 style="margin:0;font:italic 30px/1.25 Georgia,serif;color:#323232">' +
    'Confirm your email</h1></td></tr>' +
    '<tr><td>' + body + '</td></tr>' +
    '<tr><td style="padding:28px 0 0;border-top:1px solid #E3D5D1">' +
    '<p style="margin:0;font:13px/1.6 Helvetica,Arial,sans-serif;color:#8a8a8a">' +
    'Jaimie Kozyra &middot; <a href="' + BASE + '" style="color:#8a8a8a">jaimiekozyra.com</a>' +
    '</p></td></tr></table></td></tr></table></body></html>';

  var text = 'Hi ' + (firstName || 'there') + ',\n\n' +
    'One click and the deck is yours. 44 cards and the 28 page guide.\n\n' +
    'Confirm here: ' + link + '\n\n' +
    'I write twice a month after that. Unsubscribe any time.\n\n' +
    'If you did not ask for this, ignore this email. Nothing happens until you ' +
    'click, and the link stops working in a week.\n';

  return { subject: 'Confirm your email and the deck is yours', html: html, text: text };
}

// A page for the handful of cases where the link cannot be honoured.
function notice(head, line) {
  return new Response(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + esc(head) + '</title><meta name="robots" content="noindex">' +
    '<style>body{margin:0;background:#FAF6F4;color:#323232;' +
    'font:17px/1.6 Georgia,serif;display:grid;place-items:center;min-height:100vh;' +
    'padding:24px}div{max-width:34rem}h1{font-style:italic;font-size:30px;' +
    'line-height:1.25;margin:0 0 1rem}a{color:#323232}</style></head><body><div>' +
    '<h1>' + esc(head) + '</h1><p>' + esc(line) + '</p>' +
    '<p><a href="' + BASE + '/narrative-loom">Ask for the deck again</a></p>' +
    '</div></body></html>',
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  );
}

export { makeToken, readToken, confirmEmail, notice, DECK };
