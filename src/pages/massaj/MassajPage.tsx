import { useState, useEffect } from "react";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import MassajInterview from "./MassajInterview";

const STORAGE_KEY = "massaj_interview_state_v2";

function hasSavedProgress(): boolean {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (!r) return false;
    const parsed = JSON.parse(r);
    if (parsed._savedAt && Date.now() - parsed._savedAt > 86400000) return false;
    return parsed.phase === "chat" && parsed.messages?.length > 0;
  } catch { return false; }
}

export default function MassajPage() {
  const [showInterview, setShowInterview] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setHasSaved(hasSavedProgress());
  }, []);

  if (showInterview) {
    return <MassajInterview onBack={() => { setShowInterview(false); setHasSaved(false); }} />;
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "#faf9f6", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .mj-tag { display: inline-block; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #c9a96e; margin-bottom: 16px; }
        .mj-divider { width: 48px; height: 1px; background: #c9a96e; margin: 0 auto 28px; }
        .mj-h2 { font-size: clamp(22px, 4vw, 42px); font-weight: 400; color: #1a1a1a; margin: 0 0 20px; line-height: 1.25; }
        .mj-h2 em { font-style: italic; color: #c9a96e; }
        .mj-p { font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 400; line-height: 1.8; color: #444; }
        .mj-card { background: #fff; border: 1px solid #ede8df; border-radius: 20px; padding: 24px 20px; }
        .mj-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          background: linear-gradient(135deg, #c9a96e, #a8834a);
          color: #fff; border: none; border-radius: 50px;
          padding: 16px 40px; font-family: 'Montserrat', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: 1px;
          cursor: pointer; text-transform: uppercase; width: 100%; max-width: 340px;
          box-shadow: 0 8px 32px rgba(201,169,110,0.35);
          transition: all 0.3s;
        }
        .mj-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(201,169,110,0.5); }
        .mj-section { padding: 56px 20px; }
        @media (min-width: 640px) { .mj-section { padding: 72px 24px; } }

        .mj-grid-3 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 540px) { .mj-grid-3 { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 900px) { .mj-grid-3 { grid-template-columns: repeat(3, 1fr); } }

        .mj-grid-6 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 480px) { .mj-grid-6 { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 900px) { .mj-grid-6 { grid-template-columns: repeat(3, 1fr); } }

        .mj-hero { padding: 100px 20px 64px; }
        @media (min-width: 640px) { .mj-hero { padding: 120px 24px 80px; } }
      `}</style>

      <DokNavbar />

      {/* Герой */}
      <section className="mj-hero" style={{
        background: "linear-gradient(160deg, #f5f0e8 0%, #faf9f6 55%, #ede8df 100%)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "5%", width: "clamp(100px,22vw,320px)", height: "clamp(100px,22vw,320px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "12%", left: "3%", width: "clamp(80px,14vw,220px)", height: "clamp(80px,14vw,220px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="mj-tag">Dok Диалог · Партнёрские салоны</div>
          <div className="mj-divider" />

          <h1 style={{
            fontFamily: "'Cormorant', 'Georgia', serif",
            fontSize: "clamp(26px, 6vw, 62px)", fontWeight: 300,
            lineHeight: 1.15, margin: "0 0 24px", color: "#1a1a1a",
          }}>
            Работа массажистом<br />
            <em style={{ fontStyle: "italic", color: "#c9a96e" }}>в премиальных салонах Москвы</em>
          </h1>

          <p className="mj-p" style={{ fontSize: "clamp(14px, 2vw, 17px)", maxWidth: 580, margin: "0 auto 14px", color: "#333" }}>
            Мы отбираем специалистов для работы в партнёрских салонах премиум-класса.
          </p>
          <p className="mj-p" style={{ fontSize: 14, maxWidth: 540, margin: "0 auto 36px", color: "#555" }}>
            Чтобы попасть в список рекомендованных специалистов, нужно пройти короткое профессиональное интервью. По итогам мы оценим вашу готовность и дадим обратную связь.
          </p>

          {hasSaved && (
            <div style={{ marginBottom: 20, background: "rgba(74,124,89,0.1)", border: "1px solid rgba(74,124,89,0.3)", borderRadius: 14, padding: "16px 20px", maxWidth: 420, margin: "0 auto 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 600, color: "#3a6b4a", marginBottom: 10 }}>
                У вас есть незавершённое интервью
              </div>
              <button onClick={() => setShowInterview(true)} style={{ background: "linear-gradient(135deg,#4a7c59,#3a6b4a)", color: "#fff", border: "none", borderRadius: 50, padding: "11px 28px", fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.5px" }}>
                Продолжить с того места →
              </button>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="mj-btn" onClick={() => {
              if (hasSaved) { try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } }
              setShowInterview(true);
            }}>
              {hasSaved ? "Начать заново" : "Пройти интервью"}
            </button>
          </div>

          <div style={{ marginTop: 24, background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 12, padding: "14px 20px", maxWidth: 420, margin: "24px auto 0" }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 500, color: "#8a6830", lineHeight: 1.7, margin: 0 }}>
              Интервью занимает около 15 минут. Результат — сразу по окончании.
            </p>
          </div>
        </div>
      </section>

      {/* Кто нам нужен */}
      <section className="mj-section" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="mj-tag">Требования</div>
          <div className="mj-divider" />
          <h2 className="mj-h2">Кого мы ищем</h2>
          <p className="mj-p" style={{ maxWidth: 540, margin: "0 auto 40px", color: "#555", fontSize: 14 }}>
            Нам важен не только опыт рук, но и то, как специалист мыслит, общается с клиентом и относится к своей профессии.
          </p>

          <div className="mj-grid-3">
            {[
              { icon: "◇", title: "Опыт работы", desc: "Не менее года практики в массаже или смежных направлениях работы с телом" },
              { icon: "◇", title: "Клиентский подход", desc: "Умение выстраивать доверие, слышать клиента и создавать долгосрочные отношения" },
              { icon: "◇", title: "Профессиональный рост", desc: "Готовность развиваться, повышать уровень мастерства и работать в высоком стандарте" },
            ].map(item => (
              <div key={item.title} className="mj-card" style={{ textAlign: "left" }}>
                <div style={{ color: "#c9a96e", fontSize: 18, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 19, fontWeight: 500, color: "#1a1a1a", marginBottom: 8, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 400, color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Что даёт статус */}
      <section className="mj-section" style={{ background: "#1a1a1a" }}>
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="mj-tag" style={{ color: "#c9a96e" }}>Для специалиста</div>
            <div className="mj-divider" />
            <h2 className="mj-h2" style={{ color: "#fff" }}>Что даёт статус <em>рекомендованного специалиста</em></h2>
          </div>

          <div className="mj-grid-6">
            {[
              { num: "01", title: "Клиенты с высоким чеком", desc: "Работа в салонах, где средний чек за сеанс значительно выше рыночного" },
              { num: "02", title: "Стабильный поток записей", desc: "Партнёрские салоны обеспечивают загрузку без самостоятельного поиска клиентов" },
              { num: "03", title: "Профессиональная среда", desc: "Работа рядом с сильными специалистами в эстетичной и комфортной обстановке" },
              { num: "04", title: "Репутация и рекомендации", desc: "Статус Dok Диалог открывает двери в лучшие заведения города" },
              { num: "05", title: "Рост дохода", desc: "Переход в премиальный сегмент — кратное увеличение заработка без смены профессии" },
              { num: "06", title: "Развитие карьеры", desc: "Возможность выйти на новый профессиональный уровень и закрепиться в нём" },
            ].map(item => (
              <div key={item.num} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 16, padding: "20px 18px" }}>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 300, color: "#c9a96e", opacity: 0.7, lineHeight: 1, marginBottom: 8 }}>{item.num}</div>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как проходит отбор */}
      <section className="mj-section" style={{ background: "#f5f0e8" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div className="mj-tag">Процесс</div>
          <div className="mj-divider" />
          <h2 className="mj-h2">Как проходит отбор</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36, textAlign: "left" }}>
            {[
              { step: "1", text: "Вы проходите короткое профессиональное интервью с нашим ИИ-ассистентом Борисом" },
              { step: "2", text: "Система анализирует ваши ответы и оценивает профессиональный уровень" },
              { step: "3", text: "Вы сразу получаете результат — готовы ли вы к работе в премиальном сегменте" },
              { step: "4", text: "Если результат положительный — мы свяжемся с вами для следующего шага" },
            ].map(item => (
              <div key={item.step} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #ede8df" }}>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 28, fontWeight: 600, color: "#c9a96e", lineHeight: 1, flexShrink: 0, width: 28 }}>{item.step}</div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 400, color: "#444", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mj-section" style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(22px, 4vw, 40px)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.3 }}>
            Готовы узнать, подходите ли вы?
          </div>
          <p className="mj-p" style={{ color: "rgba(255,255,255,0.72)", margin: "0 auto 36px", maxWidth: 420, fontSize: 14 }}>
            Пройдите интервью — и мы дадим честную обратную связь о вашей готовности к работе в премиальном сегменте.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="mj-btn" onClick={() => setShowInterview(true)}>
              Начать интервью
            </button>
          </div>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}