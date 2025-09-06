"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, LogIn, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseClient()
      console.log("🔐 Attempting client-side login for:", email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("❌ Client-side login error:", error.message)
        setError(error.message)
        return
      }

      console.log("✅ Client-side login successful:", data.user?.id)
      // Navegação será feita automaticamente pelo AuthGuard quando o estado mudar
      router.push("/dashboard")
    } catch (err) {
      console.error("❌ Unexpected login error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-aleen-light flex flex-col items-center justify-center pt-0 px-4 pb-4">
      <div className="flex items-center justify-center mb-6">
        <div className="w-32 h-16 flex items-center justify-center">
          <Image src="/placeholder-logo.png" alt="Aleen.ai Logo" width={128} height={64} />
        </div>
      </div>
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-aleen-primary to-aleen-secondary p-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</CardTitle>
          <CardDescription className="text-aleen-light">Entre para continuar sua jornada de saúde.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-aleen-secondary" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-aleen-primary rounded-2xl text-gray-800 placeholder:text-gray-400 text-base font-medium transition-all duration-300 focus:shadow-lg"
                  disabled={loading}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 py-4 border-2 border-gray-200 focus:border-aleen-primary rounded-2xl text-gray-800 placeholder:text-gray-400 text-base font-medium transition-all duration-300 focus:shadow-lg"
                  disabled={loading}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-3 h-5 w-5" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 space-y-3">
            <Link href="/auth/forgot-password" className="block text-aleen-secondary hover:text-aleen-primary font-medium transition-colors">
              Esqueceu sua senha?
            </Link>
            <p className="text-gray-500">
              Não tem uma conta?{" "}
              <Link href="/onboarding" className="text-aleen-secondary hover:text-aleen-primary font-medium transition-colors">
                Começar Cadastro
              </Link>
            </p>
            <p className="text-gray-500">
              Não recebeu o email de confirmação?{" "}
              <Link href="/auth/resend-confirmation" className="text-aleen-secondary hover:text-aleen-primary font-medium transition-colors">
                Reenviar
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
