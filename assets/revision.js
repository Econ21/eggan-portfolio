/* 2026 visual revision: scroll-scrubbed scenes and accessible, dependency-free galleries. */
(() => {
  'use strict';
  const root = document.documentElement;
  const q = (s, e = document) => e.querySelector(s);
  const qa = (s, e = document) => [...e.querySelectorAll(s)];
  const lang = root.lang;
  const label = (en, id, nl) => ({en,id,nl}[lang] || en);
  const clamp = n => Math.max(0, Math.min(1, n));
  let framePending = false;
  const opening = q('.opening-scroll');
  const journey = q('.journey-scroll');
  const scenes = qa('.systems-stage, .creative-stage, .creative-index-hero');
  const reduced = () => root.dataset.motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateScenes() {
    framePending = false;
    if (reduced()) return;
    if (opening) {
      const box = opening.getBoundingClientRect();
      const pin = q('.opening-pin', opening);
      const progress = clamp(-box.top / Math.max(1, box.height - innerHeight));
      pin.style.setProperty('--open', progress.toFixed(4));
    }
    if (journey) {
      const box = journey.getBoundingClientRect();
      const progress = clamp((80 - box.top) / Math.max(1, box.height - innerHeight + 80));
      q('.journey-pin', journey).style.setProperty('--travel', progress.toFixed(4));
      const rail = q('.journey-film', journey);
      if (rail && rail.dataset.manual !== 'true') rail.scrollLeft = progress * Math.max(0,rail.scrollWidth - rail.clientWidth);
    }
    scenes.forEach(el => {
      const box = el.getBoundingClientRect();
      if (box.bottom > 0 && box.top < innerHeight) {
        el.style.setProperty('--scene', clamp((innerHeight - box.top) / (innerHeight + box.height)).toFixed(4));
      }
    });
  }
  function scheduleScenes() {
    if (!framePending) { framePending = true; requestAnimationFrame(updateScenes); }
  }
  addEventListener('scroll', scheduleScenes, {passive:true});
  addEventListener('resize', scheduleScenes);
  qa('.motion-toggle').forEach(b => b.addEventListener('click', scheduleScenes));
  updateScenes();

  // Product screenshot gallery: thumbnails, arrows, keyboard, and horizontal swipes.
  const slides = qa('[data-slide]');
  if (slides.length) {
    let current = 0;
    const stage = q('.project-slide');
    const main = q('#project-main-image');
    let startX = null;
    const render = n => {
      current = (n + slides.length) % slides.length;
      const slide = slides[current];
      main.src = slide.dataset.src;
      main.alt = slide.dataset.label;
      stage.href = slide.dataset.src;
      stage.dataset.caption = slide.dataset.label;
      q('#slide-count').textContent = `${String(current + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
      slides.forEach((button, index) => button.setAttribute('aria-pressed', String(index === current)));
      const thumbStrip = q('.project-thumbnails');
      if (typeof thumbStrip.scrollTo === 'function') thumbStrip.scrollTo({left: Math.max(0, slide.offsetLeft - thumbStrip.offsetLeft - thumbStrip.clientWidth / 2 + slide.offsetWidth / 2), behavior: reduced() ? 'instant' : 'smooth'});
    };
    slides.forEach((b, i) => b.addEventListener('click', () => render(i)));
    qa('[data-slide-step]').forEach(b => b.addEventListener('click', () => render(current + Number(b.dataset.slideStep))));
    q('.project-gallery').addEventListener('keydown', e => {
      if (q('dialog[open]')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); render(current + (e.key === 'ArrowRight' ? 1 : -1));
      }
    });
    stage.addEventListener('touchstart', e => {startX = e.touches[0].clientX;}, {passive:true});
    stage.addEventListener('touchend', e => {
      if (startX !== null && Math.abs(e.changedTouches[0].clientX - startX) > 50) {
        render(current + (e.changedTouches[0].clientX < startX ? 1 : -1));
      }
      startX = null;
    }, {passive:true});
  }

  // Progressive archive pagination; the whole archive is available without JavaScript.
  const cards = qa('.media-card');
  if (cards.length) {
    let limit = 20;
    const load = q('#load-more');
    const kind = () => q('.filter[aria-pressed="true"]')?.dataset.filter || 'all';
    const key = 'eggan-gallery-limit';
    try { limit = Math.max(20, Math.min(cards.length, Number(sessionStorage.getItem(key)) || 20)); } catch {}
    function paginate() {
      const filtered = cards.filter(c => kind() === 'all' || c.dataset.type === kind());
      cards.forEach(c => { c.hidden = true; });
      filtered.slice(0,limit).forEach(c => { c.hidden = false; });
      load.hidden = limit >= filtered.length;
      q('#result-count').textContent = `${filtered.length} ${label('works','karya','werken')}`;
      load.setAttribute('aria-label', label('Load more creative works','Muat karya kreatif lainnya','Meer creatief werk laden'));
      try { sessionStorage.setItem(key, String(limit)); } catch {}
    }
    qa('.filter').forEach(b => b.addEventListener('click', () => {limit = 20; paginate();}));
    load.addEventListener('click', () => {
      const previous = cards.filter(c => !c.hidden).length;
      limit += 20; paginate();
      const visible = cards.filter(c => !c.hidden);
      visible[previous]?.focus({preventScroll:true});
    });
    paginate();
    // Restore after media dimensions settle, including explicit Back to archive links.
    try {
      const saved = Number(sessionStorage.getItem('eggan-gallery-scroll') || 0);
      if (saved > 0 && !new URL(location.href).searchParams.has('fresh')) {
        const restore = () => requestAnimationFrame(() => scrollTo(0,saved));
        if (document.readyState === 'complete') restore(); else addEventListener('load', restore, {once:true});
      }
    } catch {}
  }

  const researchButtons = qa('[data-research-filter]');
  researchButtons.forEach(b => b.addEventListener('click', () => {
    const kind = b.dataset.researchFilter;
    researchButtons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const rows = qa('.research-row[data-status]');
    rows.forEach(row => { row.hidden = kind !== 'all' && row.dataset.status !== kind; });
    q('#research-count').textContent = `${rows.filter(r => !r.hidden).length} ${label('works','riset','werken')}`;
  }));

  // Reader thumbnails stay in their own scroll container and expose current page to screen readers.
  const reader = q('.reader');
  if (reader) {
    const original = q('#reader-original');
    const sync = () => {
      const input = q('.page-input');
      input.setAttribute('aria-label', label('Research page number','Nomor halaman riset','Onderzoekspaginanummer'));
      original.download = `${reader.dataset.slug}-${input.value}.jpg`;
    };
    reader.addEventListener('click', sync); sync();
  }
})();
(() => {
  const el = document.querySelector('.document-reader');
  if (!el) return;
  const q = s => document.querySelector(s);
  let page = 1, total = Number(el.dataset.docTotal), prefix = el.dataset.docPrefix, zoom = 1;
  const viewport = q('.document-page-viewport'), image = q('.document-page-image');
  const key = () => 'eggan-document-' + prefix;
  function show(n) {
    page = Math.max(1, Math.min(total, Number(n) || 1));
    image.src = prefix + String(page).padStart(2,'0') + '.jpg';
    image.alt = (q('.document-preview-heading h1')?.textContent || 'Document') + ' — ' + page;
    q('#document-page-number').value = page;
    q('[data-doc-step="-1"]').disabled = page === 1;
    q('[data-doc-step="1"]').disabled = page === total;
    el.querySelectorAll('[data-doc-page]').forEach(b => {
      if (Number(b.dataset.docPage) === page) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
    });
    q('#document-reader-status').textContent = `${page} / ${total}`;
    viewport.scrollTo?.(0,0);
    try {localStorage.setItem(key(),String(page));} catch {}
  }
  function fit() {
    viewport.dataset.fit = q('#document-fit').value;
    viewport.style.setProperty('--doc-zoom',String(zoom));
  }
  function thumbnails() {
    const aside=q('.document-page-thumbs');aside.replaceChildren();
    for(let i=1;i<=total;i++) {
      const button=document.createElement('button');button.dataset.docPage=String(i);button.setAttribute('aria-label','Page '+i);
      const im=document.createElement('img');im.src=prefix+String(i).padStart(2,'0')+'.jpg';im.loading='lazy';im.alt='';
      const caption=document.createElement('span');caption.textContent=String(i);button.append(im,caption);aside.append(button);
    }
  }
  function restored() {try{return Number(localStorage.getItem(key())) || 1;}catch{return 1;}}
  q('.document-page-thumbs').addEventListener('click',e=>{const b=e.target.closest('[data-doc-page]');if(b)show(b.dataset.docPage);});
  el.querySelectorAll('[data-doc-step]').forEach(b=>b.addEventListener('click',()=>show(page+Number(b.dataset.docStep))));
  q('#document-page-number').addEventListener('change',e=>show(e.target.value));
  el.querySelectorAll('[data-doc-zoom]').forEach(b=>b.addEventListener('click',()=>{zoom=Math.max(.5,Math.min(2.5,zoom+Number(b.dataset.docZoom)*.25));fit();}));
  q('#document-fit').addEventListener('change',()=>{zoom=1;fit();});
  document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(page+(e.key==='ArrowRight'?1:-1));}});
  const select=q('#doc-language');
  select?.addEventListener('change',()=>{
    const option=select.options[select.selectedIndex];prefix=option.dataset.prefix;total=Number(option.dataset.total);el.dataset.docPrefix=prefix;el.dataset.docTotal=String(total);
    q('#document-page-total').textContent=String(total);q('#document-page-number').max=String(total);thumbnails();zoom=1;fit();show(restored());
    document.querySelectorAll('[data-document-language]').forEach(b=>b.setAttribute('aria-pressed',String(select.selectedIndex===(b.dataset.documentLanguage==='en'?0:1))));
  });
  document.querySelectorAll('[data-document-language]').forEach(b=>b.addEventListener('click',()=>{select.selectedIndex=b.dataset.documentLanguage==='en'?0:1;select.dispatchEvent(new Event('change',{bubbles:true}));}));
  fit();show(restored());
})();
(() => {
  if (document.body.dataset.route !== '') return;
  const blue = [...document.querySelectorAll('.journey-scroll,.systems-stage')];
  let pending = false;
  const paint = () => {
    pending = false;
    document.body.dataset.headerScene = blue.some(el => {const r=el.getBoundingClientRect();return r.top<70 && r.bottom>70;}) ? 'blue' : 'paper';
  };
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(paint);}},{passive:true});paint();
})();
