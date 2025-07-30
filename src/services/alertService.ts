import { API_ENDPOINTS } from "../config/api"

export interface Alert {
  id: string
  symbol: string
  companyName: string
  alertType: string
  threshold?: number
  percentage?: number
  status: "active" | "paused" | "triggered" | "expired"
  createdAt: string
  lastTriggered?: string
  emailNotifications: boolean
  inAppNotifications: boolean
  triggeredPrice?: number
  triggeredChange?: number
}

export interface CreateAlertData {
  symbol: string
  companyName?: string
  alertType: string
  threshold?: number
  percentage?: number
  emailNotifications?: boolean
  inAppNotifications?: boolean
}

export interface UpdateAlertData {
  threshold?: number
  percentage?: number
  status?: "active" | "paused" | "triggered" | "expired"
  emailNotifications?: boolean
  inAppNotifications?: boolean
}

// Get all alerts
export async function fetchAlerts(): Promise<Alert[]> {
  try {
    const response = await fetch(API_ENDPOINTS.alertManagement)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching alerts:', error)
    throw new Error('Failed to fetch alerts.')
  }
}

// Create a new alert
export async function createAlert(alertData: CreateAlertData): Promise<Alert> {
  try {
    const response = await fetch(API_ENDPOINTS.alertManagement, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating alert:', error)
    throw new Error('Failed to create alert.')
  }
}

// Update an alert
export async function updateAlert(alertId: string, updateData: UpdateAlertData): Promise<Alert> {
  try {
    const response = await fetch(API_ENDPOINTS.alert(alertId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating alert:', error)
    throw new Error('Failed to update alert.')
  }
}

// Delete an alert
export async function deleteAlert(alertId: string): Promise<void> {
  try {
    const response = await fetch(API_ENDPOINTS.alert(alertId), {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting alert:', error)
    throw new Error('Failed to delete alert.')
  }
}

// Process all active alerts
export async function processAlerts(): Promise<{ message: string; results: any[] }> {
  try {
    const response = await fetch(API_ENDPOINTS.processAlerts, {
      method: 'POST',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error processing alerts:', error)
    throw new Error('Failed to process alerts.')
  }
} 