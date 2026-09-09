import * as React from 'react';
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from '@/lib/helmet'
import App from './App'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

// Автоматически перезагружаем страницу, если после деплоя браузер
// пытается подгрузить устаревший (уже удалённый) чанк кода.
// Защита от зацикливания: если это уже произошло только что (например,
// сеть Яндекс.Браузера на секунду "споткнулась" на другом чанке) — не
// перезагружаем снова, а даём странице дорисоваться. Без этой защиты
// возможен бесконечный цикл reload(), который выглядит как мигание белым.
function reloadOnceForStaleChunk() {
  const key = "chunk_reload_at";
  const last = Number(sessionStorage.getItem(key) || 0);
  if (Date.now() - last < 10000) return; // уже перезагружались недавно — не повторяем
  sessionStorage.setItem(key, String(Date.now()));
  window.location.reload();
}
window.addEventListener("vite:preloadError", reloadOnceForStaleChunk);
window.addEventListener("error", (e) => {
  if (e.message && e.message.includes("Failed to fetch dynamically imported module")) {
    reloadOnceForStaleChunk();
  }
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = String(e?.reason?.message || e?.reason || "");
  if (msg.includes("Failed to fetch dynamically imported module") || msg.includes("Importing a module script failed")) {
    reloadOnceForStaleChunk();
  }
});