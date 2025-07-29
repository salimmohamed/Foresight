export interface Stock {
  symbol: string
  companyName: string
  currentPrice: number
  priceChange: number
  changePercent: number
  volume: number
  dayHigh: number
  dayLow: number
  status: "active" | "inactive" | "halted"
} 