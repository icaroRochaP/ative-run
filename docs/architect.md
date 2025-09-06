# Documento de Arquitetura Fullstack: IA Coach para Strava

### **Seção 1: Arquitetura de Alto Nível**

#### **Resumo Técnico**
A arquitetura proposta é um sistema orientado a eventos, desacoplado e distribuído em um monorepo. A interação do usuário começa no WhatsApp e é orquestrada por um backend em Python (FastAPI), que delega tarefas de IA pesadas para workers assíncronos (Celery/Redis). Um portal web minimalista em Next.js cuidará do autogerenciamento da conta. A plataforma utilizará o Supabase para persistência de dados e autenticação, com integrações externas com Stripe, Strava e Evolution API.

#### **Plataforma e Infraestrutura**
* **Provedor de Nuvem**: Oracle Cloud (infraestrutura existente).
* **Plataforma de Deploy**: Dokploy (serviços Dockerizados).
* **Banco de Dados e Auth**: Supabase.
* **Fila de Mensagens**: Redis (gerenciado via Dokploy).

#### **Estrutura do Repositório: Monorepo**
* **Ferramenta**: Turborepo, para gerenciamento eficiente de build e cache.
* **Organização**: O monorepo conterá as aplicações `servico-ia` (Python) e `portal-web` (Next.js) como pacotes independentes, além de pacotes compartilhados.

#### **Diagrama de Alto Nível**
```mermaid
graph TD
    subgraph Usuário
        A[Cliente no WhatsApp]
    end

    subgraph Plataforma Externa
        B[Evolution API]
        C[Strava API]
        D[Stripe API]
    end

    subgraph Nossa Infraestrutura (Oracle Cloud via Dokploy)
        E[API Principal (FastAPI)]
        F[Portal de Conta (Next.js)]
        G[Worker de IA (Python/Celery)]
        H[Fila (Redis)]
        I[DB (Supabase)]
    end

    A -- Interage --> B; B -- Webhooks --> E; E -- Tarefa --> H; G -- Consome --> H; G -- Processa --> I; E -- Gerencia --> F; F -- Autentica --> I; E -- API Call --> C; E -- API Call --> D; F -- API Call --> D; F -- API Call --> C; G -- Notifica --> E; E -- Resposta --> B;
Seção 2: Stack de Tecnologias (Formato de Lista)
Linguagem (Frontend)

Tecnologia: TypeScript

Versão (Alvo): ~5.x

Propósito: Linguagem principal do portal web.

Framework (Frontend)

Tecnologia: Next.js

Versão (Alvo): ~14.x

Propósito: Framework React para o portal.

Estilo (Frontend)

Tecnologia: Tailwind CSS

Versão (Alvo): ~3.x

Propósito: Framework de CSS utilitário.

Componentes (Frontend)

Tecnologia: Shadcn/UI

Versão (Alvo): Última

Propósito: Componentes de UI acessíveis.

Linguagem (Backend)

Tecnologia: Python

Versão (Alvo): ~3.11

Propósito: Linguagem principal da IA e API.

Framework (Backend)

Tecnologia: FastAPI

Versão (Alvo): Última

Propósito: Framework para a API principal.

Agentes de IA

Tecnologia: CrewAI

Versão (Alvo): Última

Propósito: Orquestração dos agentes de IA.

Banco de Dados

Tecnologia: PostgreSQL (via Supabase)

Versão (Alvo): ~15.x

Propósito: Banco de dados relacional e vetorial.

Autenticação

Tecnologia: Supabase Auth

Versão (Alvo): N/A

Propósito: Gerenciamento de usuários e OAuth.

Fila de Tarefas

Tecnologia: Redis / Celery

Versão (Alvo): Última

Propósito: Processamento assíncrono das análises.

Pagamentos

Tecnologia: Stripe

Versão (Alvo): N/A

Propósito: Processamento de assinaturas.

WhatsApp API

Tecnologia: Evolution API

Versão (Alvo): Self-Hosted

Propósito: Comunicação com o usuário.

Deploy

Tecnologia: Docker / Dokploy

Versão (Alvo): N/A

Propósito: Conteinerização e orquestração.

CI/CD

Tecnologia: Dokploy Git Provider

Versão (Alvo): N/A

Propósito: Automação de build e deploy.

Observabilidade

Tecnologia: Sentry & OpenTelemetry

Versão (Alvo): N/A

Propósito: Rastreamento de erros e performance distribuída.

Testes E2E

Tecnologia: Playwright

Versão (Alvo): Última

Propósito: Testes de ponta a ponta.

Seção 3: Modelo de Dados Final
Tabela auth.users: Gerenciada pelo Supabase para autenticação, usada como fonte da verdade para id, email, e nome de exibição.

Tabela public.profiles: Armazena o stripe_customer_id do usuário, com id referenciando auth.users.id.

Tabelas public.products e public.prices: Armazenam os dados dos planos e preços do Stripe para evitar hard-coding.

Tabela public.subscriptions: Rastreia o status da assinatura de cada usuário.

Tabela public.strava_tokens: Armazena de forma segura os tokens OAuth do Strava.

Tabela public.activities: Armazena os dados brutos do treino e o insight gerado pela IA.

Seção 4: Especificação da API (OpenAPI 3.0)
A API seguirá o padrão OpenAPI. O próprio FastAPI irá gerar a documentação interativa baseada no nosso código. Abaixo um exemplo da estrutura.

YAML

openapi: 3.0.1
info:
  title: IA Coach para Strava API
  version: 1.0.0
  description: API para gerenciar usuários, assinaturas e processamento de treinos do Strava.
servers:
  - url: /api
    description: Servidor Principal

paths:
  /users:
    post:
      summary: Cria um novo usuário
      description: Endpoint chamado pelo bot do WhatsApp para iniciar o cadastro.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email: { type: string, format: email }
                full_name: { type: string }
                phone_number: { type: string }
      responses:
        '201':
          description: Usuário criado, retorna o token de ativação.
        '409':
          description: Conflito, o e-mail já existe.

  /webhooks/stripe:
    post:
      summary: Recebe eventos do Stripe
      description: Endpoint para receber webhooks do Stripe (ex: pagamento confirmado).
      responses:
        '200':
          description: Webhook recebido com sucesso.

  /webhooks/strava:
    post:
      summary: Recebe eventos do Strava
      description: Endpoint para receber webhooks de novas atividades.
      responses:
        '200':
          description: Webhook recebido e atividade enfileirada.
Seção 5: Componentes e Estratégia de IA
O sistema é dividido em componentes lógicos (Bot de Onboarding, Serviço de Usuários, Serviço de Pagamentos, Integração Strava, Serviço de Análise de IA, Serviço de Notificação, Portal de Conta). As ferramentas da IA serão organizadas em um diretório tools/ dedicado. A IA de vendas usará RAG (Retrieval-Augmented Generation) com uma base de conhecimento curada manualmente para o MVP para garantir respostas de alta qualidade e especializadas.

Seção 6: APIs Externas
Integrações críticas com Stripe (pagamentos), Strava (OAuth e webhooks de atividade) e Evolution API (mensagens WhatsApp). A estratégia para a Evolution API (não oficial) envolve "aquecer" o número e simular comportamento humano para mitigar o risco de banimento, com a arquitetura abstraída para permitir uma futura troca fácil por uma API oficial (ex: Twilio).

Seção 7: Fluxos de Trabalho Principais
Fluxo 1: Onboarding e Assinatura do Usuário
Snippet de código

sequenceDiagram
    participant User as Usuário
    participant WhatsApp as WhatsApp (Evolution)
    participant API as API Principal (FastAPI)
    participant Portal as Portal Web (Next.js)
    participant DB as Supabase DB/Auth
    participant Stripe as Stripe API

    User->>WhatsApp: Olá!
    WhatsApp->>API: Webhook: Mensagem recebida
    API->>WhatsApp: Boas-vindas e explicação
    User->>WhatsApp: Fornece e-mail
    WhatsApp->>API: Webhook: E-mail recebido
    API->>DB: Cria usuário "pendente"
    API->>API: Gera Link Mágico de ativação
    API->>WhatsApp: Envia link para o portal

    User->>Portal: Acessa o link mágico
    Portal->>API: Valida o token
    API-->>Portal: Token OK, sessão criada
    Portal->>User: Exibe tela para criar senha
    User->>Portal: Envia nova senha
    Portal->>API: Define senha
    API->>DB: Atualiza usuário para "ativo"

    Portal->>User: Exibe tela para conectar Strava
    User->>Portal: Inicia fluxo OAuth Strava
    
    Portal->>User: Exibe tela de assinatura
    User->>Portal: Clica em "Assinar"
    Portal->>API: Solicita sessão de checkout
    API->>Stripe: Cria cliente e sessão
    Stripe-->>API: Retorna URL de checkout
    API-->>Portal: Envia URL
    Portal->>User: Redireciona para o Stripe

    Stripe-->>API: Webhook: Pagamento bem-sucedido
    API->>DB: Cria/Atualiza assinatura
    
    API->>WhatsApp: Envia mensagem final
    WhatsApp->>User: "Tudo pronto!"
Fluxo 2: Análise de uma Nova Atividade
Snippet de código

sequenceDiagram
    participant Strava
    participant API as API Principal (FastAPI)
    participant Queue as Fila (Redis)
    participant Worker as Worker de IA (Celery)
    participant DB as Supabase DB
    participant WhatsApp as WhatsApp (Evolution)
    participant User as Usuário

    Strava->>API: Webhook: Nova atividade
    API->>DB: Salva dados brutos
    API->>Queue: Enfileira tarefa `analisar_atividade(id)`
    API-->>Strava: Responde 200 OK (imediatamente)
    
    Worker->>Queue: Pega tarefa
    Worker->>DB: Lê dados brutos
    Worker->>Worker: Executa CrewAI para gerar insight
    Worker->>DB: Salva texto do insight
    Worker->>Queue: Enfileira tarefa `enviar_insight(id)`

    Worker->>Queue: Pega tarefa de envio
    Worker->>DB: Lê insight e telefone do usuário
    Worker->>WhatsApp: Envia mensagem com o insight
    WhatsApp->>User: Entrega do insight
Seção 8: Esquema do Banco de Dados (SQL DDL)
SQL

-- Habilita a extensão para criptografia (para os tokens do Strava)
-- A ser executado uma vez no Supabase
-- CREATE EXTENSION IF NOT EXISTS pgsodium;

-- Tabela de Perfis para armazenar dados específicos da aplicação
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE
);
-- Política de Segurança: Usuários só podem ver e editar seu próprio perfil.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tabela de Produtos do Stripe
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active BOOLEAN,
  name TEXT,
  description TEXT,
  stripe_product_id TEXT UNIQUE
);

-- Tabela de Preços dos Produtos
CREATE TABLE public.prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id),
  active BOOLEAN,
  unit_amount BIGINT,
  currency TEXT,
  type TEXT,
  "interval" TEXT,
  stripe_price_id TEXT UNIQUE
);

-- Tabela de Assinaturas dos Usuários
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT,
  price_id UUID REFERENCES public.prices(id),
  stripe_subscription_id TEXT UNIQUE,
  current_period_end TIMESTAMPTZ
);
-- Índice para buscar assinaturas por usuário rapidamente
CREATE INDEX ON public.subscriptions (user_id);

-- Tabela para Tokens do Strava
CREATE TABLE public.strava_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Usaremos a criptografia do Supabase (pgsodium) para estes campos
  access_token TEXT, -- Deve ser criptografado na aplicação antes de salvar
  refresh_token TEXT, -- Deve ser criptografado na aplicação antes de salvar
  expires_at TIMESTAMPTZ
);

-- Tabela de Atividades do Strava
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strava_activity_id BIGINT UNIQUE,
  raw_data JSONB,
  ai_insight TEXT,
  status TEXT DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Índice para buscar atividades por usuário rapidamente
CREATE INDEX ON public.activities (user_id);
Seção 9: Estrutura Unificada do Projeto (Monorepo)
Plaintext

/ia-coach-strava/
|
|-- .github/                    # Arquivos de CI/CD para o GitHub Actions
|   `-- workflows/
|       |-- ci.yml              # Roda testes e lint a cada push
|       `-- deploy.yml          # Script de deploy para o Dokploy
|
|-- apps/                       # Nossas aplicações principais
|   |
|   |-- portal-web/             # A aplicação frontend (Next.js)
|   |   |-- app/                # Estrutura do Next.js App Router
|   |   |-- components/         # Componentes React específicos do portal
|   |   `-- package.json
|   |
|   `-- servico-ia/             # A aplicação backend (Python/FastAPI)
|       |-- app/                # Core da aplicação FastAPI
|       |   |-- api/            # Endpoints da API
|       |   |-- workers/        # Lógica dos workers Celery
|       |   |-- agents/         # Definições dos agentes CrewAI
|       |   |-- tasks/          # Definições das tarefas CrewAI
|       |   `-- tools/          # Ferramentas da IA (Stripe, Strava, etc.)
|       |-- tests/
|       `-- pyproject.toml      # Gerenciamento de dependências Python
|
|-- packages/                   # Código compartilhado entre as aplicações
|   |
|   |-- ui/                     # Componentes React compartilhados (ex: botões, inputs)
|   |   `-- package.json
|   |
|   |-- config/                 # Configurações compartilhadas de lint e typescript
|   |   |-- eslint-preset.js
|   |   `-- tsconfig.json
|   |
|   `-- shared-types/           # Nossas interfaces TypeScript compartilhadas
|       |-- index.ts
|       `-- package.json
|
|-- .env.example                # Template para variáveis de ambiente
|-- turbo.json                  # Arquivo de configuração do Turborepo
|-- package.json                # Gerenciador do monorepo (workspaces)
`-- README.md
Seção 10: Fluxo de Trabalho de Desenvolvimento
Setup do Ambiente Local
1. Pré-requisitos:

Node.js (~v20.x)

Python (~v3.11)

Docker

Turborepo CLI (npm install -g turbo)

2. Instalação Inicial:

Bash

# Instalar todas as dependências do monorepo
npm install
# Criar o arquivo de variáveis de ambiente a partir do exemplo
cp .env.example .env
# Preencher as variáveis no arquivo .env
3. Comandos de Desenvolvimento:

Bash

# Rodar TODAS as aplicações em modo de desenvolvimento
turbo run dev

# Rodar APENAS o frontend (portal-web)
turbo run dev --filter=portal-web

# Rodar APENAS o backend (servico-ia)
turbo run dev --filter=servico-ia

# Rodar todos os testes do projeto
turbo run test
Configuração de Ambiente (.env.example)
Bash

# Supabase
SUPABASE_URL="sua_url_do_supabase"
SUPABASE_ANON_KEY="sua_chave_anon_do_supabase"
DATABASE_URL="sua_string_de_conexao_com_o_postgres"

# Stripe
STRIPE_SECRET_KEY="sua_chave_secreta_do_stripe"
STRIPE_WEBHOOK_SECRET="seu_segredo_do_webhook_do_stripe"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="sua_chave_publica_do_stripe"

# Strava
STRAVA_CLIENT_ID="seu_client_id_do_strava"
STRAVA_CLIENT_SECRET="seu_client_secret_do_strava"

# OpenAI
OPENAI_API_KEY="sua_chave_da_openai"

# Evolution API
EVOLUTION_API_URL="url_da_sua_evolution_api"
EVOLUTION_API_KEY="sua_chave_da_evolution_api"

# Redis
REDIS_URL="redis://localhost:6379"
Seção 11: Arquitetura de Deploy
Estratégia de Deploy
Frontend (portal-web): A aplicação Next.js será compilada e servida como um servidor Node.js independente dentro de um container Docker, construído pelo Nixpacks via Dokploy.

Backend (servico-ia): A aplicação FastAPI e o worker Celery serão empacotados em um container Docker, construído pelo Nixpacks via Dokploy.

Pipeline de Automação (100% Dokploy)
O processo será totalmente gerenciado pela integração nativa do Dokploy com o GitHub.

Configuração no Dokploy: Dois serviços (portal-web, servico-ia) serão configurados, cada um apontando para o mesmo repositório, mas com "Diretórios Raiz" diferentes (/apps/portal-web e /apps/servico-ia).

Trigger de Deploy: Em ambos os serviços, a opção "Automatic Deployments" será ativada para a branch main.

Processo Automatizado: Um git push para a main notificará o Dokploy, que iniciará o processo de build para ambos os serviços usando o Nixpacks, e então fará o deploy das novas versões.

Ambientes
Desenvolvimento: http://localhost:3000 - Ambiente local na máquina do desenvolvedor.

Produção: app.seusite.com (Exemplo) - Ambiente vivo, acessível para os usuários finais.

Seção 12: Segurança e Performance
Requisitos de Segurança
Frontend: Uso de cookies HttpOnly e Secure para tokens, cabeçalhos de segurança (CSP), e validação de formulários.

Backend: Validação rigorosa de API com Pydantic, rate limiting em endpoints sensíveis e gerenciamento de segredos via Dokploy.

Otimização de Performance
Frontend: Aproveitamento dos recursos nativos do Next.js (code-splitting, otimização de imagens, SSG).

Backend: Uso de processamento assíncrono com Redis/Celery como estratégia principal e índices no banco de dados para consultas rápidas.

Seção 13: Estratégia de Testes
Filosofia: Foco em testes que garantem a confiança nas funcionalidades principais.

Frontend: Testes unitários e de integração de componentes com Vitest e React Testing Library.

Backend: Testes unitários e de integração com Pytest.

Ponta a Ponta (E2E): Testes para as jornadas críticas do usuário com Playwright.

Seção 14: Padrões de Código (Coding Standards)
Formatação e Qualidade: Uso de ESLint/Prettier para o frontend e Black/Ruff para o backend, com configurações compartilhadas no monorepo.

Tipagem Estrita: Todo o código TypeScript e Python deve usar anotações de tipo de forma estrita.

Variáveis de Ambiente: O acesso deve ser feito através de um módulo de configuração validado, nunca diretamente.

Seção 15: Estratégia de Tratamento de Erros
Fluxo Padrão: Erros devem ser capturados, enviados ao Sentry com detalhes técnicos completos, e uma resposta de erro padronizada e amigável deve ser retornada ao usuário/API.

Formato de Erro da API: {"error": {"code": "CODIGO_DO_ERRO", "message": "Descrição clara do erro."}}

Seção 16: Observabilidade
A estratégia utilizará OpenTelemetry para rastreamento distribuído. Tanto a API FastAPI quanto o Worker Celery serão instrumentados com o SDK do OpenTelemetry, e os "traces" (rastros) serão enviados ao Sentry para visualização e análise de ponta a ponta, permitindo diagnosticar gargalos e erros de forma cirúrgica.