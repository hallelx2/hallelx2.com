
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



/* The heatmap tooltip. Cells carry data-n and data-d, so this reads the grid
   rather than re-deriving it. Pointer events cover mouse and touch in one
   path; the readout line under the grid is updated too, which is what makes
   this work on a phone where nothing ever hovers. */
(function () {
  var wrap = document.querySelector('[data-heat]');
  if (!wrap) return;
  var read = wrap.querySelector('[data-heat-read]');
  var rest = read ? read.textContent : '';
  var tip = document.createElement('div');
  tip.className = 'heat-tip';
  tip.hidden = true;
  wrap.appendChild(tip);

  function say(el) {
    var n = Number(el.getAttribute('data-n')), d = el.getAttribute('data-d');
    var txt = (n === 0 ? 'Nothing' : n + (n === 1 ? ' contribution' : ' contributions')) + ' on ' + d;
    tip.textContent = txt;
    tip.hidden = false;
    if (read) read.textContent = txt;
    var c = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    /* Clamp inside the card: the grid scrolls horizontally, so a cell near the
       right edge would otherwise put the tooltip outside the rounded box. */
    var x = c.left - w.left + c.width / 2 - tip.offsetWidth / 2;
    tip.style.left = Math.max(4, Math.min(x, w.width - tip.offsetWidth - 4)) + 'px';
    tip.style.top = (c.top - w.top - tip.offsetHeight - 8) + 'px';
  }
  function clear() { tip.hidden = true; if (read) read.textContent = rest; }

  wrap.addEventListener('pointerover', function (e) {
    var el = e.target.closest && e.target.closest('.hc');
    if (el) say(el);
  });
  wrap.addEventListener('pointerleave', clear);
  wrap.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest('.hc');
    if (el) { say(el); e.preventDefault(); }
  });
})();
