UPDATE t_p84565078_code_expression_proj.image_jobs
SET status = 'error', error_msg = 'Сброшено'
WHERE status IN ('pending', 'running');
