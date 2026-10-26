const clientes = [
  {
    nome: "bahema",
    dataset_origem: "bahema_com_br_cbd",
    tabela_origem: "clustered_billing_export_detalhado", // Usamos a sua tabela de teste
    multiplicador: 5.0,
    status: "ativo" // O pipeline VAI processar este
  },
  {
    nome: "cliente_antigo_cancelado",
    dataset_origem: "dataset_inexistente",
    tabela_origem: "tabela_inexistente",
    multiplicador: 1.0,
    status: "pausado" // O pipeline vai IGNORAR este automaticamente
  }
];

// O segredo: Esta linha filtra a lista antes de enviar para o gerador
const clientesAtivos = clientes.filter(c => c.status === "ativo");

module.exports = {
  clientesAtivos
};