-- V0077: Чемпионат красоты — ядро (сезоны, турниры, заявки, работы)

CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_seasons (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,           -- "Весна 2027"
    slug            VARCHAR(60) NOT NULL UNIQUE,     -- "spring-2027"
    year            INT NOT NULL,
    season          VARCHAR(20) NOT NULL,            -- spring|summer|autumn|winter
    starts_at       TIMESTAMPTZ,
    ends_at         TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT FALSE,
    is_finished     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_tournaments (
    id                  SERIAL PRIMARY KEY,
    season_id           INT REFERENCES t_p84565078_code_expression_proj.ch_seasons(id),
    name                VARCHAR(200) NOT NULL,
    slug                VARCHAR(100) NOT NULL UNIQUE,
    category            VARCHAR(80) NOT NULL DEFAULT 'general',
    emoji               VARCHAR(10) DEFAULT '🏆',
    description         TEXT,
    rules               TEXT,
    task_text           TEXT,                        -- задание, скрытое до старта
    prize_energy        INT DEFAULT 0,               -- энергия победителю
    prize_2nd           INT DEFAULT 0,
    prize_3rd           INT DEFAULT 0,
    min_participants    INT DEFAULT 5,               -- минимум для старта
    status              VARCHAR(30) DEFAULT 'draft', -- draft|announced|registration|active|voting|finished|cancelled
    registration_starts TIMESTAMPTZ,
    registration_ends   TIMESTAMPTZ,
    task_opens_at       TIMESTAMPTZ,                 -- момент открытия задания
    work_deadline       TIMESTAMPTZ,
    voting_starts       TIMESTAMPTZ,
    voting_ends         TIMESTAMPTZ,
    next_date           TIMESTAMPTZ,                 -- дата переноса при нехватке участников
    postponed           BOOLEAN DEFAULT FALSE,
    postpone_reason     TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_applications (
    id              SERIAL PRIMARY KEY,
    tournament_id   INT NOT NULL REFERENCES t_p84565078_code_expression_proj.ch_tournaments(id),
    salon_id        INT NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
    user_id         INT NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    status          VARCHAR(30) DEFAULT 'pending',   -- pending|approved|rejected|withdrawn
    notify_email    VARCHAR(200),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tournament_id, salon_id)
);

CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_works (
    id              SERIAL PRIMARY KEY,
    tournament_id   INT NOT NULL REFERENCES t_p84565078_code_expression_proj.ch_tournaments(id),
    salon_id        INT NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
    application_id  INT REFERENCES t_p84565078_code_expression_proj.ch_applications(id),
    title           VARCHAR(300),
    description     TEXT,
    story           TEXT,
    services_done   TEXT,
    master_name     VARCHAR(200),
    tools_used      TEXT,
    photos          JSONB DEFAULT '[]',              -- [{url, caption}]
    video_url       VARCHAR(500),
    status          VARCHAR(30) DEFAULT 'draft',     -- draft|submitted|moderation|approved|rejected
    moderation_note TEXT,
    votes_count     INT DEFAULT 0,
    expert_score    NUMERIC(5,2) DEFAULT 0,
    ai_score        NUMERIC(5,2) DEFAULT 0,
    total_score     NUMERIC(8,2) DEFAULT 0,
    final_place     INT,
    is_public       BOOLEAN DEFAULT FALSE,           -- виден только после модерации
    reveal_at       TIMESTAMPTZ,                     -- когда открывается название салона
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tournament_id, salon_id)
);

CREATE INDEX IF NOT EXISTS idx_ch_works_tournament ON t_p84565078_code_expression_proj.ch_works(tournament_id);
CREATE INDEX IF NOT EXISTS idx_ch_works_salon ON t_p84565078_code_expression_proj.ch_works(salon_id);
CREATE INDEX IF NOT EXISTS idx_ch_applications_tournament ON t_p84565078_code_expression_proj.ch_applications(tournament_id);
