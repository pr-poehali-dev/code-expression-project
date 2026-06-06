import { useState } from "react";
import Icon from "@/components/ui/icon";
import { labelStyle } from "./SeoTypes";

export function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const bg = score >= 70 ? "#f0fdf4" : score >= 40 ? "#fffbeb" : "#fef2f2";
  const label = score >= 70 ? "Хорошо" : score >= 40 ? "Средне" : "Плохо";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "16px 24px", background: bg, borderRadius: 16, border: `2px solid ${color}22`, flexShrink: 0 }}>
      <div style={{ fontSize: 40, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 10, color: "#94A3B8" }}>из 100</div>
    </div>
  );
}

export function StatusChip({ status }: { status: "good" | "warn" | "bad" }) {
  const map = {
    good: { icon: "CheckCircle2", color: "#16a34a", bg: "#f0fdf4", label: "OK" },
    warn: { icon: "AlertTriangle", color: "#d97706", bg: "#fffbeb", label: "Улучшить" },
    bad:  { icon: "XCircle",       color: "#dc2626", bg: "#fef2f2", label: "Ошибка" },
  };
  const m = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: m.bg, borderRadius: 20, fontSize: 11, fontWeight: 700, color: m.color, flexShrink: 0 }}>
      <Icon name={m.icon} size={11} />
      {m.label}
    </span>
  );
}

export function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 7, border: "1px solid #E2E8F0", background: done ? "#f0fdf4" : "#fff", color: done ? "#16a34a" : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "all 0.15s", flexShrink: 0 }}
    >
      <Icon name={done ? "Check" : "Copy"} size={11} />
      {done ? "Скопировано" : "Копировать"}
    </button>
  );
}

export function SuggestionBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ ...labelStyle, color: "#16a34a" }}>Готовый вариант</span>
        <CopyBtn text={text} />
      </div>
      <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}
