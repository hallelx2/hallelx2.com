
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('armed');
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  [].forEach.call(document.querySelectorAll('[data-reveal]'), function(el){ io.observe(el); });
})();

/* ── the staircase, on touch ────────────────────────────────────────
   Hover opens a step on a pointer and :focus-within opens it on a
   keyboard; neither exists on a phone, so a tap toggles .open here.
   Only one step is open at a time, and this runs outside the
   reduced-motion return above so touch still works when animation is
   switched off. */
(function () {
  var steps = [].slice.call(document.querySelectorAll('.stair .step'));
  if (!steps.length) return;
  var fine = matchMedia('(hover:hover) and (pointer:fine)');
  steps.forEach(function (s) {
    s.addEventListener('click', function () {
      if (fine.matches) return;              // pointer devices already have hover
      var open = !s.classList.contains('open');
      steps.forEach(function (o) { o.classList.remove('open'); o.setAttribute('aria-expanded', 'false'); });
      s.classList.toggle('open', open);
      s.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.stair')) return;
    steps.forEach(function (o) { o.classList.remove('open'); o.setAttribute('aria-expanded', 'false'); });
  });
})();
