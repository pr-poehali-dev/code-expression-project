CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.video_jobs (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id integer NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    salon_id integer NULL,
    prompt text NOT NULL,
    resolution varchar(10) NOT NULL DEFAULT '720p',
    duration varchar(10) NOT NULL DEFAULT '5s',
    status varchar(20) NOT NULL DEFAULT 'pending',
    result_url text NULL,
    error_msg text NULL,
    cost integer NOT NULL DEFAULT 15,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('video_gen', 'Генерация видео', 'marketing', 15, false)
ON CONFLICT (tool_key) DO NOTHING;