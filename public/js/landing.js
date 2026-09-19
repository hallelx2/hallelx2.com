
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function(v, a, b){ return v < a ? a : v > b ? b : v; };

  /* ── SECTION REVEALS ───────────────────────────────────────────────
     Blocks rise once, children staggered by CSS. Under reduced motion
     everything is simply shown. */
  /* ── HIGHLIGHT SWEEP ───────────────────────────────────────────────
     A marker drawn behind a phrase as it enters. Ink stays ink; only
     the ground behind it changes, so nothing gets harder to read. */
  var hls = [].slice.call(document.querySelectorAll('[data-hl]'));
  if (reduce){
    hls.forEach(function(h){ h.classList.add('on'); });
  } else {
    var ho = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return;
        setTimeout(function(){ e.target.classList.add('on'); }, 140);
        ho.unobserve(e.target);
      });
    }, { threshold: 0.9 });
    hls.forEach(function(h){ ho.observe(h); });
  }

  /* ── THE WIPE ──────────────────────────────────────────────────────
     Split a heading into its real line boxes, then sweep a solid block
     across each one. The text under it changes from muted to ink while
     it is covered, so the swap itself is never visible.

     Line detection is done by measuring, not guessing: every word is laid
     out as a probe span and grouped by offsetTop, so the bars land on the
     lines the browser actually produced at this viewport. */
  function wipeSplit(el){
    var words = el.textContent.replace(/\s+/g, ' ').trim().split(' ');
    if (!words[0]) return;
    el.textContent = '';
    var probes = words.map(function(w, i){
      var sp = document.createElement('span');
      sp.textContent = (i ? ' ' : '') + w;
      el.appendChild(sp);
      return sp;
    });
    var lines = [], cur = [], top = null;
    probes.forEach(function(sp){
      var t = sp.offsetTop;
      if (top === null) top = t;
      if (Math.abs(t - top) > 2){ lines.push(cur); cur = []; top = t; }
      cur.push(sp);
    });
    if (cur.length) lines.push(cur);

    el.textContent = '';
    lines.forEach(function(g, i){
      var wl = document.createElement('span'); wl.className = 'wl arm';
      var wt = document.createElement('span'); wt.className = 'wt';
      wt.textContent = g.map(function(sp){ return sp.textContent; }).join('').trim();
      var wb = document.createElement('i'); wb.className = 'wb'; wb.setAttribute('aria-hidden','true');
      wl.appendChild(wt); wl.appendChild(wb);
      wl.style.setProperty('--d', (i * 0.11).toFixed(2) + 's');
      el.appendChild(wl);
      if (i < lines.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return lines.length;
  }

  var wipes = [].slice.call(document.querySelectorAll('[data-wipe]'));
  if (wipes.length && !reduce){
    wipes.forEach(function(el){ wipeSplit(el); });
    var wo = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return;
        [].forEach.call(e.target.querySelectorAll('.wl'), function(l){ l.classList.add('go'); });
        wo.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    wipes.forEach(function(el){ wo.observe(el); });
    /* a heading already past the fold on load should not sit muted */
    addEventListener('load', function(){
      wipes.forEach(function(el){
        if (el.getBoundingClientRect().top < innerHeight * 0.4)
          [].forEach.call(el.querySelectorAll('.wl'), function(l){ l.classList.add('go'); });
      });
    });
  }

  /* ── THE STATEMENT ─────────────────────────────────────────────────
     One sentence, split into words, lit by scroll position. */
  var stance = document.querySelector('[data-stance]');
  var stmt = stance && stance.querySelector('[data-statement]');
  var sbar = stance && stance.querySelector('[data-sbar]');
  var swords = [];
  if (stmt){
    var raw = stmt.textContent.trim().split(/\s+/);
    stmt.textContent = '';
    swords = raw.map(function(w, i){
      var sp = document.createElement('span');
      sp.className = 'sw';
      sp.textContent = (i ? ' ' : '') + w;
      stmt.appendChild(sp);
      return sp;
    });
  }

  var reveals = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduce){
    reveals.forEach(function(r){ r.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        ro.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function(r){ ro.observe(r); });
  }

  var prog  = document.querySelector('[data-prog]');
  var hero  = document.querySelector('.hero');
  var cloud = document.querySelector('.cloud-wrap');
  var copy  = document.querySelector('.hero-copy');

  /* ── THE DECK ──────────────────────────────────────────────────────
     Card i rises over the first third of its own scroll segment, then
     holds. Once seated it goes .live and its contents arrive. Cards
     behind recede so the stack reads as a stack. */
  var deck  = document.querySelector('[data-deck]');
  var cards = deck ? [].slice.call(deck.querySelectorAll('[data-card]')) : [];
  var n = cards.length;
  var bar   = deck && deck.querySelector('[data-bar]');
  var noEl  = deck && deck.querySelector('[data-no]');
  var totEl = deck && deck.querySelector('[data-tot]');
  var catEl = deck && deck.querySelector('[data-cat-label]');
  var FILL = { hc:'var(--blue)', ed:'var(--green)', ai:'var(--slate)' };
  var NAME = { hc:'Healthcare', ed:'Education', ai:'AI' };
  cards.forEach(function(c, i){ c.style.zIndex = String(i + 1); });
  if (totEl) totEl.textContent = ('0' + n).slice(-2);

  if (reduce){
    cards.forEach(function(c){ c.classList.add('live'); });
    swords.forEach(function(w){ w.classList.add('on'); });
    if (bar) bar.style.width = '100%';
    if (sbar) sbar.style.width = '100%';
    return;
  }
  if (stance) stance.style.height = '190svh';
  /* 0.78svh of scroll per card (was 0.62): the rise now spreads over more
     wheel travel, which is half of what made it feel abrupt. */
  if (deck && n) deck.style.height = ((n * 0.78 + 0.45) * 100) + 'svh';

  /* ── SMOOTHED SCROLL DRIVER ────────────────────────────────────────
     The choreography used to read scrollY directly, and a wheel moves in
     ~100px detents — every tick slammed a card a third of the way up the
     stack. A lerped scroll value (sy) glides between detents and settles
     in ~150ms, so the same choreography plays smoothly; the entry curve
     is eased so a card decelerates into its seat instead of stopping
     dead. The loop only runs while sy is still catching up, and the
     reduced-motion fold above is untouched. */
  var ENTER2 = 0.5;                 /* rise portion of a card's segment (was 0.36) */
  var easeOut = function(x){ x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  var sy = scrollY, running = false;

  function frame(){
    var target = scrollY;
    sy += (target - sy) * 0.16;
    if (Math.abs(target - sy) < 0.35) sy = target;
    var doc = document.documentElement;

    /* progress hairline */
    if (prog){
      var total = doc.scrollHeight - innerHeight;
      prog.style.width = (total > 0 ? (sy / total) * 100 : 0).toFixed(2) + '%';
    }

    /* hero parallax — clouds lift and swell, copy lifts further and goes */
    if (hero){
      var hp = clamp(sy / Math.max(1, hero.offsetHeight), 0, 1);
      if (cloud) cloud.style.transform =
        'translate3d(0,' + (-hp * 64).toFixed(1) + 'px,0) scale(' + (1 + hp * 0.10).toFixed(3) + ')';
      if (copy) copy.style.transform = 'translate3d(0,' + (-hp * 96).toFixed(1) + 'px,0)';
    }

    /* the statement — words light across the pinned scroll */
    if (stance && swords.length){
      var ss = stance.offsetHeight - innerHeight;
      var stop = stance.getBoundingClientRect().top + scrollY;
      var sp = ss > 0 ? clamp((sy - stop) / ss, 0, 1) : 0;
      var eased = clamp((sp - 0.10) / 0.62, 0, 1);
      var lit = Math.round(eased * swords.length);
      for (var k = 0; k < swords.length; k++) swords[k].classList.toggle('on', k < lit);
      if (sbar) sbar.style.width = (eased * 100).toFixed(1) + '%';
    }

    /* the deck */
    if (deck && n){
      var span = deck.offsetHeight - innerHeight;
      var dtop = deck.getBoundingClientRect().top + scrollY;
      var p = span > 0 ? clamp((sy - dtop) / span, 0, 1) : 0;
      var t = ENTER2 + p * n;
      var active = clamp(Math.floor(t), 0, n - 1);
      for (var i = 0; i < n; i++){
        var d = t - i, y, sc = 1;
        if (d <= 0){ y = 104; }
        else if (d < ENTER2){ y = 104 * (1 - easeOut(d / ENTER2)); }
        else {
          var past = clamp(d - 1, 0, 2);
          y = -2.2 * past; sc = 1 - 0.035 * past;
        }
        cards[i].style.transform =
          'translate3d(0,' + y.toFixed(2) + '%,0) scale(' + sc.toFixed(3) + ')';
        cards[i].classList.toggle('live', d >= ENTER2 * 0.72);
      }
      var cat = cards[active].getAttribute('data-cat');
      if (bar){
        bar.style.width = (((active + 1) / n) * 100).toFixed(1) + '%';
        bar.style.background = FILL[cat];
      }
      if (noEl)  noEl.textContent = ('0' + (active + 1)).slice(-2);
      if (catEl) catEl.textContent = NAME[cat];
    }

    if (sy !== scrollY){ requestAnimationFrame(frame); }
    else { running = false; }
  }
  function kick(){ if (!running){ running = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', function(){ sy = scrollY; kick(); });
  kick();
})();
