const CACHE_NAME = "pitch-trainer-mobile-v1";

const LOCAL_ASSETS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.webmanifest",
    "./icon-192.png",
    "./icon-512.png"
];

const EXTERNAL_ASSETS = [
    "https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js",
    "https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            await cache.addAll(LOCAL_ASSETS);

            for (const url of EXTERNAL_ASSETS) {
                const request = new Request(url, {
                    mode: "no-cors"
                });

                const response = await fetch(request);
                await cache.put(request, response);
            }
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                return cached;
            }

            return fetch(event.request).then((response) => {
                const copy = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, copy);
                });

                return response;
            }).catch(() => {
                if (event.request.mode === "navigate") {
                    return caches.match("./index.html");
                }

                throw new Error("Offline asset unavailable.");
            });
        })
    );
});
