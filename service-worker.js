var cacheName = 'chat-0.1.3';
var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.2.3/css/bulma.min.css',
    'images/android-chrome-192x192.png',
    'images/android-chrome-512x512.png'
];

self.addEventListener('install', function (event) {
    console.log('Service worker install');
    event.waitUntil(
        caches.open(cacheName).then(function(cache){
            return cache.addAll(filesToCache);
        })
    )
});

self.addEventListener('activate', function (event) {
    console.log('Service worker activate');
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    )

    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});