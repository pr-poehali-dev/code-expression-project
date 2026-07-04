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
// пытается подгрузить устаревший (уже удалённый) чанк кода
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});
window.addEventListener("error", (e) => {
  if (e.message && e.message.includes("Failed to fetch dynamically imported module")) {
    window.location.reload();
  }
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = String(e?.reason?.message || e?.reason || "");
  if (msg.includes("Failed to fetch dynamically imported module") || msg.includes("Importing a module script failed")) {
    window.location.reload();
  }
});