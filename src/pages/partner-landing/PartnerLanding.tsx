import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
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
    <div style={{ maxWidth: 760, margin: "0 auto 44px", textAlign: "center" }}>
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
            <p style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.4vw,28px)", color: TEAL, margin: "0 0 22px", lineHeight: 1.25 }}>Ваше предложение может появиться именно тогда, когда человеку нужна ваша услуга.</p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, fontWeight: 300, margin: "0 0 14px" }}>
              «Промт Диалог» помогает предпринимателям и специалистам находить точки роста и выбирать следующие шаги для своего дела. Теперь в этой системе могут появляться предложения партнёров: услуги, обучение и консультации, которые действительно подходят под задачу конкретного человека.
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, fontWeight: 300, margin: "0 0 30px" }}>
              Мы создаём не рекламный каталог, а систему интеллектуальных рекомендаций: важен не охват, а соответствие предложения потребности человека.
            </p>
            <Cta />
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 16, lineHeight: 1.6, maxWidth: 480 }}>На старте участие бесплатное. Количество клиентов не гарантируется: платформа развивается, и аудиторию предстоит наращивать.</div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[{ i: "Target", t: "Целевой клиент", d: "услугу видит тот, кому она подходит" }, { i: "Sparkles", t: "Рекомендация ИИ", d: "объяснение, почему это может помочь" }, { i: "BadgeCheck", t: "Репутация партнёра", d: "качество и прозрачность, а не бюджет" }].map(x => (
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
          <Head eyebrow="Преимущества" title="Почему это может быть выгодно именно вам" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 20 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ border: "1px solid #E2E8F0", borderRadius: 18, padding: "30px 28px", background: "#fff" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}><Icon name={b.icon} size={24} style={{ color: "#0F766E" }} /></div>
                <h3 style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 600, color: DARK, margin: "0 0 14px", lineHeight: 1.2 }}>{b.title}</h3>
                {b.text.map(t => <p key={t} style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: "0 0 12px" }}>{t}</p>)}
                <p style={{ fontSize: 14.5, color: DARK, lineHeight: 1.65, fontWeight: 500, margin: "6px 0 0", paddingLeft: 14, borderLeft: `3px solid ${TEAL}` }}>{b.accent}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={section("#F8FAFC")}>
        <div style={{ ...wrap, maxWidth: 940 }}>
          <Head eyebrow="Пример" title="Как работает рекомендация" />
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "22px 26px" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Задача пользователя</div>
              <div style={{ fontFamily: SERIF, fontSize: 24, color: DARK, fontStyle: "italic", lineHeight: 1.3 }}>«В салоне мало повторных записей. Хочу повысить возвращаемость клиентов».</div>
            </div>
            <div style={{ textAlign: "center", color: "#0F766E" }}><Icon name="ArrowDown" size={26} /></div>
            <div style={{ background: darkBg, borderRadius: 18, padding: "28px 30px", boxShadow: "0 20px 60px rgba(15,23,42,0.18)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEAL, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}><Icon name="Handshake" size={15} />Персональная рекомендация</div>
              <div style={{ fontFamily: SERIF, fontSize: 26, color: "#fff", fontWeight: 600, lineHeight: 1.2, marginBottom: 12 }}>Возможно, вам поможет специалист по удержанию клиентов</div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontWeight: 300, margin: "0 0 14px" }}>Если вам нужна помощь в анализе клиентского пути и разработке системы повторных записей, рассмотрите предложение партнёра, который специализируется на этой задаче.</p>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: "0 0 16px" }}><b style={{ color: TEAL, fontWeight: 600 }}>Почему это может подойти:</b> предложение связано с вашей задачей по повышению повторных записей.</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 13.5, fontWeight: 700, padding: "11px 20px", borderRadius: 9 }}>Подробнее об услуге<Icon name="ArrowRight" size={14} /></span>
            </div>
            <div style={{ fontSize: 12.5, color: GRAY, textAlign: "center" }}>Это демонстрационный сценарий, а не реальная рекомендация и не обещание результата.</div>
            <p style={{ fontSize: 15.5, color: DARK, lineHeight: 1.75, textAlign: "center", margin: "10px auto 0", maxWidth: 680 }}>Ваша услуга появляется не просто рядом с другими, а в контексте конкретной потребности потенциального клиента.</p>
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
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, fontWeight: 300, textAlign: "center", maxWidth: 720, margin: "0 auto" }}>Так вы сможете оценивать интерес аудитории и улучшать описание своей услуги. На старте показатели могут быть небольшими или нулевыми: платформа новая, и аудиторию мы будем развивать вместе с первыми партнёрами.</p>
        </div>
      </section>

      <section style={{ ...section(darkBg) }}>
        <div style={wrap}>
          <Head dark eyebrow="Как это работает" title="Партнёрская система в пяти шагах" />
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
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.75, fontWeight: 300, textAlign: "center", maxWidth: 680, margin: "-18px auto 36px" }}>Мы приглашаем тех, кто помогает предпринимателям и специалистам развивать своё дело.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 16 }}>
            {WHO.map(w => (
              <div key={w.title} style={{ display: "flex", gap: 16, border: "1px solid #E2E8F0", borderRadius: 16, padding: "22px 22px", alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(45,212,191,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={w.icon} size={21} style={{ color: "#0F766E" }} /></div>
                <div><div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, color: DARK, marginBottom: 4, lineHeight: 1.2 }}>{w.title}</div><div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>{w.text}</div></div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, fontWeight: 300, textAlign: "center", maxWidth: 700, margin: "28px auto 0" }}>Если ваша услуга помогает решить конкретную задачу бизнеса или профессионального развития, мы готовы рассмотреть её для партнёрской системы.</p>
        </div>
      </section>

      <section style={section("#F8FAFC")}>
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="pl-two">
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>Первая партнёрская группа</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 500, color: DARK, margin: "0 0 18px", lineHeight: 1.12 }}>Почему можно присоединиться уже сейчас</h2>
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: "0 0 14px" }}>«Промт Диалог» находится на этапе развития. Мы формируем первую партнёрскую группу и настраиваем систему рекомендаций.</p>
            <p style={{ fontSize: 15.5, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: 0 }}>Мы не обещаем поток заявок с первого дня. Наша задача — построить систему, в которой полезные предложения находят заинтересованных людей, а партнёры видят реальные показатели взаимодействия.</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 18, padding: "26px 26px" }}>
            <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: DARK, marginBottom: 14 }}>Для первых участников это возможность:</div>
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
        <div style={{ ...wrap, maxWidth: 900 }}>
          <div style={{ border: `1px solid ${TEAL}`, borderRadius: 22, padding: "44px 42px", background: "linear-gradient(135deg,#F0FDFA,#fff)", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>Сколько стоит участие</div>
            <div style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,54px)", color: DARK, fontWeight: 500, lineHeight: 1.05, marginBottom: 18 }}>На старте — бесплатно</div>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: "0 auto 14px", maxWidth: 680 }}>Вместо оплаты за размещение мы просим рассказывать о «Промт Диалог» своей аудитории не реже одного раза в 14 дней: публикация в профессиональном сообществе, пост в соцсети, статья, материал в Telegram-канале или другой проверяемый формат.</p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: "0 auto", maxWidth: 680 }}>Вы отправляете ссылку на публикацию через партнёрский кабинет, и после проверки продлевается следующий период участия. Партнёрство взаимное: вы помогаете развивать аудиторию платформы, а платформа создаёт новые возможности для знакомства клиентов с вашими услугами.</p>
          </div>
        </div>
      </section>

      <section style={section("#F8FAFC")}>
        <div style={{ ...wrap, maxWidth: 900 }}>
          <div style={{ background: darkBg, borderRadius: 22, padding: "50px 44px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEAL, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 16 }}><Icon name="Mail" size={15} />Личное приглашение</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.8vw,42px)", color: "#fff", fontWeight: 500, margin: "0 0 20px", lineHeight: 1.12 }}>Одно место в каждом направлении</h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontWeight: 300, margin: "0 0 14px" }}>Мы приглашаем в партнёры только одного специалиста в каждом направлении. Это сделано намеренно: рекомендации не должны превращаться в список одинаковых предложений, а человек должен получать точный совет, а не выбирать из десятка похожих.</p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontWeight: 300, margin: "0 0 14px" }}>Если вы получили это приглашение, значит мы выбрали вас сами и вручную. Нам важно видеть вас среди первых партнёров «Промт Диалог», и мы хотим выстроить с вами долгое, спокойное и взаимно полезное сотрудничество, которое растёт вместе с платформой.</p>
              <p style={{ fontFamily: SERIF, fontSize: 22, color: TEAL, lineHeight: 1.35, margin: 0 }}>Не конкуренты на одной полке, а партнёры, каждый на своём месте.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...section(darkBg), textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.4vw,50px)", color: "#fff", fontWeight: 500, margin: "0 0 20px", lineHeight: 1.1 }}>Присоединяйтесь к первой партнёрской группе</h2>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontWeight: 300, margin: "0 0 12px" }}>Не нужно ждать, пока платформа станет большой. Можно начать с подготовки своего предложения, пройти модерацию и быть готовым к появлению подходящей аудитории.</p>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontWeight: 300, margin: "0 0 32px" }}>Если вы предлагаете качественную услугу и понимаете, кому и какую задачу она помогает решить, давайте проверим, как она может работать в системе интеллектуальных рекомендаций.</p>
          <Cta>Стать партнёром «Промт Диалог»</Cta>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "30px auto 0", maxWidth: 640 }}>
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
