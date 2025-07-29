"use client"

import { useState } from "react"
import { AlertForm } from "./AlertForm"
import { AlertsTable } from "./AlertsTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellRing, Plus, TrendingUp, AlertTriangle } from "lucide-react"
import styles from "./AlertsPage.module.css"

// Sample data
const initialAlerts = [
  {
    id: "1",
    symbol: "AAPL",
    company: "Apple Inc.",
    alertType: "price-above",
    threshold: "180.00",
    status: "active" as const,
    createdAt: "2024-01-15T10:30:00Z",
    lastTriggered: "2024-01-20T14:22:00Z",
    emailNotifications: true,
    inAppNotifications: true,
  },
  {
    id: "2",
    symbol: "TSLA",
    company: "Tesla, Inc.",
    alertType: "percentage-loss",
    percentage: "5.0",
    status: "triggered" as const,
    createdAt: "2024-01-10T09:15:00Z",
    lastTriggered: "2024-01-22T11:45:00Z",
    emailNotifications: true,
    inAppNotifications: false,
  },
  {
    id: "3",
    symbol: "NVDA",
    company: "NVIDIA Corporation",
    alertType: "volume-spike",
    status: "active" as const,
    createdAt: "2024-01-18T16:20:00Z",
    emailNotifications: false,
    inAppNotifications: true,
  },
  {
    id: "4",
    symbol: "MSFT",
    company: "Microsoft Corporation",
    alertType: "price-below",
    threshold: "350.00",
    status: "paused" as const,
    createdAt: "2024-01-12T08:45:00Z",
    emailNotifications: true,
    inAppNotifications: true,
  },
]

export interface Alert {
  id: string
  symbol: string
  company: string
  alertType: string
  threshold?: string
  percentage?: string
  status: "active" | "paused" | "triggered" | "expired"
  createdAt: string
  lastTriggered?: string
  emailNotifications: boolean
  inAppNotifications: boolean
}

export interface AlertsPageProps {
  onThemeToggle?: () => void
  onLogout?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
}

export default function AlertsPage({ 
  onThemeToggle, 
  onLogout, 
  onProfileClick, 
  onSettingsClick 
}: AlertsPageProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreateAlert = (newAlert: Alert) => {
    setAlerts([...alerts, newAlert])
  }

  const handleToggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, status: alert.status === "active" ? "paused" : ("active" as const) } : alert,
      ),
    )
  }

  const handleEditAlert = (id: string) => {
    // In a real app, this would open the edit form with pre-filled data
    console.log("Edit alert:", id)
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active").length
  const triggeredThisWeek = alerts.filter(
    (alert) => alert.lastTriggered && new Date(alert.lastTriggered) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  return (
    <div className={styles["min-h-screen"]}>
      <main className={styles["container"]}>
        {/* Page Header */}
        <div className={styles["page-header"]}>
          <div>
            <h1 className={styles["page-title"]}>Stock Alerts</h1>
            <p className={styles["page-description"]}>Monitor your investments with intelligent alerts and notifications</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className={styles["create-button"]}>
            <Plus className={styles["button-icon"]} />
            Create Alert
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className={styles["stats-grid"]}>
          <Card>
            <CardHeader className={styles["stats-card-header"]}>
              <CardTitle className={styles["stats-card-title"]}>Total Alerts</CardTitle>
              <Bell className={styles["stats-card-icon"]} />
            </CardHeader>
            <CardContent>
              <div className={styles["stats-card-value"]}>{alerts.length}</div>
              <p className={styles["stats-card-description"]}>All configured alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={styles["stats-card-header"]}>
              <CardTitle className={styles["stats-card-title"]}>Active Alerts</CardTitle>
              <BellRing className={styles["stats-card-icon"]} />
            </CardHeader>
            <CardContent>
              <div className={styles["stats-card-value"]}>{activeAlerts}</div>
              <p className={styles["stats-card-description"]}>Currently monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={styles["stats-card-header"]}>
              <CardTitle className={styles["stats-card-title"]}>Triggered This Week</CardTitle>
              <AlertTriangle className={styles["stats-card-icon"]} />
            </CardHeader>
            <CardContent>
              <div className={styles["stats-card-value"]}>{triggeredThisWeek}</div>
              <p className={styles["stats-card-description"]}>Past 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={styles["stats-card-header"]}>
              <CardTitle className={styles["stats-card-title"]}>Success Rate</CardTitle>
              <TrendingUp className={styles["stats-card-icon"]} />
            </CardHeader>
            <CardContent>
              <div className={styles["stats-card-value"]}>94%</div>
              <p className={styles["stats-card-description"]}>Alert accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Table */}
        <AlertsTable
          alerts={alerts}
          onToggleAlert={handleToggleAlert}
          onEditAlert={handleEditAlert}
          onDeleteAlert={handleDeleteAlert}
        />

        {/* Recent Activity */}
        <Card className={styles["recent-activity-card"]}>
          <CardHeader>
            <CardTitle>Recent Alert Activity</CardTitle>
            <CardDescription>Latest triggered alerts and system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles["activity-list"]}>
              <div className={styles["activity-item"]}>
                <div className={styles["activity-indicator-green"]}></div>
                <div className={styles["activity-content"]}>
                  <p className={styles["activity-title"]}>TSLA price dropped below 5% threshold</p>
                  <p className={styles["activity-time"]}>2 hours ago • Email sent</p>
                </div>
              </div>
              <div className={styles["activity-item"]}>
                <div className={styles["activity-indicator-blue"]}></div>
                <div className={styles["activity-content"]}>
                  <p className={styles["activity-title"]}>AAPL reached price target of $180</p>
                  <p className={styles["activity-time"]}>1 day ago • In-app notification</p>
                </div>
              </div>
              <div className={styles["activity-item"]}>
                <div className={styles["activity-indicator-orange"]}></div>
                <div className={styles["activity-content"]}>
                  <p className={styles["activity-title"]}>NVDA volume spike detected</p>
                  <p className={styles["activity-time"]}>3 days ago • Email sent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Alert Form Modal */}
      <AlertForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleCreateAlert} />
    </div>
  )
} 