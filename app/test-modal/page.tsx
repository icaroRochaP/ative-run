"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PasswordChangeModal } from "@/components/password-change-modal"

export default function TestModalPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-aleen-light to-white flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-black mb-4">Test Modal Page</h1>
        <p className="text-gray-600 mb-8">
          Esta página é para testar o modal de mudança de senha estilizado no padrão Aleen.ai
        </p>
        
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-bold py-4 px-8 text-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
        >
          Abrir Modal de Mudança de Senha
        </Button>

        <PasswordChangeModal 
          isOpen={showModal} 
          onPasswordChanged={() => {
            setShowModal(false)
            alert("Senha alterada com sucesso!")
          }}
        />
      </div>
    </div>
  )
}
