import { Suspense } from "react"
import StockDashboard from "@/components/StockDashboard"
import StockCardSkeleton from "@/components/StockCardSkeleton"

export default function MarketPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Overview</h1>
        <p className="text-gray-600">
          Real-time stock data and market insights powered by Finnhub
        </p>
      </div>
      
      <Suspense fallback={<StockDashboardSkeleton />}>
        <StockDashboard />
      </Suspense>
    </div>
  )
}

function StockDashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <StockCardSkeleton key={i} />
      ))}
    </div>
  )
} 