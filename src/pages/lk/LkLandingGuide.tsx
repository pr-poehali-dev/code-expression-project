import { useState } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_LIGHT = "hsl(185,85%,96%)";

interface Section {
  id: string;
  icon: string;
  title: string;
  color: string;
  bg: string;
}

const SECTIONS: Section[] = [
  { id: "why", icon: "TrendingUp", title: "Зачем это и сколько стоит", color: "hsl(145,60%,38%)", bg: "hsl(145,60%,96%)" },
  { id: "process", icon: "Route", title: "Как создаётся лендинг", color: "hsl(215,80%,50%)", bg: "hsl(215,80%,96%)" },
  { id: "choose", icon: "LayoutTemplate", title: "Какой лендинг выбрать", color: "hsl(280,60%,50%)", bg: "hsl(280,60%,97%)" },
  { id: "before", icon: "Lightbulb", title: "Перед стартом — что подготовить", color: "hsl(40,90%,45%)", bg: "hsl(40,90%,96%)" },
  { id: "calc", icon: "Calculator", title: "Калькулятор стоимости", color: ACCENT, bg: ACCENT_LIGHT },
  { id: "budget", icon: "FileText", title: "Стандартный лендинг", color: "#64748B", bg: "#F1F5F9" },
  { id: "premium", icon: "Sparkles", title: "Премиальный лендинг", color: ACCENT, bg: ACCENT_LIGHT },
  { id: "tips", icon: "Wand2", title: "Как сделать красивый лендинг", color: "hsl(270,70%,50%)", bg: "hsl(270,70%,97%)" },
  { id: "video", icon: "Play", title: "Как добавить видео", color: "hsl(0,75%,50%)", bg: "hsl(0,75%,97%)" },
  { id: "map", icon: "MapPin", title: "Как добавить Яндекс-карту", color: "hsl(145,60%,38%)", bg: "hsl(145,60%,96%)" },
  { id: "seo", icon: "Search", title: "SEO: как вас находят в поиске", color: "hsl(215,80%,50%)", bg: "hsl(215,80%,96%)" },
  { id: "privacy", icon: "ShieldCheck", title: "Политика конфиденциальности", color: "hsl(40,90%,45%)", bg: "hsl(40,90%,96%)" },
  { id: "storage", icon: "Server", title: "Хранение, заявки и оплата", color: "hsl(280,60%,50%)", bg: "hsl(280,60%,97%)" },
  { id: "hosting", icon: "Cloud", title: "Где разместить лендинг", color: "hsl(145,60%,38%)", bg: "hsl(145,60%,96%)" },
  { id: "domain", icon: "Globe", title: "Свой домен и хостинг", color: "hsl(215,80%,50%)", bg: "hsl(215,80%,96%)" },
];

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8ECF0", padding: "20px 22px", marginBottom: 12 }}>
      {children}
    </div>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{children}</div>;
}

function P({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.75, marginBottom: 8 }}>{children}</div>;
}

function Li({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <Icon name={icon || "Check"} size={10} style={{ color: ACCENT }} />
      </div>
      <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,82%)", borderRadius: 10, padding: "10px 14px", marginTop: 10 }}>
      <Icon name="Lightbulb" size={15} style={{ color: "hsl(40,90%,45%)", flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 12, color: "hsl(30,60%,35%)", lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{n}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "3px 9px", borderRadius: 20, marginLeft: 8 }}>{label}</span>;
}

// ── Контент секций ──

function SectionWhy() {
  return (
    <>
      {/* Hero-блок с главным посылом */}
      <div style={{ background: "linear-gradient(135deg, hsl(185,85%,28%) 0%, hsl(185,85%,18%) 100%)", borderRadius: 16, padding: "28px 24px", marginBottom: 12, color: "#fff" }}>
        <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3, marginBottom: 10 }}>
          Лендинг за часы — без дизайнера, без верстальщика, без ожидания
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.75, opacity: 0.9 }}>
          Раньше создание сайта было долгим, дорогим и зависело от чужих людей. Теперь вы сами — и автор, и заказчик, и приёмщик работы. ИИ делает всё техническое, вы управляете смыслом.
        </div>
      </div>

      {/* Сравнение с рынком */}
      <Block>
        <H3>💸 Сколько это стоит на рынке без нас</H3>
        <div className="guide-compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ background: "#FEF2F2", borderRadius: 12, padding: "14px 16px", border: "1px solid #FECACA" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Стандартный лендинг</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>от 25 000 ₽</div>
            <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>Дизайнер + верстальщик + правки + ожидание 2–4 недели</div>
          </div>
          <div style={{ background: "#FEF2F2", borderRadius: 12, padding: "14px 16px", border: "1px solid #FECACA" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Премиальный лендинг</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>от 100 000 ₽</div>
            <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>Студия + проект + итерации + согласования 4–8 недель</div>
          </div>
        </div>
        <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "14px 16px", border: "1px solid #BBF7D0" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 6 }}>✦ С конструктором Промт Диалог</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
            <div>
              <div style={{ fontSize: 11, color: "#166534", marginBottom: 2 }}>Стандартный</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#166534" }}>в десятки раз дешевле</div>
            </div>
            <div style={{ width: 1, background: "#BBF7D0" }} />
            <div>
              <div style={{ fontSize: 11, color: "#166534", marginBottom: 2 }}>Премиальный</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#166534" }}>в сотни раз дешевле</div>
            </div>
          </div>
        </div>
      </Block>

      {/* Что такое энергия */}
      <Block>
        <H3>⚡ Что такое энергия и как она списывается</H3>
        <P>Энергия — это универсальная «валюта» платформы Промт Диалог. Она списывается за работу ИИ: чем сложнее задача, тем больше энергии уходит. Общение в чате — бесплатно, платите только за результат.</P>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, margin: "12px 0" }}>
          {[
            { icon: "MessageCircle", label: "Диалог и советы ИИ", desc: "бесплатно — собираем данные о бизнесе без списаний", color: "hsl(145,60%,38%)", bg: "hsl(145,60%,96%)" },
            { icon: "Wand2", label: "Генерация лендинга", desc: "основная часть расходов — ИИ создаёт полноценный сайт", color: ACCENT, bg: ACCENT_LIGHT },
            { icon: "Sparkles", label: "Правки и пересоздание", desc: "недорого — меняем элементы по вашему запросу", color: "hsl(270,70%,50%)", bg: "hsl(270,70%,97%)" },
            { icon: "Server", label: "Хранение и заявки", desc: "если сайт на нашем сервере: 2 ⚡/день + 3 ⚡ за заявку", color: "hsl(40,90%,45%)", bg: "hsl(40,90%,96%)" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: item.bg, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={item.icon} size={15} style={{ color: "#fff" }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <P>Пополнить баланс энергии можно в разделе <strong>«Энергия»</strong> личного кабинета в любой момент.</P>
      </Block>

      {/* Преимущества */}
      <Block>
        <H3>✦ Почему это лучше, чем заказывать у дизайнера</H3>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {[
            {
              icon: "Clock",
              title: "Скорость",
              text: "Лендинг готов за 15–60 минут. Не нужно ждать дизайнера неделями, объяснять правки и проходить бесконечные согласования.",
            },
            {
              icon: "Heart",
              title: "Вы чувствуете свой бизнес лучше любого дизайнера",
              text: "Никто не знает вашу аудиторию, ваши услуги и ваш стиль лучше вас самих. Конструктор даёт вам инструмент — вы направляете.",
            },
            {
              icon: "Repeat",
              title: "Мгновенные правки",
              text: "Захотели поменять текст, цвет, добавить блок — одно сообщение ИИ, и лендинг уже другой. У дизайнера это — новый счёт.",
            },
            {
              icon: "Eye",
              title: "Вы видите результат сразу",
              text: "Никаких макетов, презентаций и «посмотрите на мой творческий замысел». Что сгенерировалось — то и есть готовый сайт.",
            },
            {
              icon: "Shield",
              title: "Полный контроль",
              text: "HTML-файл у вас на руках. Вы не зависите от подрядчика, его графика, настроения и прайса на следующий год.",
            },
            {
              icon: "Zap",
              title: "Без технических знаний",
              text: "Не нужно знать HTML, CSS, Figma или WordPress. Просто расскажите о бизнесе — ИИ сделает всё остальное.",
            },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E8ECF0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Icon name={item.icon} size={17} style={{ color: ACCENT }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.65 }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* Итог */}
      <div style={{ background: "linear-gradient(135deg, hsl(40,90%,97%) 0%, hsl(40,90%,93%) 100%)", borderRadius: 14, border: "1px solid hsl(40,90%,82%)", padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="Lightbulb" size={18} style={{ color: "hsl(40,90%,45%)", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 4 }}>Главное, что нужно понять</div>
            <div style={{ fontSize: 13, color: "#78350F", lineHeight: 1.7 }}>
              Конструктор лендингов — это не «дешёвый заменитель». Это другой подход: быстрый, честный и направленный именно на ваш результат. Вы не покупаете чьё-то видение — вы создаёте своё.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionBefore() {
  return (
    <>
      <P>Перед тем как начать общение с ИИ, подготовьте информацию о бизнесе — чем больше деталей, тем точнее и красивее получится результат.</P>

      <Block>
        <H3>📋 Базовый список (обязательно)</H3>
        <Li>Название компании или бренда</Li>
        <Li>Чем занимаетесь — 3–5 услуг или товаров с кратким описанием</Li>
        <Li>Главное преимущество: почему выбирают именно вас, а не конкурентов</Li>
        <Li>Контакты: телефон и/или email для связи</Li>
        <Li>Город или регион работы (если важно)</Li>
        <Tip>Без этих данных ИИ не сможет создать полноценный лендинг — он будет просить их в чате по одному.</Tip>
      </Block>

      <Block>
        <H3>⭐ Дополнительно (для лучшего результата)</H3>
        <Li>Диапазон цен или стоимость основных услуг</Li>
        <Li>Акция или спецпредложение для новых клиентов</Li>
        <Li>Ссылки на соцсети: ВКонтакте, Instagram, Telegram</Li>
        <Li>Несколько реальных отзывов от клиентов (имя + текст)</Li>
        <Li>Факты о компании: сколько лет работаете, сколько клиентов, специалистов</Li>
      </Block>

      <Block>
        <H3>🖼 Фотографии (для замены заглушек)</H3>
        <P>ИИ создаст лендинг с серыми заглушками в местах фото. После генерации вы сможете заменить их своими фотографиями прямо в редакторе — кликнув на картинку.</P>
        <Li>Фото команды или рабочего процесса</Li>
        <Li>Фото результатов работы (до/после)</Li>
        <Li>Фото помещения, продуктов, интерьера</Li>
        <Tip>Оптимальный размер фото для лендинга: 1200×800 px и выше. Тёмные или размытые фото ухудшают восприятие.</Tip>
      </Block>
    </>
  );
}

function SectionBudget() {
  return (
    <>
      <P>Стандартный лендинг — быстрый и понятный. Подходит для большинства бизнесов, которым нужно просто и чисто представить себя в интернете.</P>

      <Block>
        <H3>Что входит в структуру</H3>
        <Li icon="Layout">Шапка: логотип/название + кнопка «Позвонить» или «Оставить заявку»</Li>
        <Li icon="Star">Hero-блок: главный заголовок, подзаголовок, кнопка действия</Li>
        <Li icon="Grid">Услуги: карточки с описанием (3–5 услуг)</Li>
        <Li icon="ThumbsUp">Преимущества: 3 причины выбрать вас</Li>
        <Li icon="Mail">Контакты: форма + телефон/email</Li>
        <Li icon="AlignCenter">Футер: копирайт</Li>
      </Block>

      <Block>
        <H3>Особенности стандартного</H3>
        <Li>Без навигационного меню — пользователь просто скроллит</Li>
        <Li>Один акцентный цвет, подобранный под тематику бизнеса</Li>
        <Li>Минималистичный дизайн: много воздуха, никаких лишних деталей</Li>
        <Li>Без анимаций — быстро загружается даже на слабом интернете</Li>
        <Li>Один шрифт Inter на всей странице</Li>
      </Block>

      <Block>
        <H3>Кому подходит</H3>
        <Li icon="Check">Малый бизнес с ограниченным бюджетом</Li>
        <Li icon="Check">Быстрый старт — нужно «просто быть в интернете»</Li>
        <Li icon="Check">Одна услуга или небольшой ассортимент</Li>
        <Li icon="Check">Акция или событие, где важна скорость</Li>
      </Block>
    </>
  );
}

function SectionPremium() {
  return (
    <>
      <P>Премиальный лендинг — это полноценный сайт-визитка уровня дорогого агентства. Уникальный дизайн, продуманная структура, навигация и анимации.</P>

      <Block>
        <H3>Что входит в структуру</H3>
        <Li icon="Layout">Фиксированный хедер: логотип + навигация + CTA. На мобильном — гамбургер-меню</Li>
        <Li icon="Star">Hero-блок полный экран: мощный заголовок, 2 кнопки, декоративный элемент</Li>
        <Li icon="Info">О компании: фото + текст + цифры-достижения</Li>
        <Li icon="Grid">Услуги: карточки с hover-эффектами и SVG-иконками</Li>
        <Li icon="Award">Кейсы/преимущества: пронумерованные блоки с акцентом</Li>
        <Li icon="MessageCircle">Отзывы клиентов: карточки с кавычками и именами</Li>
        <Li icon="Mail">Контакты: форма + контакты + соцсети, тёмный фон</Li>
        <Li icon="AlignCenter">Футер: логотип + навигация + копирайт</Li>
      </Block>

      <Block>
        <H3>Дизайн-особенности</H3>
        <Li>Единая цветовая палитра через CSS-переменные — всё в одном стиле</Li>
        <Li>Монохромные SVG-иконки в цвет акцента, без разношерстных эмодзи</Li>
        <Li>Градиентные фоны, волны и диагонали между секциями</Li>
        <Li>Два шрифта: Playfair Display для заголовков + Montserrat для текста</Li>
        <Li>Плавные анимации появления блоков при загрузке</Li>
        <Li>Асимметричные секции — контент то слева, то справа</Li>
      </Block>

      <Block>
        <H3>Кому подходит</H3>
        <Li icon="Check">Бизнес, которому важен имидж и первое впечатление</Li>
        <Li icon="Check">Продажа дорогих услуг — цена лендинга должна соответствовать цене продукта</Li>
        <Li icon="Check">Несколько услуг с нюансами, которые важно объяснить</Li>
        <Li icon="Check">Есть фото, отзывы, факты о компании</Li>
        <Tip>Чем больше реальных данных вы дадите ИИ — отзывы, цифры, описание команды — тем убедительнее получится лендинг.</Tip>
      </Block>
    </>
  );
}

function SectionTips() {
  return (
    <>
      <P>Лендинг генерирует ИИ, но качество результата на 50% зависит от того, что вы ему расскажете. Вот главные правила.</P>

      <Block>
        <H3>Правило 1: конкретика вместо общих слов</H3>
        <P>❌ «Мы профессиональная компания с высоким качеством»</P>
        <P>✅ «Студия массажа "Баланс", 8 лет работы, 2400 клиентов, Москва, Арбат»</P>
        <Tip>ИИ не может придумать реальные факты — он использует только то, что вы ему дали. Чем точнее данные, тем убедительнее текст.</Tip>
      </Block>

      <Block>
        <H3>Правило 2: опишите клиента, а не себя</H3>
        <P>Хороший лендинг говорит не «мы крутые», а «вы получите вот это». Расскажите ИИ: кто ваш клиент, какую проблему он решает, что получит в результате.</P>
        <Li>«Клиенты — женщины 30–50 лет, хотят избавиться от хронической боли в спине»</Li>
        <Li>«После курса 5 сеансов — уходит напряжение, улучшается сон, нет боли»</Li>
      </Block>

      <Block>
        <H3>Правило 3: используйте ИИ-доработку</H3>
        <P>После генерации нажмите «ИИ-доработка» и попросите улучшить конкретные блоки:</P>
        <Li>«Сделай заголовок более эмоциональным»</Li>
        <Li>«Перепиши раздел услуг — добавь цены»</Li>
        <Li>«Добавь раздел FAQ с 5 вопросами»</Li>
        <Li>«Поменяй цвет акцента на тёмно-синий»</Li>
      </Block>

      <Block>
        <H3>Правило 4: замените заглушки реальными фото</H3>
        <P>Это самое мощное улучшение. Нажмите «Редактировать», кликните на серую заглушку — и загрузите своё фото. Реальные фото увеличивают доверие к сайту в разы.</P>
        <Tip>Лучшие фото для лендинга: процесс работы, команда, результат до/после, помещение в хорошем освещении.</Tip>
      </Block>

      <Block>
        <H3>Правило 5: один призыв к действию</H3>
        <P>Не перегружайте лендинг кнопками «Позвонить», «Написать», «Записаться», «Узнать цену» — всё сразу. Выберите одно главное действие и повторите его 2–3 раза на странице.</P>
      </Block>
    </>
  );
}

function SectionHosting() {
  return (
    <>
      <P>Готовый лендинг — это один HTML-файл. Его можно разместить на любом хостинге или бесплатном сервисе. Вот ваши варианты от простого к профессиональному.</P>

      <Block>
        <H3>
          Вариант 1 — Netlify Drop
          <Badge label="Бесплатно" color="hsl(145,60%,38%)" bg="hsl(145,60%,96%)" />
        </H3>
        <Step n="1" title="Зайдите на сайт app.netlify.com/drop">Регистрация не нужна — просто откройте сайт в браузере.</Step>
        <Step n="2" title="Скачайте HTML-файл из конструктора">Нажмите кнопку «Скачать HTML» в конструкторе лендингов.</Step>
        <Step n="3" title="Перетащите файл в браузер">Прямо в окно Netlify Drop — и через 10 секунд сайт онлайн.</Step>
        <Step n="4" title="Получите ссылку вида random-name.netlify.app">Её можно сразу давать клиентам или отправлять в мессенджере.</Step>
        <Tip>Минус: адрес сайта будет выглядеть как «abc123.netlify.app». Для своего домена нужен платный план или другой вариант.</Tip>
      </Block>

      <Block>
        <H3>
          Вариант 2 — GitHub Pages
          <Badge label="Бесплатно" color="hsl(145,60%,38%)" bg="hsl(145,60%,96%)" />
        </H3>
        <P>Подходит для тех, кто немного знаком с технологиями. Даёт бесплатный адрес вида «yourusername.github.io».</P>
        <Step n="1" title="Зарегистрируйтесь на github.com">Бесплатно, нужен только email.</Step>
        <Step n="2" title="Создайте новый репозиторий">Название: «yourusername.github.io» — это станет вашим адресом сайта.</Step>
        <Step n="3" title="Загрузите HTML-файл">Переименуйте файл в «index.html» и загрузите в репозиторий.</Step>
        <Step n="4" title="Включите GitHub Pages">Settings → Pages → Source: main branch. Сайт появится через 1–2 минуты.</Step>
      </Block>

      <Block>
        <H3>
          Вариант 3 — Timeweb / Beget / REG.RU
          <Badge label="От 99 ₽/мес" color="hsl(215,80%,50%)" bg="hsl(215,80%,96%)" />
        </H3>
        <P>Российские хостинги. Плюс — можно сразу подключить свой домен (.ru, .рф, .com).</P>
        <Step n="1" title="Зарегистрируйтесь и купите хостинг">Тариф «Бизнес» или «Старт» — хватит для одного лендинга.</Step>
        <Step n="2" title="Купите домен">При заказе хостинга обычно предлагают домен бесплатно в первый год.</Step>
        <Step n="3" title="Загрузите файл через FTP или файловый менеджер">Переименуйте в «index.html» и загрузите в папку «public_html» или «www».</Step>
        <Step n="4" title="Подключите домен к хостингу">Настройки DNS обычно применяются за 1–24 часа.</Step>
      </Block>
    </>
  );
}

function SectionDomain() {
  return (
    <>
      <P>Свой домен — это профессионально и серьёзно. Клиент, который видит «massazh-spb.ru», доверяет больше, чем тому, кто даёт ссылку «abc.netlify.app».</P>

      <Block>
        <H3>Что такое домен и зачем он нужен</H3>
        <P>Домен — это адрес вашего сайта в интернете. Например: <strong>massage-spb.ru</strong> или <strong>beauty-salon.рф</strong>.</P>
        <Li>Вызывает доверие у клиентов</Li>
        <Li>Легко запомнить и продиктовать</Li>
        <Li>Можно использовать для корпоративной почты (info@ваш-домен.ru)</Li>
        <Li>Стоит 150–500 ₽ в год — окупается одним клиентом</Li>
      </Block>

      <Block>
        <H3>Как выбрать хорошее доменное имя</H3>
        <Li>Короткое — не более 15 символов</Li>
        <Li>Легко произнести вслух и написать без ошибок</Li>
        <Li>Отражает суть бизнеса: название или вид услуги + город</Li>
        <Li>Лучше .ru для российской аудитории, .рф для локального бизнеса</Li>
        <Tip>Примеры хороших имён: «marafon-beauty.ru», «salon-lux-msk.ru», «массаж-питер.рф». Избегайте дефисов в конце и цифр без смысла.</Tip>
      </Block>

      <Block>
        <H3>Полная схема: домен + хостинг + лендинг</H3>
        <Step n="1" title="Купите домен">На reg.ru, nic.ru или timeweb.com. Цена: 150–500 ₽/год.</Step>
        <Step n="2" title="Купите хостинг">Там же или на beget.com. Минимальный тариф — от 99 ₽/мес.</Step>
        <Step n="3" title="Привяжите домен к хостингу">В настройках домена укажите NS-серверы хостинга (они дают при регистрации).</Step>
        <Step n="4" title="Загрузите index.html на хостинг">Через файловый менеджер в личном кабинете хостинга — в папку public_html.</Step>
        <Step n="5" title="Подождите 1–24 часа">DNS-записи применяются не мгновенно. После этого сайт доступен по вашему домену.</Step>
        <Step n="6" title="Подключите SSL-сертификат (HTTPS)">Обычно это бесплатно на любом хостинге — Let's Encrypt. Без SSL браузеры помечают сайт как «ненадёжный».</Step>
        <Tip>Совет: купите домен и хостинг в одном месте (например, Timeweb или Beget) — тогда привязка домена происходит автоматически, без настройки DNS вручную.</Tip>
      </Block>

      <Block>
        <H3>Сравнение вариантов размещения</H3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Вариант", "Цена", "Свой домен", "Сложность", "Для кого"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: "#475569", borderBottom: "1px solid #E8ECF0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Netlify Drop", "Бесплатно", "❌", "Легко", "Попробовать быстро"],
                ["GitHub Pages", "Бесплатно", "⚠️ частично", "Средне", "Разработчики"],
                ["Timeweb / Beget", "от 99 ₽/мес", "✅", "Средне", "Малый бизнес"],
                ["REG.RU", "от 149 ₽/мес", "✅", "Средне", "Малый бизнес"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "8px 12px", color: j === 0 ? "#0F172A" : "#64748B", fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>
    </>
  );
}

function SectionProcess() {
  return (
    <>
      <P>Создание лендинга — это простой диалог. Вы рассказываете о бизнесе обычными словами, а ИИ собирает из этого готовый сайт. Вот весь путь по шагам.</P>

      <Block>
        <H3>Полный путь от идеи до готового сайта</H3>
        <Step n="1" title="Выберите тип лендинга">Под вашу задачу: услуги, продажа товара, мероприятие, ресторан, недвижимость и т.д. Если не уверены — выберите «Доверяю ИИ», и структуру подберут автоматически.</Step>
        <Step n="2" title="Расскажите о бизнесе в чате">ИИ задаёт вопросы — отвечайте простыми словами. Чат и общение с ИИ <b>бесплатны</b>, платите только за результат.</Step>
        <Step n="3" title="Нажмите «Создать лендинг»">ИИ подбирает дизайн и собирает сайт по блокам. Это занимает 1–3 минуты.</Step>
        <Step n="4" title="Отредактируйте под себя">Кликните на любой элемент — фото, текст, кнопку — и опишите правку. ИИ всё сделает. Можно загрузить свои фото, вставить видео и карту.</Step>
        <Step n="5" title="Настройте SEO и документы">Заполните заголовок, описание для поиска и политику конфиденциальности — это важно для публикации.</Step>
        <Step n="6" title="Опубликуйте">Оставьте сайт на нашем сервере (с заявками на почту) или скачайте HTML и разместите на своём хостинге/домене.</Step>
      </Block>

      <Block>
        <H3>Как работает редактор</H3>
        <Li icon="MousePointerClick">Наведите на элемент — он подсветится. Кликните — выделится.</Li>
        <Li icon="MessageCircle">Внизу появится поле — напишите что изменить простыми словами.</Li>
        <Li icon="RefreshCw">Кнопка «Сделать блок заново» — полностью пересоздаёт блок в новом виде.</Li>
        <Li icon="Undo2">Кнопка «Отменить» — откатывает последнее изменение, если результат не понравился.</Li>
        <Tip>Не бойтесь экспериментировать: правки дешёвые, а откат бесплатный. Пробуйте разные варианты, пока не понравится.</Tip>
      </Block>
    </>
  );
}

function SectionChoose() {
  const types = [
    { t: "Классический / Услуги", d: "Салоны, мастера, студии, локальный бизнес", e: "Шапка, услуги, отзывы, контакты" },
    { t: "Продающий (Sales)", d: "Один продукт или услуга с акцентом на заявку", e: "Выгоды, как работаем, цены, FAQ" },
    { t: "Сторителлинг", d: "Когда важно «зацепить» эмоцией и историей", e: "Боль клиента → решение → доверие" },
    { t: "Портфолио", d: "Фотографы, дизайнеры, бьюти-мастера", e: "Галерея работ + услуги" },
    { t: "B2B", d: "Услуги для бизнеса, агентства", e: "Кейсы, клиенты, команда" },
    { t: "Мероприятие", d: "Курсы, конференции, вебинары", e: "Программа, спикеры, билеты" },
    { t: "Ресторан / Кафе", d: "Заведения общепита", e: "Меню, акции, бронирование" },
    { t: "Недвижимость", d: "Продажа объектов и ЖК", e: "Об объекте, район, планировки" },
    { t: "Товар (Product)", d: "Интернет-магазин одного товара", e: "Выгоды, отзывы, заказ" },
  ];
  return (
    <>
      <P>Тип лендинга задаёт структуру и набор блоков. Не переживайте: после генерации любой блок можно убрать, добавить или переделать.</P>
      <Block>
        <H3>Какой выбрать под задачу</H3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {types.map(x => (
            <div key={x.t} style={{ background: "#F8FAFC", border: "1px solid #E8ECF0", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{x.t}</div>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>{x.d}</div>
              <div style={{ fontSize: 11.5, color: ACCENT, fontWeight: 600 }}>Блоки: {x.e}</div>
            </div>
          ))}
        </div>
        <Tip>Не уверены? Выберите режим «Доверяю ИИ» — он сам проанализирует ваш бизнес и подберёт оптимальный набор блоков.</Tip>
      </Block>
    </>
  );
}

function SectionCalc() {
  const [blocks, setBlocks] = useState(6);
  const [edits, setEdits] = useState(3);
  const [regens, setRegens] = useState(1);
  const STYLE = 70, BLOCK = 90, EDIT = 24, REGEN = 45;
  const total = STYLE + blocks * BLOCK + edits * EDIT + regens * REGEN;
  const Row = ({ label, value, setValue, min, max }: { label: string; value: number; setValue: (n: number) => void; min: number; max: number }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
      <span style={{ fontSize: 13, color: "#475569", flex: 1 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setValue(Math.max(min, value - 1))} style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: 16, color: "#64748B", lineHeight: 1 }}>−</button>
        <span style={{ width: 24, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{value}</span>
        <button onClick={() => setValue(Math.min(max, value + 1))} style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", fontSize: 16, color: "#64748B", lineHeight: 1 }}>+</button>
      </div>
    </div>
  );
  return (
    <>
      <P>Прикиньте, сколько энергии примерно уйдёт на ваш сайт. Двигайте значения — итог пересчитается. Цифры ориентировочные.</P>
      <Block>
        <H3>Соберите свой лендинг</H3>
        <Row label="Сколько блоков на сайте" value={blocks} setValue={setBlocks} min={3} max={12} />
        <Row label="Мелкие правки через ИИ" value={edits} setValue={setEdits} min={0} max={30} />
        <Row label="Пересоздать блоков заново" value={regens} setValue={setRegens} min={0} max={10} />
        <div style={{ marginTop: 16, background: "linear-gradient(135deg, hsl(185,85%,28%), hsl(185,85%,18%))", borderRadius: 14, padding: "18px 20px", color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Примерно потребуется</div>
          <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>≈ {total} ⚡</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 8 }}>дизайн ({STYLE}) + блоки ({blocks}×{BLOCK}) + правки ({edits}×{EDIT}) + пересоздание ({regens}×{REGEN})</div>
        </div>
        <Tip>Чат с ИИ, советы и отмена изменений — бесплатны. Точная сумма зависит от того, сколько правок понадобится именно вам.</Tip>
      </Block>
    </>
  );
}

function SectionVideo() {
  return (
    <>
      <P>На лендинг можно вставить видео из популярных сервисов. В редакторе откройте блок → раздел «Видео» → вставьте ссылку.</P>
      <Block>
        <H3>Откуда можно вставить видео</H3>
        <Li icon="Play"><b>Кинескоп</b> (kinescope.io) — рекомендуем для России, видео грузится быстро</Li>
        <Li icon="Play"><b>VK Видео</b> — ссылки вида vk.com/video-123_456 или vkvideo.ru</Li>
        <Li icon="Play"><b>YouTube</b> — обычная ссылка на ролик или Shorts</Li>
        <Li icon="Play"><b>Rutube</b> — ссылка на видео</Li>
        <Li icon="Play"><b>Яндекс.Диск</b> — ссылка на загруженный видеофайл</Li>
      </Block>
      <Block>
        <H3>Как вставить — по шагам</H3>
        <Step n="1" title="Скопируйте ссылку на видео">Из адресной строки или кнопкой «Поделиться» в плеере сервиса.</Step>
        <Step n="2" title="Откройте блок в редакторе">Нажмите на иконку «Фото/Видео» у нужного блока.</Step>
        <Step n="3" title="Вставьте ссылку в поле «Видео» и нажмите ▶">Видео автоматически встроится в блок — проверьте в превью.</Step>
        <Tip>Если видео из Яндекс.Диска не показывается — сервис иногда блокирует встраивание. Надёжнее всего работает Кинескоп и VK Видео.</Tip>
      </Block>
    </>
  );
}

function SectionMap() {
  return (
    <>
      <P>Если у вас есть физический адрес — добавьте Яндекс-карту, чтобы клиенты сразу видели, где вы находитесь. Это повышает доверие.</P>
      <Block>
        <H3>Как добавить карту</H3>
        <Step n="1" title="Откройте блок «Контакты»">Карта добавляется именно в контактный блок.</Step>
        <Step n="2" title="Найдите поле «Яндекс-карта»">Введите адрес как обычно: «г. Москва, ул. Пример, 1».</Step>
        <Step n="3" title="Нажмите кнопку с иконкой карты">Карта встроится автоматически — Яндекс сам найдёт точку по адресу.</Step>
        <Step n="4" title="Проверьте в превью">Если точка встала неточно — уточните адрес (добавьте город, район).</Step>
        <Tip>Карта работает без API-ключей и настроек. Чтобы убрать карту — рядом есть кнопка удаления.</Tip>
      </Block>
    </>
  );
}

function SectionSeo() {
  return (
    <>
      <P>SEO — это то, как вас находят в Яндексе и Google. Без настройки SEO сайт есть, но в поиске его почти не видно. Заполнить — 5 минут.</P>
      <Block>
        <H3>Что заполнить в разделе SEO</H3>
        <Li icon="Type"><b>Заголовок (Title)</b> — что показывается в вкладке браузера и в результатах поиска. Пример: «Массаж в СПб — студия Баланс, запись онлайн»</Li>
        <Li icon="AlignLeft"><b>Описание (Description)</b> — короткий текст под заголовком в поиске. 1–2 предложения с выгодой и городом.</Li>
        <Li icon="Hash"><b>Ключевые слова</b> — по каким запросам вас ищут: «массаж спб», «лечебный массаж недорого».</Li>
        <Li icon="Image"><b>Иконка сайта (favicon)</b> — маленькая картинка во вкладке браузера.</Li>
      </Block>
      <Block>
        <H3>Зачем это нужно</H3>
        <Li>Сайт начинает появляться в результатах поиска по вашим услугам</Li>
        <Li>Красивый заголовок и описание повышают кликабельность</Li>
        <Li>Можно подключить Яндекс.Метрику — видеть, сколько людей заходит</Li>
        <Tip>Настройки SEO встраиваются прямо в сайт — они работают и при размещении на нашем сервере, и при скачивании на свой хостинг.</Tip>
      </Block>
    </>
  );
}

function SectionPrivacy() {
  return (
    <>
      <P>Если на сайте есть форма заявки (а она почти всегда есть), по закону нужна <b>Политика конфиденциальности</b> — иначе сбор телефонов и имён нарушает 152-ФЗ «О персональных данных».</P>
      <Block>
        <H3>Как настроить</H3>
        <Step n="1" title="Откройте раздел «Документы»">В панели редактора лендинга.</Step>
        <Step n="2" title="Заполните данные организации">Название, ИНН/ОГРН, адрес, email, домен — часть подтянется автоматически из профиля.</Step>
        <Step n="3" title="Готово — ссылка появится в футере">Под формой и в подвале сайта появится кликабельная ссылка на политику.</Step>
        <Tip>Без заполненной политики форма заявки юридически уязвима. Заполните до публикации — это бесплатно.</Tip>
      </Block>
      <Block>
        <H3>Важно при размещении на своём хостинге</H3>
        <Li icon="AlertTriangle">Если сайт работает у нас на сервере — политика показывается автоматически.</Li>
        <Li icon="Download">Если вы скачали сайт и удалили его с нашего сервера — страницу политики придётся разместить на вашем хостинге отдельным файлом.</Li>
        <Li icon="Link">Проверьте, что ссылка на политику в футере ведёт на рабочую страницу после переезда.</Li>
      </Block>
    </>
  );
}

function SectionStorage() {
  return (
    <>
      <P>Готовый сайт можно либо оставить у нас (мы храним его и принимаем заявки), либо забрать к себе на хостинг. Разберём оба варианта и оплату.</P>

      <Block>
        <H3>Вариант А — сайт на нашем сервере</H3>
        <Li icon="Server"><b>Хранение сайта — 2 ⚡ в день</b> за каждый лендинг. Это плата за сервер, домен-ссылку и работу сайта 24/7.</Li>
        <Li icon="Mail"><b>Каждая заявка с формы — 3 ⚡</b>. Мы принимаем заявку и отправляем её вам на почту автоматически.</Li>
        <Li icon="Check">Плюсы: ничего не нужно настраивать, заявки приходят на email сразу, политика и SEO работают из коробки.</Li>
      </Block>

      <Block>
        <H3>Вариант Б — сайт на вашем хостинге</H3>
        <Li icon="Download">Скачайте HTML и разместите на своём хостинге или домене.</Li>
        <Li icon="Wallet"><b>Если форму заявки настраиваете сами</b> (на свою почту/CRM) — за заявки нашему сервису платить не нужно.</Li>
        <Li icon="ShieldCheck">Не забудьте перенести страницу политики конфиденциальности — она нужна на вашем хостинге отдельно.</Li>
      </Block>

      <Block>
        <H3>Если сайт больше не нужен</H3>
        <Li icon="Trash2">Удалите сайт — за него перестанут списывать энергию (ни за хранение, ни за заявки).</Li>
        <Li icon="AlertTriangle"><b>Важно:</b> после удаления отредактировать этот сайт в конструкторе уже не получится — он удаляется полностью.</Li>
        <Tip>Совет: перед удалением скачайте HTML-файл, чтобы у вас осталась копия сайта на всякий случай.</Tip>
      </Block>
    </>
  );
}

export default function LkLandingGuide({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState("why");

  const contentMap: Record<string, React.ReactNode> = {
    why: <SectionWhy />,
    process: <SectionProcess />,
    choose: <SectionChoose />,
    before: <SectionBefore />,
    calc: <SectionCalc />,
    budget: <SectionBudget />,
    premium: <SectionPremium />,
    tips: <SectionTips />,
    video: <SectionVideo />,
    map: <SectionMap />,
    seo: <SectionSeo />,
    privacy: <SectionPrivacy />,
    storage: <SectionStorage />,
    hosting: <SectionHosting />,
    domain: <SectionDomain />,
  };

  const active = SECTIONS.find(s => s.id === activeSection)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Шапка */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="BookOpen" size={20} style={{ color: ACCENT }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>База знаний</div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>Конструктор лендингов</div>
        </div>
        <button
          onClick={onClose}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}
        >
          <Icon name="ArrowRight" size={13} />
          <span className="guide-btn-text">Начать создание</span>
        </button>
      </div>

      {/* Навигация по разделам — горизонтальный скролл на мобильном */}
      <div style={{ overflowX: "auto", marginLeft: -2, marginRight: -2, paddingLeft: 2, paddingRight: 2, paddingBottom: 4 } as React.CSSProperties}>
        <div style={{ display: "flex", gap: 7, width: "max-content" }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "7px 13px", borderRadius: 20,
                border: activeSection === s.id ? "none" : "1px solid #E2E8F0",
                background: activeSection === s.id ? s.color : "#fff",
                color: activeSection === s.id ? "#fff" : "#555",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "Montserrat,sans-serif", transition: "all 0.15s",
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              <Icon name={s.icon} size={12} />
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Заголовок активного раздела */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: active.bg, borderRadius: 12, border: `1px solid ${active.color}20` }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: active.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={active.icon} size={16} style={{ color: "#fff" }} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{active.title}</div>
      </div>

      {/* Контент */}
      <div>
        {contentMap[activeSection]}
      </div>

      {/* Кнопка внизу — полная ширина на мобильном */}
      <div style={{ paddingTop: 4 }}>
        <button
          onClick={onClose}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px 24px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${ACCENT} 0%, hsl(185,85%,26%) 100%)`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: `0 4px 16px ${ACCENT}44` }}
        >
          <Icon name="Wand2" size={18} />
          Перейти к созданию лендинга
        </button>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .guide-btn-text { display: none; }
        }
        @media (max-width: 420px) {
          .guide-compare-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}