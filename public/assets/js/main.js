(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) doc.classList.add('js');

  // mobile menu
  var t = document.querySelector('.toggle'), m = document.querySelector('.menu');
  if (t && m) t.addEventListener('click', function () {
    var o = m.classList.toggle('open'); t.setAttribute('aria-expanded', o ? 'true' : 'false');
  });

  // header shadow
  var h = document.querySelector('.site-header');
  var onScroll = function () { if (h) h.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // count-up
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = (el.getAttribute('data-count').split('.')[1] || '').length;
    var pre = el.getAttribute('data-pre') || '', start = null, dur = 1400;
    function fmt(v) { return pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
    if (reduce) { el.firstChild.nodeValue = fmt(end); return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.firstChild.nodeValue = fmt(end * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // reveal + triggers
  var targets = document.querySelectorAll('.reveal, .reveal-stagger, [data-count], .steps-line');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        if (el.hasAttribute('data-count')) countUp(el);
        if (el.classList.contains('steps-line')) { var c = el.querySelector('.cover'); if (c) c.style.strokeDashoffset = c.getAttribute('data-len'); }
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }
  // steps line cover setup
  document.querySelectorAll('.steps-line').forEach(function (s) {
    var c = s.querySelector('.cover'); if (!c) return;
    var w = s.getBoundingClientRect().width || 1000;
    c.setAttribute('x2', w); s.querySelector('.base').setAttribute('x2', w);
    c.style.strokeDasharray = w + ' ' + w; c.style.strokeDashoffset = '0'; c.setAttribute('data-len', -w);
    if (reduce) c.style.strokeDashoffset = -w;
  });

  // services sub-nav highlighting
  var sub = document.querySelectorAll('.subnav a');
  if (sub.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) sub.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.service[id]').forEach(function (s) { so.observe(s); });
  }

  // e-waste estimator (rough average weights in kg)
  var est = document.getElementById('estimator');
  if (est) {
    var calc = function () {
      var kg = 0, n = 0;
      est.querySelectorAll('input[data-kg]').forEach(function (i) {
        var v = Math.max(0, parseInt(i.value || '0', 10) || 0); i.value = v;
        kg += v * parseFloat(i.getAttribute('data-kg')); n += v;
      });
      document.getElementById('est-kg').textContent = Math.round(kg).toLocaleString('en-US');
      document.getElementById('est-n').textContent = n.toLocaleString('en-US');
    };
    est.addEventListener('input', calc);
    est.querySelectorAll('.qty button').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = b.parentNode.querySelector('input');
        i.value = Math.max(0, (parseInt(i.value || '0', 10) || 0) + parseInt(b.getAttribute('data-step'), 10)); calc();
      });
    });
    calc();
  }

  // forms: build the message, then let the visitor send it by WhatsApp or email
  document.querySelectorAll('form[data-compose]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = [f.getAttribute('data-compose')];
      f.querySelectorAll('[data-q]').forEach(function (el) {
        var v;
        if (el.classList.contains('chips')) {
          v = Array.prototype.map.call(el.querySelectorAll('input:checked'), function (i) { return i.value; }).join(', ');
        } else { v = (el.value || '').trim(); }
        if (v) lines.push(el.getAttribute('data-q') + ': ' + v);
      });
      var txt = lines.join('\n');
      var done = f.parentNode.querySelector('.form-done');
      done.querySelector('pre').textContent = txt;
      done.querySelector('.wa').href = 'https://wa.me/256772888866?text=' + encodeURIComponent(txt);
      done.querySelector('.em').href = 'mailto:cybergreenengineering@gmail.com?subject=' + encodeURIComponent(f.getAttribute('data-compose')) + '&body=' + encodeURIComponent(txt);
      done.hidden = false; done.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  });
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.querySelector(b.getAttribute('data-copy'));
      var txt = el.textContent;
      var ok = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy message'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, function () { selectText(el); });
      else selectText(el);
    });
  });
  function selectText(el) { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }

  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
