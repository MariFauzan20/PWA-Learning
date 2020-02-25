var CACHE_NAME = 'Mendelevium-cache-v1';
var urlsToCache = [
  '/',
  '/index.html',
  '/profile.html',
  '/portofolio.html',
  '/contact.html',
  '/nav.html',
  '/main.js',
  '/manifest.json',
  '/css/materialize.css',
  '/css/materialize.min.css',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/p2.jpg',
  '/img/fortofolio/1.png',
  '/img/fortofolio/2.png',
  '/img/fortofolio/3.jpg',
  '/img/fortofolio/4.jpg',
  '/img/fortofolio/5.jpg',
  '/img/fortofolio/6.png',
  '/js/materialize.js',
  '/js/materialize.min.js',
  '/js/nav.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = CACHE_NAME;

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
