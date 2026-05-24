UPDATE t_p84565078_code_expression_proj.ms_scenarios
SET
  action_plan  = REPLACE(action_plan,  '\n', E'\n'),
  track_items  = REPLACE(track_items,  '\n', E'\n'),
  exercise_text = REPLACE(exercise_text, '\n', E'\n');
