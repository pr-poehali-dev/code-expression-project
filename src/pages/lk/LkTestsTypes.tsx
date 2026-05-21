import React from "react";

export const ACCENT = "hsl(185,85%,32%)";

export const TOOL_COLORS: Record<string, { color: string; bg: string }> = {
  mindset:  { color: "hsl(280,60%,55%)", bg: "hsl(280,60%,96%)" },
  barriers: { color: "hsl(20,85%,52%)",  bg: "hsl(20,85%,96%)"  },
  finance:  { color: "hsl(145,60%,40%)", bg: "hsl(145,60%,95%)" },
};

export interface Test {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  score?: number;
}

export interface Option {
  id: number;
  text: string;
  score: number;
  sort_order: number;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface TestDetail {
  test: Test & { id: number };
  questions: Question[];
}

export interface TestResult {
  title: string;
  description: string;
  advice: string;
  score_min: number;
  score_max: number;
}

export interface MindsetHistoryItem {
  id: number;
  igp: number;
  iu: number; ipm: number; ido: number; ipg: number; ics: number; isd: number; izk: number;
  type_title: string;
  completed_at: string;
}

export interface BarriersHistoryItem {
  id: number;
  iib: number;
  ivo: number; iss: number; isd: number; ido: number; iir: number; iei: number; isp: number;
  type_title: string;
  completed_at: string;
}

export interface FinanceHistoryItem {
  id: number;
  ifr: number;
  ifj: number; ifu: number; ipn: number; idm: number; ifp: number;
  jlj: number; fr: number; mpd: number; nsc: number; nck: number;
  data: object;
  completed_at: string;
}

export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 32, height: 32, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export const backBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8, background: "none",
  border: "none", color: "#888", fontSize: 14, cursor: "pointer",
  padding: "8px 0", fontFamily: "Montserrat, sans-serif",
};