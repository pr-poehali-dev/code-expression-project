import Icon from "@/components/ui/icon";
import { PAINS, STEPS, DEMO_CLIENTS, BARRIERS, VARIANTS, SUBJECTS, AUDIENCES, FEATURES } from "./data";
import { TEAL, DARK, GRAY, SERIF, Eyebrow, H2, wrap } from "./ui";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 26px" };
const grid = (min: number): React.CSSProperties => ({ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(min(${min}px,100%),1fr))`, gap: 20 });

export function Pains() {
  return (
    <section style={{ background: "#fff", padding: "100px 24px" }}>
      <div style={wrap}>
        <Eyebrow light>Зачем это нужно</Eyebrow>
        <H2>Реклама вслепую стоит дорого</H2>
        <p style={{ fontSize: 17, color: GRAY, maxWidth: 640, lineHeight: 1.7, margin: "0 0 48px", fontWeight: 300 }}>
          Пока вы не знаете, как предложение выглядит со стороны, реклама остается ставкой.
        </p>
        <div style={grid(250)}>
          {PAINS.map(p => (
            <div key={p.title} style={card}>
              <div style={{ width: 46, height: 46, borderRadius: 10, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon name={p.icon} size={22} style={{ color: "#0E9F8F" }} />
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: DARK, margin: "0 0 8px", lineHeight: 1.25 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function How() {
  return (
    <section id="how" style={{ background: "#F8FAFC", padding: "100px 24px", scrollMarginTop: 70 }}>
      <div style={wrap}>
        <Eyebrow light>Как это работает</Eyebrow>
        <H2>Три шага до правок</H2>
        <div style={{ ...grid(280), marginTop: 44 }}>
          {STEPS.map(s => (
            <div key={s.num} style={{ ...card, position: "relative" }}>
              <div style={{ fontFamily: SERIF, fontSize: 54, fontWeight: 600, color: "rgba(45,212,191,0.28)", lineHeight: 1, marginBottom: 14 }}>{s.num}</div>
              <h3 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, color: DARK, margin: "0 0 10px" }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{s.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 14 }}>Что можно проверить</div>
          <div style={grid(200)}>
            {SUBJECTS.map(s => (
              <div key={s.title} style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "14px 16px" }}>
                <Icon name={s.icon} size={20} style={{ color: "#0E9F8F", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: GRAY }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Example() {
  return (
    <section style={{ background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, padding: "100px 24px" }}>
      <div style={wrap}>
        <Eyebrow>Пример разбора</Eyebrow>
        <H2 dark={false}>Массажная студия: что увидит владелец</H2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 680, lineHeight: 1.7, margin: "0 0 44px", fontWeight: 300 }}>
          Предложение: «Авторский массаж тела, 60 минут. Стоимость 6 000 ₽. Индивидуальный подход, расслабление и восстановление».
        </p>
        <div style={grid(290)}>
          {DEMO_CLIENTS.map(d => (
            <div key={d.n} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "24px 22px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "1.5px", marginBottom: 8 }}>КЛИЕНТ № {d.n}</div>
              <div style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{d.title}</div>
              <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 999, background: d.bg, color: d.color, marginBottom: 14 }}>{d.tag}</span>
              <div style={{ fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.6, borderLeft: `3px solid ${TEAL}`, paddingLeft: 12, marginBottom: 14 }}>«{d.thought}»</div>
              <div style={{ fontSize: 13, color: "#34D399", lineHeight: 1.55, marginBottom: 6 }}>Привлекает: {d.attracts}</div>
              <div style={{ fontSize: 13, color: "#FBBF24", lineHeight: 1.55 }}>Сомнение: {d.doubts}</div>
            </div>
          ))}
        </div>

        <div style={{ ...grid(300), marginTop: 28 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px 22px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>Что нашла клиентская группа</div>
            {BARRIERS.map((b, i) => (
              <div key={b.title} style={{ display: "flex", gap: 12, marginBottom: i < BARRIERS.length - 1 ? 14 : 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: 999, background: TEAL, color: DARK, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{b.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px 22px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>Что попробовать изменить</div>
            {VARIANTS.map((v, i) => (
              <div key={v.label} style={{ marginBottom: i < VARIANTS.length - 1 ? 14 : 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Вариант {v.label}. {v.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{v.text}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "22px 0 0", lineHeight: 1.6, maxWidth: 760 }}>
          Пример условный: клиенты не реальные, а реакции не измеряют вероятность покупки.
        </p>
      </div>
    </section>
  );
}

export function Features() {
  return (
    <section style={{ background: "#fff", padding: "100px 24px" }}>
      <div style={wrap}>
        <Eyebrow light>Возможности</Eyebrow>
        <H2>Больше, чем оценка текста</H2>
        <p style={{ fontSize: 17, color: GRAY, maxWidth: 640, lineHeight: 1.7, margin: "0 0 48px", fontWeight: 300 }}>
          Несколько точек зрения, причины реакции и что проверить.
        </p>
        <div style={grid(280)}>
          {FEATURES.map(f => (
            <div key={f.title} style={card}>
              <Icon name={f.icon} size={24} style={{ color: "#0E9F8F", marginBottom: 14 }} />
              <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 6px" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ForWhom() {
  return (
    <section style={{ background: "#F8FAFC", padding: "100px 24px" }}>
      <div style={wrap}>
        <Eyebrow light>Для кого</Eyebrow>
        <H2>Кому подойдет</H2>
        <div style={{ ...grid(250), marginTop: 44 }}>
          {AUDIENCES.map(a => (
            <div key={a.title} style={card}>
              <div style={{ width: 46, height: 46, borderRadius: 10, border: "1px solid rgba(45,212,191,0.5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={a.icon} size={22} style={{ color: "#0E9F8F" }} />
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: DARK, margin: "0 0 8px", lineHeight: 1.25 }}>{a.title}</h3>
              <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
