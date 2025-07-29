"use client"

import { useState, useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import StockCard from "./StockCard"
import StockCardSkeleton from "./StockCardSkeleton"
import type { Stock } from "../types/stock"
import { fetchStockData } from "../services/stockService"

export default function StockDashboard() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadStockData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const data = await fetchStockData()
      setStocks(data)
    } catch (err) {
      setError("Failed to load stock data. Please try again.")
      console.error("Error fetching stock data:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadStockData()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadStockData(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    loadStockData(true)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <StockCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Alert className="max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => loadStockData()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  )
} 