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
