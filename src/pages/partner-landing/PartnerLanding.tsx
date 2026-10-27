import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import MissionSection from "./MissionSection";
import ClientsGetSection from "./ClientsGetSection";
import { TITLE, DESCRIPTION, URL_FULL, OG_IMAGE, BENEFITS, STATS, STEPS, WHO, EARLY } from "./data";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const darkBg = `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`;

function Cta({ children = "Стать партнёром", light = false }: { children?: ReactNode; light?: boolean }) {
  return (
    <Link to="/partner" style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "17px 34px", borderRadius: 2,
      background: light ? "#fff" : `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 16, fontWeight: 700, textDecoration: "none",
    }}>{children}<Icon name="ArrowRight" size={17} /></Link>
  );
}

function Head({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 0 44px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: dark ? TEAL : "#0F766E", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,44px)", fontWeight: 500, color: dark ? "#fff" : DARK, margin: 0, lineHeight: 1.12, letterSpacing: "-0.4px" }}>{title}</h2>
    </div>
  );
}

const section = (bg: string): React.CSSProperties => ({ background: bg, padding: "92px 24px" });
const wrap: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };

export default function PartnerLanding() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={URL_FULL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Промт Диалог" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={URL_FULL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1360" />
        <meta property="og:image:height" content="768" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Helmet>
      <BizNavbar />

      <section style={{ background: darkBg, padding: "150px 24px 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-8%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.16) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ ...wrap, position: "relative", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "center" }} className="pl-hero">
          <div>
            <div style={{ display: "inline-block", background: TEAL, color: DARK, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "7px 16px", borderRadius: 100, marginBottom: 24 }}>Партнёрская программа</div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5.2vw,62px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.05, letterSpacing: "-0.6px" }}>Станьте партнёром «Промт Диалог»</h1>
            <p style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.4vw,28px)", color: TEAL, margin: "0 0 22px", lineHeight: 1.25 }}>Ваше предложение появляется тогда, когда человеку нужна ваша услуга.</p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, fontWeight: 300, margin: "0 0 14px" }}>
              «Промт Диалог» помогает предпринимателям и специалистам выбирать следующие шаги для дела. Теперь в рекомендациях ИИ могут появляться услуги, обучение и консультации партнёров.
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, fontWeight: 300, margin: "0 0 30px" }}>
              Это не каталог рекламы: предложение показывается, только если подходит задаче человека.
            </p>
            <Cta />
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 16, lineHeight: 1.6, maxWidth: 480 }}>На старте участие бесплатное, количество клиентов не гарантируется.</div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[{ i: "Target", t: "Подходящий клиент", d: "услугу видит тот, кому она подходит" }, { i: "Sparkles", t: "Рекомендация ИИ", d: "ИИ объясняет, почему услуга подходит" }, { i: "BadgeCheck", t: "Карточка партнёра", d: "описание и условия, а не бюджет" }].map(x => (
              <div key={x.t} style={{ display: "flex", gap: 16, alignItems: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={x.i} size={22} style={{ color: DARK }} /></div>
                <div><div style={{ fontFamily: SERIF, fontSize: 22, color: "#fff", fontWeight: 600 }}>{x.t}</div><div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{x.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={section("#fff")}>
        <div style={wrap}>
          <Head eyebrow="Преимущества" title="Что вы получаете" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 20 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ border: "1px solid #E2E8F0", borderRadius: 18, overflow: "hidden", background: "#fff" }}>
                <img src={b.image} alt={b.title} loading="lazy" style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover", background: "#F0FDFA" }} />
                <div style={{ padding: "26px 28px 30px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}><Icon name={b.icon} size={24} style={{ color: "#0F766E" }} /></div>
                <h3 style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 600, color: DARK, margin: "0 0 14px", lineHeight: 1.2 }}>{b.title}</h3>
                {b.text.map(t => <p key={t} style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: "0 0 12px" }}>{t}</p>)}
                <p style={{ fontSize: 14.5, color: DARK, lineHeight: 1.65, fontWeight: 500, margin: "6px 0 0", paddingLeft: 14, borderLeft: `3px solid ${TEAL}` }}>{b.accent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClientsGetSection />

      <section style={section("#F8FAFC")}>
        <div style={wrap}>
          <Head eyebrow="Пример" title="Как выглядит рекомендация" />
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "22px 26px" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Задача пользователя</div>
              <div style={{ fontFamily: SERIF, fontSize: 24, color: DARK, fontStyle: "italic", lineHeight: 1.3 }}>«В салоне мало повторных записей. Хочу повысить возвращаемость клиентов».</div>
            </div>
            <div style={{ color: "#0F766E" }}><Icon name="ArrowDown" size={26} /></div>
            <div style={{ background: darkBg, borderRadius: 18, padding: "28px 30px", boxShadow: "0 20px 60px rgba(15,23,42,0.18)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEAL, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}><Icon name="Handshake" size={15} />Персональная рекомендация</div>
              <div style={{ fontFamily: SERIF, fontSize: 26, color: "#fff", fontWeight: 600, lineHeight: 1.2, marginBottom: 12 }}>Вам может помочь специалист по удержанию клиентов</div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontWeight: 300, margin: "0 0 14px" }}>Для анализа клиентского пути и системы повторных записей посмотрите предложение партнёра.</p>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: "0 0 16px" }}><b style={{ color: TEAL, fontWeight: 600 }}>Почему показано:</b> предложение связано с вашей задачей — повторные записи.</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 13.5, fontWeight: 700, padding: "11px 20px", borderRadius: 9 }}>Подробнее об услуге<Icon name="ArrowRight" size={14} /></span>
            </div>
            <div style={{ fontSize: 12.5, color: GRAY }}>Это демонстрационный пример, а не реальная рекомендация.</div>
          </div>
        </div>
      </section>

      <section style={section("#fff")}>
        <div style={wrap}>
          <Head eyebrow="Прозрачность" title="Статистика в личном кабинете партнёра" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 22 }}>
            {STATS.map(s => (
              <div key={s.title} style={{ border: "1px solid #E2E8F0", borderRadius: 16, padding: "24px 22px" }}>
                <Icon name={s.icon} size={24} style={{ color: "#0F766E", marginBottom: 12 }} />
                <div style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, color: DARK, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...section(darkBg) }}>
        <div style={wrap}>
          <Head dark eyebrow="Как это работает" title="Шесть шагов" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 16 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "26px 24px", background: "rgba(255,255,255,0.04)" }}>
                <div style={{ fontFamily: SERIF, fontSize: 44, color: TEAL, lineHeight: 1, marginBottom: 12 }}>{s.n}</div>
                <div style={{ fontFamily: SERIF, fontSize: 23, color: "#fff", fontWeight: 600, marginBottom: 8, lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontWeight: 300 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={section("#fff")}>
        <div style={wrap}>
          <Head eyebrow="Для кого" title="Кому подойдёт партнёрство" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 16 }}>
            {WHO.map(w => (
              <div key={w.title} style={{ border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
                <img src={w.image} alt={w.title} loading="lazy" style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover", background: "#F0FDFA" }} />
                <div style={{ display: "flex", gap: 14, padding: "20px 22px 22px", alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(45,212,191,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={w.icon} size={21} style={{ color: "#0F766E" }} /></div>
                  <div><div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, color: DARK, marginBottom: 4, lineHeight: 1.2 }}>{w.title}</div><div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>{w.text}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={section("#F8FAFC")}>
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="pl-two">
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>Первая партнёрская группа</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 500, color: DARK, margin: "0 0 18px", lineHeight: 1.12 }}>Почему присоединиться сейчас</h2>
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: 0 }}>Мы формируем первую партнёрскую группу и настраиваем рекомендации. Аудитория растёт вместе с платформой, поэтому статистика на старте может быть небольшой.</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 18, padding: "26px 26px" }}>
            <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: DARK, marginBottom: 14 }}>Первым участникам это даёт:</div>
            <div style={{ display: "grid", gap: 12 }}>
              {EARLY.map(t => (
                <div key={t} style={{ display: "flex", gap: 11, fontSize: 15, color: GRAY, lineHeight: 1.65, fontWeight: 300 }}>
                  <Icon name="Check" size={18} style={{ color: "#0F766E", flexShrink: 0, marginTop: 3 }} /><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={section("#fff")}>
        <div style={wrap}>
          <div style={{ border: `1px solid ${TEAL}`, borderRadius: 22, padding: "44px 42px", background: "linear-gradient(135deg,#F0FDFA,#fff)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>Сколько стоит участие</div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,54px)", color: DARK, fontWeight: 500, lineHeight: 1.05, marginBottom: 18 }}>На старте — бесплатно</div>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: 0, maxWidth: 680 }}>Вместо оплаты за размещение один раз расскажите о «Промт Диалог» своей аудитории: пост, статья или материал в Telegram-канале. Отправьте ссылку через кабинет, и после проверки участие продолжается без повторных отчётов.</p>
          </div>
        </div>
      </section>

      <MissionSection />

      <section style={section("#F8FAFC")}>
        <div style={wrap}>
          <div style={{ background: darkBg, borderRadius: 22, padding: "50px 44px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEAL, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 16 }}><Icon name="Mail" size={15} />Личное приглашение</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.8vw,42px)", color: "#fff", fontWeight: 500, margin: "0 0 20px", lineHeight: 1.12 }}>Одно место в каждом направлении</h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontWeight: 300, margin: "0 0 14px" }}>Мы приглашаем одного специалиста в каждом направлении, чтобы человек получал один точный совет, а не выбирал из десятка похожих.</p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontWeight: 300, margin: 0 }}>Вы получили приглашение, потому что мы выбрали вас вручную.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...section(darkBg) }}>
        <div style={wrap}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.4vw,50px)", color: "#fff", fontWeight: 500, margin: "0 0 20px", lineHeight: 1.1 }}>Присоединяйтесь к первой партнёрской группе</h2>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontWeight: 300, margin: "0 0 32px" }}>Можно начать сейчас: подготовьте предложение и пройдите модерацию, пока растёт аудитория.</p>
          <Cta>Стать партнёром «Промт Диалог»</Cta>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "30px 0 0", maxWidth: 640 }}>
            Участие не гарантирует определённое количество показов, переходов, обращений или продаж. Рекомендации формируются с учётом соответствия предложения контексту пользователя. Подробные условия — в <Link to="/partner/rules" style={{ color: TEAL }}>правилах партнёрской программы</Link>.
          </p>
        </div>
      </section>

      <BizFooter />
      <style>{`
        @media (max-width: 900px) {
          .pl-hero, .pl-two { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 520px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  );
}