UPDATE podelam_daily_plans
SET tasks = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'key' = 'content' THEN
        jsonb_set(
          jsonb_set(elem, '{topic_options}', '["Регуляция ВНС: частая ошибка, которая мешает получить результат", "Бизнес коучинг: как понять, что формат работы вам подходит", "Психолог: разовая встреча или курс/абонемент — что выгоднее"]'::jsonb),
          '{action_text}', '"Опубликуйте один Reels по вашему направлению «Психолог» — ниже готовые темы на выбор, не нужно придумывать самим. Выберите ту, что ближе к текущей ситуации клиентов, и переходите в генератор."'::jsonb
        )
      ELSE elem
    END
  )
  FROM jsonb_array_elements(tasks) AS elem
)
WHERE plan_date = CURRENT_DATE AND user_id = 1;