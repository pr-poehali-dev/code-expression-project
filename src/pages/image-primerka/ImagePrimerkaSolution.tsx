import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const GAINS = [
  { icon: "Eye", title: "Меньше сюрпризов у зеркала", desc: "Мастер и клиент видят одно и то же направление образа ещё до начала работы — не два разных представления." },
  { icon: "MessagesSquare", title: "Предметный разговор вместо общих слов", desc: "Не «хочу что-нибудь стильное, но не слишком», а «вот такая длина нравится, но чёлку не хочу»." },
  { icon: "ShieldCheck", title: "Меньше поводов для спора после услуги", desc: "Если направление было показано и обсуждено заранее — сложнее сказать «я представляла по-другому»." },
];

const SCENARIOS = [
  { value: "haircut",  label: "Стрижка",        sub: "и укладка волос",  icon: "Scissors", image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/d83c075d-34dc-4cb8-bf2c-1272168732fc.png" },
  { value: "makeup",   label: "Макияж",         sub: "лица",             icon: "Sparkles", image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/cc2e758c-3cbf-491d-8881-74cd3bcf6d88.png" },
  { value: "manicure", label: "Ногти",          sub: "маникюр и дизайн", icon: "Hand", image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/fd3d1028-9f3d-4f47-b3bb-8ca63ff375c7.png" },
  { value: "figure",   label: "Фигура и стиль", sub: "образ и одежда",   icon: "PersonStanding", image: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/eae833c8-5db3-46c0-9a47-48fa4438a55c.png" },
];

const STEPS = [
  { num: "01", title: "Загрузите фото", desc: "Своё или клиента — прямо здесь на странице или в личном кабинете.", icon: "Camera" },
  { num: "02", title: "Выберите направление", desc: "Стрижка, макияж, маникюр или образ целиком — и опишите пожелание в двух словах.", icon: "MessageSquareText" },
  { num: "03", title: "Обсудите результат вместе", desc: "ИИ покажет возможное направление — спросите: «Что нравится? Что точно не ваше? Что оставляем?»", icon: "MessagesSquare" },
];

export default function ImagePrimerkaSolution() {
  return (
    <>
      {/* ── ГЛАВНАЯ МЫСЛЬ ─────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "90px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 380, background: "radial-gradient(ellipse,rgba(45,212,191,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Главная мысль</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.35 }}>
            ИИ-примерка — не инструмент, чтобы уговорить клиента на перемены.
          </h2>
          <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
            Это способ согласовать ожидания до услуги, чтобы мастер не работал вслепую, а клиент понимал, на что соглашается.
          </p>
        </div>
      </section>

      {/* ── ЧЕСТНОСТЬ О РЕЗУЛЬТАТЕ ────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "90px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 18, padding: "36px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="Info" size={18} style={{ color: TEAL2 }} />
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: DARK }}>Важно: это не гарантия результата</div>
            </div>
            <p style={{ fontSize: 14.5, color: "#64748B", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 300 }}>
              Сгенерированное изображение — не гарантия точного результата: реальный образ зависит от типа волос, состояния кожи, техники, освещения и других факторов.
            </p>
            <p style={{ fontSize: 14.5, color: DARK, lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
              Но это сильная точка для диалога: «Вот направление. Что вам здесь нравится? Что точно не ваше? Что оставляем?» Именно так снижается риск недопонимания.
            </p>
          </div>
        </div>
      </section>

      {/* ── ПЕРЕХОД: ПРИМЕРКА НЕ ЗАМЕНЯЕТ КОНСУЛЬТАЦИЮ ────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "90px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.2 }}>
              Примерка не заменяет консультацию.<br />Она делает её понятнее.
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: "0 auto", maxWidth: 600, fontWeight: 300 }}>
              Когда клиент видит возможное направление образа, разговор становится предметным.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900, margin: "0 auto" }} className="before-after-grid">
            <div style={{ background: "#fff", border: "1.5px solid #FCA5A5", borderRadius: 16, padding: "26px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Было</div>
              <div style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, fontStyle: "italic" }}>«Я хочу что-нибудь стильное, но не слишком».</div>
            </div>
            <div style={{ background: "#fff", border: "1.5px solid #99F6E4", borderRadius: 16, padding: "26px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEAL2, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Стало</div>
              <div style={{ fontSize: 15, color: DARK, lineHeight: 1.7, fontStyle: "italic" }}>«Вот такая длина мне нравится, но чёлку не хочу». «Этот оттенок красиво, но для меня слишком ярко».</div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:700px){.before-after-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ЧТО ДАЁТ ИНСТРУМЕНТ ──────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>С согласованием заранее</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Меньше риска — больше доверия
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="gains-grid">
            {GAINS.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 26px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={18} style={{ color: TEAL }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.25 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.gains-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ГАЛЕРЕЯ ПРИМЕРОВ (место под фото до/после) ───────────────────── */}
      <section id="examples" style={{ background: DARK, padding: "100px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse,rgba(45,212,191,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Примеры направления</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Как выглядит согласование образа
            </h2>
          </div>
          {/* Место под 4 фото-примера "до/после" — по одному на каждый сценарий: стрижка, макияж, маникюр, образ/стиль.
              Формат: исходное фото клиента слева, сгенерированный результат справа, в едином кадре или парой карточек.
              Изображения должны выглядеть реалистично и аккуратно — без ярких неоновых эффектов, в спокойной цветовой гамме салона. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="examples-grid">
            {SCENARIOS.map(({ icon, label, image }, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                {image ? (
                  <img src={image} alt={`Фото-пример «до/после» — ${label.toLowerCase()}`} style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }} />
                ) : (
                  <div style={{ aspectRatio: "3/4", background: "linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
                    {/* [ФОТО-ПРИМЕР "ДО/ПОСЛЕ" — ${label.toUpperCase()}] */}
                    <Icon name={icon} size={28} style={{ color: "rgba(45,212,191,0.4)" }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "0 12px" }}>Фото-пример «до/после» — {label.toLowerCase()}</span>
                  </div>
                )}
                <div style={{ padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.examples-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:520px){.examples-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── КАК ЭТО РАБОТАЕТ ──────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Три шага</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              От фото до согласованного направления
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="steps-grid">
            {STEPS.map(({ num, title, desc, icon }, i) => (
              <div key={i}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: i === 0 ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "#F1F5F9", border: i === 0 ? "none" : "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: i === 0 ? "0 8px 24px rgba(45,212,191,0.3)" : "none" }}>
                  <Icon name={icon} size={24} style={{ color: i === 0 ? DARK : TEAL }} />
                </div>
                <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {num}</div>
                <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.steps-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>
    </>
  );
}