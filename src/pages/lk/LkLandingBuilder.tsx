import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { showEnergyGate } from "@/components/EnergyGate";

const AI_LANDING_URL = "https://functions.poehali.dev/12df0290-571d-42d1-8fb0-8889ae15cd68";
const LANDING_API_URL = "https://functions.poehali.dev/b5f86006-d448-4c34-96b8-3fba0295cb14";
const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,96%)";
const LS_MSGS = "landing_builder_msgs";
const LS_HTML = "landing_builder_html";
const LS_PHASE = "landing_builder_phase";
const LS_TYPE = "landing_builder_type";
const LS_PROJECT_ID = "landing_project_id";
const LS_TITLE = "landing_project_title";

type LandingType = "budget" | "premium" | "multipage";
interface Message { role: "user" | "assistant"; content: string; }
interface LandingProject {
  id: string;
  title: string;
  landing_type: LandingType;
  created_at: string;
  updated_at: string;
}

const MULTIPAGE_FEATURES = [
  "До 6 страниц: Главная, Услуги, О нас, Портфолио, FAQ, Контакты",
  "Единый дизайн и навигация на всех страницах",
  "Переключение страниц без перезагрузки",
  "Гамбургер-меню на мобильных",
  "Скачивается одним HTML-файлом",
];

// Извлекает список страниц из мини-сайта (ищет data-page атрибуты)
function extractPages(html: string): string[] {
  const matches = [...html.matchAll(/data-page="([^"]+)"/g)];
  const pages = matches.map(m => m[1]);
  return pages.length > 0 ? [...new Set(pages)] : [];
}

const NETLIFY_STEPS = [
  { n: "1", text: "Зайдите на сайт netlify.com и нажмите «Sign up» (бесплатно)" },
  { n: "2", text: "После регистрации откроется раздел Sites — перетащите скачанный HTML-файл прямо в браузер" },
  { n: "3", text: "Через 10 секунд сайт будет онлайн по адресу вида random-name.netlify.app" },
  { n: "4", text: "Чтобы подключить свой домен: Settings → Domain management → Add custom domain" },
];

const BUDGET_FEATURES = [
  "5 блоков: обложка, услуги, преимущества, контакты, футер",
  "Чистый минималистичный дизайн",
  "Один акцентный цвет под тематику",
  "Адаптивная вёрстка под мобильные",
  "Форма обратной связи",
];

const PREMIUM_FEATURES = [
  "7–9 блоков: обложка, о компании, услуги, кейсы, отзывы, цены, FAQ, CTA, футер",
  "Уникальный дизайн: асимметрия, градиенты, анимации",
  "Индивидуальная цветовая палитра и паттерны",
  "Премиальная типографика и кастомные кнопки",
  "Расширенная форма + карта / соцсети / мессенджеры",
];

const EDITOR_SCRIPT = `
<script>
(function() {
  var style = document.createElement('style');
  style.textContent = \`
    [contenteditable]:hover { outline: 2px dashed #0ea5e9 !important; outline-offset: 2px !important; cursor: text !important; }
    [contenteditable]:focus { outline: 2px solid #0ea5e9 !important; outline-offset: 2px !important; background: rgba(14,165,233,0.04) !important; }
    .edit-hint { position:fixed; top:12px; left:50%; transform:translateX(-50%); background:#0ea5e9; color:#fff; padding:8px 18px; border-radius:20px; font-size:13px; font-family:sans-serif; z-index:99999; pointer-events:none; box-shadow:0 4px 16px rgba(14,165,233,0.4); }
    img.editable-img { cursor:pointer !important; }
    img.editable-img:hover { outline: 3px solid #f59e0b !important; outline-offset: 2px !important; }
  \`;
  document.head.appendChild(style);

  var hint = document.createElement('div');
  hint.className = 'edit-hint';
  hint.textContent = '✏️ Текст — кликайте и пишите · 🖼 Фото — кликайте на картинку';
  document.body.appendChild(hint);

  var tags = ['h1','h2','h3','h4','h5','p','span','a','li','button','label','td','th','blockquote','figcaption'];
  tags.forEach(function(tag) {
    document.querySelectorAll(tag).forEach(function(el) {
      if (el.children.length === 0 || el.querySelector('br')) {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
      }
    });
  });

  var imgIndex = 0;
  document.querySelectorAll('img').forEach(function(img) {
    img.classList.add('editable-img');
    img.dataset.imgIdx = String(imgIndex++);
    img.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage({ type: 'landing-img-click', idx: img.dataset.imgIdx }, '*');
    });
  });

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'landing-img-replace') {
      document.querySelectorAll('img[data-img-idx]').forEach(function(img) {
        if (img.dataset.imgIdx === String(e.data.idx)) {
          img.src = e.data.src;
          img.removeAttribute('srcset');
        }
      });
      sendHtml();
    }
  });

  function sendHtml() {
    window.parent.postMessage({ type: 'landing-html-update', html: document.documentElement.outerHTML }, '*');
  }

  document.addEventListener('input', function() {
    clearTimeout(window._saveTimer);
    window._saveTimer = setTimeout(sendHtml, 800);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      var el = document.activeElement;
      if (el && el.tagName !== 'TEXTAREA') { e.preventDefault(); }
    }
  });

  sendHtml();
})();
</script>
`;

function injectEditorScript(html: string): string {
  return html.replace("</body>", EDITOR_SCRIPT + "</body>");
}

function session() { return localStorage.getItem("lk_session") || ""; }

function getWelcome(type: LandingType): Message {
  return {
    role: "assistant",
    content: type === "budget"
      ? "Отлично, создаём бюджетный лендинг — лаконичный и современный 👍\n\nРасскажите о бизнесе: название компании и чем занимаетесь?"
      : "Создаём премиальный лендинг — с уникальным дизайном и расширенной структурой ✨\n\nРасскажите о бизнесе: название, чем занимаетесь и кто ваши клиенты?",
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

// ── Список проектов ──
function ProjectsList({ onOpen, onNew }: { onOpen: (p: LandingProject) => void; onNew: () => void }) {
  const [projects, setProjects] = useState<LandingProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(LANDING_API_URL, { headers: { "X-Session-Id": session() } })
      .then(r => r.json())
      .then(d => setProjects(d.projects || []))
      .finally(() => setLoading(false));
  }, []);

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
        <button
          onClick={onNew}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
        >
          <Icon name="Plus" size={16} />
          Новый лендинг
        </button>
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: "center", color: "#888", fontSize: 14 }}>Загрузка...</div>
      )}

      {!loading && projects.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "2px dashed #E8ECF0", padding: 48, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="Globe" size={28} style={{ color: ACCENT }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Лендингов пока нет</div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Создайте первый лендинг — ИИ соберёт его за несколько минут</div>
          <button
            onClick={onNew}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
          >
            <Icon name="Plus" size={16} />
            Создать первый лендинг
          </button>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => onOpen(p)}
              style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 14, padding: "14px 18px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "left", transition: "border-color 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ACCENT; (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px ${ACCENT}18`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8ECF0"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 10, background: p.landing_type === "premium" ? ACCENT : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={p.landing_type === "premium" ? "Sparkles" : "FileText"} size={20} style={{ color: p.landing_type === "premium" ? "#fff" : "#64748B" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {p.landing_type === "premium" ? "Премиум" : "Стандартный"} · изменён {formatDate(p.updated_at)}
                </div>
              </div>
              <Icon name="ChevronRight" size={16} style={{ color: "#CBD5E1", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Экран выбора типа ──
function TypeSelector({ onSelect }: { onSelect: (t: LandingType) => void }) {
  const PURPLE = "hsl(270,70%,50%)";
  const PURPLE_LIGHT = "hsl(270,70%,97%)";

  const types = [
    {
      id: "budget" as LandingType,
      icon: "FileText", iconColor: "#64748B", iconBg: "#F1F5F9",
      badge: "СТАНДАРТНЫЙ", badgeColor: "#64748B", badgeBg: "#F1F5F9",
      title: "Стандартный лендинг", desc: "Чистый, минималистичный. Быстро и по делу.",
      descColor: "#64748B", features: BUDGET_FEATURES,
      featureDotBg: "#E2E8F0", featureDotColor: "#64748B", featureTextColor: "#64748B",
      cardBg: "#fff", cardBorder: "#E8ECF0", cardBorderHover: ACCENT,
      dividerColor: "#F1F5F9", ctaColor: "#64748B",
    },
    {
      id: "premium" as LandingType,
      icon: "Sparkles", iconColor: "#fff", iconBg: ACCENT,
      badge: "ПРЕМИУМ", badgeColor: "#fff", badgeBg: ACCENT,
      title: "Премиальный лендинг", desc: "Уникальный дизайн, анимации, полная структура.",
      descColor: "#475569", features: PREMIUM_FEATURES,
      featureDotBg: ACCENT, featureDotColor: "#fff", featureTextColor: "#475569",
      cardBg: `linear-gradient(135deg, ${ACCENT_LIGHT} 0%, #fff 60%)`,
      cardBorder: `${ACCENT}40`, cardBorderHover: ACCENT,
      dividerColor: `${ACCENT}20`, ctaColor: ACCENT,
    },
    {
      id: "multipage" as LandingType,
      icon: "LayoutDashboard", iconColor: "#fff", iconBg: PURPLE,
      badge: "МИНИ-САЙТ", badgeColor: "#fff", badgeBg: PURPLE,
      title: "Мини-сайт", desc: "До 6 страниц в одном файле. Полноценный сайт-визитка.",
      descColor: "#475569", features: MULTIPAGE_FEATURES,
      featureDotBg: PURPLE, featureDotColor: "#fff", featureTextColor: "#475569",
      cardBg: `linear-gradient(135deg, ${PURPLE_LIGHT} 0%, #fff 60%)`,
      cardBorder: `${PURPLE}40`, cardBorderHover: PURPLE,
      dividerColor: `${PURPLE}20`, ctaColor: PURPLE,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Выберите тип сайта</div>
      <div className="landing-type-grid">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="landing-type-card"
            style={{ textAlign: "left", background: t.cardBg, border: `2px solid ${t.cardBorder}`, borderRadius: 16, padding: 20, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "border-color 0.15s, box-shadow 0.15s", width: "100%" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorderHover; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${t.cardBorderHover}22`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.cardBorder; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={t.icon} size={20} style={{ color: t.iconColor }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.badgeColor, background: t.badgeBg, padding: "4px 10px", borderRadius: 20 }}>{t.badge}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: t.descColor, marginBottom: 14, lineHeight: 1.5 }}>{t.desc}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {t.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: t.featureDotBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Icon name="Check" size={9} style={{ color: t.featureDotColor }} />
                  </div>
                  <span style={{ fontSize: 11, color: t.featureTextColor, lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 10, borderTop: `1px solid ${t.dividerColor}`, fontSize: 13, fontWeight: 700, color: t.ctaColor }}>
              Выбрать →
            </div>
          </button>
        ))}
      </div>
      <style>{`
        .landing-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 540px) {
          .landing-type-grid { grid-template-columns: 1fr; }
          .landing-type-card { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}

export default function LkLandingBuilder() {
  // view: "list" | "new" | "editor"
  const [view, setView] = useState<"list" | "new" | "editor">("list");
  const [landingType, setLandingType] = useState<LandingType | null>(() => {
    try { return (localStorage.getItem(LS_TYPE) as LandingType) || null; } catch { return null; }
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    try { const s = localStorage.getItem(LS_MSGS); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"chat" | "generating" | "done">(() => {
    try { return (localStorage.getItem(LS_PHASE) as "chat" | "done") || "chat"; } catch { return "chat"; }
  });
  const [htmlResult, setHtmlResult] = useState(() => {
    try { return localStorage.getItem(LS_HTML) || ""; } catch { return ""; }
  });
  const [projectId, setProjectId] = useState<string | null>(() => {
    try { return localStorage.getItem(LS_PROJECT_ID) || null; } catch { return null; }
  });
  const [projectTitle, setProjectTitle] = useState(() => {
    try { return localStorage.getItem(LS_TITLE) || "Без названия"; } catch { return "Без названия"; }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  const [pendingImgIdx, setPendingImgIdx] = useState<string | null>(null);
  const [aiRefineInput, setAiRefineInput] = useState("");
  const [aiRefining, setAiRefining] = useState(false);
  const [aiRefineDone, setAiRefineDone] = useState(false);
  const [showAiRefine, setShowAiRefine] = useState(false);
  const [cloudSaving, setCloudSaving] = useState(false);
  const [cloudSaved, setCloudSaved] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [activePage, setActivePage] = useState<string>("home");
  const [genStep, setGenStep] = useState<"structure" | "style" | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (messages.length > 0) localStorage.setItem(LS_MSGS, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem(LS_HTML, htmlResult); localStorage.setItem(LS_PHASE, phase); }, [htmlResult, phase]);
  useEffect(() => { if (projectId) localStorage.setItem(LS_PROJECT_ID, projectId); }, [projectId]);
  useEffect(() => { localStorage.setItem(LS_TITLE, projectTitle); }, [projectTitle]);

  // Если есть незаконченный проект в localStorage — сразу в редактор
  useEffect(() => {
    const savedPhase = localStorage.getItem(LS_PHASE);
    const savedType = localStorage.getItem(LS_TYPE);
    if (savedType && savedPhase) setView("editor");
  }, []);

  // Автосохранение в облако при изменении html
  useEffect(() => {
    if (!htmlResult || phase !== "done") return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { saveToCloud(false); }, 3000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [htmlResult]); // eslint-disable-line

  const handleIframeMessage = useCallback((e: MessageEvent) => {
    if (e.data?.type === "landing-html-update" && e.data.html) {
      setHtmlResult(e.data.html);
      setEditSaved(true);
      setTimeout(() => setEditSaved(false), 2000);
    }
    if (e.data?.type === "landing-img-click") {
      setPendingImgIdx(e.data.idx);
      fileInputRef.current?.click();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [handleIframeMessage]);

  useEffect(() => {
    if (!editMode && iframeRef.current) iframeRef.current.srcdoc = htmlResult;
  }, [editMode]); // eslint-disable-line

  // Переключение страницы мини-сайта в iframe
  function switchPage(pageId: string) {
    setActivePage(pageId);
    iframeRef.current?.contentWindow?.postMessage({ type: "landing-switch-page", pageId }, "*");
  }

  async function saveToCloud(manual = true) {
    if (!htmlResult) return;
    if (manual) setCloudSaving(true);
    try {
      const title = extractTitle(htmlResult) || projectTitle;
      const res = await fetch(LANDING_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ id: projectId || undefined, title, landingType, html: htmlResult, messages }),
      });
      const data = await res.json();
      if (data.id) {
        setProjectId(data.id);
        setProjectTitle(title);
        localStorage.setItem(LS_PROJECT_ID, data.id);
        if (manual) { setCloudSaved(true); setTimeout(() => setCloudSaved(false), 2500); }
      }
    } finally {
      if (manual) setCloudSaving(false);
    }
  }

  function extractTitle(html: string): string {
    const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (m) return m[1].trim().slice(0, 80);
    const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1) return h1[1].trim().slice(0, 80);
    return "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || pendingImgIdx === null) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      iframeRef.current?.contentWindow?.postMessage({ type: "landing-img-replace", idx: pendingImgIdx, src }, "*");
      setPendingImgIdx(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function aiRefine() {
    const task = aiRefineInput.trim();
    if (!task || aiRefining) return;
    setAiRefining(true);
    setAiRefineDone(false);
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ messages, mode: "refine", landingType, html: htmlResult, refineTask: task }),
        signal: AbortSignal.timeout(120_000),
      });
      const data = await res.json();
      if (res.status === 402) {
        showEnergyGate({ message: data.error || "Недостаточно энергии для доработки" });
        return;
      }
      const html = data.reply || data.html || "";
      if (html && html.includes("<!DOCTYPE")) {
        setHtmlResult(html);
        setAiRefineInput("");
        setAiRefineDone(true);
        setEditMode(false);
        setTimeout(() => setAiRefineDone(false), 3000);
      }
    } catch (err) {
      console.error("[aiRefine]", err);
    } finally {
      setAiRefining(false);
    }
  }

  function openProject(p: LandingProject) {
    // Загружаем полный проект с HTML
    fetch(`${LANDING_API_URL}?id=${p.id}`, { headers: { "X-Session-Id": session() } })
      .then(r => r.json())
      .then(data => {
        const proj = data.project;
        setProjectId(proj.id);
        setProjectTitle(proj.title);
        setLandingType(proj.landing_type);
        setHtmlResult(proj.html);
        setMessages(proj.messages || []);
        setPhase(proj.html ? "done" : "chat");
        setShowPreview(!!proj.html);
        localStorage.setItem(LS_TYPE, proj.landing_type);
        localStorage.setItem(LS_HTML, proj.html);
        localStorage.setItem(LS_PHASE, proj.html ? "done" : "chat");
        localStorage.setItem(LS_PROJECT_ID, proj.id);
        localStorage.setItem(LS_TITLE, proj.title);
        setView("editor");
      });
  }

  function startNew() {
    // Сброс всего
    localStorage.removeItem(LS_MSGS);
    localStorage.removeItem(LS_HTML);
    localStorage.removeItem(LS_PHASE);
    localStorage.removeItem(LS_TYPE);
    localStorage.removeItem(LS_PROJECT_ID);
    localStorage.removeItem(LS_TITLE);
    setLandingType(null);
    setMessages([]);
    setInput("");
    setPhase("chat");
    setHtmlResult("");
    setProjectId(null);
    setProjectTitle("Без названия");
    setShowPreview(false);
    setEditMode(false);
    setView("new");
  }

  function backToList() {
    setView("list");
  }

  function selectType(type: LandingType) {
    setLandingType(type);
    localStorage.setItem(LS_TYPE, type);
    setMessages([getWelcome(type)]);
    setView("editor");
  }

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch(AI_LANDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": session() },
        body: JSON.stringify({ messages: newMessages, mode: "chat", landingType }),
      });
      const data = await res.json();
      if (res.status === 402) {
        showEnergyGate({ message: data.error || "Недостаточно энергии" });
        return;
      }
      if (!res.ok || !data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: "Сервис временно недоступен. Попробуйте через минуту." }]);
        return;
      }
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Ошибка соединения. Проверьте интернет и попробуйте ещё раз." }]);
    } finally {
      setLoading(false);
    }
  }

  async function callGenerate(body: object): Promise<{ html: string; error?: string; status?: number }> {
    const res = await fetch(AI_LANDING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": session() },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(115_000),
    });
    const data = await res.json();
    return { html: data.reply || data.html || "", status: res.status, error: data.error };
  }

  async function generateLanding() {
    setPhase("generating");
    setLoading(true);
    const isTwoStep = landingType === "premium" || landingType === "multipage";
    try {
      // Этап 1: структура + текст
      setGenStep("structure");
      const step1 = await callGenerate({ messages, mode: "generate", landingType });
      if (step1.status === 402) {
        setPhase("chat");
        showEnergyGate({ message: step1.error || "Недостаточно энергии для генерации" });
        return;
      }
      if (!step1.html || !step1.html.includes("<!DOCTYPE")) {
        setPhase("chat");
        setMessages(prev => [...prev, { role: "assistant", content: "Не удалось сгенерировать — попробуйте ещё раз или добавьте больше деталей о бизнесе." }]);
        return;
      }

      // Этап 2: стилизация (только для премиума)
      let finalHtml = step1.html;
      if (isTwoStep) {
        setGenStep("style");
        const step2 = await callGenerate({ html: step1.html, mode: "style", landingType });
        if (step2.status === 402) {
          // Нет энергии на стилизацию — отдаём структурный вариант
          setHtmlResult(step1.html);
          setPhase("done");
          setShowPreview(true);
          setActivePage("home");
          return;
        }
        if (step2.html && step2.html.includes("<!DOCTYPE")) {
          finalHtml = step2.html;
        }
      }

      setHtmlResult(finalHtml);
      setPhase("done");
      setShowPreview(true);
      setActivePage("home");
    } catch {
      setPhase("chat");
      setMessages(prev => [...prev, { role: "assistant", content: "Генерация заняла слишком долго. Попробуйте ещё раз — обычно со второй попытки всё работает." }]);
    } finally {
      setLoading(false);
      setGenStep(null);
    }
  }

  function openInBrowser() {
    const blob = new Blob([htmlResult], { type: "text/html;charset=utf-8;" });
    window.open(URL.createObjectURL(blob), "_blank");
  }

  async function downloadHtml() {
    // Сначала списываем энергию за скачивание
    const res = await fetch(LANDING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": session() },
      body: JSON.stringify({ action: "download" }),
    });
    if (res.status === 402) {
      const data = await res.json();
      showEnergyGate({ message: data.error || "Недостаточно энергии для скачивания" });
      return;
    }
    if (!res.ok) return;
    // Списание прошло — скачиваем файл
    const blob = new Blob([htmlResult], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle || "landing"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const isReadyToGenerate = messages.length >= 6 && phase === "chat";
  const PURPLE = "hsl(270,70%,50%)";
  const PURPLE_LIGHT = "hsl(270,70%,97%)";
  const typeBadge = landingType === "premium"
    ? { label: "Премиум", color: ACCENT, bg: ACCENT_LIGHT }
    : landingType === "multipage"
    ? { label: "Мини-сайт", color: PURPLE, bg: PURPLE_LIGHT }
    : { label: "Стандартный", color: "#64748B", bg: "#F1F5F9" };

  // Страницы мини-сайта из HTML
  const sitePages = landingType === "multipage" && htmlResult ? extractPages(htmlResult) : [];
  const PAGE_LABELS: Record<string, string> = {
    home: "Главная", services: "Услуги", about: "О нас",
    portfolio: "Портфолио", faq: "FAQ", contacts: "Контакты",
  };

  // ── Список проектов ──
  if (view === "list") {
    return <ProjectsList onOpen={openProject} onNew={startNew} />;
  }

  // ── Выбор типа (новый проект) ──
  if (view === "new") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={backToList} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="ArrowLeft" size={14} /> Назад
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Новый лендинг</div>
        </div>
        <TypeSelector onSelect={selectType} />
      </div>
    );
  }

  // ── Редактор ──
  if (phase === "done" && !htmlResult) setPhase("chat");
  const iframeSrc = editMode ? injectEditorScript(htmlResult) : htmlResult;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Шапка редактора */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button onClick={backToList} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
          <Icon name="ArrowLeft" size={14} /> Мои лендинги
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editingTitle ? (
            <input
              autoFocus
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={e => { if (e.key === "Enter") setEditingTitle(false); }}
              style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", border: "1.5px solid #CBD5E1", borderRadius: 8, padding: "4px 10px", outline: "none", fontFamily: "Montserrat,sans-serif", width: "100%", maxWidth: 300 }}
            />
          ) : (
            <button onClick={() => setEditingTitle(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Montserrat,sans-serif" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{projectTitle}</span>
              <Icon name="Pencil" size={13} style={{ color: "#94A3B8", flexShrink: 0 }} />
            </button>
          )}
          {landingType && <span style={{ fontSize: 11, fontWeight: 700, color: typeBadge.color, background: typeBadge.bg, padding: "2px 8px", borderRadius: 20, marginLeft: 6 }}>{typeBadge.label}</span>}
        </div>
        {phase === "done" && (
          <button
            onClick={() => saveToCloud(true)}
            disabled={cloudSaving}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #E2E8F0", background: cloudSaved ? "#f0fdf4" : "#fff", color: cloudSaved ? "#059669" : "#555", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}
          >
            <Icon name={cloudSaved ? "CheckCircle" : "Save"} size={14} />
            {cloudSaving ? "Сохранение..." : cloudSaved ? "Сохранено" : "Сохранить"}
          </button>
        )}
      </div>

      {/* Спиннер генерации */}
      {phase === "generating" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 40, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${ACCENT_LIGHT}`, borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 20px" }} />

          {/* Двухэтапный прогресс для премиума / мини-сайта */}
          {(landingType === "premium" || landingType === "multipage") ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
                {[
                  { key: "structure", label: "1. Структура и текст", icon: "FileText" },
                  { key: "style", label: "2. Дизайн и стили", icon: "Sparkles" },
                ].map((step, i) => {
                  const isDone = (step.key === "structure" && genStep === "style");
                  const isActive = genStep === step.key;
                  return (
                    <div key={step.key} style={{ display: "flex", alignItems: "center", gap: i === 0 ? 0 : 8 }}>
                      {i > 0 && <div style={{ width: 24, height: 2, background: isDone || isActive ? ACCENT : "#E2E8F0", margin: "0 4px" }} />}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: isActive ? ACCENT_LIGHT : isDone ? "#F0FDF4" : "#F8FAFC", border: `1px solid ${isActive ? ACCENT : isDone ? "#86EFAC" : "#E2E8F0"}` }}>
                        <Icon name={isDone ? "CheckCircle" : step.icon} size={13} style={{ color: isActive ? ACCENT : isDone ? "#16A34A" : "#94A3B8" }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? ACCENT : isDone ? "#16A34A" : "#94A3B8" }}>{step.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>
                {genStep === "structure" ? "Создаю структуру и наполняю текстом..." : "Применяю премиальный дизайн..."}
              </div>
              <div style={{ fontSize: 13, color: "#888" }}>
                {genStep === "structure" ? "Шаг 1 из 2 — обычно 20–40 секунд" : "Шаг 2 из 2 — добавляю анимации, шрифты, цвета..."}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>ИИ создаёт лендинг...</div>
              <div style={{ fontSize: 13, color: "#888" }}>Обычно занимает 20–40 секунд</div>
            </>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Панель действий (только когда лендинг готов) */}
      {phase === "done" && (
        <>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={openInBrowser} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="ExternalLink" size={16} />Открыть в браузере
            </button>
            <button onClick={downloadHtml} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: `1.5px solid ${ACCENT}`, background: ACCENT_LIGHT, color: ACCENT, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Download" size={16} />Скачать HTML
            </button>
            <button
              onClick={() => { setShowPreview(true); setEditMode(v => !v); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: editMode ? `1.5px solid #0ea5e9` : "1.5px solid #E8ECF0", background: editMode ? "#f0f9ff" : "#fff", color: editMode ? "#0ea5e9" : "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "all 0.15s" }}
            >
              <Icon name={editMode ? "PenOff" : "Pencil"} size={16} />
              {editMode ? "Завершить правки" : "Редактировать"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            <button onClick={() => setShowPreview(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "1.5px solid #E8ECF0", background: "#fff", color: "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name={showPreview ? "EyeOff" : "Eye"} size={16} />
              {showPreview ? "Скрыть" : "Превью"}
            </button>
            <button
              onClick={() => setShowAiRefine(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: showAiRefine ? `1.5px solid #a855f7` : "1.5px solid #E8ECF0", background: showAiRefine ? "#faf5ff" : "#fff", color: showAiRefine ? "#7c3aed" : "#555", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "all 0.15s" }}
            >
              <Icon name="Wand2" size={16} />ИИ-доработка
            </button>
          </div>

          {/* Подсказка редактора */}
          {editMode && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#f0f9ff", border: "1.5px solid #0ea5e9" }}>
              <Icon name="Info" size={16} style={{ color: "#0ea5e9", flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 13, color: "#0369a1", lineHeight: 1.6 }}>
                <strong>✏️ Текст</strong> — кликните на любой заголовок или абзац и редактируйте прямо там.<br />
                <strong>🖼 Фото</strong> — кликните на любую картинку — откроется выбор файла с вашего устройства.<br />
                Все изменения сохраняются автоматически.
                {editSaved && <strong style={{ marginLeft: 8, color: "#059669" }}>✓ Сохранено</strong>}
              </div>
            </div>
          )}

          {/* ИИ-доработка */}
          {showAiRefine && (
            <div style={{ background: "#faf5ff", borderRadius: 14, border: "1.5px solid #a855f7", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="Wand2" size={16} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#4c1d95" }}>Попросить ИИ доработать</div>
                  <div style={{ fontSize: 12, color: "#7c3aed" }}>Напишите что изменить — ИИ переделает лендинг</div>
                </div>
                {aiRefineDone && (
                  <div style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#059669", background: "#d1fae5", padding: "4px 10px", borderRadius: 8 }}>✓ Готово</div>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#6d28d9", marginBottom: 10, lineHeight: 1.5 }}>
                Примеры: «Сделай заголовок короче», «Добавь раздел с ценами», «Поменяй цвет на синий»
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <textarea
                  value={aiRefineInput}
                  onChange={e => setAiRefineInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); aiRefine(); } }}
                  placeholder="Что нужно изменить в лендинге?"
                  rows={2}
                  disabled={aiRefining}
                  style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #c4b5fd", fontSize: 13, fontFamily: "Montserrat,sans-serif", outline: "none", resize: "none", lineHeight: 1.5, color: "#1a1a1a", background: aiRefining ? "#f5f3ff" : "#fff" }}
                />
                <button
                  onClick={aiRefine}
                  disabled={!aiRefineInput.trim() || aiRefining}
                  style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: aiRefineInput.trim() && !aiRefining ? "#7c3aed" : "#e5e7eb", color: aiRefineInput.trim() && !aiRefining ? "#fff" : "#aaa", fontSize: 13, fontWeight: 700, cursor: aiRefineInput.trim() && !aiRefining ? "pointer" : "default", fontFamily: "Montserrat,sans-serif", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
                >
                  {aiRefining
                    ? <><div style={{ width: 14, height: 14, border: "2px solid #fff4", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Думаю...</>
                    : <><Icon name="Sparkles" size={14} />Применить</>}
                </button>
              </div>
            </div>
          )}

          {/* Превью */}
          {showPreview && (
            <div style={{ borderRadius: 14, overflow: "hidden", border: editMode ? "2px solid #0ea5e9" : "1px solid #E8ECF0", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", transition: "border-color 0.2s" }}>
              {/* Шапка браузера */}
              <div style={{ background: editMode ? "#e0f2fe" : "#F1F5F9", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ flex: 1, background: "#fff", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#888", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {editMode ? "✏️ Режим редактирования" : "Предварительный просмотр"}
                </div>
                <div style={{ fontSize: 11, color: "#888", background: "#E2E8F0", padding: "2px 8px", borderRadius: 6, flexShrink: 0 }}>
                  {htmlResult ? `${Math.round(htmlResult.length / 1024)} КБ` : ""}
                </div>
              </div>

              {/* Переключатель страниц для мини-сайта */}
              {landingType === "multipage" && sitePages.length > 0 && (
                <div style={{ background: "#fff", borderBottom: "1px solid #E8ECF0", padding: "8px 16px", overflowX: "auto" } as React.CSSProperties}>
                  <div style={{ display: "flex", gap: 6, width: "max-content" }}>
                    {sitePages.map(pageId => (
                      <button
                        key={pageId}
                        onClick={() => switchPage(pageId)}
                        style={{
                          padding: "5px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600,
                          cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "all 0.15s", whiteSpace: "nowrap",
                          background: activePage === pageId ? PURPLE : "#F1F5F9",
                          color: activePage === pageId ? "#fff" : "#64748B",
                        }}
                      >
                        {PAGE_LABELS[pageId] || pageId}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                key={editMode ? "edit" : "view"}
                srcDoc={iframeSrc}
                style={{ width: "100%", height: 600, border: "none", display: "block" }}
                title="Превью лендинга"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}

          {/* Инструкция размещения */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0" }}>
            <button onClick={() => setShowInstructions(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="BookOpen" size={16} style={{ color: ACCENT }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Как разместить лендинг в интернете (бесплатно)</span>
              </div>
              <Icon name={showInstructions ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#888" }} />
            </button>
            {showInstructions && (
              <div style={{ padding: "0 20px 20px" }}>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 16, lineHeight: 1.6 }}>
                  Самый простой способ — <strong>Netlify Drop</strong>. Бесплатно, без регистрации домена, за 1 минуту.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {NETLIFY_STEPS.map(s => (
                    <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{s.n}</div>
                      <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{s.text}</div>
                    </div>
                  ))}
                </div>
                <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "9px 18px", borderRadius: 8, background: ACCENT_LIGHT, color: ACCENT, fontSize: 13, fontWeight: 700, textDecoration: "none", border: `1px solid ${ACCENT}30` }}>
                  <Icon name="ExternalLink" size={14} />Открыть Netlify Drop
                </a>
              </div>
            )}
          </div>
        </>
      )}

      {/* Чат */}
      {phase === "chat" && (
        <>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", maxHeight: 420, overflowY: "auto" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 16, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
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
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
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
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Напишите о своём бизнесе..."
                rows={2}
                style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8ECF0", fontSize: 13, fontFamily: "Montserrat,sans-serif", outline: "none", resize: "none", lineHeight: 1.5, color: "#1a1a1a" }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: input.trim() && !loading ? ACCENT : "#E8ECF0", color: input.trim() && !loading ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", flexShrink: 0, transition: "background 0.15s" }}
              >
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>

          {isReadyToGenerate && (
            <button
              onClick={generateLanding}
              disabled={loading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                padding: "15px 24px", borderRadius: 14, border: "none", fontSize: 15, fontWeight: 700,
                cursor: loading ? "default" : "pointer", fontFamily: "Montserrat,sans-serif",
                background: loading ? "#E8ECF0"
                  : landingType === "multipage" ? `linear-gradient(135deg, ${PURPLE} 0%, hsl(270,70%,40%) 100%)`
                  : `linear-gradient(135deg, ${ACCENT} 0%, hsl(185,85%,26%) 100%)`,
                color: loading ? "#aaa" : "#fff",
                boxShadow: loading ? "none"
                  : landingType === "multipage" ? `0 4px 16px ${PURPLE}44`
                  : `0 4px 16px ${ACCENT}44`,
              }}
            >
              <Icon name={landingType === "multipage" ? "LayoutDashboard" : landingType === "premium" ? "Sparkles" : "Wand2"} size={18} />
              {landingType === "multipage" ? "Создать мини-сайт" : landingType === "premium" ? "Создать премиальный лендинг" : "Создать лендинг"}
            </button>
          )}
        </>
      )}

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}