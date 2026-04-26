import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, ACCENT_SHADOW, BG, HERO_IMG, AUTHOR_IMG, h2style, BtnPrimary, AccordionItem } from "./CtShared";

const ACCESS_URL = "#";

const EXERCISES = [
  {
    icon: "Wind",
    title: "Дыхание «4–7–8»",
    subtitle: "Мгновенное торможение стресс-реакции",
    desc: "Тело буквально «выключает» тревогу. Мышцы расслабляются, сердце замедляется, голова проясняется. То ощущение, когда наконец можно выдохнуть — вот именно это и происходит внутри.",
    color: "hsl(185, 85%, 32%)",
    bg: "hsl(185, 85%, 97%)",
  },
  {
    icon: "Activity",
    title: "Физиологический вздох",
    subtitle: "Самый быстрый способ сбросить напряжение",
    desc: "Внутри как будто что-то отпускает. Сжатая грудь раскрывается, уходит ощущение кома в горле. Тело перестаёт готовиться к опасности — и начинает восстанавливаться.",
    color: "hsl(270, 60%, 45%)",
    bg: "hsl(270, 60%, 97%)",
  },
  {
    icon: "Heart",
    title: "Резонансное дыхание",
    subtitle: "Гармонизация нервной системы",
    desc: "Приходит тихое спокойствие — не сонливость, а ясность. Голова перестаёт «гудеть», тревожный фон уходит. Чувствуешь себя устойчиво — как будто вернулся в себя.",
    color: "hsl(12, 80%, 45%)",
    bg: "hsl(12, 80%, 97%)",
  },
];

const RESULTS = [
  { icon: "Zap", text: "Снять острый приступ тревоги за 2–3 минуты" },
  { icon: "Moon", text: "Засыпать без мыслей в голове" },
  { icon: "TrendingDown", text: "Остановить нарастающую панику в моменте" },
  { icon: "Brain", text: "Понять, как ваша нервная система реагирует на стресс" },
  { icon: "Sun", text: "Начинать день без тревожного фона" },
  { icon: "Shield", text: "Чувствовать опору внутри, а не снаружи" },
];

const FAQS = [
  {
    q: "Это для всех или только для людей с тревожными расстройствами?",
    a: "Для всех. Техники основаны на физиологии — они работают независимо от того, есть ли у вас диагноз. Хронический стресс, беспокойство, усталость, невозможность расслабиться — это ровно то, для чего создан курс.",
  },
  {
    q: "Нужно ли какое-то специальное оборудование или место?",
    a: "Ничего. Только вы и ваше дыхание. Упражнения можно делать за рабочим столом, в машине, перед сном или в очереди. Буквально везде.",
  },
  {
    q: "Сколько времени займёт каждое упражнение?",
    a: "От 3 до 10 минут. Это не медитация на час — это точечное воздействие на нервную систему. Быстро, просто, с ощутимым результатом.",
  },
  {
    q: "Это действительно работает?",
    a: "Техники основаны на нейрофизиологии и исследованиях вегетативной нервной системы. Их применяют в медицине и спортивной психологии. Вы почувствуете разницу уже во время первого упражнения.",
  },
  {
    q: "Курс платный?",
    a: "Нет. Курс полностью бесплатный. Мы убеждены, что базовые инструменты управления стрессом должны быть доступны каждому.",
  },
];

export default function CourseTrevoga() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>«Выдохни» — бесплатный курс: снять тревогу за 5–10 минут в день | Dok Диалог</title>
        <meta name="description" content="3 упражнения на основе физиологии, которые помогут выйти из стресса и тревоги за 5–10 минут. Бесплатный онлайн-курс от Dok Диалог." />
      </Helmet>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 90, background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(20px, 4vw, 40px) 20px 0" }}>
          <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 14, textDecoration: "none", marginBottom: 24 }}
            onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
            onMouseLeave={e => (e.currentTarget.style.color = "#999")}
          >
            <Icon name="ArrowLeft" size={14} />
            Назад к каталогу
          </a>
        </div>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 20px 0" }}>
          <div className="ct-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px, 5vw, 60px)", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT}14`, color: ACCENT, borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                <Icon name="Gift" size={14} />
                Бесплатный курс · Точечный продукт
              </div>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(38px, 6vw, 62px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 16px", color: "#1a1a1a" }}>
                «Выдохни»
              </h1>
              <p style={{ fontSize: "clamp(16px, 2.2vw, 22px)", fontWeight: 600, color: "#333", margin: "0 0 14px", lineHeight: 1.4 }}>
                Как снизить стресс и тревогу за 10–15 минут в день
              </p>
              <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", lineHeight: 1.75, margin: "0 0 28px" }}>
                Если ты постоянно в напряжении, быстро устаёшь и не можешь «выключить голову» — дело не в силе воли. Это перегруженная нервная система. И на это можно влиять — через тело, через дыхание, через внимание.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
                {["Бесплатно", "Онлайн", "Для всех 18+", "5–10 мин в день"].map((tag) => (
                  <span key={tag} style={{ padding: "5px 12px", borderRadius: 8, background: BG, border: "1px solid #e0e0dc", fontSize: 13, color: "#555", fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
              <BtnPrimary href={ACCESS_URL} style={{ fontSize: "clamp(14px, 1.6vw, 17px)", padding: "clamp(14px, 2vw, 18px) clamp(28px, 4vw, 44px)" }}>
                Получить бесплатный доступ →
              </BtnPrimary>
            </div>
            <div className="ct-hero-img" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.12)" }}>
              <img src={HERO_IMG} alt="Курс Выдохни" style={{ width: "100%", height: "clamp(280px, 40vw, 480px)", objectFit: "cover", display: "block" }} />
            </div>
          </div>

          {/* Stats strip */}
          <div className="ct-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #e8e8e4", marginTop: 48 }}>
            {[
              { num: "5–10", label: "минут в день" },
              { num: "3", label: "упражнения" },
              { num: "0 ₽", label: "стоимость" },
              { num: "ВНС", label: "физиология в основе" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "clamp(16px, 2vw, 28px) clamp(12px, 2vw, 24px)", borderRight: i < 3 ? "1px solid #e8e8e4" : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "clamp(11px, 1.2vw, 13px)", color: "#888", marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Когда нервная система перегружена</h2>
          <p style={{ textAlign: "center", fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", margin: "-20px auto 32px", maxWidth: 620, lineHeight: 1.7 }}>
            Тело остаётся в напряжении даже в покое. Попытки «успокоиться» или «взять себя в руки» не работают — потому что ты пытаешься решить физиологическую реакцию через мысли.
          </p>
          <div className="ct-pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              "Тело остаётся в напряжении даже в покое",
              "Дыхание становится поверхностным и зажатым",
              "Мысли ускоряются и зацикливаются",
              "Тревога возникает даже без явной причины",
              "Сложно расслабиться даже в спокойной обстановке",
              "Бывают резкие состояния, когда просто «накрывает»",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #e8e8e4" }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>😔</span>
                <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#444", lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", color: "#333", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
              Это не слабость и не «надо просто взять себя в руки».<br />
              <span style={{ color: ACCENT }}>Это физиология. И на неё можно влиять.</span>
            </p>
          </div>
        </div>
      </section>

      {/* GOOD NEWS */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "center" }} className="ct-pain-grid">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT}14`, color: ACCENT, borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                <Icon name="Sparkles" size={14} />
                Хорошая новость
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px", color: "#1a1a1a" }}>
                На это можно влиять — через тело
              </h2>
              <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#555", lineHeight: 1.8, margin: "0 0 16px" }}>
                Через дыхание. Через внимание. Не через мысли и не через силу воли.
              </p>
              <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#555", lineHeight: 1.8, margin: 0 }}>
                В бесплатном мини-курсе ты получишь <strong>3 простых инструмента</strong>, которые помогут снизить уровень тревоги уже с первого применения. Это не теория — это конкретные действия, которые можно применить сразу.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "Wind", text: "Дыхательная техника — быстро снизить внутреннее напряжение" },
                { icon: "Activity", text: "Стабилизация состояния — когда тревога резко усиливается" },
                { icon: "Brain", text: "Практика возврата внимания — выход из тревожных мыслей" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: BG, borderRadius: 14, padding: "16px 18px", border: "1px solid #e8e8e4" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={item.icon} size={16} style={{ color: ACCENT }} />
                  </div>
                  <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#444", lineHeight: 1.6, paddingTop: 4 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOR WHOM */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Кому подойдёт этот курс</h2>
          <div className="ct-pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              "Ты часто чувствуешь тревогу или внутреннее напряжение",
              "Сложно расслабиться даже в спокойной обстановке",
              "Мысли постоянно «крутятся» и не дают отдохнуть",
              "Бывают резкие состояния, когда просто «накрывает»",
              "Хочешь научиться быстро приводить себя в стабильное состояние",
              "Ищешь не таблетки и не «поговорить», а реальные инструменты",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #e8e8e4" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Icon name="Check" size={12} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#444", lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXERCISES */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>3 упражнения, которые меняют состояние</h2>
          <p style={{ textAlign: "center", fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", margin: "-20px auto 40px", maxWidth: 600, lineHeight: 1.7 }}>
            Не аффирмации и не абстрактные практики. Прямое воздействие на вегетативную нервную систему через дыхание — так, как это делает ваш мозг в момент настоящего спокойствия.
          </p>
          <div className="ct-ex-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {EXERCISES.map((ex, i) => (
              <div key={i} style={{ borderRadius: 20, border: "1px solid #e8e8e4", overflow: "hidden", background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ background: ex.bg, padding: "28px 24px 22px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                    <Icon name={ex.icon} size={22} style={{ color: ex.color }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: ex.color, marginBottom: 5 }}>Упражнение {i + 1}</div>
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>{ex.title}</h3>
                  <div style={{ fontSize: 13, color: "#666", fontStyle: "italic" }}>{ex.subtitle}</div>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <p style={{ fontSize: "clamp(13px, 1.3vw, 14px)", color: "#555", lineHeight: 1.75, margin: 0 }}>{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Что вы сможете после курса</h2>
          <div className="ct-results-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {RESULTS.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e8e8e4" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={r.icon} size={18} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#333", lineHeight: 1.5, fontWeight: 500 }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHOR */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Кто ведёт курс</h2>
          <div className="ct-author-grid" style={{
            background: "#fff", border: "1px solid #e8e8e4", borderRadius: 24,
            overflow: "hidden", display: "grid", gridTemplateColumns: "300px 1fr",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}>
            <div style={{ position: "relative", minHeight: 360 }}>
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/8cd8e2aa-0e99-4ff1-ae38-06afef26f470.png"
                alt="Сергей Водопьянов"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", minHeight: 360 }}
              />
            </div>
            <div style={{ padding: "clamp(24px, 4vw, 40px) clamp(24px, 4vw, 44px)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                Автор курса
              </div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>
                Сергей Водопьянов
              </h3>
              <p style={{ color: "#999", fontSize: 14, margin: "0 0 18px" }}>
                Остеопат · 17 лет опыта ·{" "}
                <a href="https://assotsiatsiya-osteopatov.ru/user/svodopianoff/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "none" }}>Член Российской остеопатической ассоциации</a>
              </p>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "#555", lineHeight: 1.75, margin: "0 0 24px" }}>
                За годы практики работал с тысячами людей, помогая улучшить самочувствие при болях в спине и шее, восстановить осанку. Специализируется на работе с офисными сотрудниками, спортсменами и беременными женщинами.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { value: "17", label: "лет практики" },
                  { value: "3000+", label: "консультаций" },
                  { value: "Автор", label: "курсов Dok Диалог" },
                  { value: "РОА", label: "сертификат" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ background: BG, borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 80 }}>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
                <a href="https://massopro.ru/catalog/1" target="_blank" rel="noopener noreferrer" style={{ background: BG, borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 80, textDecoration: "none" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>5.0</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>MassoPRO</div>
                </a>
                <a href="https://yandex.com/maps/org/osteopat_plyus/99582120415/reviews/" target="_blank" rel="noopener noreferrer" style={{ background: BG, borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 80, textDecoration: "none" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>5.0</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>Отзывы Яндекс</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px", background: `linear-gradient(135deg, hsl(185, 85%, 10%) 0%, hsl(185, 70%, 18%) 100%)` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🌬️</div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4.5vw, 44px)", fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
            Начни с простого
          </h2>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "rgba(255,255,255,0.75)", margin: "0 0 32px", lineHeight: 1.7 }}>
            Пройди бесплатный мини-курс и почувствуй, как меняется твоё состояние уже после первых практик. А дальше ты сам решишь — достаточно ли этого, или ты готов идти глубже.
          </p>
          <a
            href={ACCESS_URL}
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#fff",
              color: ACCENT,
              borderRadius: 14,
              padding: "clamp(14px, 2vw, 18px) clamp(28px, 5vw, 52px)",
              fontSize: "clamp(15px, 1.7vw, 17px)",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            Получить доступ бесплатно →
          </a>
        </div>
      </section>

      {/* WHY IT STAYS / UPSELL */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Что важно понимать</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="ct-pain-grid">
            <div style={{ background: BG, borderRadius: 20, padding: "clamp(24px, 4vw, 36px)", border: "1px solid #e8e8e4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff3f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="AlertTriangle" size={20} style={{ color: "#e05050" }} />
                </div>
                <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, margin: 0, color: "#1a1a1a" }}>Почему тревога возвращается</h3>
              </div>
              <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "#555", lineHeight: 1.8, margin: "0 0 12px" }}>
                Напряжение накапливается, а не сбрасывается. Тело остаётся в фоновом стрессе. Нет системы восстановления нервной системы.
              </p>
              <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "#555", lineHeight: 1.8, margin: 0 }}>
                В итоге — ты каждый раз <strong>«тушишь симптомы»</strong>, но не меняешь базовое состояние. Техники курса дают быстрый результат, но если тревога возвращается снова и снова — нервная система уже закрепила нестабильный режим работы.
              </p>
            </div>
            <div style={{ background: `linear-gradient(135deg, hsl(185, 85%, 10%) 0%, hsl(185, 70%, 20%) 100%)`, borderRadius: 20, padding: "clamp(24px, 4vw, 36px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="TrendingUp" size={20} style={{ color: "#fff" }} />
                </div>
                <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, margin: 0, color: "#fff" }}>Системная регуляция ВНС</h3>
              </div>
              <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: "0 0 20px" }}>
                В расширенной программе ты разбираешься глубже: как диагностировать состояние нервной системы, убрать хроническое напряжение из тела и выстроить устойчивое спокойствие и энергию.
              </p>
              <p style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 24px", fontStyle: "italic" }}>
                Это уже не про временное облегчение. Это про состояние, в котором ты живёшь каждый день.
              </p>
              <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 12, padding: "12px 22px", fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
                Смотреть расширенную программу
                <Icon name="ArrowRight" size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Частые вопросы</h2>
          <div style={{ background: "#fff", borderRadius: 20, padding: "0 clamp(16px, 4vw, 32px)", border: "1px solid #e8e8e4" }}>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} title={f.q}>{f.a}</AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "0 20px clamp(48px, 7vw, 80px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", background: "#fff", borderRadius: 24, padding: "clamp(32px, 5vw, 52px) clamp(20px, 5vw, 40px)", border: "1px solid #e8e8e4", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 700, margin: "0 0 14px", color: "#1a1a1a" }}>
            Ты заслуживаешь чувствовать себя хорошо
          </h2>
          <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", lineHeight: 1.7, margin: "0 0 28px" }}>
            Не «терпеть» и не «справляться». А выдохнуть по-настоящему и почувствовать, что контроль над своим состоянием — в твоих руках. Начни сегодня — это бесплатно и займёт 10 минут.
          </p>
          <BtnPrimary href={ACCESS_URL} style={{ fontSize: "clamp(14px, 1.6vw, 17px)", padding: "clamp(14px, 2vw, 18px) clamp(28px, 4vw, 44px)" }}>
            Получить бесплатный доступ →
          </BtnPrimary>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .ct-hero-grid { grid-template-columns: 1fr !important; }
          .ct-hero-img { order: -1; }
          .ct-hero-img img { height: 280px !important; }
          .ct-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .ct-ex-grid { grid-template-columns: 1fr !important; }
          .ct-author-grid { grid-template-columns: 1fr !important; }
          .ct-author-grid img { min-height: 260px !important; max-height: 300px !important; }
        }
        @media (max-width: 600px) {
          .ct-pain-grid { grid-template-columns: 1fr !important; }
          .ct-results-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 400px) {
          .ct-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <DokFooter />
    </div>
  );
}