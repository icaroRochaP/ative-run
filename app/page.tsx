"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Heart,
  User,
  Target,
  Dumbbell,
  Apple,
  Camera,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  UserPlus,
  Mail,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  getOnboardingQuestions,
  getUserResponses,
  // Removed saveResponseAndUpdateProfile from here
  shouldShowQuestion,
  validateResponse,
  type OnboardingQuestion,
} from "@/lib/onboarding"
import { useAuth } from "@/components/auth-provider"
import {
  completeOnboarding,
  signUpAndCreateProfile,
  saveOnboardingResponses,
  saveIndividualOnboardingResponseAndProfile, // Import new server action
} from "@/app/auth-actions"
import { DebugPanel } from "@/components/debug-panel"

const iconMap: Record<string, any> = {
  User,
  Target,
  Dumbbell,
  Apple,
  Camera,
}

export default function FitnessOnboarding() {
  const router = useRouter()
  const { user, isConfigured } = useAuth()

  console.log("🚀 FitnessOnboarding component loaded")
  console.log("👤 User:", user ? "Logged in" : "Not logged in")
  console.log("⚙️ Supabase configured:", isConfigured)

  const [currentStep, setCurrentStep] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([])
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [visibleQuestions, setVisibleQuestions] = useState<OnboardingQuestion[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userCreated, setUserCreated] = useState(false)

  useEffect(() => {
    console.log("🔎 FitnessOnboarding: isConfigured:", isConfigured)
    console.log("🔎 FitnessOnboarding: user:", user)
    getOnboardingQuestions().then((qs) => {
      console.log("🔎 FitnessOnboarding: onboarding questions:", qs)
      setQuestions(qs)
    })
  }, [isConfigured, user])

  useEffect(() => {
    loadOnboardingData()
  }, [user])

  useEffect(() => {
    if (questions.length > 0) {
      updateVisibleQuestions()
    }
  }, [questions, responses])

  useEffect(() => {
    if (visibleQuestions.length > 0) {
      setProgress((currentStep / visibleQuestions.length) * 100)
    }
  }, [currentStep, visibleQuestions.length])

  const loadOnboardingData = async () => {
    try {
      const questionsData = await getOnboardingQuestions()
      setQuestions(questionsData)

      if (user) {
        setCurrentUser(user)
        setUserCreated(true)
        const userResponses = await getUserResponses(user.id)
        const responsesMap: Record<string, any> = {}

        userResponses.forEach((response: any) => {
          const question = response.onboarding_questions
          if (question) {
            responsesMap[question.field_name] = response.response_array || response.response_value
          }
        })

        setResponses(responsesMap)
      }
    } catch (error) {
      console.error("Error loading onboarding data:", error)
    } finally {
      setLoading(false
      )
    }
  }

  const updateVisibleQuestions = () => {
    const visible = questions.filter((question) => shouldShowQuestion(question, responses))
    setVisibleQuestions(visible)
  }

  const updateResponse = (fieldName: string, value: any) => {
    const newResponses = { ...responses, [fieldName]: value }
    setResponses(newResponses)

    // Clear any existing error for this field
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }

    // Save locally if Supabase is not configured
    if (!isConfigured) {
      localStorage.setItem("onboardingData", JSON.stringify(newResponses))
    }
  }

  const handleArrayUpdate = (fieldName: string, value: string, checked: boolean) => {
    const currentArray = (responses[fieldName] as string[]) || []
    let newArray: string[]

    if (checked) {
      newArray = [...currentArray, value]
    } else {
      newArray = currentArray.filter((item) => item !== value)
    }

    updateResponse(fieldName, newArray)
  }

  const nextStep = async () => {
    const currentQuestion = visibleQuestions[currentStep]
    if (!currentQuestion) return

    const value = responses[currentQuestion.field_name]
    const validation = validateResponse(currentQuestion, value)

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.field_name]: validation.error || "Invalid input",
      }))
      return
    }

    // Logic to create user and save all previous responses when email is submitted
    if (currentQuestion.field_name === "email" && !userCreated && isConfigured) {
      try {
        console.log("📧 Email provided, attempting to create user on NEXT click...")
        const emailValue = responses.email as string
        if (!emailValue) {
          setErrors((prev) => ({ ...prev, [currentQuestion.field_name]: "Email is required." }))
          return
        }

        const userData = await signUpAndCreateProfile(emailValue, responses)
        const createdUser = userData?.data?.user
        if (createdUser) {
          setCurrentUser(createdUser)
          setUserCreated(true)
          console.log("✅ User created successfully via Server Action:", createdUser.id)

          await saveOnboardingResponses(createdUser.id, responses, questions)
          console.log("✅ All previous responses saved to Supabase via Server Action.")
        } else {
          console.error("❌ Error: User not created. userData:", userData)
        }
      } catch (error: any) {
        console.error("❌ Error creating user on NEXT click:", error)
        setErrors((prev) => ({
          ...prev,
          [currentQuestion.field_name]: `Failed to create account: ${error.message || "Unknown error"}`,
        }))
        return
      }
    }
    // For subsequent questions after user creation, save individual response
    else if (currentUser && userCreated && isConfigured) {
      try {
        // Call the new Server Action for individual response and profile updates
        await saveIndividualOnboardingResponseAndProfile(
          currentUser.id,
          currentQuestion.id,
          currentQuestion.field_name,
          value,
        )
      } catch (error) {
        console.error("❌ Error saving response after user created:", error)
      }
    }

    if (currentStep < visibleQuestions.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleExistingAccount = () => {
    router.push("/auth/signin")
  }

  const handleCompleteOnboarding = async () => {
    try {
      const userToComplete = currentUser || user

      if (userToComplete && isConfigured) {
        await completeOnboarding(userToComplete.id, {
          age: responses.age ? Number.parseInt(responses.age) : null,
          gender: responses.gender,
          weight: responses.weight,
          height: responses.height,
          primary_goal: responses.primaryGoal,
        })
        console.log("✅ Onboarding completed for user:", userToComplete.id)
      } else if (!isConfigured) {
        localStorage.setItem("onboardingData", JSON.stringify(responses))
        console.log("💾 Data stored locally")
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("❌ Error completing onboarding:", error)
      if (isConfigured) {
        alert("Error completing onboarding. Please try again.")
      } else {
        localStorage.setItem("onboardingData", JSON.stringify(responses))
        router.push("/dashboard")
      }
    }
  }

  const canProceed = () => {
    const currentQuestion = visibleQuestions[currentStep]
    if (!currentQuestion) return true

    const value = responses[currentQuestion.field_name]
    const validation = validateResponse(currentQuestion, value)

    return validation.isValid
  }

  const renderQuestion = (question: OnboardingQuestion) => {
    const IconComponent = question.icon ? iconMap[question.icon] : null
    const value = responses[question.field_name]
    const error = errors[question.field_name]
    const isEmailQuestion = question.field_name === "email"

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          {question.emoji ? (
            <div className="text-4xl mb-4">{question.emoji}</div>
          ) : IconComponent ? (
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          ) : null}
          <h2 className="text-2xl font-bold text-black mb-2">{question.title}</h2>
          {question.subtitle && <p className="text-gray-600">{question.subtitle}</p>}

          {/* Mostrar status especial para pergunta do email */}
          {isEmailQuestion && !userCreated && isConfigured && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Mail className="h-3 w-3 mr-1" />
                Your account will be created after this step
              </Badge>
            </div>
          )}

          {/* Mostrar status de salvamento após usuário criado */}
          {userCreated && isConfigured && (
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                <UserPlus className="h-3 w-3 mr-1" />
                Account created - Auto-saving responses
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {question.question_type === "text" && (
            <>
              <Label htmlFor={question.field_name} className="text-black font-medium">
                {question.title}
              </Label>
              <Input
                id={question.field_name}
                value={value || ""}
                onChange={(e) => updateResponse(question.field_name, e.target.value)}
                placeholder={question.placeholder || ""}
                className={`border-2 ${error ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 py-3`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}

          {question.question_type === "number" && (
            <>
              <Label htmlFor={question.field_name} className="text-black font-medium">
                {question.title}
              </Label>
              <Input
                id={question.field_name}
                type="number"
                value={value || ""}
                onChange={(e) => updateResponse(question.field_name, e.target.value)}
                placeholder={question.placeholder || ""}
                className={`border-2 ${error ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 py-3`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}

          {question.question_type === "email" && (
            <>
              <Label htmlFor={question.field_name} className="text-black font-medium">
                {question.title}
              </Label>
              <Input
                id={question.field_name}
                type="email"
                value={value || ""}
                onChange={(e) => updateResponse(question.field_name, e.target.value)}
                placeholder={question.placeholder || ""}
                className={`border-2 ${error ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 py-3`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {isEmailQuestion && !userCreated && (
                <p className="text-sm text-blue-600 mt-2">
                  💡 After entering your email, we'll create your account with all the information you've provided so
                  far.
                </p>
              )}
            </>
          )}

          {question.question_type === "textarea" && (
            <>
              <Label htmlFor={question.field_name} className="text-black font-medium">
                {question.title}
              </Label>
              <Textarea
                id={question.field_name}
                value={value || ""}
                onChange={(e) => updateResponse(question.field_name, e.target.value)}
                placeholder={question.placeholder || ""}
                className={`border-2 ${error ? "border-red-500" : "border-gray-200"} focus:border-black text-black placeholder:text-gray-400 min-h-[120px]`}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}

          {question.question_type === "radio" && question.options && (
            <RadioGroup value={value || ""} onValueChange={(newValue) => updateResponse(question.field_name, newValue)}>
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div
                    key={option}
                    className={`flex items-center space-x-3 p-4 border-2 ${error ? "border-red-500" : "border-gray-200"} rounded-lg hover:border-gray-300 transition-colors`}
                  >
                    <RadioGroupItem value={option.toLowerCase()} id={option} className="border-2 border-gray-400" />
                    <Label htmlFor={option} className="text-black cursor-pointer flex-1 font-medium">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </RadioGroup>
          )}

          {question.question_type === "checkbox" && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-3 p-4 border-2 ${error ? "border-red-500" : "border-gray-200"} rounded-lg hover:border-gray-300 transition-colors`}
                >
                  <Checkbox
                    id={option}
                    checked={((value as string[]) || []).includes(option)}
                    onCheckedChange={(checked) => handleArrayUpdate(question.field_name, option, checked as boolean)}
                    className="border-2 border-gray-400"
                  />
                  <Label htmlFor={option} className="text-black cursor-pointer flex-1 font-medium">
                    {option}
                  </Label>
                </div>
              ))}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-black mb-3">Welcome to FitJourney</h1>
              <p className="text-gray-600 text-lg">Let's create your personalized fitness plan together</p>

              {isConfigured && (
                <div className="mt-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Mail className="h-3 w-3 mr-1" />
                    Account created after email step
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setIsStarted(true)}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 text-lg shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />I am new - Let's start!
              </Button>

              <Button
                onClick={handleExistingAccount}
                variant="outline"
                className="w-full border-2 border-gray-300 text-black hover:bg-gray-50 py-4 text-lg transition-all duration-200 bg-transparent"
              >
                I already have an account
              </Button>
            </div>
          </CardContent>
        </Card>
        <DebugPanel />
      </div>
    )
  }

  if (currentStep >= visibleQuestions.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-md">
          <Card className="bg-white border-2 border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-black mb-3">Welcome to your fitness journey!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Thank you for completing your profile, {responses.name}!
                {userCreated && isConfigured && (
                  <span className="block mt-2 text-sm text-green-600">
                    ✅ Your account has been created and all responses saved!
                  </span>
                )}
              </p>
              <div className="space-y-4">
                <Button
                  onClick={handleCompleteOnboarding}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 text-lg shadow-lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start My Journey
                </Button>
                <p className="text-gray-500 text-sm">You'll receive your custom plan within 24 hours!</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <DebugPanel />
      </div>
    )
  }

  const currentQuestion = visibleQuestions[currentStep]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 text-sm font-medium">Progress</span>
            <span className="text-gray-600 text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <Badge variant="secondary" className="bg-black text-white">
              Step {currentStep + 1} of {visibleQuestions.length}
            </Badge>
            <span className="text-gray-500 text-xs">{visibleQuestions.length - currentStep - 1} questions left</span>
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-white border-2 border-gray-200 shadow-lg mb-8">
          <CardContent className="p-8">{currentQuestion && renderQuestion(currentQuestion)}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-2 border-gray-300 text-black hover:bg-gray-50 disabled:opacity-50 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-black hover:bg-gray-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === visibleQuestions.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <DebugPanel />
      </div>
    </div>
  )
}
