"use client"

import { NavigationHeader } from "@/components/NavigationHeader/NavigationHeader"
import StockMonitoringForm from "@/components/stock-monitoring-form"

export default function AlertsPage() {
  const handleThemeToggle = () => {
    console.log("Theme toggled")
  }

  const handleLogout = () => {
    console.log("Logout clicked")
  }

  const handleProfileClick = () => {
    console.log("Profile clicked")
  }

  const handleSettingsClick = () => {
    console.log("Settings clicked")
  }

  return (
    <div>
      <NavigationHeader
        currentPath="/alerts"
        userName="Sarah Johnson"
        userEmail="sarah.johnson@example.com"
        notificationCount={5}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />
      <main>
        <StockMonitoringForm />
      </main>
    </div>
  )
} 