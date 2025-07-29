"use client"

import { NavigationHeader } from "@/components/NavigationHeader/NavigationHeader"
import AlertsPage from "@/components/AlertsPage/AlertsPage"
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute"

export default function AlertsPageWrapper() {
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
    <ProtectedRoute>
      <div>
        <NavigationHeader
          currentPath="/alerts"
          notificationCount={5}
          onThemeToggle={handleThemeToggle}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
        />
        <AlertsPage
          onThemeToggle={handleThemeToggle}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
        />
      </div>
    </ProtectedRoute>
  )
} 