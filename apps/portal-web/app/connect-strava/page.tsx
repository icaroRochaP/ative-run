'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

export default function ConnectStravaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
    checkStravaConnection()
  }, [])

  const checkAuth = async () => {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/signin?message=Faça login para conectar sua conta Strava')
      return
    }
    
    setUser(user)
  }

  const checkStravaConnection = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/strava/check-connection?userId=${user.id}`)
      const data = await response.json()
      setIsConnected(data.connected)
    } catch (error) {
      console.error('Erro ao verificar conexão Strava:', error)
    }
  }

  const handleConnectStrava = () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    const stravaAuthUrl = new URL('https://www.strava.com/oauth/authorize')
    stravaAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '175809')
    stravaAuthUrl.searchParams.set('response_type', 'code')
    stravaAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/strava/callback`)
    stravaAuthUrl.searchParams.set('approval_prompt', 'force')
    stravaAuthUrl.searchParams.set('scope', 'read,activity:read_all')
    stravaAuthUrl.searchParams.set('state', user.id) // Para verificação adicional

    // Redirecionar para Strava
    window.location.href = stravaAuthUrl.toString()
  }

  const handleDisconnect = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/strava/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      })

      if (response.ok) {
        setIsConnected(false)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            Conectar Strava
          </CardTitle>
          <CardDescription>
            Conecte sua conta Strava para sincronizar suas atividades
          </CardDescription>
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
                  Sua conta Strava está conectada! Suas atividades serão sincronizadas automaticamente.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  className="flex-1"
                >
                  Ir para Dashboard
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
              <div className="text-sm text-gray-600 space-y-2">
                <p>Ao conectar sua conta Strava, você permitirá que:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Visualizemos suas atividades de corrida</li>
                  <li>Analisemos seus dados de performance</li>
                  <li>Geremos insights personalizados sobre seus treinos</li>
                </ul>
              </div>

              <Button 
                onClick={handleConnectStrava} 
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

              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={() => router.push('/dashboard')}
                  className="text-sm"
                >
                  Pular por agora
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}