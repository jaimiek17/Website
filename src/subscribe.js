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

import { shell, button, signature, p as para, esc } from './mail.js';

var BASE   = 'https://jaimiekozyra.com';
var DECK   = BASE + '/narrative-loom/deck';
var APP    = BASE + '/narrative-loom/app/';
var GUIDE  = BASE + '/downloads/the-narrative-loom-companion-guide.pdf';
var DAYS   = 7;

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
  var body =
    para('Hi ' + esc(firstName || 'there') + ',') +
    para('One click and the deck is yours. 44 cards and the 28 page guide.') +
    button('Confirm and get the deck', link) +
    para('<span style="font-size:15px;color:#6f6360">I write twice a month after that.</span>');

  var html = shell({
    label: 'One more step',
    head: 'Confirm your email',
    body: body,
    footnote: 'You asked for the deck on my website. If that was not you, ignore this ' +
              'and nothing happens. The link stops working in a week. Unsubscribe any time.'
  });

  var text = 'Hi ' + (firstName || 'there') + ',\n\n' +
    'One click and the deck is yours. 44 cards and the 28 page guide.\n\n' +
    'Confirm here: ' + link + '\n\n' +
    'I write twice a month after that.\n\n' +
    'You asked for the deck on my website. If that was not you, ignore this and ' +
    'nothing happens. The link stops working in a week. Unsubscribe any time.\n';

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


// She lands on the download page the moment she confirms, but if she closes
// that tab she has no way back to it. So the same two links go to her inbox.
function deckEmail(firstName) {
  var body =
    para('Hi ' + esc(firstName || 'there') + ',') +
    para('You are in. Here it is, yours to keep.') +
    button('Open the deck', APP) +
    button('Download the guide', GUIDE) +
    para('Keep this email. It is the way back to both of them.') +
    para('On an iPhone, open the deck and tap share, then Add to Home Screen. ' +
         'It then works like an app, with no signal needed.') +
    para('If you have not used a deck like this before, the guide opens with three ' +
         'ways to pull. Start with the single card. One question is plenty.') +
    signature() +
    para('<span style="font-size:15px;color:#6f6360">I write twice a month. ' +
         'Hit reply any time, I read every one.</span>');

  var html = shell({
    label: 'Start here',
    head: 'The Narrative Loom',
    body: body,
    footnote: 'You got this because you asked for the deck on my website. Unsubscribe any time.'
  });

  var text = 'Hi ' + (firstName || 'there') + ',\n\n' +
    'You are in. Here it is, yours to keep.\n\n' +
    'Open the deck: ' + APP + '\n' +
    'Download the guide: ' + GUIDE + '\n\n' +
    'Keep this email. It is the way back to both of them.\n\n' +
    'On an iPhone, open the deck and tap share, then Add to Home Screen. It then ' +
    'works like an app, with no signal needed.\n\n' +
    'If you have not used a deck like this before, the guide opens with three ways ' +
    'to pull. Start with the single card. One question is plenty.\n\nJaimie\n\n' +
    'I write twice a month. Hit reply any time, I read every one.\n\n' +
    'Unsubscribe any time.\n';

  return { subject: 'The Narrative Loom, yours to keep', html: html, text: text };
}

export { makeToken, readToken, confirmEmail, deckEmail, notice, DECK };
