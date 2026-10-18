// Service worker: сайт открывается без сети. Свои файлы — «сначала сеть», шрифты и библиотеки — из кэша.
const V='doom-v4-3';
const CORE=['./','index.html','styles.css','app.js','data.js','icons.js','site.webmanifest','icon.png','apple-touch-icon.png','icon-maskable.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request, url=new URL(req.url);
  if(req.method!=='GET'||url.hostname.endsWith('supabase.co')) return;
  if(url.origin===location.origin){
    // no-cache: всегда сверяемся с сервером, чтобы обновления сайта приходили сразу
    e.respondWith(fetch(req.url,{cache:'no-cache',credentials:'same-origin'}).then(res=>{
      if(res.ok){ const copy=res.clone(); caches.open(V).then(c=>c.put(req,copy)); }
      return res;
    }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
    return;
  }
  if(/fonts\.(googleapis|gstatic)\.com$|cdnjs\.cloudflare\.com$/.test(url.hostname)){
    e.respondWith(caches.open(V).then(async c=>{
      const hit=await c.match(req);
      const net=fetch(req).then(res=>{ if(res.ok||res.type==='opaque') c.put(req,res.clone()); return res; }).catch(()=>hit);
      return hit||net;
    }));
  }
});
