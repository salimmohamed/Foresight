"use client"

import { useEffect, useState } from "react"
import { NavigationHeader } from "@/components/NavigationHeader/NavigationHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { 
  fetchPortfolioData, 
  fetchAlertsData, 
  fetchMarketLeaders, 
  fetchRecentActivities,
  type PortfolioData,
  type AlertsData,
  type MarketLeaders,
  type Activity
} from "@/services/stockService"
import styles from './DemoPage.module.css'

interface DemoPageProps {
  userAvatar?: string
  notificationCount?: number
  onThemeToggle?: () => void
  onLogout?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

export default function DemoPage({
  userAvatar,
  notificationCount = 5,
  onThemeToggle,
  onLogout,
  onProfileClick,
  onSettingsClick,
}: DemoPageProps) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [alertsData, setAlertsData] = useState<AlertsData | null>(null)
  const [marketLeaders, setMarketLeaders] = useState<MarketLeaders | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setErrors({})
        
        // Fetch data individually to handle partial failures gracefully
        const fetchPromises = [
          fetchPortfolioData().then(setPortfolioData).catch(err => {
            console.error('Portfolio data error:', err)
            setErrors(prev => ({ ...prev, portfolio: err.message }))
          }),
          fetchAlertsData().then(setAlertsData).catch(err => {
            console.error('Alerts data error:', err)
            setErrors(prev => ({ ...prev, alerts: err.message }))
          }),
          fetchMarketLeaders().then(setMarketLeaders).catch(err => {
            console.error('Market leaders error:', err)
            setErrors(prev => ({ ...prev, marketLeaders: err.message }))
          }),
          fetchRecentActivities().then(setActivities).catch(err => {
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

  // Fallback data for when API calls fail
  const fallbackPortfolioData: PortfolioData = {
    totalValue: 125000,
    totalChange: 2500,
    changePercent: 2.0,
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

          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <CardHeader className={styles.statCardHeader}>
                <CardTitle className={styles.statCardTitle}>Total Portfolio</CardTitle>
                <DollarSign className={styles.statCardIcon} />
              </CardHeader>
              <CardContent>
                <div className={styles.statValue}>
                  ${displayPortfolio.totalValue.toLocaleString()}
                </div>
                <p className={styles.statChange}>
                  {displayPortfolio.changePercent >= 0 ? '+' : ''}{displayPortfolio.changePercent.toFixed(1)}% from last month
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
                <CardTitle className={styles.statCardTitle}>Top Gainer</CardTitle>
                <TrendingUp className={styles.gainIcon} />
              </CardHeader>
              <CardContent>
                <div className={styles.statValue}>{displayMarketLeaders.topGainer.symbol}</div>
                <p className={styles.gainText}>{displayMarketLeaders.topGainer.change}</p>
              </CardContent>
            </Card>

            <Card className={styles.statCard}>
              <CardHeader className={styles.statCardHeader}>
                <CardTitle className={styles.statCardTitle}>Top Loser</CardTitle>
                <TrendingDown className={styles.lossIcon} />
              </CardHeader>
              <CardContent>
                <div className={styles.statValue}>{displayMarketLeaders.topLoser.symbol}</div>
                <p className={styles.lossText}>{displayMarketLeaders.topLoser.change}</p>
              </CardContent>
            </Card>
          </div>

          <Card className={styles.activityCard}>
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
          </Card>
        </div>
      </main>
    </div>
  )
} 