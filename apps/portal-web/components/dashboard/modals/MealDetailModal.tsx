import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, ChefHat, Utensils } from "lucide-react"
import { MealDetailModalProps } from "@/types/dashboard"
import { useRecipeDetails } from "@/hooks/nutrition/useRecipeDetails"
import { useMealConsumption } from "@/hooks/nutrition/useMealConsumptionGlobal"

export function MealDetailModal({ meal, onClose, onMarkConsumed }: MealDetailModalProps) {
  const { data: recipeDetails, loading, error } = useRecipeDetails(meal?.recipeId || null)
  
  // Get current date for meal consumption tracking
  const currentDate = new Date().toISOString().split('T')[0]
  
  // Use the meal consumption hook to get real-time consumption state
  const { isMealConsumed } = useMealConsumption(currentDate)
  
  // Create updated meal object with current consumption state
  const updatedMeal = meal ? {
    ...meal,
    isConsumed: isMealConsumed(meal.recipeId || '')
  } : null

  if (!updatedMeal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white border-0 shadow-2xl rounded-3xl my-8">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5" />
              <CardTitle className="text-white text-lg">{updatedMeal.meal}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Recipe Header */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {recipeDetails?.name || updatedMeal.recipeName || 'Carregando...'}
            </h2>
            {recipeDetails?.image_url && (
              <div className="w-full h-32 bg-gradient-to-br from-aleen-light to-aleen-secondary/20 rounded-2xl flex items-center justify-center">
                <img 
                  src={recipeDetails.image_url} 
                  alt={recipeDetails.name}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="text-aleen-primary/60 text-sm">Imagem da receita</div>
              </div>
            )}
          </div>

          {/* Compact Nutrition Summary */}
          <div className="bg-gradient-to-r from-aleen-light/30 to-aleen-primary/10 rounded-2xl p-4 border border-aleen-primary/20">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-aleen-primary">{updatedMeal.calories}</div>
                <div className="text-xs text-gray-600 font-medium">Calorias</div>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-aleen-secondary">{updatedMeal.protein}</div>
                  <div className="text-xs text-gray-600">Proteína</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-aleen-secondary">{updatedMeal.carbs}</div>
                  <div className="text-xs text-gray-600">Carboidratos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-aleen-secondary">{updatedMeal.fat}</div>
                  <div className="text-xs text-gray-600">Gordura</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Description */}
          {(recipeDetails?.description || updatedMeal.recipeDescription) && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-aleen-primary" />
                <h4 className="text-gray-800 font-bold">Modo de Preparo</h4>
              </div>
              <div className="p-4 bg-gradient-to-r from-aleen-light/50 to-white rounded-2xl border border-aleen-primary/10">
                <p className="text-gray-700 leading-relaxed">
                  {recipeDetails?.description || updatedMeal.recipeDescription}
                </p>
              </div>
            </div>
          )}

          <Separator className="my-4" />

          {/* Ingredients List */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-aleen-primary" />
              <h4 className="text-gray-800 font-bold">Ingredientes</h4>
            </div>
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aleen-primary"></div>
                <span className="ml-2 text-gray-600">Carregando ingredientes...</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
                Erro ao carregar ingredientes
              </div>
            )}

            {recipeDetails?.ingredients && recipeDetails.ingredients.length > 0 && (
              <div className="space-y-2">
                {recipeDetails.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-aleen-light to-white rounded-2xl border-0 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-full mr-3"></div>
                      <div>
                        <span className="text-gray-800 font-medium">{ingredient.food_name}</span>
                        <div className="text-sm text-gray-500">{ingredient.display_unit}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-aleen-primary">
                        {Math.round((ingredient.calories_per_100g * ingredient.quantity_in_grams) / 100)} cal
                      </div>
                      <div className="text-xs text-gray-500">
                        {ingredient.quantity_in_grams}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && recipeDetails && recipeDetails.ingredients.length === 0 && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-600 text-center">
                Nenhum ingrediente encontrado
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-2xl font-medium transition-all duration-300"
            >
              Fechar
            </Button>
            {updatedMeal.isConsumed ? (
              <Button 
                onClick={() => onMarkConsumed?.(updatedMeal)}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>✓</span>
                <span>Consumido</span>
              </Button>
            ) : (
              <Button 
                onClick={() => onMarkConsumed?.(updatedMeal)}
                className="flex-1 bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Marcar como Consumido
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
