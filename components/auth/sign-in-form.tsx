"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
    <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-black mb-2">Welcome Back!</CardTitle>
        <CardDescription className="text-gray-600">Sign in to continue your fitness journey.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-black text-black placeholder:text-gray-400 py-3"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-black text-black placeholder:text-gray-400 py-3"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 text-base shadow-lg transition-all duration-200 hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 space-y-2">
          <Link href="/auth/forgot-password" className="underline hover:text-black">
            Forgot your password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link href="/onboarding" className="underline hover:text-black">
              Start Onboarding
            </Link>
          </p>
          <p>
            Didn't receive confirmation email?{" "}
            <Link href="/auth/resend-confirmation" className="underline hover:text-black">
              Resend it
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
