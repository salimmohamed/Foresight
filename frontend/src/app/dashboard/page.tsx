"use client"

import DemoPage from "@/components/DemoPage/DemoPage"

export default function DashboardPage() {
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
    <DemoPage
      userName="Sarah Johnson"
      userEmail="sarah.johnson@example.com"
      notificationCount={5}
      onThemeToggle={handleThemeToggle}
      onLogout={handleLogout}
      onProfileClick={handleProfileClick}
      onSettingsClick={handleSettingsClick}
    />
  )
} 