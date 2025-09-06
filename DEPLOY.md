# Deploy - Ative Run

## Configuração para Deploy em ative.codic.com.br

### Estrutura do Monorepo
```
ative-run/
├── apps/
│   ├── portal-web/          # Frontend Next.js (Port 3000)
│   └── servico-ia/          # Backend IA Service (Port 3001)
├── packages/                # Pacotes compartilhados
├── docker/                  # Configurações Docker
└── turbo.json              # Configuração Turborepo
```

### Configuração de Domínio
- **Domínio Principal**: ative.codic.com.br
- **Frontend**: ative.codic.com.br (porta 3000)
- **API IA**: ative.codic.com.br/api/ia (porta 3001)

### Variáveis de Ambiente

#### Portal Web (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# Strava Integration
NEXT_PUBLIC_STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
NEXT_PUBLIC_STRAVA_REDIRECT_URI=https://ative.codic.com.br/auth/strava/callback

# App
NEXT_PUBLIC_APP_URL=https://ative.codic.com.br
NEXTAUTH_URL=https://ative.codic.com.br
NEXTAUTH_SECRET=
```

#### Serviço IA (.env)
```bash
# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Server
PORT=3001
NODE_ENV=production
```

### Scripts de Deploy

#### Desenvolvimento
```bash
npm run dev              # Todos os serviços
npm run dev:portal       # Apenas portal web
npm run dev:ia          # Apenas serviço IA
```

#### Produção
```bash
npm run build           # Build todos os serviços
npm run build:portal    # Build apenas portal
npm run build:ia        # Build apenas serviço IA
```

### Docker (Opcional)
```bash
# Build e execução com Docker Compose
cd docker
docker-compose up -d
```

### Nginx Proxy (Servidor)
```nginx
server {
    listen 80;
    server_name ative.codic.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ative.codic.com.br;
    
    ssl_certificate /path/to/ssl/cert.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API IA Service
    location /api/ia/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Configuration (pm2.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'ative-portal-web',
      cwd: './apps/portal-web',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'ative-servico-ia',
      cwd: './apps/servico-ia',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
}
```

### Steps para Deploy

1. **Clonar repositório**
   ```bash
   git clone https://github.com/icaroRochaP/ative-run.git
   cd ative-run
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   # Editar .env.local com as configurações corretas
   ```

4. **Build para produção**
   ```bash
   npm run build
   ```

5. **Configurar proxy reverso (Nginx)**
   - Copiar configuração nginx acima
   - Configurar SSL com Let's Encrypt

6. **Iniciar aplicação**
   ```bash
   # Com PM2
   pm2 start pm2.config.js
   pm2 save
   pm2 startup
   
   # Ou manualmente
   npm run start
   ```

### Monitoramento
- **Logs**: `pm2 logs`
- **Status**: `pm2 status`
- **Restart**: `pm2 restart all`

### Backup
- Database: Backup automático Supabase
- Código: Git repository
- Assets: Backup pasta public/

### Troubleshooting
- Verificar logs com `pm2 logs`
- Checar portas com `netstat -tlnp`
- Verificar SSL com `ssl-checker.net`
- Testar APIs com `curl`
