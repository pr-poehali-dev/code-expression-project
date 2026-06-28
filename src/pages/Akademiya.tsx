import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const SKILLS = [
  { icon: "MessageCircle", color: TEAL,      title: "Эффективная коммуникация",       desc: "С клиентами и командой — уверенно, без конфликтов" },
  { icon: "TrendingUp",    color: "#059669",  title: "Продажи и средний чек",           desc: "Без давления и скриптов «в лоб» — через заботу" },
  { icon: "Star",          color: "#d97706",  title: "Личный бренд и продвижение",      desc: "Reels, посты, сторис — под вашу аудиторию" },
  { icon: "ShieldCheck",   color: "#7c3aed",  title: "Работа с возражениями",           desc: "И негативными отзывами — спокойно и профессионально" },
  { icon: "Heart",         color: "#e11d48",  title: "Управление стрессом",             desc: "Профилактика выгорания — практики для мастеров" },
  { icon: "BarChart3",     color: "#0369a1",  title: "Финансовая грамотность",          desc: "Для мастера и владельца — деньги без хаоса" },
];

const FREE_TRENINGS = [
  {
    icon: "MessageSquare",
    color: TEAL,
    tag: "Бесплатно",
    title: "Коммуникация без стресса",
    desc: "Разбираем реальные ситуации: запись, отказ, возврат. ИИ-агент даёт обратную связь по вашим ответам.",
    duration: "5 занятий",
  },
  {
    icon: "PenLine",
    color: "#7c3aed",
    tag: "Бесплатно",
    title: "Контент за 10 минут в день",
    desc: "Посты, Reels, сторис — с нуля до первой волны новых клиентов через соцсети.",
    duration: "7 занятий",
  },
  {
    icon: "TrendingUp",
    color: "#059669",
    tag: "Бесплатно",
    title: "Первый шаг к росту чека",
    desc: "Как мягко предлагать дополнительные услуги. Скрипты, которые не отталкивают.",
    duration: "4 занятия",
  },
];

const ADVANTAGES = [
  { icon: "Bot",           text: "Всё под ваш уровень и задачу: ИИ-агент корректирует задания под специфику и опыт" },
  { icon: "Zap",           text: "Применяешь сразу — результат виден в реальных клиентах и чеке" },
  { icon: "Target",        text: "Не тратишь время на теорию: только практика и обратная связь" },
  { icon: "Gift",          text: "Можно бесплатно пройти полноценный тренинг, не в демо-режиме" },
  { icon: "Award",         text: "Автоматическая мотивация: за выполнение заданий — энергия, рейтинг, бонусы" },
];

const FAQ = [
  { q: "Почему есть бесплатные тренинги?", a: "Потому что качественный рост индустрии невозможен без доступного образования. Мы верим в будущее без «входных барьеров»." },
  { q: "Можно проходить тренинги всей командой?", a: "Да, есть групповые форматы и индивидуальные программы. Управляющий видит прогресс каждого участника." },
  { q: "Как понять, что вы реально помогаете?", a: "После каждого блока — задание на практике и личная обратная связь. Рост виден сразу в работе и в цифрах." },
];

const STORIES = [
  { name: "Мария, мастер маникюра", result: "+40% к доходу за месяц", text: "Больше не боюсь продавать: ИИ-агент помог отработать ответы клиентам, и мои доходы выросли на 40% уже через месяц." },
  { name: "Иван, владелец салона", result: "Клиенты рекомендуют сами", text: "Вся команда прошла тренинг по сервису — клиенты теперь сами рекомендуют нас друзьям, чек вырос без скидок." },
];

export default function Akademiya() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Прокачка навыков — тренинги с ИИ-агентом | Промт Диалог</title>
        <meta name="description" content="Онлайн и офлайн тренинги для специалистов и команд салона. Прокачай навыки, которые влияют на доход и сервис. Бесплатные и платные программы без ловушек." />
        <meta name="keywords" content="тренинги для салона красоты, обучение мастеров, прокачка навыков, ИИ-агент обучение" />
        <link rel="canonical" href="https://promtdialog.ru/akademiya" />
        <meta property="og:title" content="Прокачка навыков — тренинги с ИИ-агентом | Промт Диалог" />
        <meta property="og:description" content="Развивайся вместе с ИИ-агентом. Удобно. Персонально. Эффективно." />
        <meta property="og:url" content="https://promtdialog.ru/akademiya" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Прокачка навыков — Промт Диалог",
          "url": "https://promtdialog.ru/akademiya",
          "description": "Онлайн и офлайн тренинги для специалистов и команд салона красоты.",
          "parentOrganization": { "@type": "Organization", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        })}</script>
      </Helmet>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", position: "relative" }} className="akad-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
              <Icon name="GraduationCap" size={14} style={{ color: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Прокачка навыков</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5.5vw,70px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              Развивайся вместе с ИИ-агентом. Удобно. Персонально. Эффективно
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 520 }}>
              Онлайн и офлайн тренинги для специалистов и команд. Прокачай навыки, которые реально влияют на доход и качество сервиса.
            </p>
            <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300 }}>
              Бесплатно и платно — без «ловушек», только рабочие инструменты
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link to="/cabinet" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "15px 36px", borderRadius: 2, fontSize: 15, fontWeight: 600,
                background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
                textDecoration: "none", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 12px 32px rgba(45,212,191,0.3)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                <Icon name="Zap" size={16} />
                Начать бесплатно
              </Link>
              <Link to="/free-trenings" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "15px 36px", borderRadius: 2, fontSize: 15, fontWeight: 500,
                border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)",
                textDecoration: "none", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.5)"; el.style.color = "#fff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.2)"; el.style.color = "rgba(255,255,255,0.75)"; }}
              >
                Посмотреть тренинги <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="akad-hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/a13d552d-2660-4c12-833d-56b1d288471f.png"
                alt="Прокачка навыков с ИИ-агентом — тренинги Промт Диалог"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ДЛЯ КОГО ── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="for-whom-grid">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Зачем и для кого</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Для тех, кто хочет расти в профессии
            </h2>
            <p style={{ fontSize: 16, color: GRAY, margin: 0, fontWeight: 300, lineHeight: 1.7 }}>
              А не просто «пройти курс» и получить сертификат на полку.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "User",       text: "Для тех, кто хочет расти в профессии, а не просто «пройти курс»" },
              { icon: "Building2",  text: "Для салонов, которым важна реальная прокачка команды, а не красивые сертификаты" },
              { icon: "Sparkles",   text: "Для новых мастеров и опытных профи — задания и разборы на вашем уровне" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", border: "1.5px solid #E8ECF0", borderRadius: 14, background: "#fff" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={item.icon} size={18} style={{ color: TEAL }} />
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── В ЧЁМ ОТЛИЧИЕ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Наш подход</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              В чём отличие?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {[
              { icon: "Bot",         color: TEAL,      title: "Учишься вместе с ИИ-агентом", desc: "Не просто слушаешь — выполняешь реальные задания, получаешь обратную связь, закрепляешь на практике." },
              { icon: "Target",      color: "#7c3aed",  title: "Конкретная польза для работы", desc: "Каждый шаг — это результат для клиентов, продаж, сервиса, коммуникации или продвижения." },
              { icon: "Gift",        color: "#059669",  title: "Нет «воды» и ловушек", desc: "Есть полноценные бесплатные и платные программы — выбирай под задачу без скрытых условий." },
              { icon: "BarChart3",   color: "#d97706",  title: "Автоматический контроль прогресса", desc: "Сразу виден результат — что прокачал, где ещё точка роста." },
            ].map((item, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 18, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={item.icon} size={22} style={{ color: item.color }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.65, fontWeight: 300 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ОНЛАЙН И ОФЛАЙН ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Форматы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Выбирай формат под себя
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="format-grid">
            <div style={{ border: `1.5px solid rgba(45,212,191,0.3)`, borderRadius: 20, padding: "44px 40px", background: "rgba(45,212,191,0.04)" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Icon name="Monitor" size={26} style={{ color: TEAL }} />
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: DARK, margin: "0 0 16px" }}>Онлайн-тренинги</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Короткие задания ежедневно", "Разборы по вашей ситуации", "Поддержка 24/7 от ИИ-агента", "Удобно совмещать с работой"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="Check" size={11} style={{ color: TEAL }} />
                    </div>
                    <span style={{ fontSize: 15, color: "#334155" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: "1.5px solid #E8ECF0", borderRadius: 20, padding: "44px 40px", background: "#fff" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Icon name="Users" size={26} style={{ color: "#7c3aed" }} />
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: DARK, margin: "0 0 16px" }}>Офлайн-интенсивы</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Живое общение и кейсы", "Отработка навыков в группе", "Быстрый рост за 1–2 дня", "Нетворкинг с коллегами"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="Check" size={11} style={{ color: "#7c3aed" }} />
                    </div>
                    <span style={{ fontSize: 15, color: "#334155" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── НАВЫКИ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Программа</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Какие навыки прокачиваем?
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 56 }}>
            {SKILLS.map((skill, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "22px 24px", border: "1.5px solid #E8ECF0", borderRadius: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${skill.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={skill.icon} size={18} style={{ color: skill.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 4 }}>{skill.title}</div>
                  <div style={{ fontSize: 13, color: GRAY, fontWeight: 300 }}>{skill.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Бесплатные тренинги из витрины */}
          <div style={{ borderTop: "1px solid #E8ECF0", paddingTop: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 32 }}>Бесплатно прямо сейчас</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
              {FREE_TRENINGS.map((t, i) => (
                <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 18, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
                  <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(45,212,191,0.12)", color: TEAL, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 100, letterSpacing: "1.5px", textTransform: "uppercase" }}>{t.tag}</div>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${t.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={t.icon} size={22} style={{ color: t.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 8, lineHeight: 1.3 }}>{t.title}</div>
                    <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.65, fontWeight: 300 }}>{t.desc}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                    <Icon name="Clock" size={13} style={{ color: GRAY }} />
                    <span style={{ fontSize: 12, color: GRAY }}>{t.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ПРЕИМУЩЕСТВА ПОДХОДА ── */}
      <section style={{ padding: "100px 32px", background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 560, marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Почему это работает</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,52px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Преимущества подхода Промт Диалог
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ADVANTAGES.map((adv, i) => (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "24px 28px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={adv.icon} size={18} style={{ color: TEAL }} />
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{adv.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── МИССИЯ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Наша цель</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 32px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Для чего мы это делаем?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Наша цель — чтобы каждый специалист и салон росли не только в доходе, но и в качестве сервиса",
              "Доступность и честность: учиться и расти может каждый, независимо от стадии бизнеса или кошелька",
              "Мы не продаём «обёртку»: только реальные навыки, которые масштабируют результат здесь и сейчас",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 24px", border: "1.5px solid #E8ECF0", borderRadius: 14, background: "#fff" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, flexShrink: 0, marginTop: 6 }} />
                <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.65 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ИСТОРИИ ── */}
      <section style={{ padding: "100px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Результаты</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Реальные истории
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="stories-grid">
            {STORIES.map((s, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 20, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: 5 }).map((_, j) => <Icon key={j} name="Star" size={13} style={{ color: "#F59E0B" }} />)}
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.7, fontWeight: 300, flex: 1 }}>«{s.text}»</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,212,191,0.08)", borderRadius: 8, padding: "8px 12px", alignSelf: "flex-start" }}>
                  <Icon name="TrendingUp" size={13} style={{ color: TEAL }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>{s.result}</span>
                </div>
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 14, fontSize: 14, fontWeight: 700, color: DARK }}>{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Вопросы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
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

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 500, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Выбирай формат, проходи вместе с ИИ-агентом — и расти быстрее рынка
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", margin: "0 0 44px", fontWeight: 300, position: "relative", lineHeight: 1.6 }}>
            Начни бесплатно прямо сейчас.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <Link to="/free-trenings" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 44px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>
              <Icon name="GraduationCap" size={16} />
              Посмотреть тренинги
            </Link>
            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 44px", borderRadius: 2, border: "1.5px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.75)", fontSize: 15, fontWeight: 500, textDecoration: "none",
            }}>
              Войти в кабинет <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 768px) {
          .akad-hero-grid { grid-template-columns: 1fr !important; }
          .akad-hero-img { margin-top: 32px; }
          .for-whom-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .format-grid { grid-template-columns: 1fr !important; }
          .stories-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}