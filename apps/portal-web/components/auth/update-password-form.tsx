"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { updatePassword } from "@/app/auth-actions"

export function UpdatePasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [state, formAction, isPending] = useActionState(updatePassword, null)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (state?.success) {
      // Redireciona para a página de login após sucesso
      router.push("/auth/signin?message=Password updated successfully! Please sign in.")
    }
  }, [state, router])

  const handleSubmit = async (formData: FormData) => {
    setLocalError(null) // Clear previous local errors
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      // Basic validation, Supabase has its own
      setLocalError("Password must be at least 6 characters long.")
      return
    }
    await formAction(formData)
  }

  return (
    <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-black mb-2">Set New Password</CardTitle>
        <CardDescription className="text-gray-600">Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
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
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-black text-black placeholder:text-gray-400 py-3"
              />
            </div>
          </div>

          {localError && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{localError}</span>
            </div>
          )}

          {state?.error && (
            <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{state.error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 text-base shadow-lg transition-all duration-200 hover:shadow-xl"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <Link href="/auth/signin" className="underline hover:text-black">
            Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
