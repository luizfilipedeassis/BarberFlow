# BarberFlow

Sistema web acadêmico para gerenciamento de clientes e agendamentos de uma barbearia. O projeto possui um escopo objetivo, organizado e adequado para desenvolvimento e apresentação por um único integrante.

## Objetivo

Permitir que o administrador cadastre clientes, crie horários e gerencie a agenda da barbearia por meio de um CRUD completo, utilizando uma interface moderna, simples e responsiva.

## Tecnologias utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express

### Persistência e versionamento

- Arquivo JSON local
- Git
- GitHub

## Como executar

### Pré-requisitos

- Node.js 18 ou superior
- NPM

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/luizfilipedeassis/BarberFlow.git
   ```

2. Entre na pasta do backend:

   ```bash
   cd BarberFlow/backend
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Inicie o servidor:

   ```bash
   npm start
   ```

5. Acesse `http://localhost:3000` no navegador.

Não abra os arquivos HTML diretamente. O servidor Express deve estar em execução para que a API e a persistência funcionem.

## Acesso ao sistema

```text
Usuário: admin
Senha: admin123
```

## Estrutura do projeto

```text
BarberFlow/
├── backend/
│   ├── controllers/
│   │   ├── appointmentController.js
│   │   ├── clientController.js
│   │   └── storage.js
│   ├── data/
│   │   └── database.json
│   ├── routes/
│   │   ├── appointmentRoutes.js
│   │   └── clientRoutes.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── assets/
│   │   └── logo.svg
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── appointment-form.js
│   │   ├── appointments.js
│   │   ├── clients.js
│   │   ├── common.js
│   │   ├── dashboard.js
│   │   └── login.js
│   ├── pages/
│   │   ├── appointment-form.html
│   │   ├── appointments.html
│   │   ├── clients.html
│   │   └── dashboard.html
│   └── index.html
├── .gitignore
└── README.md
```

## Funcionalidades

- Login administrativo e encerramento de sessão
- Dashboard com indicadores e próximos horários
- Cadastro, listagem e busca de clientes
- Exclusão de clientes com confirmação
- Proteção contra exclusão de clientes com agendamentos
- Cadastro e listagem de agendamentos
- Busca por cliente, serviço ou status
- Edição completa de agendamentos
- Exclusão de agendamentos com confirmação
- Visualização detalhada dos horários e observações
- Status de atendimento: Agendado, Concluído e Cancelado
- Validação para impedir dois atendimentos ativos no mesmo horário
- Persistência em arquivo JSON
- Layout responsivo para computador, tablet e celular

## Rotas da API

### Clientes

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/clients` | Lista os clientes |
| `POST` | `/api/clients` | Cadastra um cliente |
| `DELETE` | `/api/clients/:id` | Exclui um cliente |

### Agendamentos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/appointments` | Lista os agendamentos |
| `GET` | `/api/appointments/:id` | Consulta um agendamento |
| `POST` | `/api/appointments` | Cria um agendamento |
| `PUT` | `/api/appointments/:id` | Atualiza um agendamento |
| `DELETE` | `/api/appointments/:id` | Exclui um agendamento |

## Persistência dos dados

Os clientes e agendamentos são armazenados em `backend/data/database.json`. Não é necessário instalar ou configurar um banco de dados externo.

## Repositório

[GitHub - BarberFlow](https://github.com/luizfilipedeassis/BarberFlow)

## Vídeo de demonstração

[Assistir à demonstração do BarberFlow](https://youtu.be/vUOag-XincY)

## Autor

Luiz Filipe de Assis Pereira
