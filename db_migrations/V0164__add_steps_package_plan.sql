-- Новый тариф "Шаги ПоДелам" (steps) — продлевает только доступ к ежедневным шагам ПоДелам
-- после окончания бесплатных 30 дней. daily_limit_per_tool=0 — не даёт бесплатных использований
-- прочих ИИ-инструментов (в отличие от start/growth/pro/max). has_deep_analysis=false — без
-- расширенной аналитики "Пульс бизнеса". sort_order=0 — отображается первым (до "Старт").
INSERT INTO t_p84565078_code_expression_proj.package_plans
    (code, name, description, daily_limit_per_tool, has_deep_analysis, sort_order, is_active)
VALUES
    ('steps', 'Шаги ПоДелам', 'Продление ежедневных шагов и диагностики ПоДелам после окончания бесплатного периода. Без расширенного анализа и без лимита на другие инструменты.', 0, FALSE, 0, TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO t_p84565078_code_expression_proj.package_plan_prices (plan_code, period_months, price_rub)
VALUES ('steps', 1, 1290)
ON CONFLICT (plan_code, period_months) DO NOTHING;
