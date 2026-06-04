import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";

const ACCENT = "hsl(185,85%,32%)";
const DIRECT_COLOR = "hsl(25,90%,50%)";
const API_URL = "https://functions.poehali.dev/f6671108-c48e-4e2b-a3d4-ab0c53503f83";
const IMAGE_API_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a"; // ai-image-gen (таймаут 300с)
const CACHE_VERSION = "v2";

interface Ad {
  title1: string;
  title1_len: number;
  title2: string;
  title2_len: number;
  text: string;
  text_len: number;
  url_path: string;
}

interface AdGroup {
  group: string;
  service_tag: string;
  ads: Ad[];
  keywords?: string[];
  minus_words?: string[];
}

interface KeywordGroup {
  group: string;
  service_tag: string;
  keywords: { query: string; frequency: string; frequency_label: string; intent: string }[];
}

function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).catch(() => {});
    const el = document.createElement("textarea");
    el.value = text; el.style.position = "fixed"; el.style.left = "-9999px";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
  } catch { /* ignore */ }
}

// ── Индикатор длины ───────────────────────────────────────────────────────────
function LenBadge({ len, max }: { len: number; max: number }) {
  const over = len > max;
  const warn = len > max * 0.9;
  const color = over ? "#DC2626" : warn ? "hsl(40,70%,38%)" : "hsl(145,60%,38%)";
  const bg    = over ? "#FEF2F2" : warn ? "hsl(40,90%,93%)" : "hsl(145,55%,93%)";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 5, padding: "2px 6px" }}>
      {len}/{max}
    </span>
  );
}

// ── Превью объявления Яндекс.Директ ──────────────────────────────────────────
function AdPreview({ ad, idx, salonName }: { ad: Ad; idx: number; salonName: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyField = (key: string, text: string) => {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const copyAll = () => {
    const text = `Заголовок 1: ${ad.title1}\nЗаголовок 2: ${ad.title2}\nТекст: ${ad.text}\nURL: ${ad.url_path}`;
    copyToClipboard(text);
    setCopied("all");
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{ border: "1.5px solid #E8ECF0", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
      {/* Шапка */}
      <div style={{ background: "hsl(25,90%,97%)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #FFE4CC" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: DIRECT_COLOR, letterSpacing: 0.5, textTransform: "uppercase" }}>
          Вариант {idx + 1}
        </span>
        <button
          onClick={copyAll}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: copied === "all" ? "hsl(145,60%,38%)" : "#94A3B8", fontFamily: "Montserrat,sans-serif", padding: 0 }}
        >
          <Icon name={copied === "all" ? "Check" : "Copy"} size={12} />
          {copied === "all" ? "Скопировано" : "Копировать всё"}
        </button>
      </div>

      {/* Превью как в Директе */}
      <div style={{ padding: "14px 16px", background: "#FAFBFF", borderBottom: "1px solid #E8ECF0" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a73e8", lineHeight: 1.3, marginBottom: 2 }}>
          {ad.title1}{ad.title2 ? ` | ${ad.title2}` : ""}
        </div>
        <div style={{ fontSize: 12, color: "#188038", marginBottom: 4 }}>
          {salonName.toLowerCase().replace(/\s+/g, "-")}.ru/{ad.url_path}
        </div>
        <div style={{ fontSize: 13, color: "#3c4043", lineHeight: 1.5 }}>{ad.text}</div>
      </div>

      {/* Поля с индикаторами */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { key: "t1", label: "Заголовок 1", value: ad.title1, len: ad.title1_len || ad.title1.length, max: 35 },
          { key: "t2", label: "Заголовок 2", value: ad.title2, len: ad.title2_len || ad.title2.length, max: 30 },
          { key: "tx", label: "Текст", value: ad.text, len: ad.text_len || ad.text.length, max: 81 },
        ].map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</span>
                <LenBadge len={f.len} max={f.max} />
              </div>
              <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.4 }}>{f.value}</div>
            </div>
            <button
              onClick={() => copyField(f.key, f.value)}
              style={{ background: "none", border: "none", cursor: "pointer", color: copied === f.key ? "hsl(145,60%,38%)" : "#CBD5E1", padding: "2px 0", flexShrink: 0 }}
            >
              <Icon name={copied === f.key ? "Check" : "Copy"} size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const PREPARE_API_URL = "https://functions.poehali.dev/7ada2f96-7236-4d93-8146-fdc7b9ed7dca";

// ── Кнопка генерации картинки ─────────────────────────────────────────────────
function ImageGenButton({ groupName, keywords, ads }: { groupName: string; keywords: string[]; ads: Ad[] }) {
  const [state, setState] = useState<"idle" | "preparing" | "generating" | "done" | "error">("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const sessionId = localStorage.getItem("lk_session") || "";

  const generate = async () => {
    setState("preparing");
    setErrMsg("");
    try {
      // Шаг 1: получаем промт и списываем 10 ⚡ (быстро)
      const prepRes = await fetch(PREPARE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({
          group_name: groupName,
          keywords,
          ads: ads.map(a => ({ title1: a.title1, title2: a.title2, text: a.text })),
        }),
      });
      const prepData = await prepRes.json();
      if (!prepRes.ok) throw new Error(prepData.error || "Ошибка подготовки");

      const prompt = prepData.prompt;
      setState("generating");

      // Шаг 2: генерируем картинку через ai-image-gen (до 300с), списывает 5 ⚡
      const genRes = await fetch(IMAGE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ prompt, aspect_ratio: "1024x1024", use_salon_context: false }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || "Ошибка генерации");
      const url = genData.images?.[0]?.url;
      if (!url) throw new Error("Сервис не вернул изображение");
      setImageUrl(url);
      setState("done");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Ошибка");
      setState("error");
    }
  };

  if (state === "done" && imageUrl) return (
    <div style={{ marginTop: 14, borderRadius: 12, overflow: "hidden", border: "1.5px solid #E8ECF0" }}>
      <img src={imageUrl} alt="Рекламное изображение" style={{ width: "100%", display: "block", maxHeight: 320, objectFit: "cover" }} />
      <div style={{ padding: "10px 14px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: 11, color: "#64748B" }}>1024×1024 · Яндекс.Директ</span>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={imageUrl} download="ad-image.png" target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, background: ACCENT, color: "#fff", borderRadius: 7, padding: "6px 12px", fontSize: 11, fontWeight: 700, textDecoration: "none", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="Download" size={12} />
            Скачать
          </a>
          <button onClick={generate}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid #E8ECF0", borderRadius: 7, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: "#64748B", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="RefreshCw" size={11} />
            Ещё вариант (−5 ⚡)
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: 14 }}>
      {(state === "preparing" || state === "generating") ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "hsl(280,60%,97%)", borderRadius: 10, padding: "12px 16px", border: "1px solid hsl(280,60%,88%)" }}>
          <Icon name="Loader2" size={16} style={{ color: "hsl(280,60%,52%)", animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 13, color: "hsl(280,60%,40%)", fontWeight: 600 }}>
            {state === "preparing" ? "Подготовка…" : "Генерирую изображение… ~30–60 сек"}
          </span>
        </div>
      ) : (
        <button onClick={generate}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "hsl(280,60%,97%)", border: "1.5px dashed hsl(280,60%,75%)", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 700, color: "hsl(280,60%,45%)", cursor: "pointer", fontFamily: "Montserrat,sans-serif", width: "100%" }}>
          <Icon name="ImagePlus" size={16} />
          Сгенерировать рекламное изображение 1024×1024 — 5 ⚡
        </button>
      )}
      {state === "error" && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#DC2626", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="AlertCircle" size={13} />
          {errMsg}
        </div>
      )}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#94A3B8" }}>
        <Icon name="Info" size={11} />
        Сгенерированные изображения сохраняются в истории инструмента <b style={{ color: "#64748B" }}>«Генерация изображений»</b>
      </div>
    </div>
  );
}

// ── Общие минус-слова кампании ────────────────────────────────────────────────
function CampaignMinusBlock({ minusWords }: { minusWords: string[] }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copy = () => {
    copyToClipboard(minusWords.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const preview = minusWords.slice(0, 12);
  const rest = minusWords.slice(12);

  return (
    <div style={{ marginTop: 24, background: "hsl(0,70%,97%)", border: "1.5px solid hsl(0,70%,85%)", borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "hsl(0,70%,92%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="MinusCircle" size={16} style={{ color: "hsl(0,70%,45%)" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Минус-слова кампании</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Объединены из всех групп · {minusWords.length} слов</div>
          </div>
        </div>
        <button
          onClick={copy}
          style={{ display: "flex", alignItems: "center", gap: 6, background: copied ? "hsl(0,70%,45%)" : "#fff", color: copied ? "#fff" : "hsl(0,70%,45%)", border: "1.5px solid hsl(0,70%,75%)", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
        >
          <Icon name={copied ? "Check" : "Copy"} size={13} />
          {copied ? "Скопировано!" : "Скопировать все"}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {(expanded ? minusWords : preview).map((w, i) => (
          <span key={i} style={{ fontSize: 11, color: "hsl(0,60%,38%)", background: "#fff", borderRadius: 5, padding: "3px 9px", border: "1px solid hsl(0,70%,88%)", fontWeight: 500 }}>
            −{w}
          </span>
        ))}
        {!expanded && rest.length > 0 && (
          <button
            onClick={() => setExpanded(true)}
            style={{ fontSize: 11, color: "#94A3B8", background: "#fff", border: "1px solid #E8ECF0", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
          >
            +{rest.length} ещё
          </button>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}>
        <Icon name="Info" size={11} />
        Вставьте в настройки кампании в Директе → «Минус-слова» — через запятую
      </div>
    </div>
  );
}

// ── Блок запросов и минус-слов ────────────────────────────────────────────────
function KeywordsBlock({ keywords, minusWords }: { keywords: string[]; minusWords: string[] }) {
  const [kwCopied, setKwCopied] = useState(false);
  const [minusCopied, setMinusCopied] = useState(false);

  const copyKw = () => {
    copyToClipboard(keywords.join("\n"));
    setKwCopied(true);
    setTimeout(() => setKwCopied(false), 2000);
  };

  const copyMinus = () => {
    copyToClipboard(minusWords.join(", "));
    setMinusCopied(true);
    setTimeout(() => setMinusCopied(false), 2000);
  };

  if (!keywords?.length && !minusWords?.length) return null;

  return (
    <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
      {keywords?.length > 0 && (
        <div style={{ background: "hsl(185,85%,97%)", border: "1px solid hsl(185,85%,82%)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="Search" size={13} style={{ color: ACCENT }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>Ключевые запросы</span>
            </div>
            <button
              onClick={copyKw}
              style={{ display: "flex", alignItems: "center", gap: 4, background: kwCopied ? ACCENT : "transparent", color: kwCopied ? "#fff" : ACCENT, border: `1px solid ${ACCENT}`, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name={kwCopied ? "Check" : "Copy"} size={11} />
              {kwCopied ? "Скопировано" : "Скопировать"}
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {keywords.map((kw, i) => (
              <div key={i} style={{ fontSize: 12, color: "#334155", background: "#fff", borderRadius: 6, padding: "5px 10px", border: "1px solid hsl(185,85%,88%)" }}>
                {kw}
              </div>
            ))}
          </div>
        </div>
      )}

      {minusWords?.length > 0 && (
        <div style={{ background: "hsl(0,75%,97%)", border: "1px solid hsl(0,75%,85%)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="MinusCircle" size={13} style={{ color: "hsl(0,70%,50%)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "hsl(0,70%,45%)" }}>Минус-слова</span>
            </div>
            <button
              onClick={copyMinus}
              style={{ display: "flex", alignItems: "center", gap: 4, background: minusCopied ? "hsl(0,70%,50%)" : "transparent", color: minusCopied ? "#fff" : "hsl(0,70%,45%)", border: "1px solid hsl(0,70%,75%)", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name={minusCopied ? "Check" : "Copy"} size={11} />
              {minusCopied ? "Скопировано" : "Скопировать"}
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {minusWords.map((w, i) => (
              <span key={i} style={{ fontSize: 11, color: "hsl(0,60%,40%)", background: "#fff", borderRadius: 5, padding: "3px 8px", border: "1px solid hsl(0,70%,88%)" }}>
                −{w}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "#94A3B8" }}>
            Формат для Директа: через запятую
          </div>
        </div>
      )}
    </div>
  );
}

// ── Группа объявлений ─────────────────────────────────────────────────────────
function AdGroupCard({ group, index, salonName, sourceKeywords }: { group: AdGroup; index: number; salonName: string; sourceKeywords: string[] }) {
  const [open, setOpen] = useState(index < 2);

  return (
    <div style={{ border: "1.5px solid #E8ECF0", borderRadius: 16, overflow: "hidden" }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: open ? "hsl(25,90%,97%)" : "#fff", borderBottom: open ? "1px solid #FFE4CC" : "none", transition: "background 0.15s" }}
      >
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "hsl(25,90%,93%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="MousePointerClick" size={16} style={{ color: DIRECT_COLOR }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{group.group}</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{group.ads.length} варианта объявления</div>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#94A3B8" }} />
      </div>

      {open && (
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
            {group.ads.map((ad, i) => (
              <AdPreview key={i} ad={ad} idx={i} salonName={salonName} />
            ))}
          </div>
          <KeywordsBlock
            keywords={group.keywords ?? []}
            minusWords={group.minus_words ?? []}
          />
          <ImageGenButton groupName={group.group} keywords={sourceKeywords} ads={group.ads} />
        </div>
      )}
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────────
interface Props {
  onBack: () => void;
  initialGroups?: KeywordGroup[];
}

export default function LkMarketingDirect({ onBack, initialGroups }: Props) {
  const { user } = useLkAuth();
  const sessionId = localStorage.getItem("lk_session") || "";
  const cacheKey = `mkt_direct_${CACHE_VERSION}_${user?.salon_id ?? ""}`;

  const loadCache = () => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw) as { ads: AdGroup[]; salonName: string };
    } catch { /* ignore */ }
    return null;
  };

  const cached = loadCache();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ads, setAds] = useState<AdGroup[] | null>(cached?.ads ?? null);
  const [salonName, setSalonName] = useState(cached?.salonName ?? "");
  const [autoStarted, setAutoStarted] = useState(false);

  const saveCache = (a: AdGroup[], name: string) => {
    try { localStorage.setItem(cacheKey, JSON.stringify({ ads: a, salonName: name })); } catch { /* ignore */ }
  };

  const resetCache = () => { localStorage.removeItem(cacheKey); setAds(null); };

  const generate = async (groups: KeywordGroup[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ groups }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setAds(data.ads);
      setSalonName(data.salon_name || "");
      saveCache(data.ads, data.salon_name || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  // Автозапуск если есть группы и нет кэша
  useEffect(() => {
    if (initialGroups && !autoStarted && !cached) {
      setAutoStarted(true);
      generate(initialGroups);
    }
  }, []);

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг · Директ · 1 ⚡
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>
          Объявления для Яндекс.Директ
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 12px", lineHeight: 1.6, maxWidth: 520 }}>
          Готовые объявления по требованиям Яндекса: заголовок 1 (≤35 симв.), заголовок 2 (≤30 симв.), текст (≤81 симв.).
        </p>
        <div style={{ padding: "12px 16px", background: "hsl(25,90%,97%)", borderRadius: 12, border: "1px solid hsl(25,90%,87%)", marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Как пользоваться и почему это выгодно</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
            Выберите услугу, укажите аудиторию — ИИ сразу напишет несколько вариантов объявлений, соответствующих техническим требованиям Яндекса.<br />
            Копирайтер или агентство берут за это деньги и время. Здесь вы получаете профессиональные тексты объявлений за минуту и можете сразу загружать их в рекламный кабинет.
          </div>
        </div>
      </div>

      {/* Загрузка */}
      {loading && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "48px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "hsl(25,90%,94%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Loader2" size={26} style={{ color: DIRECT_COLOR, animation: "spin 1s linear infinite" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Пишу объявления...</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>ИИ составляет тексты под каждую группу запросов</div>
          </div>
        </div>
      )}

      {/* Нет данных */}
      {!loading && !ads && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "hsl(25,90%,94%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="MousePointerClick" size={28} style={{ color: DIRECT_COLOR }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Нужно семантическое ядро</div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, maxWidth: 360 }}>
              Объявления создаются на основе групп из семантического ядра. Сначала перейдите в «Семантическое ядро» и вернитесь сюда через кнопку «Следующий шаг».
            </div>
          </div>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 400 }}>
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Результаты */}
      {!loading && ads && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#64748B" }}>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>{ads.length * 2} объявления</span> · {ads.length} групп · «{salonName}»
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {initialGroups && (
                <button
                  onClick={() => generate(initialGroups)}
                  style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1.5px solid ${DIRECT_COLOR}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: DIRECT_COLOR, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
                >
                  <Icon name="RefreshCw" size={13} />
                  Создать заново
                </button>
              )}
              <button
                onClick={resetCache}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #E8ECF0", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, color: "#94A3B8", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="Trash2" size={13} />
                Сбросить
              </button>
            </div>
          </div>

          {/* Легенда символов */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              { dot: "hsl(145,60%,45%)", label: "Норма" },
              { dot: "hsl(40,80%,50%)",  label: "Близко к лимиту" },
              { dot: "#DC2626",           label: "Превышен лимит" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.dot }} />
                <span style={{ fontSize: 11, color: "#64748B" }}>{l.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ads.map((group, i) => {
              const srcGroup = initialGroups?.find(g => g.group === group.group || g.service_tag === group.service_tag);
              const srcKeywords = srcGroup?.keywords.map(k => k.query) ?? [];
              return <AdGroupCard key={i} group={group} index={i} salonName={salonName} sourceKeywords={srcKeywords} />;
            })}
          </div>

          {/* Общие минус-слова кампании */}
          {(() => {
            const allMinus = Array.from(new Set(ads.flatMap(g => g.minus_words ?? [])));
            if (!allMinus.length) return null;
            return <CampaignMinusBlock minusWords={allMinus} />;
          })()}

          {/* Итоговая плашка */}
          <div style={{ marginTop: 16, background: "#F8FAFC", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #E8ECF0" }}>
            <Icon name="CheckCircle" size={20} style={{ color: "hsl(145,60%,38%)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>Готово к загрузке в Яндекс.Директ</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>Скопируйте тексты в интерфейс Директа или выгрузите через Excel-шаблон вручную.</div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}