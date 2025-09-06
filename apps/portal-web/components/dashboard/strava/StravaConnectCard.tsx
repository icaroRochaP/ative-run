"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ExternalLink, Loader2, Unlink, CheckCircle, AlertCircle } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

interface StravaConnectCardProps {
  userId: string
  onConnectionChange?: (isConnected: boolean) => void
}

export function StravaConnectCard({ userId, onConnectionChange }: StravaConnectCardProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('🔍 StravaConnectCard: Estado atual -', { isConnected, isLoading, userId })

  useEffect(() => {
    checkConnection()
    
    // Verificar se há parâmetro de URL indicando conexão bem-sucedida
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('strava_connected') === 'true') {
      console.log('🎉 URL param detectado: strava_connected=true')
      setIsConnected(true)
      setError(null)
      setIsLoading(false)
      onConnectionChange?.(true)
      // Limpar parâmetro da URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [userId])

    const checkConnection = useCallback(async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      console.log('🔍 StravaConnectCard: Verificando conexão para userId:', userId)
      
      const response = await fetch(`/api/strava/check-connection?userId=${userId}&t=${Date.now()}`)
      const data = await response.json()
      
      console.log('📊 StravaConnectCard: Resposta da API:', data)
      
      const connected = data.isConnected || false
      console.log('📊 StravaConnectCard: Status de conexão:', connected)
      
      setIsConnected(connected)
      onConnectionChange?.(connected)
      
      // Se acabou de conectar, fazer sync inicial do histórico
      if (connected && !isConnected) {
        console.log('🔄 Nova conexão detectada, iniciando sync inicial...')
        await syncInitialActivities()
      }
      
      console.log('✅ Connection check result:', data)
    } catch (error) {
      console.error('❌ Erro ao verificar conexão:', error)
      setIsConnected(false)
      onConnectionChange?.(false)
    } finally {
      setIsLoading(false)
    }
  }, [userId, onConnectionChange, isConnected])

  const syncInitialActivities = async () => {
    try {
      console.log('📊 Sincronizando atividades históricas...')
      const response = await fetch('/api/strava/sync-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Sync inicial completo:', result)
        // Notificar componentes pai que há novas atividades
        onConnectionChange?.(true)
      } else {
        console.error('❌ Erro no sync inicial:', await response.text())
      }
    } catch (error) {
      console.error('❌ Erro ao sincronizar atividades:', error)
    }
  }

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Obter access token do usuário atual
      const supabase = getSupabaseClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado')
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        throw new Error('Sessão não encontrada')
      }

      // Codificar dados do usuário no state parameter
      const state = btoa(JSON.stringify({
        userId: user.id,
        accessToken: session.access_token
      }))

      const stravaAuthUrl = new URL('https://www.strava.com/oauth/authorize')
      stravaAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '175809')
      stravaAuthUrl.searchParams.set('response_type', 'code')
      stravaAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/strava/callback`)
      stravaAuthUrl.searchParams.set('approval_prompt', 'force')
      stravaAuthUrl.searchParams.set('scope', 'read,activity:read_all')
      stravaAuthUrl.searchParams.set('state', state)

      window.location.href = stravaAuthUrl.toString()
    } catch (error) {
      console.error('Erro ao conectar com Strava:', error)
      setError('Erro ao iniciar conexão com Strava')
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/strava/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        setIsConnected(false)
        onConnectionChange?.(false)
        setError(null)
      } else {
        throw new Error('Erro ao desconectar')
      }
    } catch (error) {
      setError('Erro ao desconectar da conta Strava')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !isConnected) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Verificando conexão Strava...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          Conexão Strava
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isConnected ? (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Sua conta Strava está conectada! Suas atividades são sincronizadas automaticamente.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex-1"
                asChild
              >
                <a href="/connect-strava">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Gerenciar
                </a>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Desconectar'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Conecte sua conta Strava para:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Sincronizar suas atividades automaticamente</li>
                <li>Ver estatísticas detalhadas</li>
                <li>Análises de performance</li>
              </ul>
            </div>

            <Button 
              onClick={handleConnect} 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar com Strava'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}