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
        .mj-list { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 400; color: #444; list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .mj-list li { display: flex; align-items: flex-start; gap: 10px; line-height: 1.6; }
        .mj-list li::before { content: '—'; color: #c9a96e; flex-shrink: 0; font-weight: 600; }
        .mj-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
        .mj-score-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
        @media (max-width: 640px) {
          .mj-grid { grid-template-columns: 1fr; }
          .mj-score-grid { grid-template-columns: 1fr 1fr; }
        }
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

        <div style={{ maxWidth: 740, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="mj-tag">Dok Диалог · Оценка специалиста</div>
          <div className="mj-divider" />

          <h1 style={{
            fontFamily: "'Cormorant', 'Georgia', serif",
            fontSize: "clamp(28px, 5.5vw, 64px)", fontWeight: 300,
            lineHeight: 1.15, margin: "0 0 24px", color: "#1a1a1a",
          }}>
            Хотите работать с платёжеспособными клиентами<br />
            <em style={{ fontStyle: "italic", color: "#c9a96e" }}>и получать больше рекомендаций?</em>
          </h1>

          <p className="mj-p" style={{ fontSize: "clamp(15px,2vw,17px)", maxWidth: 600, margin: "0 auto 20px", color: "#333" }}>
            Пройдите профессиональное интервью.
          </p>
          <p className="mj-p" style={{ maxWidth: 580, margin: "0 auto 40px", color: "#555" }}>
            Система оценит вашу готовность к работе в премиальном сегменте и возможность дальнейшего трудоустройства
            в партнёрские салоны проекта «Dok Диалог».
          </p>

          <button className="mj-btn" onClick={() => setShowInterview(true)}>
            Пройти оценку
          </button>
        </div>
      </section>

      {/* Что вы получите */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="mj-tag">После оценки</div>
          <div className="mj-divider" />
          <h2 className="mj-h2">После прохождения вы получите</h2>

          <div className="mj-grid" style={{ marginTop: 40 }}>
            {[
              { icon: "◇", title: "Анализ уровня готовности", desc: "Объективная оценка ваших навыков и мышления по 7 профессиональным критериям" },
              { icon: "◇", title: "Рекомендации по развитию", desc: "Конкретные направления для роста в сторону премиального сегмента" },
              { icon: "◇", title: "Понимание сильных сторон", desc: "Что у вас уже хорошо развито и что стоит усилить" },
              { icon: "◇", title: "Возможность попасть в резерв", desc: "Перспективные специалисты могут быть рекомендованы салонам-партнёрам" },
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

      {/* О чём интервью */}
      <section style={{ background: "#1a1a1a", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="mj-tag" style={{ color: "#c9a96e" }}>Структура</div>
            <div className="mj-divider" />
            <h2 className="mj-h2" style={{ color: "#fff" }}>О чём вас спросят</h2>
          </div>

          <div className="mj-grid">
            {[
              {
                num: "01",
                title: "Знакомство",
                items: ["О вас и вашей практике", "Опыт работы с клиентами", "Почему выбрали эту сферу"],
              },
              {
                num: "02",
                title: "Работа с клиентами",
                items: ["Почему клиент возвращается", "Что важнее: техника или доверие", "Как выстраиваете отношения"],
              },
              {
                num: "03",
                title: "Отношение к обучению",
                items: ["Последнее обучение", "Планы развития на год", "Готовность инвестировать в себя"],
              },
              {
                num: "04",
                title: "Премиальный сегмент",
                items: ["Отличие работы с платёжеспособным клиентом", "Ограничения в ценообразовании", "Отношение к высокому чеку"],
              },
              {
                num: "05",
                title: "Профессиональный рост",
                items: ["Что мешает зарабатывать больше", "Готовность к изменениям", "Отношение к системному обучению"],
              },
            ].map(block => (
              <div key={block.num} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 16, padding: "24px 22px" }}>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 32, fontWeight: 300, color: "#c9a96e", opacity: 0.7, lineHeight: 1, marginBottom: 8 }}>{block.num}</div>
                <div style={{ fontFamily: "'Cormorant', serif", fontSize: 20, fontWeight: 500, color: "#fff", marginBottom: 14 }}>{block.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                  {block.items.map(i => (
                    <li key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#c9a96e", flexShrink: 0 }}>—</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* Параметры оценки */}
            <div style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.05))", border: "1px solid rgba(201,169,110,0.35)", borderRadius: 16, padding: "24px 22px" }}>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 20, fontWeight: 500, color: "#c9a96e", marginBottom: 14 }}>Критерии оценки</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {["Коммуникация · 0–10", "Грамотность речи · 0–10", "Осознанность · 0–10", "Готовность обучаться · 0–10", "Клиентоориентированность · 0–10", "Потенциал роста · 0–10", "Соответствие философии · 0–10"].map(i => (
                  <li key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{i}</li>
                ))}
              </ul>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(201,169,110,0.2)", fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: "#c9a96e" }}>
                Максимум — 70 баллов
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Варианты результата */}
      <section style={{ background: "#faf9f6", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="mj-tag">Результаты</div>
          <div className="mj-divider" />
          <h2 className="mj-h2">Три варианта результата</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 40, textAlign: "left" }}>
            <div className="mj-card" style={{ borderTop: "3px solid #4a7c59" }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#4a7c59", textTransform: "uppercase", marginBottom: 8 }}>60–70 баллов</div>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 500, color: "#1a1a1a", marginBottom: 12 }}>Перспективный специалист</div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 400, color: "#555", lineHeight: 1.7, margin: 0 }}>
                Высокий потенциал для работы в премиальном сегменте. Рекомендуем пройти обучение по системе «Dok Диалог» для включения в кадровый резерв.
              </p>
            </div>
            <div className="mj-card" style={{ borderTop: "3px solid #c9a96e" }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#a87c2a", textTransform: "uppercase", marginBottom: 8 }}>45–59 баллов</div>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 500, color: "#1a1a1a", marginBottom: 12 }}>Хороший потенциал</div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 400, color: "#555", lineHeight: 1.7, margin: 0 }}>
                Хорошая база, но для работы в премиальном сегменте рекомендуется развить навыки коммуникации, ведения клиента и системного подхода.
              </p>
            </div>
            <div className="mj-card" style={{ borderTop: "3px solid #b5b5b5" }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", color: "#888", textTransform: "uppercase", marginBottom: 8 }}>Менее 45 баллов</div>
              <div style={{ fontFamily: "'Cormorant', serif", fontSize: 22, fontWeight: 500, color: "#1a1a1a", marginBottom: 12 }}>Требуется развитие</div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 400, color: "#555", lineHeight: 1.7, margin: 0 }}>
                Рекомендуем уделить внимание профессиональному развитию. После обучения можно пройти оценку повторно.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 24, padding: "18px 24px", borderRadius: 12, background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            <p className="mj-p" style={{ fontSize: 13, color: "#8a6830", margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>
              После успешного прохождения обучения специалист может быть включён в кадровый резерв проекта
              и рекомендован салонам-партнёрам при наличии подходящих вакансий.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Cormorant', serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 300, color: "#fff", marginBottom: 16, lineHeight: 1.3 }}>
            Готовы узнать свой уровень?
          </div>
          <p className="mj-p" style={{ color: "rgba(255,255,255,0.75)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Интервью занимает около 15 минут. Результат — сразу после завершения.
          </p>
          <button className="mj-btn" onClick={() => setShowInterview(true)}>
            Начать оценку
          </button>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
