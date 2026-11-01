/* Lightweight independent encyclopedia actions. All controls have real behavior. */
(() => {
  'use strict';
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const root = document.documentElement;
  const body = document.body;
  const stored = key => {try{return localStorage.getItem(key)}catch{return null}};
  const save = (key,val) => {try{localStorage.setItem(key,val)}catch{}};

  // Appearance controls modeled after Vector 2022.
  function setTheme(theme){
    if (!['auto','light','dark'].includes(theme)) theme='auto';
    const osPrefersDark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = theme==='auto' ? (osPrefersDark?'dark':'light'):theme;
    root.dataset.themeSetting=theme;
    const control=$(`input[name="page-theme"][value="${theme}"]`);
    if(control) control.checked=true;
    save('uni-wiki-theme',theme);
  }
  function setFontSize(size){
    size=size==='large'?'large':'normal';root.dataset.fontSize=size;
    const control=$(`input[name="font-size"][value="${size}"]`);
    if(control)control.checked=true;save('uni-wiki-font',size);
  }
  function setWidth(width){
    width=width==='wide'?'wide':'standard';root.dataset.width=width;
    const control=$(`input[name="page-width"][value="${width}"]`);
    if(control)control.checked=true;save('uni-wiki-width',width);
  }
  setTheme(stored('uni-wiki-theme')||'light');
  setFontSize(stored('uni-wiki-font')||'normal');
  setWidth(stored('uni-wiki-width')||'standard');
  if(window.matchMedia)window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(root.dataset.themeSetting==='auto')setTheme('auto')});
  $$('input[name="page-theme"]').forEach(el=>el.addEventListener('change',()=>setTheme(el.value)));
  $$('input[name="font-size"]').forEach(el=>el.addEventListener('change',()=>setFontSize(el.value)));
  $$('input[name="page-width"]').forEach(el=>el.addEventListener('change',()=>setWidth(el.value)));

  function setOpen(element, openClass, enable){if(element)element.classList.toggle(openClass,enable)}
  function closeMenu(){const menu=$('#mainmenu');if(menu)menu.hidden=true;$('#mainmenu-toggle')?.setAttribute('aria-expanded','false')}
  $('#mainmenu-toggle')?.addEventListener('click',()=>{
    const menu=$('#mainmenu');if(!menu)return;const nowOpen=menu.hidden;menu.hidden=!nowOpen;
    $('#mainmenu-toggle').setAttribute('aria-expanded',String(nowOpen));
  });
  $('#mainmenu-close')?.addEventListener('click',closeMenu);
  function closeAppear(){setOpen($('#appearance-panel'),'appearance-open',false);$('#appearance-trigger')?.setAttribute('aria-expanded','false')}
  $('#appearance-trigger')?.addEventListener('click',()=>{
    const panel=$('#appearance-panel');if(!panel)return;
    if(panel.hidden){panel.hidden=false;setOpen(panel,'appearance-open',true);$('#appearance-trigger').setAttribute('aria-expanded','true');return;}
    if(!window.matchMedia('(max-width: 1300px)').matches){panel.hidden=true;$('#appearance-trigger').setAttribute('aria-expanded','false');return;}
    const open=!panel.classList.contains('appearance-open');setOpen(panel,'appearance-open',open);
    $('#appearance-trigger').setAttribute('aria-expanded',String(open));
  });
  $('#appearance-close')?.addEventListener('click',()=>{
    if(window.matchMedia('(max-width: 1300px)').matches)closeAppear();
    else { $('#appearance-panel').hidden=true; $('#appearance-trigger')?.setAttribute('aria-expanded','false'); }
  });
  function closeToc(){setOpen($('#wiki-toc'),'toc-open',false);$('#toc-toggle')?.setAttribute('aria-expanded','false')}
  $('#toc-toggle')?.addEventListener('click',()=>{
    const toc=$('#wiki-toc');if(!toc)return;
    const next=!toc.classList.contains('toc-open');setOpen(toc,'toc-open',next);
    $('#toc-toggle').setAttribute('aria-expanded',String(next));
  });
  $('#toc-hide')?.addEventListener('click',()=>{
    if(window.matchMedia('(max-width: 900px)').matches){closeToc()}
    else {body.classList.toggle('toc-hidden');save('uni-wiki-toc',body.classList.contains('toc-hidden')?'hidden':'shown')}
  });
  if(stored('uni-wiki-toc')==='hidden')body.classList.add('toc-hidden');
  $('#toc-restore')?.addEventListener('click',()=>{body.classList.remove('toc-hidden');save('uni-wiki-toc','shown')});
  $('#language-button')?.addEventListener('click',()=>{
    const menu=$('#language-menu');if(!menu)return;menu.hidden=!menu.hidden;
    $('#language-button').setAttribute('aria-expanded',String(!menu.hidden));
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeToc();closeMenu();closeAppear();if($('#language-menu'))$('#language-menu').hidden=true}});
  document.addEventListener('click',e=>{
    if(!e.target.closest('#mainmenu')&&!e.target.closest('#mainmenu-toggle'))closeMenu();
    if(!e.target.closest('#language-menu')&&!e.target.closest('#language-button')){
      const lm=$('#language-menu');if(lm)lm.hidden=true;
      $('#language-button')?.setAttribute('aria-expanded','false');
    }
  });
  $$('.wiki-toc a[href^="#"]').forEach(a=>a.addEventListener('click',closeToc));
  const tocLinks=$$('.wiki-toc nav ol a[href^="#"]');
  if('IntersectionObserver' in window){
    const tracked=tocLinks.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const watch=new IntersectionObserver(entries=>{
      const present=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
      if(!present.length)return;tocLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+present[0].target.id));
    },{rootMargin:'-110px 0px -60% 0px',threshold:0});tracked.forEach(el=>watch.observe(el));
  }
  $('#print-button')?.addEventListener('click',()=>window.print());
  $('#share-button')?.addEventListener('click', async()=>{
    const btn=$('#share-button');const initial=btn.textContent;
    try{await navigator.clipboard.writeText(location.href);btn.textContent='コピーしました'}
    catch{btn.textContent='アドレスバーからコピーしてください'}
    setTimeout(()=>{btn.textContent=initial},2500);
  });
  const results=$('#search-results');
  if(results){
    const params=new URLSearchParams(location.search);
    const query=(params.get('q')||'').trim().slice(0,60);
    const input=$('#q');if(input)input.value=query;
    const status=$('#search-status');
    const data=Array.isArray(window.UNI_SEARCH_INDEX)?window.UNI_SEARCH_INDEX:[];
    if(!query){status.textContent='キーワードを入力すると、事典内の記事を検索できます。';return}
    const terms=query.normalize('NFKC').toLocaleLowerCase('ja').split(/\s+/).filter(Boolean);
    const matches=data.map(item=>{
      const title=item.title.normalize('NFKC').toLocaleLowerCase('ja');
      const details=(item.description+' '+item.keywords.join(' ')).normalize('NFKC').toLocaleLowerCase('ja');
      const ok=terms.every(t=>(title+' '+details).includes(t));
      const score=terms.reduce((n,t)=>n+(title.includes(t)?8:0)+(details.includes(t)?1:0),0);
      return {item,ok,score};
    }).filter(r=>r.ok).sort((a,b)=>b.score-a.score);
    status.textContent='「'+query+'」の検索結果：'+matches.length+'件';
    if(!matches.length){const p=document.createElement('p');p.textContent='一致する記事はありません。別の検索語をお試しください。';results.appendChild(p);return}
    for(const {item} of matches){
      const a=document.createElement('a');a.href=item.url;
      const h=document.createElement('h2');h.textContent=item.title;
      const p=document.createElement('p');p.textContent=item.description;
      a.append(h,p);results.append(a);
    }
  }
})();
