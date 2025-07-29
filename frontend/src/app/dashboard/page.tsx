"use client"

import { Suspense } from "react"
import StockDashboard from "@/components/StockDashboard"
import StockCardSkeleton from "@/components/StockCardSkeleton"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Dashboard</h1>
          <p className="text-gray-600">Real-time stock market data and analytics</p>
        </div>

        <Suspense fallback={<StockDashboardSkeleton />}>
          <StockDashboard />
        </Suspense>
      </div>
    </main>
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