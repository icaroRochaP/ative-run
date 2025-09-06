// Dashboard Types
export interface User {
  name: string
  avatar?: string
  subscriptionStatus: 'active' | 'inactive' | 'pending'
  nextRenewal: string
  goals?: Goal[]
}

export interface Goal {
  name: string
  progress: number
  target: string
  current: string
}

export interface Workout {
  id: number
  emoji: string
  title: string
  exercises: number
  totalSets: number
  day: string
  duration?: string
  completed?: boolean
  date?: string
}

export interface Exercise {
  name: string
  sets: ExerciseSet[]
  videoId?: string
}

export interface ExerciseSet {
  reps: string
  weight: string
  completed: boolean
}

export interface WeightUpdate {
  weight: string
  date: string
  change: number
  hasPhoto: boolean
}

export interface ProgressPhoto {
  date: string
  weight: string
  image: string
}

export interface Meal {
  meal: string
  calories: number
  protein: string
  carbs: string
  fat: string
  foods: string[]
  // Additional fields for enhanced meal details
  recipeId?: string
  recipeName?: string
  recipeDescription?: string
  recipeImageUrl?: string
  // Consumption tracking
  isConsumed?: boolean
  isConsumptionLoading?: boolean
}

export interface DayMealPlan {
  day: string
  totalCalories: number
  meals: Meal[]
}

export interface MealPlan {
  [key: string]: DayMealPlan
}

// Component Props Interfaces
export interface UserHeaderCardProps {
  user: User
  displayName: string | null
  initials: string
  nameLoading: boolean
}

export interface ActivityStatsCardProps {
  workoutsThisMonth: number
  streakDays: number
}

export interface QuickActionsCardProps {
  userData: any
  profile: any
  displayName: string | null
}

export interface WorkoutCardProps {
  workout: Workout
  onClick?: (workout: Workout) => void
}

export interface WeightProgressCardProps {
  currentWeight: number
  targetWeight: number
  startWeight: number
  onUpdateWeight: () => void
  onEditGoal: () => void
}

export interface ProgressPhotoCardProps {
  photos: ProgressPhoto[]
}

export interface MealCardProps {
  meal: Meal
  onClick?: (meal: Meal) => void
  onConsumptionToggle?: (meal: Meal) => void
}

export interface MacroGoalsCardProps {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Modal Props Interfaces
export interface WorkoutDetailModalProps {
  workout: Workout | null
  onClose: () => void
  exercises?: Exercise[]
}

export interface WorkoutHistoryModalProps {
  workout: Workout | null
  onClose: () => void
  exercises?: Exercise[]
}

export interface WeightUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (weight: string, photo: File | null) => void
}

export interface WeeklyMealPlanModalProps {
  isOpen: boolean
  onClose: () => void
  mealPlan: MealPlan
  onMealSelect: (meal: Meal) => void
}

export interface MealDetailModalProps {
  meal: Meal | null
  onClose: () => void
  onMarkConsumed?: (meal: Meal) => void
}

// Tab Props Interfaces
export interface ResumoTabProps {
  user: User
  displayName: string | null
  initials: string
  nameLoading: boolean
  userData: any
  profile: any
  workoutsThisMonth: number
  streakDays: number
  onProfileClick?: () => void
}

export interface TreinoTabProps {
  workouts: Workout[]
  workoutHistory: Workout[]
  onWorkoutSelect: (workout: Workout) => void
  onHistoryWorkoutSelect: (workout: Workout) => void
  currentHistoryPage: number
  onHistoryPageChange: (page: number) => void
}

export interface ProgressoTabProps {
  currentWeight: number
  targetWeight: number
  startWeight: number
  weightUpdates: WeightUpdate[]
  progressPhotos: ProgressPhoto[]
  onUpdateWeight: () => void
  currentWeightPage: number
  onWeightPageChange: (page: number) => void
}

export interface NutricaoTabProps {
  userId: string
  dailyCalories: number
  protein: number
  carbs: number
  fat: number
  todayMeals: Meal[]
  onMealSelect: (meal: Meal) => void
  onShowWeeklyPlan: () => void
  onConsumptionToggle?: (meal: Meal) => void
  loading?: boolean
  error?: string | null
  hasNoMealPlan?: boolean
}

// Dashboard Context Interface
export interface DashboardContextType {
  // User data
  user: User
  displayName: string | null
  initials: string
  nameLoading: boolean
  
  // Workout data
  workouts: Workout[]
  workoutHistory: Workout[]
  selectedWorkout: Workout | null
  selectedHistoryWorkout: Workout | null
  
  // Weight tracking
  currentWeight: number
  targetWeight: number
  startWeight: number
  weightUpdates: WeightUpdate[]
  progressPhotos: ProgressPhoto[]
  
  // Nutrition data
  mealPlan: MealPlan
  selectedMeal: Meal | null
  
  // UI state
  activeTab: string
  showWeightUpdate: boolean
  showWeeklyPlan: boolean
  selectedDay: string
  currentHistoryPage: number
  currentWeightPage: number
  
  // Actions
  setActiveTab: (tab: string) => void
  setSelectedWorkout: (workout: Workout | null) => void
  setSelectedHistoryWorkout: (workout: Workout | null) => void
  setSelectedMeal: (meal: Meal | null) => void
  setShowWeightUpdate: (show: boolean) => void
  setShowWeeklyPlan: (show: boolean) => void
  setSelectedDay: (day: string) => void
  setCurrentHistoryPage: (page: number) => void
  setCurrentWeightPage: (page: number) => void
  handleWeightUpdate: (weight: string, photo: File | null) => void
  handleLogout: () => void
}
