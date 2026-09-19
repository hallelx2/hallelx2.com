/* ══════════════════════════════════════════════════════════════════════
   hallelx2 labs — navigation behaviour.

   CSS opens the dropdowns on hover; this adds everything hover cannot do:
   click and touch, keyboard, Escape, and closing when you click away.

   It fails open. With this script absent every link is still a real <a>
   in the document, the panels are reachable by :focus-within, and the
   mobile list is only hidden behind a class this file toggles — so the
   worst case is a menu that needs a tab rather than a menu that is gone.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var items = [].slice.call(nav.querySelectorAll('.navitem.has-menu'));
  var burger = nav.querySelector('.burger');
  var mq = window.matchMedia('(max-width:900px)');

  function closeAll(except) {
    items.forEach(function (it) {
      if (it === except) return;
      it.classList.remove('open');
      var t = it.querySelector('.navlink');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  function toggle(it, force) {
    var open = force === undefined ? !it.classList.contains('open') : force;
    closeAll(open ? it : null);
    it.classList.toggle('open', open);
    var t = it.querySelector('.navlink');
    if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  items.forEach(function (it) {
    var trigger = it.querySelector('.navlink');
    if (!trigger) return;

    // pointer: hover opens on a wide viewport, where the bridge exists
    it.addEventListener('mouseenter', function () {
      if (!mq.matches) toggle(it, true);
    });
    it.addEventListener('mouseleave', function () {
      if (!mq.matches) toggle(it, false);
    });

    // click works everywhere, and is the only route on touch
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      toggle(it);
    });

    // keyboard: focus into the group opens it, Escape closes and returns
    it.addEventListener('focusin', function () { toggle(it, true); });
    it.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { toggle(it, false); trigger.focus(); }
    });
  });

  if (burger) {
    burger.addEventListener('click', function () {
      var open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) closeAll(null);
    });
  }

  document.addEventListener('click', function (e) {
    if (nav.contains(e.target)) return;
    closeAll(null);
    nav.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeAll(null);
    nav.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  });
})();
