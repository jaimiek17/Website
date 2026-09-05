// Mobile nav toggle
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (!btn || !nav) return;

  var mq = window.matchMedia('(max-width: 900px)');

  function sync() {
    if (mq.matches) {
      nav.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    } else {
      nav.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  btn.addEventListener('click', function () {
    var open = nav.hidden;
    nav.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && mq.matches) {
      nav.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  mq.addEventListener('change', sync);
  sync();
})();

// Year stamp in the footer
(function () {
  var el = document.querySelectorAll('[data-year]');
  for (var i = 0; i < el.length; i++) { el[i].textContent = String(new Date().getFullYear()); }
})();

// Opt-in forms post to Brevo, which answers with raw JSON. Submitting into a
// hidden iframe keeps the visitor on the page, and the message below replaces
// the form once the response lands. Without JavaScript the signup still goes
// through, it just gives no feedback.
(function () {
  var forms = document.querySelectorAll('form[data-optin]');
  if (!forms.length) return;

  var frame = document.createElement('iframe');
  frame.name = 'optin-sink';
  frame.setAttribute('aria-hidden', 'true');
  frame.setAttribute('tabindex', '-1');
  frame.style.cssText = 'position:absolute;width:0;height:0;border:0;left:-9999px';
  document.body.appendChild(frame);

  for (var i = 0; i < forms.length; i++) {
    (function (form) {
      form.target = 'optin-sink';
      var sent = false;

      form.addEventListener('submit', function () {
        var email = form.querySelector('input[type=email]');
        if (email && !email.value) return;
        sent = true;
        var btn = form.querySelector('button[type=submit]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
      });

      frame.addEventListener('load', function () {
        if (!sent) return;
        sent = false;
        var note = document.createElement('p');
        note.className = 'optin-done';
        note.setAttribute('role', 'status');
        note.textContent = form.getAttribute('data-done') ||
          "Almost done. Click the link in the email I just sent and you're in. Check spam if you don't see it.";
        form.parentNode.replaceChild(note, form);
      });
    })(forms[i]);
  }
})();

// The contact form posts to Netlify Forms. Submitting in the background keeps
// her on the page, and the note below replaces the form once it lands.
(function () {
  var form = document.querySelector('form[data-contact]');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type=submit]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      var note = document.createElement('p');
      note.className = 'optin-done';
      note.setAttribute('role', 'status');
      note.textContent = "That is with me. I read everything myself, so give me a couple of business days.";
      form.parentNode.replaceChild(note, form);
    }).catch(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'Send it'; }
      var err = form.querySelector('.form-error') || document.createElement('p');
      err.className = 'form-error form-note';
      err.setAttribute('role', 'alert');
      err.textContent = "That did not send. Email me directly at jaimiek17@gmail.com and I will get it.";
      if (!err.parentNode) form.appendChild(err);
    });
  });
})();
