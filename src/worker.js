// jaimiekozyra.com
//
// The site itself is static files in public/. This worker exists for one
// reason: to send the outcome email when a woman finishes the eight questions
// on /where-you-are. It needs to run server side because the Brevo API key
// cannot go in the page, where anyone could read it.
//
// Everything else falls through to the static assets untouched.

import { LABELS, OPTIONS } from './questions.js';
import { render } from './emails.js';
import * as deck from './deck.js';

var SENDER  = { name: 'Jaimie Kozyra', email: 'hello@jaimiekozyra.com' };
var ORIGINS = ['https://jaimiekozyra.com', 'https://www.jaimiekozyra.com'];

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}

// Her three bands, the same thresholds the page uses on screen.
function bandFor(total) {
  if (total <= 5)  return 'adjusting';
  if (total <= 11) return 'between';
  return 'transition';
}

function cleanName(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>{}\\\/"'`\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);
}

function validEmail(value) {
  return typeof value === 'string' && value.length <= 254 &&
         /^[^\s@,;:<>()[\]\\"]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value);
}

async function handleAnswers(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method' }, 405);
  }

  var origin = request.headers.get('origin');
  if (origin && ORIGINS.indexOf(origin) === -1) {
    return json({ ok: false, error: 'origin' }, 403);
  }

  var data;
  try {
    data = await request.json();
  } catch (err) {
    return json({ ok: false, error: 'body' }, 400);
  }

  // Honeypot. A real browser leaves this empty.
  if (data.trap) return json({ ok: true });

  if (!validEmail(data.email)) {
    return json({ ok: false, error: 'email' }, 400);
  }

  // Only the eight chosen option numbers are trusted. The label and the
  // wording are looked up here, so no text from the browser reaches the email.
  var picks = data.picks;
  if (!Array.isArray(picks) || picks.length !== OPTIONS.length) {
    return json({ ok: false, error: 'picks' }, 400);
  }

  var answers = [];
  var total = 0;
  for (var i = 0; i < picks.length; i++) {
    var pick = picks[i];
    if (!Number.isInteger(pick) || pick < 0 || pick > 2) {
      return json({ ok: false, error: 'picks' }, 400);
    }
    answers.push({ label: LABELS[i], text: OPTIONS[i][pick] });
    total += pick;
  }

  var tag = bandFor(total);
  var mail = render(tag, cleanName(data.firstName), answers);
  if (!mail) return json({ ok: false, error: 'band' }, 400);

  if (!env.BREVO_API_KEY) {
    return json({ ok: false, error: 'unconfigured' }, 503);
  }

  var sent = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      sender: SENDER,
      replyTo: SENDER,
      to: [{ email: data.email, name: cleanName(data.firstName) || undefined }],
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
      tags: ['where-you-are', tag]
    })
  });

  if (!sent.ok) {
    var detail = await sent.text();
    console.log('brevo send failed', sent.status, detail.slice(0, 400));
    return json({ ok: false, error: 'send' }, 502);
  }

  return json({ ok: true, tag: tag, total: total });
}

// Subscribing asks for the free deck. The contact itself still goes in
// through the Brevo form the page posts to, same as before, so all this does
// is send her the files.
async function handleSubscribe(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method' }, 405);
  }

  var origin = request.headers.get('origin');
  if (origin && ORIGINS.indexOf(origin) === -1) {
    return json({ ok: false, error: 'origin' }, 403);
  }

  var data;
  try {
    data = await request.json();
  } catch (err) {
    return json({ ok: false, error: 'body' }, 400);
  }

  if (data.trap) return json({ ok: true });
  if (!validEmail(data.email)) return json({ ok: false, error: 'email' }, 400);

  // No cards file yet, so there is nothing honest to send. She is still on
  // the list either way, because the page posted to Brevo directly.
  if (!deck.ready()) return json({ ok: true, sent: false, reason: 'no-deck-file' });

  if (!env.BREVO_API_KEY) return json({ ok: false, error: 'unconfigured' }, 503);

  var mail = deck.render(cleanName(data.firstName));
  var sent = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      sender: SENDER,
      replyTo: SENDER,
      to: [{ email: data.email, name: cleanName(data.firstName) || undefined }],
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
      tags: ['narrative-loom']
    })
  });

  if (!sent.ok) {
    var detail = await sent.text();
    console.log('brevo deck send failed', sent.status, detail.slice(0, 400));
    return json({ ok: false, error: 'send' }, 502);
  }

  return json({ ok: true, sent: true });
}

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    if (url.pathname === '/api/where-you-are') {
      return handleAnswers(request, env);
    }
    if (url.pathname === '/api/subscribe') {
      return handleSubscribe(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};
