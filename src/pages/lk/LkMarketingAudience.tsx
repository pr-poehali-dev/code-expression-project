import { useState } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const API_URL = "https://functions.poehali.dev/d0fa3230-e537-441c-b7eb-ef239f7377e4";

interface Portrait {
  archetype: string;
  age_range: string;
  occupation: string;
  income: string;
  pains: string[];
  motivations: string[];
  services_interest: string[];
  channels: string[];
  hook: string;
}

const CARD_COLORS = [
  { bg: "hsl(220,80%,95%)", accent: "hsl(220,80%,50%)", light: "hsl(220,80%,97%)" },
  { bg: "hsl(280,60%,95%)", accent: "hsl(280,60%,52%)", light: "hsl(280,60%,97%)" },
  { bg: "hsl(145,55%,93%)", accent: "hsl(145,60%,38%)", light: "hsl(145,60%,97%)" },
];

function PortraitCard({ portrait, index }: { portrait: Portrait; index: number }) {
  const [open, setOpen] = useState(false);
  const col = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div style={{ background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 8px rgba(15,23,42,0.06)" }}>
      {/* Шапка */}
      <div style={{ background: col.bg, padding: "20px 22px 18px", borderBottom: "1px solid #E8ECF0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: col.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="User" size={20} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: col.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                Сегмент {index + 1}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>{portrait.archetype}</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(p => !p)}
            style={{ background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: col.accent, display: "flex", alignItems: "center", gap: 5, fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
          >
            {open ? "Свернуть" : "Подробнее"}
            <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} />
          </button>
        </div>

        {/* Краткие теги */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
          {[portrait.age_range, portrait.occupation, portrait.income].map((t, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600, background: "rgba(255,255,255,0.75)", color: "#334155", borderRadius: 6, padding: "3px 9px" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Hook — ключевое послание */}
      <div style={{ padding: "14px 22px", background: col.light, borderBottom: "1px solid #E8ECF0", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Icon name="Lightbulb" size={16} style={{ color: col.accent, flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, fontStyle: "italic" }}>«{portrait.hook}»</div>
      </div>

      {/* Раскрытая часть */}
      {open && (
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Боли */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Боли и потребности</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {portrait.pains.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(0,70%,60%)", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Мотивации */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Мотивации</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {portrait.motivations.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(145,60%,45%)", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Услуги */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Интересные услуги</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {portrait.services_interest.map((s, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, background: col.bg, color: col.accent, borderRadius: 6, padding: "4px 10px" }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Каналы */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Где искать</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {portrait.channels.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, background: "#F1F5F9", color: "#475569", borderRadius: 6, padding: "4px 10px" }}>
                  <Icon name="MapPin" size={11} />
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  onBack: () => void;
  onPortraitsReady?: (portraits: Portrait[], salonName: string) => void;
  onGoToOffers?: (portraits: Portrait[], salonName: string) => void;
}

export default function LkMarketingAudience({ onBack, onPortraitsReady, onGoToOffers }: Props) {
  const { user } = useLkAuth();
  const sessionId = localStorage.getItem("lk_session") || "";
  const cacheKey = `mkt_audience_${user?.salon_id ?? ""}`;

  const loadCache = () => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw) as { portraits: Portrait[]; salonName: string };
    } catch { /* ignore */ }
    return null;
  };

  const cached = loadCache();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portraits, setPortraits] = useState<Portrait[] | null>(cached?.portraits ?? null);
  const [salonName, setSalonName] = useState(cached?.salonName ?? "");

  const saveCache = (p: Portrait[], name: string) => {
    try { localStorage.setItem(cacheKey, JSON.stringify({ portraits: p, salonName: name })); } catch { /* ignore */ }
  };

  const resetCache = () => {
    localStorage.removeItem(cacheKey);
    setPortraits(null);
    setSalonName("");
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setPortraits(data.portraits);
      setSalonName(data.salon_name || "");
      saveCache(data.portraits, data.salon_name || "");
      if (onPortraitsReady) onPortraitsReady(data.portraits, data.salon_name || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Навигация */}
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      {/* Заголовок */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг · ЦА · Бесплатно
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>
          Портрет целевой аудитории
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
          ИИ проанализирует профиль и услуги вашего салона и создаст 3 детальных портрета клиентов с болями, мотивацией и каналами охвата.
        </p>
      </div>

      {/* Кнопка генерации */}
      {!portraits && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "28px 28px", marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "hsl(220,80%,95%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Users" size={28} style={{ color: "hsl(220,80%,50%)" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Готовы к анализу</div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, maxWidth: 360 }}>
              Нажмите кнопку — ИИ изучит данные вашего салона и за несколько секунд составит портреты вашей аудитории.
            </div>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 8, background: loading ? "#94A3B8" : ACCENT, color: "#fff", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", transition: "background 0.15s" }}
          >
            {loading
              ? <><Icon name="Loader2" size={16} style={{ animation: "spin 1s linear infinite" }} />Анализирую салон...</>
              : <><Icon name="Sparkles" size={16} />Создать портреты ЦА</>
            }
          </button>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 400 }}>
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Результаты */}
      {portraits && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#64748B" }}>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>3 портрета ЦА</span> для «{salonName}»
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={generate}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1.5px solid ${ACCENT}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: ACCENT, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                {loading
                  ? <><Icon name="Loader2" size={13} style={{ animation: "spin 1s linear infinite" }} />Обновляю...</>
                  : <><Icon name="RefreshCw" size={13} />Сгенерировать заново</>
                }
              </button>
              <button
                onClick={resetCache}
                title="Сбросить сохранённый результат"
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #E8ECF0", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, color: "#94A3B8", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="Trash2" size={13} />
                Сбросить
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {portraits.map((p, i) => (
              <PortraitCard key={i} portrait={p} index={i} />
            ))}
          </div>

          {/* Следующий шаг */}
          <div
            onClick={() => onGoToOffers && portraits && onGoToOffers(portraits, salonName)}
            style={{ marginTop: 24, background: "linear-gradient(135deg,hsl(220,80%,50%),hsl(220,80%,38%))", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: onGoToOffers ? "pointer" : "default", transition: "opacity 0.15s" }}
            onMouseEnter={e => { if (onGoToOffers) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Следующий шаг</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Перейдите в «Офферы под ЦА» — ИИ составит предложения для каждого из этих сегментов.</div>
            </div>
            {onGoToOffers && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.2)", borderRadius: 9, padding: "8px 14px", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>Создать офферы</span>
                <Icon name="ArrowRight" size={14} style={{ color: "#fff" }} />
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}