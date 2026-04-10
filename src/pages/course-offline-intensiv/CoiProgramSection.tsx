import Icon from "@/components/ui/icon";
import { ACCENT, BG, h2style } from "./CoiShared";

export default function CoiProgramSection() {
  return (
    <>
      {/* ── 4. ПРОГРАММА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Программа дня</h2>
          {[
            { time: "11:00–12:30", title: "Диагностика практики", desc: "Анализируем текущую ситуацию каждого участника: клиенты, доход, чек, повторные записи. Находим главные точки потерь." },
            { time: "12:30–14:00", title: "Техники повышения чека", desc: "Практические методы увеличения стоимости услуг без потери клиентов. Разбираем страхи и работаем с позиционированием." },
            { time: "14:00–15:00", title: "Обед", desc: "" },
            { time: "15:00–16:15", title: "Система привлечения клиентов", desc: "Конкретные каналы и инструменты под каждый формат работы. Разбираем кейсы участников." },
            { time: "16:15–17:15", title: "Удержание и возврат", desc: "Как превратить разового клиента в постоянного. Скрипты, поводы для контакта, программы лояльности." },
            { time: "17:15–18:00", title: "Составление личного плана", desc: "Каждый участник уходит с индивидуальным планом действий на ближайший месяц." },
          ].map(({ time, title, desc }, i) => (
            <div key={i} style={{ display: "flex", gap: 20, marginBottom: 28 }}>
              <div style={{ flexShrink: 0, width: 100, paddingTop: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, background: `${ACCENT}12`, borderRadius: 8, padding: "4px 8px", textAlign: "center" }}>{time}</div>
              </div>
              <div style={{ borderLeft: `2px solid ${ACCENT}30`, paddingLeft: 20, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. ФОРМАТ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Формат</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="format-grid">
            {[
              { icon: "MapPin", label: "Офлайн", sub: "Живое участие" },
              { icon: "Clock", label: "1 день", sub: "11:00–18:00" },
              { icon: "Users", label: "До 12 человек", sub: "Малая группа" },
              { icon: "MessageSquare", label: "Практика", sub: "80% практики" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "22px 18px", textAlign: "center" }}>
                <div style={{ color: ACCENT, marginBottom: 10 }}><Icon name={icon} size={26} /></div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#999" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. БОНУСЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Бонусы участника</h2>
          {/* Плашка онлайн-доступ */}
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT}18 0%, ${ACCENT}08 100%)`,
            border: `2px solid ${ACCENT}40`,
            borderRadius: 16, padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 16,
            marginBottom: 16,
          }}>
            <div style={{ flexShrink: 0, background: ACCENT, borderRadius: 12, padding: 10 }}>
              <Icon name="PlayCircle" size={28} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 4 }}>
                Онлайн-доступ к техникам интенсива
              </div>
              <div style={{ fontSize: 14, color: "#555", lineHeight: 1.5 }}>
                После мероприятия вы получите доступ к онлайн-урокам по всем техникам, которые проходили на интенсиве — для повторения и закрепления
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="bonuses-grid">
            {[
              { icon: "FileText", title: "Чек-лист диагностики", text: "Готовый инструмент для регулярного анализа своей практики" },
              { icon: "BookOpen", title: "Скрипты общения", text: "Готовые фразы для работы с возражениями и повышения чека" },
              { icon: "MessageCircle", title: "Чат участников", text: "Закрытый чат для поддержки и обмена опытом после интенсива" },
              { icon: "TrendingUp", title: "План роста дохода", text: "Персональный план действий для увеличения выручки в ближайшие 30 дней" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "22px 20px", display: "flex", gap: 16 }}>
                <div style={{ color: ACCENT, flexShrink: 0 }}><Icon name={icon} size={24} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#1a1a1a" }}>{title}</div>
                  <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ДЛЯ ИНОГОРОДНИХ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "36px 40px" }}>
            <h2 style={{ ...h2style, marginBottom: 20 }}>Приедете из другого города?</h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 20px" }}>
              Мы поможем с организацией поездки: расскажем о ближайших гостиницах, поможем скоординировать время приезда и ответим на вопросы.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "linear-gradient(135deg, hsl(185,85%,97%) 0%, #fff 100%)",
              border: `1.5px solid ${ACCENT}`,
              borderRadius: 12, padding: "12px 20px", marginBottom: 20,
            }}>
              <span style={{ fontSize: 22 }}>🏨</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Скидка 10% на отели по нашей рекомендации</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Напишите нам после записи — подберём вариант рядом с площадкой</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { icon: "Hotel", text: "Варианты жилья рядом" },
                { icon: "MapPin", text: "Удобное расположение" },
                { icon: "Phone", text: "Помощь в организации" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. ОБ АВТОРЕ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Об авторе</h2>
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e4",
            borderRadius: 24,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }} className="course-author-grid">
            <div style={{ position: "relative", minHeight: 380 }}>
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/e1094aa6-0054-4675-a2d2-f6112eab1bf6.png"
                alt="Сергей Водопьянов"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", minHeight: 380 }}
              />
            </div>
            <div style={{ padding: "40px 44px" }} className="course-author-pad">
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                Автор курса
              </div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>
                Сергей Водопьянов
              </h3>
              <p style={{ color: "#999", fontSize: 14, margin: "0 0 20px" }}>
                Остеопат · 17 лет опыта ·{" "}
                <a href="https://assotsiatsiya-osteopatov.ru/user/svodopianoff/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "none" }}>Член Российской остеопатической ассоциации</a>
              </p>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, margin: "0 0 28px" }}>
                За годы практики работал с тысячами людей, помогая улучшить самочувствие при болях в спине и шее, восстановить осанку. Специализируется на работе с офисными сотрудниками, спортсменами и беременными женщинами.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { value: "17", label: "лет практики" },
                  { value: "3000+", label: "консультаций" },
                  { value: "Автор", label: "курсов Dok Диалог" },
                  { value: "РОА", label: "сертификат" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90 }}>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
                <a href="https://massopro.ru/catalog/1" target="_blank" rel="noopener noreferrer" style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90, textDecoration: "none" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>5.0</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>MassoPRO</div>
                </a>
                <a href="https://yandex.com/maps/org/osteopat_plyus/99582120415/reviews/" target="_blank" rel="noopener noreferrer" style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90, textDecoration: "none" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>5.0</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>Отзывы Яндекс</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. ОТЗЫВЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Отзывы участников</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="reviews-grid">
            {[
              {
                name: "Ольга, 41 год",
                text: "Честно, я ехала на курс с ощущением, что «ну вдруг что-то новое услышу». А по факту — это был переворот в голове.\nМне прямо на диагностике показали, где я теряю деньги, и это оказалось так очевидно, что даже немного обидно стало 😅\n\nПосле внедрения техник у меня клиенты начали записываться повторно, хотя раньше это было нестабильно. И главное — я стала увереннее работать, потому что понимаю, что делаю и зачем.\n\nОчень ценно.",
                img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/e5b3dc91-f1ea-479c-9e73-b63d7f33ae46.jpg",
              },
              {
                name: "Наталья, 52 года",
                text: "Я давно в практике, больше 15 лет, и думала, что меня уже сложно чем-то удивить.\nНо здесь не про «удивить», а про систему.\n\nОчень понравилось, что разобрали каждого участника. Я увидела, где недорабатываю и как можно мягко, без давления увеличивать чек.\n\nОтдельно хочу отметить состояние после курса — как будто сама прошла восстановление. Это неожиданно и приятно.\n\nРекомендую тем, кто хочет расти, а не просто «ходить на обучение».",
                img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c1c9ebf2-8871-493f-8744-6aecb273108f.jpg",
              },
              {
                name: "Екатерина, 34 года",
                text: "Если коротко — это курс, который окупился за неделю.\n\nЯ внедрила буквально 2 техники и изменила подачу клиентам — всё. Вырос чек, появились повторные записи, клиенты начали приводить знакомых.\n\nРаньше я делала «как умею», теперь понимаю, как доводить до результата.\n\nИ да, стало легче работать — это вообще бонус, о котором не думаешь заранее.",
                img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/1988bcce-54b7-47cb-981c-c24db1972246.jpg",
              },
              {
                name: "Марина, 45 лет",
                text: "Мне понравился формат — без лишней воды, всё по делу и сразу в практику.\n\nСамое ценное для меня — это диагностика. Я впервые так чётко увидела, что происходит с моими клиентами и почему иногда нет результата.\n\nПлюс, я забрала для себя техники, которые реально дают быстрый эффект — клиенты это сразу замечают.\n\nИ отдельное спасибо за атмосферу — было спокойно, без напряжения, но при этом очень продуктивно.",
                img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/886214dc-814b-425a-9f21-07888aad792c.jpg",
              },
            ].map((r) => (
              <div key={r.name} style={{
                background: "#fff",
                border: "1px solid #e8e8e4",
                borderRadius: 18,
                padding: "28px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <img src={r.img} alt={r.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                    <div style={{ color: "#f59e0b", fontSize: 14 }}>★★★★★</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65, margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}