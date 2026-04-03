import { useState } from "react";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
const BG = "#f8f8f6";
const BUY_URL = "https://school.brossok.ru/buy/15";

const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/31ba4247-0ef8-483d-b086-1ae129072ef5.jpg";
const AUTHOR_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/e1094aa6-0054-4675-a2d2-f6112eab1bf6.png";

const REVIEWS = [
  {
    name: "Марина С.",
    text: "После курса смогла поднять цену сеанса с 2 000 до 3 500 ₽. Клиенты сами рекомендуют меня другим — результат виден сразу.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/1d6c59c1-4773-468e-af93-147799af28c3.jpg",
  },
  {
    name: "Алексей В.",
    text: "Раньше боялся клиентов с травмами. Теперь это моя специализация. Запись расписана на 2 недели вперёд.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/8fdca789-3467-4c72-b1dc-4eb6c28f5036.jpg",
  },
];

const MODULES = [
  {
    title: "Модуль 1: Основы восстановления",
    lessons: ["Причины болей и механизмы их возникновения", "Логика работы с телом: от симптома к причине"],
  },
  {
    title: "Модуль 2: Позвоночник и суставы",
    lessons: ["Диагностика состояния позвоночника", "Практические техники работы с суставами"],
  },
  {
    title: "Модуль 3: Мышцы и связки",
    lessons: ["Техники работы с мышечными зажимами", "Восстановление после нагрузок и травм"],
  },
  {
    title: "Модуль 4: Внутренние органы",
    lessons: ["Основы работы с висцеральной системой", "Безопасные техники и противопоказания"],
  },
  {
    title: "Модуль 5: Практика",
    lessons: ["Сборка полноценного восстановительного сеанса", "Частые ошибки и как их избежать"],
  },
];

const FAQS = [
  {
    q: "Подойдёт ли курс без медицинского образования?",
    a: "Да. Курс объясняет анатомию и физиологию в доступной форме. Специального медицинского образования не требуется.",
  },
  {
    q: "Насколько сложные техники?",
    a: "Техники разобраны пошагово, с демонстрацией. Курс рассчитан на практикующих массажистов, поэтому базовые навыки уже должны быть.",
  },
  {
    q: "Сколько времени занимает обучение?",
    a: "В среднем 4–6 недель при обучении 1–2 часа в день. Доступ к материалам бессрочный.",
  },
  {
    q: "Можно ли применять сразу?",
    a: "Да. После каждого модуля есть практические задания, которые можно применять на клиентах уже в процессе обучения.",
  },
];

const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

function BtnPrimary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block", textDecoration: "none",
        background: h ? ACCENT_DARK : ACCENT, color: "#fff",
        borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700,
        cursor: "pointer", fontFamily: "Montserrat, sans-serif",
        boxShadow: `0 6px 20px ${ACCENT_SHADOW}`, transition: "all 0.2s",
        transform: h ? "translateY(-2px)" : "translateY(0)", ...style,
      }}
    >{children}</a>
  );
}

function BtnSecondary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block", textDecoration: "none",
        background: "transparent", color: h ? ACCENT_DARK : ACCENT,
        border: `2px solid ${ACCENT}`, borderRadius: 12, padding: "13px 32px",
        fontSize: 15, fontWeight: 600, cursor: "pointer",
        fontFamily: "Montserrat, sans-serif", transition: "all 0.2s", ...style,
      }}
    >{children}</a>
  );
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8e8e4", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", padding: "18px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 15,
        fontWeight: 600, color: "#1a1a1a", textAlign: "left", gap: 12,
      }}>
        {title}
        <span style={{ color: ACCENT, flexShrink: 0, transition: "transform 0.25s", transform: open ? "rotate(45deg)" : "rotate(0deg)", fontSize: 22, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <div style={{ paddingBottom: 18 }}>{children}</div>
      </div>
    </div>
  );
}

function CtaBar() {
  return (
    <div style={{ margin: "60px 0 0", background: "#fff", borderTop: "1px solid #e8e8e4", borderBottom: "1px solid #e8e8e4" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Восстановительный массаж PRO</div>
          <div style={{ color: "#999", fontSize: 13 }}>Переход на новый уровень дохода</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>39 900 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}

export default function CourseVosstanovitelny() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      {/* ── 1. HERO ── */}
      <section style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="cv-hero-grid">
          <div>
            <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 13, textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = "#999")}
            >
              <Icon name="ArrowLeft" size={13} />
              Все курсы
            </a>
            <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 16, letterSpacing: 0.5 }}>
              ДЛЯ ПРАКТИКУЮЩИХ
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px" }}>
              Восстановительный массаж PRO: клиенты с болью, травмами и высоким чеком
            </h1>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Освойте работу с болевыми состояниями и сложными случаями, чтобы увеличить стоимость своих услуг и поток клиентов
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              {[
                { icon: "Activity", text: "Работа с болями и травмами" },
                { icon: "TrendingUp", text: "Увеличение среднего чека" },
                { icon: "ClipboardList", text: "Практические протоколы" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <BtnPrimary>Купить курс — 39 900 ₽</BtnPrimary>
              <BtnSecondary>Оформить рассрочку</BtnSecondary>
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src={HERO_IMG} alt="Восстановительный массаж PRO" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── 2. ПРОБЛЕМА ЦА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Узнаёте себя?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="cv-2col">
            {[
              { icon: "HelpCircle", text: "Клиенты приходят с болью, а вы не уверены, что делать" },
              { icon: "Brain", text: "Не хватает понимания причин проблемы" },
              { icon: "BadgeDollarSign", text: "Сложно повысить цену без уверенного результата" },
              { icon: "Shuffle", text: "Ощущение «делаю массаж, но без системы»" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14,
                padding: "20px 24px", display: "flex", alignItems: "center", gap: 14,
                fontSize: 15, color: "#333",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff3f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={20} style={{ color: "#e05050" }} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. РЕШЕНИЕ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "44px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }} className="cv-solution-pad">
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Решение</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
              Этот курс даёт систему работы с телом, которая позволяет:
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }} className="cv-2col">
              {[
                "Понимать причины болей",
                "Подбирать правильные техники",
                "Работать с разными состояниями",
                "Давать клиенту ощутимый результат",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#333" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: ACCENT, fontWeight: 700 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ЧТО ПОЛУЧИТЕ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Что вы получите</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="cv-3col">
            {[
              { icon: "Bone", text: "Работа с позвоночником и суставами" },
              { icon: "Zap", text: "Техники для снятия болевого синдрома" },
              { icon: "Dumbbell", text: "Работа со связками и мышцами" },
              { icon: "Stethoscope", text: "Основы мануальной терапии" },
              { icon: "Circle", text: "Подход к работе с внутренними органами" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", borderRadius: 14, padding: "24px 20px",
                display: "flex", alignItems: "flex-start", gap: 14,
                border: "1px solid #e8e8e4", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={20} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "#333" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── АВТОР КУРСА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "#fff", border: "1px solid #e8e8e4", borderRadius: 24,
            overflow: "hidden", display: "grid", gridTemplateColumns: "320px 1fr",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }} className="cv-author-grid">
            <div style={{ position: "relative", minHeight: 380 }}>
              <img src={AUTHOR_IMG} alt="Сергей Водопьянов"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", minHeight: 380 }} />
            </div>
            <div style={{ padding: "40px 44px" }} className="cv-author-pad">
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Автор курса</div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>Сергей Водопьянов</h3>
              <p style={{ color: "#999", fontSize: 14, margin: "0 0 20px" }}>Остеопат · 17 лет опыта · Член Российской остеопатической ассоциации</p>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, margin: "0 0 28px" }}>
                За годы практики работал с тысячами людей, помогая улучшить самочувствие при болях в спине и шее, восстановить осанку. Специализируется на работе с офисными сотрудниками, спортсменами и беременными женщинами.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { value: "17", label: "лет практики" },
                  { value: "3000+", label: "консультаций" },
                  { value: "Автор", label: "курсов Dok Диалог" },
                  { value: "РОА", label: "сертификат" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90 }}>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBar />

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
                "Уверенно работаете с болевыми состояниями",
                "Понимаете, какие техники применять",
                "Повышаете стоимость своих услуг",
                "Получаете более платёжеспособных клиентов",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>✓</span>
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

      <CtaBar />

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

      {/* ── 11. СТОИМОСТЬ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "#fff", border: "1px solid #e8e8e4", borderRadius: 24,
            padding: "48px 40px", textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }} className="cv-price-pad">
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Стоимость курса</div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 56, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>39 900 ₽</div>
            <div style={{ color: "#999", fontSize: 14, margin: "8px 0 32px" }}>или рассрочка от 3 325 ₽/мес</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              {["Полная оплата", "Рассрочка на 12 мес", "Рассрочка на 24 мес"].map((o) => (
                <div key={o} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555" }}>
                  <Icon name="Check" size={14} style={{ color: ACCENT }} />
                  {o}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <BtnPrimary>Купить курс</BtnPrimary>
              <BtnSecondary>Оформить рассрочку</BtnSecondary>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. ГАРАНТИИ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="cv-3col">
            {[
              { icon: "GraduationCap", title: "Без медобразования", text: "Анатомия и физиология объяснены в доступной форме" },
              { icon: "Route", title: "Пошаговое обучение", text: "Каждый модуль строится на предыдущем — без пробелов" },
              { icon: "Wrench", title: "Практическая направленность", text: "Техники отработаны на реальных случаях" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16,
                padding: "28px 24px", textAlign: "center",
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon name={icon} size={24} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. FAQ ── */}
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

      {/* ── 14. ФИНАЛЬНЫЙ CTA ── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2 }}>
            Освойте востребованные навыки и начните зарабатывать больше уже в ближайшие месяцы
          </h2>
          <p style={{ fontSize: 16, color: "#666", margin: "0 0 36px" }}>
            Это не просто обучение — это переход на новый уровень дохода
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary style={{ padding: "16px 40px", fontSize: 16 }}>Купить курс — 39 900 ₽</BtnPrimary>
            <BtnSecondary style={{ padding: "15px 40px", fontSize: 16 }}>Рассрочка</BtnSecondary>
          </div>
        </div>
      </section>

      <DokFooter />

      <style>{`
        .cv-hero-grid { grid-template-columns: 1fr 1fr; }
        .cv-3col { grid-template-columns: repeat(3, 1fr); }
        .cv-2col { grid-template-columns: repeat(2, 1fr); }
        .cv-6col { grid-template-columns: repeat(6, 1fr); }
        .cv-result-pad { padding: 48px; }
        .cv-solution-pad { padding: 44px 48px; }
        .cv-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .cv-hero-grid { grid-template-columns: 1fr !important; }
          .cv-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .cv-6col { grid-template-columns: repeat(3, 1fr) !important; }
          .cv-author-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cv-2col { grid-template-columns: 1fr !important; }
          .cv-3col { grid-template-columns: 1fr !important; }
          .cv-6col { grid-template-columns: repeat(2, 1fr) !important; }
          .cv-result-pad { padding: 28px 20px !important; }
          .cv-solution-pad { padding: 28px 20px !important; }
          .cv-price-pad { padding: 36px 24px !important; }
          .cv-author-pad { padding: 28px 24px !important; }
        }
      `}</style>
    </div>
  );
}
