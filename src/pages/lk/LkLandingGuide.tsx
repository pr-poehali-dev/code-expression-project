import { useState } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,96%)";

// ── Мини-компоненты ─────────────────────────────────────────────────────────

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.75, margin: "0 0 10px" }}>{children}</p>;
}
function H({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 10, marginTop: 14 }}>{children}</div>;
}
function Li({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <Icon name={icon || "Check"} size={10} style={{ color: ACCENT }} />
      </div>
      <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 9, background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,84%)", borderRadius: 10, padding: "10px 13px", marginTop: 12 }}>
      <Icon name="Lightbulb" size={13} style={{ color: "hsl(40,90%,45%)", flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 12, color: "hsl(30,60%,38%)", lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}
function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 11, marginBottom: 12 }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{n}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );
}
function Grid2({ items }: { items: { label: string; value: string; sub?: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "10px 0" }}>
      {items.map(x => (
        <div key={x.label} style={{ background: "#F8FAFC", border: "1px solid #EEF0F4", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 4 }}>{x.label}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>{x.value}</div>
          {x.sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{x.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Калькулятор ──────────────────────────────────────────────────────────────

function CalcSection() {
  const [blocks, setBlocks] = useState(6);
  const [edits, setEdits] = useState(3);
  const STYLE = 70, BLOCK = 90, EDIT = 24;
  const total = STYLE + blocks * BLOCK + edits * EDIT;
  const Ctrl = ({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
      <span style={{ fontSize: 13, color: "#475569" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => set(Math.max(min, value - 1))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: 18, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
        <span style={{ width: 24, textAlign: "center" as const, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{value}</span>
        <button onClick={() => set(Math.min(max, value + 1))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: 18, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
      </div>
    </div>
  );
  return (
    <>
      <P>Меняйте значения — итог пересчитывается автоматически.</P>
      <Ctrl label="Блоков на сайте" value={blocks} set={setBlocks} min={3} max={12} />
      <Ctrl label="Правок через ИИ" value={edits} set={setEdits} min={0} max={30} />
      <div style={{ marginTop: 16, background: "linear-gradient(135deg, hsl(185,85%,28%), hsl(185,85%,18%))", borderRadius: 14, padding: "20px", color: "#fff", textAlign: "center" as const }}>
        <div style={{ fontSize: 10, opacity: 0.75, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 6 }}>Примерно потребуется</div>
        <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}>≈ {total} ⚡</div>
        <div style={{ fontSize: 11, opacity: 0.8, marginTop: 8 }}>дизайн {STYLE} + {blocks} × {BLOCK} + {edits} × {EDIT}</div>
      </div>
      <Tip>Чат и отмена изменений — бесплатны.</Tip>
    </>
  );
}

// ── Данные разделов ──────────────────────────────────────────────────────────

const SECTIONS: { id: string; icon: string; title: string; color: string; content: () => React.ReactNode }[] = [
  {
    id: "why", icon: "TrendingUp", title: "Зачем это и сколько стоит", color: "hsl(145,60%,38%)",
    content: () => (
      <>
        <div style={{ background: "linear-gradient(135deg,hsl(185,85%,28%),hsl(185,85%,18%))", borderRadius: 12, padding: "18px", marginBottom: 14, color: "#fff" }}>
          <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3, marginBottom: 6 }}>Лендинг за часы — без дизайнера и верстальщика</div>
          <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.7 }}>ИИ делает всё техническое — вы управляете смыслом и результатом.</div>
        </div>
        <H>💸 На рынке без нас</H>
        <Grid2 items={[
          { label: "Стандартный", value: "от 25 000 ₽", sub: "Дизайнер + правки + 2–4 недели" },
          { label: "Премиальный", value: "от 100 000 ₽", sub: "Студия + итерации + 4–8 недель" },
        ]} />
        <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "12px 14px", border: "1px solid #BBF7D0", marginBottom: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 6 }}>✦ С конструктором Промт Диалог</div>
          <Grid2 items={[
            { label: "Стандартный", value: "в десятки раз дешевле" },
            { label: "Премиальный", value: "в сотни раз дешевле" },
          ]} />
        </div>
        <H>⚡ Что такое энергия</H>
        <P>Чат и советы — <b>бесплатно</b>. Платите только за результат.</P>
        {([
          ["MessageCircle", "Диалог с ИИ",         "Бесплатно",                      true ],
          ["Wand2",         "Генерация лендинга",   "Основная часть расходов",        false],
          ["Sparkles",      "Правки элементов",     "Недорого",                       false],
          ["Server",        "Хранение на сервере",  "2 ⚡/день + 3 ⚡ за заявку",    false],
        ] as [string,string,string,boolean][]).map(([ic, t, d, hi]) => (
          <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 9, background: hi ? "#F0FDF4" : "#F8FAFC", border: `1px solid ${hi ? "#BBF7D0" : "#EEF0F4"}`, marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: hi ? "#16a34a" : ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={ic} size={13} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>{t}</div>
              <div style={{ fontSize: 11, color: hi ? "#16a34a" : "#64748B" }}>{d}</div>
            </div>
          </div>
        ))}
        <H>✦ Почему лучше дизайнера</H>
        {([
          ["Clock",  "Скорость",             "Лендинг за 15–60 минут, не недели."],
          ["Heart",  "Вы знаете свой бизнес","Никто не знает аудиторию лучше вас."],
          ["Repeat", "Мгновенные правки",    "Одно сообщение ИИ — и сайт уже другой."],
          ["Shield", "Полный контроль",      "HTML-файл у вас. Не зависите от подрядчика."],
          ["Zap",    "Без знаний кода",      "Просто расскажите о бизнесе — ИИ сделает всё."],
        ] as [string,string,string][]).map(([ic, t, d]) => (
          <div key={t} style={{ display: "flex", gap: 10, padding: "9px 11px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #EEF0F4", marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={ic} size={14} style={{ color: ACCENT }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 1 }}>{t}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{d}</div>
            </div>
          </div>
        ))}
      </>
    ),
  },
  {
    id: "process", icon: "Route", title: "Как создаётся лендинг", color: "hsl(215,80%,50%)",
    content: () => (
      <>
        <P>Простой диалог: рассказываете о бизнесе — ИИ собирает сайт.</P>
        <H>Шаги от идеи до сайта</H>
        <Step n="1" title="Выберите шаблон">Под задачу: услуги, товар, мероприятие, ресторан…</Step>
        <Step n="2" title="Расскажите о бизнесе">ИИ задаёт вопросы — отвечайте просто. Чат бесплатен.</Step>
        <Step n="3" title="Нажмите «Создать»">ИИ подбирает дизайн и собирает блоки — 1–3 минуты.</Step>
        <Step n="4" title="Редактируйте">Кликайте на элементы и описывайте правки. Фото и видео — в плашки.</Step>
        <Step n="5" title="SEO и документы">Заголовок, описание, политика конфиденциальности.</Step>
        <Step n="6" title="Публикуйте">Оставьте у нас или скачайте HTML на свой хостинг.</Step>
        <H>Как работает редактор</H>
        <Li icon="MousePointerClick">Наведите — подсветится. Кликните — выделится.</Li>
        <Li icon="MessageCircle">Напишите что изменить — ИИ выполнит.</Li>
        <Li icon="Undo2">«Отменить» — откатит последнее изменение.</Li>
        <Li icon="ImagePlus">Выделите фото-плашку → загрузите фото или видео.</Li>
        <Tip>Правки дешёвые, отмена бесплатная. Экспериментируйте смело.</Tip>
      </>
    ),
  },
  {
    id: "choose", icon: "LayoutTemplate", title: "Какой лендинг выбрать", color: "hsl(280,60%,50%)",
    content: () => (
      <>
        <P>Шаблон задаёт структуру блоков. После генерации любой блок можно убрать или переделать.</P>
        {([
          ["Классический / Услуги","Салоны, мастера, студии","Шапка, услуги, отзывы, контакты"],
          ["Продажник (Sales)","Один продукт с акцентом на заявку","Выгоды, как работаем, цены, FAQ"],
          ["Сторителлинг","Зацепить эмоцией и историей","Боль → решение → доверие"],
          ["Портфолио","Фотографы, бьюти, дизайнеры","Галерея работ + услуги"],
          ["Компания B2B","Услуги для бизнеса, агентства","Кейсы, клиенты, команда"],
          ["Мероприятие / Курс","Конференции, вебинары","Программа, спикеры, билеты"],
          ["Ресторан / Кафе","Заведения общепита","Меню, акции, бронирование"],
          ["Недвижимость","Продажа объектов и ЖК","Объект, район, планировки"],
          ["Один товар","Интернет-магазин одного товара","Выгоды, отзывы, заказ"],
        ] as [string,string,string][]).map(([t, d, e]) => (
          <div key={t} style={{ background: "#F8FAFC", border: "1px solid #EEF0F4", borderRadius: 10, padding: "10px 13px", marginBottom: 7 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{t}</div>
            <div style={{ fontSize: 11.5, color: "#64748B", marginBottom: 4 }}>{d}</div>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>Блоки: {e}</div>
          </div>
        ))}
      </>
    ),
  },
  {
    id: "before", icon: "Lightbulb", title: "Перед стартом — что подготовить", color: "hsl(40,90%,45%)",
    content: () => (
      <>
        <P>Чем больше деталей дадите — тем точнее результат.</P>
        <H>📋 Обязательно</H>
        <Li>Название компании или бренда</Li>
        <Li>3–5 услуг или товаров с описанием</Li>
        <Li>Главное преимущество перед конкурентами</Li>
        <Li>Телефон и/или email</Li>
        <Li>Город или регион работы</Li>
        <Tip>Без этого ИИ будет спрашивать каждый пункт по одному.</Tip>
        <H>⭐ Для лучшего результата</H>
        <Li>Диапазон цен или стоимость услуг</Li>
        <Li>Акция для новых клиентов</Li>
        <Li>Ссылки на соцсети</Li>
        <Li>Реальные отзывы (имя + текст)</Li>
        <Li>Факты: лет работы, клиентов, мастеров</Li>
        <H>🖼 Фото</H>
        <P>ИИ создаст плашки — кликните и загрузите своё фото.</P>
        <Li>Фото команды или процесса</Li>
        <Li>Результаты работы (до/после)</Li>
        <Li>Помещение, продукты, интерьер</Li>
        <Tip>Оптимально: 1200×800 px и выше. Тёмные фото ухудшают восприятие.</Tip>
      </>
    ),
  },
  {
    id: "calc", icon: "Calculator", title: "Калькулятор стоимости", color: ACCENT,
    content: () => <CalcSection />,
  },
  {
    id: "video", icon: "Play", title: "Как добавить видео", color: "hsl(0,75%,50%)",
    content: () => (
      <>
        <P>Выделите фото-плашку → «Вставить видео» → вставьте ссылку. Мгновенно, без ИИ.</P>
        <H>Поддерживаемые сервисы</H>
        {([
          ["Кинескоп","kinescope.io — лучший для России"],
          ["VK Видео","vk.com/video... или vkvideo.ru"],
          ["YouTube","обычная ссылка или Shorts"],
          ["Rutube","ссылка на видео"],
          ["Яндекс.Диск","ссылка на видеофайл"],
        ] as [string,string][]).map(([s, d]) => (
          <div key={s} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 9, background: "#F8FAFC", border: "1px solid #EEF0F4", marginBottom: 6 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "hsl(0,75%,97%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="Play" size={11} style={{ color: "hsl(0,75%,50%)" }} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>{s}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{d}</div>
            </div>
          </div>
        ))}
        <Tip>Яндекс.Диск иногда блокирует встраивание — надёжнее Кинескоп и VK.</Tip>
      </>
    ),
  },
  {
    id: "map", icon: "MapPin", title: "Как добавить Яндекс-карту", color: "hsl(145,60%,38%)",
    content: () => (
      <>
        <P>Карта в блоке «Контакты» — повышает доверие клиентов.</P>
        <Step n="1" title="Откройте блок «Контакты»">Карта добавляется только туда.</Step>
        <Step n="2" title="Найдите поле «Яндекс-карта»">Введите адрес: «г. Москва, ул. Пример, 1».</Step>
        <Step n="3" title="Нажмите кнопку карты">Встроится автоматически — Яндекс найдёт точку.</Step>
        <Step n="4" title="Уточните адрес если нужно">Если точка неточная — добавьте район.</Step>
        <Tip>Работает без API-ключей. Рядом есть кнопка удаления карты.</Tip>
      </>
    ),
  },
  {
    id: "seo", icon: "Search", title: "SEO: как вас находят в поиске", color: "hsl(215,80%,50%)",
    content: () => (
      <>
        <P>Без SEO сайт есть, но в поиске его не видно. Заполнить — 5 минут.</P>
        {([
          ["Type",      "Заголовок (Title)",      "Что показывается в поиске. «Массаж в СПб — студия Баланс»"],
          ["AlignLeft", "Описание (Description)", "1–2 предложения с выгодой и городом."],
          ["Hash",      "Ключевые слова",         "По каким запросам вас ищут."],
          ["Image",     "Иконка (favicon)",       "Маленькая картинка во вкладке браузера."],
        ] as [string,string,string][]).map(([ic, t, d]) => (
          <div key={t} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "hsl(215,80%,96%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <Icon name={ic} size={13} style={{ color: "hsl(215,80%,50%)" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{t}</div>
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{d}</div>
            </div>
          </div>
        ))}
        <Tip>SEO работает как на нашем сервере, так и при размещении на своём хостинге.</Tip>
      </>
    ),
  },
  {
    id: "privacy", icon: "ShieldCheck", title: "Политика конфиденциальности", color: "hsl(40,90%,45%)",
    content: () => (
      <>
        <P>Если есть форма заявки — по 152-ФЗ нужна Политика конфиденциальности.</P>
        <Step n="1" title="Откройте «Документы»">В панели редактора.</Step>
        <Step n="2" title="Заполните данные">Название, ИНН, адрес, email, домен.</Step>
        <Step n="3" title="Готово">Ссылка появится в футере под формой.</Step>
        <Tip>Без политики форма юридически уязвима. Заполните до публикации — бесплатно.</Tip>
        <H>При переезде на свой хостинг</H>
        <Li icon="Download">Страницу политики нужно разместить на хостинге отдельно.</Li>
        <Li icon="Link">Проверьте что ссылка в футере рабочая после переезда.</Li>
      </>
    ),
  },
  {
    id: "storage", icon: "Server", title: "Хранение, заявки и оплата", color: "hsl(280,60%,50%)",
    content: () => (
      <>
        <P>Сайт можно оставить у нас или скачать и разместить самостоятельно.</P>
        <H>На нашем сервере</H>
        <Grid2 items={[
          { label: "Хранение",       value: "2 ⚡ / день" },
          { label: "Каждая заявка", value: "3 ⚡" },
        ]} />
        <Li icon="Check">Заявки приходят на email автоматически</Li>
        <Li icon="Check">SEO и политика работают из коробки</Li>
        <H>На своём хостинге</H>
        <Li icon="Download">Скачайте HTML и разместите на своём домене.</Li>
        <Li icon="Wallet">Форму настроили сами — за заявки нам не платите.</Li>
        <H>Если удаляете сайт</H>
        <Li icon="Trash2">Удалили — все списания прекращаются.</Li>
        <Li icon="AlertTriangle">После удаления отредактировать его не получится.</Li>
        <Tip>Перед удалением скачайте HTML — останется копия.</Tip>
      </>
    ),
  },
  {
    id: "hosting", icon: "Cloud", title: "Где разместить лендинг", color: "hsl(145,60%,38%)",
    content: () => (
      <>
        <P>Готовый лендинг — один HTML-файл. Разместите на любом сервисе.</P>
        <H>Netlify Drop — бесплатно</H>
        <Step n="1" title="Зайдите на app.netlify.com/drop">Регистрация не нужна.</Step>
        <Step n="2" title="Скачайте HTML из конструктора">Кнопка «Скачать HTML».</Step>
        <Step n="3" title="Перетащите файл в браузер">Через 10 секунд сайт онлайн.</Step>
        <Tip>Адрес будет «abc.netlify.app». Для своего домена — нужен хостинг.</Tip>
        <H>Timeweb / Beget / REG.RU — от 99 ₽/мес</H>
        <Step n="1" title="Зарегистрируйтесь">Купите хостинг — минимальный тариф.</Step>
        <Step n="2" title="Купите домен">Обычно бесплатно в первый год.</Step>
        <Step n="3" title="Загрузите index.html">В папку public_html через файловый менеджер.</Step>
        <Step n="4" title="Подключите домен">DNS применяются за 1–24 часа.</Step>
      </>
    ),
  },
  {
    id: "domain", icon: "Globe", title: "Свой домен и хостинг", color: "hsl(215,80%,50%)",
    content: () => (
      <>
        <P>«massazh-spb.ru» вызывает доверие больше, чем «abc.netlify.app».</P>
        <Li>Доверие клиентов с первого взгляда</Li>
        <Li>Легко запомнить и продиктовать</Li>
        <Li>150–500 ₽ в год — окупается одним клиентом</Li>
        <Tip>«marafon-beauty.ru», «salon-lux-msk.ru» — хорошие примеры.</Tip>
        <H>Как подключить</H>
        <Step n="1" title="Купите домен">reg.ru, timeweb.com. 150–500 ₽/год.</Step>
        <Step n="2" title="Купите хостинг">От 99 ₽/мес.</Step>
        <Step n="3" title="Привяжите домен">NS-серверы хостинга в настройках домена.</Step>
        <Step n="4" title="Загрузите index.html">В папку public_html.</Step>
        <Step n="5" title="Подключите SSL">Бесплатно через Let's Encrypt в панели хостинга.</Step>
      </>
    ),
  },
];

// ── Элемент аккордеона ───────────────────────────────────────────────────────

function AccordionItem({
  section, isOpen, onToggle,
}: {
  section: typeof SECTIONS[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      borderRadius: 12,
      border: isOpen ? `1.5px solid ${section.color}45` : "1.5px solid #EEF0F4",
      background: "#fff",
      overflow: "hidden",
      transition: "box-shadow 0.2s, border-color 0.2s",
      boxShadow: isOpen ? `0 4px 20px ${section.color}16` : "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" as const }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: isOpen ? section.color : "#F1F5F9",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.18s",
        }}>
          <Icon name={section.icon} size={15} style={{ color: isOpen ? "#fff" : "#64748B" }} />
        </div>
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: isOpen ? "#0F172A" : "#374151", fontFamily: "Montserrat, sans-serif" }}>
          {section.title}
        </span>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: isOpen ? section.color : "#F1F5F9",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.18s",
        }}>
          <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={12} style={{ color: isOpen ? "#fff" : "#94A3B8" }} />
        </div>
      </button>

      {isOpen && (
        <div style={{ padding: "2px 16px 16px", borderTop: `1px solid ${section.color}20` }}>
          <div style={{ paddingTop: 12 }}>
            {section.content()}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Главный компонент ────────────────────────────────────────────────────────

export default function LkLandingGuide({ onClose }: { onClose: () => void }) {
  const [openId, setOpenId] = useState<string | null>("why");

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "80vh", fontFamily: "Montserrat, sans-serif" }}>
      <style>{`
        .guide-scroll::-webkit-scrollbar { width: 4px; }
        .guide-scroll::-webkit-scrollbar-track { background: transparent; }
        .guide-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>

      {/* Шапка */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="BookOpen" size={17} style={{ color: ACCENT }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>База знаний</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Конструктор лендингов</div>
        </div>
        <button onClick={onClose} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderRadius: 10, border: "none", background: ACCENT, color: "#fff",
          fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="Wand2" size={13} />
          Начать создание
        </button>
      </div>

      {/* Аккордеон */}
      <div className="guide-scroll" style={{ overflowY: "auto", flex: 1, paddingRight: 2 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {SECTIONS.map(s => (
            <AccordionItem
              key={s.id}
              section={s}
              isOpen={openId === s.id}
              onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            />
          ))}
        </div>

        <button onClick={onClose} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", marginTop: 12, marginBottom: 4,
          padding: "13px 20px", borderRadius: 12, border: "none",
          background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(185,85%,24%) 100%)`,
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 4px 16px ${ACCENT}44`,
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="Wand2" size={16} />
          Перейти к созданию лендинга
        </button>
      </div>
    </div>
  );
}
