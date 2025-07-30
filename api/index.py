import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import random
from datetime import datetime, timedelta
import json
import uuid

load_dotenv()

app = Flask(__name__)
CORS(app)

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "false").lower() == "true"

# Alert storage (in production, use a proper database)
ALERTS_FILE = "alerts.json"

def load_alerts():
    """Load alerts from JSON file."""
    try:
        if os.path.exists(ALERTS_FILE):
            with open(ALERTS_FILE, 'r') as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"Error loading alerts: {e}")
        return []

def save_alerts(alerts):
    """Save alerts to JSON file."""
    try:
        with open(ALERTS_FILE, 'w') as f:
            json.dump(alerts, f, indent=2)
    except Exception as e:
        print(f"Error saving alerts: {e}")

def process_alert(alert):
    """Process an alert using the logic from main.py"""
    try:
        symbol = alert['symbol']
        company_name = alert.get('companyName', symbol)
        alert_type = alert['alertType']
        
        # Get current stock data
        stock_data = get_stock_data(symbol)
        if "error" in stock_data or "mock" in stock_data:
            return {"status": "error", "message": "Failed to fetch stock data"}
        
        metrics = get_stock_metrics(stock_data)
        current_price = metrics["current_price"]
        price_change = metrics["change_percent"]
        
        # Check if alert should be triggered based on type
        triggered = False
        trigger_message = ""
        
        if alert_type in ["price-above", "price-below"]:
            threshold = alert.get('threshold')
            if threshold is not None:
                if alert_type == "price-above" and current_price >= threshold:
                    triggered = True
                    trigger_message = f"Price above ${threshold}"
                elif alert_type == "price-below" and current_price <= threshold:
                    triggered = True
                    trigger_message = f"Price below ${threshold}"
        
        elif alert_type in ["percentage-gain", "percentage-loss", "percentage-change"]:
            percentage = alert.get('percentage')
            if percentage is not None:
                if alert_type == "percentage-gain" and price_change >= percentage:
                    triggered = True
                    trigger_message = f"Gained {price_change:.2f}% (threshold: {percentage}%)"
                elif alert_type == "percentage-loss" and price_change <= -percentage:
                    triggered = True
                    trigger_message = f"Lost {abs(price_change):.2f}% (threshold: {percentage}%)"
                elif alert_type == "percentage-change" and abs(price_change) >= percentage:
                    triggered = True
                    direction = "gained" if price_change > 0 else "lost"
                    trigger_message = f"{direction.capitalize()} {abs(price_change):.2f}% (threshold: {percentage}%)"
        
        if triggered:
            # Alert triggered - update status
            alert['status'] = 'triggered'
            alert['lastTriggered'] = datetime.now().isoformat()
            alert['triggeredPrice'] = current_price
            alert['triggeredChange'] = price_change
            
            # Here you would integrate with your main.py email functionality
            # For now, we'll just log it
            print(f"🚨 ALERT TRIGGERED: {symbol} - {trigger_message}")
            
            return {"status": "triggered", "message": f"Alert triggered: {symbol} - {trigger_message}"}
        else:
            return {"status": "monitoring", "message": f"Monitoring {symbol}: {price_change:.2f}% change"}
            
    except Exception as e:
        print(f"Error processing alert: {e}")
        return {"status": "error", "message": str(e)}

def generate_mock_stock_data(symbol):
    """Generate realistic mock stock data for development"""
    # Base prices for different stocks
    base_prices = {
        "AAPL": 180.0,
        "GOOGL": 2800.0,
        "TSLA": 700.0,
        "MSFT": 350.0,
        "NVDA": 450.0,
        "AMZN": 3200.0,
        "META": 300.0,
        "NFLX": 500.0
    }
    
    base_price = base_prices.get(symbol, 100.0)
    
    # Generate realistic price movement
    price_change_percent = random.uniform(-5.0, 5.0)
    current_price = base_price * (1 + price_change_percent / 100)
    price_change = current_price - base_price
    
    # Generate high/low based on current price
    day_high = current_price * random.uniform(1.01, 1.05)
    day_low = current_price * random.uniform(0.95, 0.99)
    
    # Generate volume
    volume = random.randint(1000000, 50000000)
    
    return {
        "current_price": round(current_price, 2),
        "price_change": round(price_change, 2),
        "change_percent": round(price_change_percent, 2),
        "day_high": round(day_high, 2),
        "day_low": round(day_low, 2),
        "volume": volume
    }

def get_stock_data(symbol):
    """Fetches stock data from Finnhub or returns mock data."""
    
    # Use mock data if enabled
    if USE_MOCK_DATA:
        print(f"🎭 Using mock data for {symbol}")
        return {"mock": True}
    
    try:
        # Check if API key exists
        if not FINNHUB_API_KEY:
            print(f"❌ No Finnhub API key found for symbol {symbol}")
            return {"error": "Finnhub API key not configured"}
        
        # Get current quote
        quote_url = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
        print(f"🔍 Fetching quote data for {symbol} from Finnhub...")
        
        quote_response = requests.get(quote_url)
        quote_response.raise_for_status()
        quote_data = quote_response.json()
        
        print(f"📊 Quote response for {symbol}: {quote_data}")
        
        if "error" in quote_data:
            print(f"❌ Finnhub error for {symbol}: {quote_data['error']}")
            return {"error": quote_data['error']}
        
        # Get company profile for additional info
        profile_url = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={FINNHUB_API_KEY}"
        profile_response = requests.get(profile_url)
        profile_data = profile_response.json() if profile_response.status_code == 200 else {}
        
        # Combine quote and profile data
        stock_data = {
            "quote": quote_data,
            "profile": profile_data
        }
        
        print(f"✅ Successfully fetched data for {symbol}")
        return stock_data
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error for {symbol}: {str(e)}")
        return {"error": f"Failed to fetch data: {str(e)}"}
    except Exception as e:
        print(f"❌ Unexpected error for {symbol}: {str(e)}")
        return {"error": f"Unexpected error: {str(e)}"}

def get_stock_metrics(stock_data):
    """Extracts comprehensive stock metrics from Finnhub data or mock data."""
    
    # Handle mock data
    if "mock" in stock_data:
        return generate_mock_stock_data("AAPL")  # Will be overridden with correct symbol
    
    try:
        quote_data = stock_data.get("quote", {})
        profile_data = stock_data.get("profile", {})
        
        if not quote_data or "c" not in quote_data:
            print(f"❌ No quote data available")
            return {
                "current_price": 0,
                "price_change": 0,
                "change_percent": 0,
                "day_high": 0,
                "day_low": 0,
                "volume": 0
            }
        
        # Extract data from Finnhub quote
        current_price = float(quote_data.get("c", 0))  # Current price
        previous_close = float(quote_data.get("pc", current_price))  # Previous close
        day_high = float(quote_data.get("h", current_price))  # High
        day_low = float(quote_data.get("l", current_price))  # Low
        volume = int(quote_data.get("v", 0))  # Volume
        
        # Calculate price change
        price_change = current_price - previous_close
        change_percent = (price_change / previous_close) * 100 if previous_close > 0 else 0
        
        print(f"💰 Calculated metrics - Price: ${current_price:.2f}, Change: {change_percent:.2f}%")
        
        return {
            "current_price": current_price,
            "price_change": price_change,
            "change_percent": change_percent,
            "day_high": day_high,
            "day_low": day_low,
            "volume": volume
        }
    except (KeyError, ValueError, IndexError) as e:
        print(f"❌ Error processing stock data: {e}")
        return {
            "current_price": 0,
            "price_change": 0,
            "change_percent": 0,
            "day_high": 0,
            "day_low": 0,
            "volume": 0
        }

def get_company_name(symbol, profile_data):
    """Get company name from profile data or generate default"""
    if profile_data and "name" in profile_data:
        return profile_data["name"]
    return f"{symbol} Corp."

@app.route('/', methods=['GET'])
def root():
    """Root endpoint for testing."""
    return jsonify({
        "message": "Foresight API is running!",
        "endpoints": [
            "/api/health",
            "/api/stocks",
            "/api/dashboard/portfolio",
            "/api/dashboard/alerts"
        ]
    })

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    """Get stock data for multiple symbols."""
    symbols = request.args.get('symbols', 'AAPL,GOOGL,TSLA,MSFT,NVDA,AMZN,META,NFLX').split(',')
    stocks = []
    
    print(f"🚀 Processing {len(symbols)} symbols: {symbols}")
    
    for symbol in symbols:
        symbol = symbol.strip().upper()
        stock_data = get_stock_data(symbol)
        
        if "error" in stock_data:
            print(f"❌ Error for {symbol}: {stock_data['error']}")
            stocks.append({
                "symbol": symbol,
                "companyName": f"{symbol} Corp.",
                "currentPrice": 0,
                "priceChange": 0,
                "changePercent": 0,
                "volume": 0,
                "dayHigh": 0,
                "dayLow": 0,
                "status": "halted",
                "error": stock_data["error"]
            })
        elif "mock" in stock_data:
            # Generate mock data for this specific symbol
            metrics = generate_mock_stock_data(symbol)
            stocks.append({
                "symbol": symbol,
                "companyName": f"{symbol} Corp.",
                "currentPrice": metrics["current_price"],
                "priceChange": metrics["price_change"],
                "changePercent": metrics["change_percent"],
                "volume": metrics["volume"],
                "dayHigh": metrics["day_high"],
                "dayLow": metrics["day_low"],
                "status": "active"
            })
        else:
            metrics = get_stock_metrics(stock_data)
            company_name = get_company_name(symbol, stock_data.get("profile", {}))
            
            stocks.append({
                "symbol": symbol,
                "companyName": company_name,
                "currentPrice": metrics["current_price"],
                "priceChange": metrics["price_change"],
                "changePercent": metrics["change_percent"],
                "volume": metrics["volume"],
                "dayHigh": metrics["day_high"],
                "dayLow": metrics["day_low"],
                "status": "active" if metrics["current_price"] > 0 else "inactive"
            })
    
    print(f"📈 Returning {len(stocks)} stock results")
    return jsonify(stocks)

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock(symbol):
    """Get data for a single stock symbol."""
    symbol = symbol.upper()
    stock_data = get_stock_data(symbol)
    
    if "error" in stock_data:
        return jsonify({
            "symbol": symbol,
            "companyName": f"{symbol} Corp.",
            "currentPrice": 0,
            "priceChange": 0,
            "changePercent": 0,
            "volume": 0,
            "dayHigh": 0,
            "dayLow": 0,
            "status": "halted",
            "error": stock_data["error"]
        })
    
    if "mock" in stock_data:
        metrics = generate_mock_stock_data(symbol)
        return jsonify({
            "symbol": symbol,
            "companyName": f"{symbol} Corp.",
            "currentPrice": metrics["current_price"],
            "priceChange": metrics["price_change"],
            "changePercent": metrics["change_percent"],
            "volume": metrics["volume"],
            "dayHigh": metrics["day_high"],
            "dayLow": metrics["day_low"],
            "status": "active"
        })
    
    metrics = get_stock_metrics(stock_data)
    company_name = get_company_name(symbol, stock_data.get("profile", {}))
    
    return jsonify({
        "symbol": symbol,
        "companyName": company_name,
        "currentPrice": metrics["current_price"],
        "priceChange": metrics["price_change"],
        "changePercent": metrics["change_percent"],
        "volume": metrics["volume"],
        "dayHigh": metrics["day_high"],
        "dayLow": metrics["day_low"],
        "status": "active" if metrics["current_price"] > 0 else "inactive"
    })

@app.route('/api/dashboard/portfolio', methods=['GET'])
def get_portfolio_data():
    """Get portfolio overview data."""
    try:
        # Get stock data for portfolio holdings
        portfolio_symbols = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA']
        portfolio_data = []
        total_value = 0
        total_change = 0
        
        for symbol in portfolio_symbols:
            stock_data = get_stock_data(symbol)
            if "error" not in stock_data and "mock" not in stock_data:
                metrics = get_stock_metrics(stock_data)
                # Simulate portfolio holdings (random shares between 10-100)
                shares = random.randint(10, 100)
                position_value = shares * metrics["current_price"]
                position_change = shares * metrics["price_change"]
                
                portfolio_data.append({
                    "symbol": symbol,
                    "shares": shares,
                    "currentPrice": metrics["current_price"],
                    "positionValue": position_value,
                    "positionChange": position_change,
                    "changePercent": metrics["change_percent"]
                })
                
                total_value += position_value
                total_change += position_change
            else:
                # Use mock data for portfolio
                metrics = generate_mock_stock_data(symbol)
                shares = random.randint(10, 100)
                position_value = shares * metrics["current_price"]
                position_change = shares * metrics["price_change"]
                
                portfolio_data.append({
                    "symbol": symbol,
                    "shares": shares,
                    "currentPrice": metrics["current_price"],
                    "positionValue": position_value,
                    "positionChange": position_change,
                    "changePercent": metrics["change_percent"]
                })
                
                total_value += position_value
                total_change += position_change
        
        # Calculate portfolio change percentage
        portfolio_change_percent = (total_change / (total_value - total_change)) * 100 if (total_value - total_change) > 0 else 0
        
        return jsonify({
            "totalValue": round(total_value, 2),
            "totalChange": round(total_change, 2),
            "changePercent": round(portfolio_change_percent, 2),
            "holdings": portfolio_data
        })
        
    except Exception as e:
        print(f"❌ Error getting portfolio data: {e}")
        return jsonify({
            "totalValue": 45231.89,
            "totalChange": 7562.34,
            "changePercent": 20.1,
            "holdings": []
        })

@app.route('/api/dashboard/alerts', methods=['GET'])
def get_alerts_data():
    """Get alerts overview data."""
    try:
        alerts = load_alerts()
        
        # Count active alerts
        active_alerts = len([alert for alert in alerts if alert['status'] == 'active'])
        
        # Count alerts triggered today
        today = datetime.now().date()
        triggered_today = len([
            alert for alert in alerts 
            if alert.get('lastTriggered') and 
            datetime.fromisoformat(alert['lastTriggered']).date() == today
        ])
        
        # Get recent alerts (last 5 triggered alerts)
        recent_alerts = []
        triggered_alerts = [alert for alert in alerts if alert.get('lastTriggered')]
        triggered_alerts.sort(key=lambda x: x['lastTriggered'], reverse=True)
        
        for alert in triggered_alerts[:5]:
            # Calculate time ago
            triggered_time = datetime.fromisoformat(alert['lastTriggered'])
            time_diff = datetime.now() - triggered_time
            
            if time_diff.days > 0:
                time_ago = f"{time_diff.days} day{'s' if time_diff.days > 1 else ''} ago"
            elif time_diff.seconds > 3600:
                hours = time_diff.seconds // 3600
                time_ago = f"{hours} hour{'s' if hours > 1 else ''} ago"
            else:
                minutes = time_diff.seconds // 60
                time_ago = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
            
            recent_alerts.append({
                "id": alert['id'],
                "type": "success",
                "title": f"{alert['symbol']} alert triggered",
                "time": time_ago,
                "symbol": alert['symbol'],
                "price": alert.get('triggeredPrice', 0)
            })
        
        return jsonify({
            "activeAlerts": active_alerts,
            "triggeredToday": triggered_today,
            "recentAlerts": recent_alerts
        })
        
    except Exception as e:
        print(f"❌ Error getting alerts data: {e}")
        return jsonify({
            "activeAlerts": 0,
            "triggeredToday": 0,
            "recentAlerts": []
        })

@app.route('/api/dashboard/market-leaders', methods=['GET'])
def get_market_leaders():
    """Get top gainers and losers."""
    try:
        # Get data for major stocks to determine leaders
        symbols = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA', 'AMZN', 'META', 'NFLX']
        stock_data_list = []
        
        for symbol in symbols:
            stock_data = get_stock_data(symbol)
            if "error" not in stock_data and "mock" not in stock_data:
                metrics = get_stock_metrics(stock_data)
                stock_data_list.append({
                    "symbol": symbol,
                    "changePercent": metrics["change_percent"],
                    "currentPrice": metrics["current_price"]
                })
            else:
                metrics = generate_mock_stock_data(symbol)
                stock_data_list.append({
                    "symbol": symbol,
                    "changePercent": metrics["change_percent"],
                    "currentPrice": metrics["current_price"]
                })
        
        # Sort by change percentage
        sorted_stocks = sorted(stock_data_list, key=lambda x: x["changePercent"], reverse=True)
        
        top_gainer = sorted_stocks[0] if sorted_stocks else {"symbol": "AAPL", "changePercent": 5.2, "currentPrice": 185.50}
        top_loser = sorted_stocks[-1] if sorted_stocks else {"symbol": "TSLA", "changePercent": -2.8, "currentPrice": 245.20}
        
        return jsonify({
            "topGainer": {
                "symbol": top_gainer["symbol"],
                "change": f"{top_gainer['changePercent']:+.1f}% today",
                "price": top_gainer["currentPrice"]
            },
            "topLoser": {
                "symbol": top_loser["symbol"], 
                "change": f"{top_loser['changePercent']:+.1f}% today",
                "price": top_loser["currentPrice"]
            }
        })
        
    except Exception as e:
        print(f"❌ Error getting market leaders: {e}")
        return jsonify({
            "topGainer": {"symbol": "AAPL", "change": "+5.2% today", "price": 185.50},
            "topLoser": {"symbol": "TSLA", "change": "-2.8% today", "price": 245.20}
        })

@app.route('/api/dashboard/activities', methods=['GET'])
def get_recent_activities():
    """Get recent user activities."""
    try:
        activities = [
            {
                "id": "1",
                "type": "success",
                "title": "AAPL price alert triggered",
                "time": "2 minutes ago",
                "details": "Stock price reached $185.50"
            },
            {
                "id": "2",
                "type": "info", 
                "title": "News alert: Tesla earnings report",
                "time": "15 minutes ago",
                "details": "Q4 earnings beat expectations"
            },
            {
                "id": "3",
                "type": "warning",
                "title": "Portfolio rebalancing suggestion", 
                "time": "1 hour ago",
                "details": "Consider reducing NVDA position"
            },
            {
                "id": "4",
                "type": "success",
                "title": "GOOGL alert set successfully",
                "time": "2 hours ago", 
                "details": "Price alert at $2800"
            },
            {
                "id": "5",
                "type": "info",
                "title": "Market open notification",
                "time": "3 hours ago",
                "details": "Trading session started"
            }
        ]
        
        return jsonify(activities)
        
    except Exception as e:
        print(f"❌ Error getting activities: {e}")
        return jsonify([])

# Alert Management Endpoints
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get all alerts."""
    try:
        alerts = load_alerts()
        return jsonify(alerts)
    except Exception as e:
        print(f"❌ Error getting alerts: {e}")
        return jsonify({"error": "Failed to load alerts"}), 500

@app.route('/api/alerts', methods=['POST'])
def create_alert():
    """Create a new alert."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('symbol') or not data.get('alertType'):
            return jsonify({"error": "Missing required fields: symbol, alertType"}), 400
        
        # Create new alert
        new_alert = {
            "id": str(uuid.uuid4()),
            "symbol": data['symbol'],
            "companyName": data.get('companyName', data['symbol']),
            "alertType": data['alertType'],
            "threshold": data.get('threshold'),
            "percentage": data.get('percentage'),
            "status": "active",
            "createdAt": datetime.now().isoformat(),
            "emailNotifications": data.get('emailNotifications', True),
            "inAppNotifications": data.get('inAppNotifications', True),
            "lastTriggered": None,
            "triggeredPrice": None,
            "triggeredChange": None
        }
        
        # Load existing alerts and add new one
        alerts = load_alerts()
        alerts.append(new_alert)
        save_alerts(alerts)
        
        print(f"✅ Created alert for {new_alert['symbol']}")
        return jsonify(new_alert), 201
        
    except Exception as e:
        print(f"❌ Error creating alert: {e}")
        return jsonify({"error": "Failed to create alert"}), 500

@app.route('/api/alerts/<alert_id>', methods=['PUT'])
def update_alert(alert_id):
    """Update an existing alert."""
    try:
        data = request.get_json()
        alerts = load_alerts()
        
        # Find and update alert
        for alert in alerts:
            if alert['id'] == alert_id:
                # Update allowed fields
                allowed_fields = ['threshold', 'percentage', 'status', 'emailNotifications', 'inAppNotifications']
                for field in allowed_fields:
                    if field in data:
                        alert[field] = data[field]
                
                save_alerts(alerts)
                print(f"✅ Updated alert {alert_id}")
                return jsonify(alert)
        
        return jsonify({"error": "Alert not found"}), 404
        
    except Exception as e:
        print(f"❌ Error updating alert: {e}")
        return jsonify({"error": "Failed to update alert"}), 500

@app.route('/api/alerts/<alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    """Delete an alert."""
    try:
        alerts = load_alerts()
        
        # Find and remove alert
        for i, alert in enumerate(alerts):
            if alert['id'] == alert_id:
                deleted_alert = alerts.pop(i)
                save_alerts(alerts)
                print(f"✅ Deleted alert {alert_id}")
                return jsonify({"message": "Alert deleted successfully"})
        
        return jsonify({"error": "Alert not found"}), 404
        
    except Exception as e:
        print(f"❌ Error deleting alert: {e}")
        return jsonify({"error": "Failed to delete alert"}), 500

@app.route('/api/alerts/process', methods=['POST'])
def process_alerts():
    """Process all active alerts."""
    try:
        alerts = load_alerts()
        active_alerts = [alert for alert in alerts if alert['status'] == 'active']
        
        results = []
        for alert in active_alerts:
            result = process_alert(alert)
            results.append({
                "alertId": alert['id'],
                "symbol": alert['symbol'],
                "result": result
            })
        
        # Save updated alerts
        save_alerts(alerts)
        
        return jsonify({
            "message": f"Processed {len(active_alerts)} alerts",
            "results": results
        })
        
    except Exception as e:
        print(f"❌ Error processing alerts: {e}")
        return jsonify({"error": "Failed to process alerts"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    finnhub_status = "configured" if FINNHUB_API_KEY else "missing"
    news_status = "configured" if NEWS_API_KEY else "missing"
    return jsonify({
        "status": "healthy", 
        "message": "API is running",
        "finnhub_api_key": finnhub_status,
        "news_api_key": news_status,
        "mock_data_enabled": USE_MOCK_DATA
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
