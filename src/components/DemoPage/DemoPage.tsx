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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all dashboard data in parallel
        const [portfolio, alerts, leaders, recentActivities] = await Promise.all([
          fetchPortfolioData(),
          fetchAlertsData(),
          fetchMarketLeaders(),
          fetchRecentActivities()
        ])
        
        setPortfolioData(portfolio)
        setAlertsData(alerts)
        setMarketLeaders(leaders)
        setActivities(recentActivities)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])
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

          {error && (
            <div className={styles.error}>
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                  <CardHeader className={styles.statCardHeader}>
                    <CardTitle className={styles.statCardTitle}>Total Portfolio</CardTitle>
                    <DollarSign className={styles.statCardIcon} />
                  </CardHeader>
                  <CardContent>
                    <div className={styles.statValue}>
                      ${portfolioData?.totalValue.toLocaleString() || '0'}
                    </div>
                    <p className={styles.statChange}>
                      {portfolioData?.changePercent ? 
                        `${portfolioData.changePercent >= 0 ? '+' : ''}${portfolioData.changePercent.toFixed(1)}% from last month` : 
                        'No data available'
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
                    <div className={styles.statValue}>{alertsData?.activeAlerts || 0}</div>
                    <p className={styles.statChange}>{alertsData?.triggeredToday || 0} triggered today</p>
                  </CardContent>
                </Card>

                <Card className={styles.statCard}>
                  <CardHeader className={styles.statCardHeader}>
                    <CardTitle className={styles.statCardTitle}>Top Gainer</CardTitle>
                    <TrendingUp className={styles.gainIcon} />
                  </CardHeader>
                  <CardContent>
                    <div className={styles.statValue}>{marketLeaders?.topGainer.symbol || 'N/A'}</div>
                    <p className={styles.gainText}>{marketLeaders?.topGainer.change || 'No data'}</p>
                  </CardContent>
                </Card>

                <Card className={styles.statCard}>
                  <CardHeader className={styles.statCardHeader}>
                    <CardTitle className={styles.statCardTitle}>Top Loser</CardTitle>
                    <TrendingDown className={styles.lossIcon} />
                  </CardHeader>
                  <CardContent>
                    <div className={styles.statValue}>{marketLeaders?.topLoser.symbol || 'N/A'}</div>
                    <p className={styles.lossText}>{marketLeaders?.topLoser.change || 'No data'}</p>
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
                    {activities.map((activity) => (
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
            </>
          )}
        </div>
      </main>
    </div>
  )
} 