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

export interface PortfolioData {
  totalValue: number
  totalChange: number
  changePercent: number
  holdings: Array<{
    symbol: string
    shares: number
    currentPrice: number
    positionValue: number
    positionChange: number
    changePercent: number
  }>
}

export interface AlertsData {
  activeAlerts: number
  triggeredToday: number
  recentAlerts: Array<{
    id: string
    type: 'success' | 'info' | 'warning'
    title: string
    time: string
    symbol: string
    price: number
  }>
}

export interface MarketLeaders {
  topGainer: {
    symbol: string
    change: string
    price: number
  }
  topLoser: {
    symbol: string
    change: string
    price: number
  }
}

export interface Activity {
  id: string
  type: 'success' | 'info' | 'warning'
  title: string
  time: string
  details: string
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/portfolio')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    throw new Error('Failed to fetch portfolio data.')
  }
}

export async function fetchAlertsData(): Promise<AlertsData> {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/alerts')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching alerts data:', error)
    throw new Error('Failed to fetch alerts data.')
  }
}

export async function fetchMarketLeaders(): Promise<MarketLeaders> {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/market-leaders')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching market leaders:', error)
    throw new Error('Failed to fetch market leaders data.')
  }
}

export async function fetchRecentActivities(): Promise<Activity[]> {
  try {
    const response = await fetch('http://localhost:5000/api/dashboard/activities')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    throw new Error('Failed to fetch recent activities.')
  }
} 