import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Instagram, Camera, ArrowLeft, ArrowRight } from "lucide-react"
import { WeightProgressCard } from "@/components/dashboard/cards/WeightProgressCard"
import { ProgressPhotoCard } from "@/components/dashboard/cards/ProgressPhotoCard"
import { ProgressoTabProps, WeightUpdate } from "@/types/dashboard"

export function ProgressoTab({
  currentWeight,
  targetWeight,
  startWeight,
  weightUpdates,
  progressPhotos,
  onUpdateWeight,
  currentWeightPage,
  onWeightPageChange,
}: ProgressoTabProps) {
  const weightItemsPerPage = 3
  const totalWeightPages = Math.ceil(weightUpdates.length / weightItemsPerPage)

  return (
    <div className="space-y-6">
      {/* Weight Progress Section */}
      <WeightProgressCard
        currentWeight={currentWeight}
        targetWeight={targetWeight}
        startWeight={startWeight}
        onUpdateWeight={onUpdateWeight}
      />

      {/* Recent Weight Updates */}
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-aleen-secondary" />
            Atualizações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {weightUpdates.slice(currentWeightPage * weightItemsPerPage, (currentWeightPage + 1) * weightItemsPerPage).map((update, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-aleen-light to-white rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-2xl flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{update.weight}</span>
                  </div>
                  <div>
                    <div className="text-gray-800 font-bold">{update.weight} kg</div>
                    <div className="text-aleen-secondary text-sm font-medium">{update.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${update.change > 0 ? "text-red-600" : update.change < 0 ? "text-aleen-primary" : "text-gray-600"}`}
                  >
                    {update.change > 0 ? "+" : ""}
                    {update.change} kg
                  </div>
                  {update.hasPhoto && (
                    <div className="text-xs text-aleen-secondary flex items-center">
                      <Camera className="h-3 w-3 mr-1" />
                      Foto adicionada
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination for Weight Updates */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeightPageChange(Math.max(0, currentWeightPage - 1))}
              disabled={currentWeightPage === 0}
              className="border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent disabled:opacity-50 rounded-2xl font-medium transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <span className="text-aleen-secondary text-sm font-medium">
              Página {currentWeightPage + 1} de {totalWeightPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeightPageChange(Math.min(totalWeightPages - 1, currentWeightPage + 1))}
              disabled={currentWeightPage >= totalWeightPages - 1}
              className="border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent disabled:opacity-50 rounded-2xl font-medium transition-all duration-300"
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Photos */}
      <ProgressPhotoCard photos={progressPhotos} />

      {/* Social Sharing */}
      <Card className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Compartilhe Seu Progresso</h3>
              <p className="text-sm text-white/90 font-medium">Inspire outros com sua jornada</p>
            </div>
            <Button variant="secondary" size="sm" className="bg-white text-aleen-secondary hover:bg-aleen-light hover:text-aleen-primary font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
              <Instagram className="h-4 w-4 mr-1" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
