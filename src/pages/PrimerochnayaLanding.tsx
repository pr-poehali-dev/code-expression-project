import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const PAINS = [
  { icon: "Frown",        title: "«Не то, что я представляла»",   desc: "Клиент описывает желаемое словами, мастер делает по-своему — и итог не совпадает с ожиданием. Разочарование, испорченное настроение, иногда и конфликт." },
  { icon: "Clock",        title: "Время и деньги на переделку",   desc: "Неудачная стрижка или окрашивание — это повторный визит, дополнительные материалы и часы работы мастера, которые никто не оплатит дважды." },
  { icon: "HelpCircle",   title: "Клиент сам не знает, чего хочет", desc: "«Что-нибудь новое», «на ваш вкус» — а потом внезапно не нравится результат, хотя мастер сделал именно то, о чём просили." },
  { icon: "TrendingDown", title: "Потеря доверия к салону",        desc: "Один неудачный опыт — и клиент больше не запишется, даже если в целом мастер работает отлично. Репутация страдает быстрее, чем растёт." },
];

const GAINS = [
  { icon: "Eye",          title: "Клиент видит себя заранее",     desc: "Ещё на консультации — фото с новой стрижкой, макияжем, маникюром или образом. Не описание, а реальная картинка." },
  { icon: "MessageCircle",title: "Общий язык с мастером",          desc: "Пожелание «покороче» и «покороче на 5 см» — совсем разные вещи. Фото убирает недопонимание раз и навсегда." },
  { icon: "PiggyBank",    title: "Экономия времени и материалов",  desc: "Примерка за секунды вместо часа работы вслепую. Меньше переделок — меньше расходов на краску, материалы и время мастера." },
  { icon: "Heart",        title: "Клиент увереннее в решении",     desc: "Записывается на услугу, уже зная результат — меньше сомнений, меньше отмен записи в последний момент." },
  { icon: "Sparkles",     title: "Подсказки для мастера",          desc: "Вместе с картинкой — рекомендация, какую технику, средства или подход использовать, чтобы добиться именно такого результата." },
  { icon: "Repeat",       title: "Клиент возвращается снова",      desc: "Опыт, где не обманули ожидания — веский повод прийти в этот салон ещё раз и порекомендовать друзьям." },
];

const SCENARIOS = [
  { icon: "Scissors",         label: "Стрижка",        desc: "и укладка волос" },
  { icon: "Sparkles",         label: "Макияж",         desc: "лица" },
  { icon: "Hand",             label: "Ногти",          desc: "маникюр и дизайн" },
  { icon: "PersonStanding",   label: "Фигура и стиль", desc: "образ и одежда" },
];

const STEPS = [
  { num: "01", title: "Фото на консультации", desc: "Мастер фотографирует клиента прямо в кресле — телефоном или через личный кабинет.", icon: "Camera" },
  { num: "02", title: "Описание пожелания",   desc: "Клиент говорит, что хочет — мастер вводит пожелание в пару слов: цвет, длина, стиль.", icon: "MessageSquareText" },
  { num: "03", title: "Результат за секунды", desc: "ИИ показывает фото с новым образом — обсуждайте прямо на месте, пока клиент ещё в кресле.", icon: "Wand2" },
  { num: "04", title: "Подсказка мастеру",    desc: "Вместе с картинкой приходит рекомендация: какая техника и средства дадут такой результат.", icon: "ListChecks" },
];

const REVIEWS = [
  { name: "Алина Р.",     role: "владелица салона, Екатеринбург", text: "Клиентка хотела «что-то освежающее», а по факту в голове держала конкретный образ из Pinterest. Показали три варианта на её фото — выбрала за минуту, мастер сделал ровно то, что она видела на экране.", rating: 5 },
  { name: "Марат С.",     role: "барбер, Казань", text: "У мужчин та же история: «покороче, но не слишком». Теперь показываю на фото три длины сразу — выбирают глазами, а не словами. Переделок стало в разы меньше.", rating: 5 },
  { name: "Виктория Л.",  role: "мастер по маникюру, Санкт-Петербург", text: "Раньше клиентка листала картинки в телефоне и говорила «примерно вот так». Теперь я показываю дизайн прямо на её руке — согласование занимает секунды, а не пол-консультации.", rating: 5 },
  { name: "Юлия Н.",      role: "администратор сети салонов, Краснодар", text: "Мы стали закрывать сомневающихся клиентов прямо на консультации. Человек видит себя с новым цветом волос — и записывается сразу, а не «я подумаю».", rating: 5 },
];

export default function PrimerochnayaLanding() {
  return (
    <>
      <Helmet>
        <title>Примерочная — ИИ показывает новый образ клиента за секунды | Промт Диалог</title>
        <meta name="description" content="Мастер фотографирует клиента и по его пожеланиям показывает новую стрижку, макияж, маникюр или стиль ещё на консультации. Экономит время, материалы и убирает разрыв между ожиданием и результатом." />
        <meta name="keywords" content="примерочная для салона красоты, виртуальная примерка стрижки, ИИ примерка образа, примерка макияжа онлайн, инструменты для мастера салона" />
      </Helmet>

      <BizNavbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", right: "8%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.10) 0%,transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-fit-grid">

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
                <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Новый образ за секунды</span>
              </div>

              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5.5vw,68px)", fontWeight: 500, color: "#fff", lineHeight: 1.08, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
                Клиент увидит себя<br />
                <span style={{ color: TEAL }}>новым</span> — ещё до того,<br />
                как мастер начнёт
              </h1>

              <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 40px", fontWeight: 300, maxWidth: 500 }}>
                Мастер фотографирует клиента прямо в кресле и по его пожеланиям показывает новую стрижку, макияж, маникюр или стиль — <strong style={{ color: "#fff", fontWeight: 600 }}>реальную картинку, а не обещание на словах</strong>.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
                <Link to="/cabinet" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "16px 32px", borderRadius: 2,
                  background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                  color: DARK, fontSize: 16, fontWeight: 700,
                  textDecoration: "none", boxShadow: "0 8px 32px rgba(45,212,191,0.35)",
                }}>
                  <Icon name="Wand2" size={18} />
                  Попробовать бесплатно
                </Link>
                <a href="#how" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "16px 24px", borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.7)", fontSize: 15, textDecoration: "none",
                }}>
                  Как это работает <Icon name="ArrowDown" size={15} />
                </a>
              </div>

              <div style={{ display: "flex", gap: 40, paddingTop: 36, borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" }}>
                {[["~30 сек","до готового фото"],["4 сценария","стрижка, макияж, ногти, стиль"],["1 раз","бесплатно на старте"]].map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 5 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Фото: мастер показывает клиентке новый образ на телефоне прямо в кресле */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 18, background: `linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))`, pointerEvents: "none", zIndex: 2 }} />
              <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
                <img
                  src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/cbca49b9-e625-4c09-83a0-ce45e3566b2b.png"
                  alt="Клиентка в кресле салона смотрит на экран телефона со своим новым образом, сгенерированным ИИ — Примерочная"
                  decoding="async"
                  style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1 }}
                />
              </div>
              <div style={{ position: "absolute", top: -16, right: -16, background: TEAL, borderRadius: 12, padding: "10px 16px", boxShadow: "0 8px 24px rgba(45,212,191,0.4)", display: "flex", alignItems: "center", gap: 8, zIndex: 3 }}>
                <Icon name="Sparkles" size={16} style={{ color: DARK }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>Готово за секунды</span>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.hero-fit-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── БОЛИ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Знакомая ситуация?</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>
              Желание одно —<br />результат другой
            </h2>
            <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.75, margin: 0, maxWidth: 620, fontWeight: 300 }}>
              Клиент описывает образ словами, мастер представляет по-своему — и в зеркале не всегда та картинка, которую ждали.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="pains-grid">
            {PAINS.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 28px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={18} style={{ color: "#EF4444" }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.25 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.pains-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ЧТО ДАЁТ ПРИМЕРОЧНАЯ ─────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>С Примерочной</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Ожидание и результат — теперь одно и то же
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="gains-grid">
            {GAINS.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 26px", transition: "background 0.25s, color 0.25s", cursor: "default" }}
                onMouseEnter={e => { const d = e.currentTarget; d.style.background = DARK; d.querySelectorAll<HTMLElement>(".ct,.cd").forEach(el => { el.style.color = el.classList.contains("ct") ? "#fff" : "rgba(255,255,255,0.45)"; }); }}
                onMouseLeave={e => { const d = e.currentTarget; d.style.background = "#fff"; d.querySelectorAll<HTMLElement>(".ct,.cd").forEach(el => { el.style.color = el.classList.contains("ct") ? DARK : "#64748B"; }); }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={18} style={{ color: TEAL }} />
                </div>
                <div className="ct" style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.25, transition: "color 0.25s" }}>{title}</div>
                <div className="cd" style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, transition: "color 0.25s" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.gains-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:540px){.gains-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── 4 СЦЕНАРИЯ ────────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "100px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse,rgba(45,212,191,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Что можно примерить</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Четыре сценария — один инструмент
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }} className="scenarios-grid">
            {SCENARIOS.map(({ icon, label, desc }, i) => (
              <div key={i} style={{ padding: "40px 24px", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, border: "1px solid rgba(45,212,191,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, background: "rgba(45,212,191,0.06)", margin: "0 auto 20px" }}>
                  <Icon name={icon} size={24} style={{ color: TEAL }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:800px){.scenarios-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:480px){.scenarios-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── КАК ЭТО РАБОТАЕТ ──────────────────────────────────────────────── */}
      <section id="how" style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Четыре шага</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              От фото до готового образа
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }} className="steps-grid">
            {STEPS.map(({ num, title, desc, icon }, i) => (
              <div key={i}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: i === 0 ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "#F1F5F9", border: i === 0 ? "none" : "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: i === 0 ? "0 8px 24px rgba(45,212,191,0.3)" : "none" }}>
                  <Icon name={icon} size={24} style={{ color: i === 0 ? DARK : TEAL }} />
                </div>
                <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {num}</div>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:800px){.steps-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:480px){.steps-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ПОДСКАЗКА ДЛЯ МАСТЕРА ─────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg,${DARK},#112B3C)`, borderRadius: 6, padding: "48px 40px", display: "flex", alignItems: "center", gap: 40, position: "relative", overflow: "hidden" }} className="hint-block">
            <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, background: "radial-gradient(circle,rgba(45,212,191,0.12) 0%,transparent 65%)", pointerEvents: "none" }} />
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 12px 32px rgba(45,212,191,0.3)" }}>
              <Icon name="ListChecks" size={36} style={{ color: DARK }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>Не только картинка</div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 500, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>Мастер тоже получает подсказку</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0, maxWidth: 560 }}>
                Вместе с готовым образом — краткая рекомендация: какую технику, средства или подход использовать, чтобы результат в кресле совпал с тем, что показала Примерочная.
              </p>
            </div>
            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 24px", borderRadius: 2,
              background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
              color: DARK, fontSize: 15, fontWeight: 700,
              textDecoration: "none", flexShrink: 0,
              boxShadow: "0 8px 24px rgba(45,212,191,0.3)",
              whiteSpace: "nowrap",
            }}>
              Попробовать <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
        <style>{`@media(max-width:800px){.hint-block{flex-direction:column!important;padding:32px 24px!important;}}`}</style>
      </section>

      {/* ── ОТЗЫВЫ ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Отзывы мастеров и салонов</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Что говорят те, кто уже примеряет
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="reviews-grid">
            {REVIEWS.map(({ name, role, text, rating }, i) => (
              <div key={i} style={{ background: "#F8FAFC", padding: "32px 28px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: rating }).map((_, si) => (
                    <Icon key={si} name="Star" size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ fontFamily: SERIF, fontSize: 17, color: DARK, lineHeight: 1.6, margin: "0 0 20px", fontStyle: "italic", flex: 1 }}>
                  «{text}»
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>{name.charAt(0)}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{name}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.reviews-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 350, background: "radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "7px 20px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Бесплатно на первый раз</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.08 }}>
              Покажите клиенту<br />результат — не обещание
            </h2>
            <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 40px", fontWeight: 300 }}>
              Подключите Примерочную в личном кабинете — первая примерка бесплатно, дальше по мере пополнения баланса.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
              <Link to="/cabinet" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "18px 36px", borderRadius: 2,
                background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                color: DARK, fontSize: 17, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 12px 40px rgba(45,212,191,0.4)",
              }}>
                <Icon name="Wand2" size={20} />
                Попробовать Примерочную
              </Link>
              <Link to="/vozmozhnosti" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "18px 30px", borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.7)", fontSize: 15, textDecoration: "none",
              }}>
                <Icon name="ArrowLeft" size={15} /> Ко всем возможностям
              </Link>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[["Стрижка","макияж, ногти, стиль"],["~30 сек","на готовый результат"],["Подсказка","мастеру в комплекте"]].map(([v, l], i) => (
                <div key={i}>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BizFooter />
    </>
  );
}