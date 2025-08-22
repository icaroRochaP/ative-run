import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { QuickActionsCardProps } from "@/types/dashboard"

export function QuickActionsCard({ userData, profile, displayName }: QuickActionsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-aleen-light to-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        {(userData || profile) ? (
          <div className="text-center">
            <h3 className="text-gray-800 font-bold text-lg mb-3">
              Bem-vindo à sua jornada, {displayName || "Usuário"}! 🎉
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Seu plano personalizado de saúde está sendo criado com base nas suas respostas do onboarding.
            </p>
            <Badge className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white font-semibold px-4 py-2 rounded-2xl">
              Plano pronto em 24 horas
            </Badge>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-gray-800 font-bold text-lg mb-3">Precisa de ajuda para alcançar seus objetivos?</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Converse com nossa IA e receba um plano personalizado só para você.
            </p>
            <Button className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105">
              <Sparkles className="mr-2 h-4 w-4" />
              Chat no WhatsApp
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
