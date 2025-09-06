# Ative Run - IA Coach para Strava

## 🏃‍♂️ **Sobre o Projeto**

Ative Run é um serviço de IA que atua como um "treinador de corrida de bolso", integrando-se ao Strava e WhatsApp para fornecer análises personalizadas e acionáveis de treinos para corredores amadores.

## 🏗️ **Arquitetura do Monorepo**

Este projeto utiliza **Turborepo** para gerenciar um monorepo com:

```
ative-run/
├── apps/
│   ├── portal-web/          # Portal web (Next.js)
│   └── servico-ia/          # Backend + IA (Python/FastAPI)
├── packages/
│   ├── ui/                  # Componentes compartilhados
│   ├── config/             # Configurações compartilhadas
│   └── shared-types/       # Tipos TypeScript compartilhados
├── docs/                   # Documentação do projeto
└── docker/                 # Arquivos Docker
```

## 🚀 **Quick Start**

### 1. Instalação
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### 2. Desenvolvimento
```bash
# Executar todos os serviços
npm run dev

# Executar apenas o portal web
npm run dev:portal

# Executar apenas o serviço de IA
npm run dev:ia
```

### 3. Build
```bash
# Build de todos os serviços
npm run build

# Build específico
npm run build:portal
npm run build:ia
```

## 🎯 **Status do Projeto**

### ✅ **Portal Web (apps/portal-web)**
- **Framework:** Next.js 15.5.2 + TypeScript
- **UI:** Tailwind CSS + Shadcn/UI
- **Autenticação:** Supabase Auth
- **Funcionalidades:**
  - ✅ Sistema de login/cadastro
  - ✅ Dashboard completo
  - ✅ Integração Strava (OAuth + API)
  - ✅ Gestão de atividades
  - ✅ Interface responsiva

### 🚧 **Serviço de IA (apps/servico-ia)**
- **Framework:** Python + FastAPI
- **IA:** CrewAI para agentes
- **Fila:** Redis + Celery
- **Status:** Estrutura criada, implementação pendente

## 🔧 **Tecnologias**

### Frontend (Portal Web)
- **Next.js 15.5.2** - Framework React
- **TypeScript** - Linguagem
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Componentes
- **Supabase** - Backend as a Service

### Backend (Serviço IA)
- **Python 3.11** - Linguagem
- **FastAPI** - Framework web
- **CrewAI** - Agentes de IA
- **Redis** - Cache e filas
- **Celery** - Processamento assíncrono

### Integrações
- **Strava API** - Dados de atividades
- **Supabase** - Banco de dados + Auth
- **WhatsApp (Evolution API)** - Comunicação
- **Stripe** - Pagamentos

## 📖 **Documentação**

- **[docs/prd.md](docs/prd.md)** - Product Requirements Document
- **[docs/brief.md](docs/brief.md)** - Briefing do projeto
- **[docs/architect.md](docs/architect.md)** - Arquitetura técnica
- **[STRAVA_INTEGRATION.md](STRAVA_INTEGRATION.md)** - Integração Strava

## 🌐 **URLs de Desenvolvimento**

- **Portal Web:** http://localhost:3000
- **API IA:** http://localhost:8000 (quando implementado)

## 🔑 **Variáveis de Ambiente**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Strava
NEXT_PUBLIC_STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=

# Stripe (futuro)
STRIPE_SECRET_KEY=
```

## 🚀 **Próximos Passos**

1. **Implementar Backend IA** (servico-ia)
2. **Configurar WhatsApp Integration**
3. **Implementar análise de treinos com CrewAI**
4. **Configurar Stripe para pagamentos**
5. **Deploy para produção**

---

**Status Atual:** Portal Web funcionando ✅ | Backend IA em desenvolvimento 🚧
