"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileModal } from "@/components/dashboard/modals/ProfileModal"
import { PasswordChangeModal } from "@/components/password-change-modal"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function DebugPage() {
  const { user, profile, refreshProfile } = useAuth()
  const { toast } = useToast()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleProfileUpdate = async (newName: string) => {
    try {
      const supabase = getSupabaseClient()
      
      if (!profile?.id) {
        throw new Error("Perfil não encontrado")
      }
      
      const { error } = await supabase
        .from('users')
        .update({ 
          name: newName,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)
      
      if (error) {
        throw error
      }

      // Refresh profile
      if (refreshProfile) {
        await refreshProfile()
      }
      
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      window.location.href = '/auth/signin'
    } catch (error) {
      console.error("Logout error:", error)
      window.location.href = '/auth/signin'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Debug Dashboard Functions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>User ID:</strong> {user?.id || 'Not logged in'}
            </div>
            <div>
              <strong>Profile Name:</strong> {profile?.name || 'No name'}
            </div>
            <div>
              <strong>Profile Email:</strong> {profile?.email || 'No email'}
            </div>
            <div>
              <strong>New Account:</strong> {profile?.new_account ? 'Yes' : 'No'}
            </div>
            
            <div className="space-x-4">
              <Button onClick={() => setShowProfileModal(true)}>
                Test Profile Modal
              </Button>
              <Button onClick={() => setShowPasswordModal(true)}>
                Test Password Modal
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                Test Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={{ name: profile?.name || "Test User" }}
          onProfileUpdate={handleProfileUpdate}
          onPasswordChange={() => {
            setShowProfileModal(false)
            setShowPasswordModal(true)
          }}
          onLogout={handleLogout}
        />

        <PasswordChangeModal
          isOpen={showPasswordModal}
          onPasswordChanged={() => setShowPasswordModal(false)}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  )
}
