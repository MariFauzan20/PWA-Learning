const CACHE_NAME = "firstpwa-v2";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/img/icon.png",
  "materialize/css/materialize.min.css",
  "materialize/js/materialize.min.js",
  "materialize/js/nav.js",
  "/service-worker.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME }).then(function(response) {
        if (response) {
          console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
          return response;
        }

        console.log(
          "ServiceWorker: Memuat aset dari server: ",
          event.request.url
        );
        return fetch(event.request);
      })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if(cacheName != CACHE_NAME){
            console.log("serviceWorker: cache " + cacheName + "dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
