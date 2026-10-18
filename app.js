(()=>{
'use strict';

/* ============================================================
   Константы и данные
   ============================================================ */
const SB_URL='https://xnxhlfuncxyzdfdmqlkb.supabase.co';
const SB_KEY='sb_publishable_Ij5UIKkrMHbdPOZeSo6gqw_2XkYypC_';   // публичный ключ, доступ только к doom_sync()
const LS_KEY='doom-v4', LS_UI='doom-ui', OLD_KEY='doomsday-watchlist-v3';
const PREMIERE=new Date(2026,11,18);
const CODE_ABC='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const FILMS=window.FILMS;
const slug=s=>s.toLowerCase().replace(/[^a-zа-яё0-9]+/g,'-').slice(0,60);
FILMS.forEach((f,i)=>{f.id=slug(f.t);f.n=i});
const BY_ID=Object.fromEntries(FILMS.map(f=>[f.id,f]));
const FRS=[...new Set(FILMS.map(f=>f.f))];
const PRI={must:'Обязательно',nice:'Желательно',opt:'По желанию'};
const JOKES=[
  'Щёлкнуть пальцами и забыть',
  'Уровень «Нелюдей»',
  'It’s Morbin’ time',
  'Скучнее брифинга Щ.И.Т.',
  'Ну, шаурма после титров была',
  'Крепкий середняк Фазы 2',
  'Кэп одобряет, но без восторга',
  '«Я понял эту отсылку»',
  '«Мстители, общий сбор!»',
  'Я люблю тебя 3000',
];
const DEF_PREFS={level:'all',status:'all',fr:[],compact:false,collapseDone:true,showHidden:false};

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const mqDesk=matchMedia('(min-width:1080px)');

/* ============================================================
   Хранилище: всё — пары ключ → запись с меткой времени u.
   i:<id> — фильм {w,r,dt,h}, p:<имя> — настройка {v}.
   ============================================================ */
let store={code:'',data:{},pending:{},lastSync:0};
let ui={collapsed:{}};

function genCode(){
  const a=new Uint8Array(20); crypto.getRandomValues(a);
  return [...a].map(x=>CODE_ABC[x&31]).join('');
}
const fmtCode=c=>c.replace(/(.{5})(?=.)/g,'$1-');
const normCode=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');

function loadStore(){
  try{ const s=JSON.parse(localStorage.getItem(LS_KEY)); if(s&&s.code){ store={...store,...s}; return; } }catch(e){}
  store.code=genCode();
  // Перенос отметок этого браузера из прошлой версии сайта, если они были
  let old=null; try{ old=JSON.parse(localStorage.getItem(OLD_KEY)); }catch(e){}
  for(const [k,v] of Object.entries(old||{})){
    if(k.startsWith('__')||!BY_ID[k]||!v) continue;
    store.data['i:'+k]={w:1,r:v.r||'',dt:v.dt||'',h:0,u:1};   // u:1 — облако всегда важнее
  }
  store.pending={...store.data};
  persist();
}
function persist(){ try{ localStorage.setItem(LS_KEY,JSON.stringify(store)); }catch(e){} }
function loadUI(){ try{ ui={...ui,...JSON.parse(localStorage.getItem(LS_UI))}; }catch(e){} }
function saveUI(){ try{ localStorage.setItem(LS_UI,JSON.stringify(ui)); }catch(e){} }

const rec=id=>store.data['i:'+id]||null;
const isDone=id=>!!(rec(id)&&rec(id).w);
const isHidden=id=>!!(rec(id)&&rec(id).h);
function put(key,patch){
  const prev=store.data[key]||{};
  const r={...prev,...patch,u:Math.max(Date.now(),(prev.u||0)+1)};
  store.data[key]=r; store.pending[key]=r;
}
function setItem(id,patch){ put('i:'+id,{w:0,r:'',dt:'',h:0,...rec(id),...patch}); persist(); Sync.schedule(); }
function pref(n){ const r=store.data['p:'+n]; return r&&r.v!==undefined?r.v:DEF_PREFS[n]; }
function setPref(n,v){ put('p:'+n,{v}); persist(); Sync.schedule(); }

/* ============================================================
   Синхронизация: Supabase RPC (слияние по времени) + Realtime-пинг
   ============================================================ */
const Sync={
  state:'busy', timer:0, inflight:false, again:false, fails:0,
  set(s){ this.state=s; renderSyncIndicators(); },
  schedule(ms=450){ clearTimeout(this.timer); this.timer=setTimeout(()=>this.run(),ms); },
  async rpc(patch){
    const res=await fetch(SB_URL+'/rest/v1/rpc/doom_sync',{
      method:'POST',headers:{'apikey':SB_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({p_code:store.code,p_patch:patch}),cache:'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    return res.json();
  },
  async run(){
    if(this.inflight){ this.again=true; return; }
    if(!navigator.onLine){ this.set('off'); return; }
    this.inflight=true; this.set('busy');
    const code=store.code, sent={...store.pending};
    try{
      const remote=await this.rpc(sent);
      if(code!==store.code) return;                       // код сменили, пока шёл запрос
      for(const [k,v] of Object.entries(sent)) if(store.pending[k]&&store.pending[k].u===v.u) delete store.pending[k];
      const changed=this.merge(remote||{});
      store.lastSync=Date.now(); persist();
      this.fails=0; this.set('ok');
      if(Object.keys(sent).length) RT.ping();
      if(changed.size) onRemoteChange(changed);
    }catch(e){
      this.fails++; this.set(navigator.onLine?'err':'off');
      this.schedule(Math.min(30000,1000*2**this.fails));
    }finally{
      this.inflight=false;
      if(this.again){ this.again=false; this.schedule(60); }
    }
  },
  merge(remote){
    const changed=new Set();
    for(const [k,v] of Object.entries(remote)){
      const loc=store.data[k];
      if(!loc||(v.u||0)>(loc.u||0)){ store.data[k]=v; delete store.pending[k]; changed.add(k); }
      else if((loc.u||0)>(v.u||0)&&!store.pending[k]) store.pending[k]=loc;
    }
    for(const k in store.data) if(!(k in remote)&&!store.pending[k]) store.pending[k]=store.data[k];
    if(Object.keys(store.pending).length) this.schedule(300);
    return changed;
  },
};

// Realtime Broadcast: устройства пингуют друг друга «изменилось — заберите»
const RT={
  ws:null, ref:0, joinRef:'', topic:'', hb:0, backoff:1000, joined:false, retryT:0,
  async start(){
    let h=store.code;
    try{ const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('doom:'+store.code));
      h=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,32); }catch(e){}
    this.topic='realtime:doom-'+h;
    this.connect();
  },
  connect(){
    clearTimeout(this.retryT);
    if(this.ws){ this.ws.onclose=null; try{ this.ws.close(); }catch(e){} }
    this.joined=false;
    let ws;
    try{ ws=new WebSocket(SB_URL.replace(/^http/,'ws')+'/realtime/v1/websocket?apikey='+encodeURIComponent(SB_KEY)+'&vsn=1.0.0'); }
    catch(e){ return; }
    this.ws=ws;
    ws.onopen=()=>{
      this.backoff=1000;
      this.joinRef=String(++this.ref);
      this.raw({topic:this.topic,event:'phx_join',payload:{config:{broadcast:{self:false,ack:false},presence:{key:''},private:false}},ref:this.joinRef,join_ref:this.joinRef});
      clearInterval(this.hb);
      this.hb=setInterval(()=>this.raw({topic:'phoenix',event:'heartbeat',payload:{},ref:String(++this.ref)}),25000);
    };
    ws.onmessage=e=>{
      let m; try{ m=JSON.parse(e.data); }catch(_){ return; }
      if(m.topic!==this.topic) return;
      if(m.event==='phx_reply'&&m.ref===this.joinRef&&m.payload&&m.payload.status==='ok') this.joined=true;
      if(m.event==='broadcast'&&m.payload&&m.payload.event==='changed') Sync.schedule(80);
    };
    ws.onclose=()=>{
      this.joined=false; clearInterval(this.hb);
      this.retryT=setTimeout(()=>{ if(document.visibilityState==='visible') this.connect(); },this.backoff);
      this.backoff=Math.min(this.backoff*2,30000);
    };
  },
  raw(m){ if(this.ws&&this.ws.readyState===1) this.ws.send(JSON.stringify(m)); },
  ping(){ if(this.joined) this.raw({topic:this.topic,event:'broadcast',payload:{type:'broadcast',event:'changed',payload:{}},ref:String(++this.ref),join_ref:this.joinRef}); },
  ensure(){ if(!this.ws||this.ws.readyState>1) this.connect(); },
};

function onRemoteChange(changed){
  const keys=[...changed];
  if(keys.some(k=>k.startsWith('p:'))){ renderAll(); return; }
  const before=$$('.card',listEl).map(c=>c.dataset.id).join(',');
  const after=FILMS.filter(f=>visible(f)).map(f=>f.id).join(',');
  if(before!==after){ renderAll(); return; }
  for(const k of keys){ const id=k.slice(2); if(BY_ID[id]) refreshCard(id); }
  refreshMeta();
}

/* ============================================================
   Фильтрация
   ============================================================ */
let q='';
function visible(f,{status=true,search=true}={}){
  const lvl=pref('level');
  if(lvl==='must'&&f.p!=='must') return false;
  if(lvl==='noopt'&&f.p==='opt') return false;
  const fr=pref('fr'); if(fr.length&&!fr.includes(f.f)) return false;
  if(isHidden(f.id)&&!pref('showHidden')) return false;
  if(status){ const st=pref('status'); if(st==='left'&&isDone(f.id)) return false; if(st==='done'&&!isDone(f.id)) return false; }
  if(search&&q){ const s=(f.t+' '+f.w+' '+f.f+' '+f.y+' '+f.d).toLowerCase(); if(!q.split(/\s+/).every(w=>s.includes(w))) return false; }
  return true;
}
const inScope=f=>visible(f,{status:false,search:false});
function yearStats(y){
  const s=FILMS.filter(f=>f.y===y&&inScope(f));
  return {done:s.filter(f=>isDone(f.id)).length,total:s.length};
}
function isClosed(y){
  if(q) return false;
  if(y in ui.collapsed) return ui.collapsed[y];
  const s=yearStats(y); return pref('collapseDone')&&s.total>0&&s.done===s.total;
}
function nextFilm(){ return FILMS.find(f=>!isDone(f.id)&&!isHidden(f.id)&&inScope(f))||null; }

/* ============================================================
   Рендер списка
   ============================================================ */
const listEl=$('#list');
const I_EYE_OFF='<svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4 9.5 6-.4.9-1.3 2.3-2.6 3.6M6.4 7.4C4.6 8.6 3.2 10.4 2.5 12c1 2 4.5 6 9.5 6 1.6 0 3-.4 4.3-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const I_EYE='<svg viewBox="0 0 24 24"><path d="M2.5 12C3.5 10 7 6 12 6s8.5 4 9.5 6c-1 2-4.5 6-9.5 6s-8.5-4-9.5-6z"/><circle cx="12" cy="12" r="3"/></svg>';
const I_CHEV='<svg class="year-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';

function unitLabel(f){ return ICONS.has(f.i)?ICONS.noun(f.i,10):f.i; }
function capHTML(f,v){
  if(!v) return `<span>Сколько ${unitLabel(f)} из 10?</span>`;
  return `<b>${v} из 10 ${unitLabel(f)}</b><span>${esc(JOKES[v-1])}</span><button type="button" class="link" data-a="clear">сбросить</button>`;
}
function rateHTML(f,r){
  const v=+r.r||0; let b='';
  for(let i=1;i<=10;i++) b+=`<button type="button" role="radio" aria-checked="${i===v}" aria-label="${i} из 10" data-v="${i}" class="${i<=v?'on':''}" style="--i:${i}">${ICONS.html(f.i)}</button>`;
  return `<div class="c-rate">
    <div class="rate" role="radiogroup" aria-label="Оценка «${esc(f.t)}»">${b}</div>
    <div class="rate-cap">${capHTML(f,v)}</div>
    <label class="c-date">Дата просмотра <input type="date" value="${esc(r.dt||'')}" max="${today()}"></label>
  </div>`;
}
function cardHTML(f){
  const r=rec(f.id)||{}, done=!!r.w, hid=!!r.h;
  return `<article class="card p-${f.p}${done?' done':''}${hid?' is-hidden':''}" data-id="${f.id}" id="f-${f.id}">
    ${f.img?`<img class="pbg" src="${f.img}" alt="" loading="lazy" decoding="async">`:ICONS.html(f.i,'wm')}
    <button type="button" class="chk" data-a="done" aria-pressed="${done}" aria-label="${done?'Снять отметку':'Отметить просмотренным'}: ${esc(f.t)}"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>
    <div class="c-body">
      <h3 class="c-title">${esc(f.t)}</h3>
      <div class="c-meta"><span class="pri">${PRI[f.p]}</span><span>${esc(f.d)}</span><span>${esc(f.f)}</span></div>
      <p class="c-why">${esc(f.w)}</p>
    </div>
    <div class="c-act"><button type="button" class="icon-btn" data-a="hide" aria-label="${hid?'Вернуть в список':'Скрыть из списка'}" title="${hid?'Вернуть':'Скрыть'}">${hid?I_EYE:I_EYE_OFF}</button></div>
    ${done?rateHTML(f,r):''}
  </article>`;
}
function yearHeadInner(y){
  const s=yearStats(y), p=s.total?Math.round(s.done/s.total*100):0;
  return `<span class="year-n">${y}</span><span class="year-bar" style="--p:${p}%"><i></i></span><span class="year-c">${s.done}/${s.total}</span>${I_CHEV}`;
}
function yearSumText(y){
  const s=FILMS.filter(f=>f.y===y&&inScope(f));
  const rs=s.map(f=>+(rec(f.id)||{}).r).filter(Boolean);
  const avg=rs.length?` · средняя ${(rs.reduce((a,b)=>a+b,0)/rs.length).toFixed(1)}`:'';
  const left=s.filter(f=>!isDone(f.id)).length;
  return left?`Свёрнуто · впереди ${left}${avg}`:`Всё просмотрено ✓${avg}`;
}

function renderList(){
  listEl.classList.toggle('compact',!!pref('compact'));
  const groups=new Map();
  for(const f of FILMS){ if(!visible(f)) continue; if(!groups.has(f.y)) groups.set(f.y,[]); groups.get(f.y).push(f); }
  if(!groups.size){
    listEl.innerHTML=`<div class="empty">${ICONS.html('doom')}<b>${q?'Ничего не нашлось':'Пусто'}</b>${q?'Даже Доктор Стрэндж не видит такого варианта будущего.':'Под эти фильтры ничего не подходит.'}<div class="row-btns" style="justify-content:center"><button type="button" class="btn" data-act="resetFilters">Сбросить фильтры</button></div></div>`;
    renderYearNav([]); return;
  }
  let html='';
  for(const [y,films] of groups){
    const s=yearStats(y), closed=isClosed(y);
    html+=`<section class="year${closed?' closed':''}${s.total&&s.done===s.total?' full':''}" id="y-${y}" data-y="${y}">
      <button type="button" class="year-h" aria-expanded="${!closed}" data-a="year">${yearHeadInner(y)}</button>
      <div class="year-sum">${yearSumText(y)}</div>
      <div class="year-body"><div class="year-inner">${films.map(cardHTML).join('')}</div></div>
    </section>`;
  }
  listEl.innerHTML=html;
  observeReveal();
  renderYearNav([...groups.keys()]);
  requestAnimationFrame(onScroll);
}
function refreshCard(id){
  const old=$('#f-'+CSS.escape(id)); if(!old) return null;
  const t=document.createElement('div'); t.innerHTML=cardHTML(BY_ID[id]);
  const el=t.firstElementChild; el.classList.add('in');
  old.replaceWith(el); return el;
}
function refreshYear(y){
  const sec=$('#y-'+y); if(!sec) return;
  const s=yearStats(y);
  $('.year-h',sec).innerHTML=yearHeadInner(y);
  $('.year-sum',sec).textContent=yearSumText(y);
  sec.classList.toggle('full',s.total>0&&s.done===s.total);
}
function refreshMeta(){
  $$('.year',listEl).forEach(s=>refreshYear(+s.dataset.y));
  renderStats(); renderNext(); renderYearNav(); syncControls();
}
function renderAll(){ syncControls(); renderStats(); renderNext(); renderList(); }

// Появление карточек при прокрутке
let revealIO=null, revealBatch=0, revealFrame=0;
function observeReveal(){
  if(reduced()||!('IntersectionObserver' in window)){ listEl.classList.remove('reveal'); return; }
  listEl.classList.add('reveal');
  if(!revealIO) revealIO=new IntersectionObserver(es=>{
    for(const e of es){
      if(!e.isIntersecting) continue;
      const delay=Math.min(revealBatch++,8)*35;
      e.target.style.transitionDelay=delay+'ms';
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
      setTimeout(()=>{ e.target.style.transitionDelay=''; },delay+600);
    }
    cancelAnimationFrame(revealFrame); revealFrame=requestAnimationFrame(()=>{ revealBatch=0; });
  },{rootMargin:'0px 0px -6% 0px'});
  $$('.card',listEl).forEach(c=>revealIO.observe(c));
}

/* ============================================================
   Навигация по годам, статистика, «дальше»
   ============================================================ */
let navYears=[];
function renderYearNav(years){
  if(years) navYears=years;
  const h=navYears.map(y=>{
    const s=yearStats(y), p=s.total?Math.round(s.done/s.total*100):0;
    return `<button type="button" class="ychip${p===100?' full':''}" data-y="${y}" style="--p:${p}%" aria-label="${y}: ${s.done} из ${s.total}">${y}</button>`;
  }).join('');
  $('#yearChips').innerHTML=h; $('#yearGrid').innerHTML=h;
  activeYear=null; onScroll();
}
function jumpToYear(y){
  const sec=$('#y-'+y); if(!sec) return;
  if(sec.classList.contains('closed')){ ui.collapsed[y]=false; saveUI(); setClosed(sec,false); }
  sec.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
}
function setClosed(sec,closed){
  sec.classList.toggle('closed',closed);
  $('.year-h',sec).setAttribute('aria-expanded',String(!closed));
}

function renderStats(){
  const scope=FILMS.filter(inScope);
  const done=scope.filter(f=>isDone(f.id)).length;
  const must=FILMS.filter(f=>f.p==='must'), mustDone=must.filter(f=>isDone(f.id)).length;
  const rs=FILMS.map(f=>+(rec(f.id)||{}).r).filter(Boolean);
  const avg=rs.length?(rs.reduce((a,b)=>a+b,0)/rs.length).toFixed(1):'—';
  const pct=scope.length?Math.round(done/scope.length*100):0;
  const C=2*Math.PI*36, Cm=2*Math.PI*27;
  const html=`<div class="stats">
    <div class="ring" role="img" aria-label="Просмотрено ${pct}%">
      <svg viewBox="0 0 84 84"><circle class="rt" cx="42" cy="42" r="36"/><circle class="rv" cx="42" cy="42" r="36" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}"/>
        <circle class="rt" cx="42" cy="42" r="27" style="stroke-width:3"/><circle class="rm" cx="42" cy="42" r="27" stroke-dasharray="${Cm}" stroke-dashoffset="${Cm*(1-mustDone/must.length)}"/></svg>
      <div class="ring-c"><div><b>${pct}%</b><small>готово</small></div></div>
    </div>
    <div class="st-list">
      <div class="st"><span>Просмотрено</span><b>${done}<small> / ${scope.length}</small></b></div>
      <div class="st"><span>Обязательное</span><b>${mustDone}<small> / ${must.length}</small></b></div>
      <div class="st"><span>Средняя</span><b>${avg}${rs.length?'<small> / 10</small>':''}</b></div>
      <div class="st"><span>Впереди</span><b>${scope.length-done}</b></div>
    </div></div>`;
  $$('[data-stats]').forEach(el=>{
    const old=el.querySelectorAll('circle.rv, circle.rm');
    const prev=[...old].map(c=>c.getAttribute('stroke-dashoffset'));
    el.innerHTML=html;
    // плавная анимация кольца от прошлого значения
    if(prev.length){ const now=el.querySelectorAll('circle.rv, circle.rm');
      now.forEach((c,i)=>{ const to=c.getAttribute('stroke-dashoffset'); c.style.transition='none'; c.setAttribute('stroke-dashoffset',prev[i]);
        requestAnimationFrame(()=>requestAnimationFrame(()=>{ c.style.transition=''; c.setAttribute('stroke-dashoffset',to); })); }); }
  });
}
function renderNext(){
  const f=nextFilm(), box=$('#nextCard');
  $$('[data-next-title]').forEach(e=>e.textContent=f?f.t:'Всё просмотрено');
  if(!f){
    box.innerHTML=`<div class="next-done">${ICONS.html('doom')}<br><b>Вы готовы к Судному дню</b><p class="next-why">Всё из выбранного просмотрено. Дум одобряет. Наверное.</p></div>`;
    return;
  }
  box.innerHTML=`<div class="next-k">▶ Следующий на очереди</div>
    <div class="next-row">${f.img?`<img class="next-poster" src="${f.img}" alt="Постер «${esc(f.t)}»" decoding="async">`:ICONS.html(f.i)}<div><div class="next-t">${esc(f.t)}</div><div class="next-d">${esc(f.d)} · ${esc(f.f)} · ${PRI[f.p].toLowerCase()}</div></div></div>
    <p class="next-why">${esc(f.w)}</p>
    <div class="next-btns"><button type="button" class="btn btn-primary btn-sm" data-act="markNext">✓ Посмотрел</button><button type="button" class="btn btn-sm" data-act="next">Показать в списке</button></div>`;
}
function goNext(){
  const f=nextFilm();
  if(!f){ toast('Всё просмотрено — вы готовы к Судному дню'); return; }
  let rerender=false;
  if(q){ q=''; $('#q').value=''; rerender=true; }
  if(pref('status')==='done'){ setPref('status','all'); rerender=true; }
  if(ui.collapsed[f.y]!==false&&isClosed(f.y)){ ui.collapsed[f.y]=false; saveUI(); rerender=true; }
  if(rerender) renderAll();
  closeSheets();
  const el=$('#f-'+CSS.escape(f.id)); if(!el) return;
  el.classList.add('in');
  el.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});
  el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  setTimeout(()=>{ const b=$('.chk',el); b&&b.focus({preventScroll:true}); },500);
}

/* ============================================================
   Действия с карточками
   ============================================================ */
function toggleDone(id,fromNext){
  const f=BY_ID[id], was=isDone(id);
  const yBefore=yearStats(f.y);
  if(was) setItem(id,{w:0}); else setItem(id,{w:1,dt:(rec(id)&&rec(id).dt)||today()});
  const el=refreshCard(id);
  if(el&&!was&&!reduced()){ el.classList.add('flash-done'); setTimeout(()=>el.classList.remove('flash-done'),1500); }
  refreshMeta();
  if(!was){
    const ya=yearStats(f.y);
    const mustAll=FILMS.filter(x=>x.p==='must'), mustDone=mustAll.filter(x=>isDone(x.id)).length;
    if(f.p==='must'&&mustDone===mustAll.length) toast('Всё обязательное просмотрено. Судный день, мы готовы! 🟢');
    else if(ya.done===ya.total&&yBefore.done<ya.total) toast(`${f.y} — закрыт! ${ya.total} из ${ya.total} ✓`);
    else if(fromNext) toast(`Отмечено: ${f.t}`,{label:'Отменить',fn:()=>toggleDone(id)});
  }else{
    toast(`Отметка снята: ${f.t}`,{label:'Вернуть',fn:()=>toggleDone(id)});
  }
  const st=pref('status');
  if((st==='left'&&!was)||(st==='done'&&was)) setTimeout(renderList,1100);
}
function toggleHidden(id){
  const f=BY_ID[id], hid=isHidden(id);
  setItem(id,{h:hid?0:1});
  if(!hid&&!pref('showHidden')){
    const el=$('#f-'+CSS.escape(id));
    const done=()=>{ renderList(); refreshMeta(); };
    if(el&&!reduced()){
      el.style.transition='opacity .25s, transform .25s'; el.style.opacity='0'; el.style.transform='translateX(24px)';
      setTimeout(done,250);
    }else done();
    toast(`Скрыто: ${f.t}`,{label:'Отменить',fn:()=>toggleHidden(id)});
  }else{
    if(hid&&!$('#f-'+CSS.escape(id))) renderList(); else refreshCard(id);
    refreshMeta();
    if(hid) toast(`Возвращено: ${f.t}`);
  }
}
function setRating(id,v,btnEl){
  const r=rec(id); if(!r||!r.w) return;
  setItem(id,{r:v?String(v):''});
  const card=$('#f-'+CSS.escape(id)), f=BY_ID[id];
  $$('.rate button',card).forEach(b=>{
    const n=+b.dataset.v, on=n<=v;
    b.classList.toggle('on',on); b.setAttribute('aria-checked',String(n===v));
    b.classList.remove('pop'); if(on&&!reduced()){ void b.offsetWidth; b.classList.add('pop'); }
  });
  $('.rate-cap',card).innerHTML=capHTML(f,v);
  if(v===10&&!reduced()) burst(btnEl||$('.rate',card),f.i);
  renderStats(); refreshYear(f.y);
}
function burst(el,icon){
  const r=el.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
  for(let i=0;i<14;i++){
    const s=document.createElement('div'); s.className='burst'; s.innerHTML=ICONS.html(icon);
    const a=Math.PI*2*i/14+Math.random()*.4, d=80+Math.random()*90;
    s.style.left=(cx-15)+'px'; s.style.top=(cy-15)+'px';
    s.style.setProperty('--dx',Math.cos(a)*d+'px'); s.style.setProperty('--dy',(Math.sin(a)*d-40)+'px');
    s.style.setProperty('--rot',(Math.random()*120-60)+'deg');
    document.body.appendChild(s); setTimeout(()=>s.remove(),950);
  }
}

listEl.addEventListener('click',e=>{
  const yb=e.target.closest('[data-a="year"]');
  if(yb){ const sec=yb.closest('.year'), y=+sec.dataset.y, c=!sec.classList.contains('closed');
    ui.collapsed[y]=c; saveUI(); setClosed(sec,c); return; }
  const card=e.target.closest('.card'); if(!card) return;
  const id=card.dataset.id;
  const a=e.target.closest('[data-a]');
  const rb=e.target.closest('.rate button');
  if(rb){ setRating(id,+rb.dataset.v,rb); return; }
  if(a&&a.dataset.a==='done'){ toggleDone(id); return; }
  if(a&&a.dataset.a==='hide'){ toggleHidden(id); return; }
  if(a&&a.dataset.a==='clear'){ setRating(id,0); return; }
  // тап по названию/описанию карточки тоже отмечает (как раньше)
  if(e.target.closest('.c-body')&&!window.getSelection().toString()) toggleDone(id);
});
listEl.addEventListener('change',e=>{
  if(e.target.matches('.c-date input')){ const id=e.target.closest('.card').dataset.id; setItem(id,{dt:e.target.value}); }
});
// Превью оценки при наведении мышью
listEl.addEventListener('pointerover',e=>{
  if(e.pointerType!=='mouse') return;
  const b=e.target.closest('.rate button'); if(!b) return;
  const rate=b.parentElement, v=+b.dataset.v;
  rate.classList.add('preview');
  $$('button',rate).forEach(x=>x.classList.toggle('pv',+x.dataset.v<=v));
  const card=rate.closest('.card'), f=BY_ID[card.dataset.id];
  const cap=$('.rate-cap',card); if(!cap.dataset.keep) cap.dataset.keep=cap.innerHTML;
  cap.innerHTML=`<b>${v} из 10 ${unitLabel(f)}</b><span>${esc(JOKES[v-1])}</span>`;
});
listEl.addEventListener('pointerout',e=>{
  const rate=e.target.closest('.rate'); if(!rate||rate.contains(e.relatedTarget)) return;
  rate.classList.remove('preview'); $$('button',rate).forEach(x=>x.classList.remove('pv'));
  const cap=$('.rate-cap',rate.closest('.card'));
  if(cap.dataset.keep!==undefined){ const f=BY_ID[rate.closest('.card').dataset.id]; cap.innerHTML=capHTML(f,+(rec(f.id)||{}).r||0); delete cap.dataset.keep; }
});

/* ============================================================
   Фильтры (один экземпляр: в боковой панели или в шторке)
   ============================================================ */
const filtersEl=$('#filtersTpl').content.firstElementChild.cloneNode(true);
function placeFilters(){
  const home=mqDesk.matches?$('#filtersHomeSide'):$('#filtersHomeSheet');
  if(filtersEl.parentElement!==home) home.appendChild(filtersEl);
  if(mqDesk.matches) closeSheets();
}
function syncControls(){
  $$('.seg[data-pref]').forEach(seg=>{
    const v=pref(seg.dataset.pref);
    $$('button',seg).forEach(b=>b.setAttribute('aria-checked',String(b.dataset.v===v)));
  });
  $$('input[type=checkbox][data-pref]').forEach(i=>{ i.checked=!!pref(i.dataset.pref); });
  $$('select[data-pref-select]').forEach(sel=>{ sel.value=pref(sel.dataset.prefSelect); sel.parentElement.classList.toggle('on',sel.value!=='all'); });
  const fr=pref('fr');
  const base=FILMS.filter(f=>!isHidden(f.id)||pref('showHidden'));
  const byFr=f=>!fr.length||fr.includes(f.f);
  const cnt={all:base.filter(byFr).length,noopt:base.filter(f=>byFr(f)&&f.p!=='opt').length,must:base.filter(f=>byFr(f)&&f.p==='must').length};
  $$('[data-count]',filtersEl).forEach(s=>s.textContent=cnt[s.dataset.count]);
  const lvl=pref('level');
  $('#frChips',filtersEl).innerHTML=FRS.map(name=>{
    const n=base.filter(f=>f.f===name&&(lvl==='all'||(lvl==='must'?f.p==='must':f.p!=='opt'))).length;
    return `<button type="button" class="chip" data-fr="${esc(name)}" aria-pressed="${fr.includes(name)}">${esc(name)}<small>${n}</small></button>`;
  }).join('');
  const hidN=FILMS.filter(f=>isHidden(f.id)).length;
  $('#hiddenN',filtersEl).textContent=hidN?`(${hidN})`:'';
  const active=(lvl!=='all')+(pref('status')!=='all')+(fr.length>0)+(!!pref('showHidden'))+(!!pref('compact'));
  const badge=$('#filterBadge'); badge.hidden=!active; badge.textContent=active;
}
document.addEventListener('click',e=>{
  const sb=e.target.closest('.seg[data-pref] button');
  if(sb){ const name=sb.closest('.seg').dataset.pref; if(pref(name)!==sb.dataset.v){ setPref(name,sb.dataset.v); renderAll(); } return; }
  const chip=e.target.closest('[data-fr]');
  if(chip){ const name=chip.dataset.fr, fr=[...pref('fr')]; const i=fr.indexOf(name); i<0?fr.push(name):fr.splice(i,1);
    setPref('fr',fr.length===FRS.length?[]:fr); renderAll(); return; }
});
filtersEl.addEventListener('change',e=>{
  if(e.target.matches('input[data-pref]')){ setPref(e.target.dataset.pref,e.target.checked);
    if(e.target.dataset.pref==='collapseDone'){ ui.collapsed={}; saveUI(); }
    renderAll(); }
});
$$('select[data-pref-select]').forEach(sel=>sel.addEventListener('change',()=>{ setPref(sel.dataset.prefSelect,sel.value); renderAll(); }));
$('#frAll',filtersEl).addEventListener('click',()=>{ setPref('fr',[]); renderAll(); });
$('#fReset',filtersEl).addEventListener('click',resetFilters);
function resetFilters(){
  for(const n of ['level','status','fr']) if(JSON.stringify(pref(n))!==JSON.stringify(DEF_PREFS[n])) setPref(n,DEF_PREFS[n]);
  if(pref('showHidden')) setPref('showHidden',false);
  q=''; $('#q').value=''; renderAll(); toast('Фильтры сброшены');
}

/* ============================================================
   Поиск
   ============================================================ */
let qT=0;
$('#q').addEventListener('input',e=>{
  clearTimeout(qT);
  qT=setTimeout(()=>{ q=e.target.value.trim().toLowerCase(); renderList(); },120);
});
$('#q').addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.target.value=''; q=''; renderList(); e.target.blur(); } });

/* ============================================================
   Шторки (dialog)
   ============================================================ */
function openSheet(d){
  if(d.open) return;
  $$('dialog[open]').forEach(x=>x!==d&&closeSheet(x,true));
  d.classList.remove('closing'); d.showModal(); document.documentElement.classList.add('modal-open');
}
function closeSheet(d,instant){
  if(!d.open) return;
  const fin=()=>{ d.classList.remove('closing'); d.style.transform=''; d.close(); if(!$('dialog[open]')) document.documentElement.classList.remove('modal-open'); };
  if(instant||reduced()) return fin();
  d.classList.add('closing'); setTimeout(fin,200);
}
function closeSheets(){ $$('dialog[open]').forEach(d=>closeSheet(d)); }
$$('dialog').forEach(d=>{
  d.addEventListener('click',e=>{ if(e.target===d||e.target.closest('[data-close]')) closeSheet(d); });
  d.addEventListener('cancel',e=>{ e.preventDefault(); closeSheet(d); });
  // свайп вниз закрывает шторку на телефоне
  let y0=null,dy=0;
  d.addEventListener('touchstart',e=>{ if(innerWidth>=600||d.scrollTop>0) return; y0=e.touches[0].clientY; dy=0; },{passive:true});
  d.addEventListener('touchmove',e=>{ if(y0===null) return; dy=Math.max(0,e.touches[0].clientY-y0); if(dy>0) d.style.transform=`translateY(${dy}px)`; },{passive:true});
  d.addEventListener('touchend',()=>{ if(y0===null) return; y0=null; if(dy>110) closeSheet(d); else { d.style.transition='transform .25s'; d.style.transform=''; setTimeout(()=>d.style.transition='',260); } });
});

/* ============================================================
   Экран синхронизации
   ============================================================ */
function syncText(){
  const s=Sync.state, ago=store.lastSync?timeAgo(store.lastSync):'';
  if(s==='ok') return ['Синхронизировано',`Обновлено ${ago}. Изменения мгновенно появляются на всех устройствах с этим кодом.`];
  if(s==='busy') return ['Синхронизация…','Отправляем и получаем изменения'];
  if(s==='off') return ['Нет сети','Всё сохраняется на устройстве и отправится, когда появится интернет.'];
  return ['Не удалось связаться с облаком','Изменения сохранены на устройстве. Повторим автоматически.'];
}
function timeAgo(t){
  const s=Math.round((Date.now()-t)/1000);
  if(s<10) return 'только что'; if(s<60) return `${s} с назад`;
  const m=Math.round(s/60); if(m<60) return `${m} мин назад`;
  return new Date(t).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
}
function renderSyncIndicators(){
  const st={ok:'ok',busy:'busy',off:'off',err:'err'}[Sync.state];
  $$('[data-sync-dot]').forEach(d=>d.dataset.s=st);
  const label={ok:'Синхронизировано',busy:'Синхронизация…',off:'Офлайн',err:'Нет связи'}[Sync.state];
  $$('[data-sync-label]').forEach(l=>{ l.textContent=l.closest('.sync-chip-m')?{ok:'Синхр.',busy:'…',off:'Офлайн',err:'Ошибка'}[Sync.state]:label; });
  if($('#sheetSync').open){ const [b,s]=syncText(); const el=$('#syncStatus'); if(el){ $('b',el).textContent=b; $('small',el).textContent=s; $('.sync-dot',el).dataset.s=st; } }
}
const shareLink=()=>location.origin+location.pathname+'#sync='+store.code;
function renderSync(){
  const [b,s]=syncText();
  $('#syncBody').innerHTML=`
    <div class="sync-status" id="syncStatus"><span class="sync-dot" data-s="${Sync.state}"></span><div><b>${b}</b><small>${s}</small></div></div>
    <div class="sync-sec"><h3>Код вашей коллекции</h3>
      <div class="code"><span>${fmtCode(store.code)}</span><button type="button" class="btn btn-sm" data-s="copyCode">Копировать</button></div>
      <div class="qr-wrap"><div class="qr" id="qr" aria-label="QR-код для подключения другого устройства"></div>
        <div class="qr-note">Наведите камеру другого устройства на QR-код — откроется сайт и предложит подключиться.
          <div class="row-btns"><button type="button" class="btn btn-sm" data-s="copyLink">Скопировать ссылку</button>${navigator.share?'<button type="button" class="btn btn-sm" data-s="share">Отправить…</button>':''}</div></div></div>
    </div>
    <div class="sync-sec"><h3>Подключиться к другому устройству</h3>
      <p>Если отметки уже есть на другом устройстве, введите здесь его код. Отметки с этого устройства не пропадут, а объединятся с ними.</p>
      <form class="join" id="joinForm" style="margin-top:10px"><input id="joinInput" placeholder="XXXXX-XXXXX-XXXXX-XXXXX" maxlength="29" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Код коллекции"><button class="btn btn-primary" type="submit">Подключить</button></form>
    </div>
    <div class="sync-sec"><h3>Как это работает</h3>
      <ol class="steps">
        <li>Отметки, оценки, даты, скрытые пункты и фильтры хранятся на устройстве и в облаке.</li>
        <li>На iPhone, iPad или компьютере откройте сайт → «Синхр.» → отсканируйте QR-код или введите код.</li>
        <li>Изменение на одном устройстве сразу появляется на остальных. Без регистрации и паролей.</li>
        <li>Без интернета всё работает, изменения отправятся при подключении.</li>
      </ol>
      <p style="margin-top:8px;font-size:12.5px">Код — это ключ к вашим отметкам. Не публикуйте его в открытом доступе.</p>
    </div>
    <div class="sync-sec"><h3>Осторожно</h3>
      <div class="danger"><button type="button" class="btn btn-sm btn-danger" data-s="reset">Сбросить все отметки</button><button type="button" class="btn btn-sm" data-s="newcode">Отключиться и создать новый код</button></div>
    </div>`;
  renderQR();
}
let qrLoading=null;
function renderQR(){
  const box=$('#qr'); if(!box) return;
  const draw=()=>{ try{ const qr=window.qrcode(0,'M'); qr.addData(shareLink()); qr.make(); box.innerHTML=qr.createSvgTag({cellSize:4,margin:0,scalable:true}); }catch(e){ box.hidden=true; } };
  if(window.qrcode) return draw();
  if(!qrLoading) qrLoading=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
  qrLoading.then(draw,()=>{ box.hidden=true; });
}
async function copy(text,msg){
  try{ await navigator.clipboard.writeText(text); toast(msg); }
  catch(e){ const t=document.createElement('textarea'); t.value=text; document.body.appendChild(t); t.select(); try{ document.execCommand('copy'); toast(msg); }catch(_){ toast('Не удалось скопировать'); } t.remove(); }
}
$('#syncBody').addEventListener('click',async e=>{
  const a=e.target.closest('[data-s]'); if(!a) return;
  const act=a.dataset.s;
  if(act==='copyCode') copy(fmtCode(store.code),'Код скопирован');
  if(act==='copyLink') copy(shareLink(),'Ссылка скопирована');
  if(act==='share'){ try{ await navigator.share({title:'Дорога к Судному дню',text:'Подключи устройство к моей коллекции',url:shareLink()}); }catch(_){} }
  if(act==='reset'){
    if(!confirm('Удалить все отметки, оценки, даты и скрытые пункты? Это применится на всех подключённых устройствах.')) return;
    for(const k of Object.keys(store.data)) if(k.startsWith('i:')) put(k,{w:0,r:'',dt:'',h:0});
    persist(); Sync.schedule(50); renderAll(); toast('Все отметки сброшены');
  }
  if(act==='newcode'){
    if(!confirm('Это устройство отключится от общей коллекции и получит новый код. Отметки на нём останутся. Продолжить?')) return;
    switchCode(genCode()); renderSync(); toast('Создан новый код');
  }
});
$('#syncBody').addEventListener('submit',e=>{
  e.preventDefault();
  const c=normCode($('#joinInput').value);
  if(c.length!==20){ toast('В коде должно быть 20 символов'); return; }
  if(c===store.code){ toast('Это устройство уже подключено к этому коду'); return; }
  switchCode(c); renderSync(); toast('Устройство подключено — подтягиваем отметки');
});
$('#syncBody').addEventListener('input',e=>{
  if(e.target.id!=='joinInput') return;
  const c=normCode(e.target.value).slice(0,20); const f=fmtCode(c);
  if(e.target.value!==f) e.target.value=f;
});
function switchCode(code){
  store.code=code; store.pending={...store.data}; store.lastSync=0; persist();
  RT.start(); Sync.schedule(0);
}
function checkHashJoin(){
  const m=location.hash.match(/sync=([A-Za-z0-9-]+)/); if(!m) return;
  history.replaceState(null,'',location.pathname+location.search);
  const c=normCode(m[1]);
  if(c.length!==20||c===store.code) return;
  $('#jdCode').textContent=fmtCode(c);
  const d=$('#joinDialog'); openSheet(d);
  $('#jdOk').onclick=()=>{ switchCode(c); closeSheet(d); toast('Устройство подключено'); };
}

/* ============================================================
   Глобальные действия, клавиатура, тост
   ============================================================ */
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-act]'); if(!a) return;
  const act=a.dataset.act;
  if(act==='next') goNext();
  else if(act==='markNext'){ const f=nextFilm(); if(f) toggleDone(f.id,true); }
  else if(act==='filters') openSheet($('#sheetFilters'));
  else if(act==='sync'){ renderSync(); openSheet($('#sheetSync')); Sync.schedule(0); }
  else if(act==='top'){ closeSheets(); scrollTo({top:0,behavior:reduced()?'auto':'smooth'}); }
  else if(act==='intro') playIntro(true);
  else if(act==='clock') toggleClockFull();
  else if(act==='resetFilters') resetFilters();
});
document.addEventListener('click',e=>{ const c=e.target.closest('.ychip'); if(c){ closeSheets(); jumpToYear(+c.dataset.y); } });
document.addEventListener('keydown',e=>{
  if(e.target.closest('input,textarea,select')||e.metaKey||e.ctrlKey||e.altKey||$('dialog[open]')) return;
  if(e.key==='/'){ e.preventDefault(); $('#q').focus(); $('#toolbar').scrollIntoView({block:'start'}); }
  else if(e.key==='n'||e.key==='т'){ goNext(); }
});

const toastEl=$('#toast'); let toastT=0;
function toast(msg,action){
  toastEl.innerHTML=`<span>${esc(msg)}</span>`+(action?`<button type="button">${esc(action.label)}</button>`:'');
  if(action) $('button',toastEl).onclick=()=>{ hideToast(); action.fn(); };
  toastEl.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(hideToast,action?5000:2800);
}
function hideToast(){ toastEl.classList.remove('show'); }

/* ============================================================
   Прокрутка: активный год, липкая панель
   ============================================================ */
const toolbar=$('#toolbar'); let activeYear=null, scrollRaf=0;
function onScroll(){
  cancelAnimationFrame(scrollRaf);
  scrollRaf=requestAnimationFrame(()=>{
    toolbar.classList.toggle('stuck',toolbar.getBoundingClientRect().top<=1);
    const lim=(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tb-h'))||0)+40;
    let cur=null;
    for(const s of $$('.year',listEl)){ if(s.getBoundingClientRect().top<=lim) cur=s.dataset.y; else break; }
    if(!cur){ const first=$('.year',listEl); cur=first&&first.dataset.y; }
    if(cur===activeYear) return;
    activeYear=cur;
    $$('.ychip').forEach(c=>c.classList.toggle('on',c.dataset.y===cur));
    const strip=$('#yearChips'), chip=$(`.ychip[data-y="${cur}"]`,strip);
    if(chip&&strip.offsetParent){ const l=chip.offsetLeft-strip.clientWidth/2+chip.offsetWidth/2; strip.scrollTo({left:l,behavior:'smooth'}); }
  });
}
addEventListener('scroll',onScroll,{passive:true});

function measure(){
  const root=document.documentElement.style;
  root.setProperty('--tb-h',toolbar.offsetHeight+'px');
  const tb=$('.tabbar'); const vis=getComputedStyle(tb).display!=='none';
  root.setProperty('--tab-h',vis?tb.offsetHeight+'px':'0px');
}
if('ResizeObserver' in window){ new ResizeObserver(measure).observe(toolbar); new ResizeObserver(measure).observe($('.tabbar')); }
addEventListener('resize',measure);
mqDesk.addEventListener?mqDesk.addEventListener('change',()=>{ placeFilters(); measure(); renderYearNav(); }):mqDesk.addListener(()=>{ placeFilters(); measure(); });

/* ============================================================
   Часы Судного дня: витраж + отсчёт в месяцах, днях, часах…
   ============================================================ */
const pad=n=>String(n).padStart(2,'0');
const plural=(n,f)=>{ const a=n%10,b=n%100; return f[(b>10&&b<20)?2:a===1?0:(a>=2&&a<=4)?1:2]; };
const UNITS={mo:['месяц','месяца','месяцев'],d:['день','дня','дней'],h:['час','часа','часов'],m:['минута','минуты','минут'],s:['секунда','секунды','секунд']};
function addMonths(d,n){ const r=new Date(d); const day=r.getDate(); r.setDate(1); r.setMonth(r.getMonth()+n); r.setDate(Math.min(day,new Date(r.getFullYear(),r.getMonth()+1,0).getDate())); return r; }
function countdownParts(now,end){
  if(end<=now) return null;
  let mo=(end.getFullYear()-now.getFullYear())*12+end.getMonth()-now.getMonth();
  let base=addMonths(now,mo); if(base>end){ mo--; base=addMonths(now,mo); }
  const s=Math.floor((end-base)/1000);
  return {mo,d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};
}
let lastParts={};
function tick(){
  const p=countdownParts(new Date(),PREMIERE);
  if(!p){ ['cdMo','cdD','cdH','cdM','cdS'].forEach(i=>$('#'+i).textContent='00'); $('.clock-k').textContent='Судный день настал'; $('#clockDate').textContent='Премьера состоялась · бегом в кино'; return; }
  const map={mo:'cdMo',d:'cdD',h:'cdH',m:'cdM',s:'cdS'};
  for(const k in map){
    if(lastParts[k]===p[k]) continue;
    $('#'+map[k]).textContent=pad(p[k]);
    $(`[data-u="${k}"]`).textContent=plural(p[k],UNITS[k]);
  }
  lastParts=p;
  const se=$('#cdS'); if(!reduced()){ se.classList.remove('tick'); void se.offsetWidth; se.classList.add('tick'); }
}

// Готический витраж рисуется кодом: стрельчатые окна, свинцовая решётка, грязное стекло, силуэт Дума
function buildGlass(){
  const svg=$('#clockGlass'); if(!svg) return;
  const lancet=(cx,w,top,bot)=>{ const x=cx-w/2, r=w, sh=top+w*.866; return `M${x} ${bot}V${sh}A${r} ${r} 0 0 1 ${cx} ${top}A${r} ${r} 0 0 1 ${x+w} ${sh}V${bot}Z`; };
  const wins=[[800,250,90],[505,190,210],[1095,190,210],[255,160,320],[1345,160,320],[45,130,430],[1555,130,430]];
  let defs='', body='';
  wins.forEach(([cx,w,top],i)=>{
    const d=lancet(cx,w,top,930);
    defs+=`<clipPath id="w${i}"><path d="${d}"/></clipPath>`;
    let bars=''; for(let y=top+w*.9;y<930;y+=150) bars+=`M${cx-w/2} ${y}H${cx+w/2}`;
    body+=`<g clip-path="url(#w${i})"><rect x="${cx-w/2}" y="${top}" width="${w}" height="${930-top}" fill="url(#gl)"/>
      <rect x="${cx-w/2}" y="${top}" width="${w}" height="${930-top}" fill="url(#lat)"/>
      <rect x="${cx-w/2}" y="${top}" width="${w}" height="${930-top}" filter="url(#grime)"/>
      <path d="${bars}" stroke="#020403" stroke-width="8"/></g>
      <path d="${d}" fill="none" stroke="#020403" stroke-width="18"/><path d="${d}" fill="none" stroke="rgba(150,230,170,.12)" stroke-width="2"/>`;
  });
  // ажур центрального окна: средник и круг
  body+=`<path d="M800 300V930" stroke="#020403" stroke-width="12"/><circle cx="800" cy="250" r="58" fill="none" stroke="#020403" stroke-width="12"/>
    <circle cx="800" cy="250" r="22" fill="none" stroke="#020403" stroke-width="8"/>`;
  // силуэт Дума в капюшоне
  const hood='M800 560c-44 0-68 42-71 92-2 40 10 68 26 84-62 26-114 96-150 194h390c-36-98-88-168-150-194 16-16 28-44 26-84-3-50-27-92-71-92z';
  body+=`<g><path d="${hood}" fill="#000"/>
    <path d="${hood}" fill="none" stroke="url(#rim)" stroke-width="5"/>
    <path d="M800 604c-24 0-37 21-37 52 0 33 15 60 37 60s37-27 37-60c0-31-13-52-37-52z" fill="#050806"/>
    <path d="M779 648h16v4h-16zM805 648h16v4h-16z" fill="#42ff8e" opacity=".85"/></g>`;
  svg.innerHTML=`<defs>
    <radialGradient id="gl" cx="800" cy="300" r="900" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f2ffe0"/><stop offset=".22" stop-color="#9df5a0"/><stop offset=".5" stop-color="#3fae5c"/><stop offset=".8" stop-color="#14552a"/><stop offset="1" stop-color="#06210f"/></radialGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(200,255,210,.55)"/><stop offset=".45" stop-color="rgba(140,230,160,.18)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></linearGradient>
    <pattern id="lat" width="54" height="74" patternUnits="userSpaceOnUse"><path d="M27 0L54 37L27 74L0 37Z" fill="none" stroke="#030a05" stroke-width="4.5"/></pattern>
    <filter id="grime" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="4" seed="11"/>
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 .04  0 0 0 0 .01  0 0 0 -2.2 1.35"/></filter>
    ${defs}</defs><rect width="1600" height="900" fill="#050a06"/>${body}`;
}
function fitClock(){
  const c=$('#clock'), cells=$('#clockCells'); if(!c||!cells) return;
  const full=c.classList.contains('full');
  const avail=c.clientWidth-(full?48:28);
  let fs=Math.min(full?120:60,avail*(full?.11:.085));
  cells.style.fontSize=fs+'px';
  const w=cells.scrollWidth; if(w>avail) cells.style.fontSize=Math.floor(fs*avail/w)+'px';
}
function toggleClockFull(force){
  const c=$('#clock'), on=force!==undefined?force:!c.classList.contains('full');
  c.classList.toggle('full',on); document.documentElement.classList.toggle('clock-open',on); fitClock();
  const b=$('.clock-btn',c); b.setAttribute('aria-label',on?'Закрыть часы':'Часы на весь экран'); b.title=on?'Закрыть':'На весь экран';
  try{
    if(on&&c.requestFullscreen&&!document.fullscreenElement) c.requestFullscreen().catch(()=>{});
    if(!on&&document.fullscreenElement) document.exitFullscreen().catch(()=>{});
  }catch(e){}
}
document.addEventListener('fullscreenchange',()=>{ if(!document.fullscreenElement&&$('#clock').classList.contains('full')) toggleClockFull(false); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('#clock').classList.contains('full')) toggleClockFull(false); });

/* ============================================================
   Заставка: терминал → кольцо героев → Дум → название
   ============================================================ */
const INTRO_HEROES=['spider','iron','shield','hammer','hulk','panther','strange','deadpool','wolverine','loki','venom','cmarvel','daredevil','wanda'];
function fitText(el,maxW,maxPx){
  el.style.fontSize=maxPx+'px';
  const w=el.scrollWidth; if(w>maxW) el.style.fontSize=Math.floor(maxPx*maxW/w)+'px';
}
function playIntro(force){
  if(!force){
    try{ if(sessionStorage.getItem('doom-intro')) return; sessionStorage.setItem('doom-intro','1'); }catch(e){ return; }
    if(reduced()) return;
  }
  const el=$('#intro'), term=$('#inTerm'), ring=$('#inRing'), iv=$('#inVideo');
  if(!saveData()){ iv.src=vidSrc().mp4; iv.load(); }
  el.hidden=false; el.className='intro'; document.body.classList.add('intro-on');
  const timers=[], at=(ms,fn)=>timers.push(setTimeout(fn,ms));
  let ended=false;

  // кольцо
  ring.innerHTML=INTRO_HEROES.map((k,i)=>`<div class="ri" style="--a:${i*360/INTRO_HEROES.length}deg;--i:${i}">${ICONS.html(k)}</div>`).join('');
  // название: подгоняем под ширину экрана
  const days=Math.max(0,Math.ceil((PREMIERE-Date.now())/864e5));
  $('#inSub').textContent=days?`Премьера 18.12.2026 · осталось ${days} дн.`:'Премьера состоялась';
  const fit=()=>fitText($('#inMain'),Math.min(innerWidth-40,900),Math.min(96,innerWidth*.16));
  fit(); if(document.fonts) document.fonts.ready.then(fit);   // шрифт может догрузиться позже — подгоняем ещё раз

  // 1. терминал
  const lines=[
    ['> ПРОТОКОЛ «СУДНЫЙ ДЕНЬ»: ЗАПУСК',''],
    [`> ХРОНОЛОГИЯ: ${FILMS.length} ОБЪЕКТОВ ЗАГРУЖЕНО`,''],
    ['> МУЛЬТИВСЕЛЕННАЯ: НЕСТАБИЛЬНА','warn'],
    ['> ЛАТВЕРИЯ ЖДЁТ…',''],
  ];
  term.innerHTML='';
  let t=250;
  lines.forEach(([txt,cls])=>{
    const start=t;
    at(start,()=>{ $$('.cur',term).forEach(x=>x.classList.remove('cur')); const d=document.createElement('div'); d.className=cls+' cur'; term.appendChild(d);
      [...txt].forEach((ch,j)=>at(j*16,()=>{ d.textContent+=ch; })); });
    t+=txt.length*16+180;
  });
  // 2–4. кольцо, Дум, название
  at(1300,()=>el.classList.add('p2'));
  at(3100,()=>el.classList.add('p3'));
  at(4300,()=>{ el.classList.add('p4'); if(iv.src){ iv.currentTime=0; iv.play().catch(()=>{}); } });
  at(7600,finish);

  function finish(){
    if(ended) return; ended=true;
    timers.forEach(clearTimeout); el.classList.add('out');
    document.removeEventListener('keydown',onKey);
    setTimeout(()=>{ el.hidden=true; el.className='intro'; ring.innerHTML=''; term.innerHTML=''; iv.pause(); iv.removeAttribute('src'); document.body.classList.remove('intro-on'); },600);
  }
  const onKey=e=>{ if(['Escape',' ','Enter'].includes(e.key)){ e.preventDefault(); finish(); } };
  el.onclick=finish; document.addEventListener('keydown',onKey);
}

/* ============================================================
   Видео: фон шапки и финал заставки
   ============================================================ */
const vidSrc=()=>{ const port=innerHeight>innerWidth*1.1; return {mp4:port?'media/doom-portrait.mp4':'media/doom.mp4',jpg:port?'media/doom-portrait.jpg':'media/doom.jpg'}; };
const saveData=()=>!!(navigator.connection&&navigator.connection.saveData);
function setupBackdrop(){
  const bd=$('.backdrop'), v=$('#bdVideo');
  const apply=()=>{
    const src=vidSrc();
    bd.style.setProperty('--bd-poster',`url("${src.jpg}")`);
    if(reduced()||saveData()){ v.removeAttribute('src'); v.classList.remove('on'); return; }
    if(!v.src.endsWith(src.mp4)){ v.classList.remove('on'); v.src=src.mp4; v.load(); }
    const p=v.play(); if(p&&p.catch) p.catch(()=>{});
  };
  v.addEventListener('playing',()=>v.classList.add('on'));
  apply();
  let rt=0; addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(apply,300); });
  // не тратим батарею, когда шапка не видна
  if('IntersectionObserver' in window) new IntersectionObserver(([e])=>{
    if(!v.src) return; e.isIntersecting?v.play().catch(()=>{}):v.pause();
  }).observe(bd);
  document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'&&v.src) v.play().catch(()=>{}); });
}

/* ============================================================
   Старт
   ============================================================ */
loadStore(); loadUI();
placeFilters();
renderAll();
renderSyncIndicators();
measure();
buildGlass(); tick(); setInterval(tick,1000); fitClock();
if(document.fonts) document.fonts.ready.then(fitClock);
addEventListener('resize',fitClock);
document.addEventListener('fullscreenchange',()=>setTimeout(fitClock,50));
setupBackdrop();
playIntro(false);
checkHashJoin();
addEventListener('hashchange',checkHashJoin);

Sync.schedule(0); RT.start();
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'){ Sync.schedule(0); RT.ensure(); } });
addEventListener('online',()=>{ Sync.schedule(0); RT.ensure(); });
addEventListener('offline',()=>Sync.set('off'));
setInterval(()=>{ if(document.visibilityState==='visible') Sync.schedule(0); },60000);
setInterval(()=>{ if($('#sheetSync').open) renderSyncIndicators(); },15000);
// Изменения из другой вкладки этого же браузера
addEventListener('storage',e=>{ if(e.key===LS_KEY){ try{ const s=JSON.parse(e.newValue); if(s){ const codeChanged=s.code!==store.code; store=s; renderAll(); if(codeChanged) RT.start(); } }catch(_){} } });

if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
})();
