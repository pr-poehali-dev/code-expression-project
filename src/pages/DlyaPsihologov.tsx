import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const CTA_HREF = "/cabinet?type=psychologist";

const PAINS = [
  { icon: "Users", title: "Клиентов недостаточно", text: "Вы хотите больше обращений, но не всегда понимаете, откуда их получать." },
  { icon: "HelpCircle", title: "Непонятно, что продвигать", text: "Есть знания и опыт, но сложно превратить их в понятное предложение для клиента." },
  { icon: "TrendingDown", title: "Нерегулярный доход", text: "Количество клиентов меняется от месяца к месяцу." },
  { icon: "Shuffle", title: "Много действий — мало системы", text: "Вы что-то публикуете, пробуете рекламу, общаетесь с людьми, но не понимаете, что действительно работает." },
];

const STEPS = [
  { num: "01", icon: "FileEdit", title: "Расскажите о практике", text: "Чем занимаетесь, с кем работаете, какие услуги предлагаете и чего хотите добиться." },
  { num: "02", icon: "ClipboardCheck", title: "Пройдите диагностику", text: "Ответьте на вопросы о клиентах, продвижении, доходе, загрузке и развитии практики." },
  { num: "03", icon: "ScanSearch", title: "Получите анализ", text: "Промт Диалог определит сильные стороны, проблемы и потенциальные точки роста." },
  { num: "04", icon: "ListChecks", title: "Получите шаги", text: "Каждый день система предлагает конкретное действие, которое имеет смысл именно для вашей цели." },
  { num: "05", icon: "LineChart", title: "Отслеживайте изменения", text: "Вы отмечаете выполнение, добавляете результаты, а система учитывает их в следующем анализе." },
];

const ANALYSIS_ITEMS = [
  { icon: "Users", title: "Клиенты", text: "Откуда приходят, сколько обращений, сколько возвращается." },
  { icon: "Briefcase", title: "Практика", text: "Специализация, услуги, формат работы, загрузка." },
  { icon: "Megaphone", title: "Продвижение", text: "Как потенциальные клиенты узнают о вас." },
  { icon: "Gift", title: "Предложение", text: "Что именно вы предлагаете и насколько понятно это клиенту." },
  { icon: "Wallet", title: "Доход", text: "Стоимость услуг, количество клиентов и динамика." },
  { icon: "Target", title: "Цели", text: "Куда вы хотите прийти и за какой период." },
];

const AUDIENCE = [
  { icon: "Sprout", title: "Начинающий психолог", text: "Помогает понять, с чего начать развитие практики." },
  { icon: "UserCheck", title: "Практикующий психолог", text: "Помогает систематизировать привлечение клиентов и развитие." },
  { icon: "Award", title: "Опытный специалист", text: "Помогает найти новые точки роста и работать с показателями." },
  { icon: "Building2", title: "Психологический центр", text: "Помогает анализировать развитие бизнеса, клиентов, специалистов и маркетинг." },
];

const CENTER_ITEMS = [
  "Развитие центра", "Привлечение клиентов", "Загрузка специалистов",
  "Продвижение", "Работа с клиентами", "Развитие команды", "Анализ показателей",
];

const FAQ = [
  { q: "Это только для психологов?", a: "Нет. Промт Диалог работает с разными специалистами и компаниями. Эта страница предназначена специально для психологов и психологических центров." },
  { q: "Нужно ли разбираться в ИИ?", a: "Нет. Пользователю не нужно знать, как устроены технологии внутри. Нужно рассказать о своей практике и отвечать на вопросы диагностики." },
  { q: "Что я получу после диагностики?", a: "Анализ текущей ситуации и персональные шаги развития." },
  { q: "Нужно ли сразу платить?", a: "Нет. Первоначальная диагностика и базовый функционал доступны бесплатно." },
  { q: "Нужно ли устанавливать программу?", a: "Нет. Всё работает в Промт Диалог через сайт." },
  { q: "А если я только начинаю практику?", a: "Это один из сценариев использования. Система учитывает ваш текущий этап и цели." },
  { q: "Можно ли использовать Промт Диалог для психологического центра?", a: "Да. Для компаний предусмотрен отдельный сценарий развития." },
];

function CtaButton({ style, big }: { style?: React.CSSProperties; big?: boolean }) {
  return (
    <Link
      to={CTA_HREF}
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: big ? "20px 48px" : "16px 36px", borderRadius: 2,
        fontSize: big ? 16 : 15, fontWeight: 600,
        background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK,
        textDecoration: "none", transition: "all 0.3s", fontFamily: "Inter, sans-serif",
        ...style,
      }}
      onMouseEnter={e => { const el = e.currentTarget; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 16px 40px rgba(45,212,191,0.35)`; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
    >
      <Icon name="Compass" size={big ? 18 : 16} />
      Пройти бесплатную диагностику
    </Link>
  );
}

export default function DlyaPsihologov() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Промт Диалог для психологов — развитие частной практики и привлечение клиентов</title>
        <meta name="description" content="Бесплатная диагностика практики психолога. Анализ текущей ситуации, персональные шаги развития, работа с клиентами, маркетинг и инструменты для развития практики." />
        <meta name="keywords" content="развитие частной практики психолога, как психологу найти клиентов, привлечение клиентов психологу, продвижение психолога, как развивать практику психолога, маркетинг для психолога, развитие психологического центра" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-psihologov" />
        <meta property="og:title" content="Промт Диалог для психологов — узнайте, что мешает вашей практике расти" />
        <meta property="og:description" content="Пройдите бесплатную диагностику практики и получите персональный план развития." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-psihologov" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "90px 32px 100px", width: "100%", display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 56, alignItems: "center", position: "relative" }} className="psy-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Для психологов</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.8vw,58px)", fontWeight: 500, color: "#fff", lineHeight: 1.12, margin: "0 0 26px", letterSpacing: "-0.5px" }}>
              Вы хороший психолог. Но знаете ли вы, что мешает вашей практике расти?
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 520 }}>
              Промт Диалог анализирует вашу практику, цели и текущие показатели и показывает, на что стоит обратить внимание и что сделать следующим шагом.
            </p>

            <CtaButton big />

            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 300 }}>Без оплаты. Регистрация займёт несколько минут.</span>
              <span style={{ fontSize: 13, color: TEAL, fontWeight: 400 }}>После диагностики вы получите персональный анализ и первые шаги развития.</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="psy-hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/d62e4008-3488-4fef-bf8a-fdc8e48692e0.jpg"
                alt="Промт Диалог для психологов — диагностика и развитие частной практики"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ЗНАКОМАЯ СИТУАЦИЯ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Знакомая ситуация?</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.15, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
              Вы хорошо работаете с людьми. Но развитие практики часто остаётся на втором плане.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }} className="psy-pains-grid">
            {PAINS.map(p => (
              <div key={p.title} style={{ background: "#fff", border: "1px solid #E8ECF0", borderRadius: 14, padding: "28px 26px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={p.icon} size={20} style={{ color: TEAL2 }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.65, fontWeight: 300 }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: DARK, fontFamily: SERIF }}>
              Что именно делать сейчас, чтобы практика росла?
            </div>
          </div>
        </div>
      </section>

      {/* ── ЧТО ДЕЛАЕТ ПРОМТ ДИАЛОГ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Как это работает</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
            Вместо догадок — персональный план развития
          </h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
            Промт Диалог помогает посмотреть на вашу практику как на систему. Вы рассказываете о себе, своей специализации, услугах, клиентах, текущих результатах и целях. Система анализирует эту информацию и формирует индивидуальный профиль вашей практики. После этого рекомендации строятся уже не абстрактно для «психолога», а именно для вас.
          </p>
        </div>
      </section>

      {/* ── СХЕМА РАБОТЫ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ display: "flex", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(45,212,191,0.3)" }}>
                    <Icon name={s.icon} size={24} style={{ color: DARK }} />
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 40, background: "#D8E0E8", margin: "6px 0" }} />}
                </div>
                <div style={{ paddingBottom: i < STEPS.length - 1 ? 40 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: TEAL2, letterSpacing: "1.5px", marginBottom: 4 }}>{s.num}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.65, fontWeight: 300, maxWidth: 480 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРИМЕР РЕЗУЛЬТАТА ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Пример</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px" }}>
              Как это может выглядеть
            </h2>
          </div>

          <div style={{ background: DARK, borderRadius: 18, padding: "40px 36px", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }} className="psy-example-grid">
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Ваша цель</div>
                <div style={{ fontSize: 16, color: "#fff", fontWeight: 500 }}>Получать 15 новых обращений в месяц</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Текущая ситуация</div>
                <div style={{ fontSize: 16, color: "#fff", fontWeight: 500 }}>Вы получаете около 6–8 обращений</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Что обнаружено</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontWeight: 300 }}>
                Основная точка роста — недостаточная регулярность продвижения и отсутствие понятного предложения для новой аудитории.
              </div>
            </div>

            <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 12, padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>Сегодняшний шаг</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 500, marginBottom: 4 }}>Создать один материал для вашей целевой аудитории, который отвечает на конкретную проблему потенциального клиента</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Рекомендуемый инструмент: Создать пост</div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 8, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 13, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>
                Выполнить шаг
              </div>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: GRAY, marginTop: 18, fontWeight: 300 }}>
            Пример интерфейса личного кабинета. Реальные шаги формируются на основе вашей диагностики.
          </p>
        </div>
      </section>

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

      {/* ── БЕСПЛАТНЫЙ СТАРТ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
            Начните бесплатно
          </h2>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, fontWeight: 300, marginBottom: 12 }}>
            Регистрация и первоначальная диагностика доступны бесплатно. Вы можете:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", maxWidth: 380, margin: "0 auto 36px" }}>
            {["Создать профиль", "Пройти диагностику", "Получить анализ", "Получить первые персональные шаги", "Попробовать инструменты в рамках бесплатного лимита"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="Check" size={16} style={{ color: TEAL2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: DARK }}>{t}</span>
              </div>
            ))}
          </div>
          <CtaButton big />
        </div>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ── */}
      <section style={{
        padding: "100px 32px",
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.5vw,54px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.5px" }}>
            Узнайте, что сейчас мешает вашей практике расти
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 40px", fontWeight: 300, lineHeight: 1.7 }}>
            Пройдите бесплатную диагностику и получите персональный первый шаг.
          </p>
          <CtaButton big />
          <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Регистрация бесплатна.</div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 32px 140px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL2, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>FAQ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Частые вопросы
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif" }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: DARK, lineHeight: 1.4 }}>{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: GRAY, flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <BizFooter />

      {/* ── ФИКСИРОВАННАЯ CTA-КНОПКА НА МОБИЛЬНЫХ ── */}
      <div className="psy-mobile-sticky-cta" style={{
        display: "none", position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 150,
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom,0px))",
        background: "rgba(8,14,28,0.96)", backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(45,212,191,0.15)",
      }}>
        <Link to={CTA_HREF} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK,
          textDecoration: "none", fontFamily: "Inter, sans-serif",
        }}>
          <Icon name="Compass" size={16} />
          Пройти диагностику
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .psy-hero-grid { grid-template-columns: 1fr !important; }
          .psy-hero-img { margin-top: 32px; order: -1; }
          .psy-pains-grid { grid-template-columns: 1fr !important; }
          .psy-analysis-grid { grid-template-columns: 1fr 1fr !important; }
          .psy-audience-grid { grid-template-columns: 1fr 1fr !important; }
          .psy-example-grid { grid-template-columns: 1fr !important; }
          .psy-mobile-sticky-cta { display: block !important; }
          body { padding-bottom: 0; }
        }
        @media (max-width: 520px) {
          .psy-analysis-grid { grid-template-columns: 1fr !important; }
          .psy-audience-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}