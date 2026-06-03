import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const API_URL = "https://functions.poehali.dev/00357dca-9825-4cc7-9c1c-eb32b635afc4";

interface Keyword {
  query: string;
  frequency: "high" | "medium" | "low";
  frequency_label: string;
  intent: string;
}

interface KeywordGroup {
  group: string;
  service_tag: string;
  keywords: Keyword[];
}

const FREQ_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  high:   { bg: "hsl(0,80%,95%)",   color: "hsl(0,70%,45%)",   dot: "hsl(0,70%,55%)" },
  medium: { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,38%)",  dot: "hsl(40,80%,50%)" },
  low:    { bg: "hsl(145,55%,93%)", color: "hsl(145,60%,35%)", dot: "hsl(145,60%,45%)" },
};

// ── Строка запроса ────────────────────────────────────────────────────────────

function KeywordRow({ kw, copied, onCopy }: { kw: Keyword; copied: boolean; onCopy: () => void }) {
  const fs = FREQ_STYLE[kw.frequency] || FREQ_STYLE.medium;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, background: "#FAFAFA", border: "1px solid #F1F5F9", transition: "background 0.12s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#F0F9FF")}
      onMouseLeave={e => (e.currentTarget.style.background = "#FAFAFA")}
    >
      {/* Частотность */}
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: fs.dot, flexShrink: 0 }} />

      {/* Запрос */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", lineHeight: 1.3 }}>{kw.query}</div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{kw.intent}</div>
      </div>

      {/* Тег частотности */}
      <div style={{ fontSize: 10, fontWeight: 700, background: fs.bg, color: fs.color, borderRadius: 5, padding: "2px 7px", whiteSpace: "nowrap", flexShrink: 0 }}>
        {kw.frequency_label}
      </div>

      {/* Копировать */}
      <button
        onClick={onCopy}
        title="Копировать запрос"
        style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "hsl(145,60%,38%)" : "#CBD5E1", padding: 0, display: "flex", flexShrink: 0 }}
      >
        <Icon name={copied ? "Check" : "Copy"} size={14} />
      </button>
    </div>
  );
}

// ── Группа запросов ───────────────────────────────────────────────────────────

function KeywordGroupCard({ group, index }: { group: KeywordGroup; index: number }) {
  const [open, setOpen] = useState(index < 2);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const handleCopyAll = () => {
    const text = group.keywords.map(k => k.query).join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const highCount = group.keywords.filter(k => k.frequency === "high").length;
  const medCount  = group.keywords.filter(k => k.frequency === "medium").length;
  const lowCount  = group.keywords.filter(k => k.frequency === "low").length;

  return (
    <div style={{ border: "1.5px solid #E8ECF0", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
      {/* Шапка группы */}
      <div
        onClick={() => setOpen(p => !p)}
        style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: open ? "hsl(185,85%,98%)" : "#fff", borderBottom: open ? "1px solid #E8ECF0" : "none", transition: "background 0.15s" }}
      >
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "hsl(185,85%,92%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="Tag" size={16} style={{ color: ACCENT }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{group.group}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {highCount > 0   && <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(0,70%,45%)",   background: "hsl(0,80%,95%)",   borderRadius: 4, padding: "1px 6px" }}>ВЧ: {highCount}</span>}
            {medCount  > 0   && <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(40,70%,38%)",  background: "hsl(40,90%,93%)",  borderRadius: 4, padding: "1px 6px" }}>СЧ: {medCount}</span>}
            {lowCount  > 0   && <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(145,60%,35%)", background: "hsl(145,55%,93%)", borderRadius: 4, padding: "1px 6px" }}>НЧ: {lowCount}</span>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {open && (
            <button
              onClick={e => { e.stopPropagation(); handleCopyAll(); }}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px solid #E8ECF0", borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600, color: allCopied ? "hsl(145,60%,38%)" : "#64748B", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name={allCopied ? "Check" : "Copy"} size={11} />
              {allCopied ? "Скопировано" : "Все запросы"}
            </button>
          )}
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#94A3B8" }} />
        </div>
      </div>

      {/* Запросы */}
      {open && (
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          {group.keywords.map((kw, i) => (
            <KeywordRow
              key={i}
              kw={kw}
              copied={copiedIdx === i}
              onCopy={() => handleCopy(i, kw.query)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

export default function LkMarketingSemantics({ onBack }: Props) {
  const sessionId = localStorage.getItem("lk_session") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<KeywordGroup[] | null>(null);
  const [salonName, setSalonName] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [copiedAll, setCopiedAll] = useState(false);

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
      setGroups(data.groups);
      setSalonName(data.salon_name || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  // Автозапуск при открытии
  useEffect(() => { generate(); }, []);

  const allKeywords = groups?.flatMap(g => g.keywords) ?? [];
  const filteredGroups = filter === "all"
    ? (groups ?? [])
    : (groups ?? []).map(g => ({ ...g, keywords: g.keywords.filter(k => k.frequency === filter) })).filter(g => g.keywords.length > 0);

  const handleCopyAll = () => {
    const text = (groups ?? []).flatMap(g => g.keywords.map(k => k.query)).join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div>
      {/* Навигация */}
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг · Семантика · Бесплатно
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>
          Семантическое ядро
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
          Поисковые запросы для Яндекс.Директ, сгруппированные по услугам и частотности. Готовы для загрузки в кампанию.
        </p>
      </div>

      {/* Загрузка */}
      {loading && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "48px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "hsl(145,55%,93%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Loader2" size={26} style={{ color: "hsl(145,60%,38%)", animation: "spin 1s linear infinite" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Собираю семантическое ядро...</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>ИИ подбирает поисковые запросы под ваши услуги</div>
          </div>
        </div>
      )}

      {/* Ошибка */}
      {error && !loading && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Icon name="AlertCircle" size={16} style={{ color: "#DC2626", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "#DC2626" }}>{error}</span>
          <button onClick={generate} style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: ACCENT, background: "none", border: `1px solid ${ACCENT}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Повторить
          </button>
        </div>
      )}

      {/* Результаты */}
      {groups && !loading && (
        <div>
          {/* Панель управления */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 13, color: "#64748B" }}>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>{allKeywords.length} запросов</span> · {groups.length} групп · «{salonName}»
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={handleCopyAll}
                style={{ display: "flex", alignItems: "center", gap: 5, background: copiedAll ? "hsl(145,60%,38%)" : ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name={copiedAll ? "Check" : "Copy"} size={13} />
                {copiedAll ? "Скопировано!" : "Скопировать всё"}
              </button>
              <button
                onClick={generate}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid #E8ECF0", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, color: "#64748B", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="RefreshCw" size={13} />
                Обновить
              </button>
            </div>
          </div>

          {/* Фильтр по частотности */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { key: "all",    label: "Все запросы",         count: allKeywords.length },
              { key: "high",   label: "Высокочастотные",     count: allKeywords.filter(k => k.frequency === "high").length },
              { key: "medium", label: "Среднечастотные",     count: allKeywords.filter(k => k.frequency === "medium").length },
              { key: "low",    label: "Низкочастотные",      count: allKeywords.filter(k => k.frequency === "low").length },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: filter === f.key ? 700 : 500, background: filter === f.key ? ACCENT : "#fff", color: filter === f.key ? "#fff" : "#475569", border: `1.5px solid ${filter === f.key ? ACCENT : "#E8ECF0"}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "all 0.15s" }}
              >
                {f.label}
                <span style={{ fontSize: 10, fontWeight: 700, background: filter === f.key ? "rgba(255,255,255,0.25)" : "#F1F5F9", color: filter === f.key ? "#fff" : "#64748B", borderRadius: 4, padding: "1px 5px" }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Список групп */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredGroups.map((group, i) => (
              <KeywordGroupCard key={i} group={group} index={i} />
            ))}
          </div>

          {/* Легенда */}
          <div style={{ marginTop: 20, background: "#F8FAFC", borderRadius: 12, padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginRight: 4, alignSelf: "center" }}>Частотность:</div>
            {[
              { color: "hsl(0,70%,55%)", label: "ВЧ — широкий охват, высокая цена клика" },
              { color: "hsl(40,80%,50%)", label: "СЧ — баланс охвата и стоимости" },
              { color: "hsl(145,60%,45%)", label: "НЧ — точное попадание, низкая цена" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#64748B" }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Следующий шаг */}
          <div style={{ marginTop: 20, background: "linear-gradient(135deg,hsl(25,90%,50%),hsl(25,90%,38%))", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <Icon name="MousePointerClick" size={22} style={{ color: "#fff", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Следующий шаг</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>Скопируйте запросы и загрузите их в Яндекс.Директ. Инструмент создания объявлений появится в следующем обновлении.</div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
