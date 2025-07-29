import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import random
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)
CORS(app)

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "false").lower() == "true"

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

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    api_key_status = "configured" if FINNHUB_API_KEY else "missing"
    return jsonify({
        "status": "healthy", 
        "message": "API is running",
        "finnhub_api_key": api_key_status,
        "mock_data_enabled": USE_MOCK_DATA
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
