-- Приглашения в команду салона
CREATE TABLE t_p84565078_code_expression_proj.salon_invites (
  id           SERIAL PRIMARY KEY,
  salon_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
  invited_by   INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  token        VARCHAR(64) NOT NULL UNIQUE,
  full_name    VARCHAR(255),
  email        VARCHAR(255),
  phone        VARCHAR(50),
  role_code    VARCHAR(50) NOT NULL DEFAULT 'master',
  status       VARCHAR(20) NOT NULL DEFAULT 'pending',
  used_by      INTEGER REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at   TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Расширяем salon_members: права, лимиты, статус
ALTER TABLE t_p84565078_code_expression_proj.salon_members
  ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS monthly_credit_limit INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- История расхода кредитов сотрудниками
CREATE TABLE t_p84565078_code_expression_proj.credit_transactions (
  id           SERIAL PRIMARY KEY,
  salon_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
  user_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  action       VARCHAR(100) NOT NULL,
  amount       INTEGER NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Баланс кредитов на уровне салона
ALTER TABLE t_p84565078_code_expression_proj.salons
  ADD COLUMN IF NOT EXISTS credits_balance INTEGER NOT NULL DEFAULT 100;
