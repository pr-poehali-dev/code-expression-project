import { useEffect } from "react";
import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const TARIFFS = [
  {
    name: "Стандарт",
    price: "190 000 ₽",
    period: "6 месяцев · до 5 сотрудников",
    color: "#0F766E",
    badge: null,
    desc: "Оптимальный старт для небольших салонов. Команда получает Академию, скрипты и инструменты — владелец видит результат уже в первые месяцы.",
    features: [
      "Академия для персонала: мышление, коммуникация, работа с клиентом",
      "Протоколы удержания клиента и повторной записи",
      "Готовые скрипты, стандарты коммуникации, PDF-материалы",
      "Единый баланс: сотрудники работают в своих кабинетах",
    ],
    result: "Рост повторных записей, доверие клиентов, рост рекомендаций",
  },
  {
    name: "Премиум салон",
    price: "490 000 ₽",
    period: "12 месяцев · до 15 сотрудников",
    color: "#7C3AED",
    badge: "Популярный",
    desc: "Полная система роста с ИИ-инструментами для команды. Аналитика по каждому сотруднику, генераторы контента и 4 стратегические встречи.",
    features: [
      "Всё из формата «Стандарт»",
      "ИИ-диагностика клиента и анализ мышления специалиста",
      "ИИ-диагностика роста салона — где теряете деньги",
      "Генераторы постов, Reels, скриптов и ответов на отзывы",
      "Аналитика по каждому сотруднику с лимитами по ролям",
      "4 стратегические онлайн-встречи с командой",
    ],
    result: "Рост среднего чека, единая система работы, сильная команда",
  },
  {
    name: "Про Диалог Business",
    price: "от 1 200 000 ₽",
    period: "Индивидуально · 6–12 очных встреч",
    color: "#B45309",
    badge: "VIP",
    desc: "Полное внедрение системы под ваш бренд. Безлимитный доступ ко всем ИИ-инструментам навсегда, все обновления платформы без доплат.",
    features: [
      "Полное внедрение системы с нуля под бренд салона",
      "Обучение + диагностика всей команды",
      "Безлимитный доступ ко всем ИИ-инструментам навсегда",
      "Все обновления платформы без доплат",
      "Настройка ролей и лимитов под структуру салона",
      "Персональная поддержка руководителя",
    ],
    result: "Сильный бренд, стабильная база клиентов, выход в премиум-сегмент",
  },
];

const EXTRA = [
  { icon: "GraduationCap", name: "Обучение администраторов", price: "от 90 000 ₽", desc: "Отдельный курс для администраторов: запись, скрипты, работа с возражениями, повторные визиты." },
  { icon: "Target", name: "Настройка позиционирования", price: "от 150 000 ₽", desc: "Помогаем сформулировать УТП, выстроить коммуникацию и выйти в нужный ценовой сегмент." },
  { icon: "Building2", name: "Корпоративный доступ", price: "от 39 000 ₽ / мес", desc: "Гибкий доступ к платформе для сетей и управляющих компаний с несколькими салонами." },
];

const AUDIT_INCLUDES = [
  "Анализ текущих бизнес-процессов и клиентского пути",
  "Оценка сервиса и стандартов обслуживания под требования премиум-сегмента",
  "Диагностика сильных и слабых сторон команды — мастеров и администраторов",
  "Выявление зон потерь дохода и возможностей увеличения среднего чека",
  "Советы по внедрению единой системы работы и стандартизации качества",
  "Рекомендации по управлению командой и удержанию клиентов премиум-класса",
];

const AUDIT_BENEFITS = [
  { icon: "TrendingUp", text: "Конкретный план действий для роста дохода салона" },
  { icon: "Star", text: "Улучшение имиджа и репутации в премиум-сегменте" },
  { icon: "Users", text: "Повышение квалификации команды и снижение текучести" },
  { icon: "Wallet", text: "Увеличение среднего чека без роста рекламного бюджета" },
  { icon: "Bot", text: "Интеграция ИИ-инструментов «Про Диалог» в работу салона" },
];

const AUDIT_STEPS = [
  { n: "01", text: "Вы оставляете заявку — эксперт связывается для уточнения целей" },
  { n: "02", text: "Проводим комплексный анализ салона и собираем данные" },
  { n: "03", text: "Презентуем подробный отчёт с рекомендациями и приоритетами" },
  { n: "04", text: "Помогаем внедрить изменения с поддержкой платформы «Про Диалог»" },
];

const AUDIT_FOR = [
  "Владельцы и управляющие салонов красоты и wellness с командой от 3 сотрудников",
  "Те, кто хочет выйти в премиум-сегмент и построить стабильный доход",
  "Те, кто устал от текучести и хочет сделать сервис на уровне лучших брендов",
];

const ROLES = [
  { icon: "Crown", role: "Владелец", desc: "Полный доступ, управление командой, аналитика по всем, пополнение баланса" },
  { icon: "UserCog", role: "Управляющий", desc: "Доступ к инструментам, управление сотрудниками в рамках делегированных прав" },
  { icon: "Scissors", role: "Мастер", desc: "Доступ к ИИ-инструментам в рамках выделенного лимита" },
  { icon: "PhoneCall", role: "Администратор", desc: "Скрипты, генератор ответов на отзывы, генератор постов для соцсетей" },
];

export default function DlyaSalonov() {
  useEffect(() => {
    document.title = "Аудит салона красоты под премиум-клиентов — Про Диалог";
    const desc = document.querySelector("meta[name='description']");
    if (desc) desc.setAttribute("content", "Аудит салона красоты для привлечения премиальных клиентов. Анализ бизнес-процессов, увеличение среднего чека, оптимизация работы команды. Платформа «Про Диалог».");
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 70% 0%, #1a2e3c 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "60vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "0%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px", width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Для салонов красоты</span>
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,68px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, margin: "0 0 24px", letterSpacing: "-0.5px", maxWidth: 780 }}>
            Инструменты роста<br />для вашей команды
          </h1>

          <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 580, margin: "0 0 40px" }}>
            Увеличьте возврат клиентов и загрузку мастеров — подключайте всю команду и работайте через единую платформу.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/kontakty" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
              color: "#fff", padding: "14px 32px", borderRadius: 2,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(45,212,191,0.25)",
            }}>
              Получить консультацию
              <Icon name="ArrowRight" size={16} />
            </Link>
            <a href="#tariffs" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
              padding: "14px 32px", borderRadius: 2, fontSize: 15,
              fontWeight: 500, textDecoration: "none", background: "transparent",
            }}>
              Смотреть форматы
            </a>
          </div>
        </div>
      </section>

      {/* ── СИСТЕМА РОЛЕЙ ── */}
      <section style={{ padding: "80px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>Как работает платформа</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>Единый кабинет для всей команды</h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Владелец подключает сотрудников — каждый получает свой кабинет с нужными инструментами. Один баланс, прозрачная аналитика, лимиты по ролям.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {ROLES.map(r => (
              <div key={r.role} style={{ background: "#fff", borderRadius: 4, border: "1px solid #E2E8F0", padding: "28px 24px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 4, background: `rgba(45,212,191,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={r.icon} size={20} style={{ color: TEAL }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 8 }}>{r.role}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ТАРИФЫ ── */}
      <section id="tariffs" style={{ padding: "96px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>Форматы подключения</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>Выберите формат под ваш салон</h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Три формата для салонов любого размера — от стартового пакета до полного индивидуального внедрения.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start" }}>
            {TARIFFS.map((t) => (
              <div key={t.name} style={{
                borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden",
                boxShadow: t.badge === "Популярный" ? "0 8px 32px rgba(124,58,237,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
                position: "relative",
              }}>
                {t.badge && (
                  <div style={{ position: "absolute", top: 16, right: 16, background: t.color, color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.5px" }}>
                    {t.badge}
                  </div>
                )}

                {/* Цветная шапка */}
                <div style={{ background: t.color, padding: "28px 28px 24px" }}>
                  <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{t.period}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginTop: 16, letterSpacing: "-1px" }}>{t.price}</div>
                </div>

                <div style={{ padding: "24px 28px 28px" }}>
                  <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, margin: "0 0 20px" }}>{t.desc}</p>

                  <ul style={{ listStyle: "none", margin: "0 0 20px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {t.features.map(f => (
                      <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: `rgba(45,212,191,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          <Icon name="Check" size={11} style={{ color: TEAL }} />
                        </div>
                        <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ background: "#F8FAFC", borderRadius: 4, padding: "10px 14px", fontSize: 12, color: GRAY, marginBottom: 20, borderLeft: `3px solid ${t.color}` }}>
                    <strong style={{ color: DARK }}>Результат: </strong>{t.result}
                  </div>

                  <Link to="/kontakty" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: t.color, color: "#fff", padding: "12px 24px",
                    borderRadius: 2, fontSize: 14, fontWeight: 600, textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}>
                    Узнать подробнее
                    <Icon name="ArrowRight" size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── АУДИТ САЛОНА ── */}
      <section id="audit" style={{ padding: "96px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Заголовок */}
          <div style={{ maxWidth: 760, marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <Icon name="Search" size={13} style={{ color: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Услуга · от 50 000 ₽</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,50px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.08, letterSpacing: "-0.3px" }}>
              Аудит салона для привлечения<br />премиальных клиентов
            </h2>
            <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.75, margin: 0 }}>
              Сегодняшний премиальный клиент — это человек с высокими запросами к качеству, атмосфере и сервису. «Про Диалог» проводит глубокий аудит вашего салона с акцентом на привлечение и удержание этой аудитории. Обнаружим скрытые точки роста и покажем, как увеличить доход без дополнительной рекламы.
            </p>
          </div>

          {/* Включает + Шаги */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 56 }} className="audit-grid">

            {/* Что входит */}
            <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #E2E8F0", padding: "36px 36px" }}>
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 20 }}>Что входит в аудит</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {AUDIT_INCLUDES.map(item => (
                  <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Icon name="Check" size={11} style={{ color: TEAL }} />
                    </div>
                    <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Как работает */}
            <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #E2E8F0", padding: "36px 36px" }}>
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 20 }}>Как работает услуга</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {AUDIT_STEPS.map(step => (
                  <div key={step.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: TEAL, lineHeight: 1, flexShrink: 0, minWidth: 36 }}>{step.n}</div>
                    <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.65, paddingTop: 4 }}>{step.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Преимущества */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 24 }}>Что вы получите</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {AUDIT_BENEFITS.map(b => (
                <div key={b.text} style={{ background: "#fff", borderRadius: 4, border: "1px solid #E2E8F0", padding: "20px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, background: "rgba(45,212,191,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={b.icon} size={17} style={{ color: TEAL }} />
                  </div>
                  <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingTop: 2 }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Для кого + CTA */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="audit-cta-grid">
            <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #E2E8F0", padding: "32px" }}>
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 20 }}>Для кого подходит</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {AUDIT_FOR.map(f => (
                  <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Icon name="ChevronRight" size={15} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: DARK, borderRadius: 6, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-40%", right: "-20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500, color: "#fff", marginBottom: 12, lineHeight: 1.2 }}>
                  Готовы повысить статус<br />вашего салона?
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 28px" }}>
                  Оставьте заявку — эксперт свяжется с вами, уточнит задачи и расскажет, как проходит аудит.
                </p>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
                  Стоимость: <span style={{ color: TEAL, fontWeight: 600 }}>от 50 000 ₽</span>
                </div>
                <Link to="/kontakty" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
                  color: "#fff", padding: "14px 32px", borderRadius: 2,
                  fontSize: 15, fontWeight: 600, textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(45,212,191,0.2)",
                }}>
                  Заказать аудит
                  <Icon name="ArrowRight" size={15} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ ── */}
      <section style={{ padding: "80px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>Дополнительно</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3vw,40px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>Отдельные услуги</h2>
            <p style={{ fontSize: 15, color: GRAY, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Точечные решения под конкретную задачу — без обязательного подключения полного формата.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {EXTRA.map(s => (
              <div key={s.name} style={{ background: "#fff", borderRadius: 4, border: "1px solid #E2E8F0", padding: "28px 24px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 4, background: `rgba(45,212,191,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={s.icon} size={20} style={{ color: TEAL }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, marginBottom: 10 }}>{s.price}</div>
                <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "96px 32px",
        background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 20 }}>Начните сейчас</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,54px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.1 }}>
            Готовы вырасти<br />вместе с командой?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 40px" }}>
            Свяжитесь с нами — подберём формат под ваш салон, ответим на вопросы и проведём демонстрацию платформы.
          </p>
          <Link to="/kontakty" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
            color: "#fff", padding: "16px 40px", borderRadius: 2,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 12px 32px rgba(45,212,191,0.3)",
          }}>
            Получить консультацию
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 640px) {
          #tariffs > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .audit-grid { grid-template-columns: 1fr !important; }
          .audit-cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}