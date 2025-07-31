// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000' 
  : process.env.NEXT_PUBLIC_API_URL || 'https://foresight-api-theta.vercel.app';

export const API_ENDPOINTS = {
  stocks: `${API_BASE_URL}/api/stocks`,
  stock: (symbol: string) => `${API_BASE_URL}/api/stock/${symbol}`,
  dashboardPortfolio: `${API_BASE_URL}/api/dashboard/portfolio`,
  alerts: `${API_BASE_URL}/api/dashboard/alerts`,
  marketLeaders: `${API_BASE_URL}/api/dashboard/market-leaders`,
  activities: `${API_BASE_URL}/api/dashboard/activities`,
  health: `${API_BASE_URL}/api/health`,
  // Alert management endpoints
  alertManagement: `${API_BASE_URL}/api/alerts`,
  alert: (id: string) => `${API_BASE_URL}/api/alerts/${id}`,
  processAlerts: `${API_BASE_URL}/api/alerts/process`,
  // Portfolio management endpoints
  portfolio: `${API_BASE_URL}/api/portfolio`,
}; 