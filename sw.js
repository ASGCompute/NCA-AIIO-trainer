// Offline-first app shell. Bump VERSION on every deploy that changes files.
const VERSION = 'aiio-path-v11';
const SHELL = ['./', './index.html', './style.css', './fonts.css', './app.js', './data.js', './map.js', './videos.js', './i18n.js', './manifest.webmanifest', './icons/icon.svg', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png',
  './fonts/Exo2-cyrillic-46be12.woff2', './fonts/Exo2-latin-32270d.woff2', './fonts/Exo2-latin-ext-5a1f43.woff2', './fonts/JetBrainsMono-cyrillic-b1b041.woff2', './fonts/JetBrainsMono-latin-480c06.woff2', './fonts/JetBrainsMono-latin-ext-ba1653.woff2', './fonts/Manrope-cyrillic-ffb0f3.woff2', './fonts/Manrope-latin-cf48e3.woff2', './fonts/Manrope-latin-ext-b4290e.woff2'];
// Language tables are cached in the background so a switch works offline without blocking the install.
const LATER = ['./lang/en.js', './lang/es.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL).then(() => { c.addAll(LATER).catch(() => {}); })).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first so updates arrive; a slow or hanging network falls back to the cache after 4 seconds.
function fromNetwork(req) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), 4000);
    fetch(req).then(res => { clearTimeout(t); resolve(res); }, err => { clearTimeout(t); reject(err); });
  });
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(fromNetwork(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
