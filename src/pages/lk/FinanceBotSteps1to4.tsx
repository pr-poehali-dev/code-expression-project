import { FinanceData, FinanceStep, LifeItem, FinanceGoals, CurrentModel, Expenses } from "./finance.types";
import { formatMoney } from "./finance.logic";
import { G, GL, GD, StepShell, NumInput, TextInput, SectionCard, NextBtn } from "./FinanceBotShared";

interface StepProps {
  step: FinanceStep;
  data: FinanceData;
  goBack: () => void;
  goNext: () => void;
  setLife: (items: LifeItem[]) => void;
  setGoals: (g: FinanceGoals) => void;
  setModel: (m: CurrentModel) => void;
  setExp: (e: Expenses) => void;
}

// ── ШАГ 1: Желаемая жизнь ────────────────────────────────────────────────────

export function Step1Life({ step, data, goBack, goNext, setLife }: StepProps) {
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

export function Step2Goals({ step, data, goBack, goNext, setGoals }: StepProps) {
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

export function Step3Model({ step, data, goBack, goNext, setModel }: StepProps) {
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

export function Step4Expenses({ step, data, goBack, goNext, setExp }: StepProps) {
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
