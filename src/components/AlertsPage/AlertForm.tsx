"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { CreateAlertData } from "@/services/alertService"

interface AlertFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (alert: CreateAlertData) => void
}

export function AlertForm({ isOpen, onClose, onSubmit }: AlertFormProps) {
  const [formData, setFormData] = useState({
    symbol: "",
    company: "",
    alertType: "",
    threshold: "",
    percentage: "",
    emailNotifications: true,
    inAppNotifications: true,
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const alertData: CreateAlertData = {
      symbol: formData.symbol,
      companyName: formData.company || undefined,
      alertType: formData.alertType,
      emailNotifications: formData.emailNotifications,
      inAppNotifications: formData.inAppNotifications,
    }
    
    // Add threshold or percentage based on alert type
    if (formData.alertType === "price-above" || formData.alertType === "price-below") {
      alertData.threshold = parseFloat(formData.threshold)
    } else if (formData.alertType === "percentage-gain" || formData.alertType === "percentage-loss") {
      alertData.percentage = parseFloat(formData.percentage)
    }
    
    onSubmit(alertData)
    setFormData({
      symbol: "",
      company: "",
      alertType: "",
      threshold: "",
      percentage: "",
      emailNotifications: true,
      inAppNotifications: true,
      notes: "",
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>Set up a new stock monitoring alert with custom parameters</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Stock Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., AAPL"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="e.g., Apple Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertType">Alert Type</Label>
              <Select
                value={formData.alertType}
                onValueChange={(value) => setFormData({ ...formData, alertType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-above">Price Above Threshold</SelectItem>
                  <SelectItem value="price-below">Price Below Threshold</SelectItem>
                  <SelectItem value="percentage-gain">Percentage Gain</SelectItem>
                  <SelectItem value="percentage-loss">Percentage Loss</SelectItem>
                  <SelectItem value="volume-spike">Volume Spike</SelectItem>
                  <SelectItem value="news-sentiment">News Sentiment Change</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(formData.alertType === "price-above" || formData.alertType === "price-below") && (
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
              {(formData.alertType === "percentage-gain" || formData.alertType === "percentage-loss") && (
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

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this alert..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Alert</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 