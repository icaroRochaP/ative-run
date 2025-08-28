"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Circle, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConsumptionButtonProps {
  isConsumed: boolean
  isLoading: boolean
  onToggle: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'icon' | 'badge'
  disabled?: boolean
  className?: string
}

export function ConsumptionButton({
  isConsumed,
  isLoading,
  onToggle,
  size = 'md',
  variant = 'button',
  disabled = false,
  className
}: ConsumptionButtonProps) {

  // Configurações de tamanho
  const sizeConfig = {
    sm: {
      button: "h-8 px-3 text-xs",
      icon: "h-6 w-6",
      badge: "h-6 w-6 text-xs"
    },
    md: {
      button: "h-10 px-4 text-sm",
      icon: "h-8 w-8", 
      badge: "h-8 w-8 text-sm"
    },
    lg: {
      button: "h-12 px-6 text-base",
      icon: "h-10 w-10",
      badge: "h-10 w-10 text-base"
    }
  }

  // Estados visuais
  const getButtonStyles = () => {
    if (isLoading) {
      return "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
    }
    
    if (isConsumed) {
      return "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 shadow-lg"
    }
    
    return "bg-transparent text-gray-500 border-gray-300 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
  }

  const getBadgeStyles = () => {
    if (isLoading) {
      return "bg-gray-100 text-gray-400"
    }
    
    if (isConsumed) {
      return "bg-emerald-500 text-white shadow-lg"
    }
    
    return "bg-transparent text-gray-500 border border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
  }

  // Renderizar ícone baseado no estado
  const renderIcon = () => {
    if (isLoading) {
      return <Loader2 className="animate-spin" />
    }
    
    if (isConsumed) {
      return <CheckCircle className="fill-current" />
    }
    
    return <Circle />
  }

  // Texto do botão
  const getButtonText = () => {
    if (isLoading) {
      return "Processando..."
    }
    
    if (isConsumed) {
      return "Consumido"
    }
    
    return "Marcar como Consumido"
  }

  // Variante Badge (pequeno ícone no canto)
  if (variant === 'badge') {
    return (
      <Badge
        onClick={disabled ? undefined : onToggle}
        className={cn(
          "absolute top-3 right-3 border-2 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer",
          getBadgeStyles(),
          sizeConfig[size].badge,
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        variant="outline"
      >
        <div className="flex items-center justify-center w-full h-full">
          {renderIcon()}
        </div>
      </Badge>
    )
  }

  // Variante Icon (apenas ícone clicável)
  if (variant === 'icon') {
    return (
      <Button
        onClick={disabled ? undefined : onToggle}
        disabled={disabled || isLoading}
        variant="ghost"
        size="icon"
        className={cn(
          "transition-all duration-200 rounded-full border-2",
          getButtonStyles(),
          sizeConfig[size].icon,
          className
        )}
      >
        {renderIcon()}
      </Button>
    )
  }

  // Variante Button (botão completo com texto)
  return (
    <Button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled || isLoading}
      variant="outline"
      className={cn(
        "transition-all duration-200 rounded-xl border-2 font-medium",
        "active:scale-95 transform",
        getButtonStyles(),
        sizeConfig[size].button,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          {renderIcon()}
        </div>
        <span>{getButtonText()}</span>
      </div>
    </Button>
  )
}
