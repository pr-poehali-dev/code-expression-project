import { useState } from "react";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import MassajInterview from "./MassajInterview";

export default function MassajPage() {
  const [showInterview, setShowInterview] = useState(false);

  if (showInterview) {
    return <MassajInterview onBack={() => setShowInterview(false)} />;
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: "#faf9f6", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .mj-tag { display: inline-block; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #c9a96e; margin-bottom: 16px; }
        .mj-divider { width: 48px; height: 1px; background: #c9a96e; margin: 0 auto 28px; }
        .mj-h2 { font-size: clamp(26px, 4vw, 42px); font-weight: 400; color: #1a1a1a; margin: 0 0 20px; line-height: 1.2; }
        .mj-h2 em { font-style: italic; color: #c9a96e; }
        .mj-p { font-family: 'Montserrat', sans-serif; font-size: 15px; font-weight: 400; line-height: 1.8; color: #444; }
        .mj-card { background: #fff; border: 1px solid #ede8df; border-radius: 20px; padding: 28px 24px; }
        .mj-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #c9a96e, #a8834a);
          color: #fff; border: none; border-radius: 50px;
          padding: 18px 48px; font-family: 'Montserrat', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: 1px;
          cursor: pointer; text-transform: uppercase;
          box-shadow: 0 8px 32px rgba(201,169,110,0.35);
          transition: all 0.3s;
        }
        .mj-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(201,169,110,0.5); }
        .mj-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 700px) { .mj-grid-3 { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .mj-grid-3 { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <DokNavbar />

      {/* Герой */}
      <section style={{
        background: "linear-gradient(160deg, #f5f0e8 0%, #faf9f6 55%, #ede8df 100%)",
        padding: "120px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "5%", width: "clamp(150px,22vw,320px)", height: "clamp(150px,22vw,320px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "12%", left: "3%", width: "clamp(100px,14vw,220px)", height: "clamp(100px,14vw,220px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="mj-tag">Dok Диалог · Партнёрские салоны</div>
          <div className="mj-divider" />

          <h1 style={{
            fontFamily: "'Cormorant', 'Georgia', serif",
            fontSize: "clamp(28px, 5.5vw, 62px)", fontWeight: 300,
            lineHeight: 1.15, margin: "0 0 28px", color: "#1a1a1a",
          }}>
            Работа массажистом<br />
            <em style={{ fontStyle: "italic", color: "#c9a96e" }}>в премиальных салонах Москвы</em>
          </h1>

          <p className="mj-p" style={{ fontSize: "clamp(15px,2vw,17px)", maxWidth: 620, margin: "0 auto 16px", color: "#333" }}>
            Мы отбираем специалистов для работы в партнёрских салонах премиум-класса.
          </p>
          <p className="mj-p" style={{ maxWidth: 580, margin: "0 auto 44px", color: "#555" }}>
            Чтобы попасть в список рекомендованных специалистов, нужно пройти короткое профессиональное интервью.
            По итогам мы оценим вашу готовность и дадим обратную связь.
          </p>

          <button className="mj-btn" onClick={() => setShowInterview(true)}>
            Пройти интервью
          </button>

          <div style={{ marginTop: 32, display: "inline-block", background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 12, padding: "14px 22px", maxWidth: 500, width: "100%" }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, fontWeight: 500, color: "#8a6830", lineHeight: 1.7, margin: 0 }}>
              Интервью занимает около 15 минут. Результат — сразу по окончании.
            </p>
          </div>
        </div>
      </section>

      {/* Кто нам нужен */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="mj-tag">Требования</div>
          <div className="mj-divider" />
          <h2 className="mj-h2">Кого мы ищем</h2>
          <p className="mj-p" style={{ maxWidth: 580, margin: "0 auto 48px", color: "#555" }}>
            Нам важен не только опыт рук, но и то, как специалист мыслит, общается с клиентом и относится к своей профессии.
          </p>

          <div className="mj-grid-3">
            {[
              { icon: "◇", title: "Опыт работы", desc: "Не менее года практики в массаже или смежных направлениях работы с телом" },
              { icon: "◇", title: "Клиентский подход", desc: "Умение выстраивать доверие, слышать клиента и создавать долгосрочные отношения" },
              { icon: "◇", title: "Профессиональный рост", desc: "Готовность развиваться, повышать уровень мастерства и работать в высоком стандарте" },
            ].map(item => (
              <div key={item.title} className="mj-card" style={{ textAlign: "left" }}>
                <div style={{ color: "#c9a96e", fontSize: 20, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 20, fontWeight: 500, color: "#1a1a1a", marginBottom: 8, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 400, color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Что даёт попадание в резерв */}
      <section style={{ background: "#1a1a1a", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="mj-tag" style={{ color: "#c9a96e" }}>Для специалиста</div>
            <div className="mj-divider" />
            <h2 className="mj-h2" style={{ color: "#fff" }}>Что даёт статус <em>рекомендованного специалиста</em></h2>
          </div>

          <div className="mj-grid-3">
            {[
              { num: "01", title: "Клиенты с высоким чеком", desc: "Работа в салонах, где средний чек за сеанс значительно выше рыночного" },
              { num: "02", title: "Стабильный поток записей", desc: "Партнёрские салоны обеспечивают загрузку без необходимости самостоятельного поиска клиентов" },
              { num: "03", title: "Профессиональная среда", desc: "Работа рядом с сильными специалистами в эстетичной и комфортной обстановке" },
              { num: "04", title: "Репутация и рекомендации", desc: "Статус специалиста уровня Dok Диалог открывает двери в лучшие заведения города" },
              { num: "05", title: "Рост дохода", desc: "Переход в премиальный сегмент — это кратное увеличение заработка без смены профессии" },
              { num: "06", title: "Развитие карьеры", desc: "Возможность выйти на новый профессиональный уровень и закрепиться в нём" },
            ].map(item => (
              <div key={item.num} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 16, padding: "24px 22px" }}>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 300, color: "#c9a96e", opacity: 0.7, lineHeight: 1, marginBottom: 10 }}>{item.num}</div>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 19, fontWeight: 500, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как проходит отбор */}
      <section style={{ background: "#f5f0e8", padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div className="mj-tag">Процесс</div>
          <div className="mj-divider" />
          <h2 className="mj-h2">Как проходит отбор</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 40, textAlign: "left" }}>
            {[
              { step: "1", text: "Вы проходите короткое профессиональное интервью с нашим ИИ-ассистентом Борисом" },
              { step: "2", text: "Система анализирует ваши ответы и оценивает профессиональный уровень" },
              { step: "3", text: "Вы сразу получаете результат — готовы ли вы к работе в премиальном сегменте" },
              { step: "4", text: "Если результат положительный — мы свяжемся с вами для следующего шага" },
            ].map(item => (
              <div key={item.step} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #ede8df" }}>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 600, color: "#c9a96e", lineHeight: 1, flexShrink: 0, width: 36 }}>{item.step}</div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 400, color: "#444", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.3 }}>
            Готовы узнать, подходите ли вы?
          </div>
          <p className="mj-p" style={{ color: "rgba(255,255,255,0.72)", margin: "0 auto 40px", maxWidth: 460 }}>
            Пройдите интервью — и мы дадим честную обратную связь о вашей готовности к работе в премиальном сегменте.
          </p>
          <button className="mj-btn" onClick={() => setShowInterview(true)}>
            Начать интервью
          </button>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
