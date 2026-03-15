import { useEffect, useRef, useState } from "react";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const ACCENT = "hsl(185, 85%, 32%)";

const SECTIONS = [
  {
    title: "1. Термины и определения",
    items: [
      { num: "1.1.", text: "Платформа (Сайт) — интернет-платформа «Док диалог» по адресу https://docdialog.ru." },
      { num: "1.2.", text: "Исполнитель — ИП Водопьянов Сергей Геннадьевич (ОГРНИП 321508100047334)." },
      { num: "1.3.", text: "Пользователь — физическое или юридическое лицо, использующее Платформу, включая: Клиентов, Специалистов (массажисты, остеопаты и др.), Школы и Салоны." },
      { num: "1.4.", text: "Информационные услуги — комплекс услуг по предоставлению доступа к Платформе, включая размещение информации и организацию взаимодействия между Пользователями." },
      { num: "1.5.", text: "Контент — любая информация, размещаемая Пользователями на Платформе." },
    ],
  },
  {
    title: "2. Предмет договора",
    items: [
      { num: "2.1.", text: "Исполнитель предоставляет Пользователю доступ к информационным услугам Платформы, а Пользователь соблюдает условия использования и оплачивает услуги в соответствии с тарифами." },
      { num: "2.2.", text: "Платформа выполняет исключительно информационно-посреднические функции." },
      { num: "2.3.", text: "Исполнитель не является стороной договоров между Пользователями и не несёт ответственности за качество услуг Специалистов, Школ или Салонов." },
    ],
  },
  {
    title: "3. Правовой статус Платформы",
    items: [
      { num: "3.1.", text: "Платформа «Док диалог» является информационным посредником и не осуществляет медицинскую или образовательную деятельность." },
      { num: "3.2.", text: "Вся информация носит ознакомительный и справочный характер и не является медицинской консультацией или руководством к самолечению." },
      { num: "3.3.", text: "Пользователь принимает решения о получении услуг самостоятельно и на свой риск. Перед получением услуг рекомендуется консультация с лицензированным врачом." },
    ],
  },
  {
    title: "4. Порядок заключения договора (акцепт оферты)",
    items: [
      { num: "4.1.", text: "Акцептом является: регистрация на Платформе, начало использования функций Платформы или оплата платных услуг." },
      { num: "4.2.", text: "Совершая акцепт, Пользователь подтверждает ознакомление с условиями и полное согласие с ними." },
      { num: "4.3.", text: "Договор вступает в силу с момента акцепта." },
    ],
  },
  {
    title: "5. Права и обязанности Исполнителя",
    items: [
      { num: "5.1.", text: "Исполнитель обязан обеспечивать работу Платформы 24/7, защищать персональные данные, предоставлять техподдержку и информировать об изменениях." },
      { num: "5.2.", text: "Исполнитель вправе изменять условия Договора, временно приостанавливать работу, удалять нарушающий контент, блокировать учётные записи нарушителей." },
    ],
  },
  {
    title: "6. Права и обязанности Пользователей",
    items: [
      { num: "6.1.", text: "Пользователь обязан соблюдать условия Договора, предоставлять достоверную информацию, не нарушать права третьих лиц." },
      { num: "6.2.", text: "Пользователь вправе пользоваться всеми функциями Платформы в рамках выбранного тарифа и обращаться в техподдержку." },
    ],
  },
  {
    title: "7. Стоимость услуг и порядок оплаты",
    items: [
      { num: "7.1.", text: "Стоимость услуг определяется тарифными планами, опубликованными на Платформе." },
      { num: "7.2.", text: "Оплата производится в рублях РФ любым доступным способом на Платформе." },
      { num: "7.3.", text: "Исполнитель вправе изменять стоимость услуг с уведомлением Пользователей." },
    ],
  },
  {
    title: "8. Ответственность сторон",
    items: [
      { num: "8.1.", text: "Исполнитель не несёт ответственности за действия Пользователей, качество услуг Специалистов и Салонов, а также за ущерб вследствие использования информации с Платформы в медицинских целях." },
      { num: "8.2.", text: "Пользователь несёт ответственность за достоверность предоставленной информации и соблюдение условий Договора." },
    ],
  },
  {
    title: "9. Реквизиты Исполнителя",
    items: [
      { num: "", text: "ИП Водопьянов Сергей Геннадьевич" },
      { num: "", text: "ОГРНИП: 321508100047334" },
      { num: "", text: "Email: massopro@mail.ru" },
      { num: "", text: "Сайт: docdialog.ru" },
    ],
  },
];

type SectionItem = { num: string; text: string };

export default function Offer() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <DokNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 144, paddingBottom: 56 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>
              Правовые документы
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 24, letterSpacing: "-0.5px" }}>
              Публичная оферта
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", fontSize: 13, color: "#666", lineHeight: 1.8 }}>
              <div><strong style={{ color: "#3a3a3a" }}>УТВЕРЖДЁН</strong></div>
              <div>Приказ ИП Водопьянов С.Г. № 3 от 13.01.2025 г.</div>
              <div>Размещён на сайте: docdialog.ru/offer</div>
              <div>Дата размещения: 13.01.2025 г.</div>
              <div>Дата последнего обновления: 13 января 2025 года.</div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Intro */}
      <section style={{ paddingBottom: 48 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>
                Публичный договор оферты на оказание информационных услуг
              </h2>
              {[
                "Настоящий Публичный договор оферты (далее — «Договор») является официальным предложением ИП Водопьянова Сергея Геннадьевича (далее — «Исполнитель») заключить договор на условиях, изложенных ниже.",
                "В соответствии со статьёй 437 ГК РФ данный документ является публичной офертой. Лицо, осуществившее акцепт, становится Пользователем платформы «Док диалог».",
              ].map((p, i) => (
                <p key={i} style={{ fontSize: "clamp(14px, 2vw, 15px)", lineHeight: 1.8, color: "#444", margin: i === 0 ? "0 0 16px" : "0" }}>{p}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sections */}
      <section style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {SECTIONS.map((section, si) => (
              <FadeIn key={si} delay={si * 50}>
                <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f0f0ee" }}>
                    {section.title}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {section.items.map((item: SectionItem, ii) => (
                      <div key={ii} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        {item.num && (
                          <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT, flexShrink: 0, paddingTop: 1 }}>{item.num}</span>
                        )}
                        <p style={{ fontSize: "clamp(13px, 1.8vw, 14px)", lineHeight: 1.8, color: "#444", margin: 0 }}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}