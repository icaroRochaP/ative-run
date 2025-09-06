import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

// GET /api/nutrition/consumption/status - Verificar status de consumo
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Verificar autenticação
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Extrair parâmetros da URL
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    // Buscar registros de consumo para a data
    const { data: consumptionLogs, error: fetchError } = await supabase
      .from('meal_consumption_logs')
      .select('recipe_id, id, consumed_at')
      .eq('user_id', user.id)
      .eq('consumed_at', date)

    if (fetchError) {
      console.error('Error fetching consumption status:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch consumption status' },
        { status: 500 }
      )
    }

    const consumedRecipes = (consumptionLogs || []).map((log: any) => ({
      recipeId: log.recipe_id,
      logId: log.id,
      consumedAt: log.consumed_at
    }))

    return NextResponse.json({
      success: true,
      consumedRecipes
    })

  } catch (error) {
    console.error('Unexpected error in GET /api/nutrition/consumption/status:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
