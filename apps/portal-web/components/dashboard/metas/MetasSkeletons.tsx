import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function WeightProgressSkeleton() {
  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Skeleton className="h-4 w-16 mx-auto mb-2" />
            <Skeleton className="h-8 w-12 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-4 w-16 mx-auto mb-2" />
            <Skeleton className="h-8 w-12 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-4 w-16 mx-auto mb-2" />
            <Skeleton className="h-8 w-12 mx-auto" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        {/* Goal Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function WeightHistorySkeleton() {
  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-5 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProgressPhotosSkeleton() {
  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function MetasTabSkeleton() {
  return (
    <div className="space-y-6">
      <WeightProgressSkeleton />
      <WeightHistorySkeleton />
      <ProgressPhotosSkeleton />
    </div>
  )
}
