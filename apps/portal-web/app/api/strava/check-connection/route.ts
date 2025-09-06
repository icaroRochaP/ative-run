import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { stravaTokenManager } from '@/lib/strava'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log('🔍 Strava check-connection: Iniciando verificação para userId:', userId)

    if (!userId) {
      console.log('❌ User ID not provided')
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('✅ Strava check-connection: Using admin client for user:', userId)

    // Verificar se usuário tem tokens Strava
    console.log('🔍 Checking Strava connection for user:', userId)
    const isConnected = await stravaTokenManager.isUserConnected(userId)
    console.log('✅ Connection check result:', { userId, isConnected })

    return NextResponse.json({ 
      isConnected: isConnected,
      connected: isConnected, // Manter compatibilidade
      userId 
    })

  } catch (error) {
    console.error('❌ Erro ao verificar conexão Strava:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
