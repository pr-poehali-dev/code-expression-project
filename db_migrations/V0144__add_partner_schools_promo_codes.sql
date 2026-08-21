-- Школы-партнёры: приводят учеников (мастеров), получают уникальный промокод от админа
CREATE TABLE t_p84565078_code_expression_proj.partner_schools (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  contact_name   VARCHAR(255),
  contact_phone  VARCHAR(50),
  contact_email  VARCHAR(255),
  promo_code     VARCHAR(30) NOT NULL UNIQUE,
  bonus_energy   INTEGER NOT NULL DEFAULT 200,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  notes          TEXT,
  created_by     INTEGER REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_partner_schools_promo_code ON t_p84565078_code_expression_proj.partner_schools (UPPER(promo_code));

-- Факт использования промокода при регистрации — для истории и антифрода
CREATE TABLE t_p84565078_code_expression_proj.promo_code_usages (
  id             SERIAL PRIMARY KEY,
  school_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.partner_schools(id),
  user_id        INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  bonus_energy   INTEGER NOT NULL DEFAULT 0,
  ip_hash        VARCHAR(64),
  device_fp_hash VARCHAR(64),
  email_local    VARCHAR(255),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_promo_usages_school ON t_p84565078_code_expression_proj.promo_code_usages (school_id);
CREATE INDEX idx_promo_usages_ip ON t_p84565078_code_expression_proj.promo_code_usages (ip_hash);
CREATE INDEX idx_promo_usages_fp ON t_p84565078_code_expression_proj.promo_code_usages (device_fp_hash);
CREATE INDEX idx_promo_usages_email_local ON t_p84565078_code_expression_proj.promo_code_usages (email_local);

ALTER TABLE t_p84565078_code_expression_proj.lk_users
  ADD COLUMN partner_school_id INTEGER REFERENCES t_p84565078_code_expression_proj.partner_schools(id);