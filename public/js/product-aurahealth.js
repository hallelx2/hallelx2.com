
(function(){
  /* Reveal on scroll, and let the charts draw themselves. The page is
     readable with this script absent: the hidden state is only applied
     once .armed is set here, so a parse error leaves everything visible. */
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
