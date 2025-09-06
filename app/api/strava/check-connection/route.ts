import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar conexão com Strava direto no banco
    console.log('🔍 Checking Strava connection for user:', userId)
    
    const { data, error } = await supabase
      .from('strava_tokens')
      .select('access_token, refresh_token')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return NextResponse.json({ 
        userId,
        isConnected: false 
      })
    }

    return NextResponse.json({ 
      userId,
      isConnected: true 
    })
  } catch (error) {
    console.error('Error checking Strava connection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
