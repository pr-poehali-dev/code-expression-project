import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import { ACCENT, BG, ONLINE_COURSES, OFFLINE_COURSES, POINT_COURSES, LevelFilter, DirectionFilter, TabType } from "./catalog-private/CpShared";
import { CourseCard, OfflineCourseCard } from "./catalog-private/CpCourseCard";
import { TabSwitcher, CatalogFilters } from "./catalog-private/CpFilters";
import CpCollectionCard from "./catalog-private/CpCollectionCard";
import CourseQuiz from "./catalog-private/CourseQuiz";

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
                  href: "/course/offline-intensiv-dlya-massazhistov",
                },
                {
                  icon: "Dumbbell",
                  title: "Тренерам и инструкторам",
                  badge: "Фитнес / Спорт",
                  badgeBg: "#f59e0b18",
                  badgeColor: "#d97706",
                  accent: "#d97706",
                  desc: "Ваши клиенты хотят не только тренировки. Освойте восстановительные техники — видеть зоны напряжения, снимать зажимы и давать клиентам результат нового уровня.",
                  bullets: ["Видеть напряжение и ограничения движения", "Восстановительные техники для тренера", "Выделиться среди других специалистов"],
                  href: "/course/offline-intensiv-dlya-trenerov",
                },
                {
                  icon: "Home",
                  title: "Родителям и семьям",
                  badge: "Для всех",
                  badgeBg: "#a78bfa18",
                  badgeColor: "#7c3aed",
                  accent: "#7c3aed",
                  desc: "Когда у близких болит спина или шея — хочется уметь помочь. Освойте простые восстановительные техники без медобразования и помогайте семье каждый день.",
                  bullets: ["Простые техники без медобразования", "Помочь себе и близким", "Навыки на всю жизнь"],
                  href: "/course/offline-intensiv-dlya-semi",
                },
                {
                  icon: "TrendingUp",
                  title: "Тем, кто хочет расти",
                  badge: "Карьера",
                  badgeBg: "#10b98118",
                  badgeColor: "#059669",
                  accent: "#059669",
                  desc: "Хотите освоить востребованную профессию с нуля? Специалисты по восстановительным техникам нужны всё больше — и войти в профессию можно без многолетнего обучения.",
                  bullets: ["Старт с нуля, без медобразования", "Навык, который можно монетизировать", "Востребованная профессия"],
                  href: "/course/offline-intensiv-karera",
                },
              ].map((item) => {
                const cardContent = (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name={item.icon} size={20} style={{ color: item.accent }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{item.title}</h3>
                          <span style={{ fontSize: 10.5, fontWeight: 700, background: item.badgeBg, color: item.badgeColor, padding: "2px 8px", borderRadius: 20 }}>{item.badge}</span>
                          {item.href && <span style={{ fontSize: 10.5, fontWeight: 700, background: "#1a1a1a", color: "#fff", padding: "2px 8px", borderRadius: 20 }}>ИНТЕНСИВ</span>}
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
                    {item.href && (
                      <div style={{ borderTop: "1px solid #f0f0ed", paddingTop: 14 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: item.accent, display: "flex", alignItems: "center", gap: 6 }}>
                          Узнать об интенсиве
                          <Icon name="ArrowRight" size={13} style={{ color: item.accent }} />
                        </span>
                      </div>
                    )}
                  </>
                );
                return item.href ? (
                  <a key={item.title} href={item.href} style={{ background: "#fff", border: `1.5px solid ${item.accent}40`, borderRadius: 20, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s, transform 0.2s", textDecoration: "none", cursor: "pointer" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = `0 8px 32px ${item.accent}22`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; el.style.transform = "translateY(0)"; }}
                  >{cardContent}</a>
                ) : (
                  <div key={item.title} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 8px 32px ${item.accent}22`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; el.style.transform = "translateY(0)"; }}
                  >{cardContent}</div>
                );
              })}
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
              background: "linear-gradient(135deg, #00a699 0%, #005c55 100%)",
              borderRadius: 22,
              padding: "32px 36px",
              marginBottom: 32,
              boxShadow: "0 8px 40px rgba(0,166,153,0.28)",
              position: "relative",
              overflow: "hidden",
            }} className="intensiv-banner">
              {/* Декоративные круги */}
              <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -30, right: 120, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }} className="intensiv-inner">
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Бейдж */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", marginBottom: 14 }}>
                    <Icon name="Gift" size={13} style={{ color: "#fff" }} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>ВКЛЮЧЕНО В СТОИМОСТЬ ИНТЕНСИВА</span>
                  </div>

                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: 12 }}>
                    Для нас важно не просто обучить —<br />
                    а убедиться, что вы делаете всё правильно
                  </div>

                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>
                    Восстановительные техники работают только при точном исполнении. Именно поэтому мы приглашаем вас на однодневный офлайн-интенсив в Москве — чтобы отработать всё вживую, получить обратную связь тренера и выйти с уверенностью в каждом движении.
                    <br /><br />
                    А все онлайн-курсы мы отдаём <strong style={{ color: "#fff" }}>бесплатно в комплекте</strong> — потому что хотим, чтобы вы пришли подготовленными и взяли от интенсива максимум.
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {["Живая практика под контролем тренера", "Все онлайн-курсы в подарок", "Уверенность, а не сомнения"].map(item => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "5px 12px" }}>
                        <Icon name="Check" size={12} style={{ color: "#fff" }} />
                        <span style={{ fontSize: 12.5, color: "#fff", fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                href="/course/offline-intensiv-massazh"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: "#00a699",
                  fontWeight: 700, fontSize: 14, borderRadius: 14,
                  padding: "14px 28px", textDecoration: "none", whiteSpace: "nowrap",
                  transition: "opacity 0.2s, transform 0.2s", flexShrink: 0,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
              >
                Узнать об интенсиве
                <Icon name="ArrowRight" size={15} />
              </a>
              </div>
            </div>
          )}

          {/* Квиз-бот подбора курсов */}
          <div style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20`, borderRadius: 24, marginBottom: 40, padding: "48px 36px" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.6, marginBottom: 12 }}>
                ПОДБОР ОБУЧЕНИЯ
              </span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
                Не знаете, с чего начать?
              </h2>
              <p style={{ fontSize: 15, color: "#666", margin: 0, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
                Пройдите короткий квиз и получите персональную подборку курсов прямо на почту
              </p>
            </div>
            <CourseQuiz />
          </div>

          {/* Grid */}
          {tab === "offline" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="cp-grid-offline">
              {filtered.map((course) => (
                <OfflineCourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="cp-grid">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {tab === "online" && <CpCollectionCard />}
            </div>
          )}

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
        @media (max-width: 760px) {
          .for-whom-grid { grid-template-columns: 1fr !important; }
          .intensiv-banner { padding: 24px 22px !important; border-radius: 18px !important; }
          .intensiv-inner { flex-direction: column !important; align-items: flex-start !important; }
          .intensiv-inner a { width: 100% !important; justify-content: center !important; box-sizing: border-box !important; }
          .cp-grid-offline { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cp-grid { grid-template-columns: 1fr !important; }
          .for-whom-grid { grid-template-columns: 1fr !important; }
          .intensiv-banner { padding: 20px 18px !important; border-radius: 16px !important; }
          .cp-grid-offline { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <DokFooter />
    </div>
  );
}