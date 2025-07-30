"use client"

import { useState, useEffect } from "react"
import { AlertForm } from "./AlertForm"
import { AlertsTable } from "./AlertsTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellRing, Plus, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react"
import styles from "./AlertsPage.module.css"
import { fetchAlerts, createAlert, updateAlert, deleteAlert, processAlerts, type Alert } from "@/services/alertService"

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
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingAlerts, setProcessingAlerts] = useState(false)

  // Load alerts on component mount
  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedAlerts = await fetchAlerts()
      setAlerts(fetchedAlerts)
    } catch (err) {
      console.error('Error loading alerts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlert = async (newAlert: any) => {
    try {
      const createdAlert = await createAlert(newAlert)
      setAlerts([...alerts, createdAlert])
      setIsFormOpen(false)
    } catch (err) {
      console.error('Error creating alert:', err)
      setError(err instanceof Error ? err.message : 'Failed to create alert')
    }
  }

  const handleToggleAlert = async (id: string) => {
    try {
      const alert = alerts.find(a => a.id === id)
      if (!alert) return

      const newStatus = alert.status === "active" ? "paused" : "active"
      const updatedAlert = await updateAlert(id, { status: newStatus })
      
      setAlerts(alerts.map(a => a.id === id ? updatedAlert : a))
    } catch (err) {
      console.error('Error toggling alert:', err)
      setError(err instanceof Error ? err.message : 'Failed to toggle alert')
    }
  }

  const handleEditAlert = (id: string) => {
    // In a real app, this would open the edit form with pre-filled data
    console.log("Edit alert:", id)
  }

  const handleDeleteAlert = async (id: string) => {
    try {
      await deleteAlert(id)
      setAlerts(alerts.filter(alert => alert.id !== id))
    } catch (err) {
      console.error('Error deleting alert:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete alert')
    }
  }

  const handleProcessAlerts = async () => {
    try {
      setProcessingAlerts(true)
      await processAlerts()
      // Reload alerts to get updated status
      await loadAlerts()
    } catch (err) {
      console.error('Error processing alerts:', err)
      setError(err instanceof Error ? err.message : 'Failed to process alerts')
    } finally {
      setProcessingAlerts(false)
    }
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active").length
  const triggeredThisWeek = alerts.filter(
    (alert) => alert.lastTriggered && new Date(alert.lastTriggered) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  ).length

  if (loading) {
    return (
      <div className={styles["min-h-screen"]}>
        <main className={styles["container"]}>
          <div className={styles["page-header"]}>
            <div>
              <h1 className={styles["page-title"]}>Stock Alerts</h1>
              <p className={styles["page-description"]}>Loading alerts...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles["min-h-screen"]}>
      <main className={styles["container"]}>
        {/* Page Header */}
        <div className={styles["page-header"]}>
          <div>
            <h1 className={styles["page-title"]}>Stock Alerts</h1>
            <p className={styles["page-description"]}>Monitor your investments with intelligent alerts and notifications</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleProcessAlerts} 
              disabled={processingAlerts}
              variant="outline"
              className={styles["create-button"]}
            >
              <RefreshCw className={`${styles["button-icon"]} ${processingAlerts ? 'animate-spin' : ''}`} />
              {processingAlerts ? 'Processing...' : 'Process Alerts'}
            </Button>
            <Button onClick={() => setIsFormOpen(true)} className={styles["create-button"]}>
              <Plus className={styles["button-icon"]} />
              Create Alert
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

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