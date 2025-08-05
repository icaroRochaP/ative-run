"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { isSupabaseConfigured } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, profile, loading, isConfigured } = useAuth()

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="mb-2 bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
      >
        🐛 Debug
      </Button>

      {isOpen && (
        <Card className="w-80 bg-white border-2 border-yellow-300 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Environment:</span>
                <Badge variant="secondary">{process.env.NODE_ENV}</Badge>
              </div>

              <div className="flex justify-between">
                <span>Supabase URL:</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Supabase Key:</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Supabase Configured:</span>
                <Badge variant={isSupabaseConfigured() ? "default" : "destructive"}>
                  {isSupabaseConfigured() ? "✅ Yes" : "❌ No"}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Auth Loading:</span>
                <Badge variant={loading ? "secondary" : "default"}>{loading ? "⏳ Loading" : "✅ Ready"}</Badge>
              </div>

              <div className="flex justify-between">
                <span>User:</span>
                <Badge variant={user ? "default" : "secondary"}>{user ? "✅ Logged in" : "❌ Not logged in"}</Badge>
              </div>

              <div className="flex justify-between">
                <span>Profile:</span>
                <Badge variant={profile ? "default" : "secondary"}>{profile ? "✅ Loaded" : "❌ No profile"}</Badge>
              </div>
            </div>

            <div className="pt-2 border-t border-yellow-200">
              <div className="text-yellow-700 font-medium mb-1">Local Storage:</div>
              <div className="text-xs">
                <div>Onboarding Data: {localStorage.getItem("onboardingData") ? "✅ Present" : "❌ None"}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-yellow-200">
              <Button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                size="sm"
                variant="destructive"
                className="w-full text-xs"
              >
                Clear Storage & Reload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
