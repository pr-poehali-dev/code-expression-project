const CACHE = "prodialog-v3";
const STATIC = ["/", "/cabinet"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/?")) return;

  // Файлы сборки (JS/CSS-чанки) уже версионируются хэшем в имени и после каждого
  // обновления сайта старые файлы удаляются с сервера. Если отдавать их из кэша
  // при неудачной сети, браузер может получить смесь старой и новой версии кода
  // и не суметь отрисовать страницу (белый экран). Поэтому такие файлы отдаём
  // только напрямую из сети, без подстраховки кэшем.
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});