# SmartHive - Gestão Inteligente de Sistemas

![Logo](/public/img//logos/SmartHiveLogo.png) <!-- Substitua pelo caminho correto para o seu logo -->

## ❯ Sobre o Projeto

O **SmartHive** é uma plataforma web completa para a gestão de sistemas, oferecendo portais dedicados tanto para administradores como para clientes. A aplicação permite que os clientes visualizem e interajam com os seus sistemas contratados, enquanto os administradores têm acesso a um dashboard completo para gerir utilizadores, registos de clientes, sistemas e pagamentos.

A plataforma foi construída com foco na modularidade, segurança e experiência de utilizador, utilizando tecnologias modernas como React, TypeScript, Supabase e Stripe.

---

## ✨ Funcionalidades Principais

-   **Autenticação Segura**: Sistema de registo, login, recuperação de palavra-passe e verificação de e-mail.
-   **Dashboards Baseados em Perfis**:
    -   **Portal de Cliente**: Visualização detalhada dos sistemas, pedidos de intervenção e gestão de pagamentos.
    -   **Portal de Administração**: Gestão centralizada de utilizadores, clientes, sistemas e respostas a formulários.
-   **Integração com Stripe**: Processamento de pagamentos para adesão (entrada inicial) e subscrições de manutenção (mensal/anual).
-   **Arquitetura Robusta**: Frontend reativo e modular com gestão de estado eficiente e backend serverless com Edge Functions.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

-   **Frontend**:
    -   [**React**](https://reactjs.org/)
    -   [**Vite**](https://vitejs.dev/)
    -   [**TypeScript**](https://www.typescriptlang.org/)
    -   [**TailwindCSS**](https://tailwindcss.com/)
    -   [**Material-UI**](https://mui.com/)
    -   [**TanStack Query (React Query)**](https://tanstack.com/query/latest)

-   **Backend & Base de Dados**:
    -   [**Supabase**](https://supabase.io/) (Auth, Postgres, Storage, Edge Functions)

-   **Pagamentos**:
    -   [**Stripe**](https://stripe.com/)

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar a aplicação no seu ambiente de desenvolvimento.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
-   [Docker](https://www.docker.com/products/docker-desktop/)
-   [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instalar Dependências do Frontend

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um ficheiro `.env` na raiz do projeto, copiando o exemplo abaixo. Substitua os valores pelas suas chaves Supabase e Stripe.

```env
# Ficheiro: .env

# Supabase
VITE_SUPABASE_URL="URL_DO_SEU_PROJETO_SUPABASE"
VITE_SUPABASE_ANON_KEY="ANON_KEY_DO_SEU_PROJETO_SUPABASE"

# Stripe (necessário para as Edge Functions)
STRIPE_API_KEY="SUA_CHAVE_SECRETA_DO_STRIPE"
STRIPE_WEBHOOK_SECRET="SEU_WEBHOOK_SECRET_DO_STRIPE" # Opcional, para testes locais de webhooks
```

### 4. Configurar e Iniciar o Backend (Supabase)

A forma mais simples de executar o backend é utilizando a Supabase CLI para iniciar um ambiente local completo.

```bash
# Inicia os contentores Docker do Supabase (PostgreSQL, GoTrue, etc.)
supabase start
```

Após a execução, a CLI irá mostrar as URLs e chaves locais, incluindo a `anon key` que deve ser usada em `VITE_SUPABASE_ANON_KEY` para desenvolvimento local.

### 5. Fazer Deploy das Edge Functions

As funções serverless precisam de ser "deployadas" para o ambiente Supabase local.

```bash
# Faz o deploy de todas as funções em supabase/functions
supabase functions deploy
```

### 6. Executar a Aplicação Frontend

Com o backend a correr, inicie o servidor de desenvolvimento do Vite.

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

---



