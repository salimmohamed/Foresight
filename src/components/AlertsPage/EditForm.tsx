"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import { Alert, UpdateAlertData } from "@/services/supabaseAlertService"

interface EditFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (alertId: string, alert: UpdateAlertData) => void
  alert: Alert | null
}

export function EditForm({ isOpen, onClose, onSubmit, alert }: EditFormProps) {
  const [formData, setFormData] = useState({
    threshold: "",
    percentage: "",
    status: "active" as "active" | "paused" | "triggered" | "expired",
    emailNotifications: true,
    inAppNotifications: true,
  })

  // Initialize form data when alert changes
  useEffect(() => {
    if (alert) {
      setFormData({
        threshold: alert.threshold?.toString() || "",
        percentage: alert.percentage?.toString() || "",
        status: alert.status,
        emailNotifications: alert.emailNotifications,
        inAppNotifications: alert.inAppNotifications,
      })
    }
  }, [alert])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!alert) return
    
    const updateData: UpdateAlertData = {
      status: formData.status,
      emailNotifications: formData.emailNotifications,
      inAppNotifications: formData.inAppNotifications,
    }
    
    // Add threshold or percentage based on alert type
    if (alert.alertType === "price-above" || alert.alertType === "price-below") {
      updateData.threshold = parseFloat(formData.threshold)
    } else if (alert.alertType === "percentage-gain" || alert.alertType === "percentage-loss" || alert.alertType === "percentage-change") {
      updateData.percentage = parseFloat(formData.percentage)
    }
    
    onSubmit(alert.id, updateData)
    onClose()
  }

  if (!isOpen || !alert) return null

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "price-above": return "Price Above Threshold"
      case "price-below": return "Price Below Threshold"
      case "percentage-gain": return "Percentage Gain"
      case "percentage-loss": return "Percentage Loss"
      case "percentage-change": return "Percentage Change (Up or Down)"
      case "volume-spike": return "Volume Spike"
      case "news-sentiment": return "News Sentiment Change"
      default: return type
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Edit Alert</CardTitle>
            <CardDescription>Modify alert settings for {alert.symbol} ({alert.companyName})</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read-only alert info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock Symbol</Label>
                <Input
                  value={alert.symbol}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={alert.companyName}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alert Type</Label>
              <Input
                value={getAlertTypeLabel(alert.alertType)}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-2 gap-4">
              {(alert.alertType === "price-above" || alert.alertType === "price-below") && (
                <div className="space-y-2">
                  <Label htmlFor="threshold">Price Threshold ($)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                    required
                  />
                </div>
              )}
              {(alert.alertType === "percentage-gain" || alert.alertType === "percentage-loss" || alert.alertType === "percentage-change") && (
                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage Change (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Alert Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "paused" | "triggered" | "expired") => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="triggered">Triggered</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Notification Preferences</Label>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch
                  id="email"
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inapp">In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts in the application</p>
                </div>
                <Switch
                  id="inapp"
                  checked={formData.inAppNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, inAppNotifications: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Update Alert</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 