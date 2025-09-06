#!/bin/bash

# Script para configurar webhook no Strava
echo "🔗 Configurando webhook do Strava..."

# URL do webhook
WEBHOOK_URL="https://ative.codic.com.br/api/strava/webhook"
VERIFY_TOKEN="strava_webhook_verify_token_2024"

echo "📍 URL do webhook: $WEBHOOK_URL"
echo "🔑 Token de verificação: $VERIFY_TOKEN"

echo ""
echo "🚀 Para configurar o webhook no Strava:"
echo ""
echo "1. Acesse: https://developers.strava.com/docs/webhooks/"
echo ""
echo "2. Faça uma requisição POST para criar o webhook:"
echo ""
echo "curl -X POST https://www.strava.com/api/v3/push_subscriptions \\"
echo "  -F client_id=175809 \\"
echo "  -F client_secret=f9d969ef0dae3c92cf4720b0eb4f8d126859ed4a \\"
echo "  -F 'callback_url=$WEBHOOK_URL' \\"
echo "  -F 'verify_token=$VERIFY_TOKEN'"
echo ""
echo "3. Ou use este comando direto:"
echo ""

# Comando curl pronto
echo "curl -X POST https://www.strava.com/api/v3/push_subscriptions \\"
echo "  -F client_id=175809 \\"
echo "  -F client_secret=f9d969ef0dae3c92cf4720b0eb4f8d126859ed4a \\"
echo "  -F 'callback_url=https://ative.codic.com.br/api/strava/webhook' \\"
echo "  -F 'verify_token=strava_webhook_verify_token_2024'"

echo ""
echo "✅ Após executar, você receberá webhooks quando:"
echo "  - Completar uma atividade"
echo "  - Atualizar uma atividade"
echo "  - Deletar uma atividade"
echo ""
echo "📡 Para verificar webhooks existentes:"
echo "curl -G https://www.strava.com/api/v3/push_subscriptions \\"
echo "  -d client_id=175809 \\"
echo "  -d client_secret=f9d969ef0dae3c92cf4720b0eb4f8d126859ed4a"
