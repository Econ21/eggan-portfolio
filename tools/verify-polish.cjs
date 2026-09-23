const fs=require('fs'),path=require('path'),assert=require('assert'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(root+'/content.json'));
const tests=[];
function test(name,fn){try{fn();tests.push({name,passed:true})}catch(e){tests.push({name,passed:false,error:e.stack})}}
function dom(locale='en'){return new JSDOM(fs.readFileSync(root+'/'+(locale==='nl'?'':locale+'/')+'index.html','utf8'),{runScripts:'outside-only',url:'https://preview.example/',pretendToBeVisual:true})}
for(const locale of ['en','id','nl']){
 test(locale+': full navigation, original bio and three destinations',()=>{const d=dom(locale),q=s=>d.window.document.querySelector(s),links=[...q('.desktop-nav').querySelectorAll('a')];assert.equal(links.length,7);assert.equal(links.filter(a=>a.hasAttribute('aria-current')).length,1);assert.equal(links[0].getAttribute('aria-current'),'page');for(const slug of ['education','work','research','leadership','contact'])assert(links.some(a=>a.getAttribute('href')===slug+'/index.html'));assert.equal(q('.introduction-body>p').textContent,data.UI.heroSub[locale]);assert.equal(q('.introduction-actions').children.length,3);assert.equal([...q('.introduction-actions').children].map(a=>a.getAttribute('href')).join('|'),'work/index.html|contact/index.html|documents/index.html');assert(q('.header-theme'));d.window.close()});
 test(locale+': five complete journey cards link to three projects and two real works',()=>{const d=dom(locale),cards=[...d.window.document.querySelectorAll('.journey-card')];assert.equal(cards.length,5);assert.equal(new Set(cards.map(c=>c.href)).size,5);assert.equal(cards.filter(c=>c.querySelector('.project-cover')).length,3);assert.equal(cards.filter(c=>c.querySelector('.journey-art')).length,2);for(const card of cards){assert(card.querySelector('.card-open'));assert(!card.innerHTML.includes('reference-art/'));}d.window.close()});
 test(locale+': ten unique creative works with two playable video destinations',()=>{const d=dom(locale),cards=[...d.window.document.querySelectorAll('.featured-work')];assert.equal(cards.length,10);assert.equal(new Set(cards.map(c=>c.href)).size,10);assert.equal(cards.filter(c=>c.dataset.type==='video').length,2);for(const c of cards){const file=path.resolve(root,locale==='nl'?'':locale,c.getAttribute('href'));const detail=new JSDOM(fs.readFileSync(file));assert(detail.window.document.querySelector(c.dataset.type==='video'?'video[controls]':'.media-stage img'));detail.window.close();}assert(d.window.document.querySelector('.creative-stage-bottom>a').href.endsWith('/creative-work/index.html'));d.window.close()});
}
test('Systems covers use complete original screenshots, no reference thumbnails',()=>{const d=dom(),cards=[...d.window.document.querySelectorAll('.product-monument')];assert.equal(cards.length,3);cards.forEach((c,i)=>{const cover=c.querySelector('.project-cover');assert(cover);assert(cover.querySelector('.cover-headline').textContent.length>8);assert(cover.querySelector('.cover-screen img').getAttribute('src').endsWith('assets/work/'+data.PROJECTS[i].dir+'/home.jpg'));assert(!c.innerHTML.includes('reference-art/'))});d.window.close()});
test('Carousel buttons, keyboard, dragging, click suppression, manual takeover and reduced motion',()=>{
 const d=dom(),w=d.window;w.matchMedia=()=>({matches:false});w.requestAnimationFrame=fn=>{fn();return 1};
 const rails=[...w.document.querySelectorAll('.artwork-rail')];
 rails.forEach(rail=>{
  Object.defineProperty(rail,'clientWidth',{value:700});Object.defineProperty(rail,'scrollWidth',{value:rail.children.length*300});
  [...rail.children].forEach((c,i)=>Object.defineProperty(c,'offsetLeft',{value:24+i*300}));
  rail.scrollTo=opts=>{rail.scrollLeft=opts.left;rail.lastBehavior=opts.behavior;rail.dispatchEvent(new w.Event('scroll'))};
 });
 w.eval(fs.readFileSync(root+'/assets/polish.js','utf8'));
 for(const rail of rails){const owner=rail.closest('[data-carousel]'),prev=owner.querySelector('[data-rail-step="-1"]'),next=owner.querySelector('[data-rail-step="1"]');assert(prev.disabled);assert(!next.disabled);next.click();assert.equal(rail.scrollLeft,300);assert.equal(rail.dataset.manual,'true');assert(owner.querySelector('.rail-count').textContent.startsWith('02'));prev.click();assert.equal(rail.scrollLeft,0);rail.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(rail.scrollLeft,300);rail.dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true}));assert(next.disabled);rail.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));assert(prev.disabled);
  function pointer(type,x,target=rail){const e=new w.MouseEvent(type,{clientX:x,clientY:50,button:0,bubbles:true,cancelable:true});Object.defineProperty(e,'pointerType',{value:'mouse'});Object.defineProperty(e,'pointerId',{value:1});target.dispatchEvent(e);}
  pointer('pointerdown',300);pointer('pointermove',100);assert.equal(rail.scrollLeft,200);assert(rail.classList.contains('is-dragging'));pointer('pointerup',100,w);assert(!rail.classList.contains('is-dragging'));
  const dragClick=new w.MouseEvent('click',{bubbles:true,cancelable:true});rail.children[0].dispatchEvent(dragClick);assert(dragClick.defaultPrevented);
  pointer('pointerdown',100);pointer('pointerup',100,w);
  let canceled;rail.children[0].addEventListener('click',e=>{canceled=e.defaultPrevented;e.preventDefault()},{once:true});rail.children[0].dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));assert.equal(canceled,false);
  w.document.documentElement.dataset.motion='off';next.click();assert.equal(rail.lastBehavior,'instant');
 }
 d.window.close();
});
const report={date:new Date().toISOString(),tests,browserVisualQA:JSON.parse(fs.readFileSync(root+'/brief/browser-verification.json','utf8'))};
fs.writeFileSync(root+'/brief/polish-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:tests.filter(t=>t.passed).length,failed:tests.filter(t=>!t.passed)},null,2));if(tests.some(t=>!t.passed))process.exitCode=1;
