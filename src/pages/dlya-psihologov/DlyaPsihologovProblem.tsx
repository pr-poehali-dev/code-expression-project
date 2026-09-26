import Icon from "@/components/ui/icon";
import { TEAL, TEAL2, DARK, GRAY, SERIF, PAINS, STEPS } from "./shared";

export default function DlyaPsihologovProblem() {
  return (
    <>
      {/* ── ЗНАКОМАЯ СИТУАЦИЯ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Знакомая ситуация?</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.15, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
              Вы хорошо работаете с людьми. Но развитие практики часто остаётся на втором плане.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }} className="psy-pains-grid">
            {PAINS.map(p => (
              <div key={p.title} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 14, padding: "28px 26px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={p.icon} size={20} style={{ color: TEAL2 }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.65, fontWeight: 300 }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: DARK, fontFamily: SERIF }}>
              Что именно делать сейчас, чтобы практика росла?
            </div>
          </div>
        </div>
      </section>

      {/* ── ЧТО ДЕЛАЕТ ПРОМТ ДИАЛОГ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Как это работает</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
            Вместо догадок — персональный план развития
          </h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
            Промт Диалог помогает посмотреть на вашу практику как на систему. Вы рассказываете о себе, своей специализации, услугах, клиентах, текущих результатах и целях. Система анализирует эту информацию и формирует индивидуальный профиль вашей практики. После этого рекомендации строятся уже не абстрактно для «психолога», а именно для вас.
          </p>
        </div>
      </section>

      {/* ── СХЕМА РАБОТЫ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ display: "flex", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(45,212,191,0.3)" }}>
                    <Icon name={s.icon} size={24} style={{ color: DARK }} />
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 40, background: "#D8E0E8", margin: "6px 0" }} />}
                </div>
                <div style={{ paddingBottom: i < STEPS.length - 1 ? 40 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEAL2, letterSpacing: "1.5px", marginBottom: 4 }}>{s.num}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.65, fontWeight: 300, maxWidth: 480 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРИМЕР РЕЗУЛЬТАТА ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Пример</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px" }}>
              Как это может выглядеть
            </h2>
          </div>

          <div style={{ background: DARK, borderRadius: 18, padding: "40px 36px", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }} className="psy-example-grid">
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Ваша цель</div>
                <div style={{ fontSize: 16, color: "#fff", fontWeight: 500 }}>Получать 15 новых обращений в месяц</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Текущая ситуация</div>
                <div style={{ fontSize: 16, color: "#fff", fontWeight: 500 }}>Вы получаете около 6–8 обращений</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Что обнаружено</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontWeight: 300 }}>
                Основная точка роста — недостаточная регулярность продвижения и отсутствие понятного предложения для новой аудитории.
              </div>
            </div>

            <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 12, padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>Сегодняшний шаг</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 500, marginBottom: 4 }}>Создать один материал для вашей целевой аудитории, который отвечает на конкретную проблему потенциального клиента</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Рекомендуемый инструмент: Создать пост</div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 8, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 13, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>
                Выполнить шаг
              </div>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: GRAY, marginTop: 18, fontWeight: 300 }}>
            Пример интерфейса личного кабинета. Реальные шаги формируются на основе вашей диагностики.
          </p>
        </div>
      </section>
    </>
  );
}