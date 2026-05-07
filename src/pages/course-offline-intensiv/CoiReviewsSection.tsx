import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, h2style } from "./CoiShared";

const REVIEWS = [
  {
    name: "Марина К.",
    city: "Москва",
    experience: "Массажист, 4 года",
    photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/a45bc6e6-fffc-414e-9c80-df4349c8066b.jpg",
    rating: 5,
    text: "Пришла с ощущением, что уже всё знаю. Ушла с 12 страницами заметок и конкретным планом на месяц. Блок по ВНС буквально изменил то, как я понимаю работу с клиентом. Уже через неделю после интенсива подняла чек — и ни один клиент не ушёл.",
    result: "Подняла чек на 30% через неделю",
  },
  {
    name: "Алексей Г.",
    city: "Санкт-Петербург",
    experience: "Спортивный массажист, 6 лет",
    photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/b2957469-d773-4f37-95d9-0b2421c21d47.jpg",
    rating: 5,
    text: "Мне понравилось, что всё строго на практике — не лекции, а реальная работа. Техники по позвоночнику отрабатывали на партнёрах, сразу получали обратную связь от тренера. Это совсем другой уровень усвоения, чем онлайн. Онлайн-доступ к курсам после — приятный бонус, пользуюсь до сих пор.",
    result: "+3 новых постоянных клиента за месяц",
  },
  {
    name: "Ольга В.",
    city: "Казань",
    experience: "Массажист-косметолог, 2 года",
    photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/1cee4044-4425-482c-a726-29d51dc72180.jpg",
    rating: 5,
    text: "Специально приехала из Казани — не пожалела. Атмосфера в группе была очень тёплой, все помогали друг другу. Особенно зашёл блок по антистресс-техникам: теперь клиенты буквально засыпают на столе, и все уходят с ощущением полного перезагруза. Сарафан работает сам.",
    result: "Запись забита на 3 недели вперёд",
  },
  {
    name: "Тамара Л.",
    city: "Екатеринбург",
    experience: "Реабилитолог, 12 лет",
    photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/121d22f3-67ac-44fc-8dd2-bd72e17b09a9.jpg",
    rating: 5,
    text: "С моим опытом шла немного скептически. Но программа оказалась действительно насыщенной — особенно по мануальным техникам ПИР и работе с крестцово-поясничным отделом. Появились приёмы, которых не хватало в моей практике. Очень грамотная подача от тренера.",
    result: "Расширила линейку услуг, средний чек вырос",
  },
  {
    name: "Дмитрий Н.",
    city: "Новосибирск",
    experience: "Массажист, 1,5 года",
    photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/a8fbdb96-4891-44f0-9081-8d1a6b732b57.jpg",
    rating: 5,
    text: "Для меня как начинающего интенсив стал точкой отсчёта. Разобрался, где теряю деньги, получил конкретные техники и понял, как строить отношения с клиентом на долгосрочку. Группа маленькая, к каждому было внимание тренера. Это ценно.",
    result: "Первый постоянный поток клиентов",
  },
  {
    name: "Светлана Р.",
    city: "Краснодар",
    experience: "Массажист, 5 лет",
    photo: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/429b9bb3-6ed7-4051-b87c-dd8f5eb17379.jpg",
    rating: 5,
    text: "Работаю пять лет, но именно на этом интенсиве поняла, почему клиенты не возвращались. Тренер буквально разложил по полочкам всю систему: от первого контакта до повторной записи. После внедрения нескольких простых вещей постоянных клиентов стало вдвое больше уже за месяц.",
    result: "Постоянных клиентов стало вдвое больше",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="Star"
          size={14}
          style={{ color: i < rating ? "#f59e0b" : "#e5e7eb", fill: i < rating ? "#f59e0b" : "none" }}
        />
      ))}
    </div>
  );
}

export default function CoiReviewsSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section style={{ padding: "80px 0 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 36 }}>
          <div>
            <h2 style={{ ...h2style, marginBottom: 8 }}>Отзывы участников</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={16} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                ))}
              </div>
              <span style={{ fontSize: 14, color: "#666" }}>5.0 — все участники рекомендуют</span>
            </div>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }} className="coi-reviews-grid">
          {REVIEWS.map((r, i) => {
            const isOpen = expanded === i;
            const isLong = r.text.length > 180;
            const displayText = isLong && !isOpen ? r.text.slice(0, 180).trimEnd() + "…" : r.text;

            return (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e8e8e4",
                  borderRadius: 20,
                  padding: "24px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  boxShadow: "0 2px 14px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Шапка */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <img
                    src={r.photo}
                    alt={r.name}
                    style={{
                      width: 52, height: 52, borderRadius: "50%",
                      objectFit: "cover", objectPosition: "top center",
                      border: `2px solid ${ACCENT}30`, flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1a1a1a", marginBottom: 2 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>{r.city} · {r.experience}</div>
                    <StarRating rating={r.rating} />
                  </div>
                </div>

                {/* Кавычка */}
                <div style={{ color: `${ACCENT}25`, fontSize: 48, lineHeight: 1, marginBottom: -8, fontFamily: "Georgia, serif", fontWeight: 900, userSelect: "none" }}>"</div>

                {/* Текст */}
                <div style={{ fontSize: 13.5, color: "#444", lineHeight: 1.7, flex: 1, marginBottom: 14 }}>
                  {displayText}
                  {isLong && (
                    <button
                      onClick={() => setExpanded(isOpen ? null : i)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: ACCENT, fontSize: 13, fontWeight: 600, padding: 0,
                        marginLeft: 4, fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {isOpen ? "свернуть" : "читать полностью"}
                    </button>
                  )}
                </div>

                {/* Результат */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: `${ACCENT}0e`, borderRadius: 10, padding: "8px 12px",
                  marginTop: "auto",
                }}>
                  <Icon name="TrendingUp" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT }}>{r.result}</span>
                </div>
              </div>
            );
          })}
        </div>

        <style>{`
          @media (max-width: 860px) { .coi-reviews-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 520px) { .coi-reviews-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    </section>
  );
}