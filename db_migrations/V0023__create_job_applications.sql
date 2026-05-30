CREATE TABLE t_p84565078_code_expression_proj.job_applications (
  id serial PRIMARY KEY,
  full_name varchar(255) NOT NULL,
  age varchar(10),
  city varchar(100),
  phone varchar(50),
  telegram varchar(100),
  experience text,
  current_job text,
  motivation text,
  interview jsonb NOT NULL DEFAULT '[]',
  scores jsonb,
  total_score integer,
  status varchar(50) DEFAULT 'new',
  ai_comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE t_p84565078_code_expression_proj.job_applications IS 'Заявки кандидатов на вакансию представителя';
