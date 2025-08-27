"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { formatDisplayName, getInitials } from "@/lib/user-utils"
import { User, Workout, WeightUpdate, ProgressPhoto, MealPlan, Meal } from "@/types/dashboard"

export function useDashboardData() {
  const [activeTab, setActiveTab] = useState("summary")
  const [userData, setUserData] = useState<any>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [initials, setInitials] = useState<string>("")
  const [nameLoading, setNameLoading] = useState<boolean>(true)
  
  // Modals and selections
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [selectedHistoryWorkout, setSelectedHistoryWorkout] = useState<Workout | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [showWeightUpdate, setShowWeightUpdate] = useState(false)
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState("monday")
  
  // Pagination
  const [currentHistoryPage, setCurrentHistoryPage] = useState(0)
  const [currentWeightPage, setCurrentWeightPage] = useState(0)
  
  const router = useRouter()
  const { profile, loading: authLoading, refreshProfile } = useAuth()

  // Load user data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("onboardingData")
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
  }, [])

  // Manage display name and initials
  useEffect(() => {
    let mounted = true
    const minDelay = 300
    let timeoutId: any = null

    async function computeName() {
      setNameLoading(true)
      
      const name = profile?.name ?? userData?.name ?? null
      const start = Date.now()
      const formatted = formatDisplayName(name)
      const initialsValue = getInitials(name)
      const elapsed = Date.now() - start
      const remaining = Math.max(0, minDelay - elapsed)

      if (!formatted) {
        timeoutId = setTimeout(() => {
          if (!mounted) return
          setDisplayName("Usuário")
          setInitials("")
          setNameLoading(false)
        }, 5000)
        return
      }

      setTimeout(() => {
        if (!mounted) return
        setDisplayName(formatted)
        setInitials(initialsValue)
        setNameLoading(false)
      }, remaining)
    }

    if (!authLoading) {
      computeName()
    }

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [profile?.name, userData?.name, authLoading])

  // User object
  const user: User = {
    name: displayName || "Usuário",
    avatar: "/placeholder.svg?height=80&width=80",
    subscriptionStatus: "active",
    nextRenewal: "2024-02-15",
  }

  // Workout data
  const workouts: Workout[] = [
    {
      id: 1,
      emoji: "💪",
      title: "Força de Membros Superiores",
      exercises: 6,
      totalSets: 18,
      day: "Segunda-feira",
    },
    {
      id: 2,
      emoji: "🦵",
      title: "Potência de Membros Inferiores",
      exercises: 5,
      totalSets: 15,
      day: "Quarta-feira",
    },
    {
      id: 3,
      emoji: "🏃",
      title: "Cardio & Core",
      exercises: 4,
      totalSets: 12,
      day: "Sexta-feira",
    },
  ]

  const workoutHistory: Workout[] = [
    {
      id: 1,
      emoji: "💪",
      title: "Força de Membros Superiores",
      date: "Hoje",
      duration: "45 min",
      exercises: 6,
      totalSets: 18,
      completed: true,
      day: "Segunda-feira",
    },
    {
      id: 2,
      emoji: "🦵",
      title: "Potência de Membros Inferiores",
      date: "Ontem",
      duration: "38 min",
      exercises: 5,
      totalSets: 15,
      completed: true,
      day: "Quarta-feira",
    },
    {
      id: 3,
      emoji: "🏃",
      title: "Cardio & Core",
      date: "2 dias atrás",
      duration: "30 min",
      exercises: 4,
      totalSets: 12,
      completed: true,
      day: "Sexta-feira",
    },
    {
      id: 4,
      emoji: "💪",
      title: "Força de Membros Superiores",
      date: "4 dias atrás",
      duration: "42 min",
      exercises: 6,
      totalSets: 18,
      completed: true,
      day: "Segunda-feira",
    },
    {
      id: 5,
      emoji: "🦵",
      title: "Potência de Membros Inferiores",
      date: "6 dias atrás",
      duration: "40 min",
      exercises: 5,
      totalSets: 15,
      completed: true,
      day: "Quarta-feira",
    },
  ]

  const handleLogout = async () => {
    try {
      console.log("🚪 Starting logout process...")
      const supabase = getSupabaseClient()
      
      // Clear localStorage first
      localStorage.removeItem("onboardingData")
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("❌ Logout error:", error)
        // Even if there's an error, we should still redirect
      } else {
        console.log("✅ Logout successful")
      }
      
    } catch (err) {
      console.error("❌ Logout error:", err)
    } finally {
      // Always redirect to signin, regardless of errors
      console.log("🔄 Redirecting to signin...")
      window.location.href = '/auth/signin'
    }
  }

  const handleProfileUpdate = async (newName: string) => {
    try {
      const supabase = getSupabaseClient()
      
      if (!profile?.id) {
        throw new Error("Perfil do usuário não encontrado")
      }
      
      console.log("🔄 Updating user profile:", { userId: profile.id, newName })
      
      // Update profile in Supabase users table (not profiles)
      const { error } = await supabase
        .from('users')
        .update({ 
          name: newName
        })
        .eq('id', profile.id)
      
      if (error) {
        console.error("❌ Error updating user name:", error)
        throw error
      }

      console.log("✅ User name updated successfully")

      // Update localStorage if exists
      const savedData = localStorage.getItem("onboardingData")
      if (savedData) {
        const data = JSON.parse(savedData)
        data.name = newName
        localStorage.setItem("onboardingData", JSON.stringify(data))
        setUserData(data)
      }

      // Force recompute of display name
      setDisplayName(newName)
      setInitials(newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2))
      
      // Refresh the profile from AuthProvider to sync state
      if (refreshProfile) {
        await refreshProfile()
      }
      
    } catch (error) {
      console.error("❌ Error updating profile:", error)
      throw error
    }
  }

  const handleOpenProfileModal = () => {
    setShowProfileModal(true)
  }

  const handleCloseProfileModal = () => {
    setShowProfileModal(false)
  }

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true)
  }

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false)
  }

  return {
    // State
    activeTab,
    userData,
    displayName,
    initials,
    nameLoading,
    user,
    workouts,
    workoutHistory,
    selectedWorkout,
    selectedHistoryWorkout,
    selectedMeal,
    showWeightUpdate,
    showWeeklyPlan,
    showProfileModal,
    showPasswordModal,
    selectedDay,
    currentHistoryPage,
    currentWeightPage,
    profile,
    
    // Actions
    setActiveTab,
    setSelectedWorkout,
    setSelectedHistoryWorkout,
    setSelectedMeal,
    setShowWeightUpdate,
    setShowWeeklyPlan,
    setSelectedDay,
    setCurrentHistoryPage,
    setCurrentWeightPage,
    handleLogout,
    handleProfileUpdate,
    handleOpenProfileModal,
    handleCloseProfileModal,
    handleOpenPasswordModal,
    handleClosePasswordModal,
  }
}
