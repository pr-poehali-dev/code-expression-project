import Icon from "@/components/ui/icon";
import {
  TEAL, DARK, GRAY, SERIF, PRESENTATION_URL,
  SCHOOL_GETS, CONNECT_STEPS, NOT_NEEDED, NEEDED,
  SectionLabel,
} from "./DlyaShkolShared";
import PartnerForm from "./DlyaShkolForm";

export default function DlyaShkolConnect() {
  return (
    <>
      {/* ── 12. ЧТО ПОЛУЧАЕТ ШКОЛА ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>Итог для партнера</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>Что получает школа</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {SCHOOL_GETS.map(s => (
              <div key={s.n} style={{ background: "#fff", borderRadius: 6, border: "1px solid #E2E8F0", padding: "32px 28px" }}>
                <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 600, color: TEAL, lineHeight: 1, marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. КАК ПОДКЛЮЧИТЬСЯ ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Простой процесс</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Подключение занимает несколько шагов
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {CONNECT_STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", background: "rgba(45,212,191,0.1)",
                    border: `1.5px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: TEAL, fontFamily: SERIF,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {i < CONNECT_STEPS.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 24, background: "#E2E8F0" }} />}
                </div>
                <div style={{ paddingTop: 8, paddingBottom: 24, fontSize: 15, color: "#334155", fontWeight: 500 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. ЧТО НУЖНО ОТ ШКОЛЫ ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Никакой сложной интеграции</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              От школы не требуется сложной интеграции
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="compare-grid">
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6, padding: "28px 26px" }}>
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>На старте</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {NEEDED.map(item => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Icon name="Check" size={16} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: "#334155" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6, padding: "28px 26px" }}>
              <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>Не требуется</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {NOT_NEEDED.map(item => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Icon name="X" size={16} style={{ color: "#CBD5E1", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: GRAY }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 15. ПИЛОТ ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 28 }}>
            <Icon name="Rocket" size={14} style={{ color: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Без рисков</span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.1 }}>
            Начните с пилотного запуска
          </h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px" }}>
            Не нужно сразу подключать всех выпускников. Можно начать с одного ближайшего потока и посмотреть реальные результаты.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
            {["1 поток", "промокод", "регистрации", "рекомендации курсов", "переходы на сайт школы"].map((s, i, arr) => (
              <div key={s} style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 100, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>
                  {s}
                </div>
                {i < arr.length - 1 && <Icon name="ArrowRight" size={14} style={{ color: "#CBD5E1", margin: "0 6px" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 16. ПРЕЗЕНТАЦИЯ ── */}
      <section style={{ padding: "88px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Icon name="FileText" size={26} style={{ color: TEAL }} />
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
            Хотите узнать подробнее?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 28px" }}>
            Мы подготовили расширенную презентацию о партнерской программе Промт Диалог — 20 слайдов.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 36 }}>
            {["Модель партнерства", "Возможности для школы", "Возможности для выпускников", "ИИ-рекомендации", "Статистика", "Рейтинги", "Чемпионаты", "Запуск пилота"].map(t => (
              <div key={t} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 12.5, color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
                {t}
              </div>
            ))}
          </div>

          <a href={PRESENTATION_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
            color: "#0F172A", padding: "16px 40px", borderRadius: 2,
            fontSize: 16, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 12px 32px rgba(45,212,191,0.3)",
          }}>
            Скачать презентацию
            <Icon name="Download" size={18} />
          </a>
        </div>
      </section>

      {/* ── 17. ФОРМА ── */}
      <section id="partner-form" style={{ padding: "96px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <SectionLabel>Начнем сотрудничество</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.15 }}>
              Обсудить партнерство
            </h2>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }} className="school-form-wrap">
            <PartnerForm />
          </div>
        </div>
      </section>

      {/* ── 18. ФИНАЛЬНЫЙ ЭКРАН ── */}
      <section style={{ padding: "104px 32px", background: DARK, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.2vw,38px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.35 }}>
            Школа дает профессию.<br />
            <span style={{ color: TEAL }}>Промт Диалог помогает превратить ее в развитие.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 40px" }}>
            Вместе мы можем дать выпускнику не только знания, но и понятный следующий шаг.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={PRESENTATION_URL} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
              color: "#0F172A", padding: "14px 32px", borderRadius: 2,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>
              Скачать презентацию
              <Icon name="Download" size={16} />
            </a>
            <a href="#partner-form" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
              padding: "14px 32px", borderRadius: 2, fontSize: 15,
              fontWeight: 500, textDecoration: "none",
            }}>
              Стать партнером
            </a>
          </div>
        </div>
      </section>
    </>
  );
}