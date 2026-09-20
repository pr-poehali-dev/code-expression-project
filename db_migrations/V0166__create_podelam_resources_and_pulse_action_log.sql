-- «Мои ресурсы» — постоянный чек-лист каналов/площадок пользователя (Яндекс Бизнес, сайт,
-- соцсети и т.п.) для карточки «Пульс бизнеса»: статус подключён/не подключён + опциональная
-- ссылка. Не привязан к конкретной рекомендации дня — живёт как отдельный профиль ресурсов,
-- который ИИ учитывает при формировании "Карты привлечения клиентов" (не повторяет совет
-- завести то, что уже подключено, и подсказывает, что размещать на уже занятых площадках).
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.podelam_resources (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    resource_key VARCHAR(60) NOT NULL,
    connected BOOLEAN NOT NULL DEFAULT FALSE,
    url TEXT NULL,
    note TEXT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, resource_key)
);

-- Лог выполнения рекомендаций «Пульса бизнеса» (главное действие/доп. рекомендации/каналы
-- привлечения из карты ЦА) — по аналогии с podelam_task_log для обычных ежедневных шагов,
-- но здесь ключ — не фиксированный task_key плана, а хэш/текст самой рекомендации ИИ,
-- т.к. Пульс пересчитывается раз в сутки (не как ежедневный план с постоянным набором ключей).
CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.podelam_pulse_action_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    action_key VARCHAR(64) NOT NULL,
    action_text TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, action_key)
);
