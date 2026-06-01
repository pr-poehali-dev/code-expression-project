import { useState } from "react";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const ACCENT = "#2DD4BF";
const ACCENT_DARK = "#14B8A6";
const DARK = "#080E1C";

// ─── ДАННЫЕ ───────────────────────────────────────────────

const VIDEO_SECTIONS = [
  {
    title: "Прохождение онлайн-курса",
    subtitle: "Специалисты о результатах после прохождения курса «Про Диалог»",
    href: "/tarify",
    linkText: "Смотреть тарифы",
    videos: [
      { id: "o4aLwoPaNMNsPmRU517kdr", name: "Марина К.", city: "Москва", experience: "Массажист, 4 года", result: "Подняла чек на 30%" },
      { id: "7on4nVofXbcgkDmWbjaZvH", name: "Ольга В.", city: "Казань", experience: "Массажист-косметолог, 2 года", result: "Запись на 3 недели вперёд" },
      { id: "jWics1Kq1BrrtcFK25Vmgu", name: "Алексей Г.", city: "Санкт-Петербург", experience: "Спортивный массажист, 6 лет", result: "+3 постоянных клиента" },
      { id: "us9ULPt46B7G77bQYwBXXt", name: "Тамара Л.", city: "Екатеринбург", experience: "Реабилитолог, 12 лет", result: "Расширила линейку услуг" },
      { id: "vk9wa3fBfxQZwMbRvN9YJG", name: "Дмитрий Н.", city: "Новосибирск", experience: "Массажист, 1,5 года", result: "Первый поток клиентов" },
      { id: "sCFSxwbdZSjobWC3KKzDmj", name: "Светлана Р.", city: "Краснодар", experience: "Массажист, 5 лет", result: "Постоянных клиентов вдвое больше" },
    ],
  },
  {
    title: "Массажист с потоком клиентов",
    subtitle: "Системный подход к привлечению клиентов и стабильному доходу с нуля",
    href: "/tarify",
    linkText: "Смотреть тарифы",
    videos: [
      { id: "9gXRTsH48ootXdfsfSxrM3", name: "Ксения М.", city: "Москва", experience: "Массажист, 2 года", result: "Запись на 3 недели вперёд" },
      { id: "ijbAj7MbdwDvX8jdx5fgiq", name: "Наталья С.", city: "Казань", experience: "Массажист, 1,5 года", result: "Поток клиентов с нуля" },
      { id: "5u8FjHNy89MCso6wue8uEq", name: "Артём В.", city: "Санкт-Петербург", experience: "Массажист, 3 года", result: "Сарафанное радио работает само" },
      { id: "eFKnFkaFhfwaMk7BZgi4zp", name: "Дмитрий К.", city: "Екатеринбург", experience: "Массажист, 4 года", result: "Стабильный доход каждый месяц" },
      { id: "6yUBNj4ToDMq7vd5e25yrh", name: "Ольга П.", city: "Новосибирск", experience: "Массажист, 2,5 года", result: "Вырос средний чек на 40%" },
      { id: "2nEvA7AUqtTnzrnwP7J4wm", name: "Игорь Л.", city: "Ростов-на-Дону", experience: "Массажист, 3 года", result: "Первые клиенты в процессе обучения" },
    ],
  },
];

const TEXT_SECTIONS = [
  {
    badge: "ДЛЯ СПЕЦИАЛИСТОВ",
    title: "Тариф «Практика»",
    subtitle: "Системный старт: знания, техники и первые результаты в практике",
    href: "/praktika",
    linkText: "Подробнее о тарифе",
    reviews: [
      {
        name: "Анастасия К.",
        city: "Москва",
        experience: "Начинающий массажист",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c207e068-8203-4f20-a40a-53d60df722e5.jpg",
        text: "Начала с нуля, через месяц уже принимала первых клиентов. Курс очень понятный, всё по шагам. Теперь это мой основной доход.",
      },
      {
        name: "Елена М.",
        city: "Санкт-Петербург",
        experience: "Начинающий массажист",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/3618e920-2b36-438e-b312-f7f0874826c3.jpg",
        text: "Долго сомневалась — нет образования, нет опыта. Но курс реально для новичков. За 3 недели освоила технику и уже зарабатываю.",
      },
    ],
  },
  {
    badge: "ДЛЯ СПЕЦИАЛИСТОВ",
    title: "Тариф «Премиальная практика»",
    subtitle: "Углублённая работа с телом, клиентом и ростом чека",
    href: "/premium",
    linkText: "Подробнее о тарифе",
    reviews: [
      {
        name: "Марина С.",
        city: "Краснодар",
        experience: "Массажист, 5 лет",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/112b5e86-c667-4402-95cd-f9bfdc8b78fa.jpg",
        text: "После курса смогла поднять цену сеанса до 8 000–10 000 ₽. Клиенты сами рекомендуют меня другим — результат виден сразу.",
      },
      {
        name: "Алексей В.",
        city: "Новосибирск",
        experience: "Массажист, 4 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/21047f48-ac51-4882-9dc1-524a42b297d9.jpg",
        text: "Раньше боялся клиентов с травмами. Теперь это моя специализация. Запись расписана на 2 недели вперёд.",
      },
    ],
  },
  {
    badge: "ДЛЯ СПЕЦИАЛИСТОВ",
    title: "Тариф «Про Диалог — Эксперт»",
    subtitle: "Полная трансформация практики: от техник до личного бренда и масштаба",
    href: "/ekspert",
    linkText: "Подробнее о тарифе",
    reviews: [
      {
        name: "Виктория Л.",
        city: "Москва",
        experience: "Массажист, 6 лет",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/65880344-a8ec-4179-98dd-57fd0987daea.jpg",
        text: "После первого же применения новых техник клиентка спросила: «Что вы сделали? Я чувствую себя совсем иначе!» Теперь это мой главный инструмент.",
      },
      {
        name: "Дмитрий С.",
        city: "Казань",
        experience: "Массажист, 2 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/47eae9d8-7b20-44ed-b6c8-4ae65573c872.jpg",
        text: "Думал, что это просто набор техник. Оказалось — настоящая система. Теперь у меня есть чёткий алгоритм на каждый случай и стабильная запись.",
      },
    ],
  },
  {
    badge: "ДЛЯ САЛОНОВ",
    title: "Формат «Стандарт»",
    subtitle: "Базовый инструментарий для выстраивания работы команды в салоне",
    href: "/kontakty",
    linkText: "Оставить заявку",
    reviews: [
      {
        name: "Ольга Т.",
        city: "Екатеринбург",
        experience: "Владелец салона, 3 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c96d7f79-93a9-482f-ac37-642c699eb4d6.jpg",
        text: "Раньше каждая смена была непредсказуемой. После внедрения системы персонал работает по протоколу — клиенты довольны намного больше.",
      },
      {
        name: "Наталья К.",
        city: "Самара",
        experience: "Управляющий салоном, 4 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/5270fc42-b4e6-4984-81ad-9c36d6fc676d.jpg",
        text: "После обучения команды клиенты сразу замечают разницу и записываются повторно. Средний чек вырос без дополнительных вложений в рекламу.",
      },
    ],
  },
  {
    badge: "ДЛЯ САЛОНОВ",
    title: "Формат «Премиум салон»",
    subtitle: "Стандарты сервиса, удержание клиентов и управление командой",
    href: "/kontakty",
    linkText: "Оставить заявку",
    reviews: [
      {
        name: "Светлана Р.",
        city: "Воронеж",
        experience: "Владелец салона, 5 лет",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/09e72c14-9676-46ea-a121-b14dd8d0f3fb.jpg",
        text: "Раньше не понимала, почему клиенты уходят. После системного обучения команды удержание выросло, а сарафанное радио заработало само.",
      },
      {
        name: "Игорь В.",
        city: "Ростов-на-Дону",
        experience: "Управляющий сетью, 3 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/a36d13b4-6b16-4d9e-8560-4e49605cd690.jpg",
        text: "Скептически отнёсся — казалось, что всё это теория. Оказалось, что каждый инструмент реально применим. Эффект виден уже в первый месяц.",
      },
    ],
  },
  {
    badge: "ДЛЯ САЛОНОВ",
    title: "Формат «Про Диалог Business»",
    subtitle: "Полное сопровождение: от обучения персонала до системы роста салона",
    href: "/kontakty",
    linkText: "Оставить заявку",
    reviews: [
      {
        name: "Анна В.",
        city: "Нижний Новгород",
        experience: "Владелец салона, 2 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/778f6c66-c5e7-4809-93f7-8577ff811a2c.jpg",
        text: "Боялась, что команда не примет изменения. Но всё прошло органично. Мастера сами стали работать иначе — клиенты чувствуют разницу.",
      },
      {
        name: "Роман Г.",
        city: "Уфа",
        experience: "Владелец сети, 3 года",
        photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/62e168f8-7414-4d56-a568-73b521de2781.jpg",
        text: "Результат виден уже через месяц. Персонал работает увереннее, клиенты возвращаются, выручка выросла без дополнительной рекламы.",
      },
    ],
  },
];

// ─── КОМПОНЕНТЫ ───────────────────────────────────────────

function PlayIcon({ color }: { color: string }) {
  return (
    <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: `12px solid ${color}`, marginLeft: 3 }} />
  );
}

function DotsNav({ active, total, onChange }: { active: number; total: number; onChange: (i: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onChange(i)} style={{
          all: "unset", cursor: "pointer",
          width: active === i ? 24 : 8, height: 8, borderRadius: 4,
          background: active === i ? ACCENT : "rgba(255,255,255,0.15)",
          transition: "all 0.25s",
        }} />
      ))}
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 4, fontFamily: "Montserrat, sans-serif" }}>{active + 1} / {total}</span>
    </div>
  );
}

function VideoBlock({ section }: { section: typeof VIDEO_SECTIONS[0] }) {
  const [active, setActive] = useState(0);
  const current = section.videos[active];

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, overflow: "hidden",
      boxShadow: "0 4px 40px rgba(0,0,0,0.4)", display: "flex", minHeight: 420,
    }} className="rev-video-wrap">
      {/* Список */}
      <div style={{
        width: 240, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "18px 12px", display: "flex", flexDirection: "column", gap: 4,
        overflowY: "auto", background: "rgba(255,255,255,0.02)",
      }} className="rev-video-sidebar">
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 0.8, padding: "4px 12px 8px", fontFamily: "Montserrat, sans-serif" }}>Видеоотзывы</div>
        {section.videos.map((v, i) => (
          <button key={v.id} onClick={() => setActive(i)} style={{
            all: "unset", cursor: "pointer",
            background: active === i ? "rgba(45,212,191,0.12)" : "transparent",
            border: active === i ? `1.5px solid rgba(45,212,191,0.35)` : "1.5px solid transparent",
            borderRadius: 12, padding: "9px 12px", display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.2s",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8, flexShrink: 0,
              background: active === i ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PlayIcon color={active === i ? ACCENT : "rgba(255,255,255,0.3)"} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: active === i ? "#fff" : "rgba(255,255,255,0.7)", marginBottom: 1, fontFamily: "Montserrat, sans-serif" }}>{v.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{v.city}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 3, background: active === i ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.05)", borderRadius: 5, padding: "1px 6px", marginTop: 3 }}>
                <Icon name="TrendingUp" size={10} style={{ color: active === i ? ACCENT : "rgba(255,255,255,0.3)" }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: active === i ? ACCENT : "rgba(255,255,255,0.3)" }}>{v.result}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Плеер */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, position: "relative", background: "#000", minHeight: 260 }}>
          <iframe key={current.id} src={`https://kinescope.io/embed/${current.id}`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>{current.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{current.city} · {current.experience}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(45,212,191,0.1)", borderRadius: 8, padding: "6px 12px", border: "1px solid rgba(45,212,191,0.2)" }}>
            <Icon name="TrendingUp" size={12} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT }}>{current.result}</span>
          </div>
        </div>
        <div style={{ padding: "0 20px 14px" }}>
          <DotsNav active={active} total={section.videos.length} onChange={setActive} />
        </div>
      </div>
    </div>
  );
}

function VideoBlockMobile({ section }: { section: typeof VIDEO_SECTIONS[0] }) {
  const [active, setActive] = useState(0);
  const current = section.videos[active];
  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", marginBottom: 14 }}>
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
          <iframe key={current.id} src={`https://kinescope.io/embed/${current.id}`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
        </div>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>{current.name}</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{current.city} · {current.experience}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(45,212,191,0.1)", borderRadius: 7, padding: "4px 10px" }}>
            <Icon name="TrendingUp" size={11} style={{ color: ACCENT }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: ACCENT }}>{current.result}</span>
          </div>
        </div>
        <div style={{ padding: "0 16px 12px" }}>
          <DotsNav active={active} total={section.videos.length} onChange={setActive} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {section.videos.map((v, i) => (
          <button key={v.id} onClick={() => setActive(i)} style={{
            all: "unset", cursor: "pointer",
            background: active === i ? "rgba(45,212,191,0.1)" : "rgba(255,255,255,0.03)",
            border: active === i ? `1.5px solid rgba(45,212,191,0.3)` : "1.5px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, flexShrink: 0, background: active === i ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlayIcon color={active === i ? ACCENT : "rgba(255,255,255,0.3)"} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: active === i ? "#fff" : "rgba(255,255,255,0.7)", fontFamily: "Montserrat, sans-serif" }}>{v.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{v.city} · {v.experience}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, background: active === i ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.05)", borderRadius: 5, padding: "2px 7px", flexShrink: 0 }}>
              <Icon name="TrendingUp" size={10} style={{ color: active === i ? ACCENT : "rgba(255,255,255,0.3)" }} />
              <span style={{ fontSize: 10.5, fontWeight: 600, color: active === i ? ACCENT : "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{v.result}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StarRow() {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="Star" size={13} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
      ))}
    </div>
  );
}

function TextReviewCard({ r }: { r: { name: string; city: string; experience: string; photo: string; text: string } }) {
  const [open, setOpen] = useState(false);
  const isLong = r.text.length > 160;
  const display = isLong && !open ? r.text.slice(0, 160).trimEnd() + "…" : r.text;
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 18, padding: "22px 20px", display: "flex", flexDirection: "column",
      boxShadow: "0 2px 20px rgba(0,0,0,0.2)", transition: "border-color 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,212,191,0.25)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <img src={r.photo} alt={r.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", objectPosition: "top center", border: `2px solid rgba(45,212,191,0.3)`, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 2 }}>{r.name}</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{r.city} · {r.experience}</div>
          <StarRow />
        </div>
      </div>
      <div style={{ color: `rgba(45,212,191,0.15)`, fontSize: 44, lineHeight: 1, marginBottom: -6, fontFamily: "Georgia, serif", fontWeight: 900, userSelect: "none" }}>"</div>
      <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, flex: 1 }}>
        {display}
        {isLong && (
          <button onClick={() => setOpen(!open)} style={{ all: "unset", cursor: "pointer", color: ACCENT, fontSize: 12.5, fontWeight: 600, marginLeft: 4 }}>
            {open ? "свернуть" : "читать полностью"}
          </button>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, href, badge, linkText }: { title: string; subtitle: string; href: string; badge?: string; linkText?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {badge && (
        <span style={{
          display: "inline-block",
          background: badge.includes("САЛОН") ? "rgba(45,212,191,0.12)" : "rgba(45,212,191,0.1)",
          color: ACCENT,
          border: `1px solid rgba(45,212,191,0.25)`,
          fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20,
          letterSpacing: 0.8, marginBottom: 12, fontFamily: "Montserrat, sans-serif",
        }}>
          {badge}
        </span>
      )}
      <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
        {title}
      </h2>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 560 }}>{subtitle}</p>
        <Link to={href} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "9px 20px", borderRadius: 2,
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          color: DARK, fontSize: 13, fontWeight: 600, textDecoration: "none",
          fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 6px 20px rgba(45,212,191,0.35)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
        >
          {linkText || "Перейти"}
          <Icon name="ArrowRight" size={14} />
        </Link>
      </div>
    </div>
  );
}

// ─── СТРАНИЦА ─────────────────────────────────────────────

export default function Reviews() {
  return (
    <div style={{ background: DARK, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#fff" }}>
      <Helmet>
        <title>Истории специалистов — Про Диалог</title>
        <meta name="description" content="Истории специалистов и команд, которые изменили подход к практике: мышление, стоимость, работа с клиентом, внедрение в салоне." />
        <meta property="og:title" content="Истории специалистов — Про Диалог" />
      </Helmet>

      <BizNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 60 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 20, padding: "6px 18px", marginBottom: 24 }}>
            <Icon name="Star" size={14} style={{ color: ACCENT, fill: ACCENT }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT, letterSpacing: "0.5px" }}>Истории специалистов и команд</span>
          </div>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#fff", margin: "0 0 20px", lineHeight: 1.15, letterSpacing: "-0.5px" }}>
            Истории тех, кто изменил<br />подход к практике
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Специалисты и команды, которые перешли от потоковой работы к более глубокому и ценному формату
          </p>
          {/* Статистика */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }} className="rev-stats">
            {[
              { value: "200+", label: "Специалистов" },
              { value: "4.9", label: "Средняя оценка" },
              { value: "12", label: "Видеоотзывов" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px,4vw,38px)", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4, fontWeight: 400 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Видеоотзывы */}
      <section style={{ padding: "64px 0 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Play" size={14} style={{ color: ACCENT }} />
            </div>
            <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>Видеоотзывы</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
            {VIDEO_SECTIONS.map((section) => (
              <div key={section.title}>
                <SectionHeader title={section.title} subtitle={section.subtitle} href={section.href} badge="ОНЛАЙН" linkText={section.linkText} />
                <div className="rev-video-desktop">
                  <VideoBlock section={section} />
                </div>
                <div className="rev-video-mob">
                  <VideoBlockMobile section={section} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 960, margin: "64px auto 0", padding: "0 24px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Текстовые отзывы */}
      <section style={{ padding: "64px 0 100px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Star" size={14} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
            </div>
            <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>Отзывы по тарифам</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {TEXT_SECTIONS.map((section) => (
              <div key={section.title}>
                <SectionHeader title={section.title} subtitle={section.subtitle} href={section.href} badge={section.badge} linkText={section.linkText} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="rev-text-grid">
                  {section.reviews.map((r) => (
                    <TextReviewCard key={r.name} r={r} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 0 100px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.15)",
            borderRadius: 24, padding: "48px 40px", textAlign: "center",
          }}>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
              Хотите такой же результат?
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 32px", lineHeight: 1.7, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              Начните с бесплатного доступа и посмотрите, подходит ли вам этот подход
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/cabinet" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 2,
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                color: DARK, fontSize: 15, fontWeight: 600, textDecoration: "none",
                letterSpacing: "0.3px", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 28px rgba(45,212,191,0.35)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                Начать бесплатно
              </Link>
              <Link to="/tarify" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 400, textDecoration: "none",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(45,212,191,0.4)"; el.style.color = "#fff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.18)"; el.style.color = "rgba(255,255,255,0.8)"; }}
              >
                Посмотреть тарифы
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .rev-video-desktop { display: block; }
        .rev-video-mob { display: none; }
        @media (max-width: 640px) {
          .rev-video-desktop { display: none; }
          .rev-video-mob { display: block; }
          .rev-video-wrap { flex-direction: column !important; min-height: unset !important; }
          .rev-text-grid { grid-template-columns: 1fr !important; }
          .rev-stats { gap: 28px !important; }
        }
        @media (min-width: 641px) and (max-width: 860px) {
          .rev-video-wrap { min-height: 340px !important; }
          .rev-video-sidebar { width: 200px !important; }
        }
      `}</style>

      <BizFooter />
    </div>
  );
}
