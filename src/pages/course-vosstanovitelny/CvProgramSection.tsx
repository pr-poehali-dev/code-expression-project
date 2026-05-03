import Icon from "@/components/ui/icon";
import { ACCENT, MODULES, REVIEWS, AccordionItem, h2style } from "./CvShared";

export default function CvProgramSection() {
  return (
    <>
      {/* ── 5. ДЛЯ КОГО ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Для кого этот курс</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="cv-2col">
            {[
              { icon: "UserCheck", text: "Практикующие массажисты" },
              { icon: "Activity", text: "Специалисты, работающие с болями" },
              { icon: "TrendingUp", text: "Мастера, которые хотят повысить чек" },
              { icon: "ArrowUpRight", text: "Те, кто хочет перейти на более сложных клиентов" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14,
                padding: "20px 24px", display: "flex", alignItems: "center", gap: 14,
                fontSize: 15, fontWeight: 500, color: "#333",
              }}>
                <Icon name={icon} size={22} style={{ color: ACCENT, flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. РЕЗУЛЬТАТ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
            borderRadius: 20, padding: "48px", color: "#fff",
          }} className="cv-result-pad">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, margin: "0 0 8px" }}>
              После прохождения курса вы:
            </h2>
            <p style={{ opacity: 0.75, margin: "0 0 32px", fontSize: 15 }}>Конкретный результат, который вы получите</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="cv-2col">
              {[
                "Владеете мануальной терапией позвоночника и суставов",
                "Работаете с внутренними органами через висцеральные техники",
                "Применяете остеопатические приёмы на практике",
                "Регулируете вегетативную нервную систему клиента",
                "Уверенно работаете со сложными случаями и болевыми состояниями",
                "Повышаете чек и выходите на более платёжеспособных клиентов",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, fontWeight: 500 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, marginTop: 1 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. ПРОГРАММА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Программа курса</h2>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8e4", padding: "8px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            {MODULES.map((m, i) => (
              <AccordionItem key={i} title={m.title}>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {m.lessons.map((l) => (
                    <li key={l} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#555" }}>
                      <Icon name="PlayCircle" size={15} style={{ color: ACCENT, flexShrink: 0 }} />
                      {l}
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. ФОРМАТ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Формат обучения</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }} className="cv-6col">
            {[
              { icon: "Wifi", text: "Онлайн 24/7" },
              { icon: "Video", text: "Видео-уроки" },
              { icon: "Eye", text: "Демонстрации" },
              { icon: "BookOpen", text: "Задания" },
              { icon: "ClipboardCheck", text: "Тестирование" },
              { icon: "Award", text: "Сертификат" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14,
                padding: "20px 12px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 10, textAlign: "center",
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={icon} size={20} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#444", lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. ОТЗЫВЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Результаты студентов</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="cv-2col">
            {REVIEWS.map((r) => (
              <div key={r.name} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 18,
                padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <img src={r.img} alt={r.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                    <div style={{ color: "#f59e0b", fontSize: 14 }}>★★★★★</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65, margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. РОСТ ДОХОДА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: `2px solid ${ACCENT}30`, borderRadius: 20, padding: "44px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }} className="cv-solution-pad">
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>После внедрения навыков</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, margin: "0 0 28px", color: "#1a1a1a" }}>
              Ваш доход растёт системно
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="cv-2col">
              {[
                { icon: "BadgeDollarSign", title: "Повышается стоимость сеанса", text: "Работа со сложными случаями даёт право брать больше" },
                { icon: "Heart", title: "Увеличивается доверие клиентов", text: "Результат виден — клиент возвращается и рекомендует" },
                { icon: "Users", title: "Появляются рекомендации", text: "Сарафанное радио работает, когда есть ощутимый эффект" },
                { icon: "CalendarCheck", title: "Формируется стабильная запись", text: "Постоянный поток без постоянного поиска клиентов" },
              ].map(({ icon, title, text }) => (
                <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={icon} size={20} style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}