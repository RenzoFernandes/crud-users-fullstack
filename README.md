# CRUD Users Full Stack

Aplicacao full stack para gerenciamento de usuarios com autenticacao JWT, API REST em Node.js, banco PostgreSQL e interface responsiva em React.

O projeto simula um fluxo real de cadastro, login, protecao de rotas e gerenciamento dos dados do usuario autenticado. A interface foi pensada para ser objetiva, limpa e adaptada para desktop e mobile.

O frontend tambem conta com feedback visual profissional usando toasts, estados de carregamento em botoes e confirmacao antes de acoes destrutivas.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-111827?style=for-the-badge&logo=react&logoColor=white)

## Sobre o projeto

Este projeto foi desenvolvido para praticar e demonstrar conceitos importantes de desenvolvimento full stack:

- Criacao de API REST com Node.js e Express
- Integracao com banco de dados PostgreSQL
- Cadastro e login de usuarios
- Criptografia de senhas com bcrypt
- Autenticacao com JSON Web Token
- Middleware para rotas protegidas
- Controle de acesso por usuario autenticado
- Interface responsiva com React, Vite e Tailwind CSS
- Feedback visual com React Hot Toast
- Loading states em acoes do usuario

## Funcionalidades

- Criar usuario
- Fazer login
- Gerar token JWT
- Listar os dados do usuario autenticado
- Buscar usuario por ID
- Atualizar nome, email e telefone
- Excluir usuario
- Confirmar exclusao antes de remover a conta
- Proteger rotas privadas no backend
- Validar dados antes de criar ou atualizar usuarios
- Consumir a API pelo frontend com Axios
- Exibir mensagens de sucesso e erro com toasts
- Mostrar estados de carregamento nos botoes de login, criacao, edicao e exclusao
- Tratar erros de API com mensagens amigaveis

## Tecnologias utilizadas

**Frontend**

- React
- Vite
- Tailwind CSS
- Axios
- React Hot Toast

**Backend**

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- dotenv
- CORS
- Nodemon

## Estrutura do projeto

```text
crud-users-fullstack/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |   `-- database.js
|   |   |-- controllers/
|   |   |   `-- userController.js
|   |   |-- middlewares/
|   |   |   |-- authMiddleware.js
|   |   |   `-- validateUser.js
|   |   |-- routes/
|   |   |   `-- userRoutes.js
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- main.css
|   |-- index.html
|   |-- vite.config.js
|   `-- package.json
|
`-- README.md
```

## Endpoints da API

| Metodo | Rota | Descricao | Autenticacao |
| --- | --- | --- | --- |
| GET | `/` | Verifica se a API esta rodando | Nao |
| POST | `/users` | Cria um novo usuario | Nao |
| POST | `/login` | Autentica usuario e retorna JWT | Nao |
| GET | `/users` | Lista os dados do usuario logado | Sim |
| GET | `/users/:id` | Busca usuario por ID | Sim |
| PUT | `/users/:id` | Atualiza usuario | Sim |
| DELETE | `/users/:id` | Exclui usuario | Sim |

As rotas privadas utilizam o header:

```http
Authorization: Bearer seu_token_jwt
```

## Como rodar localmente

### 1. Clone o repositorio

```bash
git clone https://github.com/seu-usuario/crud-users-fullstack.git
cd crud-users-fullstack
```

### 2. Configure o backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro da pasta `backend`:

```env
PORT=3000
DB_USER=seu_usuario
DB_HOST=localhost
DB_NAME=seu_banco
DB_PASSWORD=sua_senha
DB_PORT=5432
JWT_SECRET=sua_chave_secreta
```

Execute o servidor:

```bash
npm run dev
```

A API ficara disponivel em:

```text
http://localhost:3000
```

### 3. Configure o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficara disponivel em:

```text
http://localhost:5173
```

## Banco de dados

O projeto utiliza PostgreSQL. A tabela principal esperada pela aplicacao e:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Interface

A interface foi desenvolvida em React com foco em simplicidade e usabilidade:

- Layout compacto para desktop
- Design responsivo para mobile
- Formularios de login, cadastro e edicao
- Painel com dados do usuario autenticado
- Feedback visual com notificacoes toast
- Estados de carregamento nos botoes durante requisicoes
- Confirmacao antes da exclusao da conta
- Mensagens amigaveis para erros de autenticacao, token e conexao

## Preview

### Login e Dashboard

![Dashboard](./screenshots/dashboard.png)

### Edição de Usuário

![Editar Usuário](./screenshots/edit-user.png)

## Aprendizados

Durante o desenvolvimento foram aplicados conceitos de:

- Separacao entre frontend e backend
- Arquitetura MVC simplificada no backend
- Boas praticas em rotas protegidas
- Consumo de API REST no React
- Persistencia de token no navegador
- Tratamento de erros em requisicoes HTTP
- Design responsivo com Tailwind CSS
- UX com feedback visual nao bloqueante
- Controle de estados de carregamento por acao

## Status

Projeto funcional e em evolucao.

## Autor

Desenvolvido por Renzo Heiki.
