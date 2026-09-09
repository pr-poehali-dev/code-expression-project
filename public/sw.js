const CACHE = "prodialog-v4";
// HTML-страницы (в т.ч. "/" и "/cabinet") больше НЕ кладём в офлайн-кэш заранее:
// раньше их закешированная версия могла пережить деплой и потом ссылаться на
// уже удалённые с сервера JS/CSS-чанки (у них хэш в имени). Из-за этого при
// малейшем сетевом сбое (характерно для Яндекс.Браузера с турбо-режимом/сжатием
// трафика) SW отдавал устаревший HTML → браузер не находил чанк → main.tsx
// делал reload() → SW снова отдавал тот же старый HTML → бесконечный цикл
// перезагрузки, который выглядит как "мигание белым экраном" при входе.
const STATIC = [];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
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

  // HTML-документы (навигация, в т.ч. "/cabinet") — та же логика: только сеть,
  // без отката на кэш. Устаревшая закешированная HTML-страница после деплоя
  // ссылается на удалённые чанки и вызывает зацикленные перезагрузки/белый экран
  // (особенно в Яндекс.Браузере). Кэш здесь не даёт офлайн-выгоды, зато опасен.
  if (e.request.mode === "navigate") {
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