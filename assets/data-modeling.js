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

  /* ── analyses (v3) ───────────────────────────────────── */
  var LANG = (root.getAttribute('lang') || 'en').slice(0, 2);
  var W3 = function (en, id, nl) { return LANG === 'id' ? id : LANG === 'nl' ? nl : en; };
  var nf = function (x, d) { return Number(x).toLocaleString(LANG === 'en' ? 'en' : LANG, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
  var pct = function (x, d) { return (x >= 0 ? '+' : '−') + nf(Math.abs(x) * 100, d == null ? 0 : d) + '%'; };
  function segs(box, name, cb) {
    var bs = [].slice.call(box.querySelectorAll('[data-seg="' + name + '"]'));
    bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); cb(b.dataset.v); }); });
  }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* A · market desk: price series with regimes, EMA crossover backtest */
  var desk = doc.querySelector('[data-case="desk"]');
  if (desk) {
    var r = rng(57), N = 730, px = [], p = 41000, mu = [0.0030, 0.0018, -0.0035, -0.0010, 0.0012, 0.0032];
    for (var i = 0; i < N; i++) {
      var reg = mu[Math.floor(i / (N / mu.length))];
      var z = Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(6.283 * r());
      p *= Math.exp(reg + 0.024 * z); px.push(p);
    }
    var ema = function (a, n) { var k = 2 / (n + 1), o = [a[0]]; for (var j = 1; j < a.length; j++) o.push(a[j] * k + o[j - 1] * (1 - k)); return o; };
    var dq = function (s) { return desk.querySelector(s); };
    var run = function () {
      var f = +dq('[data-i=fast]').value, s = +dq('[data-i=slow]').value, fee = +dq('[data-i=fee]').value / 10000;
      if (f >= s) f = Math.max(3, s - 5);
      dq('[data-o=fastv]').textContent = f; dq('[data-o=slowv]').textContent = s; dq('[data-o=feev]').textContent = nf(fee * 100, 2) + '%';
      var ef = ema(px, f), es = ema(px, s), pos = 0, eq = [1], hold = [1], trades = [], inMkt = 0, rets = [];
      for (var t = 1; t < N; t++) {
        var rr = px[t] / px[t - 1] - 1, want = ef[t - 1] > es[t - 1] ? 1 : 0, cost = 0;
        if (t > s && want !== pos) { cost = fee; trades.push([t, want]); pos = want; }
        if (t <= s) pos = 0;
        var day = pos * rr - cost; rets.push(day); inMkt += pos;
        eq.push(eq[t - 1] * (1 + day)); hold.push(px[t] / px[0]);
      }
      var peak = 1, dd = 0, hp = 1, hdd = 0;
      for (t = 0; t < N; t++) { peak = Math.max(peak, eq[t]); dd = Math.min(dd, eq[t] / peak - 1); hp = Math.max(hp, hold[t]); hdd = Math.min(hdd, hold[t] / hp - 1); }
      var m = rets.reduce(function (a, b) { return a + b; }, 0) / rets.length;
      var sd = Math.sqrt(rets.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / rets.length) || 1;
      var sharpe = m / sd * Math.sqrt(365), ret = eq[N - 1] - 1, hr = hold[N - 1] - 1;
      var o = function (k, v, cls) { var el = dq('[data-o=' + k + ']'); el.textContent = v; el.className = cls || ''; };
      o('ret', pct(ret), ret >= hr ? 'up' : ''); o('hold', pct(hr)); o('dd', pct(dd), 'down'); o('sh', nf(sharpe, 2)); o('tr', String(trades.length)); o('ex', nf(inMkt / (N - 1) * 100) + '%');
      // chart
      var lo = Math.min.apply(null, px), hi = Math.max.apply(null, px), X = function (t) { return t / (N - 1) * 720; };
      var Y = function (v) { return 14 + (1 - (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * 205; };
      var line = function (a, fy) { var d = ''; for (var t = 0; t < a.length; t += 2) d += (t ? 'L' : 'M') + X(t).toFixed(1) + ',' + fy(a[t]).toFixed(1); return d; };
      dq('.desk-px').setAttribute('d', line(px, Y)); dq('.desk-f').setAttribute('d', line(ef, Y)); dq('.desk-s').setAttribute('d', line(es, Y));
      var elo = Math.min(Math.min.apply(null, eq), Math.min.apply(null, hold)), ehi = Math.max(Math.max.apply(null, eq), Math.max.apply(null, hold));
      var EY = function (v) { return 248 + (1 - (v - elo) / (ehi - elo || 1)) * 104; };
      dq('.desk-eq').setAttribute('d', line(eq, EY)); dq('.desk-hold').setAttribute('d', line(hold, EY));
      dq('.desk-marks').innerHTML = trades.map(function (tr) { var x = X(tr[0]), y = Y(px[tr[0]]); return tr[1] ? '<path class="b" d="M' + x + ',' + (y + 4) + 'l-4,8h8z"/>' : '<path class="s" d="M' + x + ',' + (y - 4) + 'l-4,-8h8z"/>'; }).join('');
      if (!dq('.desk-grid').childNodes.length) dq('.desk-grid').innerHTML = [0.25, 0.5, 0.75].map(function (k) { return '<line x1="0" x2="720" y1="' + (14 + k * 205) + '" y2="' + (14 + k * 205) + '"/>'; }).join('');
      var better = sharpe > 0 && ret > hr;
      dq('[data-o=take]').innerHTML = W3(
        'With a <b>' + f + '/' + s + '-day</b> crossover the rule returns <b>' + pct(ret) + '</b> against <b>' + pct(hr) + '</b> for holding, with a worst fall of <b>' + pct(dd) + '</b> instead of <b>' + pct(hdd) + '</b>. ' + (better ? 'It wins on both return and risk here.' : 'It gives up return but cuts the drawdown — the usual trade-off of a trend filter.') + ' More trades mean more fees: raise the fee and watch the fast settings lose.',
        'Dengan crossover <b>' + f + '/' + s + ' hari</b>, aturan ini menghasilkan <b>' + pct(ret) + '</b> dibanding <b>' + pct(hr) + '</b> bila ditahan, dengan penurunan terburuk <b>' + pct(dd) + '</b> alih-alih <b>' + pct(hdd) + '</b>. ' + (better ? 'Di sini aturan menang di return dan risiko.' : 'Return-nya lebih kecil tetapi drawdown terpangkas — kompromi khas filter tren.') + ' Makin banyak transaksi makin besar biaya: naikkan biaya dan lihat pengaturan cepat kalah.',
        'Met een <b>' + f + '/' + s + '-daagse</b> crossover levert de regel <b>' + pct(ret) + '</b> op tegen <b>' + pct(hr) + '</b> voor vasthouden, met een grootste daling van <b>' + pct(dd) + '</b> in plaats van <b>' + pct(hdd) + '</b>. ' + (better ? 'Hier wint hij op rendement én risico.' : 'Hij levert rendement in maar halveert de drawdown — de klassieke ruil van een trendfilter.') + ' Meer trades betekent meer kosten: verhoog de kosten en zie de snelle instellingen verliezen.');
    };
    desk.addEventListener('input', run); run();
  }

  /* B · application funnel */
  var fnBox = doc.querySelector('[data-case="funnel"]');
  if (fnBox) {
    var FN = { all: [330, 268, 74, 31, 6], ai: [96, 88, 33, 18, 4], ops: [104, 82, 21, 8, 1], mkt: [130, 98, 20, 5, 1] };
    var EARLY = { all: [0.19, 0.11, 0.07, 0.03], ai: [0.31, 0.19, 0.12, 0.05], ops: [0.15, 0.09, 0.06, 0.03], mkt: [0.09, 0.05, 0.03, 0.01] };
    var ST = [W3('Saved', 'Disimpan', 'Bewaard'), W3('Applied', 'Dikirim', 'Verstuurd'), W3('Reply', 'Dibalas', 'Reactie'), W3('Interview', 'Wawancara', 'Gesprek'), W3('Offer', 'Tawaran', 'Aanbod')];
    var BK = [W3('0–3 days', '0–3 hari', '0–3 dagen'), W3('4–7 days', '4–7 hari', '4–7 dagen'), W3('8–14 days', '8–14 hari', '8–14 dagen'), W3('15+ days', '15+ hari', '15+ dagen')];
    var drawFn = function (k) {
      var f = FN[k], e = EARLY[k];
      fnBox.querySelector('[data-fn]').innerHTML = f.map(function (v, i) { return '<div class="fn-row"><span>' + ST[i] + '</span><span class="fn-bar"><i style="width:' + (v / f[0] * 100).toFixed(1) + '%"></i></span><b>' + v + '<small>' + (i ? nf(v / f[i - 1] * 100) + '% ' + W3('of prev.', 'dari sebelumnya', 'van vorige') : '100%') + '</small></b></div>'; }).join('');
      var mx = 0.32;
      fnBox.querySelector('[data-bars]').innerHTML = e.map(function (v) { return '<div><b>' + nf(v * 100) + '%</b><i style="height:' + (v / mx * 100).toFixed(1) + '%"></i></div>'; }).join('');
      var x = fnBox.querySelector('.bars-x'); if (!x) { x = doc.createElement('div'); x.className = 'bars-x'; fnBox.querySelector('[data-bars]').after(x); }
      x.innerHTML = BK.map(function (b) { return '<span>' + b + '</span>'; }).join('');
      var lift = e[0] / e[3];
      fnBox.querySelector('[data-o=take]').innerHTML = W3(
        'The biggest drop is between <b>applied and reply</b> (' + nf(f[2] / f[1] * 100) + '% get an answer). Applying within three days of the ad gives a <b>' + nf(lift, 1) + '× higher</b> interview rate than applying after two weeks. Rule shipped to the agent: apply within 3 days, one application per company.',
        'Penurunan terbesar ada di antara <b>dikirim dan dibalas</b> (' + nf(f[2] / f[1] * 100) + '% mendapat jawaban). Melamar dalam tiga hari setelah iklan terbit memberi tingkat wawancara <b>' + nf(lift, 1) + '× lebih tinggi</b> dibanding melamar setelah dua minggu. Aturan yang dipasang di agent: lamar dalam 3 hari, satu lamaran per perusahaan.',
        'De grootste daling zit tussen <b>verstuurd en reactie</b> (' + nf(f[2] / f[1] * 100) + '% krijgt antwoord). Binnen drie dagen solliciteren geeft een <b>' + nf(lift, 1) + '× hogere</b> gesprekskans dan na twee weken. Regel in de agent: binnen 3 dagen, één sollicitatie per bedrijf.');
    };
    segs(fnBox, 'fam', drawFn); drawFn('all');
  }

  /* C · AI cost per learner */
  var cost = doc.querySelector('[data-case="cost"]');
  if (cost) {
    var CQ = function (s) { return cost.querySelector(s); };
    var SMALL = 0.0034, STRONG = 0.0310, DOC = 0.1103;
    var money = function (v) { return '$' + nf(v, v < 10 ? 2 : 0); };
    var cr = function () {
      var m = +CQ('[data-i=msg]').value, d = +CQ('[data-i=doc]').value / 100, mar = +CQ('[data-i=mar]').value / 100;
      CQ('[data-o=msgv]').textContent = m; CQ('[data-o=docv]').textContent = Math.round(d * 100) + '%'; CQ('[data-o=marv]').textContent = Math.round(mar * 100) + '%';
      var docs = m * d, chats = m - docs;
      var routedChat = chats * SMALL, strongChat = chats * STRONG, docCost = docs * DOC;
      var routed = routedChat + docCost, strong = strongChat + docCost, price = routed / (1 - mar);
      CQ('[data-o=routed]').textContent = money(routed); CQ('[data-o=strong]').textContent = money(strong);
      CQ('[data-o=save]').textContent = nf((1 - routed / strong) * 100) + '%'; CQ('[data-o=price]').textContent = money(price);
      var mx = strong || 1;
      CQ('[data-stack]').innerHTML = [[W3('Routed (Haiku + Sonnet)', 'Routing (Haiku + Sonnet)', 'Gerouteerd (Haiku + Sonnet)'), routedChat, routed], [W3('Sonnet for everything', 'Sonnet untuk semuanya', 'Sonnet voor alles'), strongChat, strong]].map(function (r) { return '<div class="st-row"><span>' + r[0] + '</span><span class="st-bar"><i style="width:' + (r[1] / mx * 100).toFixed(1) + '%"></i><i style="width:' + (docCost / mx * 100).toFixed(1) + '%"></i></span><b>' + money(r[2]) + '</b></div>'; }).join('');
      CQ('[data-o=take]').innerHTML = W3(
        'At <b>' + m + ' messages</b> a month, routing chat to the small model cuts the AI bill per learner from <b>' + money(strong) + '</b> to <b>' + money(routed) + '</b>. Documents now dominate the cost (' + nf(docCost / (routed || 1) * 100) + '%), so the next lever is fewer rewrites, not a cheaper chat model. To keep a ' + Math.round(mar * 100) + '% margin the plan must charge at least <b>' + money(price) + '</b> for this learner.',
        'Dengan <b>' + m + ' pesan</b> sebulan, routing percakapan ke model kecil memangkas biaya AI per pelajar dari <b>' + money(strong) + '</b> menjadi <b>' + money(routed) + '</b>. Kini dokumen mendominasi biaya (' + nf(docCost / (routed || 1) * 100) + '%), jadi pengungkit berikutnya adalah mengurangi tulis ulang, bukan model chat yang lebih murah. Untuk menjaga margin ' + Math.round(mar * 100) + '%, paket harus menagih minimal <b>' + money(price) + '</b> untuk pelajar ini.',
        'Bij <b>' + m + ' berichten</b> per maand verlaagt routering van chat naar het kleine model de AI-kosten per leerling van <b>' + money(strong) + '</b> naar <b>' + money(routed) + '</b>. Documenten domineren nu de kosten (' + nf(docCost / (routed || 1) * 100) + '%), dus de volgende hefboom is minder herschrijven, niet een goedkoper chatmodel. Voor ' + Math.round(mar * 100) + '% marge moet het plan minstens <b>' + money(price) + '</b> rekenen.');
    };
    cost.addEventListener('input', cr); cr();
  }

  /* D · interview scorecard */
  var sc = doc.querySelector('[data-case="score"]');
  if (sc) {
    var rub, cands; try { rub = JSON.parse(sc.dataset.rubric); cands = JSON.parse(sc.dataset.cands); } catch (e) { rub = null; }
    if (rub) {
      var n = rub.length, pt = function (i, v) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [190 + Math.cos(a) * 140 * v / 10, 190 + Math.sin(a) * 140 * v / 10]; };
      var wsum = function (v) { return v.reduce(function (s, x, i) { return s + x * rub[i][1]; }, 0) / 100; };
      var band = function (v) { return v >= 8.5 ? W3('Strong', 'Sangat direkomendasikan', 'Sterk') : v >= 7 ? W3('Recommend', 'Direkomendasikan', 'Aanbevolen') : v >= 5.5 ? W3('Neutral', 'Netral', 'Neutraal') : W3('Below bar', 'Di bawah standar', 'Onder de lat'); };
      var drawSc = function (k) {
        var c = cands[+k], a = wsum(c.a), b = wsum(c.b), comp = (a + b) / 2, gap = Math.abs(a - b);
        sc.querySelector('.rd-a').setAttribute('points', c.a.map(function (v, i) { return pt(i, v).join(','); }).join(' '));
        sc.querySelector('.rd-b').setAttribute('points', c.b.map(function (v, i) { return pt(i, v).join(','); }).join(' '));
        sc.querySelector('[data-o=a]').textContent = nf(a, 2); sc.querySelector('[data-o=b]').textContent = nf(b, 2);
        sc.querySelector('[data-o=c]').textContent = nf(comp, 2); sc.querySelector('[data-o=band]').textContent = band(comp);
        var fl = sc.querySelector('[data-o=flag]'); fl.classList.toggle('is-on', gap >= 3);
        fl.textContent = gap >= 3 ? W3('⚑ Reviewers are ' + nf(gap, 1) + ' points apart: the team discusses before any decision.', '⚑ Penilai berbeda ' + nf(gap, 1) + ' poin: tim berdiskusi sebelum keputusan.', '⚑ Beoordelaars ' + nf(gap, 1) + ' punten uiteen: het team overlegt vóór een besluit.') : W3('Reviewers agree within ' + nf(gap, 1) + ' points.', 'Penilai sepakat dalam selisih ' + nf(gap, 1) + ' poin.', 'Beoordelaars liggen ' + nf(gap, 1) + ' punten uit elkaar.');
        var top = rub.map(function (r, i) { return [r[0], (c.a[i] + c.b[i]) / 2 * r[1]]; }).sort(function (x, y) { return y[1] - x[1]; })[0][0];
        sc.querySelector('[data-o=take]').innerHTML = W3(
          '<b>' + c.name + '</b> scores <b>' + nf(comp, 2) + '</b> → ' + band(comp).toLowerCase() + '. AI tools and editing carry 46% of the weight, so they move the result most; the strongest contribution here is <b>' + top + '</b>. The verdict is computed from the numbers, never typed by an interviewer.',
          '<b>' + c.name + '</b> mendapat <b>' + nf(comp, 2) + '</b> → ' + band(comp).toLowerCase() + '. AI tools dan editing memegang 46% bobot, jadi paling menggerakkan hasil; kontribusi terkuat di sini adalah <b>' + top + '</b>. Kategori dihitung dari angka, tidak pernah diketik pewawancara.',
          '<b>' + c.name + '</b> scoort <b>' + nf(comp, 2) + '</b> → ' + band(comp).toLowerCase() + '. AI-tools en editing dragen 46% van het gewicht en bewegen het resultaat het meest; de sterkste bijdrage hier is <b>' + top + '</b>. Het oordeel wordt berekend, nooit door een interviewer getypt.');
      };
      segs(sc, 'cand', drawSc); drawSc('0');
    }
  }

  /* nightly data checks */
  var qcs = doc.querySelector('.qcs'), qrun = doc.querySelector('[data-qc-run]');
  if (qcs && qrun) {
    var items = [].slice.call(qcs.querySelectorAll('.qc')), sum = doc.querySelector('[data-qc-sum]'), D = qcs.dataset;
    qrun.addEventListener('click', function () {
      var brk = doc.querySelector('[data-qc-break]').checked;
      qrun.disabled = true; sum.className = 'qc-sum'; sum.textContent = '';
      items.forEach(function (it) { it.classList.remove('is-bad'); it.classList.add('is-run'); it.querySelector('[data-qc-res]').textContent = D.lRun; });
      items.forEach(function (it, i) {
        setTimeout(function () {
          it.classList.remove('is-run');
          var bad = brk && it.dataset.qc === 'discount-health';
          it.classList.toggle('is-bad', bad);
          it.querySelector('[data-qc-res]').textContent = bad ? D.lFail : D.lPass + ' · ' + nf(+it.dataset.rows) + ' ' + D.lRows;
          if (i === items.length - 1) { qrun.disabled = false; sum.className = 'qc-sum ' + (brk ? 'is-bad' : 'is-ok'); sum.textContent = brk ? D.lBad : D.lOk; }
        }, reduce ? 0 : 380 + i * 420);
      });
    });
  }

  /* hero: living entity graph (force layout, pulses along relations, pointer-aware) */
  var hero = doc.querySelector('.dm-hero'), cvs = hero && hero.querySelector('.dm-graph');
  if (!cvs || !cvs.getContext) return;
  var data; try { data = JSON.parse(hero.dataset.graph); } catch (e) { return; }
  var ctx = cvs.getContext('2d'); if (!ctx) return;
  var COLORS = ['#9bb6ff', '#ece7dc', '#d9b27a', '#ff7a5c'];
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
      ctx.strokeStyle = lit ? 'rgba(255,122,92,.85)' : 'rgba(236,231,220,.14)'; ctx.lineWidth = lit ? 1.4 : 1;
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
      if (n.hub) { ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(n.x, n.y, r + 5, 0, 6.283); ctx.stroke(); }
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.283); ctx.fill();
      if (n.hub || (hot && hot.n === n) || W > 1100) {
        ctx.font = (n.hub ? '600 ' : '') + '11px ui-monospace, Menlo, monospace';
        ctx.fillStyle = hot && hot.n === n ? '#ffffff' : 'rgba(236,231,220,' + (n.hub ? .9 : .45) + ')';
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
