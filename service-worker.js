const CACHE_NAME = 'dialysis-app-v11';
const urlsToCache = [
  'https://sanaeih1.github.io/Dialysis11/',
  'https://sanaeih1.github.io/Dialysis11/index.html',
  'https://sanaeih1.github.io/Dialysis11/manifest.json',
  'https://sanaeih1.github.io/Dialysis11/foods.json',
  'https://sanaeih1.github.io/Dialysis11/contact.html',
  'https://sanaeih1.github.io/Dialysis11/mums_logo.png',
  'https://sanaeih1.github.io/Dialysis11/assets/home.png',
  'https://sanaeih1.github.io/Dialysis11/assets/history.png',
  'https://sanaeih1.github.io/Dialysis11/assets/video.png',
  'https://sanaeih1.github.io/Dialysis11/assets/book.png',
  'https://sanaeih1.github.io/Dialysis11/assets/settings.png',
  'https://sanaeih1.github.io/Dialysis11/assets/info.png',
  'https://sanaeih1.github.io/Dialysis11/assets/back.png',
  'https://sanaeih1.github.io/Dialysis11/assets/trash-alt.png',
  'https://sanaeih1.github.io/Dialysis11/assets/food.png',
  'https://sanaeih1.github.io/Dialysis11/assets/search.png',
  'https://sanaeih1.github.io/Dialysis11/assets/list.png',
  'https://sanaeih1.github.io/Dialysis11/assets/weight.png',
  'https://sanaeih1.github.io/Dialysis11/assets/clock.png',
  'https://sanaeih1.github.io/Dialysis11/assets/plus.png',
  'https://sanaeih1.github.io/Dialysis11/assets/water-glass.png',
  'https://sanaeih1.github.io/Dialysis11/assets/water-drop.png',
  'https://sanaeih1.github.io/Dialysis11/assets/urine.png',
  'https://sanaeih1.github.io/Dialysis11/assets/trash.png',
  'https://sanaeih1.github.io/Dialysis11/assets/font-size.png',
  'https://sanaeih1.github.io/Dialysis11/assets/sodium.png',
  'https://sanaeih1.github.io/Dialysis11/assets/potassium.png',
  'https://sanaeih1.github.io/Dialysis11/assets/phosphorus.png',
  'https://sanaeih1.github.io/Dialysis11/assets/protein.png',
  'https://sanaeih1.github.io/Dialysis11/assets/water.png',
  'https://sanaeih1.github.io/Dialysis11/assets/save.png',
  'https://sanaeih1.github.io/Dialysis11/assets/icon-512x512.png',
  'https://sanaeih1.github.io/Dialysis11/assets/icon-192x192.png',
  'https://cdn.jsdelivr.net/npm/vazir-font@28.0.0/dist/font-face.css',
  'https://cdn.jsdelivr.net/npm/shabnam-font@5.0.0/dist/font-face.css',
  'https://cdn.jsdelivr.net/npm/persian-date@1.1.0/dist/persian-date.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

function fetchAndUpdateCache(request) {
  return fetch(request)
    .then(networkResponse => {
      if (networkResponse && networkResponse.status === 200) {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }
      return networkResponse;
    });
}

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === 'https://www.aparat.com' && !navigator.onLine) {
    event.respondWith(
      new Response('<div style="background-color: #ffcccb; color: #d32f2f; padding: 10px; text-align: center;">شما آفلاین هستید. لطفاً برای مشاهده ویدیوها به اینترنت متصل شوید.</div>', {
        headers: { 'Content-Type': 'text/html' }
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          if (navigator.onLine) {
            fetchAndUpdateCache(event.request);
          }
          return cachedResponse;
        }
        if (navigator.onLine) {
          return fetchAndUpdateCache(event.request);
        }
        return new Response('<div style="background-color: #ffcccb; color: #d32f2f; padding: 10px; text-align: center;">شما آفلاین هستید و این منبع در دسترس نیست.</div>', {
          headers: { 'Content-Type': 'text/html' }
        });
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        return caches.match('https://sanaeih1.github.io/Dialysis11/index.html');
      })
  );
});