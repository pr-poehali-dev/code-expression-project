-- Реферальная программа: единая для всех пользователей (включая школы-партнёры, которые
-- теперь сами регистрируются как обычные пользователи и дополнительно к промокоду могут
-- использовать свою реферальную ссылку). Приглашённый переходит по ссылке ?ref=CODE,
-- код сохраняется на фронте до регистрации. После первой успешной оплаты приглашённого
-- (пополнение энергии или покупка пакета) рефереру начисляется разово 300 энергии.
-- Без вывода — только использование внутри платформы.

ALTER TABLE t_p84565078_code_expression_proj.lk_users
  ADD COLUMN ref_code VARCHAR(16),
  ADD COLUMN referred_by INTEGER REFERENCES t_p84565078_code_expression_proj.lk_users(id);

CREATE UNIQUE INDEX idx_lk_users_ref_code ON t_p84565078_code_expression_proj.lk_users (ref_code) WHERE ref_code IS NOT NULL;
CREATE INDEX idx_lk_users_referred_by ON t_p84565078_code_expression_proj.lk_users (referred_by);

-- Факт начисления реферального бонуса — по одной записи на приглашённого (разовый бонус
-- за его первую оплату), защищает от повторного начисления при последующих оплатах.
CREATE TABLE t_p84565078_code_expression_proj.referral_bonuses (
  id             SERIAL PRIMARY KEY,
  referrer_id    INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  referred_id    INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  bonus_energy   INTEGER NOT NULL DEFAULT 300,
  amount_rub     INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referred_id)
);
CREATE INDEX idx_referral_bonuses_referrer ON t_p84565078_code_expression_proj.referral_bonuses (referrer_id);
