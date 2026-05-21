import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  FINANCE_ACCENT, FINANCE_ACCENT_LIGHT, FINANCE_ACCENT_DARK,
  FinanceData, FinanceStep, LifeItem, LIFE_ITEMS_DEFAULT,
  FinanceGoals, CurrentModel, Expenses, EnergyData, MoneyMindset,
} from "./finance.types";
import { calcAll, calcMPD, calcFR, formatMoney } from "./finance.logic";
import { lkApi } from "@/lib/lkApi";
import FinanceResult from "./FinanceResult";

const G = FINANCE_ACCENT;
const GL = FINANCE_ACCENT_LIGHT;
const GD = FINANCE_ACCENT_DARK;

const TOTAL_STEPS = 8;

function StepShell({ step, onBack, children }: { step: FinanceStep; onBack: () => void; children: React.ReactNode }) {
  const progress = Math.round(((step - 1) / TOTAL_STEPS) * 100);
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "#888",
          fontSize: 13, cursor: "pointer", padding: "0 0 14px",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> {step === 1 ? "К инструментам" : "Назад"}
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>Этап {step} из {TOTAL_STEPS}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: G }}>{progress}%</span>
        </div>
        <div style={{ height: 4, background: "#e8e8e0", borderRadius: 2 }}>
          <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${G}, ${GD})`, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>
      {children}
    </div>
  );
}

function NumInput({ label, value, onChange, prefix, suffix, placeholder, hint }: {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; placeholder?: string; hint?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>{label}</label>
      {hint && <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>{hint}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {prefix && <span style={{ fontSize: 14, color: "#888", minWidth: 20 }}>{prefix}</span>}
        <input
          type="number"
          value={value || ""}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder || "0"}
          style={{
            flex: 1, padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8e8e4",
            fontSize: 15, fontFamily: "Montserrat, sans-serif", background: "#fafafa",
            outline: "none", transition: "border-color 0.2s",
          }}
          onFocus={e => { e.target.style.borderColor = G; e.target.style.background = GL; }}
          onBlur={e => { e.target.style.borderColor = "#e8e8e4"; e.target.style.background = "#fafafa"; }}
        />
        {suffix && <span style={{ fontSize: 13, color: "#888", minWidth: 36 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8e8e4",
          fontSize: 14, fontFamily: "Montserrat, sans-serif", background: "#fafafa",
          outline: "none", boxSizing: "border-box",
        }}
        onFocus={e => { e.target.style.borderColor = G; e.target.style.background = GL; }}
        onBlur={e => { e.target.style.borderColor = "#e8e8e4"; e.target.style.background = "#fafafa"; }}
      />
    </div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "24px 24px 20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{title}</div>
      {subtitle && <p style={{ fontSize: 13, color: "#888", margin: "0 0 18px", lineHeight: 1.6 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function NextBtn({ onClick, disabled, label = "Далее →" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "14px", borderRadius: 14, border: "none",
        background: disabled ? "#e8e8e0" : `linear-gradient(135deg, ${G}, ${GD})`,
        color: disabled ? "#bbb" : "#fff", fontSize: 15, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
        boxShadow: disabled ? "none" : `0 6px 20px ${G}44`,
      }}
    >{label}</button>
  );
}

// ─── DEFAULTS ────────────────────────────────────────────────────────────────

function defaultData(): FinanceData {
  return {
    lifeItems: LIFE_ITEMS_DEFAULT.map(i => ({ ...i, amount: 0, importance: 3 })),
    goals: { desiredIncome: 0, savings: 0, goalDescription: "", goalMonths: 12 },
    currentModel: { currentIncome: 0, avgCheck: 0, clientsPerMonth: 0, hoursPerWeek: 40, workDaysPerMonth: 20, sessionDurationHours: 1 },
    expenses: { rent: 0, materials: 0, taxes: 0, education: 0, marketing: 0, personal: 0, loans: 0, other: 0 },
    energy: { tiredness: 3, emotionalLoad: 3, physicalLoad: 3, desireToWorkMore: 3 },
    mindset: { fearRaisePrice: false, feelUnworthy: false, fearLoseClients: false, hardToTalkMoney: false, incomeCapInHead: false },
  };
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

export default function FinanceBot({ onBack }: Props) {
  const [step, setStep] = useState<FinanceStep>(1);
  const [data, setData] = useState<FinanceData>(defaultData());
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);

  function setLife(items: LifeItem[]) { setData(d => ({ ...d, lifeItems: items })); }
  function setGoals(g: FinanceGoals) { setData(d => ({ ...d, goals: g })); }
  function setModel(m: CurrentModel) { setData(d => ({ ...d, currentModel: m })); }
  function setExp(e: Expenses) { setData(d => ({ ...d, expenses: e })); }
  function setEnergy(en: EnergyData) { setData(d => ({ ...d, energy: en })); }
  function setMindset(ms: MoneyMindset) { setData(d => ({ ...d, mindset: ms })); }

  function goBack() {
    if (step === 1) { onBack(); return; }
    setStep(s => (s - 1) as FinanceStep);
  }
  function goNext() { setStep(s => (s + 1) as FinanceStep); }

  async function handleFinish() {
    setSaving(true);
    const result = calcAll(data);
    try {
      await lkApi.financeSave({
        ifr: result.ifr,
        indexes: { ifj: result.ifj, ifu: result.ifu, ipn: result.ipn, idm: result.idm, ifp: result.ifp },
        summary: { jlj: result.jlj, fr: result.fr, mpd: result.mpd, nsc: result.nsc, nck: result.nck },
        data,
      });
    } catch (_) { /* silent */ }
    setSaving(false);
    setShowResult(true);
  }

  if (showResult) {
    return (
      <FinanceResult
        data={data}
        onRetake={() => { setShowResult(false); setStep(1); setData(defaultData()); }}
        onBack={onBack}
      />
    );
  }

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (step === 1 && data.goals.desiredIncome === 0 && data.lifeItems.every(i => i.amount === 0)) {
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 540, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#888", fontSize: 13, cursor: "pointer", padding: "0 0 16px", fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> К инструментам
        </button>

        <div style={{
          background: `linear-gradient(135deg, ${G}, ${GD})`,
          borderRadius: 20, padding: "32px 28px", marginBottom: 20, color: "#fff",
          boxShadow: `0 12px 40px ${G}44`,
        }}>
          <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
            Финансовый симулятор
          </div>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 700, margin: "0 0 12px", lineHeight: 1.2 }}>
            Финансовая грамотность специалиста PRO
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.8, margin: 0 }}>
            Пойми, сколько ты реально хочешь зарабатывать — и как к этому прийти
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>Что вы получите:</div>
          {[
            ["💰", "Сколько денег вы реально хотите"],
            ["📊", "Почему не выходите на нужный доход"],
            ["🔢", "Ваш финансовый потолок в текущей модели"],
            ["🎯", "Какой нужен чек и сколько клиентов"],
            ["⚡", "Что мешает зарабатывать больше"],
            ["📈", "Сценарии роста и симуляция «что если»"],
          ].map(([icon, text]) => (
            <div key={text as string} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
              <span style={{ fontSize: 14, color: "#444", lineHeight: 1.5 }}>{text as string}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 24, border: "1.5px solid #f0f0ec" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["8", "этапов"], ["~10", "минут"], ["6", "индексов"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: G, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <NextBtn onClick={goNext} label="Начать расчёт →" />
      </div>
    );
  }

  // ── ШАГ 1: Желаемая жизнь ────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <StepShell step={step} onBack={goBack}>
        <SectionCard title="Этап 1 · Желаемая жизнь" subtitle="Укажи, сколько в месяц ты хочешь тратить на каждую категорию и насколько это важно (1 — не важно, 5 — очень важно)">
          {data.lifeItems.map((item, i) => (
            <div key={item.label} style={{ borderBottom: i < data.lifeItems.length - 1 ? "1px solid #f0f0ec" : "none", paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 10 }}>{item.label}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end" }}>
                <NumInput label="Сумма в месяц" value={item.amount} onChange={v => {
                  const updated = [...data.lifeItems];
                  updated[i] = { ...updated[i], amount: v };
                  setLife(updated);
                }} suffix="₽" placeholder="0" />
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>Важность</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} onClick={() => {
                        const updated = [...data.lifeItems];
                        updated[i] = { ...updated[i], importance: v };
                        setLife(updated);
                      }} style={{
                        width: 32, height: 32, borderRadius: 8, border: "none",
                        background: item.importance >= v ? G : "#f0f0ec",
                        color: item.importance >= v ? "#fff" : "#aaa",
                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                      }}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ padding: "12px 16px", background: GL, borderRadius: 12, marginTop: 4 }}>
            <div style={{ fontSize: 13, color: GD, fontWeight: 700 }}>
              Итого желаемых расходов: {formatMoney(data.lifeItems.reduce((s, i) => s + i.amount, 0))}
            </div>
          </div>
        </SectionCard>
        <NextBtn onClick={goNext} />
      </StepShell>
    );
  }

  // ── ШАГ 2: Финансовые цели ───────────────────────────────────────────────────
  if (step === 2) {
    const g = data.goals;
    return (
      <StepShell step={step} onBack={goBack}>
        <SectionCard title="Этап 2 · Финансовые цели" subtitle="Конкретные числа дают ясность. Заполни как можно точнее.">
          <NumInput label="Желаемый доход в месяц" value={g.desiredIncome} onChange={v => setGoals({ ...g, desiredIncome: v })} suffix="₽/мес" hint="Сколько хочешь получать после всех расходов" />
          <NumInput label="Желаемые накопления в месяц" value={g.savings} onChange={v => setGoals({ ...g, savings: v })} suffix="₽/мес" />
          <TextInput label="Главная финансовая цель" value={g.goalDescription} onChange={v => setGoals({ ...g, goalDescription: v })} placeholder="Например: купить квартиру, выйти на 300 000 в месяц" />
          <NumInput label="Срок достижения" value={g.goalMonths} onChange={v => setGoals({ ...g, goalMonths: v })} suffix="месяцев" />
          {g.desiredIncome > 0 && (
            <div style={{ padding: "12px 16px", background: GL, borderRadius: 12, marginTop: 4 }}>
              <div style={{ fontSize: 13, color: GD, fontWeight: 700 }}>
                Общая потребность: {formatMoney(g.desiredIncome + g.savings)}/мес
              </div>
            </div>
          )}
        </SectionCard>
        <NextBtn onClick={goNext} disabled={g.desiredIncome <= 0} />
      </StepShell>
    );
  }

  // ── ШАГ 3: Текущая модель ────────────────────────────────────────────────────
  if (step === 3) {
    const m = data.currentModel;
    return (
      <StepShell step={step} onBack={goBack}>
        <SectionCard title="Этап 3 · Текущая модель дохода" subtitle="Расскажи о том, как ты работаешь сейчас.">
          <NumInput label="Текущий доход в месяц" value={m.currentIncome} onChange={v => setModel({ ...m, currentIncome: v })} suffix="₽" />
          <NumInput label="Средний чек за сессию/услугу" value={m.avgCheck} onChange={v => setModel({ ...m, avgCheck: v })} suffix="₽" />
          <NumInput label="Клиентов в месяц" value={m.clientsPerMonth} onChange={v => setModel({ ...m, clientsPerMonth: v })} suffix="чел." />
          <NumInput label="Часов работы в неделю" value={m.hoursPerWeek} onChange={v => setModel({ ...m, hoursPerWeek: v })} suffix="ч." />
          <NumInput label="Рабочих дней в месяц" value={m.workDaysPerMonth} onChange={v => setModel({ ...m, workDaysPerMonth: v })} suffix="дней" />
          <NumInput label="Средняя длительность сессии" value={m.sessionDurationHours} onChange={v => setModel({ ...m, sessionDurationHours: v })} suffix="ч." hint="Например: 1.5 для 90-минутного сеанса" />
          {m.currentIncome > 0 && m.avgCheck > 0 && (
            <div style={{ padding: "12px 16px", background: GL, borderRadius: 12, marginTop: 4, fontSize: 13, color: GD }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Доход в час: {formatMoney(m.hoursPerWeek * 4.3 > 0 ? Math.round(m.currentIncome / (m.hoursPerWeek * 4.3)) : 0)}</div>
              <div>Загрузка: {Math.round(Math.min(100, (m.hoursPerWeek * 4.3 / 160) * 100))}% от стандартного месяца</div>
            </div>
          )}
        </SectionCard>
        <NextBtn onClick={goNext} disabled={m.currentIncome <= 0} />
      </StepShell>
    );
  }

  // ── ШАГ 4: Расходы ───────────────────────────────────────────────────────────
  if (step === 4) {
    const e = data.expenses;
    const total = Object.values(e).reduce((s, v) => s + v, 0);
    const cp = data.currentModel.currentIncome - total;
    return (
      <StepShell step={step} onBack={goBack}>
        <SectionCard title="Этап 4 · Расходы бизнеса" subtitle="Укажи все затраты, связанные с работой.">
          {([
            ["rent",       "Аренда помещения"],
            ["materials",  "Материалы и расходники"],
            ["taxes",      "Налоги и взносы"],
            ["education",  "Обучение и курсы"],
            ["marketing",  "Реклама и маркетинг"],
            ["personal",   "Личные расходы"],
            ["loans",      "Кредиты и рассрочки"],
            ["other",      "Прочее"],
          ] as [keyof Expenses, string][]).map(([key, label]) => (
            <NumInput key={key} label={label} value={e[key]} onChange={v => setExp({ ...e, [key]: v })} suffix="₽" />
          ))}
          <div style={{ padding: "12px 16px", background: total > data.currentModel.currentIncome ? "#fef2f2" : GL, borderRadius: 12, marginTop: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: cp < 0 ? "#ef4444" : GD }}>
              Расходы: {formatMoney(total)} · Прибыль: {formatMoney(cp)}
            </div>
            {cp < 0 && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>⚠️ Расходы превышают доход</div>}
          </div>
        </SectionCard>
        <NextBtn onClick={goNext} />
      </StepShell>
    );
  }

  // ── ШАГ 5: Энергия ───────────────────────────────────────────────────────────
  if (step === 5) {
    const en = data.energy;
    const rows: { key: keyof EnergyData; label: string; invert?: boolean }[] = [
      { key: "tiredness",        label: "Уровень усталости после работы",     invert: false },
      { key: "emotionalLoad",    label: "Эмоциональная нагрузка",             invert: false },
      { key: "physicalLoad",     label: "Физическая нагрузка",                invert: false },
      { key: "desireToWorkMore", label: "Желание и возможность брать больше клиентов", invert: true },
    ];
    return (
      <StepShell step={step} onBack={goBack}>
        <SectionCard title="Этап 5 · Энергия и нагрузка" subtitle="Оцени по шкале 1–5, где 1 = минимум, 5 = максимум.">
          {rows.map(row => (
            <div key={row.key} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 10 }}>{row.label}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3, 4, 5].map(v => {
                  const sel = en[row.key] === v;
                  const color = row.invert
                    ? (v >= 4 ? G : v === 3 ? "#eab308" : "#ef4444")
                    : (v <= 2 ? G : v === 3 ? "#eab308" : "#ef4444");
                  return (
                    <button key={v} onClick={() => setEnergy({ ...en, [row.key]: v })} style={{
                      flex: 1, padding: "10px 4px", borderRadius: 10, border: sel ? `2px solid ${color}` : "1.5px solid #eee",
                      background: sel ? `${color}18` : "#fafafa",
                      color: sel ? color : "#999",
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}>{v}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </SectionCard>
        <NextBtn onClick={goNext} />
      </StepShell>
    );
  }

  // ── ШАГ 6: Потолок модели ────────────────────────────────────────────────────
  if (step === 6) {
    const mpd = calcMPD(data.currentModel);
    const desired = data.goals.desiredIncome;
    const ceiling = mpd > 0 && desired > mpd;
    const maxClients = data.currentModel.sessionDurationHours > 0
      ? Math.floor((data.currentModel.hoursPerWeek * 4.3) / data.currentModel.sessionDurationHours)
      : 0;
    return (
      <StepShell step={step} onBack={goBack}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            Этап 6 · Потолок текущей модели
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Текущий доход",     value: formatMoney(data.currentModel.currentIncome), color: "#1a1a1a" },
              { label: "Желаемый доход",    value: formatMoney(desired),                          color: G },
              { label: "Потолок модели",    value: formatMoney(mpd),                               color: ceiling ? "#ef4444" : "#22c55e" },
              { label: "Макс. клиентов",   value: `${maxClients} чел.`,                            color: "#1a1a1a" },
            ].map(item => (
              <div key={item.label} style={{ background: "#f9f9f7", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {ceiling ? (
            <div style={{ background: "#fef2f2", borderRadius: 14, padding: "16px 18px", borderLeft: "4px solid #ef4444" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>
                ⚠️ Текущая модель не позволит достичь цели
              </div>
              <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.6 }}>
                При текущих ценах и графике максимум — {formatMoney(mpd)}/мес.
                Для достижения цели нужно изменить модель: повысить чек, добавить источники дохода или сократить время на клиента.
              </p>
            </div>
          ) : (
            <div style={{ background: GL, borderRadius: 14, padding: "16px 18px", borderLeft: `4px solid ${G}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: GD, marginBottom: 6 }}>
                ✓ Цель достижима в текущей модели
              </div>
              <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.6 }}>
                Потолок твоей модели ({formatMoney(mpd)}) выше желаемого дохода. Нужно лишь выстроить поток клиентов.
              </p>
            </div>
          )}
        </div>
        <NextBtn onClick={goNext} label="Посмотреть разрыв →" />
      </StepShell>
    );
  }

  // ── ШАГ 7: Финансовый разрыв ─────────────────────────────────────────────────
  if (step === 7) {
    const fr = calcFR(data.goals.desiredIncome, data.currentModel.currentIncome);
    const nsc = data.currentModel.clientsPerMonth > 0
      ? Math.round(data.goals.desiredIncome / data.currentModel.clientsPerMonth)
      : 0;
    const nck = data.currentModel.avgCheck > 0
      ? Math.ceil(data.goals.desiredIncome / data.currentModel.avgCheck)
      : 0;
    const checkIncrease = data.currentModel.avgCheck > 0
      ? Math.round(((nsc - data.currentModel.avgCheck) / data.currentModel.avgCheck) * 100)
      : 0;
    const clientsIncrease = data.currentModel.clientsPerMonth > 0
      ? nck - data.currentModel.clientsPerMonth
      : 0;
    return (
      <StepShell step={step} onBack={goBack}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            Этап 7 · Финансовый разрыв
          </div>

          <div style={{
            background: fr > 0 ? "#fef2f2" : GL,
            borderRadius: 16, padding: "20px", marginBottom: 20, textAlign: "center",
          }}>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>Финансовый разрыв</div>
            <div style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 900, color: fr > 0 ? "#ef4444" : G, lineHeight: 1 }}>
              {fr > 0 ? `+${formatMoney(fr)}` : "0 ₽"}
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
              {fr > 0 ? "нужно дополнительно в месяц" : "ты уже на цели!"}
            </div>
          </div>

          {fr > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Пути к цели:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    num: "1", title: "Повысить средний чек",
                    detail: `Текущий чек: ${formatMoney(data.currentModel.avgCheck)} → Нужный: ${formatMoney(nsc)} (+${checkIncrease}%)`,
                    color: G,
                  },
                  {
                    num: "2", title: "Увеличить количество клиентов",
                    detail: `Сейчас: ${data.currentModel.clientsPerMonth} клиентов → Нужно: ${nck} (+${clientsIncrease})`,
                    color: "#8b5cf6",
                  },
                  {
                    num: "3", title: "Снизить нагрузку + повысить стоимость",
                    detail: "Меньше клиентов, выше чек — больше дохода при меньших усилиях",
                    color: "#f97316",
                  },
                  {
                    num: "4", title: "Добавить новый источник дохода",
                    detail: "Курсы, консультации, обучение, партнёрства — диверсификация",
                    color: "#14b8a6",
                  },
                ].map(opt => (
                  <div key={opt.num} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    background: "#f9f9f7", borderRadius: 12, padding: "14px 16px",
                    borderLeft: `3px solid ${opt.color}`,
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, background: opt.color,
                      color: "#fff", fontSize: 12, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>{opt.num}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{opt.title}</div>
                      <div style={{ fontSize: 12, color: "#777" }}>{opt.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <NextBtn onClick={goNext} label="Последний шаг →" />
      </StepShell>
    );
  }

  // ── ШАГ 8: Денежное мышление ─────────────────────────────────────────────────
  if (step === 8) {
    const ms = data.mindset;
    const questions: { key: keyof MoneyMindset; label: string }[] = [
      { key: "fearRaisePrice",    label: "Мне страшно повышать цены" },
      { key: "feelUnworthy",      label: "Есть чувство «я недостоин(а) больших денег»" },
      { key: "fearLoseClients",   label: "Боюсь потерять клиентов при повышении цен" },
      { key: "hardToTalkMoney",   label: "Сложно говорить о деньгах с клиентами" },
      { key: "incomeCapInHead",   label: "Есть внутренний потолок дохода — выше кажется невозможным" },
    ];
    const trueCount = Object.values(ms).filter(Boolean).length;
    return (
      <StepShell step={step} onBack={goBack}>
        <SectionCard title="Этап 8 · Денежное мышление" subtitle="Честно ответь на каждое утверждение.">
          {questions.map(q => {
            const val = ms[q.key];
            return (
              <div key={q.key} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 0", borderBottom: "1px solid #f0f0ec",
              }}>
                <span style={{ fontSize: 14, color: "#333", flex: 1, lineHeight: 1.5 }}>{q.label}</span>
                <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
                  {[
                    { label: "Да",  value: true },
                    { label: "Нет", value: false },
                  ].map(opt => (
                    <button key={opt.label} onClick={() => setMindset({ ...ms, [q.key]: opt.value })} style={{
                      padding: "7px 16px", borderRadius: 8,
                      border: val === opt.value ? `2px solid ${opt.value ? "#ef4444" : G}` : "1.5px solid #eee",
                      background: val === opt.value ? (opt.value ? "#fef2f2" : GL) : "#fafafa",
                      color: val === opt.value ? (opt.value ? "#ef4444" : GD) : "#aaa",
                      fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}>{opt.label}</button>
                  ))}
                </div>
              </div>
            );
          })}
          {trueCount > 0 && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#fef2f2", borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>
                {trueCount} из 5 ограничений активны — они напрямую влияют на доход
              </div>
            </div>
          )}
        </SectionCard>
        <NextBtn onClick={handleFinish} disabled={saving} label={saving ? "Считаем результат..." : "Получить результат →"} />
      </StepShell>
    );
  }

  return null;
}
