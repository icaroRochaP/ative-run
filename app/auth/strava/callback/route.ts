import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { stravaTokenManager } from '@/lib/strava'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Strava OAuth callback iniciado')
    
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const scope = searchParams.get('scope')

    // Verificar se houve erro na autorização
    if (error) {
      console.error('❌ Erro na autorização Strava:', error)
      return NextResponse.redirect(`${origin}/dashboard?strava_error=${encodeURIComponent(error)}`)
    }

    // Verificar se recebemos o código de autorização
    if (!code) {
      console.error('❌ Código de autorização não recebido')
      return NextResponse.redirect(`${origin}/dashboard?strava_error=no_code`)
    }

    // Verificar o escopo concedido
    if (!scope || !scope.includes('read') || !scope.includes('activity:read_all')) {
      console.error('❌ Escopo insuficiente:', scope)
      return NextResponse.redirect(`${origin}/dashboard?strava_error=insufficient_scope`)
    }

    console.log('✅ Código recebido, trocando por tokens...')

    // Trocar código por tokens
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Erro ao trocar código por tokens:', tokenResponse.status, errorText)
      return NextResponse.redirect(`${origin}/dashboard?strava_error=token_exchange_failed`)
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Tokens recebidos do Strava')

    // Verificar autenticação do usuário
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('❌ Usuário não autenticado:', authError?.message)
      return NextResponse.redirect(`${origin}/auth/signin?message=Faça login para conectar sua conta Strava`)
    }

    console.log('✅ Usuário autenticado:', user.id)

    // Salvar tokens no banco de dados
    await stravaTokenManager.saveTokensForUser(user.id, tokenData, tokenData.athlete)

    console.log('✅ Tokens salvos com sucesso')

    // Redirecionar para dashboard com sucesso
    return NextResponse.redirect(`${origin}/dashboard?strava_connected=true`)

  } catch (error) {
    console.error('❌ Erro no callback Strava:', error)
    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/dashboard?strava_error=callback_error`)
  }
}