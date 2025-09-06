'use client'

import React from 'react'
import { Meal } from '@/types/dashboard'

const mockMeals: Meal[] = [
  {
    meal: 'Café da Manhã',
    calories: 350,
    protein: '25g',
    carbs: '45g',
    fat: '12g',
    foods: ['Ovos mexidos', 'Pão integral', 'Abacate'],
    recipeId: 'recipe-1',
    recipeName: 'Café da Manhã Proteico',
    isConsumed: false
  },
  {
    meal: 'Lanche da Manhã',
    calories: 180,
    protein: '15g',
    carbs: '20g',
    fat: '8g',
    foods: ['Iogurte grego', 'Granola'],
    recipeId: 'recipe-2',
    recipeName: 'Lanche Energético',
    isConsumed: true
  },
  {
    meal: 'Almoço',
    calories: 520,
    protein: '35g',
    carbs: '60g',
    fat: '18g',
    foods: ['Frango grelhado', 'Arroz integral', 'Brócolis'],
    recipeId: 'recipe-3',
    recipeName: 'Almoço Balanceado',
    isConsumed: false
  }
]

export default function TestNutricaoPage() {
  const handleMealSelect = (meal: Meal) => {
    console.log('Meal selected:', meal)
  }

  const handleShowWeeklyPlan = () => {
    console.log('Show weekly plan clicked')
  }

  const handleConsumptionToggle = (meal: Meal) => {
    console.log('Consumption toggled for meal:', meal)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aleen-primary/5 via-white to-aleen-secondary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Teste - Navegação por Dias na Nutrição
        </h1>
        
                <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Funcionalidade de Nutrição
            </h2>
            <p className="text-gray-600">
              Esta funcionalidade está em desenvolvimento. Em breve você poderá gerenciar suas refeições e planos nutricionais.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <h2 className="text-xl font-semibold mb-4">Funcionalidades a Testar:</h2>
          <ul className="text-left max-w-2xl mx-auto space-y-2">
            <li>✅ <strong>Weekly Plan Overview Card:</strong> Primeiro card mostrando resumo do plano semanal</li>
            <li>✅ <strong>Day Selector Card:</strong> Segundo card com navegação entre dias da semana</li>
            <li>✅ <strong>Macro Goals Card:</strong> Atualiza baseado no dia selecionado</li>
            <li>✅ <strong>Meal Cards:</strong> Mostram refeições do dia selecionado</li>
            <li>✅ <strong>Day Navigation:</strong> Pills de dias navegáveis</li>
            <li>✅ <strong>Default Day:</strong> Inicia no dia atual da semana</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
