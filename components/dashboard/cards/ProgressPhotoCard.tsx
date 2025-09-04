import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera } from "lucide-react"
import Image from "next/image"
import { ProgressPhotoCardProps } from "@/types/dashboard"

interface ProgressPhotoCardExtendedProps extends ProgressPhotoCardProps {
  onPhotoClick?: (index: number) => void
}

export function ProgressPhotoCard({ photos, onPhotoClick }: ProgressPhotoCardExtendedProps) {
  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center">
          <Camera className="mr-2 h-5 w-5 text-aleen-secondary" />
          Fotos de Progresso
        </CardTitle>
      </CardHeader>
      <CardContent>
        {photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div 
                key={index} 
                className="relative cursor-pointer group transition-transform hover:scale-105"
                onClick={() => onPhotoClick?.(index)}
              >
                <Image
                  src={photo.image || "/placeholder.svg"}
                  alt={`Progresso ${photo.date}`}
                  width={100}
                  height={133}
                  className="rounded-2xl object-cover w-full aspect-[3/4] border-2 border-aleen-light group-hover:border-aleen-primary transition-colors"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2 rounded-b-2xl">
                  <div className="font-medium">{photo.date}</div>
                  {photo.weight && <div className="text-aleen-light">{photo.weight} kg</div>}
                </div>
                {/* Overlay de hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-800 font-bold mb-2">Nenhuma foto de progresso ainda</p>
            <p className="text-aleen-secondary text-sm font-medium">
              Adicione sua primeira atualização de peso com uma foto para começar!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
