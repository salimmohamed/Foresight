import { TrendingUp, TrendingDown, Minus, Activity, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Stock } from "../types/stock"

interface StockCardProps {
  stock: Stock
}

export default function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.changePercent >= 0
  const isNeutral = stock.changePercent === 0

  const getStatusColor = (status: Stock["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "halted":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: Stock["status"]) => {
    switch (status) {
      case "active":
        return <Activity className="h-3 w-3" />
      case "inactive":
        return <Minus className="h-3 w-3" />
      case "halted":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border shadow-md">
      <CardHeader className="pb-3 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground">{stock.symbol}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{stock.companyName}</p>
          </div>
          <Badge variant="secondary" className={`${getStatusColor(stock.status)} flex items-center gap-1`}>
            {getStatusIcon(stock.status)}
            {stock.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-6">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">${stock.currentPrice.toFixed(2)}</span>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">24h Volume</div>
              <div className="text-sm font-medium text-foreground">{(stock.volume / 1000000).toFixed(1)}M</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-1 ${
                isNeutral ? "text-muted-foreground" : isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isNeutral ? (
                <Minus className="h-4 w-4" />
              ) : isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-semibold">
                {isPositive && !isNeutral ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>

            <div className="text-right">
              <div
                className={`text-sm font-medium ${
                  isNeutral ? "text-muted-foreground" : isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {isPositive && !isNeutral ? "+" : ""}${stock.priceChange.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div>
              <div className="text-xs text-muted-foreground mb-1">High</div>
              <div className="text-sm font-medium text-foreground">${stock.dayHigh.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Low</div>
              <div className="text-sm font-medium text-foreground">${stock.dayLow.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 