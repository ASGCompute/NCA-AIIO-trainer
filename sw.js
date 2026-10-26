// Offline-first app shell. Bump VERSION on every deploy that changes files.
const VERSION = 'aiio-path-v14';
const SHELL = ['./', './index.html', './style.css', './fonts.css', './app.js', './data.js', './map.js', './videos.js', './i18n.js', './lang/en.js', './manifest.webmanifest', './icons/icon.svg',
  './fonts/Exo2-cyrillic-46be12.woff2', './fonts/Exo2-latin-32270d.woff2', './fonts/Exo2-latin-ext-5a1f43.woff2', './fonts/JetBrainsMono-cyrillic-b1b041.woff2', './fonts/JetBrainsMono-latin-480c06.woff2', './fonts/JetBrainsMono-latin-ext-ba1653.woff2', './fonts/Manrope-cyrillic-ffb0f3.woff2', './fonts/Manrope-latin-cf48e3.woff2', './fonts/Manrope-latin-ext-b4290e.woff2'];
// Spanish is cached in the background so a switch works offline without blocking the install; English is the default and is in the shell.
const LATER = ['./lang/es.js'];
// Icon URLs carry ?v= so phones that cached a failed icon fetch ask again.
const ICONS = ['./icons/icon-180.png?v=2', './icons/icon-192.png?v=2', './icons/icon-512.png?v=2', './icons/maskable-512.png?v=2'];

// Fetch past the HTTP cache so a new version never installs stale files.
const fresh = url => fetch(new Request(url, { cache: 'reload' })).then(res => { if (!res.ok) throw new Error(url + ' ' + res.status); return res; });
const put = (c, urls) => Promise.all(urls.map(u => fresh(u).then(res => c.put(u, res))));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => put(c, SHELL).then(() => { put(c, LATER.concat(ICONS)).catch(() => {}); })).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Cache first: the app opens instantly on a slow mobile network. Updates arrive as a new sw.js
// (the browser checks it on every launch), which installs every file fresh and takes over.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const key = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(caches.open(VERSION).then(c => c.match(key, { ignoreSearch: req.mode === 'navigate' }).then(hit => hit || fetch(req).then(res => {
    if (res.ok) c.put(req, res.clone());
    return res;
  }).catch(() => req.mode === 'navigate' ? c.match('./index.html') : Response.error()))));
});
