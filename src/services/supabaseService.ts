import { supabase, Alert, Portfolio, AlertTrigger } from '@/lib/supabase'

// Alert operations
export const alertService = {
  // Get all alerts for a user
  async getUserAlerts(userId: string): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching alerts:', error)
      throw error
    }

    return data || []
  },

  // Create a new alert
  async createAlert(alert: Omit<Alert, 'id' | 'created_at'>): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .insert([alert])
      .select()
      .single()

    if (error) {
      console.error('Error creating alert:', error)
      throw error
    }

    return data
  },

  // Update an alert
  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating alert:', error)
      throw error
    }

    return data
  },

  // Delete an alert
  async deleteAlert(id: string): Promise<void> {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting alert:', error)
      throw error
    }
  },

  // Toggle alert status
  async toggleAlertStatus(id: string, status: 'active' | 'inactive'): Promise<Alert> {
    return this.updateAlert(id, { status })
  }
}

// Portfolio operations
export const portfolioService = {
  // Get user's portfolio
  async getUserPortfolio(userId: string): Promise<Portfolio[]> {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching portfolio:', error)
      throw error
    }

    return data || []
  },

  // Add stock to portfolio
  async addToPortfolio(portfolioItem: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>): Promise<Portfolio> {
    const { data, error } = await supabase
      .from('portfolio')
      .insert([portfolioItem])
      .select()
      .single()

    if (error) {
      console.error('Error adding to portfolio:', error)
      throw error
    }

    return data
  },

  // Update portfolio item
  async updatePortfolioItem(id: string, updates: Partial<Portfolio>): Promise<Portfolio> {
    const { data, error } = await supabase
      .from('portfolio')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating portfolio:', error)
      throw error
    }

    return data
  },

  // Remove from portfolio
  async removeFromPortfolio(id: string): Promise<void> {
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error removing from portfolio:', error)
      throw error
    }
  }
}

// Alert trigger operations
export const alertTriggerService = {
  // Get alert triggers for a user
  async getUserAlertTriggers(userId: string): Promise<AlertTrigger[]> {
    const { data, error } = await supabase
      .from('alert_triggers')
      .select('*')
      .eq('user_id', userId)
      .order('triggered_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching alert triggers:', error)
      throw error
    }

    return data || []
  },

  // Create alert trigger
  async createAlertTrigger(trigger: Omit<AlertTrigger, 'id'>): Promise<AlertTrigger> {
    const { data, error } = await supabase
      .from('alert_triggers')
      .insert([trigger])
      .select()
      .single()

    if (error) {
      console.error('Error creating alert trigger:', error)
      throw error
    }

    return data
  }
}

// User profile operations
export const userService = {
  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }

    return data
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      throw error
    }

    return data
  }
} 