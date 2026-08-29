ALTER TABLE t_p84565078_code_expression_proj.ai_generated_images
  ADD COLUMN IF NOT EXISTS reference_photo_url text NULL;

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('image_gen_reference_photo', 'Доплата: генерация изображения с фото мастера', 'images', 3, false)
ON CONFLICT (tool_key) DO NOTHING;
