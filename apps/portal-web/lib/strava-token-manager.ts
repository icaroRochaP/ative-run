import { createAdminClient } from '@/lib/supabase-admin'

export class StravaTokenManager {
  private supabase = createAdminClient()

  async isUserConnected(userId: string): Promise<boolean> {
    try {
      console.log(`🔍 Verificando conexão Strava para userId: ${userId}`)
      
      const { data, error } = await this.supabase
        .from('strava_tokens')
        .select('access_token, expires_at')
        .eq('user_id', userId)
        .single()

      if (error || !data) {
        console.log(`❌ Usuário ${userId} não tem token Strava:`, error?.message)
        return false
      }

      // Verifica se o token não expirou
      const now = Math.floor(Date.now() / 1000)
      const isValid = data.expires_at > now

      console.log(`${isValid ? '✅' : '❌'} Token Strava para ${userId}: ${isValid ? 'válido' : 'expirado'}`)
      
      return isValid
    } catch (error) {
      console.error('❌ Erro ao verificar conexão Strava:', error)
      return false
    }
  }

  async getValidToken(userId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('strava_tokens')
        .select('access_token, refresh_token, expires_at')
        .eq('user_id', userId)
        .single()

      if (error || !data) {
        console.log(`❌ Token não encontrado para usuário ${userId}`)
        return null
      }

      const now = Math.floor(Date.now() / 1000)
      
      // Se o token ainda é válido, retorna ele
      if (data.expires_at > now + 300) { // 5 minutos de margem
        return data.access_token
      }

      // Token expirado, tenta renovar
      console.log(`🔄 Token expirado para ${userId}, renovando...`)
      const newToken = await this.refreshToken(userId, data.refresh_token)
      
      return newToken
    } catch (error) {
      console.error('❌ Erro ao obter token válido:', error)
      return null
    }
  }

  async refreshToken(userId: string, refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
      })

      if (!response.ok) {
        throw new Error(`Erro ao renovar token: ${response.status}`)
      }

      const tokenData = await response.json()

      // Atualiza os tokens no banco
      const { error } = await this.supabase
        .from('strava_tokens')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Erro ao salvar token renovado: ${error.message}`)
      }

      console.log(`✅ Token renovado com sucesso para usuário ${userId}`)
      return tokenData.access_token

    } catch (error) {
      console.error('❌ Erro ao renovar token:', error)
      return null
    }
  }

  async saveTokens(userId: string, tokenData: any, athleteData: any): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('strava_tokens')
        .upsert({
          user_id: userId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          token_type: tokenData.token_type || 'Bearer',
          strava_athlete_id: athleteData.id,
          athlete_username: athleteData.username,
          athlete_firstname: athleteData.firstname,
          athlete_lastname: athleteData.lastname,
          athlete_profile: athleteData.profile,
          athlete_city: athleteData.city,
          athlete_state: athleteData.state,
          athlete_country: athleteData.country,
          athlete_sex: athleteData.sex,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('❌ Erro ao salvar tokens:', error)
        return false
      }

      console.log(`✅ Tokens salvos com sucesso para usuário ${userId}`)
      return true

    } catch (error) {
      console.error('❌ Erro ao salvar tokens:', error)
      return false
    }
  }

  async revokeTokens(userId: string): Promise<boolean> {
    try {
      // Primeiro busca o token para revogar na API do Strava
      const { data } = await this.supabase
        .from('strava_tokens')
        .select('access_token')
        .eq('user_id', userId)
        .single()

      if (data?.access_token) {
        // Revoga o token na API do Strava
        await fetch('https://www.strava.com/oauth/deauthorize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        })
      }

      // Remove do banco local
      const { error } = await this.supabase
        .from('strava_tokens')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('❌ Erro ao revogar tokens:', error)
        return false
      }

      console.log(`✅ Tokens revogados com sucesso para usuário ${userId}`)
      return true

    } catch (error) {
      console.error('❌ Erro ao revogar tokens:', error)
      return false
    }
  }
}

// Singleton instance
export const stravaTokenManager = new StravaTokenManager()
