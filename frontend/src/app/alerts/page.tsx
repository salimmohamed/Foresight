"use client"

import { NavigationHeader } from "@/components/NavigationHeader/NavigationHeader"
import AlertsPage from "@/components/AlertsPage/AlertsPage"

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
      <AlertsPage
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />
    </div>
  )
} 