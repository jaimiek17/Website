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

  if (form) {
    // Brevo answers with raw JSON, so the post goes through a hidden frame and
    // she stays on the page. The state is shown either way.
    var sink = document.createElement('iframe');
    sink.name = 'wya-sink';
    sink.hidden = true;
    document.body.appendChild(sink);
    form.target = 'wya-sink';

    form.addEventListener('submit', function () {
      var b = band(total());
      var head = root.querySelector('[data-outcome-head]');
      var line = root.querySelector('[data-outcome-line]');
      if (head) head.textContent = b.head;
      if (line) line.textContent = b.line;
      sendAnswers();
      setTimeout(function () { show(10); }, 150);
    });
  }

  // The post above puts her on Jaimie's list. This one asks the worker to send
  // her the outcome email. Only the eight option numbers go over, never the
  // wording, so the worker can rebuild her answers from its own copy.
  function sendAnswers() {
    var value = function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      return field ? field.value : '';
    };
    if (!window.fetch) return;
    fetch('/api/where-you-are', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: value('EMAIL').trim(),
        firstName: value('FIRSTNAME').trim(),
        picks: answers.map(function (a) { return a.value; }),
        trap: value('email_address_check')
      })
    }).catch(function () { /* she has the state on screen either way */ });
  }

  show(0);
})();
