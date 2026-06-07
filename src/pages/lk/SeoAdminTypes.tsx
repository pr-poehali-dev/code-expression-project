import { useState } from "react";
import Icon from "@/components/ui/icon";

// ── Типы ──────────────────────────────────────────────────────────────────────

export interface MetaField { status: "good" | "warn" | "bad"; issue: string; suggestion?: string; }
export interface Report {
  score: number;
  grade: string;
  summary: string;
  critical: { issue: string; impact: string; fix: string; example: string }[];
  improvements: { area: string; current: string; better: string; example: string; priority: string }[];
  meta_audit: { title: MetaField; description: MetaField; h1: MetaField; canonical: MetaField; og: MetaField; twitter?: MetaField; keywords?: MetaField; robots?: MetaField };
  content_audit: { word_count_status: string; word_count_comment: string; readability: string; keywords_density: string; cta_present: boolean; cta_comment: string; uniqueness_risk: string };
  technical_audit: { mobile: { status: string; comment: string }; schema: { status: string; comment: string; recommended: string; schema_jsonld?: string }; images: { status: string; comment: string }; links: { status: string; comment: string } };
  keyword_suggestions?: { primary: string[]; secondary: string[]; long_tail: string[]; comment: string };
  quick_wins: string[];
  growth_opportunities: string[];
}
export interface PageData {
  title: string; title_len: number; description: string; desc_len: number; keywords: string; robots: string;
  canonical: string; og_title: string; og_description: string; og_image: string; og_type: string; og_url: string;
  twitter_card: string; twitter_title: string; twitter_description: string;
  headings: Record<string, string[]>; word_count: number; internal_links: number; external_links: number;
  images_count: number; images_no_alt: number; images_lazy: number; schema_types: string[]; schema_raw: string;
  has_viewport: boolean; has_charset: boolean;
  http_status?: number; load_time_ms?: number; page_size_kb?: number; robots_exists?: boolean; sitemap_url?: string;
}
export interface AnalysisResult { url: string; page_data: PageData; report: Report; score: number; grade: string; }
export interface HistoryItem { url: string; score: number; grade: string; ts: number; result: AnalysisResult; }

// ── Константы ─────────────────────────────────────────────────────────────────

export const ADMIN_SEO_URL = "https://functions.poehali.dev/ab6ca380-8b84-4708-b715-cb3771fd07d9";
export const ADMIN_TOKEN = "Sss07011974ssS";

export const STATUS_MAP = {
  good: { icon: "CheckCircle2", color: "#16a34a", bg: "#f0fdf4", label: "OK" },
  warn: { icon: "AlertTriangle", color: "#d97706", bg: "#fffbeb", label: "Улучшить" },
  bad:  { icon: "XCircle",       color: "#dc2626", bg: "#fef2f2", label: "Ошибка" },
};

// ── Примитивы ─────────────────────────────────────────────────────────────────

export function StatusChip({ status }: { status: string }) {
  const m = STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.warn;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: m.bg, borderRadius: 20, fontSize: 11, fontWeight: 700, color: m.color, flexShrink: 0 }}>
      <Icon name={m.icon} size={11} />{m.label}
    </span>
  );
}

export function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 7, border: "1px solid #E2E8F0", background: done ? "#f0fdf4" : "#fff", color: done ? "#16a34a" : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
      <Icon name={done ? "Check" : "Copy"} size={11} />
      {done ? "Скопировано" : "Копировать"}
    </button>
  );
}

export function SuggestionBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.5 }}>Готовый вариант</span>
        <CopyBtn text={text} />
      </div>
      <div style={{ fontSize: 12, color: "#166534", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

export function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const color = score >= 70 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  const bg = score >= 70 ? "#f0fdf4" : score >= 50 ? "#fffbeb" : "#fef2f2";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "14px 20px", background: bg, borderRadius: 14, border: `2px solid ${color}22`, flexShrink: 0 }}>
      <div style={{ fontSize: 38, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{grade}</div>
      <div style={{ fontSize: 10, color: "#94A3B8" }}>из 100</div>
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8ECF0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

export function CardHeader({ color, icon, title, count }: { color: string; bg?: string; icon: string; title: string; count?: number }) {
  return (
    <div style={{ padding: "12px 18px", background: `${color}12`, borderBottom: `1px solid ${color}30`, display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name={icon} size={15} style={{ color }} />
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{title}{count != null ? ` · ${count}` : ""}</span>
    </div>
  );
}