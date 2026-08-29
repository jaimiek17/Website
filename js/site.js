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
