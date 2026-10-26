const TEAL = "#2DD4BF";
const SERIF = "'Cormorant Garamond', serif";
const darkBg = "radial-gradient(120% 100% at 15% 0%, #12304A 0%, #0B1B33 55%, #060F20 100%)";

const p: React.CSSProperties = { fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.8, fontWeight: 300, margin: "0 0 18px" };
const strong: React.CSSProperties = { color: "#fff", fontWeight: 600 };
const h3: React.CSSProperties = { fontFamily: SERIF, fontSize: "clamp(24px,3vw,32px)", fontWeight: 500, color: "#fff", margin: "0 0 18px", lineHeight: 1.2 };

export default function MissionSection() {
  return (
    <section style={{ background: darkBg, padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -160, right: -120, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.16), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto 56px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Ради чего мы это делаем</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.6vw,52px)", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.12, letterSpacing: "-0.5px" }}>
            Наша цель — чтобы полезные решения находили тех, кому они действительно нужны
          </h2>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={p}>Каждый день тысячи предпринимателей и специалистов стараются развивать своё дело. Они учатся, ищут клиентов, пробуют новые подходы, принимают непростые решения. Но часто им не хватает не старания, а возможности вовремя увидеть следующий шаг, найти нужный инструмент или встретить человека, который поможет решить конкретную задачу.</p>
          <p style={p}><span style={strong}>«Промт Диалог» создаётся, чтобы сократить это расстояние между потребностью и решением.</span></p>
          <p style={p}>Мы хотим, чтобы технологии искусственного интеллекта помогали людям лучше понимать свои задачи, видеть новые возможности и находить подходящие пути развития. А знания, опыт и услуги профессионалов становились доступнее тем, кому они могут принести реальную пользу.</p>
          <p style={{ ...p, margin: 0 }}>Именно поэтому мы создаём не просто площадку для рекламы. Мы развиваем среду, в которой предложения встречаются с потребностями, а рекомендации строятся на понимании контекста человека, а не только на борьбе за внимание.</p>
        </div>

        <div style={{ margin: "64px auto", maxWidth: 820, textAlign: "center", padding: "34px 28px", borderTop: "1px solid rgba(45,212,191,0.3)", borderBottom: "1px solid rgba(45,212,191,0.3)" }}>
          <p style={{ fontFamily: SERIF, fontSize: "clamp(24px,3.2vw,36px)", fontStyle: "italic", color: TEAL, lineHeight: 1.3, margin: 0 }}>
            Не просто соединять предложения и клиентов. Помогать людям находить решения, которые двигают их вперёд.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 22 }}>
          <div style={{ border: "1px solid rgba(45,212,191,0.22)", borderRadius: 18, padding: "34px 32px", background: "rgba(255,255,255,0.04)" }}>
            <h3 style={h3}>Зачем нам партнёры?</h3>
            <p style={{ ...p, fontSize: 16 }}>Потому что за каждым полезным решением стоят люди: преподаватели, эксперты, консультанты, предприниматели и специалисты, которые годами накапливают опыт и готовы им делиться.</p>
            <p style={{ ...p, fontSize: 16 }}>Мы не можем и не должны знать всё за всех. Но вместе можем создать пространство, в котором человеку проще найти нужное знание, подходящую услугу или профессиональную поддержку.</p>
            <p style={{ ...p, fontSize: 16 }}><span style={strong}>Наша общая задача — не просто рассказать о себе большему числу людей, а помочь большему числу людей найти то, что действительно может быть им полезно.</span></p>
            <p style={{ ...p, fontSize: 16, margin: 0 }}>Мы верим, что технологии становятся по-настоящему ценными тогда, когда помогают людям лучше реализовывать свои знания, способности и идеи. Поэтому мы приглашаем партнёров не только размещать предложения, но и участвовать в развитии этой идеи: делиться опытом, помогать совершенствовать платформу и создавать больше возможностей для своей профессиональной аудитории.</p>
          </div>

          <div style={{ border: "1px solid rgba(45,212,191,0.22)", borderRadius: 18, padding: "34px 32px", background: "rgba(255,255,255,0.04)" }}>
            <h3 style={h3}>Мы строим это вместе</h3>
            <p style={{ ...p, fontSize: 16 }}>Для нас партнёрство — это не только обмен размещениями или переходами. Это возможность объединить компетенции, аудитории и опыт ради общей пользы.</p>
            <p style={{ ...p, fontSize: 16 }}>Мы только начинаем этот путь. Впереди тестирование, поиск лучших решений и развитие платформы. Мы не обещаем мгновенных результатов, но хотим с самого начала строить систему на понятных принципах: взаимной пользе, прозрачности и уважении к человеку.</p>
            <p style={{ ...p, fontSize: 16 }}><span style={strong}>Если вам близка идея помогать людям находить подходящие решения и развиваться, возможно, нам по пути.</span></p>
            <p style={{ ...p, fontSize: 16, margin: 0 }}>Давайте создавать среду, в которой полезные знания не теряются, профессиональные предложения находят свою аудиторию, а технологии помогают людям двигаться вперёд.</p>
          </div>
        </div>

        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: "rgba(255,255,255,0.7)", textAlign: "center", margin: "52px 0 0" }}>
          «Промт Диалог» — технологии, которые помогают людям находить возможности.
        </p>
      </div>
    </section>
  );
}
