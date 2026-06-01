-- Сбрасываем дефолтный бонус у существующих салонов
-- (баланс уже начислен, оставляем как есть — меняем только DEFAULT для новых)
ALTER TABLE t_p84565078_code_expression_proj.salons
  ALTER COLUMN credits_balance SET DEFAULT 0;

-- Флаг: получил ли пользователь приветственный бонус
ALTER TABLE t_p84565078_code_expression_proj.lk_users
  ADD COLUMN IF NOT EXISTS welcome_bonus_given BOOLEAN NOT NULL DEFAULT false;

-- Помечаем существующих владельцев как уже получивших бонус
UPDATE t_p84565078_code_expression_proj.lk_users
SET welcome_bonus_given = true
WHERE salon_id IS NOT NULL;
