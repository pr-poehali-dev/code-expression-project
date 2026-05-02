import Icon from "@/components/ui/icon";
import { ACCENT, GOLD, GOLD_BG, RETAIL_PRICE, DISCOUNT_PRICE, COURSES, OUTCOMES } from "./KollektsiyaShared";

export default function KollektsiyaContent() {
  return (
    <>
      {/* ── ЧТО ВЫ ПОЛУЧИТЕ ──────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, marginBottom: 12, letterSpacing: 0.5 }}>
              РЕЗУЛЬТАТ ОБУЧЕНИЯ
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              Что вы получите<br />после прохождения коллекции
            </h2>
          </div>

          <div className="koll-outcomes-grid">
            {OUTCOMES.map((o, i) => (
              <div key={i} style={{
                background: "#fff",
                borderRadius: 18,
                padding: "28px 24px",
                border: "1px solid #e8e8e4",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${ACCENT}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <Icon name={o.icon} size={22} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{o.title}</div>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{o.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── КУРСЫ КОЛЛЕКЦИИ ───────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, marginBottom: 12, letterSpacing: 0.5 }}>
              7 КУРСОВ В ОДНОМ
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              Что входит в коллекцию
            </h2>
            <p style={{ fontSize: 16, color: "#888", marginTop: 12 }}>Полный путь от первого сеанса до стабильного потока клиентов</p>
          </div>

          <div className="koll-courses-grid">
            {COURSES.map((c) => (
              <a
                key={c.id}
                href={c.url}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: "24px",
                  border: "1px solid #e8e8e4",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "";
                    el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${c.tagColor}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon name={c.icon} size={20} style={{ color: c.tagColor }} />
                    </div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: c.tagColor,
                      background: `${c.tagColor}12`,
                      padding: "3px 10px", borderRadius: 20,
                      letterSpacing: 0.3,
                    }}>
                      {c.tag}
                    </div>
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>{c.subtitle}</div>

                  <ul style={{ margin: "0 0 auto", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {c.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#555", lineHeight: 1.4 }}>
                        <span style={{ color: c.tagColor, marginTop: 2, flexShrink: 0 }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    marginTop: 18, paddingTop: 16,
                    borderTop: "1px solid #f0f0ec",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 14, color: "#aaa", textDecoration: "line-through" }}>{c.price}</span>
                    <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="CheckCircle" size={13} />
                      Входит в коллекцию
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПОЧЕМУ КОЛЛЕКЦИЯ ВЫГОДНЕЕ ─────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: GOLD_BG,
            border: `1.5px solid ${GOLD}44`,
            borderRadius: 24,
            padding: "48px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }} className="koll-promo-inner">
            <style>{`.koll-promo-inner { } @media (max-width: 700px) { .koll-promo-inner { grid-template-columns: 1fr !important; } }`}</style>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: GOLD, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                <Icon name="TrendingDown" size={16} />
                ПОЧЕМУ ЭТО ВЫГОДНО
              </div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 20px" }}>
                7 курсов дешевле,<br />чем 2 по отдельности
              </h3>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: 0 }}>
                При покупке каждого курса отдельно вы заплатите <strong>97 080 ₽</strong>. В коллекции вы получаете все 7 курсов за <strong>{RETAIL_PRICE.toLocaleString("ru-RU")} ₽</strong> — это скидка <strong>20%</strong> за оптовую покупку. А во время акции — ещё выгоднее.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "7 курсов по отдельности", value: "97 080 ₽", strike: true, color: "#999", bold: false },
                { label: "Коллекция (−20% опт)", value: `${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`, strike: false, color: "#1a1a1a", bold: false },
                { label: "Акционная цена (−70%)", value: `${DISCOUNT_PRICE.toLocaleString("ru-RU")} ₽`, strike: false, color: ACCENT, bold: true },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px",
                  background: row.bold ? `${ACCENT}10` : "#fff",
                  borderRadius: 12,
                  border: row.bold ? `1.5px solid ${ACCENT}40` : "1px solid #e8e8e4",
                }}>
                  <span style={{ fontSize: 14, color: "#555" }}>{row.label}</span>
                  <span style={{
                    fontSize: row.bold ? 18 : 15,
                    fontWeight: row.bold ? 700 : 600,
                    color: row.color,
                    textDecoration: row.strike ? "line-through" : "none",
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── КОМУ ПОДХОДИТ ─────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              Коллекция создана для вас, если...
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="koll-for-grid">
            <style>{`.koll-for-grid { } @media (max-width: 600px) { .koll-for-grid { grid-template-columns: 1fr !important; } }`}</style>
            {[
              { icon: "Sprout", text: "Вы только начинаете и хотите освоить профессию с нуля, без медобразования" },
              { icon: "TrendingUp", text: "Вы уже делаете массаж, но хотите поднять чек и расширить список услуг" },
              { icon: "UserPlus", text: "Клиентов мало или нет совсем — хотите выстроить стабильный поток" },
              { icon: "Globe", text: "Хотите работать с разными аудиториями: беременные, спортсмены, клиенты с болью" },
              { icon: "Wallet", text: "Понимаете, что выгоднее купить всё сейчас и учиться в своём темпе" },
              { icon: "BookOpen", text: "Ищете полноценную систему, а не разрозненные уроки" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                background: "#fff", borderRadius: 14, padding: "18px 20px",
                border: "1px solid #e8e8e4",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon name={item.icon} size={17} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 15, color: "#444", lineHeight: 1.6 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
