import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  description?: string
}

export interface CreateAlertData {
  symbol: string
  companyName?: string
  alertType: string
  threshold?: number
  percentage?: number
  emailNotifications?: boolean
  inAppNotifications?: boolean
  description?: string
}

export interface UpdateAlertData {
  threshold?: number
  percentage?: number
  status?: "active" | "paused" | "triggered" | "expired"
  emailNotifications?: boolean
  inAppNotifications?: boolean
  description?: string
}

// Get current user ID
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Auth error:', error)
    throw new Error('Authentication error')
  }
  
  if (!user) {
    console.error('No user found')
    throw new Error('User not authenticated')
  }
  
  console.log('Current user ID:', user.id)
  return user.id
}

// Convert Supabase alert format to frontend format
const convertSupabaseAlertToFrontend = (supabaseAlert: any): Alert => {
  return {
    id: supabaseAlert.id,
    symbol: supabaseAlert.symbol,
    companyName: supabaseAlert.company_name || '',
    alertType: supabaseAlert.alert_type,
    threshold: supabaseAlert.threshold,
    percentage: supabaseAlert.percentage,
    status: supabaseAlert.status as "active" | "paused" | "triggered" | "expired",
    createdAt: supabaseAlert.created_at,
    lastTriggered: supabaseAlert.last_triggered,
    emailNotifications: supabaseAlert.email_notifications,
    inAppNotifications: supabaseAlert.in_app_notifications,
    triggeredPrice: supabaseAlert.triggered_price,
    triggeredChange: supabaseAlert.triggered_change,
    description: supabaseAlert.description
  }
}

// Convert frontend alert format to Supabase format
const convertFrontendAlertToSupabase = (frontendAlert: CreateAlertData) => {
  console.log('Converting frontend alert to Supabase format:', frontendAlert)
  
  const supabaseData = {
    symbol: frontendAlert.symbol.toUpperCase(),
    company_name: frontendAlert.companyName || '',
    alert_type: frontendAlert.alertType,
    threshold: frontendAlert.threshold,
    percentage: frontendAlert.percentage,
    status: 'active' as const,
    email_notifications: frontendAlert.emailNotifications ?? true,
    in_app_notifications: frontendAlert.inAppNotifications ?? true,
    description: frontendAlert.description
  }
  
  console.log('Converted to Supabase format:', supabaseData)
  return supabaseData
}

// Get all alerts for the current user
export async function fetchAlerts(): Promise<Alert[]> {
  try {
    const userId = await getCurrentUserId()
    
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching alerts:', error)
      throw error
    }

    return (data || []).map(convertSupabaseAlertToFrontend)
  } catch (error) {
    console.error('Error in fetchAlerts:', error)
    throw new Error('Failed to fetch alerts.')
  }
}

// Create a new alert
export async function createAlert(alertData: CreateAlertData): Promise<Alert> {
  try {
    const userId = await getCurrentUserId()
    const supabaseAlertData = convertFrontendAlertToSupabase(alertData)
    
    console.log('Creating alert with data:', { ...supabaseAlertData, user_id: userId })
    
    const { data, error } = await supabase
      .from('alerts')
      .insert([{ ...supabaseAlertData, user_id: userId }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating alert:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    return convertSupabaseAlertToFrontend(data)
  } catch (error) {
    console.error('Error in createAlert:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create alert.')
  }
}

// Update an alert
export async function updateAlert(alertId: string, updateData: UpdateAlertData): Promise<Alert> {
  try {
    const userId = await getCurrentUserId()
    
    // Convert frontend format to Supabase format
    const supabaseUpdateData: any = {}
    if (updateData.threshold !== undefined) supabaseUpdateData.threshold = updateData.threshold
    if (updateData.percentage !== undefined) supabaseUpdateData.percentage = updateData.percentage
    if (updateData.status !== undefined) supabaseUpdateData.status = updateData.status
    if (updateData.emailNotifications !== undefined) supabaseUpdateData.email_notifications = updateData.emailNotifications
    if (updateData.inAppNotifications !== undefined) supabaseUpdateData.in_app_notifications = updateData.inAppNotifications
    if (updateData.description !== undefined) supabaseUpdateData.description = updateData.description

    const { data, error } = await supabase
      .from('alerts')
      .update(supabaseUpdateData)
      .eq('id', alertId)
      .eq('user_id', userId) // Ensure user can only update their own alerts
      .select()
      .single()

    if (error) {
      console.error('Error updating alert:', error)
      throw error
    }

    return convertSupabaseAlertToFrontend(data)
  } catch (error) {
    console.error('Error in updateAlert:', error)
    throw new Error('Failed to update alert.')
  }
}

// Delete an alert
export async function deleteAlert(alertId: string): Promise<void> {
  try {
    const userId = await getCurrentUserId()
    
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)
      .eq('user_id', userId) // Ensure user can only delete their own alerts

    if (error) {
      console.error('Error deleting alert:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in deleteAlert:', error)
    throw new Error('Failed to delete alert.')
  }
}

// Process all active alerts (this would typically call the backend API)
export async function processAlerts(): Promise<{ message: string; results: any[] }> {
  try {
    // For now, we'll just return a success message
    // In a real implementation, this would call the backend API to process alerts
    return {
      message: 'Alerts processed successfully',
      results: []
    }
  } catch (error) {
    console.error('Error in processAlerts:', error)
    throw new Error('Failed to process alerts.')
  }
} 