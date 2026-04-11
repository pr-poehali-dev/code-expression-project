import Icon from "@/components/ui/icon";
import { ACCENT, h2style, BtnPay, BtnBook, AccordionItem } from "./CoiShared";

export default function CoiPricingSection() {
  return (
    <>
      {/* ── БЛОК ОПЛАТЫ ── */}
      <section id="pay" style={{ padding: "80px 0 80px", marginTop: 80, background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Выберите формат участия</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }} className="pricing-grid">

            {/* Card 1 — Pay */}
            <div className="coi-pricing-card" style={{
              background: "linear-gradient(135deg, hsl(185,85%,97%) 0%, #fff 100%)",
              border: `2px solid ${ACCENT}`,
              borderRadius: 20, padding: "32px 28px",
              position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  background: ACCENT, color: "#fff",
                  fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: 0.5,
                }}>ЛУЧШИЙ ВЫБОР</span>
              </div>

              <div style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
                Оплатить полностью и сэкономить
              </div>

              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 15, color: "#bbb", textDecoration: "line-through" }}>15 000 руб.</span>
              </div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#1a1a1a", lineHeight: 1, marginBottom: 8 }}>9 900 <span style={{ fontSize: 24 }}>руб.</span></div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#dcfce7", color: "#15803d",
                fontSize: 13, fontWeight: 700, padding: "5px 12px", borderRadius: 8, marginBottom: 24,
              }}>
                <Icon name="TrendingDown" size={14} />
                Вы экономите 5 100 руб.
              </div>

              <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Место закрепляется сразу",
                  "Без доплат и сюрпризов",
                  "Фиксация минимальной цены",
                  "Полный доступ ко всем материалам",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#333" }}>
                    <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "auto" }}>
                <BtnPay style={{ width: "100%", textAlign: "center", padding: "16px 24px", fontSize: 16, borderRadius: 12 }}>
                  Оплатить 9 900 руб.
                </BtnPay>
                <p style={{ fontSize: 12, color: "#888", margin: "12px 0 0", textAlign: "center", lineHeight: 1.5 }}>
                  Вы фиксируете минимальную цену и гарантируете участие
                </p>
              </div>
            </div>

            {/* Card 2 — Book */}
            <div id="book" className="coi-pricing-card" style={{
              background: "#fafaf8",
              border: "1.5px solid #e8e8e4",
              borderRadius: 20, padding: "32px 28px",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
                Забронировать место
              </div>

              <div style={{ fontSize: 36, fontWeight: 800, color: "#1a1a1a", lineHeight: 1, marginBottom: 8 }}>2 000 <span style={{ fontSize: 20 }}>руб.</span></div>

              <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
                Останется доплатить:
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#fef9c3", color: "#854d0e",
                fontSize: 13, fontWeight: 600, padding: "5px 12px", borderRadius: 8, marginBottom: 24,
              }}>
                <Icon name="AlertCircle" size={14} />
                13 000 руб. (без скидки)
              </div>

              <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { text: "Фиксация места", ok: true },
                  { text: "Доплата 13 000 руб. до события", ok: false },
                  { text: "Итоговая стоимость выше", ok: false },
                ].map((item) => (
                  <li key={item.text} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#555" }}>
                    <span style={{ color: item.ok ? ACCENT : "#bbb", flexShrink: 0, marginTop: 1 }}>{item.ok ? "✓" : "–"}</span>
                    {item.text}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "auto" }}>
                <BtnBook style={{ width: "100%", textAlign: "center", padding: "15px 24px", fontSize: 15, borderRadius: 12 }}>
                  Забронировать
                </BtnBook>
                <p style={{ fontSize: 12, color: "#aaa", margin: "12px 0 0", textAlign: "center", lineHeight: 1.5 }}>
                  Подходит, если хотите занять место сейчас и оплатить позже
                </p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="coi-compare-wrap" style={{ background: "#f8f8f6", borderRadius: 16, padding: "28px 32px", border: "1px solid #e8e8e4" }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: "#1a1a1a", textAlign: "center" }}>Сравнение вариантов</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="compare-grid">
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Полная оплата</div>
                {[
                  "Экономия 5 100 руб.",
                  "Место закреплено сразу",
                  "Без доплат",
                  "Лучший выбор",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#333", marginBottom: 8 }}>
                    <span style={{ color: ACCENT }}>✔</span> {t}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#999", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Бронь</div>
                {[
                  "Только фиксация места",
                  "Доплата 13 000 руб.",
                  "Итог дороже",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#888", marginBottom: 8 }}>
                    <span style={{ color: "#ccc" }}>–</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Triggers */}
          <div style={{ display: "flex", gap: 16, marginTop: 28, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "Clock", text: "Ограниченное количество мест" },
              { icon: "Users", text: "Группа до 10–12 человек" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#fff", border: "1px solid #e8e8e4",
                borderRadius: 12, padding: "12px 20px",
                fontSize: 14, fontWeight: 600, color: "#444",
              }}>
                <Icon name={icon} size={18} style={{ color: ACCENT }} />
                {text}
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#888" }}>
            Осталось <strong style={{ color: "#1a1a1a" }}>7 мест</strong> · Уже записались <strong style={{ color: "#1a1a1a" }}>5 человек</strong>
          </div>
        </div>
      </section>

      {/* ── АДРЕС ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div className="coi-address-wrap" style={{
            background: "#fff",
            border: "1px solid #e8e8e4",
            borderRadius: 20,
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }}>
                <Icon name="MapPin" size={28} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Адрес мероприятия</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", fontFamily: "Cormorant, serif", lineHeight: 1.3 }}>
                  Москва, Волков пер., д. 4
                </div>
              </div>
            </div>
            <a
              href="https://yandex.ru/maps/?text=Москва,+Волков+переулок,+4"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 24px", borderRadius: 12,
                border: `1.5px solid ${ACCENT}`, background: "transparent",
                color: ACCENT, fontSize: 14, fontWeight: 600,
                textDecoration: "none", fontFamily: "Montserrat, sans-serif",
                transition: "all 0.18s", whiteSpace: "nowrap", flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${ACCENT}12`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              <Icon name="Navigation" size={16} />
              Как добраться
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Частые вопросы</h2>
          <AccordionItem title="Для кого подходит интенсив?">
            Для практикующих массажистов, которые хотят увеличить доход, выстроить поток клиентов или разобраться, почему практика «застыла». Подойдёт и новичкам, которые хотят сразу выстроить правильную систему.
          </AccordionItem>
          <AccordionItem title="Нужен ли опыт?">
            Опыт в массаже желателен, но необязателен. Главное — желание разобраться в системе и готовность работать.
          </AccordionItem>
          <AccordionItem title="Что будет после оплаты?">
            Мы свяжемся с вами в течение 24 часов, уточним детали и пришлём всю информацию о встрече.
          </AccordionItem>
          <AccordionItem title="Чем отличается бронь от полной оплаты?">
            При брони вы фиксируете место, но доплачиваете 13 000 руб. до мероприятия — итого 15 000 руб. При полной оплате сейчас — 9 900 руб. Экономия 5 100 руб.
          </AccordionItem>
          <AccordionItem title="Можно ли вернуть деньги?">
            Да, если вы отменяете участие не менее чем за 7 дней до мероприятия — возвращаем полную сумму.
          </AccordionItem>
        </div>
      </section>

    </>
  );
}