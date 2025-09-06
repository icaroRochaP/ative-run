import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'

export interface WeightProgress {
  current_weight: number
  target_weight: number
  start_weight: number
  weight_lost: number
  weight_remaining: number
  progress_percentage: number
  target_date: string
  goal_id: string
}

export interface WeightLog {
  id: string
  user_id: string
  weight: number
  date: string
  body_fat_percentage?: number
  muscle_mass_kg?: number
  notes?: string
  photo_urls?: string[]
  created_at: string
  updated_at: string
}

export interface ProgressPhoto {
  id: string
  user_id: string
  photo_url: string
  weight?: number
  date: string
  weight_log_id?: string
  photo_type: 'front' | 'side' | 'back'
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface WeightProgressData {
  progress: WeightProgress | null
  recent_logs: WeightLog[]
  photos: ProgressPhoto[]
}

export function useWeightProgress() {
  const { user } = useAuth()
  const [data, setData] = useState<WeightProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/weight-progress?userId=${user.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress data')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const addWeightLog = async (weightData: {
    weight: number
    date?: string
    notes?: string
    body_fat_percentage?: number
    muscle_mass_kg?: number
  }) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await fetch(`/api/weight-progress?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weightData)
      })

      if (!response.ok) {
        throw new Error('Failed to add weight log')
      }

      const result = await response.json()
      
      // Refetch data to get updated progress
      await fetchData()
      
      return result
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    addWeightLog
  }
}

export function useProgressPhotos() {
  const { user } = useAuth()
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPhotos = async (limit = 20, photoType?: string) => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('userId', user.id)
      params.append('limit', limit.toString())
      if (photoType) params.append('photo_type', photoType)

      const response = await fetch(`/api/progress-photos?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos')
      }

      const result = await response.json()
      setPhotos(result.photos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const uploadPhoto = async (
    file: File,
    options?: {
      weight?: number
      date?: string
      photo_type?: 'front' | 'side' | 'back'
      weight_log_id?: string
    }
  ) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (options?.weight) formData.append('weight', options.weight.toString())
      if (options?.date) formData.append('date', options.date)
      if (options?.photo_type) formData.append('photo_type', options.photo_type)
      if (options?.weight_log_id) formData.append('weight_log_id', options.weight_log_id)

      const response = await fetch(`/api/progress-photos?userId=${user.id}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload photo')
      }

      const result = await response.json()
      
      // Refetch photos to get updated list
      await fetchPhotos()
      
      return result
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const deletePhoto = async (photoId: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await fetch(`/api/progress-photos?userId=${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photo_id: photoId })
      })

      if (!response.ok) {
        throw new Error('Failed to delete photo')
      }

      // Refetch photos to get updated list
      await fetchPhotos()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchPhotos()
    }
  }, [user?.id])

  return {
    photos,
    loading,
    error,
    refetch: fetchPhotos,
    uploadPhoto,
    deletePhoto
  }
}
