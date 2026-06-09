CREATE TABLE t_p84565078_code_expression_proj.course_access_requests (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.courses(id),
  member_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.salon_members(id),
  user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  salon_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by INTEGER REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  UNIQUE(course_id, member_id)
);
CREATE INDEX idx_car_salon_id ON t_p84565078_code_expression_proj.course_access_requests(salon_id);
CREATE INDEX idx_car_status ON t_p84565078_code_expression_proj.course_access_requests(status);