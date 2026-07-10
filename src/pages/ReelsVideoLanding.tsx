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
  { icon: "BrainCircuit", title: "«Не знаю, о чём снять»",        desc: "Мастер или администратор час смотрит в камеру и не понимает, с чего начать ролик — идеи заканчиваются уже на второй неделе." },
  { icon: "Hourglass",    title: "Съёмка съедает рабочий день",   desc: "Без сценария ролик снимают по 10 дублей вслепую — время, которое можно было потратить на клиентов, уходит на пересъёмки." },
  { icon: "VideoOff",     title: "Ролики выглядят непрофессионально", desc: "Без хука в первые секунды и понятной структуры зритель листает дальше — просмотры и заявки не растут." },
  { icon: "CalendarX",    title: "Контент выходит редко и хаотично", desc: "Нерегулярные публикации — сигнал для подписчиков, что салон «не живой». Доверие и репутация страдают тише, чем от плохой стрижки, но так же ощутимо." },
];

const GAINS = [
  { icon: "Lightbulb",  title: "Идеи не заканчиваются",        desc: "Опишите услугу и цель — ИИ сразу предложит несколько готовых идей для ролика, под вашу нишу и аудиторию." },
  { icon: "ListOrdered",title: "Покадровый сценарий за минуту", desc: "Хук в первые секунды, структура повествования, текст для озвучки и призыв к действию — расписано по кадрам, не нужно ничего придумывать на площадке." },
  { icon: "Clapperboard",title: "Видео сразу, без съёмки",       desc: "Если снимать некогда — сценарий одним нажатием превращается в готовый видеоролик, сгенерированный ИИ." },
  { icon: "ImageIcon",  title: "Обложка для рилса в комплекте",  desc: "Готовое превью для сторис и постов генерируется вместе со сценарием — не нужен дизайнер." },
  { icon: "TrendingUp", title: "Стабильный поток заявок",        desc: "Регулярный качественный контент приводит новых подписчиков, а из них — новых клиентов на запись." },
  { icon: "ShieldCheck",title: "Репутация профессионального салона", desc: "Ролики со структурой и качеством выглядят так, будто их снял SMM-агентство — это работает на доверие ещё до визита клиента." },
];

const FLOW = [
  { icon: "Type",         label: "Тема и цель" },
  { icon: "Lightbulb",    label: "3–4 идеи" },
  { icon: "ListOrdered",  label: "Сценарий" },
  { icon: "Clapperboard", label: "Видео + обложка" },
];

const STATS = [
  { value: "5 мин",  label: "от идеи до готового сценария" },
  { value: "0 ₽",    label: "без найма SMM-специалиста" },
  { value: "1 клик", label: "переход от сценария сразу к видео" },
];

const REVIEWS = [
  { name: "Дарья К.",   role: "администратор салона, Москва", text: "Раньше на один рилс уходил целый вечер — сидели с телефоном, придумывали текст на ходу. Теперь сценарий готов за 5 минут, снимаем с первого дубля.", rating: 5 },
  { name: "Игорь П.",   role: "владелец барбершопа, Новосибирск", text: "Мы перестали пропускать недели без публикаций. Ролики стали смотреться профессионально — клиенты сами пишут «увидели вас в рилсах».", rating: 5 },
  { name: "Софья В.",   role: "мастер по бровям, Ростов-на-Дону", text: "Снимать самой не всегда получается — иногда просто генерирую видео сразу из сценария. Для сторис и разогрева аудитории хватает с запасом.", rating: 5 },
  { name: "Тимур А.",   role: "управляющий сетью салонов, Уфа", text: "Раньше контент делали хаотично — то густо, то пусто. Теперь у каждого администратора под рукой готовый инструмент, и лента выглядит как у профессионального агентства.", rating: 5 },
];

export default function ReelsVideoLanding() {
  return (
    <>
      <Helmet>
        <title>Сценарии и видео для Reels — контент салона за минуты | Промт Диалог</title>
        <meta name="description" content="ИИ пишет покадровый сценарий для рилса под вашу услугу и цель, готовит обложку и может сразу сгенерировать видео. Регулярный качественный контент для привлечения клиентов и репутации салона." />
        <meta name="keywords" content="сценарий для рилс, генератор видео для салона красоты, контент для инстаграм салона, ИИ видео для соцсетей, продвижение салона красоты видео" />
      </Helmet>

      <BizNavbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/2d910f90-a981-4541-9c9b-011b79ae76f6.png)`,
          backgroundSize: "cover", backgroundPosition: "center", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `radial-gradient(120% 100% at 80% 0%, rgba(17,43,60,0.93) 0%, rgba(15,23,42,0.94) 55%, rgba(6,11,22,0.97) 100%)`,
        }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", top: "18%", right: "6%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.10) 0%,transparent 65%)", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-reels-grid">

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
                <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>От идеи до видео за минуты</span>
              </div>

              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5.2vw,64px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
                Контент, который<br />
                <span style={{ color: TEAL }}>привлекает клиентов</span><br />
                и работает на репутацию
              </h1>

              <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 40px", fontWeight: 300, maxWidth: 500 }}>
                ИИ пишет покадровый сценарий для рилса, готовит обложку — и может сразу сгенерировать видео. <strong style={{ color: "#fff", fontWeight: 600 }}>Без SMM-специалиста и часов на пересъёмки</strong>.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
                <Link to="/cabinet" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "16px 32px", borderRadius: 2,
                  background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                  color: DARK, fontSize: 16, fontWeight: 700,
                  textDecoration: "none", boxShadow: "0 8px 32px rgba(45,212,191,0.35)",
                }}>
                  <Icon name="Clapperboard" size={18} />
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
                {STATS.map(({ value, label }, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 5 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Мокап телефона со сценарием — раскадровка */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: 340 }}>
                <div style={{ position: "absolute", inset: -1, borderRadius: 28, background: `linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))`, pointerEvents: "none", zIndex: 2 }} />
                <div style={{ position: "relative", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 26, padding: "18px 16px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Icon name="Clapperboard" size={16} style={{ color: TEAL }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Сценарий рилса · маникюр</span>
                  </div>
                  {[
                    { t: "0–2 сек", d: "Хук: крупный план рук до и после — «Вот что можно сделать за 40 минут»" },
                    { t: "2–6 сек", d: "Процесс: быстрая перемотка этапов работы мастера" },
                    { t: "6–9 сек", d: "Результат: готовый маникюр крупным планом, довольная клиентка" },
                    { t: "9–10 сек", d: "Призыв: «Запишись по ссылке в шапке профиля»" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, flexShrink: 0, width: 56 }}>{row.t}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{row.d}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="Sparkles" size={13} style={{ color: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>Обложка сгенерирована · готово к публикации</span>
                  </div>
                </div>
                <div style={{ position: "absolute", top: -16, right: -16, background: TEAL, borderRadius: 12, padding: "10px 16px", boxShadow: "0 8px 24px rgba(45,212,191,0.4)", display: "flex", alignItems: "center", gap: 8, zIndex: 3 }}>
                  <Icon name="Zap" size={16} style={{ color: DARK }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>Готово за 5 минут</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.hero-reels-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── БОЛИ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Знакомая ситуация?</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>
              Контент требует времени,<br />которого нет
            </h2>
            <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.75, margin: 0, maxWidth: 620, fontWeight: 300 }}>
              Без сценария и системы съёмки превращаются в мучение — а нерегулярный контент тише всего бьёт по репутации салона.
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

      {/* ── ЧТО ДАЁТ ИНСТРУМЕНТ ──────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>С этим инструментом</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Контент выходит стабильно —<br />и выглядит профессионально
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

      {/* ── КАК ЭТО РАБОТАЕТ — ВОРОНКА ───────────────────────────────────── */}
      <section id="how" style={{ background: DARK, padding: "100px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse,rgba(45,212,191,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: 56, textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Четыре шага</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.1 }}>
              От темы до готового ролика
            </h2>
          </div>
          <div className="flow-steps" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", gap: 0 }}>
            {FLOW.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 2,
                    background: "rgba(45,212,191,0.08)",
                    border: "1px solid rgba(45,212,191,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon name={step.icon} size={26} style={{ color: TEAL }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 100, lineHeight: 1.4, letterSpacing: "0.3px" }}>{step.label}</div>
                </div>
                {i < FLOW.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 12px", marginBottom: 30 }}>
                    <div style={{ width: 24, height: 1, background: "rgba(45,212,191,0.25)" }} />
                    <Icon name="ChevronRight" size={14} style={{ color: "rgba(45,212,191,0.4)", marginLeft: -5 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.flow-steps{flex-wrap:wrap!important;justify-content:center!important;}}`}</style>
      </section>

      {/* ── СЦЕНАРИЙ → ВИДЕО (уникальная фича) ───────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg,${DARK},#112B3C)`, borderRadius: 6, padding: "48px 40px", display: "flex", alignItems: "center", gap: 40, position: "relative", overflow: "hidden" }} className="hint-block">
            <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, background: "radial-gradient(circle,rgba(45,212,191,0.12) 0%,transparent 65%)", pointerEvents: "none" }} />
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 12px 32px rgba(45,212,191,0.3)" }}>
              <Icon name="Clapperboard" size={36} style={{ color: DARK }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>Не хотите снимать сами?</div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 500, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>Сценарий превращается в видео одним нажатием</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0, maxWidth: 560 }}>
                Если снимать некогда — готовый сценарий сразу передаётся в генератор видео, и ИИ создаёт ролик за 1–3 минуты, с обложкой в комплекте.
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

      {/* ── РЕПУТАЦИЯ ─────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Почему это важнее, чем кажется</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 24px", lineHeight: 1.2 }}>
            Качественный и регулярный контент —<br />это тоже репутация салона
          </h2>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.8, margin: "0 auto", maxWidth: 680, fontWeight: 300 }}>
            Клиент, который заходит в профиль салона перед первой записью, судит не только по отзывам. Пустая лента, редкие посты или неаккуратное видео читаются как «здесь не следят за деталями». Аккуратный, структурированный и своевременный контент работает как безмолвная рекомендация — <strong style={{ color: DARK, fontWeight: 600 }}>ещё до того, как клиент переступил порог салона</strong>.
          </p>
        </div>
      </section>

      {/* ── ОТЗЫВЫ ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Отзывы салонов и мастеров</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Что говорят те, кто уже снимает по сценарию
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="reviews-grid">
            {REVIEWS.map(({ name, role, text, rating }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 28px", display: "flex", flexDirection: "column" }}>
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
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Контент без хаоса</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.08 }}>
              Снимайте контент,<br />который работает на вас
            </h2>
            <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 40px", fontWeight: 300 }}>
              Подключите инструмент в личном кабинете — первые сценарии бесплатно, видео по мере пополнения баланса.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
              <Link to="/cabinet" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "18px 36px", borderRadius: 2,
                background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                color: DARK, fontSize: 17, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 12px 40px rgba(45,212,191,0.4)",
              }}>
                <Icon name="Clapperboard" size={20} />
                Попробовать бесплатно
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
              {[["Сценарий","+ обложка за минуты"],["Видео","из сценария в 1 клик"],["Регулярность","контент по расписанию"]].map(([v, l], i) => (
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