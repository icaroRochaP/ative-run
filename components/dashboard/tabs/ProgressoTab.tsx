'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Instagram, Camera, ArrowLeft, ArrowRight } from "lucide-react"
import { WeightProgressCard } from "@/components/dashboard/cards/WeightProgressCard"
import { ProgressPhotoCard } from "@/components/dashboard/cards/ProgressPhotoCard"
import { EditGoalModal } from "@/components/dashboard/modals/EditGoalModal"
import { AddWeightUpdateModal } from "@/components/dashboard/modals/AddWeightUpdateModal"
import { WeightUpdateDetailModal } from "@/components/dashboard/modals/WeightUpdateDetailModal"
import { ProgressPhotoDetailModal } from "@/components/dashboard/modals/ProgressPhotoDetailModal"
import { useWeightProgress, useProgressPhotos } from '@/hooks/useWeightProgress'
import { useWeightGoals } from '@/hooks/useWeightGoals'

export function ProgressoTab() {
  const { goal, refetch: refetchGoal } = useWeightGoals()
  const { data: weightData, refetch: refetchWeight } = useWeightProgress()
  const { photos, refetch: refetchPhotos } = useProgressPhotos()
  
  const [editGoalOpen, setEditGoalOpen] = useState(false)
  const [addWeightOpen, setAddWeightOpen] = useState(false)
  const [currentWeightPage, setCurrentWeightPage] = useState(0)
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null)
  const [updateDetailOpen, setUpdateDetailOpen] = useState(false)
  const [photoDetailOpen, setPhotoDetailOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  
  const weightItemsPerPage = 3
  
  // Use data from hooks
  const actualCurrentWeight = goal?.current_weight || 0
  const actualTargetWeight = goal?.target_weight || 0  
  const actualStartWeight = goal?.start_weight || 0
  const actualWeightUpdates = weightData?.recent_logs || []
  
  // Adapt progress photos to match the expected interface
  const actualProgressPhotos = (photos || []).map(photo => ({
    date: new Date(photo.date).toISOString().split('T')[0],
    weight: photo.weight?.toString() || '',
    image: photo.photo_url
  }))
  
  const totalWeightPages = Math.ceil(actualWeightUpdates.length / weightItemsPerPage)

  const handleEditGoal = () => {
    setEditGoalOpen(true)
  }

  const handleAddWeight = () => {
    setAddWeightOpen(true)
  }

  const handleGoalUpdated = () => {
    refetchGoal()
  }

  const handleWeightAdded = () => {
    refetchWeight()
    refetchPhotos()
  }

  const handleUpdateClick = (update: any) => {
    // Buscar dados completos da atualização incluindo foto e observações
    const completeUpdate = {
      ...update,
      notes: update.notes || '',
      photo_url: update.photo_urls?.[0] || null
    }
    setSelectedUpdate(completeUpdate)
    setUpdateDetailOpen(true)
  }

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index)
    setPhotoDetailOpen(true)
  }

  // Helper function to get unified update data
  const getUpdateData = (update: any, index: number) => {
    return {
      id: update.id || `update-${index}`,
      weight: update.weight,
      date: update.recorded_at 
        ? new Date(update.recorded_at).toLocaleDateString('pt-BR') 
        : update.date,
      weightChange: update.weight_change || update.change || 0,
      hasPhoto: update.photo_urls?.length > 0 || update.hasPhoto || false
    }
  }

  return (
    <div className="space-y-6">
      {/* Weight Progress Section */}
      <WeightProgressCard
        currentWeight={actualCurrentWeight}
        targetWeight={actualTargetWeight}
        startWeight={actualStartWeight}
        onUpdateWeight={handleAddWeight}
        onEditGoal={handleEditGoal}
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
            {actualWeightUpdates.slice(currentWeightPage * weightItemsPerPage, (currentWeightPage + 1) * weightItemsPerPage).map((update: any, index: number) => {
              const updateData = getUpdateData(update, index)
              return (
                <div
                  key={updateData.id}
                  onClick={() => handleUpdateClick(update)}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-aleen-light to-white rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-2xl flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{updateData.weight}</span>
                    </div>
                    <div>
                      <div className="text-gray-800 font-bold">{updateData.weight} kg</div>
                      <div className="text-aleen-secondary text-sm font-medium">
                        {updateData.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        updateData.weightChange > 0 
                          ? "text-red-600" 
                          : updateData.weightChange < 0 
                          ? "text-aleen-primary" 
                          : "text-gray-600"
                      }`}
                    >
                      {updateData.weightChange > 0 ? "+" : ""}
                      {updateData.weightChange} kg
                    </div>
                    {updateData.hasPhoto && (
                      <div className="text-xs text-aleen-secondary flex items-center">
                        <Camera className="h-3 w-3 mr-1" />
                        Foto adicionada
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination for Weight Updates */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeightPage(Math.max(0, currentWeightPage - 1))}
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
              onClick={() => setCurrentWeightPage(Math.min(totalWeightPages - 1, currentWeightPage + 1))}
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
      <ProgressPhotoCard photos={actualProgressPhotos} onPhotoClick={handlePhotoClick} />

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

      {/* Modals */}
      <EditGoalModal
        open={editGoalOpen}
        onOpenChange={setEditGoalOpen}
        currentGoal={goal ? {
          id: goal.id,
          target_weight: goal.target_weight,
          target_date: goal.target_date,
          notes: goal.notes
        } : undefined}
        onGoalUpdated={handleGoalUpdated}
      />
      
      <AddWeightUpdateModal
        open={addWeightOpen}
        onOpenChange={setAddWeightOpen}
        onWeightAdded={handleWeightAdded}
      />

      <WeightUpdateDetailModal
        open={updateDetailOpen}
        onOpenChange={setUpdateDetailOpen}
        update={selectedUpdate}
      />

      <ProgressPhotoDetailModal
        open={photoDetailOpen}
        onOpenChange={setPhotoDetailOpen}
        photos={actualProgressPhotos}
        initialIndex={selectedPhotoIndex}
      />
    </div>
  )
}
