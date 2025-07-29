"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Bell } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Foresight</h1>
          <p className="text-xl text-gray-600">Intelligent Stock Monitoring & Alert System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Stock Monitoring</CardTitle>
              <CardDescription>
                Set up real-time monitoring for your favorite stocks with custom price alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/alerts">
                <Button className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Configure Alerts
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Bell className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Smart Alerts</CardTitle>
              <CardDescription>
                Get notified about significant price movements and relevant news articles
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/alerts">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                1
              </div>
              <h3 className="font-medium mb-2">Configure Monitoring</h3>
              <p className="text-sm text-gray-600">Set up stock symbols and price thresholds</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                2
              </div>
              <h3 className="font-medium mb-2">Real-time Tracking</h3>
              <p className="text-sm text-gray-600">Monitor price changes and news articles</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                3
              </div>
              <h3 className="font-medium mb-2">Smart Notifications</h3>
              <p className="text-sm text-gray-600">Get alerts when conditions are met</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}