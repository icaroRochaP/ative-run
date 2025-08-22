"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { signUpAndCreateProfile } from "@/app/auth-actions"

function isEmail(value: string) {
  // simple and practical email check (sufficient for client-side validation)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function OnboardingForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  // O campo de senha sempre será exibido abaixo do email
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (!isEmail(value) && value.length > 0) {
      setError("Por favor, insira um endereço de email válido.")
    } else {
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!isEmail(email)) {
      setError("Por favor, insira um endereço de email válido.")
      return
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }
    setIsPending(true)
    try {
      const result = await signUpAndCreateProfile(email, {}, password)
      if (result && !result.error) {
        // Autentica e segue onboarding
        router.push("/onboarding")
      } else {
        setError(result?.error || "Falha ao criar conta.")
      }
    } catch (err) {
      setError("Falha ao criar conta.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aleen-light to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-aleen-primary to-aleen-secondary p-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">Bem-vindo ao Aleen.ai</CardTitle>
          <CardDescription className="text-aleen-light">Comece sua jornada de saúde inteligente!</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Seu endereço de email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-aleen-secondary" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-aleen-primary rounded-2xl text-gray-800 placeholder:text-gray-400 text-base font-medium transition-all duration-300 focus:shadow-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-aleen-secondary" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 py-4 border-2 border-gray-200 focus:border-aleen-primary rounded-2xl text-gray-800 placeholder:text-gray-400 text-base font-medium transition-all duration-300 focus:shadow-lg"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-aleen-secondary hover:text-aleen-primary transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-aleen-secondary" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-aleen-primary rounded-2xl text-gray-800 placeholder:text-gray-400 text-base font-medium transition-all duration-300 focus:shadow-lg"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center space-x-3 text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-bold py-4 text-lg rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Criando Conta...
                </>
              ) : (
                <>
                  <UserPlus className="mr-3 h-5 w-5" />
                  Começar Jornada
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
