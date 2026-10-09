const CACHE="duitjar-v18";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const url=new URL(r.url);
  if(url.origin===location.origin){
    // app files: try network first so updates arrive, fall back to cache offline
    e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html"))));
  } else if(/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(url.host)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res})));
  }
});
