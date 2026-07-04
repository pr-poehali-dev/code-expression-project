export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_LIGHT = "hsl(185,85%,95%)";
export const REP_AI_URL = "https://functions.poehali.dev/5659445e-489a-411e-9e90-4bb21904624d";
export const REP_MAIL_URL = "https://functions.poehali.dev/df48bb51-d4fb-4584-b725-423c7c731624";
export const REP_MAIL_LOG_URL = "https://functions.poehali.dev/cdcaf8a7-9722-468f-8220-288a1f3998a0";
export const REP_CONTACTS_URL = "https://functions.poehali.dev/689b6bbd-c1aa-4515-8df2-3c3d3284884b";
export const SITE = "https://promtdialog.ru";

export interface Message { role: "user" | "assistant"; content: string; }

export const SALON_TARIFFS = [
  {
    name: "Стандарт",
    price: "190 000 ₽",
    period: "6 месяцев · до 5 сотрудников",
    url: `${SITE}/dlya-salonov`,
    color: "hsl(185,85%,32%)",
    features: [
      "Академия для персонала: мышление специалиста, коммуникация, диагностика клиента",
      "Протоколы удержания клиента и повторной записи",
      "Готовые скрипты, стандарты коммуникации, PDF-материалы",
      "Единый баланс: владелец подключает сотрудников, все работают из одного кабинета",
    ],
    result: "Больше повторных записей, доверие клиентов, уверенный персонал, рост рекомендаций",
  },
  {
    name: "Премиум салон",
    price: "490 000 ₽",
    period: "12 месяцев · до 15 сотрудников · 4 онлайн-встречи",
    url: `${SITE}/dlya-salonov`,
    color: "hsl(280,60%,45%)",
    features: [
      "Всё из «Стандарта»",
      "ИИ-диагностика клиента, ИИ-анализ мышления специалиста",
      "ИИ-диагностика роста салона PRO — где теряете деньги и как расти",
      "Генераторы постов, сценариев Reels, скриптов и ответов на отзывы",
      "Аналитика по каждому сотруднику, лимиты расхода по ролям",
      "4 стратегические онлайн-встречи с командой",
    ],
    result: "Рост среднего чека, удержание клиентов, единая система работы, сильная команда",
  },
  {
    name: "Промт Диалог Business",
    price: "от 1 200 000 ₽",
    period: "Индивидуально · 6–12 очных встреч",
    url: `${SITE}/dlya-salonov`,
    color: "hsl(38,80%,38%)",
    features: [
      "Полное внедрение системы с нуля под бренд салона",
      "Обучение + диагностика всей команды",
      "Безлимитный доступ ко всем ИИ-инструментам навсегда",
      "Все обновления платформы без доплат",
      "Настройка ролей и лимитов под структуру салона",
      "Персональная поддержка руководителя, 6–12 очных встреч",
    ],
    result: "Сильный бренд, стабильная база клиентов, выход в премиум-сегмент",
  },
];

export const EXTRA_SERVICES = [
  { name: "Аудит салона", price: "от 50 000 ₽", url: `${SITE}/dlya-salonov` },
  { name: "Обучение администраторов", price: "от 90 000 ₽", url: `${SITE}/dlya-salonov` },
  { name: "Настройка позиционирования", price: "от 150 000 ₽", url: `${SITE}/dlya-salonov` },
  { name: "Корпоративный доступ к платформе", price: "от 39 000 ₽ / мес", url: `${SITE}/dlya-salonov` },
];

export const USEFUL_LINKS = [
  { label: "Страница для салонов", url: `${SITE}/dlya-salonov` },
  { label: "Все тарифы и форматы", url: `${SITE}/tarify` },
  { label: "ИИ-инструменты платформы", url: `${SITE}/instrumenty` },
  { label: "Отзывы клиентов", url: `${SITE}/reviews` },
  { label: "Контакты", url: `${SITE}/kontakty` },
  { label: "Главная страница", url: SITE },
];

export const EMAIL_TEMPLATES = [
  {
    id: "intro",
    label: "Знакомство с платформой",
    subject: "Приглашаем ваш салон в Турнир красоты — участие бесплатно",
    ctaUrl: `${SITE}/championship`,
    ctaLabel: "Смотреть анонс турнира",
    body: `<p>Приглашаем ваш салон принять участие в <strong>Турнире салонов красоты</strong> — открытом соревновании индустрии, где можно побороться за призы, занять место в рейтинге и заявить о себе новым клиентам.</p>

<p><strong>Участие полностью бесплатное.</strong></p>

<p><strong>Что даёт участие в турнире:</strong></p>
<ul>
  <li>Реальные призы для победителей</li>
  <li>Место в общем рейтинге салонов красоты</li>
  <li>Узнаваемость салона среди новых клиентов индустрии</li>
  <li>Публичный профиль с достижениями и статусом салона</li>
</ul>

<p>Это отличная возможность заявить о себе и привлечь новых клиентов, ничем не рискуя.</p>

<p>Посмотрите анонс турнира и все подробности по кнопке ниже.</p>`,
  },
  {
    id: "premium",
    label: "Follow-up с бонусом",
    subject: "Вы уже прошли диагностику? Напоминаем — это бесплатно",
    body: `<p>Несколько дней назад мы приглашали вас пройти <strong>«Диагностику роста салона PRO»</strong> — инструмент, который показывает, где салон теряет деньги и как увеличить прибыль без роста потока клиентов.</p>

<p>Если вы ещё не успели попробовать — самое время. <strong>100 единиц энергии всё ещё ждут вас на балансе</strong>, и платить ничего не нужно.</p>

<p><strong>Напоминаем шаги:</strong></p>
<ol>
  <li>Зарегистрируйтесь на <a href="https://promtdialog.ru">promtdialog.ru</a> (если ещё не сделали этого)</li>
  <li>Добавьте ваш салон в личном кабинете</li>
  <li>Перейдите в раздел <strong>«Развитие салона»</strong></li>
  <li>Выберите <strong>«Диагностика роста салона PRO»</strong></li>
</ol>

<p>Займёт 5 минут. На выходе — конкретный список: что именно мешает вашему салону зарабатывать больше прямо сейчас.</p>

<p>Если уже прошли — будем рады узнать ваши впечатления. Просто ответьте на это письмо!</p>`,
  },
  {
    id: "followup",
    label: "Приглашение в Telegram",
    subject: "Будьте в курсе всего нового — приглашаем в Telegram-канал «Промт Диалог»",
    body: `<p>Рады, что вы познакомились с платформой «Промт Диалог»!</p>

<p>Чтобы вы всегда были в курсе новых инструментов, обновлений и полезных материалов для развития салона — приглашаем вас в наш Telegram-канал.</p>

<p><strong>Что публикуем в канале:</strong></p>
<ul>
  <li>анонсы новых ИИ-инструментов и функций платформы;</li>
  <li>практические советы по работе с клиентами и командой;</li>
  <li>кейсы и истории салонов, которые уже работают с «Промт Диалог»;</li>
  <li>эксклюзивные бонусы и акции для подписчиков.</li>
</ul>

<p>Подписывайтесь — будем на связи: <a href="https://t.me/promtdialog">t.me/promtdialog</a></p>

<p>До встречи в канале!</p>`,
  },
];

export function copyText(text: string, setCopied: (v: boolean) => void) {
  const tryClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.reject(new Error("no clipboard api"));
  };

  const fallback = () => {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try { document.execCommand("copy"); } catch (_e) { /* ignore */ }
    document.body.removeChild(el);
  };

  tryClipboard()
    .catch(fallback)
    .finally(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
}