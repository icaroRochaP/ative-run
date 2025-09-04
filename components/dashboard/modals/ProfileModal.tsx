"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Key, LogOut, X, Edit3, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onProfileUpdate: (newName: string) => Promise<void>
  onPasswordChange: () => void
  onLogout: () => void
}

export function ProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  onProfileUpdate, 
  onPasswordChange, 
  onLogout 
}: ProfileModalProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Initialize name when modal opens or user changes
  useEffect(() => {
    if (isOpen && user?.name) {
      setNewName(user.name)
    }
  }, [isOpen, user?.name])

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    setIsEditingName(false)
    setNewName(user?.name || "")
    onClose()
  }

  const handleSaveName = async () => {
    if (newName.trim().length < 2) {
      toast({
        title: "Nome muito curto",
        description: "O nome deve ter pelo menos 2 caracteres.",
        variant: "destructive",
      })
      return
    }

    if (newName.trim() === user?.name) {
      setIsEditingName(false)
      return
    }
    
    setLoading(true)
    try {
      console.log("🔄 Updating profile name from:", user?.name, "to:", newName.trim())
      
      await onProfileUpdate(newName.trim())
      setIsEditingName(false)
      
      toast({
        title: "Nome atualizado",
        description: "Seu nome foi atualizado com sucesso!",
        variant: "default",
      })
      
      console.log("✅ Profile name updated successfully")
      
    } catch (error) {
      console.error("❌ Error updating name:", error)
      
      let errorMessage = "Não foi possível atualizar seu nome. Tente novamente."
      
      if (error instanceof Error) {
        if (error.message.includes("permission denied") || error.message.includes("not authenticated")) {
          errorMessage = "Você não tem permissão para atualizar o nome. Faça login novamente."
        } else if (error.message.includes("network")) {
          errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Erro ao atualizar nome",
        description: errorMessage,
        variant: "destructive",
      })
      
      // Reset to original name on error
      setNewName(user?.name || "")
      
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingName(false)
    setNewName(user?.name || "")
  }

  const handlePasswordChange = () => {
    handleClose()
    onPasswordChange()
  }

  const handleLogoutClick = () => {
    handleClose()
    onLogout()
  }

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay-full bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-sm bg-white border-0 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors rounded-full p-1 hover:bg-white/10"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
          <CardTitle className="text-xl font-bold flex items-center">
            <User className="mr-3 h-6 w-6" />
            Perfil do Usuário
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Name Section */}
          <div className="p-4 border-2 border-aleen-light rounded-2xl hover:border-aleen-primary transition-colors">
            {isEditingName ? (
              <div className="space-y-3">
                <Label htmlFor="editName" className="text-gray-700 font-medium">
                  Nome completo
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="editName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 border-aleen-light focus:border-aleen-primary rounded-xl"
                    placeholder="Seu nome"
                    disabled={loading}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSaveName()
                      } else if (e.key === 'Escape') {
                        e.preventDefault()
                        handleCancelEdit()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSaveName}
                    disabled={loading || newName.trim().length < 2}
                    size="sm"
                    className="bg-aleen-primary hover:bg-aleen-secondary rounded-xl px-3"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    size="sm"
                    variant="outline"
                    className="rounded-xl px-3"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-aleen-primary" />
                  <span className="font-medium text-gray-800">{user?.name || "Usuário"}</span>
                </div>
                <Button
                  onClick={() => setIsEditingName(true)}
                  size="sm"
                  variant="ghost"
                  className="text-aleen-primary hover:text-aleen-secondary hover:bg-aleen-primary/10 rounded-xl"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Password Change */}
          <button
            onClick={handlePasswordChange}
            className="w-full flex items-center justify-between p-4 border-2 border-aleen-light rounded-2xl hover:border-aleen-primary transition-colors text-left group"
          >
            <div className="flex items-center">
              <Key className="mr-3 h-5 w-5 text-aleen-primary group-hover:text-aleen-secondary transition-colors" />
              <span className="font-medium text-gray-800">Trocar Senha</span>
            </div>
            <span className="text-aleen-primary group-hover:text-aleen-secondary transition-colors">›</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-between p-4 border-2 border-red-200 rounded-2xl hover:border-red-400 transition-colors text-left group"
          >
            <div className="flex items-center">
              <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
              <span className="font-medium text-red-600 group-hover:text-red-700 transition-colors">Sair da Conta</span>
            </div>
            <span className="text-red-500 group-hover:text-red-600 transition-colors">›</span>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
