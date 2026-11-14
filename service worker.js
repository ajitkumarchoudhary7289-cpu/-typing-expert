
const CACHE_NAME = "ajit-typing-expert-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./typing.html",
  "./games.html",
  "./progress.html",
  "./settings.html",
  "./practice.html",
  "./daily-challenge.html",
  "./exam-practice.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedFile => {
      if (cachedFile) return cachedFile;

      return fetch(event.request)
        .then(response => {
          if (
            response &&
            response.status === 200 &&
            new URL(event.request.url).origin === self.location.origin
          ) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, copy);
            });
          }

          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
