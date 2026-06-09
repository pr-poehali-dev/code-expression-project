CREATE TABLE t_p84565078_code_expression_proj.member_course_access (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.salon_members(id),
  course_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.courses(id),
  granted_by INTEGER REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, course_id)
);
CREATE INDEX idx_member_course_access_member ON t_p84565078_code_expression_proj.member_course_access(member_id);
CREATE INDEX idx_member_course_access_course ON t_p84565078_code_expression_proj.member_course_access(course_id);