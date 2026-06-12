import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import { Tab, ACCENT, ROLE_LABELS } from "./LkDashboardTypes";

// ── Заглушка для будущих разделов ─────────────────────────────────────────────
export function ComingSoonTab({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 16, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: `hsla(185,85%,32%,0.08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={32} style={{ color: ACCENT }} />
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: "#888", maxWidth: 340, lineHeight: 1.6 }}>{description}</div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "hsla(185,85%,32%,0.08)", borderRadius: 50, padding: "8px 18px" }}>
        <Icon name="Clock" size={13} style={{ color: ACCENT }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>Скоро будет доступно</span>
      </div>
    </div>
  );
}

// ── Домашняя вкладка ──────────────────────────────────────────────────────────
interface HomeTabProps {
  onNav: (t: string) => void;
  role: string;
  hasSalon: boolean;
}

export function HomeTab({ onNav, role, hasSalon }: HomeTabProps) {
  const { user } = useLkAuth();

  const quickItems = [
    { tab: "tools" as Tab,  icon: "Wrench",        color: "hsl(210,85%,45%)", bg: "hsl(210,85%,96%)", title: "Инструменты",    desc: "Диагностики, тесты, шпаргалка" },
    { tab: "academy" as Tab,icon: "GraduationCap", color: "hsl(280,60%,55%)", bg: "hsl(280,60%,96%)", title: "Академия",        desc: "Тренинги для команды" },
    { tab: "ai" as Tab,     icon: "Sparkles",      color: "hsl(40,90%,50%)",  bg: "hsl(40,90%,96%)",  title: "ИИ-инструменты", desc: "Генерация контента — скоро" },
    ...((role === "owner" || role === "admin") && hasSalon ? [
      { tab: "agent" as Tab,     icon: "BotMessageSquare", color: "hsl(200,70%,38%)", bg: "hsl(200,70%,94%)", title: "ИИ-Агент",  desc: "Бизнес, сервис, маркетинг, скрипты" },
      { tab: "marketing" as Tab, icon: "BarChart3",        color: "hsl(220,80%,50%)", bg: "hsl(220,80%,95%)", title: "Маркетинг", desc: "ЦА, офферы, реклама в Яндекс.Директ" },
    ] : []),
    ...(role === "owner" ? [
      { tab: "salon" as Tab,     icon: "Building2", color: "hsl(145,60%,40%)", bg: "hsl(145,60%,95%)", title: "Мой салон", desc: hasSalon ? "Профиль заполнен" : "Заполните профиль салона" },
      { tab: "employees" as Tab, icon: "Users",     color: "hsl(185,85%,32%)", bg: "hsl(185,85%,95%)", title: "Команда",   desc: "Пригласить и управлять сотрудниками" },
    ] : []),
  ];

  return (
    <div>
      {/* Приветствие */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          {ROLE_LABELS[role] || "Специалист"} · Про Диалог
        </div>
        <h1 style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          Добро пожаловать{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}!
        </h1>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
          {role === "owner" && !hasSalon
            ? "Чтобы ИИ-инструменты работали под ваш салон — заполните профиль салона."
            : "Выберите раздел для работы или воспользуйтесь быстрым переходом ниже."}
        </p>
      </div>

      {/* Баннер — заполни профиль салона */}
      {role === "owner" && !hasSalon && (
        <div
          onClick={() => onNav("salon")}
          style={{ cursor: "pointer", background: "linear-gradient(135deg,hsl(185,85%,32%),hsl(185,85%,24%))", borderRadius: 16, padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="Building2" size={22} style={{ color: "#fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Заполните профиль вашего салона</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Это займёт 5 минут — после этого все ИИ-инструменты будут знать ваш контекст</div>
          </div>
          <Icon name="ArrowRight" size={20} style={{ color: "rgba(255,255,255,0.6)", flexShrink: 0 }} />
        </div>
      )}

      {/* Быстрый доступ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
        {quickItems.map(item => (
          <button key={item.tab} onClick={() => onNav(item.tab)} style={{
            background: "#fff", border: "1px solid #E8ECF0", borderRadius: 16, padding: "20px 20px",
            textAlign: "left", cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "all 0.18s",
            boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
          }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = "0 12px 32px rgba(15,23,42,0.1)"; el.style.transform = "translateY(-3px)"; el.style.borderColor = "#D6DEE6"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = "0 1px 3px rgba(15,23,42,0.04)"; el.style.transform = "translateY(0)"; el.style.borderColor = "#E8ECF0"; }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon name={item.icon} size={20} style={{ color: item.color }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Плашка — Сообщения клиентам */}
      {hasSalon && (role === "owner" || role === "admin") && (
        <div style={{ marginTop: 20, background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
          <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "hsl(185,85%,95%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="MessageSquare" size={18} style={{ color: ACCENT }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>Сообщения клиентам</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>Выберите тип — ИИ напишет текст за секунды · бесплатно</div>
              </div>
            </div>
            <button onClick={() => onNav("clientmsg")} style={{ fontSize: 12, fontWeight: 600, color: ACCENT, background: "hsl(185,85%,95%)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}>
              Все типы →
            </button>
          </div>
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid #F1F5F9", overflowX: "auto" }}>
            {[
              { id: "appointment_reminder", icon: "CalendarCheck", label: "Запись",       color: "hsl(185,85%,32%)" },
              { id: "win_back",             icon: "UserCheck",     label: "Вернуть",       color: "hsl(280,60%,55%)" },
              { id: "new_service",          icon: "Sparkles",      label: "Акция",         color: "hsl(40,90%,50%)"  },
              { id: "birthday",             icon: "Gift",          label: "День рождения", color: "hsl(340,80%,55%)" },
              { id: "review_request",       icon: "Star",          label: "Отзыв",         color: "hsl(45,95%,45%)"  },
              { id: "seasonal",             icon: "Sun",           label: "Сезон",         color: "hsl(145,60%,40%)" },
            ].map((t, i, arr) => (
              <button
                key={t.id}
                onClick={() => { sessionStorage.setItem("clientmsg_type", t.id); onNav("clientmsg"); }}
                style={{
                  flex: "1 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                  padding: "12px 8px", border: "none",
                  borderRight: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
                  background: "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                <Icon name={t.icon} size={18} style={{ color: t.color }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "#64748B", whiteSpace: "nowrap" }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Новости платформы */}
      <div style={{ marginTop: 32, background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid #E8ECF0", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Новости платформы</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { date: "12 июня 2026", text: "Бесплатная диагностика салона — пройдите «Диагностику роста салона PRO» прямо сейчас и узнайте, где ваш салон теряет деньги. Энергия уже на балансе, платить ничего не нужно.", highlight: true },
            { date: "3 июня 2026", text: "Запущены ИИ-агенты: «Ответ на отзыв», «Скрипт записи по телефону» и «Разбор конфликтной ситуации» — помогают администраторам реагировать быстро и профессионально." },
            { date: "24 мая 2026", text: "Новый инструмент — «ИИ-генератор изображений»: создавайте фото для постов, баннеры с акциями и атмосферные фото салона без фотографа." },
            { date: "14 мая 2026", text: "Добавлен новый курс «Мышление мастера»: 8 уроков о том, как специалист влияет на возврат клиента и средний чек. Уже доступен в разделе «Обучение»." },
            { date: "28 апреля 2026", text: "Раздел «Развитие салона» пополнился инструментами: «Генератор поста для Instagram», «Сценарий Reels» и «Генератор акции месяца»." },
            { date: "10 апреля 2026", text: "Курс «Стандарты сервиса» — обновлён и расширен: добавлены уроки по работе с возражениями и технике повторной записи." },
            { date: "21 марта 2026", text: "Запущен ИИ-куратор домашних заданий: после каждого урока ученик может разобрать задание в диалоге с ИИ — без ожидания обратной связи от тренера." },
            { date: "5 марта 2026", text: "Появилась «Диагностика роста салона PRO» — флагманский инструмент анализа: показывает узкие места в работе салона и даёт конкретные рекомендации по росту прибыли." },
            { date: "14 февраля 2026", text: "Добавлена система ролей: теперь владелец салона может подключать сотрудников с отдельными лимитами — администраторов, мастеров, управляющих." },
            { date: "31 мая 2025", text: "Платформа переименована в «Про Диалог» — новое позиционирование, новые инструменты для роста салонного бизнеса." },
          ].map((n, i, arr) => (
            <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid #f0f0ec" : "none", background: n.highlight ? "hsl(185,85%,97%)" : "transparent", borderRadius: n.highlight ? 10 : 0, padding: n.highlight ? "10px 12px" : undefined, marginLeft: n.highlight ? -12 : 0, marginRight: n.highlight ? -12 : 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: n.highlight ? ACCENT : ACCENT, whiteSpace: "nowrap", marginTop: 1, minWidth: 88 }}>{n.date}</div>
              <div style={{ fontSize: 13, color: n.highlight ? "#1a1a1a" : "#555", lineHeight: 1.6, fontWeight: n.highlight ? 600 : 400 }}>{n.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}