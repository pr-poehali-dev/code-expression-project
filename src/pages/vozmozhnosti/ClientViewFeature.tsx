import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const FOR_WHOM = [
  { icon: "Sparkles", text: "Мастера и специалисты частной практики: массаж, красота, психологи, консультанты" },
  { icon: "Store", text: "Владельцы салонов и студий, которые готовят рекламу, новый прайс или новую услугу" },
  { icon: "Rocket", text: "Те, кто запускает услугу или поднимает цену и хочет проверить идею до вложений" },
];

const RESULT = [
  { icon: "Users", title: "Три разных клиента", text: "Как предложение выглядит для того, кому важно доверие, кто ценит время и кто сравнивает цены." },
  { icon: "Search", title: "Причины сомнений", text: "Что привлекает, что смущает и чего не хватает, чтобы человек записался." },
  { icon: "ListChecks", title: "Что изменить в первую очередь", text: "Три варианта правок для проверки и понятные барьеры, мешающие записи." },
  { icon: "MessageCircle", title: "Диалог с клиентами", text: "Можно задать каждому клиенту свой вопрос: «Что смущает в цене?», «Что вас убедит?»." },
  { icon: "GitCompare", title: "Сравнение версий", text: "Исправили текст или прайс — увидите, стало ли понятнее каждому клиенту." },
  { icon: "FileDown", title: "Отчёт в PDF", text: "Готовый разбор можно сохранить и показать команде или маркетологу." },
];

const DEMO = [
  { tag: "Потенциальный интерес", bg: "rgba(16,185,129,0.16)", color: "#34D399", title: "Мне важно доверие", quote: "Что именно делает массаж особенным? Почему я должна доверить своё тело именно вам?" },
  { tag: "Недостаточно информации", bg: "rgba(245,158,11,0.16)", color: "#FBBF24", title: "Я ценю своё время", quote: "Шесть тысяч за час. Как записаться и есть ли время после работы?" },
  { tag: "Высокий риск отказа", bg: "rgba(239,68,68,0.16)", color: "#F87171", title: "Я сравниваю варианты", quote: "Массажей много. За что здесь доплачивать? Может, рядом дешевле?" },
];

function openClientView() {
  try { sessionStorage.setItem("lk_tab", "clientview"); } catch { /* ignore */ }
}

export default function ClientViewFeature() {
  return (
    <section id="client-view" style={{
      background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
      padding: "110px 32px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "-10%", right: "-6%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <span style={{ background: TEAL, color: DARK, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "7px 16px", borderRadius: 100 }}>
            Начните с него
          </span>
          <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Инструмент № 1 · Исследование аудитории</span>
        </div>

        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px,5vw,62px)", fontWeight: 500, color: "#fff", lineHeight: 1.05, margin: "0 0 22px", letterSpacing: "-0.5px", maxWidth: 860 }}>
          Покажи глазами клиента
        </h2>
        <p style={{ fontSize: "clamp(16px,1.7vw,20px)", color: "rgba(255,255,255,0.78)", lineHeight: 1.65, margin: "0 0 14px", fontWeight: 300, maxWidth: 760 }}>
          Не зная свою аудиторию и её потребности, легко потратить силы и деньги на неправильный маркетинг: рекламу, посты и скидки, которые не приводят клиентов.
        </p>
        <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 56px", fontWeight: 300, maxWidth: 760 }}>
          Инструмент показывает ваше предложение, цену или рекламу глазами нескольких потенциальных клиентов ещё до запуска. Вы видите, что им непонятно и где они откажутся.
        </p>

        <div className="cv-demo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: 16, marginBottom: 14 }}>
          {DEMO.map((d, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "22px 22px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "1.5px", marginBottom: 8 }}>КЛИЕНТ № {i + 1}</div>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{d.title}</div>
              <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 999, background: d.bg, color: d.color, marginBottom: 14 }}>{d.tag}</span>
              <div style={{ fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, borderLeft: `3px solid ${TEAL}`, paddingLeft: 12 }}>«{d.quote}»</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 72px", lineHeight: 1.6, maxWidth: 760 }}>
          Пример для массажной студии. Клиенты в разборе условные, это не реальные опрошенные люди: реакции помогают найти слабые места и сформулировать гипотезы для проверки на настоящих клиентах.
        </p>

        <div className="cv-two-col" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.5fr)", gap: 56, marginBottom: 64 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Для кого</div>
            <div style={{ display: "grid", gap: 16 }}>
              {FOR_WHOM.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(45,212,191,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={f.icon} size={18} style={{ color: TEAL }} />
                  </div>
                  <div style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, fontWeight: 300 }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Что покажет разбор</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 14 }}>
              {RESULT.map((r, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "18px 18px 16px" }}>
                  <Icon name={r.icon} size={20} style={{ color: TEAL, marginBottom: 10 }} />
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.6, fontWeight: 300 }}>{r.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cv-actions" style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
          <Link to="/cabinet" onClick={openClientView} className="cv-cta" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "17px 38px", borderRadius: 2, fontSize: 15, fontWeight: 700,
            background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: DARK, textDecoration: "none",
          }}>
            Попробовать инструмент <Icon name="ArrowRight" size={16} />
          </Link>
          <Link to="/instrumenty/client-view" className="cv-cta cv-more" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "17px 28px", borderRadius: 2, fontSize: 15, fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.85)", textDecoration: "none",
          }}>
            Подробнее <Icon name="ArrowRight" size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
