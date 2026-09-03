const CACHE_NAME = "flashcards-v3";
const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css",
    "./storage.js",
    "./script.js",
    "./manifest.json",
    "./icons/icon-180.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-maskable-512.png",
    "./achievedit.gif",
    "./April.png",
    "./August.png",
    "./backicon.png",
    "./calendar.png",
    "./checkmarkbtn.png",
    "./collectback.png",
    "./December.png",
    "./deleteleaf.png",
    "./Doghead1.png",
    "./Doghead2.png",
    "./Doghead3.png",
    "./Doghead4.png",
    "./Doghead5.png",
    "./Doghead6.png",
    "./Doghead7.png",
    "./Dogleg1.png",
    "./Dogleg2.png",
    "./Dogleg3.png",
    "./Dogleg5.png",
    "./Dogleg6.png",
    "./Doglegs4.png",
    "./Doglegs7.png",
    "./Feburary.png",
    "./fork.png",
    "./goldstar.png",
    "./greenbackground.png",
    "./hotdog.png",
    "./January.png",
    "./July.png",
    "./June.png",
    "./ketchup.PNG",
    "./leafonredbackground.png",
    "./March.png",
    "./May.png",
    "./November.png",
    "./October.png",
    "./pinkstar.png",
    "./popuphotdog.png",
    "./redfullbackground.png",
    "./revealbone.png",
    "./sandwich.png",
    "./September.png",
    "./settingsbutton.png",
    "./spoon.png",
    "./tomato.PNG",
    "./tomatocard.png",
    "./xmark.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) return;

    // Ignore cache-busting query strings, such as the replay parameter on the
    // achievement animation, so they do not create duplicate cached files.
    const cacheKey = `${requestUrl.origin}${requestUrl.pathname}`;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, copy));
                }
                return response;
            })
            .catch(async () => {
                const cachedResponse = await caches.match(cacheKey);
                if (cachedResponse) return cachedResponse;
                if (event.request.mode === "navigate") return caches.match("./index.html");
                return Response.error();
            })
    );
});
