import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { stravaTokenManager } from '@/lib/strava'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar autenticação
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remover tokens Strava
    await stravaTokenManager.removeTokensForUser(userId)

    return NextResponse.json({ 
      success: true,
      message: 'Conta Strava desconectada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao desconectar Strava:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
