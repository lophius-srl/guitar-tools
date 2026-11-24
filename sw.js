// Service worker : le site marche hors ligne et s'ouvre vite, comme une application.
// Stratégie : on répond tout de suite avec la copie gardée, et on va chercher la version à jour en arrière-plan.
const CACHE='gt-v2';
const PRE=["./", "accordeur", "accords", "analyse", "caged", "cercle", "gammes", "improviser", "manche", "metronome", "oreille", "accordeur.html", "accords.html", "analyse.html", "caged.html", "cercle.html", "gammes.html", "improviser.html", "index.html", "manche.html", "metronome.html", "oreille.html", "manifest.webmanifest", "assets/style.css?v=11", "assets/nav.js?v=10", "assets/music.js?v=8", "assets/icons/icon-192.png", "assets/icons/apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(r)||(r.mode==='navigate'?await c.match(r.url.replace(/\/?(#.*)?$/,'')+'.html').catch(()=>null):null);
    const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res;}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit;}
    return (await net)||c.match('./')||Response.error();
  }));
});
