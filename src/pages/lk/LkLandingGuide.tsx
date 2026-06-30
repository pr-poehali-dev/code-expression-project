import { useState } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,96%)";

interface Section { id: string; icon: string; title: string; color: string; bg: string; }

const SECTIONS: Section[] = [
  { id: "why",     icon: "TrendingUp",    title: "Зачем это",          color: "hsl(145,60%,38%)", bg: "hsl(145,60%,96%)" },
  { id: "process", icon: "Route",         title: "Как создаётся",      color: "hsl(215,80%,50%)", bg: "hsl(215,80%,96%)" },
  { id: "choose",  icon: "LayoutTemplate",title: "Какой выбрать",      color: "hsl(280,60%,50%)", bg: "hsl(280,60%,97%)" },
  { id: "before",  icon: "Lightbulb",     title: "Перед стартом",      color: "hsl(40,90%,45%)",  bg: "hsl(40,90%,96%)"  },
  { id: "calc",    icon: "Calculator",    title: "Калькулятор",         color: ACCENT,             bg: ACCENT_LIGHT        },
  { id: "video",   icon: "Play",          title: "Видео",               color: "hsl(0,75%,50%)",   bg: "hsl(0,75%,97%)"   },
  { id: "map",     icon: "MapPin",        title: "Карта",               color: "hsl(145,60%,38%)", bg: "hsl(145,60%,96%)" },
  { id: "seo",     icon: "Search",        title: "SEO",                 color: "hsl(215,80%,50%)", bg: "hsl(215,80%,96%)" },
  { id: "privacy", icon: "ShieldCheck",   title: "Конфиденциальность",  color: "hsl(40,90%,45%)",  bg: "hsl(40,90%,96%)"  },
  { id: "storage", icon: "Server",        title: "Хранение и оплата",   color: "hsl(280,60%,50%)", bg: "hsl(280,60%,97%)" },
  { id: "hosting", icon: "Cloud",         title: "Хостинг",             color: "hsl(145,60%,38%)", bg: "hsl(145,60%,96%)" },
  { id: "domain",  icon: "Globe",         title: "Домен",               color: "hsl(215,80%,50%)", bg: "hsl(215,80%,96%)" },
];

// ── Micro-компоненты ────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EEF0F4", padding: "18px 20px", marginBottom: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      {children}
    </div>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 12, lineHeight: 1.35 }}>{children}</div>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.75, marginBottom: 10, marginTop: 0 }}>{children}</p>;
}
function Li({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 8 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <Icon name={icon || "Check"} size={10} style={{ color: ACCENT }} />
      </div>
      <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,84%)", borderRadius: 10, padding: "10px 14px", marginTop: 12 }}>
      <Icon name="Lightbulb" size={14} style={{ color: "hsl(40,90%,45%)", flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 12, color: "hsl(30,60%,38%)", lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}
function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{n}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}
function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, padding: "2px 8px", borderRadius: 20, marginLeft: 8 }}>{label}</span>;
}
function Row2({ a, b }: { a: React.ReactNode; b: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
      {[a, b].map((x, i) => <div key={i} style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", border: "1px solid #EEF0F4" }}>{x}</div>)}
    </div>
  );
}

// ── Контент разделов ────────────────────────────────────────────────────────

function SectionWhy() {
  return (
    <>
      <div style={{ background: "linear-gradient(135deg, hsl(185,85%,28%), hsl(185,85%,18%))", borderRadius: 14, padding: "22px 22px", marginBottom: 10, color: "#fff" }}>
        <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>
          Лендинг за часы — без дизайнера, без верстальщика
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.7, opacity: 0.9 }}>
          ИИ делает всё техническое — вы управляете смыслом и результатом.
        </div>
      </div>

      <Card>
        <H3>💸 Сколько стоит на рынке</H3>
        <Row2
          a={<>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Стандартный</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>от 25 000 ₽</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>Дизайнер + правки 2–4 недели</div>
          </>}
          b={<>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Премиальный</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>от 100 000 ₽</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>Студия + итерации 4–8 недель</div>
          </>}
        />
        <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "12px 14px", border: "1px solid #BBF7D0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 6 }}>✦ С конструктором Промт Диалог</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["Стандартный", "в десятки раз дешевле"], ["Премиальный", "в сотни раз дешевле"]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 10, color: "#166534", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <H3>⚡ Что такое энергия</H3>
        <P>Энергия — внутренняя валюта платформы. Чат и советы — <b>бесплатно</b>, платите только за результат.</P>
        {[
          { icon: "MessageCircle", label: "Диалог и советы ИИ", desc: "бесплатно", hi: true },
          { icon: "Wand2",         label: "Генерация лендинга", desc: "основная часть расходов", hi: false },
          { icon: "Sparkles",      label: "Правки элементов",   desc: "недорого", hi: false },
          { icon: "Server",        label: "Хранение на сервере",desc: "2 ⚡/день + 3 ⚡ за заявку", hi: false },
        ].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: x.hi ? "#F0FDF4" : "#F8FAFC", marginBottom: 6, border: `1px solid ${x.hi ? "#BBF7D0" : "#EEF0F4"}` }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: x.hi ? "#16a34a" : ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={x.icon} size={14} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>{x.label}</div>
              <div style={{ fontSize: 11, color: x.hi ? "#16a34a" : "#64748B" }}>{x.desc}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <H3>✦ Почему лучше, чем у дизайнера</H3>
        {[
          ["Clock",   "Скорость",           "Лендинг готов за 15–60 минут, а не за недели."],
          ["Heart",   "Вы знаете свой бизнес", "Никто не знает вашу аудиторию лучше вас."],
          ["Repeat",  "Мгновенные правки",  "Одно сообщение — и лендинг уже другой."],
          ["Shield",  "Полный контроль",    "HTML-файл у вас. Не зависите от подрядчика."],
          ["Zap",     "Без знаний кода",    "Просто расскажите о бизнесе — ИИ сделает всё."],
        ].map(([ic, t, d]) => (
          <div key={t as string} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #EEF0F4", marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={ic as string} size={15} style={{ color: ACCENT }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{t}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{d}</div>
            </div>
          </div>
        ))}
      </Card>

      <div style={{ background: "hsl(40,90%,97%)", borderRadius: 12, border: "1px solid hsl(40,90%,82%)", padding: "14px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 4 }}>Главное, что нужно понять</div>
        <div style={{ fontSize: 12.5, color: "#78350F", lineHeight: 1.7 }}>
          Это не «дешёвый заменитель» — это другой подход: быстрый, честный и направленный на ваш результат. Вы не покупаете чьё-то видение — вы создаёте своё.
        </div>
      </div>
    </>
  );
}

function SectionProcess() {
  return (
    <>
      <P>Создание лендинга — это простой диалог. Расскажите о бизнесе, ИИ соберёт сайт. Вот весь путь по шагам.</P>
      <Card>
        <H3>От идеи до готового сайта</H3>
        <Step n="1" title="Выберите шаблон">Под вашу задачу: услуги, товар, мероприятие, ресторан, недвижимость…</Step>
        <Step n="2" title="Расскажите о бизнесе">ИИ задаёт вопросы — отвечайте простыми словами. Чат бесплатен.</Step>
        <Step n="3" title="Нажмите «Создать»">ИИ подбирает дизайн и собирает сайт по блокам — 1–3 минуты.</Step>
        <Step n="4" title="Отредактируйте">Кликните на любой элемент и опишите правку. Загрузите фото или видео.</Step>
        <Step n="5" title="Настройте SEO">Заголовок, описание, политика конфиденциальности — 5 минут.</Step>
        <Step n="6" title="Опубликуйте">Оставьте у нас (с заявками на почту) или скачайте и разместите сами.</Step>
      </Card>
      <Card>
        <H3>Как работает редактор</H3>
        <Li icon="MousePointerClick">Наведите — подсветится. Кликните — выделится.</Li>
        <Li icon="MessageCircle">Напишите что изменить простыми словами — ИИ сделает.</Li>
        <Li icon="Undo2">Кнопка «Отменить» — откатывает последнее изменение.</Li>
        <Li icon="ImagePlus">Выделите фото-плашку → загрузите фото или вставьте видео.</Li>
        <Tip>Правки дешёвые, отмена бесплатная. Экспериментируйте смело.</Tip>
      </Card>
    </>
  );
}

function SectionChoose() {
  const types = [
    { t: "Классический / Услуги", d: "Салоны, мастера, студии", e: "Шапка, услуги, отзывы, контакты" },
    { t: "Продажник (Sales)",     d: "Один продукт с акцентом на заявку", e: "Выгоды, как работаем, цены, FAQ" },
    { t: "Сторителлинг",          d: "Зацепить эмоцией и историей", e: "Боль → решение → доверие" },
    { t: "Портфолио / Мастер",    d: "Фотографы, дизайнеры, бьюти", e: "Галерея + услуги" },
    { t: "Компания B2B",          d: "Услуги для бизнеса, агентства", e: "Кейсы, клиенты, команда" },
    { t: "Мероприятие / Курс",    d: "Курсы, конференции, вебинары", e: "Программа, спикеры, билеты" },
    { t: "Ресторан / Кафе",       d: "Заведения общепита", e: "Меню, акции, бронирование" },
    { t: "Недвижимость",          d: "Продажа объектов и ЖК", e: "Объект, район, планировки" },
    { t: "Один товар",            d: "Интернет-магазин одного товара", e: "Выгоды, отзывы, заказ" },
  ];
  return (
    <>
      <P>Тип задаёт структуру блоков. Не переживайте: после генерации любой блок можно убрать или переделать.</P>
      <Card>
        <H3>Выберите под задачу</H3>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {types.map(x => (
            <div key={x.t} style={{ background: "#F8FAFC", border: "1px solid #EEF0F4", borderRadius: 10, padding: "10px 13px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{x.t}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{x.d}</div>
              </div>
              <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>Блоки: {x.e}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function SectionCalc() {
  const [blocks, setBlocks] = useState(6);
  const [edits, setEdits] = useState(3);
  const STYLE = 70, BLOCK = 90, EDIT = 24;
  const total = STYLE + blocks * BLOCK + edits * EDIT;
  const Ctrl = ({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
      <span style={{ fontSize: 13, color: "#475569", flex: 1 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => set(Math.max(min, value - 1))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: 17, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
        <span style={{ width: 26, textAlign: "center", fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{value}</span>
        <button onClick={() => set(Math.min(max, value + 1))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: 17, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
      </div>
    </div>
  );
  return (
    <>
      <P>Прикиньте расход энергии. Двигайте значения — итог пересчитается.</P>
      <Card>
        <H3>Соберите свой лендинг</H3>
        <Ctrl label="Блоков на сайте" value={blocks} set={setBlocks} min={3} max={12} />
        <Ctrl label="Правки через ИИ" value={edits} set={setEdits} min={0} max={30} />
        <div style={{ marginTop: 16, background: "linear-gradient(135deg, hsl(185,85%,28%), hsl(185,85%,18%))", borderRadius: 14, padding: "20px", color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 10, opacity: 0.75, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Примерно потребуется</div>
          <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>≈ {total} ⚡</div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 8 }}>дизайн {STYLE} + {blocks} блоков × {BLOCK} + {edits} правок × {EDIT}</div>
        </div>
        <Tip>Чат и отмена изменений — бесплатны. Точная сумма зависит от правок.</Tip>
      </Card>
    </>
  );
}

function SectionVideo() {
  return (
    <>
      <P>Вставьте видео прямо в фото-слот — выделите его и нажмите «Вставить видео».</P>
      <Card>
        <H3>Поддерживаемые сервисы</H3>
        {[
          ["Кинескоп",      "kinescope.io — лучший выбор для России"],
          ["VK Видео",      "vk.com/video... или vkvideo.ru"],
          ["YouTube",       "обычная ссылка или Shorts"],
          ["Rutube",        "ссылка на видео"],
          ["Яндекс.Диск",  "ссылка на загруженный файл"],
        ].map(([s, d]) => (
          <div key={s} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 9, background: "#F8FAFC", border: "1px solid #EEF0F4", marginBottom: 6 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "hsl(0,75%,97%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="Play" size={12} style={{ color: "hsl(0,75%,50%)" }} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>{s}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{d}</div>
            </div>
          </div>
        ))}
        <Tip>Яндекс.Диск иногда блокирует встраивание. Надёжнее всего — Кинескоп и VK.</Tip>
      </Card>
      <Card>
        <H3>Как вставить</H3>
        <Step n="1" title="Выделите фото-плашку">Нажмите на неё в режиме «Редактировать».</Step>
        <Step n="2" title="Нажмите «Вставить видео»">Появится поле для ссылки.</Step>
        <Step n="3" title="Вставьте ссылку и нажмите «Вставить»">Видео заменит плашку мгновенно.</Step>
      </Card>
    </>
  );
}

function SectionMap() {
  return (
    <>
      <P>Яндекс-карта с вашим адресом повышает доверие клиентов. Добавляется в блок «Контакты».</P>
      <Card>
        <H3>Как добавить карту</H3>
        <Step n="1" title="Откройте блок «Контакты»">Только там доступна карта.</Step>
        <Step n="2" title="Найдите поле «Яндекс-карта»">Введите адрес: «г. Москва, ул. Пример, 1».</Step>
        <Step n="3" title="Нажмите кнопку с иконкой карты">Карта встроится — Яндекс сам найдёт точку.</Step>
        <Step n="4" title="Уточните адрес если нужно">Если точка неточная — добавьте город, район.</Step>
        <Tip>Работает без API-ключей. Рядом есть кнопка удаления карты.</Tip>
      </Card>
    </>
  );
}

function SectionSeo() {
  return (
    <>
      <P>Без SEO сайт есть — но в поиске его не видно. Заполнить раздел займёт 5 минут.</P>
      <Card>
        <H3>Что заполнить</H3>
        {[
          ["Type",       "Заголовок (Title)",         "Что показывается в поиске и вкладке браузера. Пример: «Массаж в СПб — студия Баланс»"],
          ["AlignLeft",  "Описание (Description)",     "1–2 предложения с выгодой и городом — текст под заголовком в поиске."],
          ["Hash",       "Ключевые слова",             "По каким запросам вас ищут: «массаж спб», «лечебный массаж»."],
          ["Image",      "Иконка сайта (favicon)",     "Маленькая картинка во вкладке браузера."],
        ].map(([ic, t, d]) => (
          <div key={t as string} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "hsl(215,80%,96%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <Icon name={ic as string} size={13} style={{ color: "hsl(215,80%,50%)" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{t}</div>
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{d}</div>
            </div>
          </div>
        ))}
        <Tip>SEO-настройки встраиваются в сайт и работают как на нашем сервере, так и при размещении на своём хостинге.</Tip>
      </Card>
    </>
  );
}

function SectionPrivacy() {
  return (
    <>
      <P>Если на сайте есть форма заявки — по 152-ФЗ нужна Политика конфиденциальности. Без неё сбор данных нарушает закон.</P>
      <Card>
        <H3>Как настроить</H3>
        <Step n="1" title="Откройте раздел «Документы»">В панели редактора лендинга.</Step>
        <Step n="2" title="Заполните данные организации">Название, ИНН, адрес, email, домен.</Step>
        <Step n="3" title="Готово">Ссылка на политику появится в футере под формой.</Step>
        <Tip>Без политики форма юридически уязвима. Заполните до публикации — бесплатно.</Tip>
      </Card>
      <Card>
        <H3>Важно при переезде на свой хостинг</H3>
        <Li icon="Server">На нашем сервере — политика показывается автоматически.</Li>
        <Li icon="Download">При скачивании — страницу политики надо разместить на хостинге отдельно.</Li>
        <Li icon="Link">Проверьте что ссылка в футере ведёт на рабочую страницу.</Li>
      </Card>
    </>
  );
}

function SectionStorage() {
  return (
    <>
      <P>Сайт можно оставить у нас — мы храним и принимаем заявки. Или скачать и разместить самостоятельно.</P>
      <Card>
        <H3>На нашем сервере</H3>
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          {[["2 ⚡ / день", "хранение сайта"], ["3 ⚡", "за каждую заявку"]].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", border: "1px solid #EEF0F4", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: ACCENT }}>{v}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        <Li icon="Check">Заявки приходят на email автоматически</Li>
        <Li icon="Check">SEO и политика работают из коробки</Li>
      </Card>
      <Card>
        <H3>На своём хостинге</H3>
        <Li icon="Download">Скачайте HTML и разместите на своём домене.</Li>
        <Li icon="Wallet">Настроите форму сами — за заявки нам не платите.</Li>
        <Li icon="ShieldCheck">Перенесите страницу политики отдельным файлом.</Li>
      </Card>
      <Card>
        <H3>Если сайт удаляете</H3>
        <Li icon="Trash2">Удалили — списания прекращаются полностью.</Li>
        <Li icon="AlertTriangle">После удаления отредактировать сайт не получится.</Li>
        <Tip>Перед удалением скачайте HTML — останется копия на всякий случай.</Tip>
      </Card>
    </>
  );
}

function SectionBefore() {
  return (
    <>
      <P>Чем больше деталей вы дадите ИИ — тем точнее и красивее получится результат.</P>
      <Card>
        <H3>📋 Обязательно</H3>
        <Li>Название компании или бренда</Li>
        <Li>3–5 услуг или товаров с описанием</Li>
        <Li>Главное преимущество перед конкурентами</Li>
        <Li>Телефон и/или email</Li>
        <Li>Город или регион работы</Li>
        <Tip>Без этого ИИ будет спрашивать каждый пункт по одному.</Tip>
      </Card>
      <Card>
        <H3>⭐ Для лучшего результата</H3>
        <Li>Диапазон цен или стоимость услуг</Li>
        <Li>Акция для новых клиентов</Li>
        <Li>Ссылки: ВКонтакте, Telegram</Li>
        <Li>Реальные отзывы (имя + текст)</Li>
        <Li>Факты: сколько лет, клиентов, мастеров</Li>
      </Card>
      <Card>
        <H3>🖼 Фотографии</H3>
        <P>ИИ создаст лендинг с плашками. После — загрузите свои фото кликом.</P>
        <Li>Фото команды или процесса</Li>
        <Li>Результаты работы (до/после)</Li>
        <Li>Помещение, продукты, интерьер</Li>
        <Tip>Оптимально: 1200×800 px и выше. Тёмные фото ухудшают восприятие.</Tip>
      </Card>
    </>
  );
}

function SectionHosting() {
  return (
    <>
      <P>Готовый лендинг — один HTML-файл. Разместите на любом хостинге или бесплатном сервисе.</P>
      <Card>
        <H3>Netlify Drop <Badge label="Бесплатно" color="hsl(145,60%,38%)" bg="hsl(145,60%,96%)" /></H3>
        <Step n="1" title="Зайдите на app.netlify.com/drop">Регистрация не нужна.</Step>
        <Step n="2" title="Скачайте HTML из конструктора">Кнопка «Скачать HTML».</Step>
        <Step n="3" title="Перетащите файл в браузер">Через 10 секунд сайт онлайн.</Step>
        <Tip>Адрес будет «abc.netlify.app». Для своего домена нужен другой вариант.</Tip>
      </Card>
      <Card>
        <H3>Timeweb / Beget / REG.RU <Badge label="от 99 ₽/мес" color="hsl(215,80%,50%)" bg="hsl(215,80%,96%)" /></H3>
        <Step n="1" title="Зарегистрируйтесь и купите хостинг">Минимальный тариф.</Step>
        <Step n="2" title="Купите домен">Обычно предлагают бесплатно в первый год.</Step>
        <Step n="3" title="Загрузите index.html в папку public_html">Через файловый менеджер.</Step>
        <Step n="4" title="Подключите домен">DNS применяются за 1–24 часа.</Step>
      </Card>
    </>
  );
}

function SectionDomain() {
  return (
    <>
      <P>Свой домен — профессионально. «massazh-spb.ru» вызывает доверие больше, чем «abc.netlify.app».</P>
      <Card>
        <H3>Почему важен</H3>
        <Li>Вызывает доверие у клиентов</Li>
        <Li>Легко запомнить и продиктовать</Li>
        <Li>Можно завести корпоративную почту</Li>
        <Li>150–500 ₽ в год — окупается одним клиентом</Li>
      </Card>
      <Card>
        <H3>Как выбрать</H3>
        <Li>Короткое — не более 15 символов</Li>
        <Li>Легко произнести без ошибок</Li>
        <Li>Отражает суть: название + вид услуги + город</Li>
        <Li>Предпочтительно .ru для российской аудитории</Li>
        <Tip>«marafon-beauty.ru», «salon-lux-msk.ru» — хорошие примеры. Избегайте цифр без смысла.</Tip>
      </Card>
      <Card>
        <H3>Схема: домен + хостинг + лендинг</H3>
        <Step n="1" title="Купите домен">На reg.ru, timeweb.com. 150–500 ₽/год.</Step>
        <Step n="2" title="Купите хостинг">Там же. от 99 ₽/мес.</Step>
        <Step n="3" title="Привяжите домен к хостингу">NS-серверы хостинга в настройках домена.</Step>
        <Step n="4" title="Загрузите index.html">В папку public_html.</Step>
        <Step n="5" title="Подождите 1–24 часа">DNS применяются не мгновенно.</Step>
        <Step n="6" title="Подключите SSL (HTTPS)">Бесплатно — Let's Encrypt в панели хостинга.</Step>
      </Card>
    </>
  );
}

// ── Главный компонент ───────────────────────────────────────────────────────

export default function LkLandingGuide({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState("why");

  const contentMap: Record<string, React.ReactNode> = {
    why:     <SectionWhy />,
    process: <SectionProcess />,
    choose:  <SectionChoose />,
    before:  <SectionBefore />,
    calc:    <SectionCalc />,
    video:   <SectionVideo />,
    map:     <SectionMap />,
    seo:     <SectionSeo />,
    privacy: <SectionPrivacy />,
    storage: <SectionStorage />,
    hosting: <SectionHosting />,
    domain:  <SectionDomain />,
  };

  const active = SECTIONS.find(s => s.id === activeSection)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", maxHeight: "80vh", fontFamily: "Montserrat, sans-serif" }}>
      <style>{`
        .guide-nav::-webkit-scrollbar { height: 0; }
        .guide-body::-webkit-scrollbar { width: 5px; }
        .guide-body::-webkit-scrollbar-track { background: transparent; }
        .guide-body::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .guide-nav-btn { transition: all 0.15s !important; }
        .guide-nav-btn:hover { opacity: 0.85; }
      `}</style>

      {/* ── Шапка ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 0 16px", flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="BookOpen" size={18} style={{ color: ACCENT }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>База знаний</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Конструктор лендингов</div>
        </div>
        <button onClick={onClose} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderRadius: 10, border: "none", background: ACCENT, color: "#fff",
          fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
        }}>
          <Icon name="Wand2" size={13} />
          Начать создание
        </button>
      </div>

      {/* ── Навигация ─────────────────────────────────────────── */}
      <div className="guide-nav" style={{ overflowX: "auto", marginBottom: 14, flexShrink: 0, paddingBottom: 2 }}>
        <div style={{ display: "flex", gap: 6, width: "max-content" }}>
          {SECTIONS.map(s => {
            const isActive = activeSection === s.id;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)} className="guide-nav-btn"
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 12px", borderRadius: 20, border: "none",
                  background: isActive ? s.color : "#F1F5F9",
                  color: isActive ? "#fff" : "#64748B",
                  fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                  whiteSpace: "nowrap", flexShrink: 0,
                  boxShadow: isActive ? `0 2px 8px ${s.color}44` : "none",
                }}>
                <Icon name={s.icon} size={11} />
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Активный раздел — заголовок ──────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", background: active.bg, borderRadius: 12,
        border: `1px solid ${active.color}25`, marginBottom: 14, flexShrink: 0,
      }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: active.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={active.icon} size={14} style={{ color: "#fff" }} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{active.title}</div>
      </div>

      {/* ── Контент — скроллируется ───────────────────────────── */}
      <div className="guide-body" style={{ flex: 1, overflowY: "auto", paddingRight: 2 }}>
        {contentMap[activeSection]}

        {/* Кнопка внизу */}
        <div style={{ paddingTop: 8, paddingBottom: 4 }}>
          <button onClick={onClose} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "13px 20px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(185,85%,24%) 100%)`,
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: `0 4px 16px ${ACCENT}44`,
          }}>
            <Icon name="Wand2" size={16} />
            Перейти к созданию лендинга
          </button>
        </div>
      </div>
    </div>
  );
}
