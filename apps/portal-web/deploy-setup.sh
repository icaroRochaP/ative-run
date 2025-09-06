#!/bin/bash

# Script para configurar deploy no Dokploy
echo "🚀 Configurando deploy para Dokploy..."

# Limpar cache
echo "🧹 Limpando cache..."
rm -rf .next
rm -rf node_modules

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build local para testar
echo "🔨 Testando build..."
npm run build

echo "✅ Pronto para deploy!"
echo ""
echo "Configure no Dokploy:"
echo "Build Path: apps/portal-web"
echo "Domain: ative.codic.com.br"
