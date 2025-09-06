import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TrainingPlanSkeleton() {
  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-36 mb-2" />
        <div className="text-right">
          <Skeleton className="h-4 w-28 ml-auto" />
        </div>
      </CardContent>
    </Card>
  )
}

export function WorkoutCardSkeleton() {
  return (
    <Card className="bg-gradient-to-r from-aleen-light to-white border-0 rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function WorkoutHistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <WorkoutCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function WorkoutDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-100 rounded-xl p-3">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-6 w-8" />
        </div>
        <div className="bg-gray-100 rounded-xl p-3">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-gray-50 border-0 rounded-2xl">
            <CardContent className="p-4">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-2">
                  <Skeleton className="h-3 w-8 mb-1" />
                  <Skeleton className="h-5 w-4" />
                </div>
                <div className="bg-white rounded-xl p-2">
                  <Skeleton className="h-3 w-8 mb-1" />
                  <Skeleton className="h-5 w-6" />
                </div>
                <div className="bg-white rounded-xl p-2">
                  <Skeleton className="h-3 w-8 mb-1" />
                  <Skeleton className="h-5 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
