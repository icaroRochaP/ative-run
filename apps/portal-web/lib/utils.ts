import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação de distância
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters >= 1000) {
    return `${(distanceInMeters / 1000).toFixed(2)} km`
  }
  return `${Math.round(distanceInMeters)} m`
}

// Formatação de duração
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

// Formatação de pace (para corrida) - converte m/s para min/km
export function formatPace(speedInMeterPerSecond: number): string {
  if (speedInMeterPerSecond === 0) return '--:--'
  
  const paceInSecondsPerKm = 1000 / speedInMeterPerSecond
  const minutes = Math.floor(paceInSecondsPerKm / 60)
  const seconds = Math.round(paceInSecondsPerKm % 60)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Formatação de data
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatação de data relativa
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Hoje'
  } else if (diffInDays === 1) {
    return 'Ontem'
  } else if (diffInDays < 7) {
    return `${diffInDays} dias atrás`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`
  } else {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}

// Formatação de velocidade
export function formatSpeed(speedInMeterPerSecond: number): string {
  const speedInKmh = speedInMeterPerSecond * 3.6
  return `${speedInKmh.toFixed(1)} km/h`
}

// Formatação de elevação
export function formatElevation(elevationInMeters: number): string {
  return `${Math.round(elevationInMeters)} m`
}

// Formatação de calorias
export function formatCalories(kilojoules: number): string {
  // Conversão aproximada: 1 kJ ≈ 0.239 kcal
  const calories = Math.round(kilojoules * 0.239)
  return `${calories} kcal`
}