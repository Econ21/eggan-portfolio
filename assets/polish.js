/* v2.1: native horizontal scrolling + mouse dragging; links remain real links. */
(() => {
  const reduced = () => document.documentElement.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-carousel]').forEach(collection => {
    const rail = collection.querySelector('.artwork-rail');
    const cards = [...rail.children];
    const previous = collection.querySelector('[data-rail-step="-1"]');
    const next = collection.querySelector('[data-rail-step="1"]');
    const counter = collection.querySelector('.rail-count');
    let scheduled = false, dragging = null, suppressClick = false;
    const maxScroll = () => Math.max(0,rail.scrollWidth - rail.clientWidth);
    const cardOffset = card => card.offsetLeft - cards[0].offsetLeft;
    const manual = () => {rail.dataset.manual = 'true';};
    function update() {
      scheduled = false;
      const x = Math.max(0,rail.scrollLeft), max = maxScroll();
      previous.disabled = x <= 2;
      next.disabled = max <= 2 || x >= max - 2;
      const current = cards.reduce((best,card,index) => Math.abs(cardOffset(card)-x) < Math.abs(cardOffset(cards[best])-x) ? index : best,0);
      counter.textContent = `${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
    }
    const schedule = () => {if (!scheduled) {scheduled=true;requestAnimationFrame(update);}};
    function go(direction) {
      manual();
      const x = rail.scrollLeft;
      let target;
      if (direction > 0) target = cards.map(cardOffset).find(offset=>offset>x+5) ?? maxScroll();
      else target = cards.map(cardOffset).reverse().find(offset=>offset<x-5) ?? 0;
      rail.scrollTo({left:Math.max(0,Math.min(maxScroll(),target)),behavior:reduced()?'instant':'smooth'});
      schedule();
    }
    previous.addEventListener('click',()=>go(-1));
    next.addEventListener('click',()=>go(1));
    rail.addEventListener('scroll',schedule,{passive:true});
    rail.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>1 || e.shiftKey)manual();},{passive:true});
    rail.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowLeft') {e.preventDefault();go(e.key==='ArrowRight'?1:-1);}
      if(e.key==='Home'||e.key==='End') {e.preventDefault();manual();rail.scrollTo({left:e.key==='Home'?0:maxScroll(),behavior:reduced()?'instant':'smooth'});schedule();}
    });
    rail.addEventListener('focusin',manual);
    rail.addEventListener('dragstart',e=>e.preventDefault());
    rail.addEventListener('pointerdown',e=>{
      manual();suppressClick=false;
      if(e.pointerType!=='mouse'||e.button!==0)return;
      dragging={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:rail.scrollLeft,moved:false};
    });
    rail.addEventListener('pointermove',e=>{
      if(!dragging||e.pointerId!==dragging.id)return;
      const distance=e.clientX-dragging.startX;
      if(!dragging.moved && Math.abs(distance)>7 && Math.abs(distance)>Math.abs(e.clientY-dragging.startY)) {
        dragging.moved=true;rail.setPointerCapture?.(e.pointerId);rail.classList.add('is-dragging');
      }
      if(dragging.moved) {e.preventDefault();rail.scrollLeft=dragging.left-distance;schedule();}
    });
    function end(e) {
      if(!dragging||e.pointerId!==dragging.id)return;
      suppressClick=dragging.moved;
      if(rail.hasPointerCapture?.(e.pointerId))rail.releasePointerCapture(e.pointerId);
      dragging=null;rail.classList.remove('is-dragging');schedule();
    }
    window.addEventListener('pointerup',end);
    window.addEventListener('pointercancel',end);
    rail.addEventListener('lostpointercapture',()=>{dragging=null;rail.classList.remove('is-dragging');});
    rail.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false;}},true);
    addEventListener('resize',schedule);
    rail.querySelectorAll('img').forEach(img=>img.addEventListener('load',schedule,{once:true}));
    update();
  });
})();

/* Pratinjau video di galeri (2026-09-23) — pola yang sama dipakai galeri "Our Work" CAP:
   putar otomatis saat kartu terlihat, tapi maksimal 2 video serentak supaya kuota data dan
   CPU tidak jebol (arsip punya 50 video); kursor yang mengarah ke kartu langsung memutar
   video itu. Semua bisu + berulang. Dimatikan kalau pengurangan gerak aktif. */
(() => {
  const videos = [...document.querySelectorAll('.media-video')];
  if (!videos.length) return;
  const reduced = () => document.documentElement.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX = 2;
  const playing = new Set(), queue = [];

  const start = v => { if (playing.has(v)) return; playing.add(v); v.play().catch(() => {}); };
  const stop = v => {
    playing.delete(v);
    const i = queue.indexOf(v); if (i > -1) queue.splice(i, 1);
    try { v.pause(); v.currentTime = 0; } catch {}
    promote();
  };
  function promote() {
    while (playing.size < MAX && queue.length) {
      const v = queue.shift();
      if (v.isConnected && v.dataset.visible === 'true') start(v);
    }
  }
  function request(v) {
    if (playing.has(v) || queue.includes(v)) return;
    if (playing.size < MAX) start(v); else queue.push(v);
  }

  // jsdom (dan peramban lama) tidak punya IntersectionObserver: galeri tetap hidup,
  // hanya kehilangan putar-otomatis — kursor tetap memutar video.
  const hasObserver = typeof IntersectionObserver === 'function';
  const observer = hasObserver && new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const v = entry.target;
      v.dataset.visible = entry.isIntersecting ? 'true' : 'false';
      if (entry.isIntersecting) { if (!reduced()) request(v); }
      else if (!v.dataset.hover) stop(v);
    });
  }, { threshold: 0.5 });

  // Peramban menjeda video begitu tab/jendela disembunyikan. Saat kembali terlihat,
  // video yang masih di layar diputar lagi — tanpa ini galeri tampak "mati" setelah
  // pengguna berpindah tab.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || reduced()) return;
    playing.clear(); queue.length = 0;
    videos.filter(v => v.dataset.visible === 'true').forEach(request);
  });

  videos.forEach(v => {
    if (observer) observer.observe(v);
    const card = v.closest('.media-card, .featured-work') || v;
    // Kursor mengarah: video itu didahulukan, tidak ikut antre.
    card.addEventListener('pointerenter', () => { v.dataset.hover = '1'; playing.add(v); v.play().catch(() => {}); });
    card.addEventListener('pointerleave', () => { delete v.dataset.hover; if (v.dataset.visible !== 'true' || reduced()) stop(v); });
  });
})();
