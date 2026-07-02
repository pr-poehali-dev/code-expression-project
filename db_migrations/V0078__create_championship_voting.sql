-- V0078: Чемпионат — голосование, антинакрутка, экспертные оценки

CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_votes (
    id          SERIAL PRIMARY KEY,
    work_id     INT NOT NULL REFERENCES t_p84565078_code_expression_proj.ch_works(id),
    voter_ip    VARCHAR(64),
    voter_fp    VARCHAR(128),                        -- fingerprint браузера
    user_id     INT REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    score       INT DEFAULT 1 CHECK(score BETWEEN 1 AND 5),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Лог подозрительной активности
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_vote_log (
    id          SERIAL PRIMARY KEY,
    work_id     INT,
    voter_ip    VARCHAR(64),
    voter_fp    VARCHAR(128),
    reason      VARCHAR(200),                        -- "too_fast"|"same_ip_limit"|"same_fp"
    blocked     BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Оценки экспертов (20% от итога)
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_expert_scores (
    id          SERIAL PRIMARY KEY,
    work_id     INT NOT NULL REFERENCES t_p84565078_code_expression_proj.ch_works(id),
    expert_id   INT NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    score       INT NOT NULL CHECK(score BETWEEN 1 AND 10),
    comment     TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(work_id, expert_id)
);

-- Эксперты чемпионата
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.ch_experts (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id) UNIQUE,
    bio         TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Уникальность: 1 IP = не более 3 голосов за работу в сутки
CREATE UNIQUE INDEX IF NOT EXISTS idx_ch_votes_uniq_user
    ON t_p84565078_code_expression_proj.ch_votes(work_id, user_id)
    WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ch_votes_work ON t_p84565078_code_expression_proj.ch_votes(work_id);
CREATE INDEX IF NOT EXISTS idx_ch_votes_ip ON t_p84565078_code_expression_proj.ch_votes(voter_ip, created_at);
