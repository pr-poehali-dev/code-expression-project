import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { TEAL, TEAL2, DARK, GRAY, SERIF, ANALYSIS_ITEMS, AUDIENCE, CENTER_ITEMS } from "./shared";

export default function DlyaPsihologovAnalysis() {
  return (
    <>
      {/* ── ЧТО АНАЛИЗИРУЕТСЯ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Диагностика</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Диагностика смотрит не только на количество клиентов
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="psy-analysis-grid">
            {ANALYSIS_ITEMS.map(item => (
              <div key={item.title} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 14, padding: "26px 24px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={item.icon} size={19} style={{ color: TEAL2 }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13.5, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЕЖЕДНЕВНЫЕ ШАГИ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Каждый день</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Вам не нужно каждый день думать, что делать дальше
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, fontWeight: 300, maxWidth: 640, margin: "0 auto" }}>
              После диагностики Промт Диалог формирует последовательность действий. Каждый день вы получаете следующий шаг, основанный на вашей цели, текущей ситуации, результатах предыдущих действий и изменениях в практике.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Сегодня: вернуть в диалог клиентов, которые обращались ранее, но не записались на консультацию.",
              "Сегодня: сформулировать предложение для конкретной группы клиентов.",
              "Сегодня: создать экспертный материал на тему, которая соответствует вашей специализации.",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: "#F8FAFC", border: "1px solid #E8ECF0", borderRadius: 12, padding: "16px 20px" }}>
                <Icon name="ArrowRight" size={16} style={{ color: TEAL2, flexShrink: 0 }} />
                <span style={{ fontSize: 14.5, color: DARK, lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРОГРЕСС ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Результаты</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
            Развитие практики становится видимым
          </h2>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, fontWeight: 300, marginBottom: 40 }}>
            Вы фиксируете выполненные шаги, новых и возвращённых клиентов, доход и результаты действий. На основе этих данных система продолжает анализ.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap", fontSize: 13, fontWeight: 600, color: DARK }}>
            {["Цель", "Действия", "Результаты", "Новый анализ", "Следующий шаг"].map((t, i, arr) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ padding: "9px 16px", borderRadius: 20, background: "#fff", border: `1px solid ${TEAL}` }}>{t}</span>
                {i < arr.length - 1 && <Icon name="ArrowRight" size={14} style={{ color: TEAL2 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── НЕ ПРОСТО СОВЕТЫ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 20px", letterSpacing: "-0.5px" }}>
              Не список советов. А система действий.
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, fontWeight: 300, maxWidth: 600, margin: "0 auto" }}>
              Обычная статья может рассказать: «Психологу нужно развивать личный бренд». Но остаётся вопрос — что именно сделать сегодня? Промт Диалог переводит общую задачу в конкретное действие.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 480, margin: "0 auto" }}>
            {[
              ["Target", "Цель", "больше клиентов"],
              ["AlertCircle", "Проблема", "мало входящих обращений"],
              ["ListTodo", "Задача", "увеличить количество обращений"],
              ["Calendar", "Сегодняшний шаг", "создать материал для конкретной аудитории"],
              ["Wrench", "Инструмент", "генератор контента"],
              ["CheckCircle2", "Результат", "вы отмечаете, что произошло"],
              ["RefreshCw", "Следующий анализ", "система учитывает результат"],
            ].map(([icon, label, val], i, arr) => (
              <div key={label as string}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={icon as string} size={16} style={{ color: TEAL2 }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: TEAL2, textTransform: "uppercase", letterSpacing: "1px", marginRight: 8 }}>{label}:</span>
                    <span style={{ fontSize: 14.5, color: DARK }}>{val}</span>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ width: 2, height: 20, background: "#D8E0E8", margin: "4px 0 4px 17px" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ИНСТРУМЕНТЫ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
            А когда нужен инструмент — он уже рядом
          </h2>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, fontWeight: 300, marginBottom: 32 }}>
            В Промт Диалог есть инструменты, которые помогают выполнить рекомендации: создание контента, маркетинг, работа с клиентами, продажи, создание предложений, анализ, создание материалов, лендинги и другие инструменты развития.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: `1.5px solid ${TEAL}`, borderRadius: 12, padding: "16px 24px", fontSize: 14, fontWeight: 600, color: DARK, maxWidth: 560 }}>
            <Icon name="Lightbulb" size={18} style={{ color: TEAL2, flexShrink: 0 }} />
            Вам не нужно искать, чем воспользоваться. Система может предложить подходящий инструмент в нужный момент.
          </div>
        </div>
      </section>

      {/* ── ДЛЯ КОГО ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px" }}>
              Промт Диалог подходит психологам на разных этапах
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="psy-audience-grid">
            {AUDIENCE.map(a => (
              <div key={a.title} style={{ background: "#F8FAFC", border: "1px solid #E8ECF0", borderRadius: 14, padding: "26px 22px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon name={a.icon} size={22} style={{ color: TEAL2 }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 8 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>{a.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЦЕНТРЫ ── */}
      <section style={{ padding: "90px 32px", background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Для центров</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: "#fff", margin: "0 0 32px", letterSpacing: "-0.5px" }}>
            Для психологического центра — отдельный уровень задач
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
            {CENTER_ITEMS.map(t => (
              <span key={t} style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "9px 18px" }}>{t}</span>
            ))}
          </div>
          <Link to="/dlya-salonov" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px", borderRadius: 2,
            border: "1px solid rgba(45,212,191,0.4)", color: TEAL, fontSize: 14, fontWeight: 500,
            textDecoration: "none", transition: "all 0.25s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(45,212,191,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            Узнать о возможностях для центра
            <Icon name="ArrowRight" size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
