import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import { ACCENT, BG, ONLINE_COURSES, OFFLINE_COURSES, POINT_COURSES, LevelFilter, DirectionFilter, TabType } from "./catalog-private/CpShared";
import { CourseCard, OfflineCourseCard } from "./catalog-private/CpCourseCard";
import { TabSwitcher, CatalogFilters } from "./catalog-private/CpFilters";
import CpCollectionCard from "./catalog-private/CpCollectionCard";

export default function CatalogPrivate() {
  const [tab, setTab] = useState<TabType>(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    if (t === "point" || t === "offline" || t === "online") return t;
    return "online";
  });
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>("all");

  const isPoint = tab === "point";
  const courses = tab === "online" ? ONLINE_COURSES : tab === "offline" ? OFFLINE_COURSES : POINT_COURSES;

  const filtered = isPoint ? courses : courses.filter((c) => {
    const levelOk =
      levelFilter === "all" ||
      c.level === "any" ||
      c.level === levelFilter;
    const dirOk = directionFilter === "all" || c.direction === directionFilter;
    return levelOk && dirOk;
  });

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Все курсы для мастеров массажа — Каталог | Dok Диалог</title>
        <meta name="description" content="Онлайн и офлайн курсы по массажу: от новичка до профессионала. Техники массажа, протоколы, коррекция фигуры, висцеральный массаж, привлечение клиентов." />
        <meta name="keywords" content="курсы массажа онлайн, офлайн курсы массажа, обучение массажист, техники массажа, протоколы массажа, коррекция фигуры, висцеральный массаж, привлечение клиентов массаж" />
        <meta property="og:title" content="Все курсы для мастеров массажа | Dok Диалог" />
        <meta property="og:description" content="Онлайн и офлайн курсы по массажу: от новичка до профессионала. Техники, протоколы, продвижение." />
        <meta property="og:type" content="website" />
      </Helmet>
      <DokNavbar />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <a href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 14, textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = "#999")}
            >
              <Icon name="ArrowLeft" size={14} />
              Назад к каталогу
            </a>
            <h1 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              margin: "0 0 12px",
              lineHeight: 1.1,
            }}>
              Курсы для массажистов
            </h1>
            <p style={{ fontSize: 17, color: "#666", margin: 0 }}>
              Практические курсы для роста навыков и дохода — от первых клиентов до высокого чека
            </p>
          </div>

          {/* Кому подойдут */}
          <div style={{ marginBottom: 44 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.6, marginBottom: 12 }}>
                ДЛЯ КОГО
              </span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
                Кому курсы принесут реальный результат?
              </h2>
              <p style={{ fontSize: 14.5, color: "#888", margin: "0 auto", maxWidth: 520, lineHeight: 1.6 }}>
                Наши программы созданы для людей с разным опытом и целями — найдите себя
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="for-whom-grid">
              {[
                {
                  icon: "HandHeart",
                  title: "Массажистам и мастерам",
                  badge: "Практикующим",
                  badgeBg: `${ACCENT}15`,
                  badgeColor: ACCENT,
                  accent: ACCENT,
                  desc: "Хотите внедрить восстановительные техники и работать со сложными запросами — болью, травмами, зажимами. Перестать быть просто «массажистом» и стать специалистом, к которому записываются за результатом и готовы платить в 2–3 раза больше.",
                  bullets: ["Поднять средний чек за счёт результата", "Уверенно работать с болью и травмами", "Выстроить стабильный поток клиентов"],
                },
                {
                  icon: "Dumbbell",
                  title: "Тренерам и инструкторам",
                  badge: "Фитнес / Спорт",
                  badgeBg: "#f59e0b18",
                  badgeColor: "#d97706",
                  accent: "#d97706",
                  desc: "На тренировке получилась травма — и вы не знаете, что делать. Базовые восстановительные техники позволят быстро сориентироваться, снизить болевой синдром и правильно помочь ученику прямо на месте, не дожидаясь врача.",
                  bullets: ["Первая помощь при спортивных травмах", "Техники снятия мышечного спазма", "Уверенность в любой ситуации"],
                },
                {
                  icon: "Home",
                  title: "Родителям и семьям",
                  badge: "Для всех",
                  badgeBg: "#a78bfa18",
                  badgeColor: "#7c3aed",
                  accent: "#7c3aed",
                  desc: "Самодиагностика и простые восстановительные техники, которым можно научиться без медобразования. Помочь ребёнку с болью в спине, снять стресс у партнёра после тяжёлого дня или проработать своё собственное состояние — всё это доступно каждому.",
                  bullets: ["Простые техники без медобразования", "Диагностика себя и близких", "Быстрая помощь при боли и напряжении"],
                },
                {
                  icon: "TrendingUp",
                  title: "Тем, кто хочет расти",
                  badge: "Карьера",
                  badgeBg: "#10b98118",
                  badgeColor: "#059669",
                  accent: "#059669",
                  desc: "Чувствуете потенциал, но массажист — это не финальная точка? Специалист восстановительных техник — это другой уровень: другие клиенты, другой чек, другое отношение. Вы строите экспертность и репутацию, а не просто оказываете услугу.",
                  bullets: ["Путь от массажиста к специалисту", "Экспертность, которая продаёт сама", "Работа с аудиторией, которая ценит результат"],
                },
              ].map((item) => (
                <div key={item.title} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 8px 32px ${item.accent}22`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; el.style.transform = "translateY(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={item.icon} size={20} style={{ color: item.accent }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{item.title}</h3>
                        <span style={{ fontSize: 10.5, fontWeight: 700, background: item.badgeBg, color: item.badgeColor, padding: "2px 8px", borderRadius: 20 }}>{item.badge}</span>
                      </div>
                      <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid #f0f0ed", paddingTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                    {item.bullets.map((b) => (
                      <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${item.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon name="Check" size={10} style={{ color: item.accent }} />
                        </div>
                        <span style={{ fontSize: 12.5, color: "#444", fontWeight: 500 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <TabSwitcher tab={tab} setTab={setTab} />

          {isPoint ? (
            <div style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, borderRadius: 14, padding: "14px 20px", marginBottom: 32, display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="Zap" size={16} style={{ color: ACCENT }} />
              <span style={{ fontSize: 14, color: "#444" }}>
                <strong style={{ color: ACCENT }}>Точечные продукты</strong> — короткие курсы и практики на конкретный запрос. Для всех, не только для массажистов.
              </span>
            </div>
          ) : (
            <CatalogFilters
              levelFilter={levelFilter}
              setLevelFilter={setLevelFilter}
              directionFilter={directionFilter}
              setDirectionFilter={setDirectionFilter}
            />
          )}

          {/* Баннер интенсива — только для онлайн-курсов */}
          {tab === "online" && (
            <div style={{
              background: "linear-gradient(135deg, #00a699 0%, #007a71 100%)",
              borderRadius: 18,
              padding: "20px 28px",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
              boxShadow: "0 4px 20px rgba(0,166,153,0.25)",
            }} className="intensiv-banner">
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 240 }}>
                <div style={{
                  background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 10, flexShrink: 0,
                }}>
                  <Icon name="Gift" size={22} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15.5, color: "#fff", marginBottom: 4 }}>
                    Получи бесплатный доступ ко всем онлайн-курсам
                  </div>
                  <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                    Запишись на однодневный офлайн-интенсив в Москве — все онлайн-курсы уже включены в стоимость
                  </div>
                </div>
              </div>
              <a
                href="/course/offline-intensiv-massazh"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: "#00a699",
                  fontWeight: 700, fontSize: 14, borderRadius: 12,
                  padding: "11px 22px", textDecoration: "none", whiteSpace: "nowrap",
                  transition: "opacity 0.2s", flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Узнать об интенсиве
                <Icon name="ArrowRight" size={15} />
              </a>
            </div>
          )}

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="cp-grid">
            {filtered.map((course) => (
              tab === "offline"
                ? <OfflineCourseCard key={course.id} course={course} />
                : <CourseCard key={course.id} course={course} />
            ))}
            {tab === "online" && <CpCollectionCard />}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#999", fontSize: 16 }}>
              По выбранным фильтрам курсов не найдено
            </div>
          )}
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .cp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cp-grid { grid-template-columns: 1fr !important; }
          .for-whom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .for-whom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <DokFooter />
    </div>
  );
}