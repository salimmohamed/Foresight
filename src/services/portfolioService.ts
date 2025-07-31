import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface PortfolioHolding {
  id?: string
  symbol: string
  shares: number
  purchase_price: number
  created_at?: string
  updated_at?: string
}

export interface Portfolio {
  holdings: PortfolioHolding[]
}

// Get current user ID (you can replace this with your auth logic)
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  return user.id
}

// Load portfolio holdings from Supabase
export const loadPortfolioHoldings = async (): Promise<PortfolioHolding[]> => {
  try {
    const userId = await getCurrentUserId()
    
    const { data, error } = await supabase
      .from('portfolio_holdings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading portfolio holdings:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in loadPortfolioHoldings:', error)
    return []
  }
}

// Save portfolio holdings to Supabase
export const savePortfolioHoldings = async (holdings: PortfolioHolding[]): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId()
    
    // First, delete all existing holdings for this user
    const { error: deleteError } = await supabase
      .from('portfolio_holdings')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting existing holdings:', deleteError)
      throw deleteError
    }

    // If no holdings to save, we're done
    if (holdings.length === 0) {
      return true
    }

    // Prepare holdings data with user_id
    const holdingsWithUserId = holdings.map(holding => ({
      user_id: userId,
      symbol: holding.symbol.toUpperCase(),
      shares: holding.shares,
      purchase_price: holding.purchase_price
    }))

    // Insert new holdings
    const { error: insertError } = await supabase
      .from('portfolio_holdings')
      .insert(holdingsWithUserId)

    if (insertError) {
      console.error('Error inserting holdings:', insertError)
      throw insertError
    }

    return true
  } catch (error) {
    console.error('Error in savePortfolioHoldings:', error)
    return false
  }
}

// Add a single holding
export const addPortfolioHolding = async (holding: Omit<PortfolioHolding, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId()
    
    const { error } = await supabase
      .from('portfolio_holdings')
      .insert({
        user_id: userId,
        symbol: holding.symbol.toUpperCase(),
        shares: holding.shares,
        purchase_price: holding.purchase_price
      })

    if (error) {
      console.error('Error adding holding:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in addPortfolioHolding:', error)
    return false
  }
}

// Remove a single holding
export const removePortfolioHolding = async (holdingId: string): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId()
    
    const { error } = await supabase
      .from('portfolio_holdings')
      .delete()
      .eq('id', holdingId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error removing holding:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in removePortfolioHolding:', error)
    return false
  }
}

// Update a single holding
export const updatePortfolioHolding = async (holdingId: string, updates: Partial<PortfolioHolding>): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId()
    
    const { error } = await supabase
      .from('portfolio_holdings')
      .update({
        symbol: updates.symbol?.toUpperCase(),
        shares: updates.shares,
        purchase_price: updates.purchase_price
      })
      .eq('id', holdingId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating holding:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in updatePortfolioHolding:', error)
    return false
  }
}

// Get portfolio data for dashboard (with current prices and calculations)
export const getPortfolioData = async () => {
  try {
    const holdings = await loadPortfolioHoldings()
    
    if (holdings.length === 0) {
      return {
        totalValue: 0,
        totalChange: 0,
        changePercent: 0,
        holdings: []
      }
    }

    // Get current prices for all holdings
    const pricePromises = holdings.map(async (holding) => {
      try {
        const response = await fetch(`/api/stock/${holding.symbol}`)
        if (response.ok) {
          const data = await response.json()
          return {
            ...holding,
            currentPrice: data.currentPrice,
            priceChange: data.priceChange,
            changePercent: data.changePercent
          }
        } else {
          // Fallback to purchase price if API fails
          return {
            ...holding,
            currentPrice: holding.purchase_price,
            priceChange: 0,
            changePercent: 0
          }
        }
      } catch (error) {
        console.error(`Error fetching price for ${holding.symbol}:`, error)
        return {
          ...holding,
          currentPrice: holding.purchase_price,
          priceChange: 0,
          changePercent: 0
        }
      }
    })

    const holdingsWithPrices = await Promise.all(pricePromises)
    
    // Calculate portfolio totals
    let totalValue = 0
    let totalChange = 0
    let totalInvested = 0

    const portfolioHoldings = holdingsWithPrices.map(holding => {
      const positionValue = holding.shares * holding.currentPrice
      const positionChange = holding.shares * (holding.currentPrice - holding.purchase_price)
      const invested = holding.shares * holding.purchase_price
      
      totalValue += positionValue
      totalChange += positionChange
      totalInvested += invested

      return {
        symbol: holding.symbol,
        shares: holding.shares,
        currentPrice: holding.currentPrice,
        positionValue,
        positionChange,
        changePercent: holding.changePercent
      }
    })

    const changePercent = totalInvested > 0 ? (totalChange / totalInvested) * 100 : 0

    return {
      totalValue: Math.round(totalValue * 100) / 100,
      totalChange: Math.round(totalChange * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      holdings: portfolioHoldings
    }
  } catch (error) {
    console.error('Error in getPortfolioData:', error)
    return {
      totalValue: 0,
      totalChange: 0,
      changePercent: 0,
      holdings: []
    }
  }
}

// Get market leaders from user's portfolio
export const getPortfolioMarketLeaders = async () => {
  try {
    const portfolioData = await getPortfolioData()
    
    if (!portfolioData.holdings || portfolioData.holdings.length === 0) {
      return {
        topGainer: { symbol: "", change: "", price: 0 },
        topLoser: { symbol: "", change: "", price: 0 }
      }
    }

    // Sort holdings by change percentage
    const sortedHoldings = [...portfolioData.holdings].sort((a, b) => b.changePercent - a.changePercent)
    
    const topGainer = sortedHoldings[0]
    const topLoser = sortedHoldings[sortedHoldings.length - 1]

    return {
      topGainer: {
        symbol: topGainer.symbol,
        change: `${topGainer.changePercent >= 0 ? '+' : ''}${topGainer.changePercent.toFixed(1)}% today`,
        price: topGainer.currentPrice
      },
      topLoser: {
        symbol: topLoser.symbol,
        change: `${topLoser.changePercent >= 0 ? '+' : ''}${topLoser.changePercent.toFixed(1)}% today`,
        price: topLoser.currentPrice
      }
    }
  } catch (error) {
    console.error('Error in getPortfolioMarketLeaders:', error)
    return {
      topGainer: { symbol: "", change: "", price: 0 },
      topLoser: { symbol: "", change: "", price: 0 }
    }
  }
} 