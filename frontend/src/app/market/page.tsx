"use client"

import { Suspense } from "react"
import { NavigationHeader } from "@/components/NavigationHeader/NavigationHeader"
import StockDashboard from "@/components/StockDashboard"
import StockCardSkeleton from "@/components/StockCardSkeleton"

export default function MarketPage() {
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
        currentPath="/market"
        userName="Sarah Johnson"
        userEmail="sarah.johnson@example.com"
        notificationCount={5}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Market Overview</h1>
          <p className="text-muted-foreground">
            Real-time stock data and market insights powered by Finnhub
          </p>
        </div>
        
        <Suspense fallback={<StockDashboardSkeleton />}>
          <StockDashboard />
        </Suspense>
      </div>
    </div>
  )
}

function StockDashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <StockCardSkeleton key={i} />
      ))}
    </div>
  )
} 