"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { changePasswordSimple } from "@/app/auth-actions"
import { Eye, EyeOff, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PasswordChangeModalProps {
  isOpen: boolean
  onPasswordChanged: () => void
  onClose?: () => void  // Add optional onClose prop
}

export function PasswordChangeModal({ isOpen, onPasswordChanged, onClose }: PasswordChangeModalProps) {
  const { user, profile, refreshProfile } = useAuth()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Check if user can close modal (new_account is false)
  const canClose = profile?.new_account === false

  // Handle ESC key when modal can be closed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && canClose && onClose) {
        onClose()
      }
    }
    
    if (isOpen && canClose) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (!isOpen) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, canClose, onClose])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setError("")
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos os campos são obrigatórios")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres")
      return
    }

    if (currentPassword === newPassword) {
      setError("A nova senha deve ser diferente da senha atual")
      return
    }

    setLoading(true)

    try {
      if (!user?.id) {
        throw new Error("Usuário não encontrado")
      }

      console.log("🔐 Attempting to change password for user:", user.id)
      
      const result = await changePasswordSimple(
        user.id,
        currentPassword,
        newPassword
      )

      if (!result.success) {
        throw new Error(result.error || "Erro ao alterar senha")
      }

      console.log("✅ Password changed successfully")
      
      // Refresh profile to get updated new_account status
      await refreshProfile()
      
      // Show success toast
      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha foi atualizada e sua conta está ativa.",
        variant: "default",
      })
      
      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      onPasswordChanged()
    } catch (error) {
      console.error("❌ Error changing password:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro ao alterar senha"
      
      // Better error messages based on common scenarios
      if (errorMessage.includes("Senha atual incorreta") || errorMessage.includes("Invalid login credentials")) {
        setError("Senha atual incorreta. Verifique e tente novamente.")
      } else if (errorMessage.includes("New password should be different") || errorMessage.includes("diferente")) {
        setError("A nova senha deve ser diferente da senha atual.")
      } else if (errorMessage.includes("Password is too weak") || errorMessage.includes("fraca")) {
        setError("A senha é muito fraca. Use pelo menos 6 caracteres com letras e números.")
      } else if (errorMessage.includes("Too many requests") || errorMessage.includes("tentativas")) {
        setError("Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.")
      } else if (errorMessage.includes("Usuário não autenticado") || errorMessage.includes("not authenticated")) {
        setError("Sessão expirada. Faça login novamente.")
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        setError("Erro de conexão. Verifique sua internet e tente novamente.")
      } else {
        setError(errorMessage || "Erro inesperado ao alterar senha. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (canClose && onClose) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setError("")
      onClose()
    }
  }

  // Handle click outside to close (only if allowed)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && canClose && onClose) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white p-8 relative">
          {canClose && onClose && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors rounded-full p-1 hover:bg-white/10"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">Alterar Senha</CardTitle>
            <CardDescription className="text-white/90 text-base">
              {profile?.new_account 
                ? "Por segurança, você precisa alterar sua senha antes de continuar"
                : "Altere sua senha para manter sua conta segura"
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="currentPassword" className="text-black font-medium">
                Senha Atual
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  required
                  className="border-2 border-aleen-light focus:border-aleen-primary rounded-2xl text-black placeholder:text-gray-400 py-3 pr-12 transition-all duration-300 focus:shadow-lg"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-aleen-primary transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="newPassword" className="text-black font-medium">
                Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  className="border-2 border-aleen-light focus:border-aleen-primary rounded-2xl text-black placeholder:text-gray-400 py-3 pr-12 transition-all duration-300 focus:shadow-lg"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-aleen-primary transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-black font-medium">
                Confirmar Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  required
                  className="border-2 border-aleen-light focus:border-aleen-primary rounded-2xl text-black placeholder:text-gray-400 py-3 pr-12 transition-all duration-300 focus:shadow-lg"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-aleen-primary transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border-2 border-red-200 rounded-2xl font-medium">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-bold py-4 text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              disabled={loading}
            >
              {loading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
