"use client"

import { useEffect, useState } from "react"
import { NavigationHeader } from "@/components/NavigationHeader/NavigationHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, RefreshCw, Plus, Bell, X, Trash2, Save } from "lucide-react"
import { 
  fetchAlertsData, 
  fetchRecentActivities,
  type AlertsData,
  type MarketLeaders,
  type Activity
} from "@/services/stockService"
import { 
  type PortfolioHolding, 
  loadPortfolioHoldings, 
  savePortfolioHoldings,
  getPortfolioData,
  getPortfolioMarketLeaders
} from "@/services/portfolioService"

import styles from './DemoPage.module.css'
import { useRouter } from "next/navigation"

interface PortfolioData {
  totalValue: number
  totalChange: number
  changePercent: number
  totalInvested: number
  totalReturn: number
  averageAnnualizedReturn: number
  holdings: Array<{
    symbol: string
    shares: number
    currentPrice: number
    purchasePrice: number
    purchaseDate?: string
    positionValue: number
    positionChange: number
    changePercent: number
    daysHeld?: number
    totalReturn?: number
    annualizedReturn?: number
  }>
}

interface DemoPageProps {
  userAvatar?: string
  notificationCount?: number
  onThemeToggle?: () => void
  onLogout?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

// Utility function to format days into years and days
const formatHoldingDuration = (days: number): string => {
  if (days < 365) {
    return `${days} days`
  }
  
  const years = Math.floor(days / 365)
  const remainingDays = days % 365
  
  if (remainingDays === 0) {
    return `${years} year${years > 1 ? 's' : ''}`
  }
  
  return `${years} year${years > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
}

export default function DemoPage({
  userAvatar,
  notificationCount = 5,
  onThemeToggle,
  onLogout,
  onProfileClick,
  onSettingsClick,
}: DemoPageProps) {
  const router = useRouter()
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [alertsData, setAlertsData] = useState<AlertsData | null>(null)
  const [marketLeaders, setMarketLeaders] = useState<MarketLeaders | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false)
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>([])
  const [newHolding, setNewHolding] = useState({
    symbol: "",
    shares: "",
    purchasePrice: "",
    purchaseDate: new Date().toISOString().split('T')[0] // Default to today
  })
  const [savingPortfolio, setSavingPortfolio] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setErrors({})
        
        // Fetch data individually to handle partial failures gracefully
        const fetchPromises = [
          getPortfolioData().then(setPortfolioData).catch((err: any) => {
            console.error('Portfolio data error:', err)
            setErrors(prev => ({ ...prev, portfolio: err.message }))
          }),
          fetchAlertsData().then(setAlertsData).catch((err: any) => {
            console.error('Alerts data error:', err)
            setErrors(prev => ({ ...prev, alerts: err.message }))
          }),
          getPortfolioMarketLeaders().then(setMarketLeaders).catch((err: any) => {
            console.error('Market leaders error:', err)
            setErrors(prev => ({ ...prev, marketLeaders: err.message }))
          }),
          fetchRecentActivities().then(setActivities).catch((err: any) => {
            console.error('Activities error:', err)
            setErrors(prev => ({ ...prev, activities: err.message }))
          })
        ]
        
        await Promise.allSettled(fetchPromises)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setErrors({})
      
      // Fetch data individually to handle partial failures gracefully
      const fetchPromises = [
        getPortfolioData().then(setPortfolioData).catch((err: any) => {
          console.error('Portfolio data error:', err)
          setErrors(prev => ({ ...prev, portfolio: err.message }))
        }),
        fetchAlertsData().then(setAlertsData).catch(err => {
          console.error('Alerts data error:', err)
          setErrors(prev => ({ ...prev, alerts: err.message }))
        }),
        getPortfolioMarketLeaders().then(setMarketLeaders).catch((err: any) => {
          console.error('Market leaders error:', err)
          setErrors(prev => ({ ...prev, marketLeaders: err.message }))
        }),
        fetchRecentActivities().then(setActivities).catch(err => {
          console.error('Activities error:', err)
          setErrors(prev => ({ ...prev, activities: err.message }))
        })
      ]
      
      await Promise.allSettled(fetchPromises)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        fetchDashboardData(true)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loading, refreshing])

  const handleRefresh = () => {
    fetchDashboardData(true)
  }

  const loadUserPortfolioHoldings = async () => {
    try {
      const holdings = await loadPortfolioHoldings()
      setPortfolioHoldings(holdings)
    } catch (error) {
      console.error('Error loading portfolio holdings:', error)
      setPortfolioHoldings([])
    }
  }

  const savePortfolio = async () => {
    if (portfolioHoldings.length === 0) {
      alert('Please add at least one holding to your portfolio')
      return
    }

    try {
      setSavingPortfolio(true)
      const success = await savePortfolioHoldings(portfolioHoldings)
      
      if (success) {
        alert('Portfolio saved successfully!')
        setIsPortfolioModalOpen(false)
        // Refresh dashboard data to show updated portfolio
        fetchDashboardData(true)
      } else {
        alert('Failed to save portfolio. Please try again.')
      }
    } catch (error) {
      console.error('Error saving portfolio:', error)
      alert('Failed to save portfolio. Please check your connection and try again.')
    } finally {
      setSavingPortfolio(false)
    }
  }

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.shares || !newHolding.purchasePrice || !newHolding.purchaseDate) {
      alert('Please fill in all fields')
      return
    }

    const symbol = newHolding.symbol.toUpperCase().trim()
    const shares = parseInt(newHolding.shares)
    const purchase_price = parseFloat(newHolding.purchasePrice)
    const purchase_date = newHolding.purchaseDate

    // Validation
    if (shares <= 0) {
      alert('Shares must be greater than 0')
      return
    }
    if (purchase_price <= 0) {
      alert('Purchase price must be greater than 0')
      return
    }
    if (symbol.length === 0) {
      alert('Please enter a valid stock symbol')
      return
    }

    // Check if symbol already exists
    const existingHolding = portfolioHoldings.find(h => h.symbol === symbol)
    if (existingHolding) {
      alert(`You already have ${symbol} in your portfolio. Please edit the existing holding instead.`)
      return
    }

    const holding: PortfolioHolding = {
      symbol,
      shares,
      purchase_price,
      purchase_date
    }
    
    setPortfolioHoldings(prev => [...prev, holding])
    setNewHolding({ symbol: "", shares: "", purchasePrice: "", purchaseDate: new Date().toISOString().split('T')[0] })
  }

  const removeHolding = (index: number) => {
    const holding = portfolioHoldings[index]
    if (confirm(`Are you sure you want to remove ${holding.symbol} from your portfolio?`)) {
      setPortfolioHoldings(prev => prev.filter((_, i) => i !== index))
    }
  }

  const openPortfolioModal = () => {
    loadUserPortfolioHoldings()
    setIsPortfolioModalOpen(true)
  }

  // Fallback data for when API calls fail
  const fallbackPortfolioData: PortfolioData = {
    totalValue: 125000,
    totalChange: 2500,
    changePercent: 2.0,
    totalInvested: 122500,
    totalReturn: 2.04,
    averageAnnualizedReturn: 15.2,
    holdings: []
  }

  const fallbackAlertsData: AlertsData = {
    activeAlerts: 3,
    triggeredToday: 1,
    recentAlerts: []
  }

  const fallbackMarketLeaders: MarketLeaders = {
    topGainer: { symbol: "AAPL", change: "+2.5% today", price: 185.50 },
    topLoser: { symbol: "TSLA", change: "-1.8% today", price: 245.20 }
  }

  const fallbackActivities: Activity[] = [
    {
      id: "1",
      type: "success",
      title: "AAPL price alert triggered",
      time: "2 minutes ago",
      details: "Stock price reached $185.50"
    },
    {
      id: "2",
      type: "info", 
      title: "News alert: Tesla earnings report",
      time: "15 minutes ago",
      details: "Q4 earnings beat expectations"
    },
    {
      id: "3",
      type: "warning",
      title: "Portfolio rebalancing suggestion", 
      time: "1 hour ago",
      details: "Consider reducing NVDA position"
    }
  ]

  // Use real data if available, otherwise use fallbacks
  const displayPortfolio = portfolioData || fallbackPortfolioData
  const displayAlerts = alertsData || fallbackAlertsData
  const displayMarketLeaders = marketLeaders || fallbackMarketLeaders
  const displayActivities = activities.length > 0 ? activities : fallbackActivities

  return (
    <div className={styles.container}>
      <NavigationHeader
        currentPath="/dashboard"
        userAvatar={userAvatar}
        notificationCount={notificationCount}
        onThemeToggle={onThemeToggle}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
      />

      {/* Dashboard content */}
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Welcome back! Here&apos;s your portfolio overview.</p>
          </div>

          {loading && (
            <div className={styles.loading}>
              <p>Loading dashboard data...</p>
            </div>
          )}

          {/* Show any API errors as warnings */}
          {Object.keys(errors).length > 0 && (
            <div className={styles.error}>
              <p>Some data may be unavailable. Using fallback data where needed.</p>
              {Object.entries(errors).map(([key, error]) => (
                <p key={key} className="text-sm text-orange-600">• {key}: {error}</p>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your alerts and portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  onClick={() => router.push('/alerts')}
                  className="flex items-center gap-2"
                >
                  <Bell className="h-4 w-4" />
                  View All Alerts
                </Button>
                <Button 
                  onClick={() => router.push('/alerts?create=true')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Alert
                </Button>
                <Button 
                  onClick={openPortfolioModal}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Manage Portfolio
                </Button>
                <Button 
                  onClick={() => router.push('/market')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Market Overview
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <CardHeader className={styles.statCardHeader}>
                <CardTitle className={styles.statCardTitle}>Total Portfolio</CardTitle>
                <DollarSign className={styles.statCardIcon} />
              </CardHeader>
              <CardContent>
                <div className={styles.statValue}>
                  {displayPortfolio.totalValue > 0 ? `$${displayPortfolio.totalValue.toLocaleString()}` : "$0"}
                </div>
                <p className={styles.statChange}>
                  {displayPortfolio.totalValue > 0 
                    ? `${displayPortfolio.changePercent >= 0 ? '+' : ''}${displayPortfolio.changePercent.toFixed(1)}% from last month`
                    : "Add stocks to your portfolio"
                  }
                </p>
              </CardContent>
            </Card>

            <Card className={styles.statCard}>
              <CardHeader className={styles.statCardHeader}>
                <CardTitle className={styles.statCardTitle}>Active Alerts</CardTitle>
                <BarChart3 className={styles.statCardIcon} />
              </CardHeader>
              <CardContent>
                <div className={styles.statValue}>{displayAlerts.activeAlerts}</div>
                <p className={styles.statChange}>{displayAlerts.triggeredToday} triggered today</p>
              </CardContent>
            </Card>

            <Card className={styles.statCard}>
              <CardHeader className={styles.statCardHeader}>
                <CardTitle className={styles.statCardTitle}>
                  {displayPortfolio.holdings && displayPortfolio.holdings.length > 0 ? 'Portfolio Gainer' : 'Top Gainer'}
                </CardTitle>
                <TrendingUp className={styles.gainIcon} />
              </CardHeader>
              <CardContent>
                <div className={styles.statValue}>
                  {displayMarketLeaders.topGainer.symbol || "No holdings"}
                </div>
                <p className={styles.gainText}>
                  {displayMarketLeaders.topGainer.change || "Add stocks to see performance"}
                </p>
              </CardContent>
            </Card>

            <Card className={styles.statCard}>
              <CardHeader className={styles.statCardHeader}>
                <CardTitle className={styles.statCardTitle}>
                  {displayPortfolio.holdings && displayPortfolio.holdings.length > 0 ? 'Portfolio Loser' : 'Top Loser'}
                </CardTitle>
                <TrendingDown className={styles.lossIcon} />
              </CardHeader>
              <CardContent>
                <div className={styles.statValue}>
                  {displayMarketLeaders.topLoser.symbol || "No holdings"}
                </div>
                <p className={styles.lossText}>
                  {displayMarketLeaders.topLoser.change || "Add stocks to see performance"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Holdings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Your current stock positions</CardDescription>
            </CardHeader>
            <CardContent>
              {displayPortfolio.holdings && displayPortfolio.holdings.length > 0 ? (
                <div className="space-y-3">
                  {displayPortfolio.holdings.map((holding, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-lg">{holding.symbol}</span>
                          <span className={`font-semibold ${holding.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.changePercent >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {holding.shares} shares @ ${holding.currentPrice}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Position: ${holding.positionValue.toLocaleString()} 
                          <span className={`ml-2 ${holding.positionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({holding.positionChange >= 0 ? '+' : ''}${holding.positionChange.toFixed(2)})
                          </span>
                        </div>
                        {holding.daysHeld && (
                          <div className="text-xs text-muted-foreground mt-1">
                            <span>Purchased: ${holding.purchasePrice} • </span>
                            <span>Held: {formatHoldingDuration(holding.daysHeld)} • </span>
                            <span>Total Return: {holding.totalReturn ? `${holding.totalReturn >= 0 ? '+' : ''}${holding.totalReturn.toFixed(1)}%` : 'N/A'} • </span>
                            <span>Annualized: {holding.annualizedReturn ? `${holding.annualizedReturn >= 0 ? '+' : ''}${holding.annualizedReturn.toFixed(1)}%` : 'N/A'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Holdings Yet</h3>
                  <p className="text-muted-foreground mb-4">Start building your portfolio by adding your first stock</p>
                  <Button onClick={openPortfolioModal} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Stock
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={styles.activityCard} style={{ position: 'relative' }}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest stock monitoring activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.activityList}>
                {displayActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityDot} ${styles[`activityDot${activity.type}`]}`}></div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityTitle}>{activity.title}</p>
                      <p className={styles.activityTime}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            {/* Coming Soon Overlay */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                borderRadius: 'inherit',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h3>
                <p className="text-gray-600 text-sm">Real-time activity tracking</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Portfolio Management Modal */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Portfolio</CardTitle>
                <CardDescription>Add, edit, or remove your stock holdings</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsPortfolioModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Portfolio Summary */}
                {portfolioHoldings.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Portfolio Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Holdings:</span>
                        <span className="ml-2 font-semibold">{portfolioHoldings.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Shares:</span>
                        <span className="ml-2 font-semibold">
                          {portfolioHoldings.reduce((sum, h) => sum + h.shares, 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Invested:</span>
                        <span className="ml-2 font-semibold">
                          ${portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.purchase_price), 0).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Price:</span>
                        <span className="ml-2 font-semibold">
                          ${(portfolioHoldings.reduce((sum, h) => sum + (h.shares * h.purchase_price), 0) / 
                             portfolioHoldings.reduce((sum, h) => sum + h.shares, 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Holdings */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Holdings</h3>
                  {portfolioHoldings.length === 0 ? (
                    <p className="text-muted-foreground">No holdings yet. Add your first stock below.</p>
                  ) : (
                    <div className="space-y-2">
                      {portfolioHoldings.map((holding, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <span className="font-semibold">{holding.symbol}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {holding.shares} shares @ ${holding.purchase_price}
                            </span>
                            <div className="text-xs text-muted-foreground mt-1">
                              Total: ${(holding.shares * holding.purchase_price).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeHolding(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Holding */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Add New Holding</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="symbol">Symbol *</Label>
                      <Input
                        id="symbol"
                        placeholder="AAPL"
                        value={newHolding.symbol}
                        onChange={(e) => setNewHolding(prev => ({ ...prev, symbol: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addHolding()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shares">Shares *</Label>
                      <Input
                        id="shares"
                        type="number"
                        min="1"
                        placeholder="100"
                        value={newHolding.shares}
                        onChange={(e) => setNewHolding(prev => ({ ...prev, shares: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addHolding()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchasePrice">Purchase Price *</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="150.00"
                        value={newHolding.purchasePrice}
                        onChange={(e) => setNewHolding(prev => ({ ...prev, purchasePrice: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addHolding()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchaseDate">Purchase Date *</Label>
                      <Input
                        id="purchaseDate"
                        type="date"
                        value={newHolding.purchaseDate}
                        onChange={(e) => setNewHolding(prev => ({ ...prev, purchaseDate: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addHolding()
                          }
                        }}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={addHolding} 
                    className="mt-3"
                    disabled={!newHolding.symbol || !newHolding.shares || !newHolding.purchasePrice || !newHolding.purchaseDate}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holding
                  </Button>
                </div>

                {/* Save Button */}
                <Button onClick={savePortfolio} disabled={savingPortfolio} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {savingPortfolio ? 'Saving...' : 'Save Portfolio'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 