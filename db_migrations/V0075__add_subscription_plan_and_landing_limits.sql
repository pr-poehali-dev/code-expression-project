-- Добавляем поле тарифного плана в salons
ALTER TABLE t_p84565078_code_expression_proj.salons
  ADD COLUMN IF NOT EXISTS subscription_plan INTEGER NOT NULL DEFAULT 1;

-- Таблица лимитов лендингов по тарифам
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.landing_plan_limits (
    plan        INTEGER PRIMARY KEY,
    plan_name   VARCHAR(50) NOT NULL,
    max_landings INTEGER NOT NULL
);

INSERT INTO t_p84565078_code_expression_proj.landing_plan_limits (plan, plan_name, max_landings) VALUES
  (1, 'Старт',    3),
  (2, 'Бизнес',  5),
  (3, 'Рост',    10),
  (4, 'Премиум', 50)
ON CONFLICT (plan) DO UPDATE SET max_landings = EXCLUDED.max_landings, plan_name = EXCLUDED.plan_name;
