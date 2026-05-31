import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
const AUDIT_URL = "https://functions.poehali.dev/6847fc61-df71-410b-af64-e213c52e7316";

function sid() { return localStorage.getItem("lk_session") || ""; }
async function lkPost(action: string, body: object) {
  const r = await fetch(`${LK_URL}?action=${action}`, { method: "POST", headers: { "Content-Type": "application/json", "X-Session-Id": sid() }, body: JSON.stringify(body) });
  return r.json();
}

// ── Типы ─────────────────────────────────────────────────────────────────────
interface Answers { [key: string]: string | boolean | number; }

interface AuditSection { score: number; strengths: string[]; weaknesses: string[]; risks: string[]; }
interface AuditResult {
  consultant_summary: string;
  score_total: number;
  scores: { clients: number; marketing: number; sales: number; staff: number; management: number; };
  sections: { clients: AuditSection; marketing: AuditSection; sales: AuditSection; staff: AuditSection; management: AuditSection; };
  main_problems: string[];
  growth_points: string[];
  revenue_potential: string;
  plan: { week_1: string[]; month_1: string[]; month_3: string[]; };
  recommended_products: { problem: string; course: string; description: string; }[];
}

interface HistoryItem { id: number; score_total: number; created_at: string; }

// ── Вопросы анкеты ────────────────────────────────────────────────────────────
const BLOCKS = [
  {
    id: "general", title: "Общая информация", icon: "Building2",
    fields: [
      { key: "salon_name",    label: "Название салона",       type: "text",   placeholder: "Студия «Аура»" },
      { key: "city",          label: "Город",                 type: "text",   placeholder: "Москва" },
      { key: "age_years",     label: "Сколько лет работаете", type: "number", placeholder: "3" },
      { key: "staff_count",   label: "Количество сотрудников",type: "number", placeholder: "5" },
      { key: "rooms_count",   label: "Количество кабинетов",  type: "number", placeholder: "3" },
      { key: "main_services", label: "Основные услуги",       type: "text",   placeholder: "Маникюр, массаж, косметология" },
    ]
  },
  {
    id: "finance", title: "Финансы", icon: "TrendingUp",
    fields: [
      { key: "monthly_revenue", label: "Выручка в месяц (₽)",    type: "number", placeholder: "500000" },
      { key: "monthly_profit",  label: "Чистая прибыль (₽)",     type: "number", placeholder: "120000" },
      { key: "avg_check",       label: "Средний чек (₽)",         type: "number", placeholder: "3500" },
      { key: "clients_per_month",label:"Клиентов в месяц",        type: "number", placeholder: "120" },
    ]
  },
  {
    id: "clients", title: "Клиенты", icon: "Users",
    fields: [
      { key: "new_clients_pct",      label: "Новых клиентов (%)",      type: "number",  placeholder: "30" },
      { key: "returning_clients_pct",label: "Постоянных клиентов (%)", type: "number",  placeholder: "70" },
      { key: "has_loyalty",          label: "Есть программа лояльности",type: "boolean", placeholder: "" },
      { key: "has_rebooking",        label: "Есть повторная запись",    type: "boolean", placeholder: "" },
      { key: "has_client_base",      label: "Ведётся база клиентов",    type: "boolean", placeholder: "" },
    ]
  },
  {
    id: "marketing", title: "Маркетинг", icon: "Megaphone",
    fields: [
      { key: "ad_channels",  label: "Рекламные каналы",          type: "text",    placeholder: "Instagram, сарафан, Яндекс" },
      { key: "has_social",   label: "Есть соцсети",              type: "boolean", placeholder: "" },
      { key: "has_content",  label: "Контент ведётся регулярно", type: "boolean", placeholder: "" },
      { key: "has_promo",    label: "Проводятся акции",          type: "boolean", placeholder: "" },
      { key: "has_partners", label: "Есть партнёрские программы",type: "boolean", placeholder: "" },
    ]
  },
  {
    id: "staff", title: "Персонал", icon: "GraduationCap",
    fields: [
      { key: "has_standards",       label: "Есть стандарты общения",      type: "boolean", placeholder: "" },
      { key: "has_training",        label: "Есть обучение сотрудников",   type: "boolean", placeholder: "" },
      { key: "has_motivation",      label: "Есть система мотивации",      type: "boolean", placeholder: "" },
      { key: "has_quality_control", label: "Есть контроль качества",      type: "boolean", placeholder: "" },
    ]
  },
  {
    id: "sales", title: "Продажи", icon: "ShoppingBag",
    fields: [
      { key: "has_upsell",    label: "Делают допродажи",            type: "boolean", placeholder: "" },
      { key: "has_packages",  label: "Продают комплексные программы",type: "boolean", placeholder: "" },
      { key: "sells_homecare",label: "Продают домашний уход",       type: "boolean", placeholder: "" },
      { key: "has_scripts",   label: "Есть скрипты продаж",         type: "boolean", placeholder: "" },
    ]
  },
];

// ── Вспомогательные компоненты ────────────────────────────────────────────────
const inp: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: 10, border: "1.5px solid #e8e8e4", fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fafaf8", boxSizing: "border-box", color: "#1a1a1a", outline: "none" };

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

// ── Экран результата ──────────────────────────────────────────────────────────
function AuditResult({ result, onReset }: { result: AuditResult; onReset: () => void }) {
  const score = result.score_total;
  const scoreColor = score >= 70 ? "hsl(145,60%,40%)" : score >= 40 ? "hsl(40,90%,50%)" : "hsl(0,75%,55%)";
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
            { label: "7 дней", items: result.plan?.week_1, color: "hsl(0,75%,55%)", bg: "hsl(0,75%,97%)" },
            { label: "30 дней", items: result.plan?.month_1, color: "hsl(40,90%,50%)", bg: "hsl(40,90%,97%)" },
            { label: "90 дней", items: result.plan?.month_3, color: ACCENT, bg: "hsl(185,85%,97%)" },
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

// ── Основной компонент ────────────────────────────────────────────────────────
export default function LkSalonAudit() {
  const { user } = useLkAuth();
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentBlock, setCurrentBlock] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");
  const [auditId, setAuditId] = useState<number | null>(null);

  useEffect(() => {
    // Загружаем историю
    fetch(`${LK_URL}?action=audit_history`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d) && setHistory(d)).catch(() => {});

    // Предзаполняем из профиля салона
    if (user?.salon_id) {
      fetch(`${LK_URL}?action=salon_profile`, { headers: { "X-Session-Id": sid() } })
        .then(r => r.json()).then(d => {
          if (d.salon) {
            const s = d.salon;
            setAnswers(prev => ({
              ...prev,
              salon_name:     s.name || "",
              city:           s.city || "",
              monthly_revenue: s.monthly_revenue || "",
              avg_check:      s.avg_check || "",
              clients_per_month: s.clients_count || "",
              staff_count:    s.masters_count || "",
            }));
          }
        }).catch(() => {});
    }
  }, [user?.salon_id]);

  function setAnswer(key: string, val: string | boolean) {
    setAnswers(p => ({ ...p, [key]: val }));
  }

  const block = BLOCKS[currentBlock];
  const isLastBlock = currentBlock === BLOCKS.length - 1;

  async function handleAnalyze() {
    setStep("loading");
    setError("");
    try {
      // Сохраняем черновик
      const saved = await lkPost("audit_save", { answers, result: null });
      const id = saved.id;
      setAuditId(id);

      // Запускаем ИИ-анализ
      const res = await fetch(AUDIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка анализа"); setStep("form"); return; }

      const r: AuditResult = data.result;
      setResult(r);

      // Сохраняем финальный результат
      await lkPost("audit_save", {
        id,
        answers,
        result: r,
        score_clients:    r.scores.clients,
        score_marketing:  r.scores.marketing,
        score_sales:      r.scores.sales,
        score_staff:      r.scores.staff,
        score_management: r.scores.management,
        score_total:      r.score_total,
      });

      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз.");
      setStep("form");
    }
  }

  if (step === "result" && result) {
    return <AuditResult result={result} onReset={() => { setStep("form"); setResult(null); setCurrentBlock(0); }} />;
  }

  if (step === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 20 }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Brain" size={30} style={{ color: "#fff", animation: "pulse 1.5s ease infinite" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Анализирую ваш салон...</div>
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>
            ИИ изучает данные и формирует персональный бизнес-разбор.<br />Обычно занимает 20–40 секунд.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="BarChart2" size={20} style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Цифровой бизнес-разбор</h2>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#777", margin: 0, lineHeight: 1.6 }}>
          Заполните анкету — ИИ проведёт полный анализ вашего салона и выдаст конкретный план роста.
        </p>
      </div>

      {/* Прогресс */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {BLOCKS.map((b, i) => (
          <div
            key={b.id}
            onClick={() => i < currentBlock && setCurrentBlock(i)}
            style={{ flex: 1, height: 4, borderRadius: 2, background: i <= currentBlock ? ACCENT : "#e8e8e4", cursor: i < currentBlock ? "pointer" : "default", transition: "background 0.3s" }}
          />
        ))}
      </div>

      {/* Блок анкеты */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "22px 22px 20px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `hsla(185,85%,32%,0.09)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={block.icon} size={16} style={{ color: ACCENT }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#bbb", marginBottom: 1 }}>Блок {currentBlock + 1} из {BLOCKS.length}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{block.title}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {block.fields.map(field => (
            <div key={field.key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>{field.label}</label>
              {field.type === "boolean" ? (
                <div style={{ display: "flex", gap: 10 }}>
                  {["Да", "Нет"].map(opt => {
                    const val = opt === "Да";
                    const active = answers[field.key] === val;
                    return (
                      <button key={opt} onClick={() => setAnswer(field.key, val)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: `1.5px solid ${active ? ACCENT : "#e8e8e4"}`, background: active ? `hsla(185,85%,32%,0.07)` : "#fff", fontSize: 13, fontWeight: active ? 700 : 400, color: active ? ACCENT : "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  style={inp}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={String(answers[field.key] || "")}
                  onChange={e => setAnswer(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="AlertCircle" size={14} />
          {error}
        </div>
      )}

      {/* Кнопки */}
      <div style={{ display: "flex", gap: 10 }}>
        {currentBlock > 0 && (
          <button onClick={() => setCurrentBlock(p => p - 1)} style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="ArrowLeft" size={14} />
            Назад
          </button>
        )}
        {isLastBlock ? (
          <button onClick={handleAnalyze} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: `0 4px 18px hsla(185,85%,32%,0.3)` }}>
            <Icon name="Brain" size={16} />
            Получить анализ
          </button>
        ) : (
          <button onClick={() => setCurrentBlock(p => p + 1)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Далее
            <Icon name="ArrowRight" size={14} />
          </button>
        )}
      </div>

      {/* История */}
      {history.length > 0 && (
        <div style={{ marginTop: 28, background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "18px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>Предыдущие аудиты</div>
          {history.map(h => (
            <div
              key={h.id}
              onClick={async () => {
                setStep("loading");
                try {
                  const r = await fetch(`${LK_URL}?action=audit_get&id=${h.id}`, { headers: { "X-Session-Id": sid() } });
                  const d = await r.json();
                  if (d.result) { setResult(d.result); setStep("result"); }
                  else { setStep("form"); }
                } catch { setStep("form"); }
              }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f2", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fafaf8")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{h.score_total} баллов</div>
                <div style={{ fontSize: 11, color: "#bbb" }}>{new Date(h.created_at).toLocaleDateString("ru-RU")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: h.score_total >= 70 ? "hsl(145,60%,40%)" : h.score_total >= 40 ? "hsl(40,90%,50%)" : "hsl(0,75%,55%)" }}>
                  {h.score_total >= 70 ? "Хорошо" : h.score_total >= 40 ? "Средне" : "Слабо"}
                </div>
                <Icon name="ChevronRight" size={14} style={{ color: "#ccc" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}