"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { resendConfirmationEmail } from "@/app/auth-actions"

export function ResendConfirmationForm() {
  const [email, setEmail] = useState("")
  const [state, formAction, isPending] = useActionState(resendConfirmationEmail, null)

  return (
    <Card className="w-full max-w-md bg-white border-2 border-gray-200 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-black mb-2">Resend Confirmation</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your email address to resend the confirmation link.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <form action={formAction} className="space-y-4">
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
              />
            </div>
          </div>

          {state?.success && (
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
              <CheckCircle className="h-4 w-4" />
              <span>{state.success}</span>
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
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Resend Email
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
