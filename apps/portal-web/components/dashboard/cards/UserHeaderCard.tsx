import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { UserHeaderCardProps } from "@/types/dashboard"

interface ExtendedUserHeaderCardProps extends UserHeaderCardProps {
  onProfileClick?: () => void
}

export function UserHeaderCard({ user, displayName, initials, nameLoading, onProfileClick }: ExtendedUserHeaderCardProps) {
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Card className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div 
          className={`flex items-center space-x-4 ${onProfileClick ? 'cursor-pointer hover:opacity-90 transition-opacity duration-200' : ''}`}
          onClick={onProfileClick}
          role={onProfileClick ? "button" : undefined}
          tabIndex={onProfileClick ? 0 : undefined}
          onKeyDown={onProfileClick ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onProfileClick()
            }
          } : undefined}
          aria-label={onProfileClick ? "Abrir perfil do usuário" : undefined}
        >
          <Avatar className="h-16 w-16 border-3 border-aleen-light shadow-lg">
            <AvatarFallback className="bg-white text-aleen-primary font-bold text-lg" aria-label={`Avatar de ${user.name}`}>
              {nameLoading ? (
                <div className="animate-pulse bg-aleen-primary/30 rounded w-8 h-8"></div>
              ) : (
                initials || (user.name ? user.name.charAt(0).toUpperCase() : "U")
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {nameLoading ? (
                <div className="animate-pulse bg-white/30 rounded h-8 w-32"></div>
              ) : (
                user.name
              )}
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className="bg-aleen-light text-aleen-primary font-semibold">
                {getStatusText(user.subscriptionStatus)}
              </Badge>
              <span className="text-sm opacity-90">Renovação: {user.nextRenewal}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
