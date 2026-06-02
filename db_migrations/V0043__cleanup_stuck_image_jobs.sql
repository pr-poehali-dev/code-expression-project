UPDATE t_p84565078_code_expression_proj.image_jobs
SET status = 'error', error_msg = 'Превышено время ожидания'
WHERE status = 'running' AND created_at < NOW() - INTERVAL '5 minutes';
