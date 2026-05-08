
-- Таблица прохождений квиза (заявки)
CREATE TABLE quiz_submissions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    category TEXT NOT NULL,
    recommended_courses JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Таблица курсов для квиза (управляемые через админку)
CREATE TABLE quiz_courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    buy_url TEXT,
    price TEXT NOT NULL,
    category TEXT NOT NULL,  -- A, B, C, D
    format TEXT NOT NULL DEFAULT 'online',  -- online, offline
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Начальные данные курсов
INSERT INTO quiz_courses (title, description, url, buy_url, price, category, format, sort_order) VALUES
('Профессия массажист с нуля: первый доход за 30 дней', 'Войдите в профессию и начните зарабатывать уже через месяц обучения. Без медобразования.', '/course/massazhist-s-nulya', 'https://massopro.ru', '5 970 ₽', 'D', 'online', 1),
('Восстановительный массаж PRO', 'Профессиональный курс для практикующих массажистов: глубокие техники, протоколы, диагностика.', '/course/vosstanovitelny-massazh-pro', 'https://massopro.ru', '39 900 ₽', 'B', 'online', 2),
('Готовые протоколы массажа', 'Готовые пошаговые протоколы для уверенной работы с клиентами на высоком уровне.', '/course/gotovye-protokoly-massazha', 'https://massopro.ru', '5 970 ₽', 'B', 'online', 3),
('Антистресс-техники', 'Простые и эффективные техники снятия напряжения — для себя, семьи и клиентов.', '/course/antistress-tehniki-massazha', 'https://massopro.ru', '4 470 ₽', 'A', 'online', 4),
('Коррекция фигуры', 'Освойте востребованные техники коррекции и увеличьте чек за свои услуги.', '/course/korrektsiya-figury', 'https://massopro.ru', '5 070 ₽', 'B', 'online', 5),
('Висцеральный массаж с нуля', 'Базовый курс по висцеральному массажу — уникальная техника для начинающих.', '/course/visceralny-massazh-s-nulya', 'https://massopro.ru', '1 497 ₽', 'A', 'online', 6),
('Массажист с потоком клиентов', 'Научитесь привлекать, удерживать и увеличивать поток клиентов через системный подход.', '/course/massazhist-s-potokom-klientov', 'https://massopro.ru', 'от 1 470 ₽', 'D', 'online', 7),
('Интенсив для массажистов: восстановительные техники', 'Живой интенсив в Москве для практикующих массажистов. Диагностика, техники, работа с болью.', '/course/offline-intensiv-dlya-massazhistov', 'https://massopro.ru', 'от 5 000 ₽', 'B', 'offline', 8),
('Интенсив для тренеров: восстановление', 'Практический интенсив для тренеров и инструкторов. Восстановительные техники в работе с клиентами.', '/course/offline-intensiv-dlya-trenerov', 'https://massopro.ru', 'от 5 000 ₽', 'C', 'offline', 9),
('Интенсив для семьи: помочь близким', 'Базовый офлайн-интенсив для тех, кто хочет помогать близким восстанавливаться дома.', '/course/offline-intensiv-dlya-semi', 'https://massopro.ru', 'от 5 000 ₽', 'A', 'offline', 10),
('Начало карьеры: войти в профессию с нуля', 'Старт в восстановительных техниках с нуля. Всё что нужно для начала карьеры.', '/course/offline-intensiv-karera', 'https://massopro.ru', 'от 5 000 ₽', 'D', 'offline', 11);
