"use client"

import { useState } from "react"
import { WeightUpdate, ProgressPhoto } from "@/types/dashboard"

export function useWeightTracking() {
  const [weightUpdates, setWeightUpdates] = useState<WeightUpdate[]>([
    { weight: "72.5", date: "Today", change: -0.5, hasPhoto: true },
    { weight: "73.0", date: "3 days ago", change: -1.0, hasPhoto: false },
    { weight: "74.0", date: "1 week ago", change: -0.8, hasPhoto: true },
    { weight: "74.8", date: "2 weeks ago", change: -1.2, hasPhoto: false },
    { weight: "76.0", date: "3 weeks ago", change: -0.5, hasPhoto: true },
    { weight: "76.5", date: "1 month ago", change: -0.7, hasPhoto: false },
    { weight: "77.2", date: "5 weeks ago", change: -0.8, hasPhoto: true },
  ])

  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([
    { date: "2024-01-01", weight: "74.0", image: "/placeholder.svg?height=200&width=150" },
    { date: "2024-01-15", weight: "73.2", image: "/placeholder.svg?height=200&width=150" },
    { date: "2024-02-01", weight: "72.5", image: "/placeholder.svg?height=200&width=150" },
  ])

  const currentWeight = 72.5
  const targetWeight = 68
  const startWeight = 78

  const handleWeightUpdate = (weight: string, photo: File | null) => {
    const today = new Date().toLocaleDateString()
    const lastWeight = Number.parseFloat(weightUpdates[0]?.weight || "73")
    const change = Number.parseFloat(weight) - lastWeight

    const newUpdate: WeightUpdate = {
      weight: weight,
      date: "Hoje",
      change: Number.parseFloat(change.toFixed(1)),
      hasPhoto: !!photo,
    }

    setWeightUpdates([newUpdate, ...weightUpdates])

    if (photo) {
      const newProgressPhoto: ProgressPhoto = {
        date: today,
        weight: weight,
        image: "/placeholder.svg?height=200&width=150",
      }
      setProgressPhotos([newProgressPhoto, ...progressPhotos])
    }
  }

  return {
    weightUpdates,
    progressPhotos,
    currentWeight,
    targetWeight,
    startWeight,
    handleWeightUpdate,
    setWeightUpdates,
    setProgressPhotos,
  }
}
