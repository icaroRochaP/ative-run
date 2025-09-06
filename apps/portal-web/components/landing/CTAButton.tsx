"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface CTAButtonProps {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  children?: React.ReactNode
}

export default function CTAButton({ 
  variant = "primary", 
  size = "lg", 
  className = "",
  children = "Começar Minha Jornada ATIVA"
}: CTAButtonProps) {
  const whatsappMessage = encodeURIComponent(
    "Olá ATIVE, quero começar minha jornada fitness inteligente! 🏋️‍♀️"
  )
  
  // Replace with actual ATIVE WhatsApp number
  const whatsappNumber = "5511999999999"
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const variantStyles = {
    primary: "bg-gradient-to-r from-ative-primary to-ative-accent hover:from-ative-accent hover:to-ative-primary text-white shadow-xl hover:shadow-2xl",
    secondary: "bg-white text-ative-primary border-2 border-ative-primary hover:bg-ative-primary hover:text-white",
    outline: "border-2 border-white text-white hover:bg-white hover:text-ative-primary"
  }

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-6 sm:px-8 py-4 text-base sm:text-lg"
  }

  return (
    <Button
      asChild
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        font-bold
        rounded-2xl
        transition-all 
        duration-300 
        hover:scale-105
        transform
        ${className}
      `}
    >
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 sm:gap-3 text-center"
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        <span className="leading-tight">{children}</span>
      </a>
    </Button>
  )
}
