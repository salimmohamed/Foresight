"use client"

import HomePage from '@/components/HomePage/HomePage'
import { NavigationHeader } from "@/components/NavigationHeader/NavigationHeader"

export default function Page() {
  const handleGetStartedClick = () => {
    // Navigate to market page
    window.location.href = '/market'
  }

  const handleExploreDashboardClick = () => {
    window.location.href = '/dashboard'
  }

  const handleViewRepositoryClick = () => {
    window.open('https://github.com/salimmohamed/foresight', '_blank')
  }

  const handleTryDashboardClick = () => {
    window.location.href = '/dashboard'
  }

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
        currentPath="/"
        userName="Sarah Johnson"
        userEmail="sarah.johnson@example.com"
        notificationCount={5}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />
      <HomePage 
        onGetStartedClick={handleGetStartedClick}
        onExploreDashboardClick={handleExploreDashboardClick}
        onViewRepositoryClick={handleViewRepositoryClick}
        onTryDashboardClick={handleTryDashboardClick}
      />
    </div>
  )
}