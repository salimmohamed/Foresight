import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  user_id: string
  symbol: string
  company_name: string
  alert_type: 'price-above' | 'price-below' | 'volume-above' | 'news'
  threshold: number
  status: 'active' | 'inactive' | 'triggered'
  created_at: string
  last_triggered?: string
  email_notifications: boolean
  in_app_notifications: boolean
  description?: string
}

export interface Portfolio {
  id: string
  user_id: string
  symbol: string
  shares: number
  average_price: number
  created_at: string
  updated_at: string
}

export interface AlertTrigger {
  id: string
  alert_id: string
  user_id: string
  triggered_at: string
  price_at_trigger: number
  message: string
} 