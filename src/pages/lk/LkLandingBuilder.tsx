import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { showEnergyGate } from "@/components/EnergyGate";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { loadDraft } from "./SalonProfileTypes";
import LkLandingGuide from "./LkLandingGuide";

const AI_LANDING_URL = "https://functions.poehali.dev/12df0290-571d-42d1-8fb0-8889ae15cd68";
const LANDING_API_URL = "https://functions.poehali.dev/b5f86006-d448-4c34-96b8-3fba0295cb14";
const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,96%)";
const PURPLE = "hsl(270,70%,50%)";
const PURPLE_LIGHT = "hsl(270,70%,97%)";

const LS_MSGS    = "landing_builder_msgs";
const LS_PHASE   = "landing_builder_phase";
const LS_TYPE    = "landing_builder_type";
const LS_PID     = "landing_project_id";
const LS_TITLE   = "landing_project_title";
const LS_BLOCKS   = "landing_builder_blocks";
const LS_STYLE    = "landing_builder_style";
const LS_PRIVACY  = "landing_builder_privacy";
const LS_SEO      = "landing_builder_seo";

type LandingType = "classic" | "storytelling" | "sales" | "portfolio" | "b2b" | "event" | "restaurant" | "realty" | "product" | "ai" | "premium" | "budget";
interface Message { role: "user" | "assistant"; content: string; }
interface LandingStyle {
  primary: string; accent: string; dark: string; light: string; text: string;
  headingFont: string; bodyFont: string;
}
interface LandingBlock { id: string; label: string; html: string; }
interface LandingProject {
  id: string; title: string; landing_type: string;
  created_at: string; updated_at: string;
}
interface Version { savedAt: string; html: string; blocks: LandingBlock[]; style: LandingStyle; }
interface PrivacyData {
  orgName: string;   // ИП Иванов Иван Иванович / ООО "Ромашка"
  inn: string;
  ogrn: string;
  address: string;
  email: string;
  domain: string;
}
interface SeoData {
  title: string;
  description: string;
  keywords: string;
  robots: string;          // index,follow | noindex,nofollow
  faviconSvg: string;      // inline SVG для favicon
  metrikaId: string;       // ID счётчика Яндекс.Метрики
  webmasterVerify: string; // Код верификации Яндекс.Вебмастер
}

const BLOCKS_ORDER: { id: string; label: string }[] = [
  { id: "header",   label: "Шапка и меню" },
  { id: "hero",     label: "Обложка" },
  { id: "about",    label: "О нас" },
  { id: "services", label: "Услуги" },
  { id: "gallery",  label: "Галерея фото" },
  { id: "reviews",  label: "Отзывы" },
  { id: "contact",  label: "Контакты" },
  { id: "footer",   label: "Футер" },
  { id: "pain",     label: "Боли клиента" },
  { id: "solution", label: "Решение" },
  { id: "team",     label: "Команда" },
  { id: "benefits", label: "Выгоды" },
  { id: "howworks", label: "Как работаем" },
  { id: "pricing",  label: "Цены" },
  { id: "faq",      label: "FAQ" },
  { id: "cases",    label: "Кейсы" },
  { id: "clients",  label: "Клиенты" },
  { id: "program",  label: "Программа" },
  { id: "speakers", label: "Спикеры" },
  { id: "menu",     label: "Меню / хиты" },
  { id: "promo",    label: "Акции" },
  { id: "booking",  label: "Бронирование" },
  { id: "object",   label: "Об объекте" },
  { id: "location", label: "Район / расположение" },
  { id: "plans",    label: "Планировки" },
  { id: "product",  label: "Товар" },
  { id: "order",    label: "Оформить заказ" },
];

const TEMPLATE_BLOCKS: Record<LandingType, string[]> = {
  classic:      ["header", "hero", "about", "services", "reviews", "contact", "footer"],
  storytelling: ["hero", "pain", "solution", "services", "team", "reviews", "contact", "footer"],
  sales:        ["hero", "benefits", "howworks", "pricing", "faq", "reviews", "contact", "footer"],
  portfolio:    ["hero", "about", "gallery", "services", "reviews", "contact", "footer"],
  b2b:          ["header", "hero", "services", "cases", "team", "clients", "contact", "footer"],
  event:        ["hero", "program", "speakers", "pricing", "faq", "contact", "footer"],
  restaurant:   ["hero", "menu", "about", "promo", "booking", "footer"],
  realty:       ["hero", "object", "location", "plans", "contact", "footer"],
  product:      ["hero", "benefits", "howworks", "reviews", "order", "footer"],
  ai:           ["hero", "about", "services", "reviews", "contact", "footer"],
  premium:      ["header", "hero", "about", "services", "gallery", "reviews", "contact", "footer"],
  budget:       ["hero", "services", "reviews", "contact", "footer"],
};

const BLOCK_PHOTO_SLOTS: Record<string, { id: string; label: string }[]> = {
  hero:    [{ id: "hero", label: "Главное фото" }],
  about:   [{ id: "about-main", label: "Основное фото" }, { id: "about-small", label: "Доп. фото" }],
  gallery: [
    { id: "gallery-1", label: "Фото 1" }, { id: "gallery-2", label: "Фото 2" },
    { id: "gallery-3", label: "Фото 3" }, { id: "gallery-4", label: "Фото 4" },
    { id: "gallery-5", label: "Фото 5" }, { id: "gallery-6", label: "Фото 6" },
  ],
  reviews: [
    { id: "review-avatar-1", label: "Фото клиента 1" },
    { id: "review-avatar-2", label: "Фото клиента 2" },
    { id: "review-avatar-3", label: "Фото клиента 3" },
  ],
};

const DEFAULT_STYLE: LandingStyle = {
  primary: "#1a3a4a", accent: "#e67e22", dark: "#0f2030",
  light: "#f8f9fa", text: "#2c3e50",
  headingFont: "Playfair Display", bodyFont: "Montserrat",
};

// Editor script: точное выделение ЛЮБОГО элемента → плавающий ИИ-чат в родителе
const EDITOR_SCRIPT = `<script>
(function() {
  var style = document.createElement('style');
  style.textContent = \`
    * { scroll-margin-top: 80px; }
    .lnd-hover { outline: 2px dashed #6366f1 !important; outline-offset: 2px !important; cursor: pointer !important; }
    .lnd-picked { outline: 3px solid #6366f1 !important; outline-offset: 2px !important; box-shadow: 0 0 0 6px rgba(99,102,241,0.15) !important; border-radius: 4px; }
    .lnd-tag { position: absolute; z-index: 99999; background: #6366f1; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 0 6px 6px 0; pointer-events: none; font-family: -apple-system,sans-serif; letter-spacing: 0.2px; white-space: nowrap; box-shadow: 0 4px 14px rgba(99,102,241,0.4); transform: translateY(-100%); }
  \`;
  document.head.appendChild(style);

  var picked = null;       // выбранный DOM-элемент
  var hovered = null;
  var tagEl = null;

  // Понятное имя для типа элемента
  function elKind(el) {
    var t = el.tagName ? el.tagName.toLowerCase() : '';
    if (el.matches('[data-photo-slot]') || (t === 'img')) return 'photo';
    if (el.closest('[data-photo-slot]')) return 'photo';
    if (t === 'h1' || t === 'h2') return 'heading';
    if (t === 'h3' || t === 'h4') return 'subheading';
    if (t === 'p') return 'text';
    if (t === 'button' || t === 'a') return 'button';
    if (t === 'li') return 'list-item';
    if (t === 'ul' || t === 'ol') return 'list';
    if (t === 'form') return 'form';
    if (t === 'input' || t === 'textarea') return 'field';
    if (t === 'svg' || el.closest('svg')) return 'icon';
    if (el.matches('[data-block-id]')) return 'section';
    return 'element';
  }
  var KIND_LABEL = {
    photo:'📷 Фото', heading:'📝 Заголовок', subheading:'📝 Подзаголовок',
    text:'📄 Текст', button:'🔘 Кнопка', 'list-item':'• Пункт', list:'☰ Список',
    form:'📋 Форма', field:'⌨️ Поле', icon:'✦ Иконка', section:'▦ Секция', element:'◻ Элемент'
  };

  // Поднимаемся до осмысленного элемента (фото-слот целиком, карточка и т.п.)
  function resolveTarget(el) {
    if (!el || el === document.body) return null;
    var slot = el.closest('[data-photo-slot]');
    if (slot) return slot;
    // если кликнули по svg-пути — берём весь svg
    if (el.tagName && el.tagName.toLowerCase() !== 'svg' && el.closest('svg')) return el.closest('svg');
    return el;
  }

  function getBlock(el) { return el.closest && el.closest('[data-block-id]'); }

  function showTag(el) {
    if (!tagEl) { tagEl = document.createElement('div'); tagEl.className = 'lnd-tag'; document.body.appendChild(tagEl); }
    tagEl.textContent = KIND_LABEL[elKind(el)] || '◻ Элемент';
    var r = el.getBoundingClientRect();
    tagEl.style.left = (r.left + window.scrollX) + 'px';
    tagEl.style.top = (r.top + window.scrollY) + 'px';
    tagEl.style.display = 'block';
  }
  function hideTag() { if (tagEl) tagEl.style.display = 'none'; }

  function clearPicked() {
    document.querySelectorAll('.lnd-picked').forEach(function(e){ e.classList.remove('lnd-picked'); });
    document.querySelectorAll('[data-lnd-target]').forEach(function(e){ e.removeAttribute('data-lnd-target'); });
    picked = null;
    hideTag();
    window.parent.postMessage({ type: 'landing-deselect-ack' }, '*');
  }

  // Hover-подсветка
  document.addEventListener('mouseover', function(e) {
    var t = resolveTarget(e.target);
    if (!t || t === picked || !getBlock(t)) return;
    if (hovered && hovered !== t) hovered.classList.remove('lnd-hover');
    hovered = t; t.classList.add('lnd-hover');
  });
  document.addEventListener('mouseout', function(e) {
    if (hovered) { hovered.classList.remove('lnd-hover'); hovered = null; }
  });

  // Клик — выбираем элемент
  document.addEventListener('click', function(e) {
    var t = resolveTarget(e.target);
    if (!t) { return; }
    var block = getBlock(t);
    if (!block) { return; }
    e.preventDefault(); e.stopPropagation();
    if (hovered) { hovered.classList.remove('lnd-hover'); hovered = null; }
    if (picked === t) return;
    clearPicked();
    picked = t;
    t.classList.add('lnd-picked');
    t.setAttribute('data-lnd-target', '1');
    showTag(t);

    // Короткое текстовое описание выбранного
    var preview = (t.textContent || '').trim().slice(0, 60);
    var kind = elKind(t);
    window.parent.postMessage({
      type: 'landing-pick',
      blockId: block.getAttribute('data-block-id'),
      blockLabel: block.getAttribute('data-block-label') || '',
      blockHtml: block.innerHTML,
      kind: kind,
      kindLabel: KIND_LABEL[kind] || 'Элемент',
      preview: preview,
      hasPhoto: kind === 'photo'
    }, '*');
  }, true);

  // Вставка загруженного фото в слот/элемент (base64 из родителя)
  function applyPhoto(target, src) {
    if (!target) return false;
    var img = '<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;" />';
    var t = target.tagName ? target.tagName.toLowerCase() : '';
    if (t === 'img') {
      // меняем сам src картинки
      target.src = src;
      target.style.objectFit = 'cover';
    } else {
      // контейнер/слот — заполняем картинкой
      target.innerHTML = img;
      target.classList.add('has-photo');
      target.style.border = 'none'; target.style.outline = 'none'; target.style.overflow = 'hidden';
      if (!target.style.minHeight && target.offsetHeight < 60) target.style.minHeight = '220px';
    }
    return true;
  }

  // Найти куда вставить фото в выделенном элементе
  function findPhotoTarget() {
    if (!picked) return null;
    // 1. сам слот
    var slot = picked.matches('[data-photo-slot]') ? picked : picked.closest('[data-photo-slot]');
    if (slot) return slot;
    // 2. img внутри/сам
    if (picked.tagName && picked.tagName.toLowerCase() === 'img') return picked;
    var innerImg = picked.querySelector && picked.querySelector('img');
    if (innerImg) return innerImg;
    var innerSlot = picked.querySelector && picked.querySelector('[data-photo-slot]');
    if (innerSlot) return innerSlot;
    // 3. сам выделенный контейнер
    return picked;
  }

  // Снятие выделения / вставка фото по команде из родителя
  window.addEventListener('message', function(e) {
    if (!e.data) return;
    if (e.data.type === 'landing-clear-pick') clearPicked();
    if (e.data.type === 'landing-scroll-to-block') {
      var b = document.querySelector('[data-block-id="' + e.data.blockId + '"]');
      if (b) b.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (e.data.type === 'landing-slot-replace' && e.data.src) {
      var slot = document.querySelector('[data-photo-slot="' + e.data.slotId + '"]');
      if (!slot && picked) slot = findPhotoTarget();
      applyPhoto(slot, e.data.src);
      window.parent.postMessage({ type: 'landing-html-update', html: document.documentElement.outerHTML }, '*');
    }
    // Прямая вставка фото в выделенный элемент (без ИИ)
    if (e.data.type === 'landing-photo-into-picked' && e.data.src) {
      var ok = applyPhoto(findPhotoTarget(), e.data.src);
      window.parent.postMessage({ type: 'landing-photo-result', ok: ok }, '*');
      if (ok) window.parent.postMessage({ type: 'landing-html-update', html: document.documentElement.outerHTML }, '*');
    }
    // Установка цели кнопки/ссылки (без ИИ, мгновенно)
    if (e.data.type === 'landing-set-btn-target' && picked) {
      var target = e.data.target; // 'contact' | 'hero' | '#id' | 'https://...'
      var isExternal = target.indexOf('http') === 0;
      var href = isExternal ? target : '#' + target.replace(/^#/, '');
      var scrollJs = isExternal
        ? 'window.open("' + href + '","_blank")'
        : 'document.getElementById("' + target.replace(/^#/, '') + '")?.scrollIntoView({behavior:"smooth"})';
      var t = picked.tagName ? picked.tagName.toLowerCase() : '';
      if (t === 'a') {
        picked.href = href;
        picked.removeAttribute('onclick');
        if (isExternal) { picked.target = '_blank'; picked.rel = 'noopener'; }
      } else if (t === 'button') {
        picked.removeAttribute('href');
        picked.onclick = new Function(scrollJs);
        picked.setAttribute('onclick', scrollJs);
      } else {
        // любой другой элемент — добавляем onclick
        picked.setAttribute('onclick', scrollJs);
        picked.style.cursor = 'pointer';
      }
      window.parent.postMessage({ type: 'landing-html-update', html: document.documentElement.outerHTML }, '*');
      window.parent.postMessage({ type: 'landing-btn-target-set', ok: true }, '*');
    }
    // Вставка видео в выделенный фото-слот/элемент (embedHtml готов в родителе)
    if (e.data.type === 'landing-video-into-picked' && e.data.embed) {
      var vt = findPhotoTarget();
      if (vt) {
        var tn = vt.tagName ? vt.tagName.toLowerCase() : '';
        if (tn === 'img') {
          // заменяем картинку обёрткой с видео
          var holder = document.createElement('div');
          holder.innerHTML = e.data.embed;
          vt.parentNode.replaceChild(holder.firstElementChild, vt);
        } else {
          vt.innerHTML = e.data.embed;
          vt.classList.add('has-photo');
          vt.style.border = 'none'; vt.style.outline = 'none'; vt.style.overflow = 'hidden';
          if (!vt.style.minHeight && vt.offsetHeight < 60) vt.style.minHeight = '220px';
        }
        window.parent.postMessage({ type: 'landing-photo-result', ok: true }, '*');
        window.parent.postMessage({ type: 'landing-html-update', html: document.documentElement.outerHTML }, '*');
      } else {
        window.parent.postMessage({ type: 'landing-photo-result', ok: false }, '*');
      }
    }
  });

  // Esc — снять выделение
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') clearPicked(); });
})();
</script>`;

const SEO_DEFAULTS: SeoData = { title: "", description: "", keywords: "", robots: "index,follow", faviconSvg: "", metrikaId: "", webmasterVerify: "" };

const FORM_SUBMIT_URL = "https://functions.poehali.dev/041d6ee6-6786-4ccf-bb8a-5cda8dfb333b";

function buildFullHtml(blocks: LandingBlock[], style: LandingStyle, privacyHtmlBody?: string, seo: SeoData = SEO_DEFAULTS, userId?: number): string {
  const hf = `${style.headingFont}, serif`;
  const bf = `${style.bodyFont}, sans-serif`;
  const gfonts = encodeURIComponent(`${style.headingFont}:wght@700&family=${style.bodyFont}:wght@400;600`);
  const root = `<style id="root-vars">
:root{--c-primary:${style.primary};--c-accent:${style.accent};--c-dark:${style.dark};--c-light:${style.light};--c-text:${style.text};--font-heading:${hf};--font-body:${bf};}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;overflow-x:hidden;}
body{font-family:var(--font-body);color:var(--c-text);background:var(--c-light);overflow-x:hidden;max-width:100vw;}
h1,h2,h3,h4{font-family:var(--font-heading);}
.container{max-width:1200px;margin:0 auto;padding:0 20px;}
/* Защита от горизонтального выезда блоков за экран */
[data-block-id]{max-width:100%;overflow-x:hidden;}
[data-block-id] img,[data-block-id] iframe,[data-block-id] video{max-width:100%;}
img{max-width:100%;}
@import url('https://fonts.googleapis.com/css2?family=${gfonts}&display=swap');
</style>`;
  const htmlParts = blocks.map(b => `<div data-block-id="${b.id}" data-block-label="${b.label}">${b.html}</div>`).join("\n");
  const privacySection = privacyHtmlBody ? `\n<div id="page-privacy" style="display:none">\n${privacyHtmlBody}\n</div>` : "";

  // SEO теги
  const pageTitle = seo.title || "Лендинг";
  const metaDesc = seo.description ? `\n<meta name="description" content="${seo.description.replace(/"/g, "&quot;")}"/>` : "";
  const metaKeys = seo.keywords ? `\n<meta name="keywords" content="${seo.keywords.replace(/"/g, "&quot;")}"/>` : "";
  const metaRobots = seo.robots ? `\n<meta name="robots" content="${seo.robots}"/>` : "";
  const metaWebmaster = seo.webmasterVerify ? `\n<meta name="yandex-verification" content="${seo.webmasterVerify}"/>` : "";
  const faviconTag = seo.faviconSvg
    ? `\n<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(seo.faviconSvg)}"/>`
    : "";

  // Яндекс.Метрика
  const metrikaScript = seo.metrikaId ? `
<script type="text/javascript">
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${seo.metrikaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${seo.metrikaId}" style="position:absolute;left:-9999px;" alt=""/></div></noscript>` : "";

  const router = privacyHtmlBody ? `<script>
(function(){
  var landing = document.getElementById('page-landing');
  var privacy = document.getElementById('page-privacy');
  function hideAll(){ landing.style.display='none'; if(privacy) privacy.style.display='none'; }
  function route(){
    var hash = location.hash.replace('#','');
    hideAll();
    if((hash === 'privacy' || hash === '/privacy') && privacy){ privacy.style.display='block'; }
    else { landing.style.display='block'; }
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange', route);
  route();
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href="/privacy"]');
    if(a){ e.preventDefault(); location.hash='privacy'; }
  });
})();
</script>` : "";

  const formScript = userId ? `<script>
(function(){
  var UID = ${userId};
  var SUBMIT_URL = '${FORM_SUBMIT_URL}';
  document.addEventListener('submit', function(e){
    var form = e.target;
    if(!form || form.tagName !== 'FORM') return;
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"],input[type="submit"]');
    var origText = btn ? (btn.textContent || btn.value) : '';
    if(btn) { btn.textContent = 'Отправляю...'; btn.disabled = true; }
    var fields = {};
    var els = form.elements;
    for(var i=0;i<els.length;i++){
      var el = els[i];
      if(el.type === 'submit' || el.type === 'button' || el.type === 'checkbox' || !el.value) continue;
      var key = el.placeholder || el.name || el.id || ('Поле ' + (i+1));
      fields[key] = el.value;
    }
    fetch(SUBMIT_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({uid: UID, fields: fields, domain: window.location.hostname})
    }).then(function(r){ return r.json(); }).then(function(){
      form.reset();
      if(btn){ btn.textContent = origText; btn.disabled = false; }
      var msg = document.createElement('div');
      msg.textContent = 'Спасибо! Ваша заявка отправлена.';
      msg.style.cssText = 'margin-top:12px;padding:12px 16px;background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;color:#065f46;font-size:14px;font-weight:600;';
      form.appendChild(msg);
      setTimeout(function(){ msg.remove(); }, 5000);
    }).catch(function(){
      if(btn){ btn.textContent = origText; btn.disabled = false; }
    });
  });
})();
</script>` : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>${faviconTag}
<title>${pageTitle}</title>${metaDesc}${metaKeys}${metaRobots}${metaWebmaster}
${root}
</head>
<body>${metrikaScript}
<div id="page-landing">
${htmlParts}
</div>${privacySection}
${router}
${formScript}
</body>
</html>`;
}

function session() { return localStorage.getItem("lk_session") || ""; }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ── Список проектов ────────────────────────────────────────────────────────────
interface PlanInfo { plan: number; plan_name: string; max_landings: number; }

function ProjectsList({ onOpen, onNew }: { onOpen: (p: LandingProject) => void; onNew: () => void }) {
  const [projects, setProjects] = useState<LandingProject[]>([]);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(LANDING_API_URL, { headers: { "X-Session-Id": session() } })
      .then(r => r.json()).then(d => {
        setProjects(d.projects || []);
        if (d.plan) setPlanInfo(d.plan);
      }).finally(() => setLoading(false));
  }, []);

  async function deleteProject(id: string) {
    setDeleting(true);
    await fetch(LANDING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": session() },
      body: JSON.stringify({ action: "delete", id }),
    });
    setProjects(prev => prev.filter(p => p.id !== id));
    setConfirmDelete(null);
    setDeleting(false);
  }
  const used = projects.length;
  const max = planInfo?.max_landings ?? 3;
  const limitReached = used >= max;
  const fillPct = Math.min(100, Math.round((used / max) * 100));
  const barColor = fillPct >= 100 ? "#ef4444" : fillPct >= 75 ? "#f59e0b" : ACCENT;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Globe" size={20} style={{ color: ACCENT }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Конструктор лендингов</div>
          <div style={{ fontSize: 13, color: "#888" }}>Ваши проекты</div>
        </div>
        <button onClick={onNew} disabled={limitReached} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "none", background: limitReached ? "#E2E8F0" : ACCENT, color: limitReached ? "#94A3B8" : "#fff", fontSize: 14, fontWeight: 700, cursor: limitReached ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="Plus" size={16} />Новый лендинг
        </button>
      </div>

      {/* Плашка тарифа и лимита */}
      {!loading && planInfo && (
        <div style={{ background: limitReached ? "#FFF7ED" : "#fff", border: `1.5px solid ${limitReached ? "#FED7AA" : "#E8ECF0"}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: limitReached ? "#FEF3C7" : ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={limitReached ? "AlertTriangle" : "Layers"} size={18} style={{ color: limitReached ? "#f59e0b" : ACCENT }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Тариф «{planInfo.plan_name}»</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: limitReached ? "#ef4444" : "#0F172A" }}>{used} / {max} лендингов</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "#F1F5F9", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fillPct}%`, borderRadius: 6, background: barColor, transition: "width 0.4s" }} />
            </div>
            {limitReached && (
              <div style={{ fontSize: 12, color: "#92400e", marginTop: 5 }}>Лимит исчерпан — перейдите на тариф выше, чтобы создавать новые лендинги</div>
            )}
          </div>
          {limitReached && (
            <a href="/tseny" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: "#f59e0b", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" }}>
              <Icon name="ArrowUp" size={14} />Повысить тариф
            </a>
          )}
        </div>
      )}
      {loading && <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Загрузка...</div>}
      {!loading && projects.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "2px dashed #E8ECF0", padding: 48, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="Globe" size={28} style={{ color: ACCENT }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Лендингов пока нет</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Создайте первый — ИИ соберёт его по блокам за пару минут</div>
          <button onClick={onNew} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="Plus" size={16} />Создать первый лендинг
          </button>
        </div>
      )}
      {!loading && projects.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {projects.map(p => (
            <div key={p.id} style={{ position: "relative" }}>
              {confirmDelete === p.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff0f0", border: "1.5px solid #fca5a5", borderRadius: 14, padding: "14px 18px" }}>
                  <Icon name="Trash2" size={16} style={{ color: "#ef4444", flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, color: "#7f1d1d", fontWeight: 600 }}>Удалить «{p.title}»?</div>
                  <button onClick={() => deleteProject(p.id)} disabled={deleting}
                    style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                    {deleting ? "..." : "Удалить"}
                  </button>
                  <button onClick={() => setConfirmDelete(null)}
                    style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", color: "#555", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                    Отмена
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 14, padding: "14px 18px", transition: "border-color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8ECF0"; }}
                >
                  {(() => {
                    const tpl = TEMPLATES.find(t => t.id === p.landing_type);
                    return (
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: tpl ? tpl.bg : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1.5px solid ${tpl ? tpl.border : "#E8ECF0"}` }}>
                        <Icon name={tpl ? tpl.icon : "FileText"} size={20} style={{ color: tpl ? tpl.color : "#64748B" }} />
                      </div>
                    );
                  })()}
                  <button onClick={() => onOpen(p)} style={{ flex: 1, minWidth: 0, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "Montserrat,sans-serif" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {(() => { const tpl = TEMPLATES.find(t => t.id === p.landing_type); return tpl ? tpl.title : (p.landing_type || "Лендинг"); })()}  · {formatDate(p.updated_at)}
                    </div>
                  </button>
                  <button onClick={() => onOpen(p)}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    <Icon name="ChevronRight" size={15} style={{ color: ACCENT }} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setConfirmDelete(p.id); }}
                    style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                    <Icon name="Trash2" size={14} style={{ color: "#ef4444" }} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ── База знаний ───────────────────────────────────────────────────────────────
const HELP_SECTIONS = [
  {
    id: "create", icon: "Sparkles", color: "#8b5cf6", title: "Как создать лендинг",
    steps: [
      { icon: "LayoutTemplate", text: "Выберите шаблон — классический, продажник, портфолио и другие" },
      { icon: "MessageCircle", text: "Ответьте на вопросы ИИ о вашем бизнесе: название, услуги, контакты" },
      { icon: "Zap", text: "Нажмите «Создать» — ИИ сгенерирует все блоки автоматически" },
      { icon: "Eye", text: "Просмотрите результат и при необходимости отредактируйте блоки" },
    ],
  },
  {
    id: "edit", icon: "Edit3", color: "#0ea5e9", title: "Как редактировать",
    steps: [
      { icon: "MousePointer", text: "Кликните на любой текст прямо в превью — он станет редактируемым" },
      { icon: "RefreshCw", text: "Кнопка «↻» рядом с блоком — попросите ИИ переделать только этот блок" },
      { icon: "Palette", text: "Вкладка «Стиль» — меняйте цвета и шрифты всего лендинга сразу" },
      { icon: "Save", text: "Не забывайте нажимать «Сохранить» — изменения хранятся в вашем проекте" },
    ],
  },
  {
    id: "chat", icon: "MessageCircle", color: "#10b981", title: "Как общаться с ИИ",
    steps: [
      { icon: "Info", text: "Рассказывайте о бизнесе своими словами — ИИ сам разберётся и задаст нужные вопросы" },
      { icon: "CheckCircle", text: "Когда данных достаточно, ИИ предложит «Создать лендинг» — соглашайтесь" },
      { icon: "RotateCcw", text: "После генерации можно продолжить чат: «Сделай текст про скидку 20%»" },
      { icon: "Lightbulb", text: "Совет: чем больше деталей вы дадите — тем точнее получится лендинг" },
    ],
  },
  {
    id: "photos", icon: "Image", color: "#f59e0b", title: "Как вставить фотографии",
    steps: [
      { icon: "MousePointer", text: "В лендинге есть серые заглушки-слоты — кликните на любую из них" },
      { icon: "Upload", text: "Выберите фото с компьютера или телефона — оно сразу встанет на место" },
      { icon: "Crop", text: "Фото автоматически обрезается под нужный размер блока" },
      { icon: "Lightbulb", text: "Совет: используйте качественные фото — это сильно влияет на впечатление от сайта" },
    ],
  },
  {
    id: "publish", icon: "Globe", color: "#ef4444", title: "Как опубликовать",
    steps: [
      { icon: "Save", text: "Сохраните лендинг кнопкой «Сохранить» в шапке редактора" },
      { icon: "ExternalLink", text: "Нажмите «Опубликовать» — сайт мгновенно становится доступен в интернете" },
      { icon: "Link", text: "Вы получите ссылку вида yourbrand.poehali.site — её можно отправить клиентам" },
      { icon: "Globe", text: "Хотите свой домен? Подключите через раздел «Домен» в настройках публикации" },
    ],
  },
];

function LandingHelp({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState("create");
  const section = HELP_SECTIONS.find(s => s.id === activeSection)!;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px 32px", maxHeight: "85vh", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A" }}>База знаний</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Как работать с конструктором лендингов</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#F1F5F9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="X" size={16} style={{ color: "#64748B" }} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {HELP_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${activeSection === s.id ? s.color : "#E2E8F0"}`, background: activeSection === s.id ? `${s.color}14` : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap", transition: "all 0.15s" }}>
              <Icon name={s.icon} size={13} style={{ color: activeSection === s.id ? s.color : "#94A3B8" }} />
              <span style={{ fontSize: 12, fontWeight: activeSection === s.id ? 700 : 500, color: activeSection === s.id ? s.color : "#64748B" }}>{s.title}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 14, background: `${section.color}10`, border: `1.5px solid ${section.color}30` }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: section.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={section.icon} size={18} style={{ color: "#fff" }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{section.title}</div>
          </div>
          {section.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E8ECF0" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${section.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Icon name={step.icon} size={14} style={{ color: section.color }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: section.color, marginTop: 3, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{step.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fcd34d" }}>
          <Icon name="Lightbulb" size={16} style={{ color: "#d97706", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, color: "#92400e", lineHeight: 1.55 }}>Если что-то пошло не так — напишите в чат ИИ: «Переделай» или «Измени текст на ...» и ИИ поправит нужный блок.</span>
        </div>
      </div>
    </div>
  );
}

// ── Генератор изображений в редакторе ─────────────────────────────────────────
const AI_IMAGE_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a";
const IMG_ASPECTS = [
  { value: "1024x1024", label: "Квадрат",  icon: "Square"  },
  { value: "1792x1024", label: "Пейзаж",   icon: "Monitor" },
  { value: "1024x1792", label: "Портрет",  icon: "Smartphone" },
];

function LandingImageGen() {
  const [prompt, setPrompt]   = useState("");
  const [aspect, setAspect]   = useState("1792x1024");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);

  async function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true); setError(""); setImageUrl(null);
    try {
      const res = await fetch(AI_IMAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ prompt: prompt.trim(), aspect_ratio: aspect }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка генерации"); return; }
      const url = data.images?.[0]?.url;
      if (url) setImageUrl(url);
      else setError("Сервис не вернул изображение");
    } catch { setError("Ошибка сети, попробуйте ещё раз"); }
    finally { setLoading(false); }
  }

  async function copyUrl() {
    if (!imageUrl) return;
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function download() {
    if (!imageUrl) return;
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "landing-image.png";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <style>{`@keyframes imgSpin{to{transform:rotate(360deg)}}`}</style>

      {/* Промпт */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 6, paddingLeft: 2 }}>ОПИСАНИЕ ИЗОБРАЖЕНИЯ</div>
        <textarea
          value={prompt} onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } }}
          placeholder="Например: уютный офис, современный интерьер, мягкий свет, минимализм"
          rows={3}
          disabled={loading}
          style={{ width: "100%", padding: "9px 11px", borderRadius: 9, border: "1.5px solid #E2E8F0", fontSize: 12, fontFamily: "Montserrat,sans-serif", resize: "none", outline: "none", color: "#0F172A", lineHeight: 1.5, boxSizing: "border-box" }}
        />
        {/* Подсказки */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
          {["Фото команды", "Интерьер офиса", "Продукт крупным планом", "Баннер с акцией", "Городской пейзаж"].map(hint => (
            <button key={hint} onClick={() => setPrompt(p => p ? `${p}, ${hint.toLowerCase()}` : hint.toLowerCase())}
              style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, border: "1px solid #E2E8F0", background: "#fff", color: "#64748B", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              + {hint}
            </button>
          ))}
        </div>
      </div>

      {/* Формат */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 6, paddingLeft: 2 }}>ФОРМАТ</div>
        <div style={{ display: "flex", gap: 6 }}>
          {IMG_ASPECTS.map(a => (
            <button key={a.value} onClick={() => setAspect(a.value)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px", borderRadius: 9, border: `1.5px solid ${aspect === a.value ? ACCENT : "#E2E8F0"}`, background: aspect === a.value ? ACCENT_LIGHT : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name={a.icon} size={14} style={{ color: aspect === a.value ? ACCENT : "#94A3B8" }} />
              <span style={{ fontSize: 10, fontWeight: aspect === a.value ? 700 : 400, color: aspect === a.value ? ACCENT : "#64748B" }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Кнопка */}
      <button onClick={generate} disabled={!prompt.trim() || loading}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", borderRadius: 10, border: "none", background: prompt.trim() && !loading ? `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,55%))` : "#E8ECF0", color: prompt.trim() && !loading ? "#fff" : "#aaa", fontSize: 13, fontWeight: 700, cursor: prompt.trim() && !loading ? "pointer" : "default", fontFamily: "Montserrat,sans-serif" }}>
        {loading
          ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "imgSpin 0.8s linear infinite" }} /> Генерирую...</>
          : <><Icon name="Sparkles" size={15} /> Сгенерировать</>}
      </button>

      {/* Ошибка */}
      {error && <div style={{ fontSize: 12, color: "#ef4444", padding: "8px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fca5a5" }}>{error}</div>}

      {/* Результат */}
      {imageUrl && (
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E8ECF0" }}>
          <img src={imageUrl} alt="Сгенерированное" style={{ width: "100%", display: "block" }} />
          <div style={{ display: "flex", gap: 6, padding: "10px 10px" }}>
            <button onClick={download}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 8, border: `1px solid ${ACCENT}`, background: ACCENT_LIGHT, color: ACCENT, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Download" size={13} /> Скачать
            </button>
            <button onClick={copyUrl}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 8, border: "1px solid #E2E8F0", background: copied ? "#f0fdf4" : "#fff", color: copied ? "#059669" : "#64748B", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name={copied ? "Check" : "Copy"} size={13} /> {copied ? "Скопировано" : "Копировать ссылку"}
            </button>
          </div>
          <div style={{ padding: "0 10px 10px", fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>
            Скопируйте ссылку → нажмите на фото-слот в лендинге → вставьте URL
          </div>
        </div>
      )}
    </div>
  );
}

// ── Выбор типа ────────────────────────────────────────────────────────────────
const TEMPLATES: { id: LandingType; icon: string; title: string; desc: string; blocks: string; color: string; bg: string; border: string; preview: string }[] = [
  { id: "classic",      icon: "LayoutTemplate",  title: "Классический",        desc: "Шапка → Обложка → О нас → Услуги → Отзывы → Контакты → Футер",                       blocks: "7 блоков", color: ACCENT,     bg: ACCENT_LIGHT, border: `${ACCENT}60`, preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/3dcd7e73-3fad-48a0-8865-601629a01706.jpg" },
  { id: "storytelling", icon: "BookOpen",         title: "Сторителлинг",        desc: "Обложка → Боли клиента → Решение → Услуги → Команда → Отзывы → Контакты",            blocks: "7 блоков", color: "#8b5cf6",  bg: "#f5f3ff",    border: "#c4b5fd",       preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/303776e8-cb9b-43e8-8c68-c26fd97908fd.jpg" },
  { id: "sales",        icon: "TrendingUp",       title: "Продажник",           desc: "Оффер → Выгоды → Как работаем → Цены → FAQ → Отзывы → Форма заявки",                 blocks: "7 блоков", color: "#ef4444",  bg: "#fef2f2",    border: "#fca5a5",       preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/be0060d7-d206-425e-bc63-3b6dca953a5a.jpg" },
  { id: "portfolio",    icon: "User",             title: "Портфолио / мастер",  desc: "Личное фото + имя → Обо мне → Работы → Услуги → Отзывы → Запись",                    blocks: "6 блоков", color: "#0ea5e9",  bg: "#f0f9ff",    border: "#7dd3fc",       preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/9a8c8474-2c22-4fc7-8c3b-ad538069c49d.jpg" },
  { id: "b2b",          icon: "Briefcase",        title: "Компания B2B",        desc: "О компании → Услуги с ценами → Кейсы → Команда → Клиенты → Контакты",                blocks: "6 блоков", color: "#1d4ed8",  bg: "#eff6ff",    border: "#93c5fd",       preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/5822d20f-ab6a-41b7-8c1b-1d0cfcad876c.jpg" },
  { id: "event",        icon: "Calendar",         title: "Мероприятие / курс",  desc: "Анонс + дата → Программа → Спикеры → Тарифы → FAQ → Регистрация",                    blocks: "6 блоков", color: "#d97706",  bg: "#fffbeb",    border: "#fcd34d",       preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/80f2203b-d7cd-4579-95cc-ff4e39e0dad6.jpg" },
  { id: "restaurant",   icon: "UtensilsCrossed",  title: "Ресторан / кафе",     desc: "Атмосфера → Меню-хиты → О заведении → Акции → Бронирование стола",                   blocks: "5 блоков", color: "#b45309",  bg: "#fef3c7",    border: "#fbbf24",       preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/4a334c7b-026d-46b9-aceb-8fe3e0335083.jpg" },
  { id: "realty",       icon: "Building2",        title: "Недвижимость",        desc: "Фото объекта → Характеристики → Район → Планировки → Контакты",                       blocks: "5 блоков", color: "#059669",  bg: "#ecfdf5",    border: "#6ee7b7",       preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/95238cdf-c70f-4134-afc2-0ee3a3757f41.jpg" },
  { id: "product",      icon: "Package",          title: "Один товар",          desc: "Товар крупным планом → Выгоды → Как работает → Отзывы → Цена + заказ",               blocks: "5 блоков", color: "#7c3aed",  bg: "#faf5ff",    border: "#c4b5fd",       preview: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/8e760322-4f76-4a2d-b33c-729aad4757b8.jpg" },
  { id: "premium",      icon: "Crown",            title: "Премиум",             desc: "Шапка → Обложка → О нас → Услуги → Галерея → Отзывы → Контакты → Футер",                blocks: "8 блоков", color: "#a16207",  bg: "#fefce8",    border: "#fde047",       preview: "" },
  { id: "budget",       icon: "LayoutTemplate",   title: "Лендинг",             desc: "Обложка → Услуги → Отзывы → Контакты",                                                  blocks: "4 блока",  color: ACCENT,     bg: ACCENT_LIGHT, border: `${ACCENT}60`,   preview: "" },
];

function TypeSelector({ onSelect }: { onSelect: (t: LandingType) => void }) {
  const [hovered, setHovered] = useState<LandingType | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Выберите шаблон лендинга</div>
        <div style={{ fontSize: 12, color: "#64748B" }}>Выберите готовую структуру под вашу задачу — ИИ задаст вопросы и наполнит её вашим контентом</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)}
            onMouseEnter={() => setHovered(t.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ textAlign: "left", background: hovered === t.id ? t.bg : "#fff", border: `2px solid ${hovered === t.id ? t.color : "#E8ECF0"}`, borderRadius: 14, padding: 0, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "all 0.18s", overflow: "hidden", boxShadow: hovered === t.id ? `0 6px 20px ${t.color}28` : "none" }}
          >
            {/* Превью */}
            <div style={{ width: "100%", height: 110, overflow: "hidden", position: "relative", background: t.bg }}>
              <img src={t.preview} alt={t.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.3s", transform: hovered === t.id ? "scale(1.06)" : "scale(1)" }}
              />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${t.bg}ee 100%)` }} />
              <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, fontWeight: 700, color: t.color, background: "#ffffffdd", padding: "2px 8px", borderRadius: 10 }}>{t.blocks}</span>
            </div>
            {/* Текст */}
            <div style={{ padding: "10px 12px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: t.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={t.icon} size={12} style={{ color: "#fff" }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{t.title}</div>
              </div>
              <div style={{ fontSize: 10, color: "#64748B", lineHeight: 1.5, marginBottom: 8 }}>{t.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.color }}>Выбрать →</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Редактор стиля ────────────────────────────────────────────────────────────
function StyleEditor({ style, onChange }: { style: LandingStyle; onChange: (s: LandingStyle) => void }) {
  const colors = [
    { key: "primary" as keyof LandingStyle, label: "Основной" },
    { key: "accent"  as keyof LandingStyle, label: "Акцент" },
    { key: "dark"    as keyof LandingStyle, label: "Тёмный фон" },
    { key: "light"   as keyof LandingStyle, label: "Светлый фон" },
    { key: "text"    as keyof LandingStyle, label: "Текст" },
  ];
  const fonts = ["Playfair Display", "Cormorant Garamond", "Raleway", "Merriweather", "Roboto Slab"];
  const bodyFonts = ["Montserrat", "Inter", "Open Sans", "Lato", "Nunito"];

  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiVariants, setAiVariants] = useState<Array<LandingStyle & { name: string }>>([]);

  async function askAiStyle() {
    if (!aiInput.trim() || aiLoading) return;
    setAiLoading(true);
    setAiVariants([]);
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": localStorage.getItem("lk_session") || "" },
        body: JSON.stringify({ mode: "edit-style", style, styleTask: aiInput }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = await res.json();
      if (res.status === 402) { showEnergyGate({ message: data.error }); return; }
      if (data.variants?.length) setAiVariants(data.variants);
    } catch (_e) {
      // ignore
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Стиль сайта</div>

      {/* ИИ-чат для стиля */}
      <div style={{ marginBottom: 16, background: "hsl(270,70%,97%)", borderRadius: 10, padding: 12, border: "1px solid hsl(270,70%,88%)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(270,60%,45%)", marginBottom: 8 }}>✨ СПРОСИ ИИ</div>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") askAiStyle(); }}
            placeholder='Например: "сделай тёмный премиальный стиль"'
            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid hsl(270,70%,80%)", fontSize: 12, fontFamily: "Montserrat,sans-serif", outline: "none", background: "#fff", color: "#1a1a1a" }}
          />
          <button onClick={askAiStyle} disabled={aiLoading || !aiInput.trim()}
            style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "hsl(270,70%,50%)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: aiLoading ? "wait" : "pointer", fontFamily: "Montserrat,sans-serif", opacity: aiLoading || !aiInput.trim() ? 0.6 : 1, whiteSpace: "nowrap" }}>
            {aiLoading ? "..." : "Создать"}
          </button>
        </div>
        {aiVariants.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {aiVariants.map((v, i) => (
              <button key={i} onClick={() => { const { name: _n, ...s } = v; onChange(s as LandingStyle); setAiVariants([]); setAiInput(""); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, border: "1px solid hsl(270,70%,80%)", background: "#fff", cursor: "pointer", textAlign: "left", width: "100%" }}>
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  {(["dark", "primary", "accent"] as (keyof LandingStyle)[]).map(k => (
                    <div key={k} style={{ width: 14, height: 14, borderRadius: 4, background: String(v[k]) }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1 }}>{v.name}</span>
                <span style={{ fontSize: 11, color: "hsl(270,70%,50%)", fontWeight: 700 }}>Применить</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontWeight: 600 }}>ЦВЕТА</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {colors.map(c => (
            <div key={c.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <input type="color" value={String(style[c.key])}
                onChange={e => onChange({ ...style, [c.key]: e.target.value })}
                style={{ width: 36, height: 36, border: "none", borderRadius: 8, cursor: "pointer", padding: 2 }}
              />
              <span style={{ fontSize: 10, color: "#888" }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 600 }}>ЗАГОЛОВКИ</div>
          <select value={style.headingFont} onChange={e => onChange({ ...style, headingFont: e.target.value })}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "Montserrat,sans-serif", cursor: "pointer" }}>
            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 600 }}>ТЕКСТ</div>
          <select value={style.bodyFont} onChange={e => onChange({ ...style, bodyFont: e.target.value })}
            style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "Montserrat,sans-serif", cursor: "pointer" }}>
            {bodyFonts.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ── SEO редактор ──────────────────────────────────────────────────────────────
function SeoEditor({ seo, onChange }: { seo: SeoData; onChange: (s: SeoData) => void }) {
  const set = (k: keyof SeoData, v: string) => onChange({ ...seo, [k]: v });
  const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, fontFamily: "Montserrat,sans-serif", outline: "none", color: "#1a1a1a", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: 11, color: "#888", fontWeight: 600 as const, marginBottom: 4, display: "block" as const };
  const hintStyle = { fontSize: 11, color: "#94a3b8", marginTop: 3, lineHeight: 1.4 };

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>SEO и аналитика</div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Настройки влияют на отображение сайта в поисковиках и подключение счётчиков.</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Тайтл */}
        <div>
          <label style={labelStyle}>ЗАГОЛОВОК СТРАНИЦЫ (TITLE)</label>
          <input value={seo.title} onChange={e => set("title", e.target.value)}
            placeholder="Название вашего бизнеса — краткое описание услуги"
            style={inputStyle} />
          <div style={hintStyle}>Отображается во вкладке браузера и в результатах поиска. 50–60 символов.</div>
        </div>

        {/* Дескрипшн */}
        <div>
          <label style={labelStyle}>ОПИСАНИЕ СТРАНИЦЫ (DESCRIPTION)</label>
          <textarea value={seo.description} onChange={e => set("description", e.target.value)}
            placeholder="Краткое описание услуги или бизнеса для поисковиков. Что вы предлагаете и для кого."
            rows={3}
            style={{ ...inputStyle, resize: "none" as const }} />
          <div style={hintStyle}>Сниппет в поисковой выдаче. 120–160 символов.</div>
        </div>

        {/* Ключевые слова */}
        <div>
          <label style={labelStyle}>КЛЮЧЕВЫЕ СЛОВА (KEYWORDS)</label>
          <input value={seo.keywords} onChange={e => set("keywords", e.target.value)}
            placeholder="массаж, салон красоты, стрижка, маникюр Москва"
            style={inputStyle} />
          <div style={hintStyle}>Через запятую. Google их игнорирует, но Яндекс учитывает.</div>
        </div>

        {/* Robots */}
        <div>
          <label style={labelStyle}>ИНДЕКСАЦИЯ (ROBOTS)</label>
          <select value={seo.robots} onChange={e => set("robots", e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="index,follow">Индексировать (index, follow)</option>
            <option value="noindex,nofollow">Не индексировать (noindex, nofollow)</option>
            <option value="noindex,follow">Страницу не индексировать, ссылки следовать</option>
          </select>
        </div>

        {/* Фавикон */}
        <div>
          <label style={labelStyle}>ФАВИКОН (SVG-КОД)</label>
          {seo.faviconSvg && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div
                style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}
                dangerouslySetInnerHTML={{ __html: seo.faviconSvg }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 16, height: 16, borderRadius: 3, overflow: "hidden", border: "1px solid #e2e8f0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  dangerouslySetInnerHTML={{ __html: seo.faviconSvg }}
                />
                <span style={{ fontSize: 12, color: "#64748b" }}>Так выглядит во вкладке браузера</span>
              </div>
            </div>
          )}
          <textarea value={seo.faviconSvg} onChange={e => set("faviconSvg", e.target.value)}
            placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#2D5A87"/><text x="16" y="22" text-anchor="middle" font-size="18" fill="#fff">С</text></svg>'}
            rows={4}
            style={{ ...inputStyle, resize: "none" as const, fontFamily: "monospace", fontSize: 11 }} />
          <div style={hintStyle}>ИИ генерирует фавикон автоматически при создании лендинга. Можно отредактировать SVG вручную.</div>
        </div>

        {/* Разделитель */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 12 }}>АНАЛИТИКА И ВЕРИФИКАЦИЯ</div>
        </div>

        {/* Яндекс.Метрика */}
        <div>
          <label style={labelStyle}>ЯНДЕКС.МЕТРИКА — ID СЧЁТЧИКА</label>
          <input value={seo.metrikaId} onChange={e => set("metrikaId", e.target.value.replace(/\D/g, ""))}
            placeholder="12345678"
            style={inputStyle} />
          <div style={hintStyle}>Только цифры. Найти в Яндекс.Метрике: Настройки → Счётчик → Номер счётчика.</div>
        </div>

        {/* Яндекс.Вебмастер */}
        <div>
          <label style={labelStyle}>ЯНДЕКС.ВЕБМАСТЕР — КОД ВЕРИФИКАЦИИ</label>
          <input value={seo.webmasterVerify} onChange={e => set("webmasterVerify", e.target.value.trim())}
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            style={inputStyle} />
          <div style={hintStyle}>В Яндекс.Вебмастере: Добавить сайт → HTML-метатег → скопируйте значение content="..."</div>
        </div>

      </div>

      <div style={{ marginTop: 14, padding: "10px 12px", background: "#eff6ff", borderRadius: 8, fontSize: 12, color: "#3b82f6", lineHeight: 1.6 }}>
        Настройки SEO встраиваются в &lt;head&gt; лендинга — работают при скачивании и при просмотре по ссылке.
      </div>
    </div>
  );
}

// Удаляет служебные маркеры редактора из HTML перед сохранением
function stripTargetMarker(html: string): string {
  return html
    .replace(/\s*data-lnd-target=["']1["']/gi, "")
    .replace(/\s*class=["']([^"']*?)\blnd-(picked|hover)\b([^"']*?)["']/gi, (_m, b, _k, a) => {
      const cls = (b + " " + a).replace(/\s+/g, " ").trim();
      return cls ? ` class="${cls}"` : "";
    });
}

// Строит embed-HTML видео по ссылке (Кинескоп, YouTube, Rutube, VK, Я.Диск, прямой mp4)
function buildVideoEmbed(url: string): string | null {
  const u = (url || "").trim();
  if (!u) return null;
  const wrap = (src: string) =>
    `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:inherit;width:100%;"><iframe src="${src}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen allow="autoplay;fullscreen;encrypted-media"></iframe></div>`;
  const kinescope = u.match(/kinescope\.io\/(?:embed\/)?([a-zA-Z0-9]+)/);
  const yaDisk = u.match(/disk\.yandex\.(?:ru|com)\/(?:i|d)\/([a-zA-Z0-9_-]+)/);
  const youtube = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const vkExt = u.match(/video_ext\.php\?[^"']*oid=(-?\d+)[^"']*id=(\d+)/) || u.match(/video_ext\.php\?[^"']*id=(\d+)[^"']*oid=(-?\d+)/);
  const vk = u.match(/(?:vk\.com|vkvideo\.ru)\/(?:video|clip)(-?\d+)_(\d+)/);
  const rutube = u.match(/rutube\.ru\/(?:video|play\/embed)\/([a-zA-Z0-9]+)/);
  if (kinescope) return wrap(`https://kinescope.io/embed/${kinescope[1]}`);
  if (youtube) return wrap(`https://www.youtube.com/embed/${youtube[1]}`);
  if (rutube) return wrap(`https://rutube.ru/play/embed/${rutube[1]}`);
  if (vkExt) return wrap(`https://vk.com/video_ext.php?oid=${vkExt[1]}&id=${vkExt[2]}&hd=2`);
  if (vk) return wrap(`https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&hd=2`);
  if (yaDisk) return wrap(`https://disk.yandex.ru/i/${yaDisk[1]}/preview`);
  // прямая ссылка/готовый embed
  if (/^https?:\/\//i.test(u)) return wrap(u);
  return null;
}

// Плейсхолдер фото-слота (заглушка «Загрузить фото»)
const PHOTO_SLOT_PLACEHOLDER =
  '<div class="photo-slot" data-photo-slot="auto-fix" style="aspect-ratio:16/9;overflow:hidden;border-radius:14px;display:flex;align-items:center;justify-content:center;background:#f1f5f9;cursor:pointer;">' +
  '<div class="photo-placeholder" style="text-align:center;color:#94a3b8;padding:20px;">' +
  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>' +
  '<div style="margin-top:8px;font-size:13px">Нажмите, чтобы загрузить фото</div></div></div>';

// Заменяет битые внешние картинки (postimg, unsplash и т.п.) на пустой фото-слот.
// Сохраняет загруженные пользователем фото (data:image base64).
function stripDeadImages(html: string): string {
  if (!html || !/<img|background-image\s*:\s*url\(/i.test(html)) return html;
  let i = 0;
  let out = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const m = tag.match(/src\s*=\s*["']([^"']*)["']/i);
    const src = m ? m[1] : "";
    if (src.startsWith("data:image")) return tag;       // фото пользователя — оставляем
    if (/^(https?:)?\/\//i.test(src)) { i++; return PHOTO_SLOT_PLACEHOLDER.replace("auto-fix", "auto-fix-" + i); }
    return tag;
  });
  out = out.replace(/background-image\s*:\s*url\(["']?https?:[^)]*\)\s*;?/gi, "background:#f1f5f9;");
  return out;
}

// ── Постобработка блока услуг (глобальная — используется до инициализации) ────
function fixServicesHtml(html: string): string {
  let result = html;
  // 1. Скрываем модалку если открыта по умолчанию
  result = result.replace(
    /(<div[^>]*id=["']svc-modal["'][^>]*?)style=["']([^"']*?)["']/gi,
    (_, tag, style) => {
      const cleaned = style.replace(/display\s*:\s*(flex|block|grid)[^;]*;?/gi, "").trim();
      return `${tag}style="${cleaned}"`;
    }
  );
  result = result.replace(
    /(<div[^>]*id=["']svc-modal["'][^>]*?)class=["']([^"']*?)\bactive\b([^"']*?)["']/gi,
    (_, tag, before, after) => `${tag}class="${(before + after).trim()}"`
  );
  // 2. <a class="service-link"> → кнопка Записаться
  result = result.replace(
    /<a([^>]*?)class=["']([^"']*?)service-link([^"']*?)["']([^>]*?)>([\s\S]*?)<\/a>/gi,
    (_, _a, _b, _c, _d, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim() || "Записаться";
      return `<button class="service-btn-primary" onclick="document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})">${text}</button>`;
    }
  );
  // 3. <a class="service-more"> → кнопка Подробнее
  result = result.replace(
    /<a([^>]*?)class=["']([^"']*?)service-more([^"']*?)["']([^>]*?)>([\s\S]*?)<\/a>/gi,
    (_, _a, _b, _c, _d, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim() || "Подробнее";
      return `<button class="service-btn-secondary" onclick="typeof openServiceModal==='function'&&openServiceModal(this.closest('[data-service-id]')?.dataset.serviceId||'')">${text}</button>`;
    }
  );
  // 4. <a href="#contact"> → кнопка Записаться
  result = result.replace(
    /<a([^>]*?)href=["']#contact["']([^>]*?)>([\s\S]*?)<\/a>/gi,
    (_, _a, _b, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim() || "Записаться";
      return `<button class="service-btn-primary" onclick="document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})">${text}</button>`;
    }
  );
  // 5. <a href="#subpage-..."> → кнопка Подробнее
  result = result.replace(
    /<a([^>]*?)href=["']#(?:subpage-)?([a-zA-Z0-9-]+)["']([^>]*?)>([\s\S]*?)<\/a>/gi,
    (_, _a, slug, _b, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text || text.toLowerCase().includes("записаться")) {
        return `<button class="service-btn-primary" onclick="document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})">${text || "Записаться"}</button>`;
      }
      return `<button class="service-btn-secondary" onclick="typeof openServiceModal==='function'&&openServiceModal('${slug}')">${text}</button>`;
    }
  );
  // 6. Добавляем CSS (убираем старый если есть)
  result = result.replace(/<style data-block="services-fix">[\s\S]*?<\/style>/gi, "");
  result = result.replace(/<style data-block="services-btn-fix">[\s\S]*?<\/style>/gi, "");
  result += `<style data-block="services-fix">
.service-btn-primary{width:100%;padding:12px 18px;border-radius:9px;border:none;background:var(--c-accent);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-body,inherit);transition:opacity .2s;display:block;text-align:center;box-sizing:border-box}
.service-btn-primary:hover{opacity:.85}
.service-btn-secondary{width:100%;padding:11px 18px;border-radius:9px;border:2px solid var(--c-accent);background:transparent;color:var(--c-accent);font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-body,inherit);transition:all .2s;display:block;text-align:center;box-sizing:border-box}
.service-btn-secondary:hover{background:var(--c-accent);color:#fff}
.service-actions{display:flex;flex-direction:column;gap:10px;margin-top:auto}
.svc-modal-overlay{display:none!important;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
.svc-modal-overlay.active{display:flex!important}
.svc-modal-box{background:#fff;border-radius:20px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;position:relative}
.svc-modal-close{position:absolute;top:14px;right:16px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(0,0,0,.08);cursor:pointer;font-size:16px;z-index:1}
.svc-modal-img{width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:16px 16px 0 0;background:var(--c-light,#f8f9fa)}
.svc-modal-body{padding:28px}
.svc-modal-body h3{font-size:20px;font-weight:800;color:var(--c-dark,#1a1a1a);margin-bottom:10px}
.svc-modal-price{font-size:18px;font-weight:800;color:var(--c-accent);margin-bottom:18px}
.svc-modal-cta{width:100%;padding:14px;border-radius:12px;border:none;background:var(--c-accent);color:#fff;font-size:15px;font-weight:700;cursor:pointer}
.svc-modal-hint{text-align:center;font-size:12px;color:#94a3b8;margin-top:8px}
</style>`;
  return result;
}

// ── Гарантированная замена всех ссылок на политику → /privacy ─────────────────
// Применяется к ЛЮБОМУ блоку после генерации — не зависит от ИИ
function fixPrivacyLinks(html: string): string {
  if (!html) return html;
  // Заменяем href любых ссылок, чей текст содержит "политик" или "конфиденц"
  let result = html.replace(
    /(<a\b[^>]*>)([\s\S]*?)<\/a>/gi,
    (match, openTag, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").toLowerCase();
      if (text.includes("политик") || text.includes("конфиденц") || text.includes("privacy")) {
        const fixed = openTag
          .replace(/href=["'][^"']*["']/i, 'href="/privacy"')
          .replace(/target=["'][^"']*["']/i, '');
        return `${fixed}${inner}</a>`;
      }
      return match;
    }
  );
  // Дополнительно: href ведёт на что-то с "privacy" в URL — тоже нормализуем
  result = result.replace(
    /href=["'](?!\/privacy["'])([^"']*privacy[^"']*)["']/gi,
    'href="/privacy"'
  );
  return result;
}

// ── Автофикс CTA-кнопок без цели → #contact ───────────────────────────────────
// Кнопки с href="#" или href="" или без href в секциях hero/benefits/solution/order → прокрутка к #contact
const CTA_KEYWORDS = ["записат", "заказат", "оставит", "получит", "начат", "связат", "купит", "забронир", "регистр", "подат", "узнат", "отправит", "консульт"];
function fixButtonTargets(html: string): string {
  if (!html) return html;
  // <a> с пустым или якорным href="#" и CTA-текстом
  let result = html.replace(
    /(<a\b(?![^>]*href=["'](?!["'#])[^"']+["'])[^>]*>)([\s\S]*?)<\/a>/gi,
    (match, openTag, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").toLowerCase();
      const isCta = CTA_KEYWORDS.some(k => text.includes(k));
      if (!isCta) return match;
      const fixed = openTag.replace(/href=["'][^"']*["']/i, '').replace(/<a\b/, '<a href="#contact"');
      return `${fixed}${inner}</a>`;
    }
  );
  // <button> без onclick или с пустым onclick и CTA-текстом
  result = result.replace(
    /(<button\b(?![^>]*onclick)[^>]*>)([\s\S]*?)<\/button>/gi,
    (match, openTag, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").toLowerCase();
      const isCta = CTA_KEYWORDS.some(k => text.includes(k));
      if (!isCta) return match;
      const fixed = openTag.replace(/<button\b/, '<button onclick="document.getElementById(\'contact\')?.scrollIntoView({behavior:\'smooth\'})"');
      return `${fixed}${inner}</button>`;
    }
  );
  return result;
}

// ── Главный компонент ─────────────────────────────────────────────────────────
export default function LkLandingBuilder({ forceList = false }: { forceList?: boolean }) {
  const { user } = useLkAuth();
  const [view, setView] = useState<"list" | "new" | "editor">("list");
  const [listKey, setListKey] = useState(0);
  const [landingType, setLandingType] = useState<LandingType | null>(() => {
    try { return (localStorage.getItem(LS_TYPE) as LandingType) || null; } catch { return null; }
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    try { const s = localStorage.getItem(LS_MSGS); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [phase, setPhase] = useState<"chat" | "generating" | "done">(() => {
    try { return (localStorage.getItem(LS_PHASE) as "chat" | "done") || "chat"; } catch { return "chat"; }
  });

  // Блоки и стиль
  const [blocks, setBlocks] = useState<LandingBlock[]>(() => {
    try {
      const s = localStorage.getItem(LS_BLOCKS);
      if (!s) return [];
      const parsed: LandingBlock[] = JSON.parse(s);
      return parsed.map(b => {
        const html = fixButtonTargets(fixPrivacyLinks(stripDeadImages(b.id === "services" ? fixServicesHtml(b.html) : b.html)));
        return { ...b, html };
      });
    } catch { return []; }
  });

  // История изменений для отмены (стек снимков blocks, максимум 20)
  const undoStackRef = useRef<LandingBlock[][]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const pushUndo = useCallback((snapshot: LandingBlock[]) => {
    undoStackRef.current.push(snapshot.map(b => ({ ...b })));
    if (undoStackRef.current.length > 20) undoStackRef.current.shift();
    setCanUndo(true);
  }, []);
  const undoLastEdit = useCallback(() => {
    const prev = undoStackRef.current.pop();
    if (!prev) { setCanUndo(false); return; }
    setBlocks(prev);
    setCanUndo(undoStackRef.current.length > 0);
    iframeRef.current?.contentWindow?.postMessage({ type: "landing-clear-pick" }, "*");
    setSelectedBlock(null);
  }, []);
  const [siteStyle, setSiteStyle] = useState<LandingStyle>(() => {
    try { const s = localStorage.getItem(LS_STYLE); return s ? JSON.parse(s) : DEFAULT_STYLE; } catch { return DEFAULT_STYLE; }
  });

  // Генерация
  const [genProgress, setGenProgress] = useState<{ current: string; done: string[] }>({ current: "", done: [] });

  // Проект
  const [projectId, setProjectId] = useState<string | null>(() => {
    try { return localStorage.getItem(LS_PID) || null; } catch { return null; }
  });
  const [projectTitle, setProjectTitle] = useState(() => {
    try { return localStorage.getItem(LS_TITLE) || "Без названия"; } catch { return "Без названия"; }
  });
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  // Версии
  const [versions, setVersions] = useState<Version[]>([]);
  const [showVersions, setShowVersions] = useState(false);

  // Превью и редактирование
  const [editMode, setEditMode] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [showPrivacyEditor, setShowPrivacyEditor] = useState(false);
  const [showSeoEditor, setShowSeoEditor] = useState(false);
  const [seoData, setSeoData] = useState<SeoData>(() => {
    try { const s = localStorage.getItem(LS_SEO); return s ? JSON.parse(s) : { ...SEO_DEFAULTS }; } catch { return { ...SEO_DEFAULTS }; }
  });
  const [privacyData, setPrivacyData] = useState<PrivacyData>(() => {
    try { const s = localStorage.getItem(LS_PRIVACY); return s ? JSON.parse(s) : { orgName: "", inn: "", ogrn: "", address: "", email: "", domain: "" }; } catch { return { orgName: "", inn: "", ogrn: "", address: "", email: "", domain: "" }; }
  });

  // Редактирование блока через ИИ (панель)
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [blockEditInput, setBlockEditInput] = useState("");
  const [blockEditing, setBlockEditing] = useState(false);

  // Онбординг-баннер (показываем один раз после генерации)
  const [showEditHint, setShowEditHint] = useState(false);

  // ── ПЛАВАЮЩИЙ ЧАТ ─────────────────────────────────────────────────────────
  // Выбранный элемент (кликнули прямо на лендинге) — точное выделение
  const [selectedBlock, setSelectedBlock] = useState<{
    id: string; html: string; label: string;
    kind?: string; kindLabel?: string; preview?: string; hasPhoto?: boolean;
  } | null>(null);
  const [floatChatInput, setFloatChatInput] = useState("");
  const [floatChatLoading, setFloatChatLoading] = useState(false);
  const [floatChatPhoto, setFloatChatPhoto] = useState<string | null>(null); // base64 фото из чата
  const floatPhotoInputRef = useRef<HTMLInputElement>(null);
  // Вставка видео в выделенный слот
  const [showFloatVideo, setShowFloatVideo] = useState(false);
  const [floatVideoUrl, setFloatVideoUrl] = useState("");
  const [floatVideoError, setFloatVideoError] = useState(false);
  // Установка цели кнопки (без ИИ)
  const [showFloatScroll, setShowFloatScroll] = useState(false);

  // Видео / карта
  const [videoInput, setVideoInput] = useState<Record<string, string>>({});
  const [mapInput, setMapInput] = useState("");

  // Чат по готовому сайту
  const [siteMessages, setSiteMessages] = useState<Message[]>([]);
  const [siteInput, setSiteInput] = useState("");
  const [siteChatLoading, setSiteChatLoading] = useState(false);
  const siteChatBottomRef = useRef<HTMLDivElement>(null);

  // UI
  const [showHelp, setShowHelp] = useState(false);
  const [showEmailHint, setShowEmailHint] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState<"blocks" | "images" | "chat">("blocks");

  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImgIdx, setPendingImgIdx] = useState<string | null>(null);
  const [pendingSlotId, setPendingSlotId] = useState<string | null>(null);
  const slotFileInputRef = useRef<HTMLInputElement>(null);
  const panelSlotFileInputRef = useRef<HTMLInputElement>(null);
  const [pendingPanelSlotId, setPendingPanelSlotId] = useState<string | null>(null);
  const pendingPanelSlotIdRef = useRef<string | null>(null);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);

  // Персист
  useEffect(() => { if (messages.length > 0) localStorage.setItem(LS_MSGS, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem(LS_PHASE, phase); }, [phase]);
  useEffect(() => { if (landingType) localStorage.setItem(LS_TYPE, landingType); }, [landingType]);
  useEffect(() => { localStorage.setItem(LS_BLOCKS, JSON.stringify(blocks)); }, [blocks]);
  useEffect(() => { localStorage.setItem(LS_STYLE, JSON.stringify(siteStyle)); }, [siteStyle]);
  useEffect(() => { if (projectId) localStorage.setItem(LS_PID, projectId); }, [projectId]);
  useEffect(() => { localStorage.setItem(LS_TITLE, projectTitle); }, [projectTitle]);
  useEffect(() => { localStorage.setItem(LS_PRIVACY, JSON.stringify(privacyData)); }, [privacyData]);
  useEffect(() => { localStorage.setItem(LS_SEO, JSON.stringify(seoData)); }, [seoData]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chatLoading]);

  const buildPrivBodyFromData = (pd: PrivacyData) =>
    (pd.orgName || pd.domain || pd.inn) ? buildPrivacyBody(pd) : undefined;

  // Единственная функция обновления iframe — вызываем явно, никогда не через srcDoc пропс
  const refreshIframe = useCallback((withEditor = false) => {
    if (!iframeRef.current) return;
    const html = buildFullHtml(blocks, siteStyle, buildPrivBodyFromData(privacyData), seoData);
    iframeRef.current.srcdoc = withEditor
      ? html.replace("</body>", EDITOR_SCRIPT + "</body>")
      : html;
  }, [blocks, siteStyle, privacyData, seoData]); // eslint-disable-line

  // Переключение режима редактирования
  useEffect(() => {
    if (blocks.length > 0) refreshIframe(editMode);
  }, [editMode]); // eslint-disable-line

  // Смена стилей — перерисовываем (не в editMode, иначе потеряем contenteditable)
  useEffect(() => {
    if (phase === "done" && !editMode) refreshIframe(false);
  }, [siteStyle]); // eslint-disable-line

  // Автосохранение при изменении блоков (debounce 3s) + обновление iframe
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justGeneratedRef = useRef(false); // флаг: блоки только что пришли из generateLanding — не дублируем сохранение
  useEffect(() => {
    if (blocks.length === 0 || phase !== "done") return;
    // Обновляем iframe только если НЕ в режиме редактирования — иначе iframe сам шлёт HTML
    if (!editMode) refreshIframe(false);
    // Пропускаем автосохранение сразу после генерации (saveProject уже вызван в generateLanding)
    if (justGeneratedRef.current) { justGeneratedRef.current = false; return; }
    // Дебаунс авто-сохранения
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      saveProject(blocks, siteStyle, false).catch(() => {});
    }, 3000);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [blocks]); // eslint-disable-line

  // При первом маунте — если блоки уже есть (открыт проект), рисуем iframe
  useEffect(() => {
    if (blocks.length > 0 && phase === "done") refreshIframe(editMode);
  }, []); // eslint-disable-line

  // Больше не восстанавливаем editor из localStorage автоматически —
  // пользователь выбирает лендинг из списка сам (openProject)

  const handleIframeMessage = useCallback((e: MessageEvent) => {
    if (e.data?.type === "landing-html-update") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(e.data.html, "text/html");
      setBlocks(prev => prev.map(b => {
        const wrapper = doc.querySelector(`[data-block-id="${b.id}"]`);
        if (wrapper) return { ...b, html: wrapper.innerHTML };
        return b;
      }));
    }
    if (e.data?.type === "landing-img-click") {
      setPendingImgIdx(e.data.idx);
      fileInputRef.current?.click();
    }
    if (e.data?.type === "landing-slot-click") {
      setPendingSlotId(e.data.slotId);
      setPhotoPickerOpen(true);
    }
    // Точное выделение элемента
    if (e.data?.type === "landing-pick") {
      const { blockId, blockHtml, blockLabel, kind, kindLabel, preview, hasPhoto } = e.data;
      setSelectedBlock({ id: blockId, html: blockHtml, label: blockLabel || blockId, kind, kindLabel, preview, hasPhoto });
      setFloatChatInput("");
      setFloatChatPhoto(null);
      setShowFloatVideo(false); setFloatVideoUrl(""); setFloatVideoError(false);
      setShowFloatScroll(false);
    }
    if (e.data?.type === "landing-deselect-ack") {
      setSelectedBlock(null);
      setFloatChatInput("");
      setFloatChatPhoto(null);
      setShowFloatVideo(false); setFloatVideoUrl(""); setFloatVideoError(false);
      setShowFloatScroll(false);
    }
    // Результат прямой вставки фото: если не нашли куда — снимаем выделение
    if (e.data?.type === "landing-photo-result") {
      iframeRef.current?.contentWindow?.postMessage({ type: "landing-clear-pick" }, "*");
      setSelectedBlock(null);
    }
    // Кнопка привязана к разделу — закрываем панель (НЕ перерисовываем iframe — изменения уже в blocks через landing-html-update)
    if (e.data?.type === "landing-btn-target-set") {
      setShowFloatScroll(false);
      setSelectedBlock(null);
      // Снимаем подсветку с задержкой — после того как landing-html-update уже обработан
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({ type: "landing-clear-pick" }, "*");
      }, 100);
    }
  }, []);  

  useEffect(() => {
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [handleIframeMessage]);

  // ── ЧАТИНГ ────────────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.trim();
    if (!text || chatLoading) return;
    const newMsgs: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setChatLoading(true);
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ mode: "chat", landingType, messages: newMsgs }),
        signal: AbortSignal.timeout(30_000),
      });
      if (res.status === 402) { const d = await res.json(); showEnergyGate({ message: d.error }); return; }
      if (!res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: "ИИ-сервис временно недоступен. Подождите минуту и попробуйте ещё раз." }]);
        return;
      }
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Не удалось получить ответ. Попробуйте ещё раз." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ошибка связи. Проверьте интернет и попробуйте ещё раз." }]);
    } finally {
      setChatLoading(false);
    }
  }

  // ── ЧАТ ПО ГОТОВОМУ САЙТУ ─────────────────────────────────────────────────
  async function sendSiteMessage() {
    const text = siteInput.trim();
    if (!text || siteChatLoading) return;
    const newMsgs: Message[] = [...siteMessages, { role: "user", content: text }];
    setSiteMessages(newMsgs);
    setSiteInput("");
    setSiteChatLoading(true);
    // Краткое описание блоков для контекста
    const blocksSummary = blocks.map(b => `- ${b.label}`).join("\n");
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({
          mode: "site-chat",
          landingType,
          messages,          // история создания (контекст о бизнесе)
          siteMessages: newMsgs,
          blocksSummary,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (res.status === 402) { const d = await res.json(); showEnergyGate({ message: d.error }); return; }
      if (!res.ok) {
        setSiteMessages(prev => [...prev, { role: "assistant", content: "ИИ-сервис временно недоступен. Попробуйте ещё раз." }]);
        return;
      }
      const data = await res.json();
      setSiteMessages(prev => [...prev, { role: "assistant", content: data.reply || "Не удалось получить ответ." }]);
    } catch {
      setSiteMessages(prev => [...prev, { role: "assistant", content: "Ошибка связи. Проверьте интернет." }]);
    } finally {
      setSiteChatLoading(false);
    }
  }

  useEffect(() => { siteChatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [siteMessages, siteChatLoading]);

  // ── ПЛАВАЮЩИЙ ЧАТ: отправка команды по выбранному элементу ────────────────
  async function sendFloatChat() {
    const text = floatChatInput.trim();
    if ((!text && !floatChatPhoto) || floatChatLoading || !selectedBlock) return;

    // Если прикреплено фото и НЕТ текстовой команды — вставляем напрямую в выделенный элемент
    // (мгновенно, без ИИ и без списания энергии)
    if (floatChatPhoto && !text) {
      pushUndo(blocks);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "landing-photo-into-picked", src: floatChatPhoto }, "*"
      );
      setFloatChatInput("");
      setFloatChatPhoto(null);
      return;
    }

    setFloatChatLoading(true);
    const taskText = text || "Вставь это фото в выделенное место";
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({
          mode: "edit-block",
          blockId: selectedBlock.id,
          blockHtml: selectedBlock.html,
          editTask: taskText,
          targetKind: selectedBlock.kind,        // тип выделенного: photo/heading/text/button...
          targetPreview: selectedBlock.preview,  // текст/описание выделенного элемента
          photoBase64: floatChatPhoto || undefined,
          style: siteStyle,
          businessContext: messages.slice(-6).map(m => m.content).join("\n"),
        }),
        signal: AbortSignal.timeout(60_000),
      });
      const data = await res.json();
      if (res.status === 402) { showEnergyGate({ message: data.error }); return; }
      if (data.html !== undefined) {
        pushUndo(blocks);
        if (data.html.includes("<!-- REMOVE_BLOCK -->") || data.html.trim() === "") {
          setBlocks(prev => prev.filter(b => b.id !== selectedBlock.id));
        } else {
          const cleaned = stripTargetMarker(data.html);
          const finalHtml = fixButtonTargets(fixPrivacyLinks(selectedBlock.id === "services" ? fixServicesHtml(cleaned) : cleaned));
          setBlocks(prev => prev.map(b => b.id === selectedBlock.id ? { ...b, html: finalHtml } : b));
        }
        setFloatChatInput("");
        setFloatChatPhoto(null);
        iframeRef.current?.contentWindow?.postMessage({ type: "landing-clear-pick" }, "*");
        setSelectedBlock(null);
      } else if (data.clarify) {
        setFloatChatInput(data.clarify + "\n\nМой ответ: ");
      }
    } catch {
      // ignore
    } finally {
      setFloatChatLoading(false);
    }
  }

  function handleFloatChatPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Сжимаем до 800px
    const reader = new FileReader();
    reader.onload = ev => {
      const raw = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setFloatChatPhoto(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // ── ФОТО-СЛОТЫ: добавить / удалить ────────────────────────────────────────
  function addPhotoSlot(blockId: string) {
    setBlocks(prev => prev.map(block => {
      if (block.id !== blockId) return block;
      const parser = new DOMParser();
      const doc = parser.parseFromString(block.html, "text/html");
      // Находим последний photo-slot в блоке
      const slots = doc.querySelectorAll("[data-photo-slot]");
      const idx = slots.length + 1;
      const slotId = `${blockId}-extra-${idx}`;
      const newSlot = doc.createElement("div");
      newSlot.setAttribute("data-photo-slot", slotId);
      newSlot.style.cssText = "aspect-ratio:4/3;border-radius:14px;overflow:hidden;background:#e9eef2;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px dashed #cbd5e1;margin-top:14px;";
      newSlot.innerHTML = `<div class="photo-placeholder" style="text-align:center;color:#94a3b8;font-size:13px;padding:16px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:block;margin:0 auto 8px;opacity:.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Фото ${idx}</span></div>`;
      // Вставляем после последнего слота или в конец блока
      if (slots.length > 0) {
        slots[slots.length - 1].after(newSlot);
      } else {
        doc.body.firstElementChild?.appendChild(newSlot);
      }
      return { ...block, html: doc.body.innerHTML };
    }));
  }

  function removeLastPhotoSlot(blockId: string) {
    setBlocks(prev => prev.map(block => {
      if (block.id !== blockId) return block;
      const parser = new DOMParser();
      const doc = parser.parseFromString(block.html, "text/html");
      const slots = doc.querySelectorAll("[data-photo-slot]");
      if (slots.length <= 1) return block; // минимум 1 оставляем
      slots[slots.length - 1].remove();
      return { ...block, html: doc.body.innerHTML };
    }));
  }

  // ── ВСТАВКА ВИДЕО ─────────────────────────────────────────────────────────
  function insertVideo(blockId: string, url: string) {
    if (!url.trim()) return;
    const embedHtml = buildVideoEmbed(url);
    if (!embedHtml) return;

    setBlocks(prev => prev.map(block => {
      if (block.id !== blockId) return block;
      const parser = new DOMParser();
      const doc = parser.parseFromString(block.html, "text/html");
      // Вставляем видео перед первым photo-slot или в начало блока
      const slot = doc.querySelector("[data-photo-slot]");
      const videoEl = doc.createElement("div");
      videoEl.setAttribute("data-video-embed", "true");
      videoEl.style.margin = "20px 0";
      videoEl.innerHTML = embedHtml;
      if (slot) {
        slot.before(videoEl);
      } else {
        doc.body.firstElementChild?.prepend(videoEl);
      }
      return { ...block, html: doc.body.innerHTML };
    }));
    setVideoInput(prev => ({ ...prev, [blockId]: "" }));
  }

  // Вставка видео в выделенный фото-слот (фото ИЛИ видео в одно место)
  function insertVideoIntoPicked(url: string) {
    const embed = buildVideoEmbed(url);
    if (!embed || !selectedBlock) {
      setFloatVideoError(true);
      return;
    }
    pushUndo(blocks);
    iframeRef.current?.contentWindow?.postMessage({ type: "landing-video-into-picked", embed }, "*");
    setFloatVideoUrl("");
    setShowFloatVideo(false);
  }

  // ── ЯНДЕКС-КАРТА ─────────────────────────────────────────────────────────
  function insertYandexMap(address: string) {
    if (!address.trim()) return;
    const encoded = encodeURIComponent(address);
    const mapHtml = `<div data-ymap-block="true" style="margin-top:32px;border-radius:16px;overflow:hidden;height:280px;"><iframe src="https://yandex.ru/map-widget/v1/?text=${encoded}&z=16" style="width:100%;height:100%;border:none;" allowfullscreen></iframe></div>`;

    setBlocks(prev => prev.map(block => {
      if (block.id !== "contact") return block;
      const parser = new DOMParser();
      const doc = parser.parseFromString(block.html, "text/html");
      // Удаляем старую карту если есть
      doc.querySelector("[data-ymap-block]")?.remove();
      // Вставляем перед закрывающим тегом секции
      const section = doc.querySelector("section#contact, section");
      const mapEl = doc.createElement("div");
      mapEl.innerHTML = mapHtml;
      section?.appendChild(mapEl.firstElementChild!);
      return { ...block, html: doc.body.innerHTML };
    }));
    setMapInput("");
  }

  function removeYandexMap() {
    setBlocks(prev => prev.map(block => {
      if (block.id !== "contact") return block;
      const parser = new DOMParser();
      const doc = parser.parseFromString(block.html, "text/html");
      doc.querySelector("[data-ymap-block]")?.remove();
      return { ...block, html: doc.body.innerHTML };
    }));
  }

  // ── БЛОЧНАЯ ГЕНЕРАЦИЯ ─────────────────────────────────────────────────────
  async function generateLanding() {
    setPhase("generating");
    setGenProgress({ current: "", done: [] });
    setBlocks([]);

    // Шаг 1: получить стиль
    setGenProgress({ current: "style", done: [] });
    let style = DEFAULT_STYLE;
    let aiSuggestedBlocks: string[] | null = null;
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ mode: "gen-style", landingType, messages }),
        signal: AbortSignal.timeout(30_000),
      });
      const data = await res.json();
      if (res.status === 402) {
        setPhase("chat");
        showEnergyGate({ message: data.error });
        return;
      }
      if (data.style) {
        style = { ...DEFAULT_STYLE, ...data.style };
        setSiteStyle(style);
        setSeoData(prev => ({
          ...prev,
          ...(data.style.faviconSvg ? { faviconSvg: data.style.faviconSvg } : {}),
          ...(data.style.seoTitle && !prev.title ? { title: data.style.seoTitle } : {}),
          ...(data.style.seoDescription && !prev.description ? { description: data.style.seoDescription } : {}),
        }));
      }
      if (data.blocks && Array.isArray(data.blocks)) {
        aiSuggestedBlocks = data.blocks;
      }
    } catch {
      // Продолжаем с дефолтным стилем
    }

    // Шаг 2: генерировать блоки по очереди
    const blocksToGen = aiSuggestedBlocks
      ?? (landingType ? TEMPLATE_BLOCKS[landingType] ?? TEMPLATE_BLOCKS["classic"] : TEMPLATE_BLOCKS["classic"]);

    const generatedBlocks: LandingBlock[] = [];
    const done: string[] = [];

    for (const blockId of blocksToGen) {
      setGenProgress({ current: blockId, done: [...done] });
      try {
        const res = await fetch(AI_LANDING_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Session-Id": session() },
          body: JSON.stringify({ mode: "gen-block", blockId, style, landingType, messages, ...(blockId === "footer" ? { privacyData } : {}) }),
          signal: AbortSignal.timeout(60_000),
        });
        const data = await res.json();
        if (res.status === 402) {
          showEnergyGate({ message: data.error });
          break;
        }
        if (data.html) {
          const label = BLOCKS_ORDER.find(b => b.id === blockId)?.label || blockId;
          const blockHtml = fixButtonTargets(fixPrivacyLinks(blockId === "services" ? fixServicesHtml(data.html) : data.html));
          const newBlock: LandingBlock = { id: blockId, label, html: blockHtml };
          generatedBlocks.push(newBlock);
          setBlocks([...generatedBlocks]);
        }
      } catch {
        // Блок не сгенерировался — пропускаем
      }
      done.push(blockId);
    }

    setGenProgress({ current: "", done });

    if (generatedBlocks.length > 0) {
      justGeneratedRef.current = true; // не дублировать через useEffect
      setPhase("done");
      setShowEditHint(true); // показываем онбординг после первой генерации
      // Авто-создаём проект если нет
      await saveProject(generatedBlocks, style, false);
    } else {
      setPhase("chat");
      setMessages(prev => [...prev, { role: "assistant", content: "Не удалось сгенерировать — попробуйте ещё раз." }]);
    }
  }

  // ── РЕДАКТИРОВАНИЕ БЛОКА ──────────────────────────────────────────────────
  async function editBlock(blockId: string) {
    if (!blockEditInput.trim() || blockEditing) return;
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    setBlockEditing(true);
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({
          mode: "edit-block", blockId, blockHtml: block.html,
          editTask: blockEditInput, style: siteStyle,
        }),
        signal: AbortSignal.timeout(60_000),
      });
      const data = await res.json();
      if (res.status === 402) { showEnergyGate({ message: data.error }); return; }
      if (data.html) {
        const fixedHtml = fixButtonTargets(fixPrivacyLinks(blockId === "services" ? fixServicesHtml(data.html) : data.html));
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, html: fixedHtml } : b));
        setEditingBlock(null);
        setBlockEditInput("");
      }
    } catch {
      // ignore
    } finally {
      setBlockEditing(false);
    }
  }

  // ── СОХРАНЕНИЕ ПРОЕКТА ────────────────────────────────────────────────────
  async function saveProject(blocksData: LandingBlock[], styleData: LandingStyle, manual = true) {
    if (manual) setSaving(true);
    try {
      const html = buildFullHtml(blocksData, styleData, buildPrivBodyFromData(privacyData), seoData);
      const title = extractTitle(html) || projectTitle;
      const res = await fetch(LANDING_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({
          id: projectId || undefined, title, landingType,
          html, blocks: blocksData, style: styleData, messages,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setProjectId(data.id);
        setProjectTitle(title);
        localStorage.setItem(LS_PID, data.id);
      }
      if (manual) { setSavedOk(true); setTimeout(() => setSavedOk(false), 2500); }
    } finally {
      if (manual) setSaving(false);
    }
  }

  // ── СОХРАНИТЬ ВЕРСИЮ ──────────────────────────────────────────────────────
  async function saveVersion() {
    // Сначала сохраняем текущее состояние в БД, потом фиксируем версию
    setSaving(true);
    try {
      const html = buildFullHtml(blocks, siteStyle, buildPrivBodyFromData(privacyData), seoData);
      const title = extractTitle(html) || projectTitle;
      const saveRes = await fetch(LANDING_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({
          id: projectId || undefined, title, landingType,
          html, blocks, style: siteStyle, messages,
        }),
      });
      const saveData = await saveRes.json();
      const pid = saveData.id || projectId;
      if (saveData.id) {
        setProjectId(saveData.id);
        setProjectTitle(title);
        localStorage.setItem(LS_PID, saveData.id);
      }
      if (!pid) return;
      // Теперь создаём снимок версии
      const verRes = await fetch(LANDING_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ action: "save-version", id: pid }),
      });
      const verData = await verRes.json();
      if (verData.saved) {
        setSavedOk(true); setTimeout(() => setSavedOk(false), 2500);
        loadVersions();
      }
    } finally {
      setSaving(false);
    }
  }

  async function loadVersions() {
    if (!projectId) return;
    const res = await fetch(`${LANDING_API_URL}?id=${projectId}`, { headers: { "X-Session-Id": session() } });
    const data = await res.json();
    setVersions(data.project?.versions || []);
  }

  async function restoreVersion(idx: number) {
    if (!projectId) return;
    const res = await fetch(LANDING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": session() },
      body: JSON.stringify({ action: "restore-version", id: projectId, versionIdx: idx }),
    });
    const data = await res.json();
    if (data.restored) {
      if (data.blocks?.length > 0) setBlocks(data.blocks);
      if (data.style) setSiteStyle(data.style);
      setShowVersions(false);
    }
  }

  // ── ОТКРЫТЬ ПРОЕКТ ────────────────────────────────────────────────────────
  function openProject(p: LandingProject) {
    fetch(`${LANDING_API_URL}?id=${p.id}`, { headers: { "X-Session-Id": session() } })
      .then(r => r.json())
      .then(data => {
        const proj = data.project;
        setProjectId(proj.id);
        setProjectTitle(proj.title);
        setLandingType(proj.landing_type);
        setMessages(proj.messages || []);
        const rawBlocks: LandingBlock[] = proj.blocks || [];
        const savedBlocks = rawBlocks.map(b => ({
          ...b,
          html: fixButtonTargets(fixPrivacyLinks(stripDeadImages(b.id === "services" ? fixServicesHtml(b.html) : b.html))),
        }));
        const savedStyle: LandingStyle = proj.style && proj.style.primary ? proj.style : DEFAULT_STYLE;
        setBlocks(savedBlocks);
        setSiteStyle(savedStyle);
        setVersions(proj.versions || []);
        const hasBlocks = savedBlocks.length > 0;
        setPhase(hasBlocks ? "done" : "chat");
        localStorage.setItem(LS_TYPE, proj.landing_type);
        localStorage.setItem(LS_PHASE, hasBlocks ? "done" : "chat");
        localStorage.setItem(LS_PID, proj.id);
        localStorage.setItem(LS_TITLE, proj.title);
        localStorage.setItem(LS_BLOCKS, JSON.stringify(savedBlocks));
        localStorage.setItem(LS_STYLE, JSON.stringify(savedStyle));
        setView("editor");
      });
  }

  function startNew() {
    [LS_MSGS, LS_PHASE, LS_TYPE, LS_PID, LS_TITLE, LS_BLOCKS, LS_STYLE].forEach(k => localStorage.removeItem(k));
    setLandingType(null); setMessages([]); setInput(""); setPhase("chat");
    setBlocks([]); setSiteStyle(DEFAULT_STYLE); setProjectId(null); setProjectTitle("Без названия");
    setEditMode(false); setView("new");
  }

  function selectType(type: LandingType) {
    setLandingType(type);
    const tpl = TEMPLATES.find(t => t.id === type);
    const welcome: Message = {
      role: "assistant",
      content: `Создаём лендинг «${tpl?.title || type}» ✨\n\nРасскажите о вашем бизнесе: как называется и чем занимаетесь?`,
    };
    setMessages([welcome]);
    setView("editor");
  }

  function extractTitle(html: string): string {
    const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (m) return m[1].trim().slice(0, 80);
    const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1) return h1[1].replace(/<[^>]+>/g, "").trim().slice(0, 80);
    return "";
  }

  function buildPrivacyBody(pd: PrivacyData): string {
    const domain = pd.domain || "example.com";
    const orgName = pd.orgName || "Организация";
    const inn = pd.inn ? `ИНН: ${pd.inn}` : "";
    const ogrn = pd.ogrn ? `, ОГРН: ${pd.ogrn}` : "";
    const address = pd.address || "";
    const email = pd.email || "";
    const year = new Date().getFullYear();
    return `<style>
#page-privacy *{box-sizing:border-box;}
#page-privacy{font-family:Arial,sans-serif;color:#2c3e50;background:#f8f9fa;line-height:1.7;min-height:100vh;}
#page-privacy .priv-wrap{max-width:800px;margin:0 auto;padding:40px 24px;}
#page-privacy h1{font-size:28px;font-weight:700;margin-bottom:8px;color:#1a1a2e;}
#page-privacy .meta{font-size:13px;color:#888;margin-bottom:40px;}
#page-privacy h2{font-size:18px;font-weight:700;margin:32px 0 12px;color:#1a1a2e;}
#page-privacy p,#page-privacy li{font-size:15px;color:#444;margin-bottom:10px;}
#page-privacy ul{padding-left:20px;margin-bottom:10px;}
#page-privacy .back{display:inline-block;margin-bottom:32px;color:#0ea5e9;text-decoration:none;font-size:14px;font-weight:600;}
#page-privacy .back:hover{text-decoration:underline;}
#page-privacy footer{margin-top:48px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:13px;color:#aaa;text-align:center;}
</style>
<div class="priv-wrap">
  <a class="back" href="#" onclick="history.back();return false;">← Вернуться на сайт</a>
  <a class="back" href="/">← Вернуться на сайт</a>
  <h1>Политика конфиденциальности</h1>
  <p class="meta">Сайт: ${domain} &nbsp;|&nbsp; Последнее обновление: ${year} г.</p>

  <h2>1. Общие положения</h2>
  <p>Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта <strong>${domain}</strong>.</p>
  <p>Оператор персональных данных: <strong>${orgName}</strong>${inn ? ` (${inn}${ogrn})` : ""}${address ? `. Адрес: ${address}` : ""}.</p>
  <p>Используя сайт, вы соглашаетесь с условиями настоящей Политики.</p>

  <h2>2. Какие данные мы собираем</h2>
  <ul>
    <li>Имя и контактный телефон (при заполнении формы заявки)</li>
    <li>Email-адрес (при его указании)</li>
    <li>Данные о выбранной услуге и комментарии</li>
    <li>Технические данные: IP-адрес, тип браузера, время визита (в рамках аналитики)</li>
  </ul>

  <h2>3. Цели обработки данных</h2>
  <ul>
    <li>Обработка и ответ на входящие заявки и вопросы</li>
    <li>Запись на услуги и консультации</li>
    <li>Улучшение работы сайта и качества обслуживания</li>
  </ul>

  <h2>4. Хранение и защита данных</h2>
  <p>Персональные данные хранятся на защищённых серверах и не передаются третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством РФ.</p>
  <p>Срок хранения данных — не более 3 лет с момента последнего обращения или до момента отзыва согласия.</p>

  <h2>5. Права пользователя</h2>
  <p>Вы вправе в любой момент:</p>
  <ul>
    <li>Запросить информацию об обрабатываемых данных</li>
    <li>Потребовать исправления или удаления своих данных</li>
    <li>Отозвать согласие на обработку персональных данных</li>
  </ul>
  <p>Для этого направьте запрос${email ? ` на email: <strong>${email}</strong>` : " через контактную форму на сайте"}.</p>

  <h2>6. Cookies</h2>
  <p>Сайт использует файлы cookie для корректной работы и аналитики. Продолжая использование сайта, вы соглашаетесь с их применением. Вы можете отключить cookie в настройках браузера.</p>

  <h2>7. Изменения Политики</h2>
  <p>Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия всегда доступна на странице <strong>${domain}/privacy</strong>.</p>

  <h2>8. Контакты</h2>
  <p>${orgName}${address ? `<br>${address}` : ""}${email ? `<br>Email: ${email}` : ""}</p>

  <footer>© ${year} ${orgName}. Все права защищены.</footer>
</div>`;
  }

  async function downloadHtml() {
    const res = await fetch(LANDING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": session() },
      body: JSON.stringify({ action: "download" }),
    });
    if (res.status === 402) { const d = await res.json(); showEnergyGate({ message: d.error }); return; }
    if (!res.ok) return;
    const d = await res.json();
    if (!d.notification_email) {
      setShowEmailHint(true);
      setTimeout(() => setShowEmailHint(false), 8000);
    }
    const privBody = (privacyData.orgName || privacyData.domain) ? buildPrivacyBody(privacyData) : undefined;
    const html = buildFullHtml(blocks, siteStyle, privBody, seoData, d.user_id);
    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${projectTitle || "landing"}.html`; a.click();
    URL.revokeObjectURL(a.href);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || pendingImgIdx === null) return;
    const reader = new FileReader();
    reader.onload = ev => {
      iframeRef.current?.contentWindow?.postMessage({ type: "landing-img-replace", idx: pendingImgIdx, src: ev.target?.result }, "*");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setPendingImgIdx(null);
  }

  function handleSlotFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const slotId = pendingSlotId;
    if (!slotId) return;
    const reader = new FileReader();
    reader.onload = ev => {
      iframeRef.current?.contentWindow?.postMessage({ type: "landing-slot-replace", slotId, src: ev.target?.result }, "*");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setPendingSlotId(null);
  }

  function handlePanelSlotFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const slotId = pendingPanelSlotIdRef.current || pendingPanelSlotId;
    if (!slotId) return;
    pendingPanelSlotIdRef.current = null;
    e.target.value = "";
    setPendingPanelSlotId(null);

    // Сжимаем картинку до max 1200px чтобы не крашить мобильный браузер
    const reader = new FileReader();
    reader.onload = ev => {
      const raw = ev.target?.result as string;
      if (!raw) return;
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const src = canvas.toDataURL("image/jpeg", 0.82);
        setBlocks(prev => prev.map(block => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(block.html, "text/html");
          // ищем слот по атрибуту data-photo-slot или по классу .photo-slot с нужным id
          const slot: Element | null =
            doc.querySelector(`[data-photo-slot="${slotId}"]`) ||
            doc.querySelector(`.photo-slot[id="${slotId}"]`) ||
            doc.querySelector(`.photo-slot`); // fallback — первый доступный слот в блоке
          if (!slot) return block;
          slot.setAttribute("data-photo-slot", slotId); // нормализуем атрибут
          slot.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit;" />`;
          slot.classList.add("has-photo");
          (slot as HTMLElement).style.cssText += ";border:none;outline:none;overflow:hidden;";
          return { ...block, html: doc.body.innerHTML };
        }));
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  }

  function openPanelSlotPicker(slotId: string) {
    pendingPanelSlotIdRef.current = slotId;
    setPendingPanelSlotId(slotId);
    panelSlotFileInputRef.current?.click();
  }

  const isReadyToGenerate = messages.length >= 4 && phase === "chat";
  const fullHtml = blocks.length > 0 ? buildFullHtml(blocks, siteStyle, buildPrivBodyFromData(privacyData), seoData) : "";

  // ── RENDER LIST ───────────────────────────────────────────────────────────
  if (view === "list") return <ProjectsList key={listKey} onOpen={openProject} onNew={startNew} />;
  if (view === "new") return (
    <>
      {showHelp && <LandingHelp onClose={() => setShowHelp(false)} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => { setView("list"); setListKey(k => k + 1); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="ArrowLeft" size={14} /> Назад
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", flex: 1 }}>Новый лендинг</div>
          <button onClick={() => setShowHelp(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 600, color: "#8b5cf6" }}>
            <Icon name="BookOpen" size={14} style={{ color: "#8b5cf6" }} />Справка
          </button>
        </div>
        <TypeSelector onSelect={selectType} />
      </div>
    </>
  );

  // ── RENDER EDITOR ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ── Модалка Базы знаний ── */}
      {showHelp && (
        <div onClick={() => setShowHelp(false)} style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "clamp(12px,4vw,40px)", overflowY: "auto",
          animation: "lndGuideFade 0.2s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 760,
            boxShadow: "0 32px 80px rgba(0,0,0,0.35)", position: "relative",
            animation: "lndGuidePop 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <button onClick={() => setShowHelp(false)} title="Закрыть" style={{
              position: "absolute", top: 16, right: 16, zIndex: 2,
              width: 34, height: 34, borderRadius: 10, border: "none",
              background: "#F1F5F9", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="X" size={17} style={{ color: "#64748B" }} />
            </button>
            <div style={{ padding: "clamp(20px,4vw,30px)" }}>
              <LkLandingGuide onClose={() => setShowHelp(false)} />
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes lndGuideFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lndGuidePop { from { opacity: 0; transform: translateY(16px) scale(0.98) } to { opacity: 1; transform: none } }
        @media (max-width: 600px) { .lnd-help-text { display: none } }
      `}</style>
      {/* Шапка */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => { setView("list"); setListKey(k => k + 1); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
          <Icon name="ArrowLeft" size={14} /> Мои лендинги
        </button>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{projectTitle}</div>

        <button onClick={() => setShowHelp(true)} title="База знаний — как создать лендинг, видео, карты, SEO" style={{
          display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px",
          borderRadius: 8, border: "1px solid #ede9fe", background: "#f5f3ff",
          cursor: "pointer", flexShrink: 0, fontFamily: "Montserrat,sans-serif",
          fontSize: 12.5, fontWeight: 700, color: "#7c3aed", transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "#fff"; (e.currentTarget.querySelector("svg") as SVGElement)?.style.setProperty("color", "#fff"); }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.color = "#7c3aed"; (e.currentTarget.querySelector("svg") as SVGElement)?.style.setProperty("color", "#7c3aed"); }}>
          <Icon name="BookOpen" size={15} style={{ color: "#7c3aed" }} />
          <span className="lnd-help-text">База знаний</span>
        </button>
        {phase === "done" && (
          <>
            <button onClick={() => saveProject(blocks, siteStyle, true)} disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #E2E8F0", background: savedOk ? "#f0fdf4" : "#fff", color: savedOk ? "#059669" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
              <Icon name={savedOk ? "CheckCircle" : saving ? "Loader" : "Save"} size={14} />
              {savedOk ? "Сохранено" : saving ? "..." : "Сохранить"}
            </button>
          </>
        )}
      </div>

      {/* Спиннер блочной генерации */}
      {phase === "generating" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 28 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
            {genProgress.current === "style" ? "Подбираю дизайн и цвета..." : `Генерирую блок: ${BLOCKS_ORDER.find(b => b.id === genProgress.current)?.label || genProgress.current}`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Шаг 0: стиль */}
            {(() => {
              const styleStep = { id: "style", label: "Дизайн и цвета" };
              const tplBlocks = landingType ? TEMPLATE_BLOCKS[landingType] ?? TEMPLATE_BLOCKS["classic"] : TEMPLATE_BLOCKS["classic"];
              const allSteps = [styleStep, ...BLOCKS_ORDER.filter(b => tplBlocks.includes(b.id))];
              return allSteps.map(step => {
                const isDone = genProgress.done.includes(step.id) || (step.id === "style" && genProgress.current !== "style" && genProgress.current !== "");
                const isActive = genProgress.current === step.id;
                const blockHtml = blocks.find(b => b.id === step.id)?.html;
                const hasContent = blockHtml && blockHtml !== "<!-- regenerating -->";
                return (
                  <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: (isDone || hasContent) ? "#d1fae5" : isActive ? ACCENT_LIGHT : "#F1F5F9",
                      border: `2px solid ${(isDone || hasContent) ? "#34d399" : isActive ? ACCENT : "#E2E8F0"}` }}>
                      {(isDone || hasContent)
                        ? <Icon name="Check" size={11} style={{ color: "#059669" }} />
                        : isActive
                          ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, animation: "pulse 1s infinite" }} />
                          : null}
                    </div>
                    <span style={{ fontSize: 13, color: (isDone || hasContent) ? "#059669" : isActive ? "#0F172A" : "#94A3B8", fontWeight: isActive ? 600 : 400 }}>{step.label}</span>
                    {isActive && <div style={{ width: 14, height: 14, border: `2px solid ${ACCENT_LIGHT}`, borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />}
                  </div>
                );
              });
            })()}
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
        </div>
      )}

      {/* Баннер: данные есть — предлагаем восстановить */}
      {phase === "chat" && messages.length >= 4 && blocks.length === 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "#fff7ed", border: "1.5px solid #fb923c" }}>
          <Icon name="AlertTriangle" size={16} style={{ color: "#ea580c", flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 13, color: "#9a3412" }}>Данные о бизнесе сохранены. Нажмите «Создать» ниже — сайт будет восстановлен.</div>
        </div>
      )}

      {/* Чат */}
      {phase === "chat" && (
        <>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", maxHeight: 380, overflowY: "auto" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 14, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                  {m.role === "assistant" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="Sparkles" size={11} style={{ color: "#fff" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>ИИ-ассистент</span>
                    </div>
                  )}
                  <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? ACCENT : "#F8FAFC", color: m.role === "user" ? "#fff" : "#1a1a1a", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap", border: m.role === "assistant" ? "1px solid #E8ECF0" : "none" }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="Sparkles" size={11} style={{ color: "#fff" }} />
                  </div>
                  <div style={{ display: "flex", gap: 4, padding: "8px 12px", background: "#F8FAFC", borderRadius: "14px 14px 14px 4px", border: "1px solid #E8ECF0" }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, opacity: 0.5, animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div style={{ borderTop: "1px solid #E8ECF0", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Расскажите о бизнесе..."
                rows={2}
                style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8ECF0", fontSize: 13, fontFamily: "Montserrat,sans-serif", outline: "none", resize: "none", lineHeight: 1.5, color: "#1a1a1a" }}
              />
              <button onClick={sendMessage} disabled={!input.trim() || chatLoading}
                style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: input.trim() && !chatLoading ? ACCENT : "#E8ECF0", color: input.trim() && !chatLoading ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !chatLoading ? "pointer" : "default", flexShrink: 0 }}>
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>

          {isReadyToGenerate && (() => {
            const blockCount = (landingType && TEMPLATE_BLOCKS[landingType]?.length) || 6;
            const estimate = 70 + blockCount * 90; // стиль + блоки
            const estLow = Math.round(estimate * 0.9 / 10) * 10;
            const estHigh = Math.round(estimate * 1.05 / 10) * 10;
            return (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", marginBottom: 12, background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 12 }}>
                  <Icon name="Zap" size={18} style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 12.5, color: "#0f766e", fontFamily: "Montserrat,sans-serif", lineHeight: 1.5 }}>
                    <b>Создание лендинга — примерно {estLow}–{estHigh} ⚡</b> (дизайн + {blockCount} блоков).
                    <span style={{ color: "#5e7d79" }}> Чат и советы — бесплатно. Правки оплачиваются отдельно по сложности: мелкая правка ~24 ⚡, пересоздать блок ~45 ⚡.</span>
                  </div>
                </div>
                <button onClick={generateLanding}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "15px 24px", borderRadius: 14, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(185,85%,26%) 100%)`, color: "#fff", boxShadow: `0 4px 16px ${ACCENT}44` }}>
                  <Icon name="Sparkles" size={18} />
                  Создать лендинг по блокам
                </button>
              </>
            );
          })()}
        </>
      )}

      {/* Готовый сайт: блоки + превью */}
      {phase === "done" && (
        <>
          {/* Онбординг-баннер после генерации */}
          {/* Напоминалка заполнить данные ИП если пустые */}
          {phase === "done" && blocks.length > 0 && !editMode && !privacyData.orgName && !privacyData.inn && !showPrivacyEditor && (
            <div style={{ background: "linear-gradient(135deg,#fffbeb,#fef3c7)", borderRadius: 14, border: "1.5px solid #fbbf24", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="ShieldAlert" size={17} style={{ color: "#fff" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#92400e", marginBottom: 2, fontFamily: "Montserrat,sans-serif" }}>
                  Заполните данные ИП/организации
                </div>
                <div style={{ fontSize: 11.5, color: "#78350f", lineHeight: 1.55, fontFamily: "Montserrat,sans-serif" }}>
                  ИНН и ОГРН/ОГРНИП обязательны по закону — они появятся в футере и политике конфиденциальности.
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPrivacyEditor(true);
                  setPrivacyData(prev => {
                    const hasAny = prev.orgName || prev.email || prev.address || prev.domain;
                    if (hasAny) return prev;
                    const draft = user?.id ? loadDraft(user.id) : null;
                    const salon = draft?.form;
                    return {
                      orgName: salon?.name || user?.salon?.name || "",
                      inn: prev.inn || "",
                      ogrn: prev.ogrn || "",
                      address: salon ? [salon.city, salon.address].filter(Boolean).join(", ") : "",
                      email: user?.email || "",
                      domain: salon?.website_url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "",
                    };
                  });
                }}
                style={{ padding: "7px 14px", borderRadius: 9, border: "none", background: "#f59e0b", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}
              >
                Заполнить →
              </button>
            </div>
          )}

          {showEditHint && !editMode && (
            <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 14, position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="MousePointerClick" size={22} style={{ color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6, fontFamily: "Montserrat,sans-serif" }}>
                  Как редактировать лендинг
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", lineHeight: 1.6, fontFamily: "Montserrat,sans-serif" }}>
                  Нажмите <b style={{ color: "#fff" }}>«✏️ Редактировать»</b> ниже → кликните на любой блок прямо на лендинге → напишите ИИ что изменить.
                  Можно выделить текст мышью — он попадёт в чат автоматически.
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {["Переделай заголовок", "Убери этот блок", "Добавь фото", "Сделай красивее"].map(tip => (
                    <span key={tip} style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11, fontWeight: 600, fontFamily: "Montserrat,sans-serif" }}>{tip}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowEditHint(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="X" size={14} style={{ color: "#fff" }} />
              </button>
            </div>
          )}

          {/* Панель инструментов */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => { setEditMode(v => !v); if (!editMode) setShowEditHint(false); }}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 9, border: "none", background: editMode ? "#ef4444" : "#6366f1", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: editMode ? "none" : "0 2px 12px rgba(99,102,241,0.35)" }}>
              <Icon name={editMode ? "PenOff" : "MousePointerClick"} size={15} />
              {editMode ? "Выйти из редактора" : "✏️ Редактировать"}
            </button>
            {editMode && (
              <button onClick={undoLastEdit} disabled={!canUndo} title="Отменить последнее изменение ИИ"
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: canUndo ? "1.5px solid #f59e0b" : "1.5px solid #E8ECF0", background: canUndo ? "#fffbeb" : "#fff", color: canUndo ? "#d97706" : "#cbd5e1", fontSize: 13, fontWeight: 600, cursor: canUndo ? "pointer" : "default", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name="Undo2" size={15} />Отменить
              </button>
            )}
            <button onClick={() => setShowStyleEditor(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: showStyleEditor ? `1.5px solid ${PURPLE}` : "1.5px solid #E8ECF0", background: showStyleEditor ? PURPLE_LIGHT : "#fff", color: showStyleEditor ? PURPLE : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Palette" size={15} />Стиль
            </button>
            <button onClick={() => {
                setShowPrivacyEditor(v => {
                  if (!v) {
                    // Автозаполнение из профиля салона если поля пустые
                    setPrivacyData(prev => {
                      const hasAny = prev.orgName || prev.email || prev.address || prev.domain;
                      if (hasAny) return prev;
                      const draft = user?.id ? loadDraft(user.id) : null;
                      const salon = draft?.form;
                      return {
                        orgName: salon?.name || user?.salon?.name || "",
                        inn: prev.inn || "",
                        ogrn: prev.ogrn || "",
                        address: salon ? [salon.city, salon.address].filter(Boolean).join(", ") : "",
                        email: user?.email || "",
                        domain: salon?.website_url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "",
                      };
                    });
                  }
                  return !v;
                });
              }}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: showPrivacyEditor ? "1.5px solid #10b981" : "1.5px solid #E8ECF0", background: showPrivacyEditor ? "#ecfdf5" : "#fff", color: showPrivacyEditor ? "#059669" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="FileText" size={15} />Документы
            </button>
            <button onClick={() => setShowSeoEditor(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: showSeoEditor ? "1.5px solid #3b82f6" : "1.5px solid #E8ECF0", background: showSeoEditor ? "#eff6ff" : "#fff", color: showSeoEditor ? "#3b82f6" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Search" size={15} />SEO
            </button>
            <button onClick={() => { setShowVersions(v => !v); if (!showVersions) loadVersions(); }}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: showVersions ? `1.5px solid #f59e0b` : "1.5px solid #E8ECF0", background: showVersions ? "#fffbeb" : "#fff", color: showVersions ? "#d97706" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="History" size={15} />Версии
            </button>
            {projectId && (
              <button onClick={() => window.open(`/landing/${projectId}`, "_blank")}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: `1.5px solid ${ACCENT}`, background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name="ExternalLink" size={15} />Открыть в браузере
              </button>
            )}
            <button onClick={downloadHtml}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: `1.5px solid ${ACCENT}`, background: ACCENT_LIGHT, color: ACCENT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Download" size={15} />Скачать HTML
            </button>
          </div>

          {showEmailHint && (
            <div style={{ margin: "12px 0 0", padding: "12px 16px", background: "#fffbeb", border: "1.5px solid #fbbf24", borderRadius: 10, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Icon name="AlertTriangle" size={16} style={{ color: "#d97706", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#92400e", flex: 1 }}>
                Вы не указали email для получения заявок с лендинга. Зайдите в <b>Профиль</b> и укажите его — иначе заявки с формы не дойдут.
              </span>
              <button
                onClick={() => setShowEmailHint(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#d97706", padding: 4, flexShrink: 0 }}
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          )}

          {/* Редактор стиля */}
          {showStyleEditor && (
            <StyleEditor style={siteStyle} onChange={newStyle => {
              setSiteStyle(newStyle);
              setShowStyleEditor(false);
            }} />
          )}

          {/* Политика конфиденциальности */}
          {showPrivacyEditor && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Политика конфиденциальности</div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Заполните данные — политика автоматически встроится в лендинг и будет доступна по ссылке /privacy при скачивании.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {([
                  { key: "orgName", label: "Название организации", placeholder: 'ИП Иванов Иван Иванович или ООО "Ромашка"' },
                  { key: "inn", label: "ИНН", placeholder: "1234567890" },
                  { key: "ogrn", label: "ОГРН / ОГРНИП", placeholder: "1234567890123" },
                  { key: "address", label: "Юридический адрес", placeholder: "г. Москва, ул. Примерная, д. 1" },
                  { key: "email", label: "Email для обращений", placeholder: "info@example.com" },
                  { key: "domain", label: "Домен сайта", placeholder: "example.com" },
                ] as { key: keyof PrivacyData; label: string; placeholder: string }[]).map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 11, color: "#888", fontWeight: 600, marginBottom: 4 }}>{f.label.toUpperCase()}</div>
                    <input
                      value={privacyData[f.key]}
                      onChange={e => setPrivacyData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, fontFamily: "Montserrat,sans-serif", outline: "none", color: "#1a1a1a" }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const privBody = buildPrivacyBody(privacyData);
                  const url = window.URL.createObjectURL(new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body>${privBody}</body></html>`], { type: "text/html;charset=utf-8" }));
                  window.open(url, "_blank");
                }}
                style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: "1px solid #059669", background: "#fff", color: "#059669", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name="Eye" size={14} />Предпросмотр политики
              </button>
              <div style={{ marginTop: 10, padding: "10px 12px", background: "#ecfdf5", borderRadius: 8, fontSize: 12, color: "#059669", lineHeight: 1.6 }}>
                Политика встраивается прямо в лендинг — всё в одном файле. При скачивании получите один HTML-файл с обеими страницами внутри.
              </div>
            </div>
          )}

          {/* SEO */}
          {showSeoEditor && (
            <SeoEditor seo={seoData} onChange={setSeoData} />
          )}

          {/* История версий */}
          {showVersions && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>История версий</div>
                <button onClick={saveVersion}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  <Icon name="BookmarkPlus" size={13} />Сохранить версию
                </button>
              </div>
              {versions.length === 0
                ? <div style={{ fontSize: 13, color: "#888", textAlign: "center", padding: "16px 0" }}>Нет сохранённых версий. Нажмите «Сохранить версию» чтобы зафиксировать текущее состояние.</div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {versions.map((v, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E8ECF0" }}>
                        <Icon name="Clock" size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 13, color: "#555" }}>{formatDate(v.savedAt)}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{v.blocks?.length || 0} блоков</div>
                        <button onClick={() => restoreVersion(i)}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", color: "#555", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                          <Icon name="RotateCcw" size={12} />Откатить
                        </button>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* Блоки + превью */}
          <div className={editMode ? "lnd-editor-layout lnd-editing" : "lnd-editor-layout"}>
            {/* Боковая панель блоков — скрыта в режиме редактирования (всё через выделение) */}
            {!editMode && (
            <div className="lnd-blocks-panel">
              {/* Переключатель вкладок */}
              <div style={{ display: "flex", gap: 4, marginBottom: 10, background: "#F1F5F9", borderRadius: 10, padding: 3 }}>
                {([
                  { id: "blocks", icon: "LayoutTemplate", label: "Блоки" },
                  { id: "images", icon: "Image",           label: "Фото" },
                  { id: "chat",   icon: "MessageCircle",   label: "ИИ-чат" },
                ] as { id: "blocks" | "images" | "chat"; icon: string; label: string }[]).map(tab => (
                  <button key={tab.id} onClick={() => setSidePanelTab(tab.id)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", borderRadius: 8, border: "none", background: sidePanelTab === tab.id ? "#fff" : "transparent", color: sidePanelTab === tab.id ? "#0F172A" : "#94A3B8", fontSize: 11, fontWeight: sidePanelTab === tab.id ? 700 : 500, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: sidePanelTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
                    <Icon name={tab.icon} size={12} style={{ color: sidePanelTab === tab.id ? (tab.id === "chat" ? PURPLE : ACCENT) : "#94A3B8" }} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Вкладка: Блоки */}
              {sidePanelTab === "blocks" && <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 4, paddingLeft: 4 }}>БЛОКИ САЙТА</div>
              {blocks.map((block) => (
                <div key={block.id}>
                  <div style={{ background: "#fff", borderRadius: 10, border: `1.5px solid ${editingBlock === block.id ? ACCENT : "#E8ECF0"}`, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: block.html && block.html !== "<!-- regenerating -->" ? "#34d399" : "#e2e8f0", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1 }}>{block.label}</span>
                      <button onClick={() => { setEditingBlock(editingBlock === block.id + "_photo" ? null : block.id + "_photo"); setBlockEditInput(""); }}
                        title="Фото / Видео / Карта"
                        style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: editingBlock === block.id + "_photo" ? "#fef9c3" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <Icon name="Image" size={12} style={{ color: editingBlock === block.id + "_photo" ? "#ca8a04" : "#64748B" }} />
                      </button>
                      <button onClick={() => { setEditingBlock(editingBlock === block.id ? null : block.id); setBlockEditInput(""); }}
                        title="Редактировать через ИИ"
                        style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: editingBlock === block.id ? ACCENT_LIGHT : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <Icon name="Wand2" size={12} style={{ color: editingBlock === block.id ? ACCENT : "#64748B" }} />
                      </button>
                    </div>
                    {/* Панель загрузки фото + видео + карта */}
                    {editingBlock === block.id + "_photo" && (
                      <div style={{ borderTop: "1px solid #E8ECF0", padding: "10px 12px", background: "#fffbeb" }}>

                        {/* Фото-слоты из шаблона */}
                        {BLOCK_PHOTO_SLOTS[block.id] && (
                          <>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>ФОТО БЛОКА</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
                              {BLOCK_PHOTO_SLOTS[block.id].map(slot => (
                                <button key={slot.id} onClick={e => { e.stopPropagation(); openPanelSlotPicker(slot.id); }} style={{
                                  display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                                  borderRadius: 8, border: "1.5px dashed #fbbf24", background: "#fff",
                                  cursor: "pointer", width: "100%", textAlign: "left",
                                }}>
                                  <Icon name="Upload" size={12} style={{ color: "#ca8a04", flexShrink: 0 }} />
                                  <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{slot.label}</span>
                                  <span style={{ fontSize: 10, color: "#94a3b8" }}>JPG/PNG</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Добавить / удалить фото-слот */}
                        <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
                          <button onClick={() => addPhotoSlot(block.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 8px", borderRadius: 7, border: "1px solid #d97706", background: "#fff", color: "#d97706", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                            <Icon name="PlusCircle" size={12} /> Добавить фото
                          </button>
                          <button onClick={() => removeLastPhotoSlot(block.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 8px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                            <Icon name="MinusCircle" size={12} /> Удалить фото
                          </button>
                        </div>

                        {/* Вставить видео */}
                        <div style={{ marginBottom: block.id === "contact" ? 10 : 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 5 }}>ВИДЕО</div>
                          <div style={{ display: "flex", gap: 5 }}>
                            <input
                              value={videoInput[block.id] || ""}
                              onChange={e => setVideoInput(prev => ({ ...prev, [block.id]: e.target.value }))}
                              placeholder="Ссылка (Кинескоп, YouTube, VK…)"
                              style={{ flex: 1, padding: "6px 8px", borderRadius: 7, border: "1px solid #fbbf24", fontSize: 11, fontFamily: "Montserrat,sans-serif", outline: "none", background: "#fff" }}
                            />
                            <button onClick={() => insertVideo(block.id, videoInput[block.id] || "")} style={{ padding: "6px 10px", borderRadius: 7, border: "none", background: "#d97706", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
                              <Icon name="Play" size={12} />
                            </button>
                          </div>
                          <div style={{ fontSize: 10, color: "#92400e", marginTop: 3 }}>Кинескоп, Яндекс.Диск, YouTube, VK</div>
                        </div>

                        {/* Яндекс-карта — только для блока contact */}
                        {block.id === "contact" && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 5 }}>ЯНДЕКС-КАРТА</div>
                            <div style={{ display: "flex", gap: 5 }}>
                              <input
                                value={mapInput}
                                onChange={e => setMapInput(e.target.value)}
                                placeholder="Адрес (г. Москва, ул. Пример, 1)"
                                style={{ flex: 1, padding: "6px 8px", borderRadius: 7, border: "1px solid #fbbf24", fontSize: 11, fontFamily: "Montserrat,sans-serif", outline: "none", background: "#fff" }}
                              />
                              <button onClick={() => insertYandexMap(mapInput)} style={{ padding: "6px 10px", borderRadius: 7, border: "none", background: "#d97706", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
                                <Icon name="MapPin" size={12} />
                              </button>
                            </div>
                            <button onClick={removeYandexMap} style={{ marginTop: 4, padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                              Удалить карту
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ИИ-редактор блока */}
                    {editingBlock === block.id && (
                      <div style={{ borderTop: "1px solid #E8ECF0", padding: "10px 12px", background: ACCENT_LIGHT }}>
                        <textarea value={blockEditInput} onChange={e => setBlockEditInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); editBlock(block.id); } }}
                          placeholder="Что изменить в этом блоке?"
                          rows={2}
                          style={{ width: "100%", padding: "7px 9px", borderRadius: 7, border: `1px solid ${ACCENT}40`, fontSize: 12, fontFamily: "Montserrat,sans-serif", outline: "none", resize: "none", lineHeight: 1.4, color: "#1a1a1a", background: "#fff" }}
                        />
                        <button onClick={() => editBlock(block.id)} disabled={!blockEditInput.trim() || blockEditing}
                          style={{ width: "100%", marginTop: 6, padding: "8px 0", borderRadius: 7, border: "none", background: blockEditInput.trim() && !blockEditing ? ACCENT : "#E8ECF0", color: blockEditInput.trim() && !blockEditing ? "#fff" : "#aaa", fontSize: 12, fontWeight: 700, cursor: blockEditInput.trim() && !blockEditing ? "pointer" : "default", fontFamily: "Montserrat,sans-serif" }}>
                          {blockEditing ? "Думаю..." : "Применить"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </>}

              {/* Вкладка: Изображения */}
              {sidePanelTab === "images" && (
                <LandingImageGen />
              )}

              {/* Вкладка: ИИ-чат по всему сайту */}
              {sidePanelTab === "chat" && (
                <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 340 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 8, paddingLeft: 2 }}>ИИ-КОНСУЛЬТАНТ ПО ЛЕНДИНГУ</div>
                  {siteMessages.length === 0 && (
                    <div style={{ background: PURPLE_LIGHT, borderRadius: 10, border: `1px solid ${PURPLE}30`, padding: "10px 12px", marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: PURPLE, fontWeight: 600, marginBottom: 4 }}>Спросите о вашем сайте</div>
                      <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>Как улучшить конверсию? Что добавить? Как переформулировать заголовок? ИИ знает контекст вашего бизнеса.</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 10 }}>
                        {[
                          "Как улучшить конверсию?",
                          "Какой блок добавить?",
                          "Помоги с заголовком",
                        ].map(q => (
                          <button key={q} onClick={() => { setSiteInput(q); }}
                            style={{ textAlign: "left", padding: "6px 10px", borderRadius: 7, border: `1px solid ${PURPLE}30`, background: "#fff", color: PURPLE, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                            {q} →
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
                    {siteMessages.map((m, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                        {m.role === "assistant" && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon name="Sparkles" size={9} style={{ color: "#fff" }} />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 600, color: "#888" }}>ИИ-консультант</span>
                          </div>
                        )}
                        <div style={{ maxWidth: "90%", padding: "8px 11px", borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: m.role === "user" ? PURPLE : "#F8FAFC", color: m.role === "user" ? "#fff" : "#1a1a1a", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap", border: m.role === "assistant" ? "1px solid #E8ECF0" : "none" }}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {siteChatLoading && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name="Sparkles" size={9} style={{ color: "#fff" }} />
                        </div>
                        <div style={{ display: "flex", gap: 3, padding: "6px 10px", background: "#F8FAFC", borderRadius: "12px 12px 12px 3px", border: "1px solid #E8ECF0" }}>
                          {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: PURPLE, opacity: 0.5, animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                        </div>
                      </div>
                    )}
                    <div ref={siteChatBottomRef} />
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                    <textarea value={siteInput} onChange={e => setSiteInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendSiteMessage(); } }}
                      placeholder="Спросите об улучшении сайта..."
                      rows={2}
                      style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${PURPLE}40`, fontSize: 12, fontFamily: "Montserrat,sans-serif", outline: "none", resize: "none", lineHeight: 1.4, color: "#1a1a1a" }}
                    />
                    <button onClick={sendSiteMessage} disabled={!siteInput.trim() || siteChatLoading}
                      style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: siteInput.trim() && !siteChatLoading ? PURPLE : "#E8ECF0", color: siteInput.trim() && !siteChatLoading ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", cursor: siteInput.trim() && !siteChatLoading ? "pointer" : "default", flexShrink: 0 }}>
                      <Icon name="Send" size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Превью */}
            <div style={{ borderRadius: 14, overflow: "hidden", border: editMode ? "2px solid #0ea5e9" : "1px solid #E8ECF0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", position: "relative" }}>
              <div style={{ background: editMode ? "#e0f2fe" : "#F1F5F9", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <div className="lnd-browser-dots" style={{ display: "flex", gap: 5 }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ flex: 1, background: "#fff", borderRadius: 5, padding: "3px 10px", fontSize: 11, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {editMode ? (selectedBlock ? `✏️ ${selectedBlock.kindLabel || "Элемент"} выбран — опишите правку` : "👆 Кликните на фото, текст, кнопку или секцию") : "Предварительный просмотр"}
                </div>
                <span style={{ fontSize: 10, color: "#888", background: "#E2E8F0", padding: "2px 7px", borderRadius: 5, flexShrink: 0 }}>
                  {Math.round(fullHtml.length / 1024)} КБ
                </span>
              </div>
              <iframe ref={iframeRef}
                className="lnd-preview-iframe"
                style={{ width: "100%", border: "none", display: "block" }}
                title="Превью лендинга" sandbox="allow-scripts allow-same-origin"
              />

              {/* ── ПЛАВАЮЩИЙ ЧАТ поверх превью ── */}
              {editMode && selectedBlock && (
                <div style={{
                  position: "absolute", bottom: 16, left: 16, right: 16, zIndex: 200,
                  background: "#fff", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
                  border: "2px solid #6366f1", overflow: "hidden",
                }}>
                  {/* Шапка — что выбрано */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#6366f1" }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{(selectedBlock.kindLabel || "◻ Элемент").split(" ")[0]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "Montserrat,sans-serif", lineHeight: 1.2 }}>
                        {(selectedBlock.kindLabel || "Элемент").replace(/^\S+\s/, "")} · {blocks.find(b => b.id === selectedBlock.id)?.label || selectedBlock.id}
                      </div>
                      {selectedBlock.preview && (
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontFamily: "Montserrat,sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          «{selectedBlock.preview}»
                        </div>
                      )}
                    </div>
                    <button onClick={() => {
                      iframeRef.current?.contentWindow?.postMessage({ type: "landing-clear-pick" }, "*");
                      setSelectedBlock(null); setFloatChatInput(""); setFloatChatPhoto(null);
                    }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="X" size={13} style={{ color: "#fff" }} />
                    </button>
                  </div>

                  {/* Подсказки быстрых команд — только редактирование текста и элементов */}
                  <div style={{ display: "flex", gap: 6, padding: "10px 12px 0", flexWrap: "wrap" }}>
                    {(selectedBlock.kind === "photo"
                      ? ["Сделай фото круглым", "Увеличь фото", "Скругли углы"]
                      : selectedBlock.kind === "button"
                      ? ["Поменяй текст кнопки", "Сделай кнопку ярче", "Другой цвет кнопки"]
                      : selectedBlock.kind === "heading" || selectedBlock.kind === "text" || selectedBlock.kind === "subheading"
                      ? ["Перепиши этот текст", "Сделай короче", "Сделай убедительнее", "Крупнее шрифт"]
                      : ["Перепиши текст", "Поменяй цвет", "Сделай аккуратнее"]
                    ).map(tip => (
                      <button key={tip} onClick={() => setFloatChatInput(tip)} style={{
                        padding: "3px 10px", borderRadius: 20, border: "1px solid #e0e7ff", background: "#f5f3ff",
                        color: "#6366f1", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif",
                        whiteSpace: "nowrap",
                      }}>{tip}</button>
                    ))}
                  </div>

                  {/* Для кнопки: привязка к разделу (без ИИ) */}
                  {selectedBlock.kind === "button" && (
                    <div style={{ padding: "8px 12px 0" }}>
                      <button
                        onClick={() => setShowFloatScroll(v => !v)}
                        style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${showFloatScroll ? "#10b981" : "#e0e7ff"}`, background: showFloatScroll ? "#ecfdf5" : "#f8fafc", color: showFloatScroll ? "#059669" : "#4338ca", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
                      >
                        <Icon name="ArrowDownToLine" size={14} />
                        Прокрутить до раздела
                      </button>
                      {showFloatScroll && (
                        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "Montserrat,sans-serif", marginBottom: 2 }}>Выберите раздел — кнопка будет прокручивать к нему:</div>
                          {blocks.map(b => (
                            <button
                              key={b.id}
                              onClick={() => {
                                iframeRef.current?.contentWindow?.postMessage({ type: "landing-set-btn-target", target: b.id }, "*");
                              }}
                              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid #d1fae5", background: "#f0fdf4", color: "#065f46", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "left" as const }}
                            >
                              <Icon name="Hash" size={12} style={{ color: "#10b981", flexShrink: 0 }} />
                              {b.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Для фото-слота: выбор Фото или Видео */}
                  {selectedBlock.kind === "photo" && !floatChatPhoto && (
                    <div style={{ padding: "10px 12px 0" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setShowFloatVideo(false); floatPhotoInputRef.current?.click(); }} style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "9px 10px", borderRadius: 9, border: "1.5px solid #e0e7ff", background: "#f8fafc",
                          color: "#4338ca", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif",
                        }}>
                          <Icon name="ImagePlus" size={15} /> Загрузить фото
                        </button>
                        <button onClick={() => { setShowFloatVideo(v => !v); setFloatVideoError(false); }} style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "9px 10px", borderRadius: 9, border: `1.5px solid ${showFloatVideo ? "#d97706" : "#e0e7ff"}`,
                          background: showFloatVideo ? "#fffbeb" : "#f8fafc",
                          color: showFloatVideo ? "#d97706" : "#4338ca", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif",
                        }}>
                          <Icon name="Play" size={14} /> Вставить видео
                        </button>
                      </div>
                      {showFloatVideo && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <input
                              value={floatVideoUrl}
                              onChange={e => { setFloatVideoUrl(e.target.value); setFloatVideoError(false); }}
                              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); insertVideoIntoPicked(floatVideoUrl); } }}
                              placeholder="Ссылка: Кинескоп, YouTube, VK, Rutube…"
                              autoFocus
                              style={{ flex: 1, padding: "8px 10px", borderRadius: 9, border: `1.5px solid ${floatVideoError ? "#ef4444" : "#fbbf24"}`, fontSize: 12, fontFamily: "Montserrat,sans-serif", outline: "none" }}
                            />
                            <button onClick={() => insertVideoIntoPicked(floatVideoUrl)} disabled={!floatVideoUrl.trim()} style={{
                              padding: "0 14px", borderRadius: 9, border: "none",
                              background: floatVideoUrl.trim() ? "#d97706" : "#E8ECF0", color: floatVideoUrl.trim() ? "#fff" : "#aaa",
                              fontSize: 12, fontWeight: 700, cursor: floatVideoUrl.trim() ? "pointer" : "default", fontFamily: "Montserrat,sans-serif", flexShrink: 0,
                            }}>Вставить</button>
                          </div>
                          <div style={{ fontSize: 10, color: floatVideoError ? "#ef4444" : "#94a3b8", marginTop: 4 }}>
                            {floatVideoError ? "Не удалось распознать ссылку — проверьте формат" : "Видео заменит эту фото-плашку"}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Превью прикреплённого фото + кнопка мгновенной вставки */}
                  {floatChatPhoto && (
                    <div style={{ padding: "8px 12px 0", display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={floatChatPhoto} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #e0e7ff", flexShrink: 0 }} />
                      <button onClick={sendFloatChat} disabled={floatChatLoading} style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "9px 12px", borderRadius: 9, border: "none", background: "#16a34a", color: "#fff",
                        fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif",
                      }}>
                        <Icon name="ImageDown" size={14} /> Вставить фото сюда
                      </button>
                      <button onClick={() => setFloatChatPhoto(null)} title="Убрать фото" style={{ background: "#f1f5f9", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="X" size={13} style={{ color: "#94a3b8" }} />
                      </button>
                    </div>
                  )}

                  {/* Поле ввода */}
                  <div style={{ display: "flex", gap: 6, padding: "8px 12px 12px", alignItems: "flex-end" }}>
                    {/* Кнопка прикрепить фото */}
                    <button onClick={() => floatPhotoInputRef.current?.click()} title="Прикрепить фото" style={{
                      width: 36, height: 36, borderRadius: 10, border: "1px solid #e0e7ff", background: floatChatPhoto ? "#f5f3ff" : "#f8fafc",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
                    }}>
                      <Icon name="ImagePlus" size={16} style={{ color: floatChatPhoto ? "#6366f1" : "#94a3b8" }} />
                    </button>
                    <textarea
                      value={floatChatInput}
                      onChange={e => setFloatChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFloatChat(); } }}
                      placeholder={selectedBlock.kind === "photo" ? "Что сделать с этим фото? Заменить, удалить, скруглить… (Enter)" : "Что изменить в выделенном? Напишите простыми словами… (Enter)"}
                      rows={2}
                      autoFocus
                      style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: "1.5px solid #e0e7ff", fontSize: 13, fontFamily: "Montserrat,sans-serif", outline: "none", resize: "none", lineHeight: 1.5, color: "#1a1a1a" }}
                    />
                    <button onClick={sendFloatChat} disabled={(!floatChatInput.trim() && !floatChatPhoto) || floatChatLoading} style={{
                      width: 36, height: 36, borderRadius: 10, border: "none", flexShrink: 0,
                      background: (floatChatInput.trim() || floatChatPhoto) && !floatChatLoading ? "#6366f1" : "#E8ECF0",
                      color: (floatChatInput.trim() || floatChatPhoto) && !floatChatLoading ? "#fff" : "#aaa",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}>
                      {floatChatLoading
                        ? <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #fff", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                        : <Icon name="Send" size={15} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Подсказка в editMode без выбранного блока */}
            {editMode && !selectedBlock && (
              <div style={{ marginTop: 8, padding: "14px 18px", background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", borderRadius: 12, border: "1.5px dashed #6366f1", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "pulse-btn 2s ease-in-out infinite" }}>
                  <Icon name="MousePointerClick" size={18} style={{ color: "#fff" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#4338ca", fontWeight: 700, fontFamily: "Montserrat,sans-serif", marginBottom: 2 }}>
                    👆 Кликните на фото, текст, кнопку или секцию
                  </div>
                  <div style={{ fontSize: 11, color: "#6366f1", fontFamily: "Montserrat,sans-serif" }}>
                    Опишите ИИ что сделать — переписать текст, поменять цвет, загрузить фото или видео
                  </div>
                </div>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          <input ref={slotFileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleSlotFileChange} />
          <input ref={floatPhotoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFloatChatPhoto} />
          <input ref={panelSlotFileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePanelSlotFileChange} />

          {/* Оверлей выбора фото — открывается по клику из iframe */}
          {photoPickerOpen && (
            <div onClick={() => setPhotoPickerOpen(false)} style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div onClick={e => e.stopPropagation()} style={{
                background: "#fff", borderRadius: 20, padding: "32px 28px", maxWidth: 340, width: "90%",
                textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 8, fontFamily: "Montserrat,sans-serif" }}>
                  Загрузить фото
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24, fontFamily: "Montserrat,sans-serif", lineHeight: 1.5 }}>
                  Выберите изображение с вашего устройства. Рекомендуемый формат: JPG или PNG, не менее 800px.
                </div>
                <label style={{
                  display: "block", width: "100%", padding: "13px", borderRadius: 12, cursor: "pointer",
                  background: "hsl(185,85%,32%)", color: "#fff", fontSize: 15, fontWeight: 700,
                  fontFamily: "Montserrat,sans-serif", marginBottom: 10,
                }}>
                  Выбрать файл
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                    setPhotoPickerOpen(false);
                    handleSlotFileChange(e);
                  }} />
                </label>
                <button onClick={() => { setPhotoPickerOpen(false); setPendingSlotId(null); }} style={{
                  width: "100%", padding: "11px", borderRadius: 12, border: "1px solid #E2E8F0",
                  background: "none", color: "#64748b", fontSize: 14, cursor: "pointer", fontFamily: "Montserrat,sans-serif",
                }}>
                  Отмена
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes dot-pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }

        .lnd-editor-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 14px;
          align-items: start;
        }
        .lnd-editor-layout.lnd-editing {
          grid-template-columns: 1fr;
          max-width: 1100px;
          margin: 0 auto;
        }
        .lnd-editor-layout.lnd-editing .lnd-preview-iframe {
          height: 78vh;
        }
        .lnd-blocks-panel {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lnd-preview-iframe {
          height: 640px;
        }

        @media (max-width: 768px) {
          .lnd-editor-layout {
            grid-template-columns: 1fr;
          }
          .lnd-blocks-panel {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }
          .lnd-blocks-panel > div:first-child {
            grid-column: 1 / -1;
          }
          .lnd-preview-iframe {
            height: 420px;
          }
          .lnd-browser-dots { display: none !important; }
        }

        @media (max-width: 480px) {
          .lnd-blocks-panel {
            grid-template-columns: 1fr;
          }
          .lnd-preview-iframe {
            height: 360px;
          }
        }
        @keyframes pulse-btn {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
        }
      `}</style>
    </div>
  );
}