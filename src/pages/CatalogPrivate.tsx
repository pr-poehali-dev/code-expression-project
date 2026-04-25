import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import { ACCENT, BG, ONLINE_COURSES, OFFLINE_COURSES, POINT_COURSES, LevelFilter, DirectionFilter, TabType } from "./catalog-private/CpShared";
import { CourseCard, OfflineCourseCard } from "./catalog-private/CpCourseCard";
import { TabSwitcher, CatalogFilters } from "./catalog-private/CpFilters";

export default function CatalogPrivate() {
  const [tab, setTab] = useState<TabType>("online");
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

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="cp-grid">
            {filtered.map((course) => (
              tab === "offline"
                ? <OfflineCourseCard key={course.id} course={course} />
                : <CourseCard key={course.id} course={course} />
            ))}
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
        }
      `}</style>
      <DokFooter />
    </div>
  );
}