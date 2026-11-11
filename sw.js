"use strict";

const CACHE = "pionniers-magnee-v5";

const ASSETS = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./logo-pionniers.png",

    "./tombola/index.html",
    "./tombola/app.js",
    "./tombola/qr-local.js",
    "./tombola/logo-pionniers.png",

    "./cave/index.html",
    "./cave/app.js",
    "./cave/qr-local.js",

    "./fluo/index.html",
    "./fluo/app.js",
    "./fluo/qr-local.js",

    "./backyard/index.html",
    "./backyard/app.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request);
        })
    );
});
