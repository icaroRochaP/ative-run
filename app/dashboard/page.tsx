"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDisplayName, getInitials } from "@/lib/user-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthGuard } from "@/components/auth-guard"
import {
  Target,
  Dumbbell,
  Calendar,
  Camera,
  CreditCard,
  Apple,
  Play,
  TrendingUp,
  Award,
  Zap,
  Instagram,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  LogOut,
} from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function FitnessDashboard() {
  const [activeTab, setActiveTab] = useState("summary")
  const [userData, setUserData] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [initials, setInitials] = useState<string>("")
  const [nameLoading, setNameLoading] = useState<boolean>(true)
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedHistoryWorkout, setSelectedHistoryWorkout] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [currentHistoryPage, setCurrentHistoryPage] = useState(0)
  const [showWeightUpdate, setShowWeightUpdate] = useState(false)
  const [newWeight, setNewWeight] = useState("")
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [currentWeightPage, setCurrentWeightPage] = useState(0)
  const [weightUpdates, setWeightUpdates] = useState([
    { weight: "72.5", date: "Today", change: -0.5, hasPhoto: true },
    { weight: "73.0", date: "3 days ago", change: -1.0, hasPhoto: false },
    { weight: "74.0", date: "1 week ago", change: -0.8, hasPhoto: true },
    { weight: "74.8", date: "2 weeks ago", change: -1.2, hasPhoto: false },
    { weight: "76.0", date: "3 weeks ago", change: -0.5, hasPhoto: true },
    { weight: "76.5", date: "1 month ago", change: -0.7, hasPhoto: false },
    { weight: "77.2", date: "5 weeks ago", change: -0.8, hasPhoto: true },
  ])

  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false)
  const [selectedDay, setSelectedDay] = useState("monday")
  const [selectedMeal, setSelectedMeal] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const router = useRouter()
  
  // Get auth context for user data
  const { profile, loading: authLoading } = useAuth()

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      router.push('/auth/signin')
    }
  }

  useEffect(() => {
    const savedData = localStorage.getItem("onboardingData")
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
  }, [])

  // Manage display name and initials derived from auth profile or userData.name
  useEffect(() => {
    let mounted = true
    const minDelay = 300 // ms minimum loader to avoid flash
    let timeoutId: any = null // eslint-disable-line @typescript-eslint/no-explicit-any

    async function computeName() {
      setNameLoading(true)
      
      // Priority: 1) profile.name from auth, 2) userData.name from localStorage, 3) null
      const name = profile?.name ?? userData?.name ?? null

      // Wait at least minDelay to avoid flashing
      const start = Date.now()

      const formatted = formatDisplayName(name)
      const initialsValue = getInitials(name)

      const elapsed = Date.now() - start
      const remaining = Math.max(0, minDelay - elapsed)

      // If name is null/undefined, wait up to 5s for it to appear
      if (!formatted) {
        timeoutId = setTimeout(() => {
          if (!mounted) return
          // fallback after 5s
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

    // Only compute name if we're not currently loading auth and we have some data
    if (!authLoading) {
      computeName()
    }

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [profile?.name, userData?.name, authLoading])

  const user = {
    name: displayName || "Usuário",
    avatar: "/placeholder.svg?height=80&width=80", 
    subscriptionStatus: "active",
    nextRenewal: "2024-02-15",
    goals: [
      { name: "Weight Loss", progress: 75, target: "10 lbs", current: "7.5 lbs" },
      { name: "Muscle Gain", progress: 60, target: "5 lbs", current: "3 lbs" },
      { name: "Cardio Endurance", progress: 85, target: "30 min", current: "25.5 min" },
    ],
  }

  const [progressPhotos, setProgressPhotos] = useState([
    { date: "2024-01-01", weight: "74.0", image: "/placeholder.svg?height=200&width=150" },
    { date: "2024-01-15", weight: "73.2", image: "/placeholder.svg?height=200&width=150" },
    { date: "2024-02-01", weight: "72.5", image: "/placeholder.svg?height=200&width=150" },
  ])

  const weeklyMealPlan = {
    monday: {
      day: "Monday",
      totalCalories: 1450,
      meals: [
        {
          meal: "Breakfast",
          calories: 450,
          protein: "25g",
          carbs: "45g",
          fat: "18g",
          foods: ["2 eggs", "1 slice whole grain bread", "1/2 avocado", "1 cup coffee"],
        },
        {
          meal: "Lunch",
          calories: 520,
          protein: "35g",
          carbs: "40g",
          fat: "22g",
          foods: ["150g grilled chicken", "100g brown rice", "Mixed vegetables", "1 tbsp olive oil"],
        },
        {
          meal: "Dinner",
          calories: 480,
          protein: "30g",
          carbs: "35g",
          fat: "20g",
          foods: ["120g salmon", "150g sweet potato", "Green salad", "1 tbsp dressing"],
        },
      ],
    },
    tuesday: {
      day: "Tuesday",
      totalCalories: 1420,
      meals: [
        {
          meal: "Breakfast",
          calories: 420,
          protein: "22g",
          carbs: "48g",
          fat: "16g",
          foods: ["1 cup oatmeal", "1 banana", "1 tbsp almond butter", "1 cup green tea"],
        },
        {
          meal: "Lunch",
          calories: 540,
          protein: "38g",
          carbs: "42g",
          fat: "24g",
          foods: ["150g turkey breast", "100g quinoa", "Roasted vegetables", "1 tbsp tahini"],
        },
        {
          meal: "Dinner",
          calories: 460,
          protein: "28g",
          carbs: "38g",
          fat: "18g",
          foods: ["120g white fish", "150g roasted potatoes", "Steamed broccoli", "Lemon dressing"],
        },
      ],
    },
    wednesday: {
      day: "Wednesday",
      totalCalories: 1480,
      meals: [
        {
          meal: "Breakfast",
          calories: 480,
          protein: "28g",
          carbs: "42g",
          fat: "20g",
          foods: ["Greek yogurt", "Mixed berries", "Granola", "1 tbsp honey"],
        },
        {
          meal: "Lunch",
          calories: 500,
          protein: "32g",
          carbs: "45g",
          fat: "20g",
          foods: ["150g lean beef", "100g pasta", "Tomato sauce", "Parmesan cheese"],
        },
        {
          meal: "Dinner",
          calories: 500,
          protein: "35g",
          carbs: "30g",
          fat: "25g",
          foods: ["150g chicken thigh", "Mixed green salad", "Nuts", "Olive oil dressing"],
        },
      ],
    },
    thursday: {
      day: "Thursday",
      totalCalories: 1440,
      meals: [
        {
          meal: "Breakfast",
          calories: 440,
          protein: "24g",
          carbs: "46g",
          fat: "18g",
          foods: ["Protein smoothie", "1 banana", "Spinach", "Almond milk"],
        },
        {
          meal: "Lunch",
          calories: 520,
          protein: "36g",
          carbs: "38g",
          fat: "22g",
          foods: ["150g pork tenderloin", "100g wild rice", "Asparagus", "Herb butter"],
        },
        {
          meal: "Dinner",
          calories: 480,
          protein: "30g",
          carbs: "40g",
          fat: "18g",
          foods: ["120g cod", "150g mashed cauliflower", "Green beans", "Lemon"],
        },
      ],
    },
    friday: {
      day: "Friday",
      totalCalories: 1460,
      meals: [
        {
          meal: "Breakfast",
          calories: 460,
          protein: "26g",
          carbs: "44g",
          fat: "19g",
          foods: ["2 whole grain pancakes", "Greek yogurt", "Blueberries", "Maple syrup"],
        },
        {
          meal: "Lunch",
          calories: 510,
          protein: "34g",
          carbs: "41g",
          fat: "21g",
          foods: ["150g grilled shrimp", "100g couscous", "Mediterranean vegetables", "Feta cheese"],
        },
        {
          meal: "Dinner",
          calories: 490,
          protein: "32g",
          carbs: "36g",
          fat: "22g",
          foods: ["120g lamb", "Roasted root vegetables", "Mint sauce", "Side salad"],
        },
      ],
    },
    saturday: {
      day: "Saturday",
      totalCalories: 1500,
      meals: [
        {
          meal: "Breakfast",
          calories: 500,
          protein: "30g",
          carbs: "40g",
          fat: "22g",
          foods: ["Veggie omelet", "2 eggs", "Cheese", "Whole grain toast"],
        },
        {
          meal: "Lunch",
          calories: 530,
          protein: "38g",
          carbs: "38g",
          fat: "24g",
          foods: ["150g chicken breast", "Quinoa salad", "Avocado", "Lime dressing"],
        },
        {
          meal: "Dinner",
          calories: 470,
          protein: "28g",
          carbs: "42g",
          fat: "18g",
          foods: ["120g sea bass", "150g jasmine rice", "Stir-fried vegetables", "Ginger sauce"],
        },
      ],
    },
    sunday: {
      day: "Sunday",
      totalCalories: 1420,
      meals: [
        {
          meal: "Breakfast",
          calories: 420,
          protein: "22g",
          carbs: "48g",
          fat: "16g",
          foods: ["Chia pudding", "Coconut milk", "Fresh fruits", "Almonds"],
        },
        {
          meal: "Lunch",
          calories: 540,
          protein: "36g",
          carbs: "40g",
          fat: "24g",
          foods: ["150g turkey", "Sweet potato", "Brussels sprouts", "Cranberry sauce"],
        },
        {
          meal: "Dinner",
          calories: 460,
          protein: "30g",
          carbs: "35g",
          fat: "18g",
          foods: ["120g tuna steak", "Quinoa", "Grilled zucchini", "Herb oil"],
        },
      ],
    },
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aleen-light to-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center">
            <div className="w-32 h-16 flex items-center justify-center">
              <Image
                src="/placeholder-logo.png"
                alt="Aleen.ai Logo"
                width={128}
                height={64}
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border-0 shadow-xl rounded-2xl p-1">
            <TabsTrigger
              value="summary"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Resumo
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Treino
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Progresso
            </TabsTrigger>
            <TabsTrigger
              value="nutrition"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Nutrição
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            {/* User Header */}
            <Card className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-3 border-aleen-light shadow-lg">
                    <AvatarFallback className="bg-white text-aleen-primary font-bold text-lg" aria-label={`Avatar de ${user.name}`}>
                      {nameLoading ? (
                        <div className="animate-pulse bg-aleen-primary/30 rounded w-8 h-8"></div>
                      ) : (
                        initials || (user.name ? user.name.charAt(0).toUpperCase() : "U")
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">
                      {nameLoading ? (
                        <div className="animate-pulse bg-white/30 rounded h-8 w-32"></div>
                      ) : (
                        user.name
                      )}
                    </h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-aleen-light text-aleen-primary font-semibold">
                        {getStatusText(user.subscriptionStatus)}
                      </Badge>
                      <span className="text-sm opacity-90">Renovação: {user.nextRenewal}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workouts This Month & Day Streak */}
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-aleen-secondary" />
                  Sua Atividade
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-2xl text-white shadow-lg">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
... (file continues)
