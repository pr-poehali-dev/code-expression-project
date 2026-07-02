-- V0079: Чемпионат — достижения, рейтинг, партнёры, призы, настройки

-- Типы достижений
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_achievement_types (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(60) NOT NULL UNIQUE,         -- "first_participation"|"top3"|"winner" ...
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    icon        VARCHAR(20) DEFAULT '🏅',
    points      INT DEFAULT 0,                       -- очки рейтинга за достижение
    is_active   BOOLEAN DEFAULT TRUE
);

-- Достижения салонов
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_salon_achievements (
    id              SERIAL PRIMARY KEY,
    salon_id        INT NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
    achievement_id  INT NOT NULL REFERENCES t_p84565078_code_expression_proj.ch_achievement_types(id),
    tournament_id   INT REFERENCES t_p84565078_code_expression_proj.ch_tournaments(id),
    awarded_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, achievement_id, tournament_id)
);

-- Рейтинг салонов (накопительный)
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_ratings (
    id              SERIAL PRIMARY KEY,
    salon_id        INT NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id) UNIQUE,
    total_points    INT DEFAULT 0,
    participations  INT DEFAULT 0,
    wins            INT DEFAULT 0,
    top3_count      INT DEFAULT 0,
    top10_count     INT DEFAULT 0,
    level           VARCHAR(30) DEFAULT 'newcomer',  -- newcomer|participant|professional|expert|premium|legend
    season_points   INT DEFAULT 0,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Партнёры турниров
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_partners (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    logo_url    VARCHAR(500),
    website     VARCHAR(500),
    description TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Призы от партнёров (привязаны к турниру и месту)
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_prizes (
    id              SERIAL PRIMARY KEY,
    tournament_id   INT NOT NULL REFERENCES t_p84565078_code_expression_proj.ch_tournaments(id),
    partner_id      INT REFERENCES t_p84565078_code_expression_proj.ch_partners(id),
    place           INT NOT NULL DEFAULT 1,          -- 1|2|3|4|5
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    photo_url       VARCHAR(500),
    value           VARCHAR(200),                    -- "iPhone 15" / "50 000 ₽"
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Настройки чемпионата (ключ-значение)
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_settings (
    key     VARCHAR(100) PRIMARY KEY,
    value   TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Начальные значения настроек
INSERT INTO t_p84565078_code_expression_proj.ch_settings (key, value) VALUES
    ('min_participants_default', '5'),
    ('voting_weight_users', '40'),
    ('voting_weight_experts', '30'),
    ('voting_weight_activity', '10'),
    ('points_participation', '20'),
    ('points_top10', '80'),
    ('points_top3', '150'),
    ('points_winner', '300'),
    ('points_audience_fav', '100')
ON CONFLICT (key) DO NOTHING;

-- Сидирование достижений
INSERT INTO t_p84565078_code_expression_proj.ch_achievement_types (code, name, description, icon, points) VALUES
    ('first_participation', 'Первое участие', 'Вы впервые подали работу на чемпионат', '🌟', 20),
    ('top10', 'Топ-10', 'Вошли в десятку лучших', '🎯', 80),
    ('top3', 'Призёр', 'Вошли в тройку лучших', '🥉', 150),
    ('winner', 'Победитель', 'Заняли первое место в турнире', '🏆', 300),
    ('audience_fav', 'Любимец зрителей', 'Набрали больше всех зрительских голосов', '❤️', 100),
    ('participations_5', '5 турниров', 'Участвовали в 5 турнирах', '🎖️', 50),
    ('participations_10', '10 турниров', 'Участвовали в 10 турнирах', '🎗️', 100),
    ('wins_3', '3 победы', 'Одержали 3 победы', '👑', 200),
    ('best_debut', 'Лучший дебют', 'Заняли призовое место в первом турнире', '🚀', 120),
    ('votes_1000', '1000 голосов', 'Набрали 1000 голосов за все время', '💬', 80)
ON CONFLICT (code) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_ch_ratings_points ON t_p84565078_code_expression_proj.ch_ratings(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_ch_salon_achievements_salon ON t_p84565078_code_expression_proj.ch_salon_achievements(salon_id);
