import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { showEnergyGate } from "@/components/EnergyGate";

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
const LS_BLOCKS  = "landing_builder_blocks";
const LS_STYLE   = "landing_builder_style";

type LandingType = "budget" | "premium";
interface Message { role: "user" | "assistant"; content: string; }
interface LandingStyle {
  primary: string; accent: string; dark: string; light: string; text: string;
  headingFont: string; bodyFont: string;
}
interface LandingBlock { id: string; label: string; html: string; }
interface LandingProject {
  id: string; title: string; landing_type: LandingType;
  created_at: string; updated_at: string;
}
interface Version { savedAt: string; html: string; blocks: LandingBlock[]; style: LandingStyle; }

const BLOCKS_ORDER: { id: string; label: string }[] = [
  { id: "header",   label: "Шапка и меню" },
  { id: "hero",     label: "Обложка" },
  { id: "about",    label: "О нас" },
  { id: "services", label: "Услуги" },
  { id: "gallery",  label: "Галерея фото" },
  { id: "reviews",  label: "Отзывы" },
  { id: "contact",  label: "Контакты" },
  { id: "footer",   label: "Футер" },
];

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

// Editor script: contenteditable + photo-slot click + image replace → postMessage
const EDITOR_SCRIPT = `<script>
(function() {
  var style = document.createElement('style');
  style.textContent = \`
    [contenteditable]:hover { outline: 2px dashed #0ea5e9 !important; outline-offset: 2px !important; cursor: text !important; }
    [contenteditable]:focus { outline: 2px solid #0ea5e9 !important; outline-offset: 2px !important; background: rgba(14,165,233,0.04) !important; }
    [data-photo-slot] { position: relative !important; cursor: pointer !important; }
    [data-photo-slot]:hover { outline: 3px solid #f59e0b !important; outline-offset: 0 !important; }
    [data-photo-slot]::after { content: '📷 Загрузить фото'; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.65); color: #fff; font-size: 12px; padding: 5px 12px; border-radius: 20px; pointer-events: none; white-space: nowrap; opacity: 0; transition: opacity 0.2s; z-index: 10; }
    [data-photo-slot]:hover::after { opacity: 1 !important; }
    [data-photo-slot].has-photo::after { content: '✏️ Изменить фото'; }
    .lnd-img-menu { position: absolute; z-index: 999; background: #1e293b; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.35); padding: 6px; display: flex; flex-direction: column; gap: 2px; min-width: 160px; }
    .lnd-img-menu button { background: none; border: none; color: #f1f5f9; font-size: 13px; font-weight: 500; padding: 9px 14px; border-radius: 8px; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px; }
    .lnd-img-menu button:hover { background: rgba(255,255,255,0.1); }
    .lnd-img-menu button.danger { color: #f87171; }
    .lnd-img-menu button.danger:hover { background: rgba(248,113,113,0.12); }
  \`;
  document.head.appendChild(style);

  // contenteditable для текста
  var tags = ['h1','h2','h3','h4','p','span','li','button','label','td'];
  tags.forEach(function(tag) {
    document.querySelectorAll(tag).forEach(function(el) {
      if (!el.querySelector('img') && !el.closest('script') && !el.closest('style') && !el.closest('[data-photo-slot]')) {
        el.setAttribute('contenteditable','true');
        el.setAttribute('spellcheck','false');
      }
    });
  });

  // Всплывающее меню для фото
  var activeMenu = null;
  function closeMenu() {
    if (activeMenu) { activeMenu.remove(); activeMenu = null; }
  }
  document.addEventListener('click', function(e) {
    if (activeMenu && !activeMenu.contains(e.target)) closeMenu();
  });

  function showImgMenu(x, y, onReplace, onDelete) {
    closeMenu();
    var menu = document.createElement('div');
    menu.className = 'lnd-img-menu';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    var btnReplace = document.createElement('button');
    btnReplace.innerHTML = '🔄 Заменить фото';
    btnReplace.onclick = function(e) { e.stopPropagation(); closeMenu(); onReplace(); };
    var btnDelete = document.createElement('button');
    btnDelete.className = 'danger';
    btnDelete.innerHTML = '🗑️ Удалить фото';
    btnDelete.onclick = function(e) { e.stopPropagation(); closeMenu(); onDelete(); };
    menu.appendChild(btnReplace);
    menu.appendChild(btnDelete);
    document.body.appendChild(menu);
    activeMenu = menu;
    // Поправить позицию если выходит за край
    var rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth - 10) menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
    if (rect.bottom > window.innerHeight - 10) menu.style.top = (y - rect.height - 8) + 'px';
  }

  // Обработка photo-slot
  document.querySelectorAll('[data-photo-slot]').forEach(function(slot) {
    var slotId = slot.dataset.photoSlot;
    slot.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      var hasPhoto = slot.classList.contains('has-photo');
      if (hasPhoto) {
        showImgMenu(e.clientX + window.scrollX, e.clientY + window.scrollY,
          function() { window.parent.postMessage({ type: 'landing-slot-click', slotId: slotId }, '*'); },
          function() {
            slot.innerHTML = slot.dataset.placeholder || '<div class="photo-placeholder" style="text-align:center;color:#94a3b8;padding:20px;"><svg width=32 height=32 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><div style="margin-top:8px;font-size:13px">Нажмите, чтобы загрузить фото</div></div>';
            slot.classList.remove('has-photo');
            slot.style.cssText = '';
            sendHtml();
          }
        );
      } else {
        window.parent.postMessage({ type: 'landing-slot-click', slotId: slotId }, '*');
      }
    });
  });

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'landing-slot-replace') {
      var slot = document.querySelector('[data-photo-slot="' + e.data.slotId + '"]');
      if (slot) {
        slot.dataset.placeholder = slot.innerHTML;
        slot.innerHTML = '<img src="' + e.data.src + '" style="width:100%;height:100%;object-fit:cover;display:block;" />';
        slot.classList.add('has-photo');
        slot.style.border = 'none';
        slot.style.outline = 'none';
      }
      sendHtml();
    }
  });

  function sendHtml() {
    window.parent.postMessage({ type: 'landing-html-update', html: document.documentElement.outerHTML }, '*');
  }
  document.addEventListener('input', function() {
    clearTimeout(window._t); window._t = setTimeout(sendHtml, 800);
  });
  sendHtml();
})();
</script>`;

function buildFullHtml(blocks: LandingBlock[], style: LandingStyle): string {
  const hf = `${style.headingFont}, serif`;
  const bf = `${style.bodyFont}, sans-serif`;
  const gfonts = encodeURIComponent(`${style.headingFont}:wght@700&family=${style.bodyFont}:wght@400;600`);
  const root = `<style id="root-vars">
:root{--c-primary:${style.primary};--c-accent:${style.accent};--c-dark:${style.dark};--c-light:${style.light};--c-text:${style.text};--font-heading:${hf};--font-body:${bf};}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:var(--font-body);color:var(--c-text);background:var(--c-light);}
h1,h2,h3,h4{font-family:var(--font-heading);}
.container{max-width:1200px;margin:0 auto;padding:0 20px;}
@import url('https://fonts.googleapis.com/css2?family=${gfonts}&display=swap');
</style>`;
  const htmlParts = blocks.map(b => `<div data-block-id="${b.id}">${b.html}</div>`).join("\n");
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Лендинг</title>
${root}
</head>
<body>
${htmlParts}
</body>
</html>`;
}

function session() { return localStorage.getItem("lk_session") || ""; }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ── Список проектов ────────────────────────────────────────────────────────────
function ProjectsList({ onOpen, onNew }: { onOpen: (p: LandingProject) => void; onNew: () => void }) {
  const [projects, setProjects] = useState<LandingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(LANDING_API_URL, { headers: { "X-Session-Id": session() } })
      .then(r => r.json()).then(d => setProjects(d.projects || [])).finally(() => setLoading(false));
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
        <button onClick={onNew} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="Plus" size={16} />Новый лендинг
        </button>
      </div>
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
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: p.landing_type === "premium" ? ACCENT_LIGHT : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={p.landing_type === "premium" ? "Sparkles" : "FileText"} size={20} style={{ color: p.landing_type === "premium" ? ACCENT : "#64748B" }} />
                  </div>
                  <button onClick={() => onOpen(p)} style={{ flex: 1, minWidth: 0, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "Montserrat,sans-serif" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {p.landing_type === "premium" ? "Премиум" : "Стандартный"} · {formatDate(p.updated_at)}
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

// ── Выбор типа ────────────────────────────────────────────────────────────────
function TypeSelector({ onSelect }: { onSelect: (t: LandingType) => void }) {
  const types = [
    { id: "budget" as LandingType, icon: "FileText", iconColor: "#64748B", iconBg: "#F1F5F9", badge: "СТАНДАРТНЫЙ", badgeColor: "#64748B", badgeBg: "#F1F5F9", title: "Стандартный", desc: "5 блоков, минимализм, быстрая генерация.", color: "#64748B", bg: "#fff", border: "#E8ECF0" },
    { id: "premium" as LandingType, icon: "Sparkles", iconColor: "#fff", iconBg: ACCENT, badge: "ПРЕМИУМ", badgeColor: "#fff", badgeBg: ACCENT, title: "Премиальный", desc: "7 блоков, уникальный дизайн, анимации, индивидуальная палитра.", color: ACCENT, bg: ACCENT_LIGHT, border: `${ACCENT}40` },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Выберите тип лендинга</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {types.map(t => (
          <button key={t.id} onClick={() => onSelect(t.id)}
            style={{ textAlign: "left", background: t.bg, border: `2px solid ${t.border}`, borderRadius: 16, padding: 20, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "border-color 0.15s, box-shadow 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={t.icon} size={20} style={{ color: t.iconColor }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.badgeColor, background: t.badgeBg, padding: "4px 10px", borderRadius: 20 }}>{t.badge}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, marginBottom: 14 }}>{t.desc}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.color }}>Выбрать →</div>
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

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Стиль сайта</div>
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

// ── Главный компонент ─────────────────────────────────────────────────────────
export default function LkLandingBuilder({ forceList = false }: { forceList?: boolean }) {
  const [view, setView] = useState<"list" | "new" | "editor">("list");
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
    try { const s = localStorage.getItem(LS_BLOCKS); return s ? JSON.parse(s) : []; } catch { return []; }
  });
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

  // Редактирование блока через ИИ
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [blockEditInput, setBlockEditInput] = useState("");
  const [blockEditing, setBlockEditing] = useState(false);

  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImgIdx, setPendingImgIdx] = useState<string | null>(null);
  const [pendingSlotId, setPendingSlotId] = useState<string | null>(null);
  const slotFileInputRef = useRef<HTMLInputElement>(null);
  const panelSlotFileInputRef = useRef<HTMLInputElement>(null);
  const [pendingPanelSlotId, setPendingPanelSlotId] = useState<string | null>(null);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);

  // Персист
  useEffect(() => { if (messages.length > 0) localStorage.setItem(LS_MSGS, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem(LS_PHASE, phase); }, [phase]);
  useEffect(() => { if (landingType) localStorage.setItem(LS_TYPE, landingType); }, [landingType]);
  useEffect(() => { localStorage.setItem(LS_BLOCKS, JSON.stringify(blocks)); }, [blocks]);
  useEffect(() => { localStorage.setItem(LS_STYLE, JSON.stringify(siteStyle)); }, [siteStyle]);
  useEffect(() => { if (projectId) localStorage.setItem(LS_PID, projectId); }, [projectId]);
  useEffect(() => { localStorage.setItem(LS_TITLE, projectTitle); }, [projectTitle]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chatLoading]);

  // Восстановить в iframe при смене editMode
  useEffect(() => {
    if (!editMode && iframeRef.current && blocks.length > 0) {
      iframeRef.current.srcdoc = buildFullHtml(blocks, siteStyle);
    }
  }, [editMode]); // eslint-disable-line

  // Если блоки изменились стилем — перестраиваем iframe
  useEffect(() => {
    if (phase === "done" && iframeRef.current && !editMode) {
      iframeRef.current.srcdoc = buildFullHtml(blocks, siteStyle);
    }
  }, [siteStyle]); // eslint-disable-line

  // Восстановить если были блоки (не восстанавливаем если forceList)
  useEffect(() => {
    if (forceList) return;
    const savedPhase = localStorage.getItem(LS_PHASE);
    const savedType = localStorage.getItem(LS_TYPE);
    const savedBlocks = localStorage.getItem(LS_BLOCKS);
    if (savedType && savedPhase) {
      if (savedPhase === "done" && (!savedBlocks || JSON.parse(savedBlocks).length === 0)) {
        localStorage.setItem(LS_PHASE, "chat");
      }
      setView("editor");
    }
  }, []); // eslint-disable-line

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
      const data = await res.json();
      if (res.status === 402) { showEnergyGate({ message: data.error }); return; }
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ошибка связи. Попробуйте ещё раз." }]);
    } finally {
      setChatLoading(false);
    }
  }

  // ── БЛОЧНАЯ ГЕНЕРАЦИЯ ─────────────────────────────────────────────────────
  async function generateLanding() {
    setPhase("generating");
    setGenProgress({ current: "", done: [] });
    setBlocks([]);

    // Шаг 1: получить стиль
    setGenProgress({ current: "style", done: [] });
    let style = DEFAULT_STYLE;
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
      }
    } catch {
      // Продолжаем с дефолтным стилем
    }

    // Шаг 2: генерировать блоки по очереди
    const blocksToGen = landingType === "budget"
      ? ["header", "hero", "services", "contact", "footer"]
      : ["header", "hero", "about", "services", "reviews", "contact", "footer"];

    const generatedBlocks: LandingBlock[] = [];
    const done: string[] = [];

    for (const blockId of blocksToGen) {
      setGenProgress({ current: blockId, done: [...done] });
      try {
        const res = await fetch(AI_LANDING_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Session-Id": session() },
          body: JSON.stringify({ mode: "gen-block", blockId, style, landingType, messages }),
          signal: AbortSignal.timeout(60_000),
        });
        const data = await res.json();
        if (res.status === 402) {
          showEnergyGate({ message: data.error });
          break;
        }
        if (data.html) {
          const label = BLOCKS_ORDER.find(b => b.id === blockId)?.label || blockId;
          const newBlock: LandingBlock = { id: blockId, label, html: data.html };
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
      setPhase("done");
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
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, html: data.html } : b));
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
      const html = buildFullHtml(blocksData, styleData);
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
    if (!projectId) { await saveProject(blocks, siteStyle, true); return; }
    const res = await fetch(LANDING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": session() },
      body: JSON.stringify({ action: "save-version", id: projectId }),
    });
    const data = await res.json();
    if (data.saved) {
      setSavedOk(true); setTimeout(() => setSavedOk(false), 2500);
      loadVersions();
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
        const savedBlocks: LandingBlock[] = proj.blocks || [];
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
    const welcome: Message = {
      role: "assistant",
      content: type === "budget"
        ? "Создаём лендинг 👍\n\nРасскажите о бизнесе: название и чем занимаетесь?"
        : "Создаём премиальный лендинг ✨\n\nРасскажите: название компании, чем занимаетесь и кто ваши клиенты?",
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

  async function downloadHtml() {
    const res = await fetch(LANDING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": session() },
      body: JSON.stringify({ action: "download" }),
    });
    if (res.status === 402) { const d = await res.json(); showEnergyGate({ message: d.error }); return; }
    if (!res.ok) return;
    const html = buildFullHtml(blocks, siteStyle);
    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${projectTitle || "landing"}.html`; a.click();
    URL.revokeObjectURL(a.href);
  }

  async function regenerateBlock(blockId: string) {
    const label = BLOCKS_ORDER.find(b => b.id === blockId)?.label || blockId;
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, html: `<!-- regenerating -->` } : b));
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ mode: "gen-block", blockId, style: siteStyle, landingType, messages }),
        signal: AbortSignal.timeout(60_000),
      });
      const data = await res.json();
      if (res.status === 402) { showEnergyGate({ message: data.error }); return; }
      if (data.html) {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, html: data.html, label } : b));
      }
    } catch {
      setBlocks(prev => prev.map(b => b.id === blockId && b.html === "<!-- regenerating -->" ? { ...b, html: "" } : b));
    }
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
    const slotId = pendingPanelSlotId;
    if (!slotId) return;
    const reader = new FileReader();
    reader.onload = ev => {
      iframeRef.current?.contentWindow?.postMessage({ type: "landing-slot-replace", slotId, src: ev.target?.result }, "*");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    setPendingPanelSlotId(null);
  }

  function openPanelSlotPicker(slotId: string) {
    setPendingPanelSlotId(slotId);
    setTimeout(() => panelSlotFileInputRef.current?.click(), 0);
  }

  const isReadyToGenerate = messages.length >= 4 && phase === "chat";
  const fullHtml = blocks.length > 0 ? buildFullHtml(blocks, siteStyle) : "";
  const iframeSrc = editMode
    ? fullHtml.replace("</body>", EDITOR_SCRIPT + "</body>")
    : fullHtml;

  // ── RENDER LIST ───────────────────────────────────────────────────────────
  if (view === "list") return <ProjectsList onOpen={openProject} onNew={startNew} />;
  if (view === "new") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setView("list")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={14} /> Назад
        </button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Новый лендинг</div>
      </div>
      <TypeSelector onSelect={selectType} />
    </div>
  );

  // ── RENDER EDITOR ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Шапка */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => setView("list")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
          <Icon name="ArrowLeft" size={14} /> Мои лендинги
        </button>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{projectTitle}</div>
        {landingType && (
          <span style={{ fontSize: 11, fontWeight: 700, color: landingType === "premium" ? ACCENT : "#64748B", background: landingType === "premium" ? ACCENT_LIGHT : "#F1F5F9", padding: "3px 10px", borderRadius: 20 }}>
            {landingType === "premium" ? "Премиум" : "Стандарт"}
          </span>
        )}
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
              const allSteps = [styleStep, ...BLOCKS_ORDER.filter(b =>
                landingType === "budget"
                  ? ["header","hero","services","contact","footer"].includes(b.id)
                  : ["header","hero","about","services","reviews","contact","footer"].includes(b.id)
              )];
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

          {isReadyToGenerate && (
            <button onClick={generateLanding}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "15px 24px", borderRadius: 14, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(185,85%,26%) 100%)`, color: "#fff", boxShadow: `0 4px 16px ${ACCENT}44` }}>
              <Icon name="Sparkles" size={18} />
              Создать лендинг по блокам
            </button>
          )}
        </>
      )}

      {/* Готовый сайт: блоки + превью */}
      {phase === "done" && (
        <>
          {/* Панель инструментов */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => { setEditMode(v => !v); }}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: editMode ? `1.5px solid ${ACCENT}` : "1.5px solid #E8ECF0", background: editMode ? ACCENT_LIGHT : "#fff", color: editMode ? ACCENT : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name={editMode ? "PenOff" : "Pencil"} size={15} />
              {editMode ? "Выйти из редактора" : "Редактировать текст"}
            </button>
            <button onClick={() => setShowStyleEditor(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: showStyleEditor ? `1.5px solid ${PURPLE}` : "1.5px solid #E8ECF0", background: showStyleEditor ? PURPLE_LIGHT : "#fff", color: showStyleEditor ? PURPLE : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Palette" size={15} />Стиль
            </button>
            <button onClick={() => { setShowVersions(v => !v); if (!showVersions) loadVersions(); }}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: showVersions ? `1.5px solid #f59e0b` : "1.5px solid #E8ECF0", background: showVersions ? "#fffbeb" : "#fff", color: showVersions ? "#d97706" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="History" size={15} />Версии
            </button>
            <button onClick={downloadHtml}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, border: `1.5px solid ${ACCENT}`, background: ACCENT_LIGHT, color: ACCENT, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Download" size={15} />Скачать HTML
            </button>
          </div>

          {/* Редактор стиля */}
          {showStyleEditor && (
            <StyleEditor style={siteStyle} onChange={newStyle => {
              setSiteStyle(newStyle);
              setShowStyleEditor(false);
            }} />
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
          <div className="lnd-editor-layout">
            {/* Боковая панель блоков */}
            <div className="lnd-blocks-panel">
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 4, paddingLeft: 4 }}>БЛОКИ САЙТА</div>
              {blocks.map((block) => (
                <div key={block.id}>
                  <div style={{ background: "#fff", borderRadius: 10, border: `1.5px solid ${editingBlock === block.id ? ACCENT : "#E8ECF0"}`, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: block.html && block.html !== "<!-- regenerating -->" ? "#34d399" : "#e2e8f0", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1 }}>{block.label}</span>
                      {BLOCK_PHOTO_SLOTS[block.id] && (
                        <button onClick={() => { setEditingBlock(editingBlock === block.id + "_photo" ? null : block.id + "_photo"); setBlockEditInput(""); }}
                          title="Загрузить фото"
                          style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: editingBlock === block.id + "_photo" ? "#fef9c3" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                          <Icon name="Image" size={12} style={{ color: editingBlock === block.id + "_photo" ? "#ca8a04" : "#64748B" }} />
                        </button>
                      )}
                      <button onClick={() => regenerateBlock(block.id)} title="Перегенерировать"
                        style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <Icon name="RefreshCw" size={12} style={{ color: "#64748B" }} />
                      </button>
                      <button onClick={() => { setEditingBlock(editingBlock === block.id ? null : block.id); setBlockEditInput(""); }}
                        title="Редактировать через ИИ"
                        style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: editingBlock === block.id ? ACCENT_LIGHT : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                        <Icon name="Wand2" size={12} style={{ color: editingBlock === block.id ? ACCENT : "#64748B" }} />
                      </button>
                    </div>

                    {/* Панель загрузки фото */}
                    {editingBlock === block.id + "_photo" && BLOCK_PHOTO_SLOTS[block.id] && (
                      <div style={{ borderTop: "1px solid #E8ECF0", padding: "10px 12px", background: "#fffbeb" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>ФОТО БЛОКА</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {BLOCK_PHOTO_SLOTS[block.id].map(slot => (
                            <button key={slot.id} onClick={() => openPanelSlotPicker(slot.id)} style={{
                              display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                              borderRadius: 8, border: "1.5px dashed #fbbf24", background: "#fff",
                              cursor: "pointer", transition: "border-color 0.15s", width: "100%", textAlign: "left",
                            }}>
                              <Icon name="Upload" size={13} style={{ color: "#ca8a04", flexShrink: 0 }} />
                              <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{slot.label}</span>
                              <span style={{ fontSize: 10, color: "#94a3b8" }}>JPG / PNG</span>
                            </button>
                          ))}
                        </div>
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
            </div>

            {/* Превью */}
            <div style={{ borderRadius: 14, overflow: "hidden", border: editMode ? "2px solid #0ea5e9" : "1px solid #E8ECF0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <div style={{ background: editMode ? "#e0f2fe" : "#F1F5F9", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <div className="lnd-browser-dots" style={{ display: "flex", gap: 5 }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ flex: 1, background: "#fff", borderRadius: 5, padding: "3px 10px", fontSize: 11, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {editMode ? "✏️ Кликайте на текст или фото-блок для редактирования" : "Предварительный просмотр"}
                </div>
                <span style={{ fontSize: 10, color: "#888", background: "#E2E8F0", padding: "2px 7px", borderRadius: 5, flexShrink: 0 }}>
                  {Math.round(fullHtml.length / 1024)} КБ
                </span>
              </div>
              <iframe ref={iframeRef} srcDoc={iframeSrc}
                className="lnd-preview-iframe"
                style={{ width: "100%", border: "none", display: "block" }}
                title="Превью лендинга" sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          <input ref={slotFileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleSlotFileChange} />
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
      `}</style>
    </div>
  );
}