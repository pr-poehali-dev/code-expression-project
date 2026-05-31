import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, AuditResult, AuditSection } from "./salon-audit.types";

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 7 ? "hsl(145,60%,40%)" : score >= 4 ? "hsl(40,90%,50%)" : "hsl(0,75%,55%)";
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}/10</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#f0f0ec" }}>
        <div style={{ height: "100%", width: `${score * 10}%`, borderRadius: 3, background: color, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function SectionCard({ title, icon, section }: { title: string; icon: string; section: AuditSection }) {
  const [open, setOpen] = useState(false);
  const color = section.score >= 7 ? "hsl(145,60%,40%)" : section.score >= 4 ? "hsl(40,90%,50%)" : "hsl(0,75%,55%)";
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden" }}>
      <div onClick={() => setOpen(p => !p)} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={18} style={{ color }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{title}</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color, marginRight: 8 }}>{section.score}/10</div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#bbb" }} />
      </div>
      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: "1px solid #f5f5f2" }}>
          {section.strengths?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(145,60%,40%)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Сильные стороны</div>
              {section.strengths.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#555", lineHeight: 1.7, paddingLeft: 12, borderLeft: "2px solid hsl(145,60%,40%)", marginBottom: 4 }}>{s}</div>)}
            </div>
          )}
          {section.weaknesses?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(40,90%,50%)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Слабые стороны</div>
              {section.weaknesses.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#555", lineHeight: 1.7, paddingLeft: 12, borderLeft: "2px solid hsl(40,90%,50%)", marginBottom: 4 }}>{s}</div>)}
            </div>
          )}
          {section.risks?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(0,75%,55%)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Риски</div>
              {section.risks.map((s, i) => <div key={i} style={{ fontSize: 12, color: "#555", lineHeight: 1.7, paddingLeft: 12, borderLeft: "2px solid hsl(0,75%,55%)", marginBottom: 4 }}>{s}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  result: AuditResult;
  onReset: () => void;
}

export default function SalonAuditResult({ result, onReset }: Props) {
  const score = result.score_total;
  const scoreLabel = score >= 70 ? "Хороший уровень" : score >= 40 ? "Есть над чем работать" : "Требует внимания";

  const SECTION_META = [
    { key: "clients",    label: "Клиенты",    icon: "Users" },
    { key: "marketing",  label: "Маркетинг",  icon: "Megaphone" },
    { key: "sales",      label: "Продажи",    icon: "ShoppingBag" },
    { key: "staff",      label: "Персонал",   icon: "GraduationCap" },
    { key: "management", label: "Управление", icon: "BarChart2" },
  ] as const;

  return (
    <div style={{ maxWidth: 760 }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }`}</style>

      {/* Шапка */}
      <div style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, borderRadius: 20, padding: "28px 28px 24px", marginBottom: 20, color: "#fff", animation: "fadeIn 0.4s ease" }}>
        <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Цифровой бизнес-разбор</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "clamp(48px,8vw,72px)", fontWeight: 800, lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>из 100 баллов</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{scoreLabel}</div>
            <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>{result.revenue_potential}</div>
          </div>
        </div>
      </div>

      {/* Заключение консультанта */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Заключение консультанта</div>
        {result.consultant_summary.split("\n").map((p, i) => p.trim() && (
          <p key={i} style={{ fontSize: 14, color: "#333", lineHeight: 1.8, margin: "0 0 12px" }}>{p}</p>
        ))}
      </div>

      {/* Оценки */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Оценки по направлениям</div>
        <ScoreBar label="Клиенты" score={result.scores.clients} />
        <ScoreBar label="Маркетинг" score={result.scores.marketing} />
        <ScoreBar label="Продажи" score={result.scores.sales} />
        <ScoreBar label="Персонал" score={result.scores.staff} />
        <ScoreBar label="Управление" score={result.scores.management} />
      </div>

      {/* Детали по секциям */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {SECTION_META.map(m => (
          <SectionCard key={m.key} title={m.label} icon={m.icon} section={result.sections[m.key]} />
        ))}
      </div>

      {/* Проблемы и точки роста */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "18px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "hsl(0,75%,55%)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>Основные проблемы</div>
          {result.main_problems?.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "hsl(0,75%,95%)", color: "hsl(0,75%,55%)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{p}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "18px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "hsl(145,60%,40%)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>Точки роста</div>
          {result.growth_points?.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <Icon name="TrendingUp" size={14} style={{ color: "hsl(145,60%,40%)", marginTop: 2, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* План действий */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>План действий</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
          {[
            { label: "7 дней",  items: result.plan?.week_1,  color: "hsl(0,75%,55%)",  bg: "hsl(0,75%,97%)" },
            { label: "30 дней", items: result.plan?.month_1, color: "hsl(40,90%,50%)", bg: "hsl(40,90%,97%)" },
            { label: "90 дней", items: result.plan?.month_3, color: ACCENT,             bg: "hsl(185,85%,97%)" },
          ].map(({ label, items, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 10 }}>{label}</div>
              {items?.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <Icon name="CheckCircle" size={13} style={{ color, marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}>{item}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Рекомендованные продукты */}
      {result.recommended_products?.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Рекомендованные курсы</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.recommended_products.map((p, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: `hsla(185,85%,32%,0.05)`, border: `1px solid hsla(185,85%,32%,0.12)` }}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 3 }}>Проблема: {p.problem}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>{p.course}</div>
                <div style={{ fontSize: 12, color: "#777" }}>{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onReset} style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="RotateCcw" size={14} />
        Пройти новый аудит
      </button>
    </div>
  );
}
