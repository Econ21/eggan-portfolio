/* Data Modeling page behaviour. Everything is progressive enhancement: without this file every pane, diagram and
   number is still readable. Loaded only on /data-modeling. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  if (!doc.querySelector('.dm-hero')) return;
  root.classList.add('dm-js');
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || root.dataset.motion === 'off'; } catch (e) {}

  /* tabs (ER explorer + code notebook) */
  function tabs(btnSel, attr, paneAttr) {
    var btns = [].slice.call(doc.querySelectorAll(btnSel));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute(attr);
        btns.forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        [].forEach.call(doc.querySelectorAll('[' + paneAttr + ']'), function (p) {
          if (p.getAttribute(paneAttr) === id) p.removeAttribute('data-hidden'); else p.setAttribute('data-hidden', '');
        });
      });
    });
  }
  tabs('.dm-tabs button', 'data-model', 'data-pane');
  tabs('.nb-tabs button', 'data-cell-tab', 'data-cell-pane');

  /* ER: focus an entity → light up its relations and neighbours */
  [].forEach.call(doc.querySelectorAll('svg.er'), function (svg) {
    var rels = [].slice.call(svg.querySelectorAll('.er-rel'));
    var ents = [].slice.call(svg.querySelectorAll('.er-entity'));
    function on(id) {
      var near = {}; near[id] = 1;
      rels.forEach(function (r) {
        var hit = r.dataset.a === id || r.dataset.b === id;
        r.classList.toggle('on', hit);
        if (hit) { near[r.dataset.a] = 1; near[r.dataset.b] = 1; }
      });
      ents.forEach(function (e) { e.classList.toggle('on', !!near[e.dataset.id]); });
      svg.classList.add('is-focus');
    }
    function off() { svg.classList.remove('is-focus'); }
    ents.forEach(function (e) {
      e.addEventListener('mouseenter', function () { on(e.dataset.id); });
      e.addEventListener('focus', function () { on(e.dataset.id); });
      e.addEventListener('click', function (ev) { ev.stopPropagation(); on(e.dataset.id); });
    });
    svg.addEventListener('mouseleave', off);
    svg.addEventListener('click', off);
  });

  /* copy buttons */
  [].forEach.call(doc.querySelectorAll('[data-copy]'), function (b) {
    b.addEventListener('click', function () {
      var code = b.closest('.nb-cell').querySelector('.nb-code').innerText;
      var done = function () { b.textContent = 'copied ✓'; setTimeout(function () { b.textContent = 'copy'; }, 1500); };
      try { navigator.clipboard.writeText(code).then(done, function () {}); } catch (e) {}
    });
  });

  /* count-up numbers in the hero */
  var counted = false;
  function countUp() {
    if (counted || reduce) return; counted = true;
    [].forEach.call(doc.querySelectorAll('[data-count]'), function (el) {
      var to = +el.dataset.count, t0 = null;
      function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }
  if (typeof IntersectionObserver === 'function') {
    var st = doc.querySelector('.dm-stats');
    if (st) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { countUp(); o.disconnect(); } }, { threshold: .3 }).observe(st);
  }

  /* simulators */
  var CV = 104 / 16300; // value of one credit in USD (Rp104 at Rp16,300/$)
  var price = doc.querySelector('[data-sim="price"]');
  if (price) {
    var q = function (s) { return price.querySelector(s); };
    var upd = function () {
      var v = +q('[data-i=cost]').value, m = +q('[data-i=m]').value / 100;
      var cost = 0.001 * Math.pow(10, (v / 100) * Math.log10(2000));
      var credits = Math.ceil(cost / (CV * (1 - m)) - 1e-9);
      var rev = credits * CV, gp = rev - cost;
      q('[data-o=cost]').textContent = '$' + (cost < 0.01 ? cost.toFixed(4) : cost.toFixed(3));
      q('[data-o=m]').textContent = Math.round(m * 100) + '%';
      q('[data-o=credits]').textContent = credits.toLocaleString('en');
      q('[data-o=rev]').textContent = '$' + rev.toFixed(rev < 1 ? 3 : 2);
      q('[data-o=gp]').textContent = '$' + gp.toFixed(gp < 1 ? 3 : 2);
      q('[data-o=costbar]').style.width = (cost / rev * 100) + '%';
      q('[data-o=gpbar]').style.width = (gp / rev * 100) + '%';
    };
    price.addEventListener('input', upd); upd();
  }
  var be = doc.querySelector('[data-sim="be"]');
  if (be) {
    var P = 43, A = 20, Fr = 1.07, FX = 3500; // thousands per month, illustrative
    var g = function (s) { return be.querySelector(s); };
    var fmt = function (k) { var s = k < 0 ? '−' : '+'; k = Math.abs(k); return s + (k >= 1000 ? (k / 1000).toFixed(1) + 'M' : Math.round(k) + 'k'); };
    var drawBE = function () {
      var N = +g('[data-i=n]').value, c = +g('[data-i=c]').value / 1000;
      var prof = function (cc) { return N * (cc * (P - A) - (1 - cc) * Fr) - FX; };
      var cstar = (FX / N + Fr) / (P - A + Fr);
      var xs = [], lo = Infinity, hi = -Infinity;
      for (var i = 0; i <= 60; i++) { var cc = i / 60 * 0.12, y = prof(cc); xs.push([cc, y]); lo = Math.min(lo, y); hi = Math.max(hi, y); }
      lo = Math.min(lo, 0); hi = Math.max(hi, 0); var span = hi - lo || 1;
      var X = function (cc) { return cc / 0.12 * 400; }, Y = function (y) { return 160 - (y - lo) / span * 150; };
      g('.sc-line').setAttribute('d', xs.map(function (p, i) { return (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join(''));
      var z = g('.sc-zero'); z.setAttribute('y1', Y(0)); z.setAttribute('y2', Y(0));
      var b = g('.sc-be'); var bx = Math.min(400, X(cstar)); b.setAttribute('x1', bx); b.setAttribute('x2', bx);
      var d = g('.sc-dot'); d.setAttribute('cx', X(c)); d.setAttribute('cy', Y(prof(c)));
      g('[data-o=n]').textContent = N.toLocaleString('en').replace(/,/g, ' ');
      g('[data-o=c]').textContent = (c * 100).toFixed(1) + '%';
      g('[data-o=be]').textContent = cstar > 0.12 ? '> 12%' : (cstar * 100).toFixed(1) + '%';
      var pl = prof(c), o = g('[data-o=pl]'); o.textContent = fmt(pl); o.style.color = pl >= 0 ? '#1f9d63' : 'var(--accent)';
    };
    be.addEventListener('input', drawBE); drawBE();
  }

  /* hero: living entity graph (force layout, pulses along relations, pointer-aware) */
  var hero = doc.querySelector('.dm-hero'), cvs = hero && hero.querySelector('.dm-graph');
  if (!cvs || !cvs.getContext) return;
  var data; try { data = JSON.parse(hero.dataset.graph); } catch (e) { return; }
  var ctx = cvs.getContext('2d'); if (!ctx) return;
  var COLORS = ['#4fd6ff', '#9ef07a', '#ffb547', '#ff6b9a'];
  var W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), mouse = null, running = true;
  var idx = {}, nodes = data.nodes.map(function (n, i) { idx[n.id] = i; return { id: n.id, label: n.label, g: n.g, hub: n.hub, x: 0, y: 0, vx: 0, vy: 0 }; });
  var edges = data.edges.filter(function (e) { return idx[e[0]] != null && idx[e[1]] != null; }).map(function (e) { return [idx[e[0]], idx[e[1]]]; });
  var pulses = edges.map(function (_, i) { return { e: i, t: Math.random(), s: 0.003 + Math.random() * 0.004 }; });
  function size() {
    var r = hero.getBoundingClientRect(); W = r.width; H = r.height;
    cvs.width = W * dpr; cvs.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function center() { return W < 700 ? [W * 0.5, H * 0.32] : [W * 0.68, H * 0.42]; }
  function seed() {
    var c = center(), R = Math.min(W, H) * 0.3;
    nodes.forEach(function (n, i) { var a = (n.g / 4) * Math.PI * 2 + (i % 6) * 0.35; n.x = c[0] + Math.cos(a) * R * (0.5 + Math.random() * 0.6); n.y = c[1] + Math.sin(a) * R * (0.5 + Math.random() * 0.6); });
  }
  function physics() {
    var c = center(), k = Math.min(W, H) * (W < 700 ? 0.085 : 0.11);
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + 0.01, f = (k * k) / d2 * 0.32;
        a.vx += dx * f * 0.02; a.vy += dy * f * 0.02; b.vx -= dx * f * 0.02; b.vy -= dy * f * 0.02;
      }
      a.vx += (c[0] - a.x) * 0.0042; a.vy += (c[1] - a.y) * 0.0042;
      if (mouse) { var mx = a.x - mouse[0], my = a.y - mouse[1], md = Math.sqrt(mx * mx + my * my); if (md < 120) { a.vx += mx / md * 0.6; a.vy += my / md * 0.6; } }
    }
    edges.forEach(function (e) {
      var a = nodes[e[0]], b = nodes[e[1]], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - k * 0.95) * 0.004;
      a.vx += dx / d * f * d * 0.05; a.vy += dy / d * f * d * 0.05; b.vx -= dx / d * f * d * 0.05; b.vy -= dy / d * f * d * 0.05;
    });
    var t = performance.now() / 1000;
    nodes.forEach(function (n, i) {
      n.vx += Math.sin(t * 0.4 + i) * 0.015; n.vy += Math.cos(t * 0.35 + i * 1.3) * 0.015;
      n.vx *= 0.86; n.vy *= 0.86; n.x += n.vx; n.y += n.vy;
      n.x = Math.max(24, Math.min(W - 110, n.x)); n.y = Math.max(40, Math.min(H - 150, n.y));
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var hot = null;
    if (mouse) nodes.forEach(function (n) { var d = Math.hypot(n.x - mouse[0], n.y - mouse[1]); if (d < 40 && (!hot || d < hot.d)) hot = { n: n, d: d }; });
    edges.forEach(function (e) {
      var a = nodes[e[0]], b = nodes[e[1]];
      var lit = hot && (hot.n === a || hot.n === b);
      ctx.strokeStyle = lit ? 'rgba(158,240,122,.8)' : 'rgba(120,160,220,.18)'; ctx.lineWidth = lit ? 1.4 : 1;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    pulses.forEach(function (p) {
      var e = edges[p.e], a = nodes[e[0]], b = nodes[e[1]];
      if (!reduce) p.t += p.s; if (p.t > 1) p.t = 0;
      var x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
      ctx.fillStyle = COLORS[a.g % 4]; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
    });
    nodes.forEach(function (n) {
      var col = COLORS[n.g % 4], r = n.hub ? 6 : 3.6;
      var gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5); gr.addColorStop(0, col + '55'); gr.addColorStop(1, col + '00');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(n.x, n.y, r * 5, 0, 6.283); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.283); ctx.fill();
      if (n.hub || (hot && hot.n === n) || W > 1100) {
        ctx.font = (n.hub ? '600 ' : '') + '11px ui-monospace, Menlo, monospace';
        ctx.fillStyle = hot && hot.n === n ? '#ffffff' : 'rgba(210,225,245,' + (n.hub ? .9 : .45) + ')';
        ctx.fillText(n.label, n.x + r + 6, n.y + 4);
      }
    });
  }
  function loop() { if (!running) return; physics(); draw(); requestAnimationFrame(loop); }
  size(); seed(); for (var w = 0; w < 260; w++) physics();
  draw();
  if (!reduce) requestAnimationFrame(loop);
  window.addEventListener('resize', function () { size(); draw(); });
  hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); mouse = [e.clientX - r.left, e.clientY - r.top]; });
  hero.addEventListener('pointerleave', function () { mouse = null; });
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver(function (es) { var vis = es[0].isIntersecting; if (vis && !running && !reduce) { running = true; requestAnimationFrame(loop); } running = vis || reduce; }).observe(hero);
  }
})();
