ALTER TABLE t_p84565078_code_expression_proj.video_jobs
    ADD COLUMN IF NOT EXISTS reference_photo_url text NULL;

UPDATE t_p84565078_code_expression_proj.tool_costs
SET energy_cost = 110
WHERE tool_key = 'video_gen_5s';

UPDATE t_p84565078_code_expression_proj.tool_costs
SET energy_cost = 185
WHERE tool_key = 'video_gen_10s';