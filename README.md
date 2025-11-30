## 🧠 Desafio Técnico – RAG com NestJS + Ollama (Llama2)

Este projeto implementa um sistema de **RAG (Retrieval Augmented Generation)** utilizando as seguintes tecnologias:

- **NestJS** (Framework Node.js)
- **TypeORM** + **PostgreSQL** (para persistência de dados e vetores)
- **Ollama** (rodando localmente)
  - Modelo **Llama2** para geração de respostas.
  - Modelo **nomic-embed-text** para gerar embeddings.

O projeto oferece um CRUD completo para gerenciar documentos, embeddings e chatbots.

### 🔄 O Fluxo do RAG

O processo de Geração Aumentada por Recuperação (RAG) funciona em duas fases:

1.  **Indexação (Preparation):**
    - Você faz upload de um documento.
    - O sistema quebra o documento em **chunks** (pedaços menores).
    - Gera **embeddings** (vetores numéricos) para cada chunk usando o **Ollama** local.
    - Salva os chunks e seus vetores no banco de dados.
2.  **Consulta (Generation):**
    - O usuário envia uma pergunta (query).
    - É feita uma **busca vetorial por similaridade** no banco para encontrar os chunks mais relevantes.
    - O contexto relevante (os chunks encontrados) é formatado e enviado ao modelo **Llama2**.
    - O chatbot responde à pergunta **exclusivamente com base** no conteúdo do documento.

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

### ✔ Node.js (versão 18+)

[https://nodejs.org/](https://nodejs.org/)

### ✔ PostgreSQL

É necessário criar o banco de dados antes de iniciar a API.

```sql
CREATE DATABASE technical_challenge;
```

### ✔ Instalar o Ollama (Obrigatório)

Baixe e instale o Ollama para rodar modelos de LLM localmente.

[https://ollama.com/download](https://ollama.com/download)

Após a instalação, confirme a versão:

```bash
ollama --version
# Exemplo de saída: ollama version 0.x.x
```

### 🧠 Instalar Modelos Necessários no Ollama

O projeto utiliza dois modelos que devem ser baixados localmente:

| Modelo               | Função                      | Comando de Instalação          |
| :------------------- | :-------------------------- | :----------------------------- |
| **nomic-embed-text** | Geração de Embeddings       | `ollama pull nomic-embed-text` |
| **llama2**           | Geração de Chat (Respostas) | `ollama pull llama2`           |

Confirme a instalação dos modelos:

```bash
ollama list
# Você deve ver:
# llama2:latest
# nomic-embed-text:latest
```

---

## ▶️ Rodando o Projeto

Siga os passos para iniciar a API:

### 1\. Instalar dependências

```bash
npm install
```

### 2\. Configurar variáveis de ambiente

Crie um arquivo **`.env`** na raiz do projeto com as seguintes variáveis:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=technical_challenge

PORT=3000
```

### 3\. Rodar a API

```bash
npm run start
```

A API estará disponível no endereço: **`http://localhost:3000/api`**

---

## 🧪 Testando o Ollama Direto (Verificação de Saúde)

Para garantir que o Ollama está funcionando na porta `11434` e os modelos estão carregados:

### Teste de Geração (`llama2`)

```bash
curl -X POST http://localhost:11434/api/generate \
 -d '{ "model": "llama2", "prompt": "Olá, tudo bem?", "stream": false }'
```

### Teste de Embedding (`nomic-embed-text`)

```bash
curl -X POST http://localhost:11434/api/embeddings \
 -d '{ "model": "nomic-embed-text", "prompt": "teste" }'
```

Se ambos retornarem dados em formato JSON, o Ollama está operacional.

---

## 🧩 Fluxo Completo do Sistema (Como Testar)

Use as rotas da API (`http://localhost:3000/api`) na ordem para testar o fluxo de RAG:

### 1\. Criar um Chatbot

- **Método:** `POST`
- **Rota:** `/api/chatbots`

<!-- end list -->

```json
{
  "name": "Meu chatbot",
  "description": "Chatbot para testes"
}
```

### 2\. Fazer Upload de um Documento

- **Método:** `POST`
- **Rota:** `/api/documents`
  - _(O sistema salva o arquivo no banco e extrai o texto.)_

### 3\. Gerar Embeddings

- **Método:** `POST`
- **Rota:** `/api/embeddings/:documentId`

Este passo irá:

- Dividir o documento em **chunks**.
- Gerar o embedding de cada chunk usando **`nomic-embed-text`**.
- Salvar os vetores no banco de dados.

### 4\. Fazer uma Pergunta usando RAG

- **Método:** `POST`
- **Rota:** `/api/chat/:chatbotId`

<!-- end list -->

```json
{
  "documentId": "id-do-documento",
  "question": "Qual é o assunto principal do documento?"
}
```

A API executará o fluxo de RAG completo:

- Buscar os chunks mais parecidos (similaridade vetorial).
- Montar o prompt com a pergunta e o contexto.
- Enviar para o **Llama2** local.
- Retornar a resposta final.

---

## 🚀 Tecnologias Utilizadas

- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Ollama** (local)
- **Llama2**
- **nomic-embed-text**
- **RAG (Retrieval Augmented Generation)**
- Processamento e chunking de documentos

<!-- end list -->

```

```
