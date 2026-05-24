import { useRef } from "react";
import Icon from "@/components/ui/icon";
import { backBtn } from "./LkTestsTypes";
import { COLOR, Symptom } from "./DiagnosticTypes";

interface Props {
  onBack: () => void;
  query: string;
  setQuery: (q: string) => void;
  filtered: Symptom[];
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
  symptoms: Symptom[];
  loading: boolean;
  notFound: boolean;
  onSearch: () => void;
  onSelect: (s: Symptom) => void;
}

export default function DiagnosticSearch({
  onBack, query, setQuery, filtered, showDropdown, setShowDropdown,
  symptoms, loading, notFound, onSearch, onSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <button onClick={onBack} style={backBtn}>
        <Icon name="ArrowLeft" size={16} /> Назад
      </button>

      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
        Системная диагностика
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px", lineHeight: 1.6 }}>
        Введите жалобу клиента или выберите из списка — система покажет возможные причины, компенсаторные зоны и техники из шпаргалки
      </p>

      {/* Поле ввода */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Icon name="Search" size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") onSearch(); if (e.key === "Escape") setShowDropdown(false); }}
              onFocus={() => { if (filtered.length > 0) setShowDropdown(true); }}
              placeholder="Боль в шее, поясница, тревога..."
              style={{
                width: "100%", padding: "13px 16px 13px 42px",
                borderRadius: 12, border: "1.5px solid #e8e8e4",
                fontSize: 14, fontFamily: "Montserrat, sans-serif",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={onSearch}
            disabled={loading || !query.trim()}
            style={{
              padding: "13px 22px", borderRadius: 12, border: "none",
              background: query.trim() ? COLOR : "#e8e8e4",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: query.trim() ? "pointer" : "default",
              fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
          >
            {loading ? "..." : "Найти"}
          </button>
        </div>

        {/* Дропдаун */}
        {showDropdown && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 60,
            background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1.5px solid #f0f0ec", zIndex: 50, overflow: "hidden", marginTop: 4,
          }}>
            {filtered.map(s => (
              <button
                key={s.slug}
                onClick={() => onSelect(s)}
                style={{
                  width: "100%", padding: "11px 16px", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, fontFamily: "Montserrat, sans-serif", color: "#333",
                  borderBottom: "1px solid #f5f5f0", display: "flex", alignItems: "center", gap: 10,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f8f5")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <Icon name="Activity" size={13} style={{ color: COLOR, flexShrink: 0 }} />
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Быстрый выбор из списка */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#aaa", marginBottom: 10 }}>Частые жалобы:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {symptoms.map(s => (
            <button
              key={s.slug}
              onClick={() => onSelect(s)}
              style={{
                padding: "7px 14px", borderRadius: 20, border: "1.5px solid #e8e8e4",
                background: "#fafaf8", fontSize: 12, fontWeight: 600,
                color: "#555", cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = COLOR; (e.currentTarget as HTMLElement).style.color = COLOR; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e4"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: COLOR, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {notFound && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <Icon name="SearchX" size={36} style={{ color: "#ddd", marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: "#555", marginBottom: 6 }}>Жалоба не распознана</div>
          <div style={{ fontSize: 13, color: "#aaa" }}>Попробуйте выбрать из списка частых жалоб выше</div>
        </div>
      )}

      {/* Описание инструмента */}
      {!loading && !notFound && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { icon: "Search", label: "Возможные причины" },
            { icon: "GitBranch", label: "Компенсаторные зоны" },
            { icon: "Eye", label: "Что проверить визуально" },
            { icon: "Hand", label: "Что проверить руками" },
            { icon: "Heart", label: "Эмоциональные факторы" },
            { icon: "AlertTriangle", label: "Красные флаги" },
            { icon: "ClipboardCheck", label: "Рекомендации" },
            { icon: "BookOpen", label: "Техники из шпаргалки" },
          ].map(item => (
            <div key={item.icon} style={{
              background: "#fff", borderRadius: 12, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 10,
              border: "1.5px solid #f0f0ec",
            }}>
              <Icon name={item.icon} size={14} style={{ color: COLOR, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#666" }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
