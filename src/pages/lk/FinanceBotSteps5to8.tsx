import Icon from "@/components/ui/icon";
import { FinanceData, FinanceStep, EnergyData, MoneyMindset } from "./finance.types";
import { calcMPD, calcFR, formatMoney } from "./finance.logic";
import { G, GL, GD, StepShell, SectionCard, NextBtn } from "./FinanceBotShared";

interface StepProps {
  step: FinanceStep;
  data: FinanceData;
  goBack: () => void;
  goNext: () => void;
  setEnergy: (en: EnergyData) => void;
  setMindset: (ms: MoneyMindset) => void;
  handleFinish: () => void;
  saving: boolean;
}

// ── INTRO ─────────────────────────────────────────────────────────────────────

export function FinanceIntro({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
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
        <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.8, margin: "0 0 16px" }}>
          Пойми, сколько ты реально хочешь зарабатывать — и как к этому прийти
        </p>
        <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.12)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Как пользоваться и почему это выгодно</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.65 }}>
            Пройдите финансовый симулятор — ответьте на вопросы о доходах, расходах и целях. ИИ рассчитает ваш финансовый потолок и покажет конкретные сценарии роста.<br />
            Большинство специалистов не зарабатывают больше не потому, что нет клиентов — а потому что не понимают свою финансовую модель. Этот инструмент меняет это.
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>Что вы получите:</div>
        {[
          ["Banknote",    "Сколько денег вы реально хотите"],
          ["BarChart2",   "Почему не выходите на нужный доход"],
          ["Calculator",  "Ваш финансовый потолок в текущей модели"],
          ["Target",      "Какой нужен чек и сколько клиентов"],
          ["Zap",         "Что мешает зарабатывать больше"],
          ["TrendingUp",  "Сценарии роста и симуляция «что если»"],
        ].map(([icon, text]) => (
          <div key={text as string} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: `${G}18`, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={icon as string} size={14} style={{ color: G }} />
            </div>
            <span style={{ fontSize: 14, color: "#444", lineHeight: 1.5, marginTop: 4 }}>{text as string}</span>
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

      <button
        onClick={onStart}
        style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${G}, ${GD})`,
          color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
          fontFamily: "Montserrat, sans-serif", boxShadow: `0 6px 20px ${G}44`,
        }}
      >Начать расчёт →</button>
    </div>
  );
}

// ── ШАГ 5: Энергия ───────────────────────────────────────────────────────────

export function Step5Energy({ step, data, goBack, goNext, setEnergy }: StepProps) {
  const en = data.energy;
  const rows: { key: keyof EnergyData; label: string; invert?: boolean }[] = [
    { key: "tiredness",        label: "Уровень усталости после работы",                  invert: false },
    { key: "emotionalLoad",    label: "Эмоциональная нагрузка",                          invert: false },
    { key: "physicalLoad",     label: "Физическая нагрузка",                             invert: false },
    { key: "desireToWorkMore", label: "Желание и возможность брать больше клиентов",      invert: true  },
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
                    flex: 1, padding: "10px 4px", borderRadius: 10,
                    border: sel ? `2px solid ${color}` : "1.5px solid #eee",
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

export function Step6Ceiling({ step, data, goBack, goNext }: StepProps) {
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
            { label: "Текущий доход",   value: formatMoney(data.currentModel.currentIncome), color: "#1a1a1a" },
            { label: "Желаемый доход",  value: formatMoney(desired),                          color: G },
            { label: "Потолок модели",  value: formatMoney(mpd),                               color: ceiling ? "#ef4444" : "#22c55e" },
            { label: "Макс. клиентов", value: `${maxClients} чел.`,                            color: "#1a1a1a" },
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

export function Step7Gap({ step, data, goBack, goNext }: StepProps) {
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

export function Step8Mindset({ step, data, goBack, handleFinish, setMindset, saving }: StepProps) {
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