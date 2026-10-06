const CACHE='check-list-inteligente-v5';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./notificacao-passo-1.png','./notificacao-passo-2.png','./notificacao-passo-3.png','./notificacao-passo-4.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus'in w)return w.focus()}return clients.openWindow('./index.html')}));});

self.addEventListener('push',e=>{
 let d={title:'Check list Inteligente',body:'Hora de montar sua lista de compras!',tag:'checklist-alarm'};
 try{if(e.data)d={...d,...e.data.json()}}catch(_){}
 e.waitUntil(self.registration.showNotification(d.title,{
   body:d.body,icon:'./icon-192.png',badge:'./icon-192.png',tag:d.tag||'checklist-alarm',
   renotify:true,requireInteraction:true,vibrate:[250,120,250,120,350],
   data:{url:'./index.html'}
 }));
});
