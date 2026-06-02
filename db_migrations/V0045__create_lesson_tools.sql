CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.lesson_tools (
  id         SERIAL PRIMARY KEY,
  lesson_id  INTEGER NOT NULL,
  tool_slug  VARCHAR(64) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, tool_slug)
);