<div align="center">

![Foresight Logo](foresight-logo.svg)

# Foresight: Trading Insights

</div>

This project began as a humble exercise on Day 36 of the "100 Days of Code: The Complete Python Pro Bootcamp" course. What started as a simple stock monitoring script quickly evolved into a captivating exploration of financial data, real-time alerts, and the immense potential of artificial intelligence in trading. My fascination with leveraging technology to gain an edge in financial markets has driven me to expand this foundational CLI application.

This repository represents the initial phase of building a sophisticated trading assistant. My vision extends beyond basic alerts; I aim to integrate advanced Large Language Models (LLMs) and other AI techniques to analyze market sentiment, predict trends, and ultimately, provide intelligent, actionable insights for trading decisions. The long-term goal is to develop a system capable of not just informing, but potentially automating, trading strategies based on robust AI analysis.

## Learning Journey & Technical Growth

### From CLI to Full-Stack Web Application
This project demonstrates my progression from basic Python scripting to full-stack web development:

- **Phase 1**: Started with command-line Python scripts using `argparse`, `requests`, and `smtplib`
- **Phase 2**: Evolved into a Flask REST API with comprehensive endpoints and data management
- **Phase 3**: Built a modern Next.js frontend with TypeScript, Tailwind CSS, and component libraries
- **Phase 4**: Integrated real-time data processing, authentication, and advanced UI/UX patterns

### Key Learning Outcomes
- **API Integration**: Mastered external API consumption (Alpha Vantage, NewsAPI) with error handling and rate limiting
- **Full-Stack Development**: Gained proficiency in both frontend (React/Next.js) and backend (Python/Flask) technologies
- **Real-time Systems**: Implemented live data updates, WebSocket connections, and event-driven architectures
- **Database Design**: Designed efficient data models for financial data, user preferences, and alert management
- **Security Best Practices**: Implemented authentication, input validation, and secure API key management
- **DevOps & Deployment**: Deployed both frontend and backend to cloud platforms with CI/CD pipelines

## Project Overview

Foresight has evolved from a CLI application into a full-stack web application featuring:

- **Frontend**: Modern Next.js application with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: Flask API with comprehensive endpoints for stock data, alerts, and dashboard functionality
- **Database**: Supabase integration for user authentication and portfolio data persistence
- **Real-time Monitoring**: Advanced alert system with email notifications and in-app alerts
- **Dashboard**: Interactive dashboard with portfolio tracking, market leaders, and activity monitoring

## Data Workflow & Architecture

### Portfolio Data Flow

The system implements a comprehensive data workflow that connects user interactions to real-time financial data:

```
User Action → Frontend → Supabase → Database → Flask API → External APIs
     ↓
1. Add Stock → Modal → savePortfolioHoldings() → portfolio_holdings table
     ↓
2. View Dashboard → getPortfolioData() → loadPortfolioHoldings() → portfolio_holdings table
     ↓
3. Get Prices → fetch('/api/stock/AAPL') → Flask API → Alpha Vantage API
     ↓
4. Calculate Totals → Frontend calculations → Display real-time data
```

### Authentication & User Management
```typescript
// User authentication through Supabase
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  return user.id
}
```

### Portfolio Management Workflow

#### 1. Adding Portfolio Holdings
```typescript
// User adds stock in modal
const savePortfolio = async () => {
  const success = await savePortfolioHoldings(portfolioHoldings)
  // Data flows: Frontend → Supabase → portfolio_holdings table
}
```

#### 2. Loading Portfolio Data
```typescript
// Dashboard loads user's portfolio
const loadUserPortfolioHoldings = async () => {
  const holdings = await loadPortfolioHoldings()
  // Data flows: Supabase → Frontend → Display in modal
}
```

#### 3. Real-time Portfolio Calculations
```typescript
// Dashboard displays live portfolio data
export const getPortfolioData = async () => {
  // Step 1: Get user's holdings from Supabase
  const holdings = await loadPortfolioHoldings()
  
  // Step 2: Get current prices for each holding
  const pricePromises = holdings.map(async (holding) => {
    const response = await fetch(`/api/stock/${holding.symbol}`)
    const data = await response.json()
    return { ...holding, currentPrice: data.currentPrice }
  })
  
  // Step 3: Calculate portfolio totals
  const holdingsWithPrices = await Promise.all(pricePromises)
  // Calculate totalValue, totalChange, changePercent, etc.
}
```

### Database Schema

#### Portfolio Holdings Table
```sql
CREATE TABLE portfolio_holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  symbol VARCHAR(10) NOT NULL,
  shares DECIMAL(10,2) NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Row Level Security (RLS)
```sql
-- Users can only access their own portfolio data
ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own portfolio" ON portfolio_holdings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio" ON portfolio_holdings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Real-time Data Integration

#### Stock Price Updates
```typescript
// Flask API endpoint for real-time stock data
@app.route('/api/stock/<symbol>')
def get_stock_data(symbol):
    # Fetch from Alpha Vantage API
    # Return current price, change, percentage change
    return jsonify({
        'currentPrice': price,
        'priceChange': change,
        'changePercent': percent_change
    })
```

#### Portfolio Calculations
```typescript
// Frontend calculates portfolio metrics
const portfolioHoldings = holdingsWithPrices.map(holding => {
  const positionValue = holding.shares * holding.currentPrice
  const positionChange = holding.shares * (holding.currentPrice - holding.purchase_price)
  const invested = holding.shares * holding.purchase_price
  
  return {
    symbol: holding.symbol,
    shares: holding.shares,
    currentPrice: holding.currentPrice,
    positionValue,
    positionChange,
    changePercent: holding.changePercent
  }
})
```

## Technical Implementation

### Frontend (Next.js)
- **Modern UI/UX**: Clean, responsive design with dark/light mode support
- **Dashboard**: Real-time portfolio overview with market data and alerts
- **Portfolio Management**: Add, edit, and track portfolio holdings
- **Alert Management**: Create, edit, and manage stock price alerts
- **Stock Monitoring**: Real-time stock data with price tracking
- **Authentication**: Protected routes and user session management

### Backend (Flask API)
- **Stock Data**: Real-time stock information via Alpha Vantage API
- **Alert System**: Comprehensive alert creation, management, and processing
- **Dashboard Data**: Portfolio tracking, market leaders, and activity feeds
- **Email Notifications**: Automated email alerts for triggered conditions
- **Health Monitoring**: API health checks and status endpoints

### Database (Supabase)
- **User Authentication**: Secure user registration and login
- **Portfolio Storage**: Persistent storage of user portfolio holdings
- **Row Level Security**: Data isolation between users
- **Real-time Updates**: Live data synchronization

### Core Functionality
- **Portfolio Tracking**: Real-time portfolio value and performance calculations
- **Price Monitoring**: Track stock prices and calculate percentage changes
- **Alert Triggers**: Price-based and percentage-based alert conditions
- **News Integration**: Relevant news articles for context
- **Email Alerts**: Rich email notifications with stock data and news
- **Real-time Updates**: Live data updates and status monitoring

## API Endpoints

### Core Endpoints
- `GET /api/health` - Health check
- `GET /api/stocks` - Stock data for multiple symbols
- `GET /api/stock/{symbol}` - Individual stock data

### Dashboard Endpoints
- `GET /api/dashboard/portfolio` - Portfolio overview data
- `GET /api/dashboard/alerts` - Alert summary and statistics
- `GET /api/dashboard/market-leaders` - Top gainers and losers
- `GET /api/dashboard/activities` - Recent user activities

### Alert Management
- `GET /api/alerts` - List all alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/{id}` - Update existing alert
- `DELETE /api/alerts/{id}` - Delete alert
- `POST /api/alerts/process` - Process all active alerts

## Skills Demonstrated

### Programming Languages & Frameworks
- **Python**: Flask, requests, smtplib, argparse, python-dotenv
- **JavaScript/TypeScript**: Next.js, React, Tailwind CSS
- **HTML/CSS**: Responsive design, modern UI components

### APIs & External Services
- **Financial APIs**: Alpha Vantage for real-time stock data
- **News APIs**: NewsAPI for market context and sentiment
- **Email Services**: SMTP integration for automated notifications

### Development Practices
- **Version Control**: Git workflow and collaborative development
- **Code Organization**: Modular architecture and clean code principles
- **Error Handling**: Comprehensive exception handling and user feedback
- **Documentation**: API documentation and code comments

### Problem Solving
- **Data Processing**: Real-time financial data analysis and calculations
- **System Design**: Scalable architecture for handling multiple data sources
- **User Experience**: Intuitive interfaces for complex financial data
- **Performance Optimization**: Efficient API calls and data caching

## Future Plans

This project continues to evolve with plans for:

- **AI-Powered Trading Insights**: Integration of Large Language Models (LLMs) for market sentiment analysis
- **Advanced Analytics**: Machine learning models for trend prediction and pattern recognition
- **Automated Trading**: Secure execution of trades based on AI insights

## Educational Value

This project serves as a comprehensive learning experience in:
- **Financial Technology**: Understanding market data, trading concepts, and algorithmic approaches
- **Software Engineering**: Full-stack development, API design, and system architecture
- **Data Science**: Real-time data processing, analysis, and visualization
- **Product Development**: User-centered design and iterative feature development

## Contributing

This is a personal project that evolved from a learning exercise. While contributions are welcome, the primary focus is on learning and experimentation with AI-driven trading technologies.

## License

This project is for educational and personal use. Please ensure compliance with your local financial regulations when using automated trading features.