var CACHE = 'portofolio-v50';
var CORE = [
    './',
    './index.html',
    './ai-engineer.html',
    './secops-specialist.html',
    './offline.html',
    './manifest.json',
    './favicon.ico',
    './og-preview.jpg',
    './og-preview-ai.jpg',
    './og-preview-secops.jpg',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE)
            .then(function(cache) { return cache.addAll(CORE); })
            .then(function() { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys()
            .then(function(keys) {
                return Promise.all(
                    keys.filter(function(k) { return k !== CACHE; })
                        .map(function(k) { return caches.delete(k); })
                );
            })
            .then(function() { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function(e) {
    var req = e.request;
    if (req.method !== 'GET') return;

    var url = new URL(req.url);

    // Cross-origin (CDNs: Font Awesome, Fonts, Medium feed): network-first, cache fallback
    if (url.origin !== location.origin) {
        e.respondWith(
            fetch(req)
                .then(function(res) {
                    var clone = res.clone();
                    caches.open(CACHE).then(function(c) { c.put(req, clone); });
                    return res;
                })
                .catch(function() { return caches.match(req); })
        );
        return;
    }

    // Navigations: network-first, fall back to offline page for offline
    if (req.mode === 'navigate') {
        e.respondWith(
            fetch(req)
                .then(function(res) {
                    var clone = res.clone();
                    caches.open(CACHE).then(function(c) { c.put(req, clone); });
                    return res;
                })
                .catch(function() { return caches.match('./offline.html'); })
        );
        return;
    }

    // Same-origin static assets: cache-first, then network + populate cache
    e.respondWith(
        caches.match(req).then(function(hit) {
            return hit || fetch(req).then(function(res) {
                var clone = res.clone();
                caches.open(CACHE).then(function(c) { c.put(req, clone); });
                return res;
            });
        })
    );
});
