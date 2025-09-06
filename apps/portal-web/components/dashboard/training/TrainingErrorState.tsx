import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react"

interface TrainingErrorStateProps {
  error: string
  onRetry?: () => void
  type?: 'network' | 'server' | 'generic'
}

export function TrainingErrorState({ error, onRetry, type = 'generic' }: TrainingErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <Wifi className="h-10 w-10 text-red-500" />
      case 'server':
        return <AlertTriangle className="h-10 w-10 text-red-500" />
      default:
        return <AlertTriangle className="h-10 w-10 text-red-500" />
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'network':
        return 'Sem conexão'
      case 'server':
        return 'Erro no servidor'
      default:
        return 'Erro ao carregar dados'
    }
  }

  const getMessage = () => {
    switch (type) {
      case 'network':
        return 'Verifique sua conexão com a internet e tente novamente.'
      case 'server':
        return 'Ocorreu um problema em nossos servidores. Tente novamente em alguns momentos.'
      default:
        return error || 'Ocorreu um erro inesperado. Tente novamente.'
    }
  }

  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-gray-800">Treino</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          {getIcon()}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {getTitle()}
        </h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          {getMessage()}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-2xl font-medium transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
