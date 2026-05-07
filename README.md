# CRUD Users Full Stack

API REST Full Stack para gerenciamento de usuários utilizando Node.js, Express e PostgreSQL.

## 🚀 Tecnologias

- Node.js
- Express
- PostgreSQL
- JavaScript
- Dotenv
- Nodemon
- JWT Authentication
- Bcrypt

## 📌 Funcionalidades

- Criar usuário
- Listar usuários
- Buscar usuário por ID
- Atualizar usuário
- Deletar usuário
- Login com JWT
- Rotas protegidas
- Middleware de autenticação
- Validação de dados
- Senhas criptografadas com bcrypt

## 📂 Estrutura do Projeto

backend/
├── src/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── routes/
│ └── server.js

## 🔗 Endpoints

### Usuários

GET /users

GET /users/:id

POST /users

PUT /users/:id

DELETE /users/:id

### Autenticação

POST /login

## 🔒 Autenticação JWT

Rotas protegidas utilizam JWT Bearer Token.

Exemplo Header:

Authorization: Bearer seu_token_jwt

## ⚙️ Como rodar o projeto

### Instalar dependências

```bash
npm install
```

### Rodar servidor

```bash
npm run dev
```

## 🗄️ Banco de Dados

PostgreSQL

## 📈 Status do Projeto

🚧 Em desenvolvimento

## 📚 Aprendizados

Este projeto foi desenvolvido com foco em:

- API REST
- Arquitetura backend
- PostgreSQL
- Middleware
- JWT Authentication
- Segurança backend
- CRUD completo
- Integração banco de dados