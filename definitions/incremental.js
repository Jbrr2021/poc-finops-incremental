const config = require("includes/config");

config.clientesAtivos.forEach(cliente => {
  
  // Cria a tabela principal de forma incremental
  publish(`tn_billing_${cliente.nome}`, {
    type: "incremental",
    schema: cliente.dataset_origem,
    description: `Tabela base atualizada de forma incremental para o cliente ${cliente.nome}`
  })
  .preOps(ctx => `
    -- 1º Passo: Remove os últimos 7 dias para evitar linhas duplicadas (Tradução do Python)
    DELETE FROM ${ctx.self()}
    WHERE DATE(usage_start_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
  `)
  .query(ctx => `
    -- 2º Passo: Insere os novos dados calculados
    SELECT 
      billing_account_id,
      DATE(usage_start_time) AS usage_date,
      usage_start_time,
      (cost * ${cliente.multiplicador}) AS custo_total,
      currency
    FROM \`${cliente.dataset_origem}.${cliente.tabela_origem}\`
    -- Pega apenas os dados recentes para inserir
    WHERE DATE(usage_start_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
  `);

});