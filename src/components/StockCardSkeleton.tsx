import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StockCardSkeleton() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-8 w-20" />
            <div className="text-right space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="space-y-1">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 