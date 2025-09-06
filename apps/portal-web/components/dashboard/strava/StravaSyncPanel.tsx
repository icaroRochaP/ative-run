"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  RefreshCw, 
  Database, 
  Calendar, 
  Activity, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StravaSyncPanelProps {
  userId: string
  isConnected: boolean
}

interface SyncStats {
  totalCached: number
  lastSync: string | null
  syncInProgress: boolean
}

export function StravaSyncPanel({ userId, isConnected }: StravaSyncPanelProps) {
  const [syncStats, setSyncStats] = useState<SyncStats>({
    totalCached: 0,
    lastSync: null,
    syncInProgress: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    if (!isConnected) {
      toast({
        title: "Erro",
        description: "Conecte-se ao Strava primeiro",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setSyncStats(prev => ({ ...prev, syncInProgress: true }))

    try {
      console.log('🔄 Iniciando sincronização manual...')
      
      const response = await fetch('/api/strava/sync-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na sincronização')
      }

      console.log('✅ Sincronização concluída:', result)

      // Atualiza estatísticas
      await fetchSyncStats()

      toast({
        title: "Sincronização Concluída",
        description: `${result.syncedCount} atividades sincronizadas de ${result.totalFromStrava} encontradas`,
      })

    } catch (error) {
      console.error('❌ Erro na sincronização:', error)
      toast({
        title: "Erro na Sincronização",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setSyncStats(prev => ({ ...prev, syncInProgress: false }))
    }
  }

  const fetchSyncStats = async () => {
    try {
      const response = await fetch(`/api/strava/cached-activities?userId=${userId}&limit=1`)
      const result = await response.json()
      
      if (response.ok) {
        setSyncStats(prev => ({
          ...prev,
          totalCached: result.total,
          lastSync: result.activities?.[0]?.updated_at || null
        }))
      }
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error)
    }
  }

  // Busca estatísticas ao carregar o componente
  useEffect(() => {
    if (isConnected && userId) {
      fetchSyncStats()
    }
  }, [isConnected, userId])

  if (!isConnected) {
    return (
      <Card className="bg-white border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Database className="mr-2 h-5 w-5 text-gray-400" />
            Cache de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">
            <AlertCircle className="mr-2 h-5 w-5" />
            Conecte-se ao Strava para sincronizar suas atividades
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-0 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center">
          <Database className="mr-2 h-5 w-5 text-aleen-primary" />
          Cache de Atividades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Activity className="h-5 w-5 text-aleen-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{syncStats.totalCached}</div>
            <div className="text-sm text-gray-600">Atividades Salvas</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-5 w-5 text-aleen-secondary" />
            </div>
            <div className="text-sm font-semibold text-gray-800">
              {syncStats.lastSync 
                ? new Date(syncStats.lastSync).toLocaleDateString('pt-BR')
                : 'Nunca'
              }
            </div>
            <div className="text-sm text-gray-600">Última Sincronização</div>
          </div>
        </div>

        <Separator />

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {syncStats.syncInProgress ? (
              <>
                <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                <span className="text-sm text-blue-600">Sincronizando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Cache Atualizado</span>
              </>
            )}
          </div>
          
          <Badge variant="secondary" className="bg-aleen-primary/10 text-aleen-primary">
            Local
          </Badge>
        </div>

        {/* Botão de Sincronização */}
        <Button 
          onClick={handleSync}
          disabled={isLoading || syncStats.syncInProgress}
          className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold py-2 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
        >
          {isLoading || syncStats.syncInProgress ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar Agora
            </>
          )}
        </Button>

        {/* Informação */}
        <div className="text-xs text-gray-500 text-center mt-3">
          As atividades são salvas localmente para acesso mais rápido.<br />
          Sincronize para buscar as mais recentes do Strava.
        </div>
      </CardContent>
    </Card>
  )
}
