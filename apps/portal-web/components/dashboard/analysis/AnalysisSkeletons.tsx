import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AnalysisHeaderSkeleton() {
  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-8 w-12 rounded-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalysisTabsSkeleton() {
  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl w-fit">
            <Skeleton className="h-8 w-32 rounded-xl" />
            <Skeleton className="h-8 w-28 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>
        
        <div className="space-y-6">
          <AnalysisProfileSkeleton />
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalysisProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded-full bg-white/30" />
            <div>
              <Skeleton className="h-6 w-48 bg-white/30 mb-1" />
              <Skeleton className="h-4 w-32 bg-white/20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="text-center">
                <Skeleton className="h-4 w-16 mx-auto mb-2" />
                <Skeleton className="h-6 w-8 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AnalysisPerformanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-36 mb-4" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function AnalysisTrendsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Trends Overview */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="w-12 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trends Chart */}
      <Card className="bg-white border-0 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  )
}

export function AnalysisGoalsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Goals Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
