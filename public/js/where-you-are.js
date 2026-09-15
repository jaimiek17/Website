// Where are you. Eight questions, one per screen, sorted into one of three
// states. Nothing is sent until she gives an email on the last screen.
(function () {
  var root = document.querySelector('.wya');
  if (!root) return;

  var screens = [].slice.call(root.querySelectorAll('.wya-screen'));
  var form    = root.querySelector('[data-wya-form]');
  var LABELS  = ['A year from now', 'Three words', 'Advice', 'What changed',
                 'What matters', 'Small decisions', 'How long', 'Sorted out'];

  var answers = [];   // { value, text } per question, in order
  var step    = 0;

  function show(n) {
    step = n;
    screens.forEach(function (s) {
      s.hidden = Number(s.getAttribute('data-step')) !== n;
    });
    var live = screens[n];
    if (!live) return;
    var focusable = live.querySelector('button, input');
    if (focusable && n !== 0) focusable.focus();
    if (n > 0) live.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  function total() {
    return answers.reduce(function (sum, a) { return sum + a.value; }, 0);
  }

  function band(t) {
    if (t <= 5)  return { tag: 'adjusting',  head: 'You’re adjusting.',
      line: 'Your self-story survived this. What you need is a plan, not a rebuild. The full answer is on its way.' };
    if (t <= 11) return { tag: 'between',    head: 'You’re somewhere in between.',
      line: 'Part of your sorting still works and part of it doesn’t. The full answer is on its way.' };
    return { tag: 'transition', head: 'You’re in a transition.',
      line: 'You can’t name what you’re moving toward, and there’s a reason for that. The full answer is on its way.' };
  }

  root.addEventListener('click', function (e) {
    var el = e.target.closest('button');
    if (!el || !root.contains(el)) return;

    if (el.hasAttribute('data-start')) { show(1); return; }

    if (el.classList.contains('wya-option')) {
      answers[step - 1] = {
        value: Number(el.getAttribute('data-value')),
        text: el.getAttribute('data-text')
      };
      show(step + 1);
      return;
    }

    if (el.hasAttribute('data-back')) { if (step > 0) show(step - 1); return; }

    if (el.hasAttribute('data-again')) {
      answers = [];
      if (form) { form.reset(); form.hidden = false; }
      show(0);
      return;
    }
  });

  // Fill the hidden fields the moment she reaches the email screen.
  var observer = new MutationObserver(function () {
    var email = root.querySelector('[data-step="9"]');
    if (!email || email.hidden || !form) return;
    var t = total(), b = band(t);
    form.querySelector('[data-field="tag"]').value = b.tag;
    form.querySelector('[data-field="total"]').value = String(t);
    form.querySelector('[data-field="answers"]').value = answers.map(function (a, i) {
      return LABELS[i] + ': ' + a.text;
    }).join('\n');
  });
  observer.observe(root, { attributes: true, attributeFilter: ['hidden'], subtree: true });

  // Common domain slips. The one real bounce so far was a typo in the name
  // part, not the domain, so this is a safety net. The read back below is the
  // fix that would actually have caught it.
  var DOMAINS = {
    'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com', 'gnail.com': 'gmail.com', 'gamil.com': 'gmail.com',
    'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.co': 'hotmail.com',
    'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahoo.co': 'yahoo.com',
    'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com',
    'icloud.co': 'icloud.com', 'iclod.com': 'icloud.com'
  };

  function suggest(value) {
    var at = value.lastIndexOf('@');
    if (at < 1) return null;
    var fixed = DOMAINS[value.slice(at + 1).toLowerCase()];
    return fixed ? value.slice(0, at + 1) + fixed : null;
  }

  if (form) {
    var emailField = form.querySelector('[name="EMAIL"]');
    var check = root.querySelector('[data-email-check]');

    // Rebuilt only when the text actually changes. Blur fires as she reaches
    // for the suggestion, and rebuilding then would pull the button out from
    // under her finger.
    var shown = null;

    function readBack() {
      if (!check || !emailField) return;
      var value = emailField.value.trim();
      if (!value || value.indexOf('@') < 1) { check.hidden = true; shown = null; return; }
      if (shown === value) { check.hidden = false; return; }
      shown = value;
      check.hidden = false;
      var fix = suggest(value);
      if (fix) {
        check.textContent = '';
        check.appendChild(document.createTextNode('Did you mean '));
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'wya-link';
        b.setAttribute('data-fix', '');
        b.textContent = fix;
        check.appendChild(b);
        check.appendChild(document.createTextNode('?'));
      } else {
        check.textContent = 'Is this your email? ' + value;
      }
    }

    if (emailField) {
      emailField.addEventListener('input', readBack);
      emailField.addEventListener('blur', readBack);
    }

    check && check.addEventListener('click', function (e) {
      var fix = e.target.getAttribute && e.target.getAttribute('data-fix') !== null
        ? e.target : null;
      if (!fix || !emailField) return;
      emailField.value = fix.textContent;
      shown = null;
      readBack();
      emailField.focus();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var value = function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : '';
      };
      var btn = form.querySelector('button[type=submit]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }

      var email = value('EMAIL');
      var name  = value('FIRSTNAME');
      var trap  = value('email_address_check');
      var wants = form.querySelector('[name="OPT_IN"]');

      // Her answer goes out either way. Joining the list only happens if she
      // asked for it, and that one still needs her to confirm.
      var jobs = [
        fetch('/api/where-you-are', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email: email,
            firstName: name,
            picks: answers.map(function (a) { return a.value; }),
            trap: trap
          })
        }).catch(function () {})
      ];
      if (wants && wants.checked) {
        jobs.push(fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email: email, firstName: name, trap: trap })
        }).catch(function () {}));
      }

      var b = band(total());
      var head = root.querySelector('[data-outcome-head]');
      var line = root.querySelector('[data-outcome-line]');
      var sent = root.querySelector('[data-sent-to]');
      if (head) head.textContent = b.head;
      if (line) line.textContent = b.line;
      if (sent && email) {
        sent.hidden = false;
        sent.textContent = 'Sent to ' + email + '. Not right? Start again and use the correct one.';
      }

      Promise.all(jobs).then(function () { show(10); }, function () { show(10); });
    });
  }

  show(0);
})();
