# Deploy Guide - Ative Run

## Informações do Deploy

- **Domínio**: ative.codic.com.br
- **Plataforma**: Nixpacks
- **Framework**: Next.js 15 (Monorepo)
- **Node.js**: >= 18.0.0
- **Package Manager**: pnpm

## Estrutura do Monorepo

```
ative-run/
├── apps/
│   └── portal-web/          # Next.js App Principal
├── packages/                # Pacotes compartilhados (futuro)
├── nixpacks.toml           # Configuração Nixpacks
├── turbo.json              # Configuração Turbo
└── pnpm-workspace.yaml     # Workspace configuration
```

## Configuração do Ambiente

1. **Copie o arquivo de ambiente**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure as variáveis obrigatórias**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STRAVA_CLIENT_ID`
   - `STRAVA_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`

## Scripts de Build

- `pnpm install --frozen-lockfile` - Instalar dependências
- `pnpm run build` - Build de produção
- `pnpm start` - Iniciar servidor de produção

## Configuração do Nixpacks

O arquivo `nixpacks.toml` está configurado para:

1. **Setup**: Node.js 20 + pnpm
2. **Install**: Instalar dependências com lockfile
3. **Build**: Build do projeto completo via Turbo
4. **Start**: Iniciar aplicação Next.js
5. **Static Assets**: Servir arquivos estáticos

## Verificação Pré-Deploy

Antes do deploy, certifique-se de:

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Supabase está funcionando corretamente
- [ ] Strava API está configurada
- [ ] Build local funciona: `pnpm run build`
- [ ] Aplicação inicia: `pnpm start`

## Comandos para Deploy

```bash
# 1. Clone o repositório
git clone https://github.com/icaroRochaP/ative-run.git
cd ative-run

# 2. Configure ambiente
cp .env.example .env.local
# Edite .env.local com suas variáveis

# 3. Deploy com Nixpacks
nixpacks build . --name ative-run
nixpacks start ative-run
```

## Monitoramento

A aplicação estará disponível em:
- **URL**: https://ative.codic.com.br
- **Health Check**: https://ative.codic.com.br/api/health
- **Status**: https://ative.codic.com.br/api/status

## Troubleshooting

### Build Failures
1. Verifique se todas as dependências estão no lockfile
2. Confirme se Node.js >= 18
3. Verifique variáveis de ambiente obrigatórias

### Runtime Errors
1. Verifique logs do Nixpacks
2. Confirme conexão com Supabase
3. Verifique configuração do Strava API

## Backup e Rollback

- **Database**: Backup automático via Supabase
- **Code**: Rollback via git tags
- **Environment**: Backup das variáveis .env

## Support

Para suporte, verifique:
1. Logs do Nixpacks
2. Issues no GitHub
3. Documentação do Next.js
4. Supabase Dashboard
