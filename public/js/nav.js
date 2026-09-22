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

  /* Keep an open panel inside the viewport.

     The panel is centred on its nav item, so how wide it may be depends on how
     far that item sits from the edge — which changes whenever a nav item is
     added. Rather than encode that as a constant that goes stale, measure the
     panel where it landed and translate it back by however much it overhangs.
     Runs on open and on resize; costs one layout read per open. */
  function clampMenu(it) {
    var m = it.querySelector('.menu');
    if (!m) return;
    /* Clamp to the nav's own left edge, not an arbitrary margin. The nav is
       positioned at left:var(--gutter), which is clamp(20px,4vw,72px) — so a
       fixed 16px let the panel sit outside the pill it hangs from, by 4px at
       390 and more as the gutter grows. Reading the resolved value tracks the
       clamp() at every width and survives a resize. */
    var gutter = parseFloat(getComputedStyle(nav).left) || 16;
    /* Compute where centring WOULD put it, rather than reading back where it
       currently is: transform is transitioned, so a rect read on open measures
       the panel mid-animation and produces a different answer every time.
       offsetWidth is laid out even while the panel is visibility:hidden. */
    var vw = document.documentElement.clientWidth;
    var w = m.offsetWidth;
    var ir = it.getBoundingClientRect();
    var centre = ir.left + ir.width / 2;
    var left = centre - w / 2;
    var right = centre + w / 2;
    var shift = 0;
    if (left < gutter) shift = gutter - left;
    else if (right > vw - gutter) shift = (vw - gutter) - right;
    m.setAttribute('data-shift', '');
    m.style.setProperty('--shift', Math.round(shift) + 'px');
  }

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
    if (open) clampMenu(it);
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

  /* A resize can change which edge the panel overhangs, so re-clamp what is open. */
  window.addEventListener('resize', function () {
    items.forEach(function (it) { if (it.classList.contains('open')) clampMenu(it); });
  });
})();

/* ── FRAGMENT SCROLL, RE-ISSUED ──────────────────────────────────────
   Landing on a URL with a #hash, the browser's own jump gets lost:
   html{scroll-behavior:smooth} turns it into an animation, and the
   reveal/deck scripts (plus hydration, on the Next.js port) re-lay-out
   the page right after load, which cancels it — so "Numbers" dropped
   you at the top of the page. Re-issue the jump once everything above
   has run. If the page is already scrolled (the UA jump survived, or
   the reader moved), leave it alone. */
(function () {
  if (!location.hash) return;
  var el = document.getElementById(location.hash.slice(1));
  if (!el) return;
  var placed = -1;
  function jump () {
    el.scrollIntoView({ behavior: 'instant', block: 'start' });
    placed = window.scrollY;
  }
  requestAnimationFrame(function () {
    if (window.scrollY > 80) return;                 /* UA jump survived, or reader moved */
    if (el.getBoundingClientRect().top < 80) return; /* target already in view */
    jump();
  });
  /* Late images and font swaps move the target after the first jump (measured
     230px adrift on a cold production load). Re-align once everything has
     loaded — but never if the reader has scrolled away in the meantime. */
  addEventListener('load', function () {
    setTimeout(function () {
      if (placed < 0 && window.scrollY > 80) return;
      if (placed >= 0 && Math.abs(window.scrollY - placed) > 4) return;
      if (Math.abs(el.getBoundingClientRect().top) <= 2) return;
      jump();
    }, 80);
  });
})();
