import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

// POST /api/nutrition/consumption - Marcar refeição como consumida
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { recipeId, consumedAt } = body

    // Validar dados obrigatórios
    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      )
    }

    // Usar data atual se não fornecida
    const consumptionDate = consumedAt || new Date().toISOString().split('T')[0]

    // Inserir registro de consumo (ON CONFLICT DO NOTHING para evitar duplicatas)
    const { data: consumptionLog, error: insertError } = await supabase
      .from('meal_consumption_logs')
      .insert({
        user_id: user.id,
        recipe_id: recipeId,
        consumed_at: consumptionDate
      })
      .select('id, consumed_at')
      .single()

    if (insertError) {
      // Se erro é por violação de constraint (duplicata), retornar sucesso 
      if (insertError.code === '23505') {
        return NextResponse.json({
          success: true,
          logId: null,
          consumedAt: consumptionDate,
          message: 'Meal already marked as consumed'
        })
      }
      
      console.error('Error inserting consumption log:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to mark meal as consumed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      logId: consumptionLog.id,
      consumedAt: consumptionLog.consumed_at
    })

  } catch (error) {
    console.error('Unexpected error in POST /api/nutrition/consumption:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/nutrition/consumption - Desmarcar refeição consumida  
export async function DELETE(request: NextRequest) {
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

    const body = await request.json()
    const { recipeId, consumedAt } = body

    // Validar dados obrigatórios
    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      )
    }

    // Usar data atual se não fornecida
    const consumptionDate = consumedAt || new Date().toISOString().split('T')[0]

    // Remover registro de consumo
    const { data: deletedRows, error: deleteError } = await supabase
      .from('meal_consumption_logs')
      .delete()
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)
      .eq('consumed_at', consumptionDate)
      .select('id')

    if (deleteError) {
      console.error('Error deleting consumption log:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to unmark meal consumption' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      removed: deletedRows && deletedRows.length > 0
    })

  } catch (error) {
    console.error('Unexpected error in DELETE /api/nutrition/consumption:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
