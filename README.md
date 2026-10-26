# 🚀 PoC: Job Incremental de FinOps (Google Dataform)

Este repositório contém a Prova de Conceito (PoC) para a modernização da infraestrutura de FinOps da IPNET. O objetivo principal é migrar os scripts procedurais legados (Python) para uma arquitetura de orquestração declarativa, escalável e versionada utilizando **Google Dataform (JavaScript/SQLX)**.

## 🎯 Objetivos da PoC

1. **Substituição da Infraestrutura Legada:** Eliminar a dependência de scripts Python engessados para processamento de faturamento.
2. **Filtro Dinâmico de Contratos:** Implementar uma gestão inteligente de clientes ativos diretamente via configuração, sem necessidade de manipulação de código-fonte.
3. **Rotina Incremental Idempotente:** Automatizar o processo de expurgo (`DELETE`) e inserção de novos dados (DML) de forma nativa e segura.
4. **Prontidão para Event-Driven:** Deixar a arquitetura preparada para integração via API com as plataformas internas (CSI e CBDV3).

## 🏗️ Arquitetura e Soluções Implementadas

### 1. Gestão de Clientes Ativos (`includes/config.js`)
Em vez de comentar linhas ou apagar blocos de código para clientes pausados, implementamos uma flag de `status`. O uso da função nativa `.filter()` garante que apenas contratos marcados como `"ativo"` sejam mapeados para compilação.
* **Benefício:** Redução de custos de processamento no BigQuery, ignorando contas desativadas antes mesmo da execução do pipeline.

### 2. Lógica Incremental (`definitions/incremental.js`)
O script Python original exigia a execução de queries manuais de deleção seguidas de inserção. No Dataform, utilizamos o bloco de configuração `type: "incremental"` aliado ao recurso `preOps`.
* **Como funciona:** O Dataform injeta automaticamente o comando `DELETE` (janela dos últimos 7 dias) *antes* de inserir a nova carga de dados.
* **Benefício:** Idempotência garantida. O job pode rodar múltiplas vezes ao dia sem duplicar faturamento.

### 3. Paralelismo Automático (DAG)
Ao contrário do loop (`for task in...`) no Python que rodava um cliente por vez, o Dataform constrói um Grafo Direcionado Acíclico (DAG). Clientes sem dependências entre si são disparados em paralelo para o BigQuery.
* **Benefício:** O tempo de execução para 50 clientes passa a ser equivalente ao processamento de apenas um.

## 📁 Estrutura do Projeto

```text
├── definitions
│   └── incremental.js      # Gerador de macros para a tabela tn_billing
├── includes
│   └── config.js           # Matriz de configuração e status dos clientes
├── workflow_settings.yaml  # Configurações globais do repositório no GCP
└── README.md
```

## 🚀 Como Executar e Testar

1. Clone o repositório ou conecte o ambiente Dataform a esta branch.
2. No Dataform, valide se o **Grafo Compilado** gerou as entidades apenas para os clientes com `status: "ativo"`.
3. Verifique a aba de **Consultas Compiladas** para validar a injeção do bloco `preOps` (comando DELETE) antes do bloco de `SELECT` principal.
4. *(Aviso)*: Em projetos *Sandbox Free Tier*, a execução final pode ser bloqueada por limitações de comandos DML, mas a estrutura arquitetural é 100% aderente ao ambiente de produção.

## Autor

João Batista Rodrigues Ribeiro

Estudante de Engenharia da Computação, Estagio em Dados, Cloud, Automação, IA, SQL, Python e soluções voltadas para organização e melhoria de processos.
