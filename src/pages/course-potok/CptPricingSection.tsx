import Icon from "@/components/ui/icon";
import { ACCENT, COURSE_URL, h2style, FAQS, AccordionItem, BtnStart } from "./CptShared";

export default function CptPricingSection() {
  return (
    <>
      {/* ── 10. СТОИМОСТЬ / ТАРИФЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Выберите тариф</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="cpt-4col">

            {/* Бесплатный */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Бесплатный</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 4 }}>0 ₽</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Навсегда бесплатно</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 10 }}>«Массажист 2.0: Создание и Продвижение Личного Бренда»</div>
              <ul style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 20px", flex: 1, paddingLeft: 16 }}>
                <li>Введение в интернет-маркетинг</li>
                <li>Путь пользователя и маркетинговая воронка</li>
                <li>Работа с драйверами и барьерами</li>
                <li>Развитие личного бренда</li>
              </ul>
              <a href={COURSE_URL} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: "#22c55e", color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >Начать бесплатно</a>
            </div>

            {/* Старт */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Стартовый</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 4 }}>4 900 ₽</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Полная оплата</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 10 }}>«Массажист 2.0: Создание и Продвижение Личного Бренда»</div>
              <ul style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 20px", flex: 1, paddingLeft: 16 }}>
                <li>Постановка бизнес-задач и KPI</li>
                <li>Аналитика в Google Таблицах, юнит-экономика</li>
                <li>Позиционирование и бренд-стратегия</li>
                <li>Квиз-маркетинг и таргетированная реклама</li>
                <li>SMM, контент, блогеры, купонаторы</li>
              </ul>
              <a href="https://school.brossok.ru/buy/11" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: ACCENT, color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >Купить курс</a>
            </div>

            {/* Профи */}
            <div style={{ background: "#fff", border: `2px solid ${ACCENT}`, borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", boxShadow: `0 8px 32px ${ACCENT}22`, position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>Популярный</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Профи</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 4 }}>14 900 ₽</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Полная оплата</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 10 }}>«Массажный Бизнес 2.0: Продвижение и Оптимизация»</div>
              <ul style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 20px", flex: 1, paddingLeft: 16 }}>
                <li>Всё из тарифа «Старт»</li>
                <li>SEO-оптимизация сайта от А до Я</li>
                <li>Контекстная реклама и Яндекс Директ</li>
                <li>VK Реклама и Telegram Ads</li>
                <li>Медиапланирование и воронки продаж</li>
              </ul>
              <a href="https://school.brossok.ru/buy/12" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: ACCENT, color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >Купить курс</a>
            </div>

            {/* Эксперт */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Эксперт</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 4 }}>34 900 ₽</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Полная оплата</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 10 }}>«Маркетинг: От Основ до Эксперта»</div>
              <ul style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 20px", flex: 1, paddingLeft: 16 }}>
                <li>Всё из тарифов «Старт» и «Профи»</li>
                <li>Основы веб-аналитики</li>
                <li>Проектирование аналитики и отслеживание целей</li>
                <li>Путь пользователя и типы событий</li>
              </ul>
              <a href="https://school.brossok.ru/buy/13" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: ACCENT, color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >Купить курс</a>
            </div>

          </div>
        </div>
      </section>

      {/* ── 11. СНЯТИЕ ВОЗРАЖЕНИЙ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="cpt-4col">
            {[
              { icon: "Baby", title: "Подходит новичкам", text: "Система создана с нуля под начинающих" },
              { icon: "Zap", title: "Внедряйте сразу", text: "Первые шаги применяются уже в процессе" },
              { icon: "GraduationCap", title: "Без медобразования", text: "Курс про бизнес, а не про медицину" },
              { icon: "ShieldCheck", title: "Проверено практикой", text: "Система основана на реальных результатах студентов" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16,
                padding: "24px 20px", textAlign: "center",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Icon name={icon} size={22} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. FAQ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Частые вопросы</h2>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8e4", padding: "8px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} title={f.q}>
                <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.65 }}>{f.a}</p>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. ФИНАЛЬНЫЙ CTA ── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2 }}>
            Начните получать стабильный поток клиентов и доход уже с первого месяца
          </h2>
          <p style={{ fontSize: 16, color: "#666", margin: "0 0 36px" }}>
            Система, которая работает — даже если сейчас поток нулевой
          </p>
          <BtnStart style={{ padding: "16px 40px", fontSize: 16 }} className="cpt-hero-btn">Начать бесплатно</BtnStart>
        </div>
      </section>
    </>
  );
}