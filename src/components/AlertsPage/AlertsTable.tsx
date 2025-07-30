"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bell,
  BellOff,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  Volume2,
  Newspaper,
} from "lucide-react"
import { Alert } from "@/services/alertService"

interface AlertsTableProps {
  alerts: Alert[]
  onToggleAlert: (id: string) => void
  onEditAlert: (id: string) => void
  onDeleteAlert: (id: string) => void
}

export function AlertsTable({ alerts, onToggleAlert, onEditAlert, onDeleteAlert }: AlertsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "price-above":
      case "price-below":
        return <TrendingUp className="h-4 w-4" />
      case "percentage-gain":
      case "percentage-loss":
        return <TrendingDown className="h-4 w-4" />
      case "volume-spike":
        return <Volume2 className="h-4 w-4" />
      case "news-sentiment":
        return <Newspaper className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "price-above":
        return "Price Above"
      case "price-below":
        return "Price Below"
      case "percentage-gain":
        return "% Gain"
      case "percentage-loss":
        return "% Loss"
      case "volume-spike":
        return "Volume Spike"
      case "news-sentiment":
        return "News Sentiment"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "paused":
        return <Badge variant="secondary">Paused</Badge>
      case "triggered":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Triggered</Badge>
      case "expired":
        return <Badge variant="outline">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    const matchesType = typeFilter === "all" || alert.alertType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
        <CardDescription>Manage your stock monitoring alerts and notification preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by symbol or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="triggered">Triggered</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="price-above">Price Above</SelectItem>
              <SelectItem value="price-below">Price Below</SelectItem>
              <SelectItem value="percentage-gain">Percentage Gain</SelectItem>
              <SelectItem value="percentage-loss">Percentage Loss</SelectItem>
              <SelectItem value="volume-spike">Volume Spike</SelectItem>
              <SelectItem value="news-sentiment">News Sentiment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead>Alert Type</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alert.symbol}</div>
                      <div className="text-sm text-muted-foreground">{alert.companyName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAlertTypeIcon(alert.alertType)}
                      <span className="text-sm">{getAlertTypeLabel(alert.alertType)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {alert.threshold && `$${alert.threshold}`}
                    {alert.percentage && `${alert.percentage}%`}
                  </TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alert.lastTriggered ? new Date(alert.lastTriggered).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {alert.emailNotifications && <Bell className="h-3 w-3 text-muted-foreground" />}
                      {alert.inAppNotifications && <BellOff className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onToggleAlert(alert.id)}>
                          {alert.status === "active" ? "Pause Alert" : "Activate Alert"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditAlert(alert.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Alert
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteAlert(alert.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Alert
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No alerts found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters to see more alerts."
                : "Create your first alert to start monitoring stocks."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 