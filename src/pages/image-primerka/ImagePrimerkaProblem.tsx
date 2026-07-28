import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const PAINS = [
  { icon: "MessageCircleQuestion", title: "«Я представляла совсем иначе»", desc: "Даже если работа выполнена качественно, клиент оценивает её через свою внутреннюю картинку. Если эта картинка не была проговорена — мастер может оказаться виноватым в чужом ожидании." },
  { icon: "AlertTriangle", title: "Сложный разговор уже после услуги", desc: "Вместо спокойного согласования до начала работы — объяснения у зеркала, скидка, переделка или неприятный отзыв." },
  { icon: "ShieldAlert", title: "Вы осторожничаете там, где могли бы предложить больше", desc: "Когда нет ясности, проще сделать «как обычно». Так безопаснее — но сложнее показать экспертность и предложить более сложный образ." },
  { icon: "CalendarX", title: "Клиент не записывается на изменения", desc: "Он хочет перемен, но боится не узнать себя в зеркале. И выбирает привычное: «Давайте пока ничего радикального»." },
  { icon: "Clock3", title: "Ваше время уходит на исправление недопонимания", desc: "Переделка — это не только материалы и часы. Это эмоциональная нагрузка, потерянное окно в записи и удар по уверенности в своей работе." },
  { icon: "Star", title: "Недовольство оседает в отзывах", desc: "Клиент редко приходит разбираться лично — чаще молча уходит и оставляет короткий негативный отзыв, который видят будущие клиенты." },
];

const WHEN_NEEDED = [
  { icon: "UserPlus", text: "Новый клиент, которого мастер ещё не знает" },
  { icon: "HelpCircle", text: "Запрос «хочу что-то поменять, но не понимаю что»" },
  { icon: "Wand2", text: "Сложное окрашивание, новая стрижка, макияж на событие" },
  { icon: "Images", text: "Клиент показывает несколько референсов: «Ну, примерно вот так»" },
  { icon: "EyeOff", text: "Мастер видит, что идея может не подойти, но не хочет обесценить желание клиента" },
  { icon: "Gem", text: "Дорогая услуга, где ошибка особенно заметна и болезненна" },
];

export default function ImagePrimerkaProblem() {
  return (
    <>
      {/* ── УЗНАВАНИЕ СИТУАЦИИ ────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "90px 32px 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.25 }}>
            Хороший мастер отвечает за технику.<br />
            Но репутация часто зависит от того,<br />о чём не договорились заранее.
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 300 }}>
            Клиент может говорить: «Хочу освежить образ», «Сделайте современно», «Как на этой фотографии». Вы слышите одно, он представляет другое — и разница обнаруживается только в зеркале.
          </p>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
            Это не всегда ошибка мастера. Часто это обычная проблема: человеку сложно словами описать образ, который он сам ещё не до конца сформулировал.
          </p>
        </div>
      </section>

      {/* ── БОЛИ — ЧЕРЕЗ МАСТЕРА ──────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "40px 32px 100px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Когда ожидания не совпали</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>
              Последствия остаются у мастера
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="pains-grid">
            {PAINS.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 26px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={18} style={{ color: "#EF4444" }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.pains-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── КОГДА НУЖНА ПРИМЕРКА ──────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Не для каждой услуги</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.15 }}>
              Клиент не всегда приходит экспериментировать
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
              Чаще он приходит за привычной услугой — и там примерка не нужна. Инструмент нужен именно в точках, где есть неопределённость:
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }} className="when-grid">
            {WHEN_NEEDED.map(({ icon, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={16} style={{ color: TEAL2 }} />
                </div>
                <div style={{ fontSize: 14, color: DARK, lineHeight: 1.6, paddingTop: 6 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.when-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>
    </>
  );
}