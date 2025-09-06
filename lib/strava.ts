import { createAdminClient } from './supabase-admin'

interface StravaToken {
  access_token: string
  refresh_token: string
  expires_at: number
  token_type: string
}

interface StravaTokenResponse {
  access_token: string
  refresh_token: string
  expires_at: number
  expires_in: number
  token_type: string
}

interface StravaAthleteData {
  id: number
  username: string
  firstname: string
  lastname: string
  profile: string
  city: string
  state: string
  country: string
  sex: string
  created_at: string
}

export class StravaTokenManager {
  private static instance: StravaTokenManager
  private supabase = createAdminClient()

  static getInstance(): StravaTokenManager {
    if (!StravaTokenManager.instance) {
      StravaTokenManager.instance = new StravaTokenManager()
    }
    return StravaTokenManager.instance
  }

  /**
   * Verifica se o token está próximo da expiração (dentro de 1 hora)
   */
  private isTokenExpiringSoon(expiresAt: number): boolean {
    const now = Math.floor(Date.now() / 1000)
    const oneHourFromNow = now + 3600
    return expiresAt <= oneHourFromNow
  }

  /**
   * Busca tokens do Strava para um usuário
   */
  async getTokensForUser(userId: string): Promise<StravaToken | null> {
    try {
      console.log('🔍 Buscando tokens para userId:', userId)
      
      const { data, error } = await this.supabase
        .from('strava_tokens')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar tokens do Strava:', error)
        throw error
      }

      if (!data) {
        console.log('❌ Nenhum token encontrado para userId:', userId)
        return null
      }

      console.log('✅ Tokens encontrados para userId:', userId, 'expires_at:', data.expires_at)
      
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        token_type: data.token_type || 'Bearer'
      }
    } catch (error) {
      console.error('❌ Erro ao buscar tokens do Strava:', error)
      throw error
    }
  }

  /**
   * Salva ou atualiza tokens do Strava para um usuário
   */
  async saveTokensForUser(userId: string, tokens: StravaTokenResponse, athleteData?: StravaAthleteData): Promise<void> {
    try {
      const tokenData = {
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_at,
        token_type: tokens.token_type,
        updated_at: new Date().toISOString()
      }

      // Se temos dados do atleta, incluí-los
      if (athleteData) {
        Object.assign(tokenData, {
          strava_athlete_id: athleteData.id,
          athlete_username: athleteData.username,
          athlete_firstname: athleteData.firstname,
          athlete_lastname: athleteData.lastname,
          athlete_profile: athleteData.profile,
          athlete_city: athleteData.city,
          athlete_state: athleteData.state,
          athlete_country: athleteData.country,
          athlete_sex: athleteData.sex
        })
      }

      const { error } = await this.supabase
        .from('strava_tokens')
        .upsert(tokenData, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Erro ao salvar tokens do Strava:', error)
        throw error
      }

      console.log('✅ Tokens do Strava salvos com sucesso para usuário:', userId)
    } catch (error) {
      console.error('Erro ao salvar tokens do Strava:', error)
      throw error
    }
  }

  /**
   * Renova o access token usando o refresh token
   */
  async refreshAccessToken(userId: string): Promise<StravaToken> {
    try {
      const tokens = await this.getTokensForUser(userId)
      if (!tokens) {
        throw new Error('Nenhum token do Strava encontrado para o usuário')
      }

      console.log('🔄 Renovando token do Strava para usuário:', userId)

      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro na resposta do Strava:', response.status, errorText)
        throw new Error(`Erro ao renovar token: ${response.status} - ${errorText}`)
      }

      const newTokens: StravaTokenResponse = await response.json()
      
      // Salvar novos tokens
      await this.saveTokensForUser(userId, newTokens)

      console.log('✅ Token do Strava renovado com sucesso')
      
      return {
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_at: newTokens.expires_at,
        token_type: newTokens.token_type
      }
    } catch (error) {
      console.error('Erro ao renovar token do Strava:', error)
      throw error
    }
  }

  /**
   * Obtém um token válido (renovando se necessário)
   */
  async getValidToken(userId: string): Promise<string> {
    try {
      let tokens = await this.getTokensForUser(userId)
      
      if (!tokens) {
        throw new Error('Usuário não conectou sua conta Strava')
      }

      // Verificar se o token está expirando e renovar se necessário
      if (this.isTokenExpiringSoon(tokens.expires_at)) {
        console.log('🔄 Token expirando em breve, renovando...')
        tokens = await this.refreshAccessToken(userId)
      }

      return tokens.access_token
    } catch (error) {
      console.error('Erro ao obter token válido:', error)
      throw error
    }
  }

  /**
   * Remove tokens do Strava para um usuário (desconectar)
   */
  async removeTokensForUser(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('strava_tokens')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao remover tokens do Strava:', error)
        throw error
      }

      console.log('✅ Tokens do Strava removidos para usuário:', userId)
    } catch (error) {
      console.error('Erro ao remover tokens do Strava:', error)
      throw error
    }
  }

  /**
   * Verifica se um usuário tem conta Strava conectada
   */
  async isUserConnected(userId: string): Promise<boolean> {
    try {
      const tokens = await this.getTokensForUser(userId)
      return tokens !== null
    } catch (error) {
      console.error('Erro ao verificar conexão Strava:', error)
      return false
    }
  }
}

/**
 * Cliente da API do Strava
 */
export class StravaApiClient {
  private tokenManager = StravaTokenManager.getInstance()

  /**
   * Faz uma requisição autenticada para a API do Strava
   */
  private async makeAuthenticatedRequest(userId: string, endpoint: string, options: RequestInit = {}) {
    const token = await this.tokenManager.getValidToken(userId)
    
    const response = await fetch(`https://www.strava.com/api/v3${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro na API do Strava: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  /**
   * Busca dados do atleta
   */
  async getAthlete(userId: string): Promise<StravaAthleteData> {
    return this.makeAuthenticatedRequest(userId, '/athlete')
  }

  /**
   * Busca atividades do atleta
   */
  async getActivities(userId: string, params: {
    before?: number
    after?: number
    page?: number
    per_page?: number
  } = {}): Promise<any[]> {
    const searchParams = new URLSearchParams()
    
    if (params.before) searchParams.set('before', params.before.toString())
    if (params.after) searchParams.set('after', params.after.toString())
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.per_page) searchParams.set('per_page', params.per_page.toString())

    const endpoint = `/athlete/activities${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    return this.makeAuthenticatedRequest(userId, endpoint)
  }

  /**
   * Busca uma atividade específica por ID
   */
  async getActivity(userId: string, activityId: string): Promise<any> {
    return this.makeAuthenticatedRequest(userId, `/activities/${activityId}`)
  }

  /**
   * Busca estatísticas do atleta
   */
  async getAthleteStats(userId: string): Promise<any> {
    // Primeiro precisamos do ID do atleta
    const athlete = await this.getAthlete(userId)
    return this.makeAuthenticatedRequest(userId, `/athletes/${athlete.id}/stats`)
  }
}

// Instâncias singleton exportadas
export const stravaTokenManager = StravaTokenManager.getInstance()
export const stravaApiClient = new StravaApiClient()

// Rate limiting helper
export class StravaRateLimiter {
  private static requestCounts = {
    general: { count: 0, resetTime: 0 },
    read: { count: 0, resetTime: 0 }
  }

  static async checkRateLimit(isReadOperation = true): Promise<void> {
    const now = Date.now()
    const limits = {
      general: { max: 200, window: 15 * 60 * 1000 }, // 200 por 15 min
      read: { max: 100, window: 15 * 60 * 1000 }     // 100 por 15 min
    }

    const type = isReadOperation ? 'read' : 'general'
    const counter = this.requestCounts[type]
    const limit = limits[type]

    // Reset counter se janela de tempo passou
    if (now >= counter.resetTime) {
      counter.count = 0
      counter.resetTime = now + limit.window
    }

    // Verificar se excedeu limite
    if (counter.count >= limit.max) {
      const waitTime = counter.resetTime - now
      throw new Error(`Rate limit excedido. Aguarde ${Math.ceil(waitTime / 1000)} segundos.`)
    }

    counter.count++
  }
}
