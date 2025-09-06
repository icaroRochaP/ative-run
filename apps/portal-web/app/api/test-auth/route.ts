import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 TEST AUTH: Starting request...')
    
    const supabase = await createServerClient()
    console.log('✅ TEST AUTH: Supabase client created')
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('🔍 TEST AUTH: User check result:', { 
      userId: user?.id, 
      email: user?.email,
      error: authError?.message 
    })
    
    if (authError || !user) {
      console.log('❌ TEST AUTH: User not authenticated')
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: authError?.message || 'No user found'
      }, { status: 401 })
    }

    console.log('✅ TEST AUTH: User authenticated:', user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
