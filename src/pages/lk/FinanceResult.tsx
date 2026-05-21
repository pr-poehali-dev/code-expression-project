import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend,
} from "recharts";
import Icon from "@/components/ui/icon";
import { FinanceData, FINANCE_ACCENT, FINANCE_ACCENT_LIGHT, FINANCE_ACCENT_DARK } from "./finance.types";
import { calcAll, getIFRLabel, formatMoney } from "./finance.logic";

const G = FINANCE_ACCENT;
const GL = FINANCE_ACCENT_LIGHT;
const GD = FINANCE_ACCENT_DARK;

interface Props {
  data: FinanceData;
  onRetake: () => void;
  onBack: () => void;
  backLabel?: string;
}

function IndexBar({ label, value, color, good }: { label: string; value: number; color: string; good?: boolean }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: "#f0f0ec", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s ease" }} />
      </div>
      {good !== undefined && (
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>
          {good ? "↑ высокий показатель — хорошо" : "↓ высокий показатель — требует внимания"}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color, accent }: { label: string; value: string; sub?: string; color?: string; accent?: string }) {
  return (
    <div style={{ background: "#f9f9f7", borderRadius: 14, padding: "16px", borderLeft: accent ? `3px solid ${accent}` : "none" }}>
      <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: color || "#1a1a1a", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function FinanceResult({ data, onRetake, onBack, backLabel = "К инструментам" }: Props) {
  const r = calcAll(data);
  const scale = getIFRLabel(r.ifr);

  const radarData = [
    { subject: "Ясность",      value: r.ifj,         fullMark: 100 },
    { subject: "Устойчивость", value: r.ifu,         fullMark: 100 },
    { subject: "Потенциал",    value: r.ifp,         fullMark: 100 },
    { subject: "Энергия",      value: 100 - r.ipn,   fullMark: 100 },
    { subject: "Мышление",     value: 100 - r.idm,   fullMark: 100 },
    { subject: "Реализация",   value: r.ifr,         fullMark: 100 },
  ];

  const incomeBarData = [
    { name: "Текущий", value: data.currentModel.currentIncome,   fill: "#94a3b8" },
    { name: "Желаемый", value: data.goals.desiredIncome,          fill: G         },
    { name: "Потолок",  value: r.mpd,                             fill: r.ceilingReached ? "#ef4444" : "#22c55e" },
  ];

  const expenseData = [
    { name: "Аренда",      value: data.expenses.rent },
    { name: "Материалы",   value: data.expenses.materials },
    { name: "Налоги",      value: data.expenses.taxes },
    { name: "Обучение",    value: data.expenses.education },
    { name: "Реклама",     value: data.expenses.marketing },
    { name: "Личные",      value: data.expenses.personal },
    { name: "Кредиты",     value: data.expenses.loans },
    { name: "Прочее",      value: data.expenses.other },
  ].filter(e => e.value > 0);

  const PIE_COLORS = ["#14b8a6", "#8b5cf6", "#f97316", "#eab308", "#ef4444", "#06b6d4", "#a855f7", "#84cc16"];

  const mindsetCount = Object.values(data.mindset).filter(Boolean).length;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "Montserrat, sans-serif" }}>
      {/* Шапка */}
      <button onClick={onBack} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "none", border: "none", color: "#888",
        fontSize: 13, cursor: "pointer", padding: "0 0 16px",
        fontFamily: "Montserrat, sans-serif",
      }}>
        <Icon name="ArrowLeft" size={15} /> {backLabel}
      </button>

      {/* Главный индекс IFR */}
      <div style={{
        background: `linear-gradient(135deg, ${G}, ${GD})`,
        borderRadius: 20, padding: "28px", marginBottom: 16, color: "#fff",
        boxShadow: `0 12px 40px ${G}44`,
      }}>
        <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
          Индекс финансовой реализации (IFR)
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: "clamp(52px,6vw,72px)", fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>{r.ifr}</div>
          <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 8 }}>/100</div>
        </div>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.2)",
          borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700, marginBottom: 14,
        }}>{scale.label}</div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
          <div style={{ width: `${r.ifr}%`, height: "100%", background: "#fff", borderRadius: 3, transition: "width 1s ease" }} />
        </div>
        <div style={{ fontSize: 12, opacity: 0.65, marginTop: 8 }}>
          0 = финансовый хаос · 100 = системная реализация
        </div>
      </div>

      {/* Ключевые цифры */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Ключевые цифры</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <StatCard label="Текущий доход"    value={formatMoney(data.currentModel.currentIncome)} accent="#94a3b8" />
          <StatCard label="Желаемый доход"   value={formatMoney(data.goals.desiredIncome)}         color={G} accent={G} />
          <StatCard label="Финансовый разрыв" value={formatMoney(r.fr)}                            color={r.fr > 0 ? "#ef4444" : G} accent={r.fr > 0 ? "#ef4444" : G} />
          <StatCard label="Потолок модели"   value={formatMoney(r.mpd)}                            color={r.ceilingReached ? "#ef4444" : "#22c55e"} accent={r.ceilingReached ? "#ef4444" : "#22c55e"} />
          <StatCard label="Нужный чек"       value={formatMoney(r.nsc)}                            sub={`сейчас ${formatMoney(data.currentModel.avgCheck)}`} accent="#8b5cf6" />
          <StatCard label="Нужно клиентов"   value={`${r.nck} чел./мес`}                          sub={`сейчас ${data.currentModel.clientsPerMonth}`} accent="#f97316" />
          <StatCard label="Доход в час"      value={formatMoney(r.dh)}                             sub="при текущей нагрузке" />
          <StatCard label="Чистая прибыль"   value={formatMoney(r.cp)}                             color={r.cp < 0 ? "#ef4444" : "#22c55e"} accent={r.cp < 0 ? "#ef4444" : "#22c55e"} />
        </div>
      </div>

      {/* Потолок */}
      {r.ceilingReached && (
        <div style={{ background: "#fef2f2", borderRadius: 20, padding: "20px 24px", marginBottom: 16, borderLeft: "4px solid #ef4444" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon name="AlertTriangle" size={20} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>
                Текущая модель не позволит достичь цели
              </div>
              <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.7 }}>
                Максимум при текущих ценах и графике — {formatMoney(r.mpd)}/мес. 
                Нужно системное изменение: повышение чека, добавление форматов или новых источников дохода.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* График: сравнение доходов */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Сравнение доходов</div>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Текущий / Желаемый / Потолок модели</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={incomeBarData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Montserrat, sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v: number) => formatMoney(v)} contentStyle={{ fontFamily: "Montserrat, sans-serif", fontSize: 12 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {incomeBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Профиль финансовой реализации</div>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>Чем ближе к 100 — тем лучше</div>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#f0f0ec" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888", fontFamily: "Montserrat, sans-serif" }} />
            <Radar dataKey="value" stroke={G} fill={G} fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Детальные индексы */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 18 }}>Детальные индексы</div>
        <IndexBar label="Финансовая ясность (IFJ)"     value={r.ifj}       color={G}        good={true} />
        <IndexBar label="Финансовая устойчивость (IFU)" value={r.ifu}       color="#22c55e"  good={true} />
        <IndexBar label="Финансовый потенциал (IFP)"    value={r.ifp}       color="#8b5cf6"  good={true} />
        <IndexBar label="Индекс перегрузки (IPN)"       value={r.ipn}       color="#f97316"  good={false} />
        <IndexBar label="Дефицитное мышление (IDM)"     value={r.idm}       color="#ef4444"  good={false} />
      </div>

      {/* Диаграмма расходов */}
      {expenseData.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Структура расходов</div>
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>Итого: {formatMoney(r.or)}</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {expenseData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Montserrat, sans-serif" }} />
              <Tooltip formatter={(v: number) => formatMoney(v)} contentStyle={{ fontFamily: "Montserrat, sans-serif", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Симулятор «Что если» */}
      <FinanceSimulator data={data} r={r} />

      {/* Денежное мышление */}
      {mindsetCount > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, borderLeft: "4px solid #ef4444", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <Icon name="Brain" size={18} style={{ color: "#ef4444" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Ограничения денежного мышления</div>
          </div>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: "0 0 12px" }}>
            У тебя активны <b>{mindsetCount} из 5</b> ограничивающих установок. Они незаметно блокируют повышение цен и привлечение клиентов.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { key: "fearRaisePrice",  label: "Страх повышать цены" },
              { key: "feelUnworthy",    label: "Ощущение недостоинства" },
              { key: "fearLoseClients", label: "Страх потерять клиентов" },
              { key: "hardToTalkMoney", label: "Сложно говорить о деньгах" },
              { key: "incomeCapInHead", label: "Внутренний потолок дохода" },
            ].filter(q => data.mindset[q.key as keyof typeof data.mindset]).map(q => (
              <div key={q.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#ef4444" }}>
                <Icon name="X" size={14} style={{ color: "#ef4444", flexShrink: 0 }} />
                {q.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Кнопки */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <button onClick={onRetake} style={{
          flex: 1, padding: "13px", borderRadius: 14,
          border: `1.5px solid ${G}`, background: "transparent",
          color: G, fontSize: 14, fontWeight: 700,
          fontFamily: "Montserrat, sans-serif", cursor: "pointer",
        }}>
          Пересчитать
        </button>
        <button onClick={onBack} style={{
          flex: 1, padding: "13px", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${G}, ${GD})`,
          color: "#fff", fontSize: 14, fontWeight: 700,
          fontFamily: "Montserrat, sans-serif", cursor: "pointer",
        }}>
          {backLabel}
        </button>
      </div>
    </div>
  );
}

// ── Симулятор «Что если» ─────────────────────────────────────────────────────

function FinanceSimulator({ data, r }: { data: FinanceData; r: ReturnType<typeof calcAll> }) {
  const [checkMult, setCheckMult] = useState(1.0);
  const [clientsMult, setClientsMult] = useState(1.0);

  const simIncome = Math.round(
    data.currentModel.clientsPerMonth * clientsMult * data.currentModel.avgCheck * checkMult
  );
  const simDiff = simIncome - data.currentModel.currentIncome;
  const reached = simIncome >= data.goals.desiredIncome;

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <Icon name="Sliders" size={18} style={{ color: FINANCE_ACCENT }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Симулятор «Что если»</div>
      </div>
      <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 20px", lineHeight: 1.6 }}>
        Передвигай ползунки и смотри, как меняется доход
      </p>

      <SliderRow
        label={`Средний чек: ${formatMoney(Math.round(data.currentModel.avgCheck * checkMult))}`}
        value={checkMult}
        min={0.5} max={3} step={0.05}
        onChange={setCheckMult}
        hint={`${checkMult >= 1 ? "+" : ""}${Math.round((checkMult - 1) * 100)}% к текущему чеку`}
        color={FINANCE_ACCENT}
      />
      <SliderRow
        label={`Клиентов в месяц: ${Math.round(data.currentModel.clientsPerMonth * clientsMult)}`}
        value={clientsMult}
        min={0.5} max={3} step={0.05}
        onChange={setClientsMult}
        hint={`${clientsMult >= 1 ? "+" : ""}${Math.round((clientsMult - 1) * 100)}% к текущему потоку`}
        color="#8b5cf6"
      />

      <div style={{
        padding: "16px 20px", borderRadius: 14, marginTop: 8,
        background: reached ? FINANCE_ACCENT_LIGHT : simDiff > 0 ? "#f0fdf4" : "#fef2f2",
        border: `1.5px solid ${reached ? FINANCE_ACCENT : simDiff > 0 ? "#22c55e" : "#fca5a5"}`,
      }}>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Расчётный доход</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: reached ? FINANCE_ACCENT : simDiff > 0 ? "#22c55e" : "#ef4444" }}>
          {formatMoney(simIncome)}
        </div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
          {simDiff >= 0 ? "+" : ""}{formatMoney(simDiff)} к текущему
          {reached && " · ✓ Цель достигнута!"}
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, hint, color }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; hint: string; color: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{label}</span>
        <span style={{ fontSize: 12, color: "#888" }}>{hint}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer", height: 4 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#ccc", marginTop: 2 }}>
        <span>×{min}</span><span>×{max}</span>
      </div>
    </div>
  );
}

// need to import useState for simulator
import { useState } from "react";
