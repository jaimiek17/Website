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
import * as sub from './subscribe.js';

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


// Brevo's own form told her to check her email and then sent nothing, so the
// signup runs here. She gets a confirmation email from this worker, and only
// a click on it puts her on the list.
async function sendMail(env, to, name, mail, tags) {
  return fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      sender: SENDER,
      replyTo: SENDER,
      to: [{ email: to, name: name || undefined }],
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
      tags: tags
    })
  });
}

async function handleSubscribe(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

  var origin = request.headers.get('origin');
  if (origin && ORIGINS.indexOf(origin) === -1) {
    return json({ ok: false, error: 'origin' }, 403);
  }

  var data;
  try { data = await request.json(); }
  catch (err) { return json({ ok: false, error: 'body' }, 400); }

  if (data.trap) return json({ ok: true });
  if (!validEmail(data.email)) return json({ ok: false, error: 'email' }, 400);
  if (!env.BREVO_API_KEY) return json({ ok: false, error: 'unconfigured' }, 503);

  var name  = cleanName(data.firstName);
  var token = await sub.makeToken(env.BREVO_API_KEY, data.email, name);
  var link  = 'https://jaimiekozyra.com/api/confirm?t=' + encodeURIComponent(token);
  var sent  = await sendMail(env, data.email, name, sub.confirmEmail(name, link), ['confirm']);

  if (!sent.ok) {
    var detail = await sent.text();
    console.log('confirm send failed', sent.status, detail.slice(0, 400));
    return json({ ok: false, error: 'send' }, 502);
  }
  return json({ ok: true });
}

// Which list she lands on. An explicit id wins. Failing that, if there is only
// one list in the account there is nothing to get wrong, so use it.
async function listIds(env) {
  if (env.BREVO_LIST_ID) return [Number(env.BREVO_LIST_ID)];
  var res = await fetch('https://api.brevo.com/v3/contacts/lists?limit=50', {
    headers: { 'api-key': env.BREVO_API_KEY, accept: 'application/json' }
  });
  if (!res.ok) return null;
  var body = await res.json();
  var lists = body && body.lists ? body.lists : [];
  if (lists.length === 1) return [lists[0].id];
  console.log('cannot pick a list, ' + lists.length + ' found:',
              lists.map(function (l) { return l.id + ' ' + l.name; }).join(', '));
  return null;
}

async function handleConfirm(request, env) {
  if (!env.BREVO_API_KEY) {
    return sub.notice('Something is not set up yet', 'This is on my side, not yours. Try again shortly.');
  }

  var url = new URL(request.url);
  var read = await sub.readToken(env.BREVO_API_KEY, url.searchParams.get('t'));

  if (!read) {
    return sub.notice('That link is not valid',
      'It may have been cut in half by your email app. Ask for the deck again and I will send a fresh one.');
  }
  if (read.expired) {
    return sub.notice('That link has expired',
      'Confirmation links last a week. Ask for the deck again and I will send a fresh one.');
  }

  var ids = await listIds(env);
  var body = {
    email: read.email,
    updateEnabled: true,
    attributes: { FIRSTNAME: read.firstName || undefined, OPT_IN: true }
  };
  if (ids) body.listIds = ids;

  var res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify(body)
  });

  // A contact who already exists comes back as a duplicate. She still clicked,
  // so send her through to the deck rather than showing her an error.
  if (!res.ok && res.status !== 204) {
    var detail = await res.text();
    if (detail.indexOf('duplicate_parameter') === -1) {
      console.log('contact add failed', res.status, detail.slice(0, 400));
    }
  }

  return Response.redirect(sub.DECK, 302);
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
    if (url.pathname === '/api/confirm') {
      return handleConfirm(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};
