-- Партнёрские тренинги: внешняя ссылка вместо уроков внутри кабинета, свободная цена (текст)
ALTER TABLE t_p84565078_code_expression_proj.courses
  ADD COLUMN is_partner BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN partner_name VARCHAR(200),
  ADD COLUMN partner_url TEXT,
  ADD COLUMN partner_price VARCHAR(100),
  ADD COLUMN partner_format VARCHAR(20);

-- Категории витрины Академии (управляемые из админки: картинка + короткое описание)
CREATE TABLE t_p84565078_code_expression_proj.academy_categories (
  id            SERIAL PRIMARY KEY,
  code          VARCHAR(50) NOT NULL UNIQUE,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  cover_url     TEXT,
  icon          VARCHAR(50) NOT NULL DEFAULT 'GraduationCap',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO t_p84565078_code_expression_proj.academy_categories (code, title, description, icon, sort_order) VALUES
  ('owner',  'Для владельца салона и руководителя', 'Стратегия, найм, продвижение и рост дохода салона', 'Building2', 1),
  ('admin',  'Для администратора',                   'Работа с записью, клиентами и командой салона',     'UserCog',   2),
  ('master', 'Для мастеров',                          'Техники, личный бренд и рост среднего чека',        'Scissors',  3),
  ('body',   'Для специалистов по телу',              'Массаж и телесные практики: техники и продажи',     'Heart',     4),
  ('clients','Для клиентов',                          'Тренинги, которые мастер может порекомендовать своим клиентам', 'Smile', 5);