import type { Stock } from "../types/stock"

export async function fetchStockData(): Promise<Stock[]> {
  try {
    const response = await fetch('http://localhost:5000/api/stocks?symbols=AAPL,GOOGL,TSLA,MSFT,NVDA,AMZN,META,NFLX')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // The API now returns data in the correct format
    return data.map((stock: any) => ({
      symbol: stock.symbol,
      companyName: stock.companyName,
      currentPrice: stock.currentPrice,
      priceChange: stock.priceChange,
      changePercent: stock.changePercent,
      volume: stock.volume,
      dayHigh: stock.dayHigh,
      dayLow: stock.dayLow,
      status: stock.status
    }))
  } catch (error) {
    console.error('Error fetching stock data:', error)
    throw new Error('Failed to fetch stock data. Please check if the API server is running.')
  }
} 