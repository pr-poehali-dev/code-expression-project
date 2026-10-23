UPDATE t_p84565078_code_expression_proj.tool_costs
SET energy_cost = 2, is_free = FALSE, updated_at = NOW()
WHERE tool_key IN ('client_view', 'client_view_ask');