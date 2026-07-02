-- V0080: Тестовый турнир со всеми данными для тестирования функционала

-- 1. Сезон
INSERT INTO t_p84565078_code_expression_proj.ch_seasons
  (name, slug, year, season, starts_at, ends_at, is_active)
VALUES
  ('Лето 2026', 'summer-2026', 2026, 'summer',
   NOW() - INTERVAL '7 days',
   NOW() + INTERVAL '60 days',
   TRUE);

-- 2. Турнир (статус voting — чтобы можно было сразу голосовать)
INSERT INTO t_p84565078_code_expression_proj.ch_tournaments
  (season_id, name, slug, category, emoji, description, rules, task_text,
   prize_energy, prize_2nd, prize_3rd, min_participants, status,
   registration_starts, registration_ends, task_opens_at,
   work_deadline, voting_starts, voting_ends)
VALUES
  (
    (SELECT id FROM t_p84565078_code_expression_proj.ch_seasons WHERE slug = 'summer-2026'),
    'Лучшее преображение — Лето 2026',
    'luchshee-preobrazhenie-leto-2026',
    'general',
    '🏆',
    'Первый тестовый турнир чемпионата красоты. Покажите лучшую работу по преображению клиента.',
    '1. Работа должна быть выполнена в период турнира. 2. Фото — высокое качество. 3. Запрещено использование фильтров. 4. Максимум 5 фотографий.',
    'Создайте образ «Летнее преображение» — покажите до/после, расскажите о применённых техниках.',
    500, 300, 150,
    1,
    'voting',
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '6 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '6 days'
  );

-- 3. Заявки (3 салона)
INSERT INTO t_p84565078_code_expression_proj.ch_applications
  (tournament_id, salon_id, user_id, status, notify_email)
SELECT
  (SELECT id FROM t_p84565078_code_expression_proj.ch_tournaments WHERE slug = 'luchshee-preobrazhenie-leto-2026'),
  u.salon_id,
  u.id,
  'approved',
  u.email
FROM t_p84565078_code_expression_proj.lk_users u
WHERE u.salon_id IN (1, 2, 3) AND u.id IN (1, 3, 6)
ON CONFLICT (tournament_id, salon_id) DO NOTHING;

-- 4. Работы (3 одобренных, публичных)
INSERT INTO t_p84565078_code_expression_proj.ch_works
  (tournament_id, salon_id, application_id, title, description, story,
   services_done, master_name, photos, status, is_public, votes_count)
VALUES
  (
    (SELECT id FROM t_p84565078_code_expression_proj.ch_tournaments WHERE slug = 'luchshee-preobrazhenie-leto-2026'),
    1,
    (SELECT id FROM t_p84565078_code_expression_proj.ch_applications WHERE salon_id = 1
       AND tournament_id = (SELECT id FROM t_p84565078_code_expression_proj.ch_tournaments WHERE slug = 'luchshee-preobrazhenie-leto-2026')),
    'Летнее преображение — Остеопат Плюс',
    'Комплексное восстановление осанки и снятие мышечных зажимов для подготовки к пляжному сезону.',
    'Клиентка обратилась с болями в спине и сутулостью. За 3 сеанса удалось восстановить нормальный мышечный тонус.',
    'Миофасциальный релиз, постизометрическая релаксация, работа с триггерными точками',
    'Светлана Иванова',
    '[{"url":"https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600","caption":"Результат процедуры"}]',
    'approved', TRUE, 12
  ),
  (
    (SELECT id FROM t_p84565078_code_expression_proj.ch_tournaments WHERE slug = 'luchshee-preobrazhenie-leto-2026'),
    2,
    (SELECT id FROM t_p84565078_code_expression_proj.ch_applications WHERE salon_id = 2
       AND tournament_id = (SELECT id FROM t_p84565078_code_expression_proj.ch_tournaments WHERE slug = 'luchshee-preobrazhenie-leto-2026')),
    'Летний уход — Тест Салон',
    'Антицеллюлитная программа + лимфодренажный массаж. Результат виден уже после первого курса.',
    'Работали с клиенткой 45 лет, которая хотела привести тело в форму к отпуску.',
    'Антицеллюлитный массаж, лимфодренаж, обёртывания',
    'Мария Петрова',
    '[{"url":"https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600","caption":"До и после курса"}]',
    'approved', TRUE, 8
  ),
  (
    (SELECT id FROM t_p84565078_code_expression_proj.ch_tournaments WHERE slug = 'luchshee-preobrazhenie-leto-2026'),
    3,
    (SELECT id FROM t_p84565078_code_expression_proj.ch_applications WHERE salon_id = 3
       AND tournament_id = (SELECT id FROM t_p84565078_code_expression_proj.ch_tournaments WHERE slug = 'luchshee-preobrazhenie-leto-2026')),
    'Спортивное восстановление — Вася',
    'Реабилитация после соревнований: снятие мышечного утомления, работа с перегруженными группами мышц.',
    'Клиент-спортсмен после марафона. Полное восстановление за 2 сеанса.',
    'Спортивный массаж, криотерапия, стретчинг',
    'Василий Смирнов',
    '[{"url":"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600","caption":"Работа с мышцами спины"}]',
    'approved', TRUE, 5
  )
ON CONFLICT (tournament_id, salon_id) DO NOTHING;
