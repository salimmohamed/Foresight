import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

def get_stock_data(symbol):
    """Fetches stock data from Alpha Vantage."""
    try:
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if "Error Message" in data:
            return {"error": data["Error Message"]}
        if "Note" in data:
            return {"error": "API rate limit exceeded. Please try again later."}
        
        return data.get("Time Series (Daily)", {})
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch data: {str(e)}"}

def get_stock_metrics(stock_data):
    """Extracts comprehensive stock metrics from daily data."""
    try:
        dates = list(stock_data.keys())
        if len(dates) < 2:
            return {
                "current_price": 0,
                "price_change": 0,
                "change_percent": 0,
                "day_high": 0,
                "day_low": 0,
                "volume": 0
            }
        
        latest_date = dates[0]
        previous_date = dates[1]
        
        latest_data = stock_data[latest_date]
        previous_data = stock_data[previous_date]
        
        current_price = float(latest_data["4. close"])
        previous_price = float(previous_data["4. close"])
        price_change = current_price - previous_price
        change_percent = (price_change / previous_price) * 100
        
        day_high = float(latest_data["2. high"])
        day_low = float(latest_data["3. low"])
        volume = int(latest_data["5. volume"])
        
        return {
            "current_price": current_price,
            "price_change": price_change,
            "change_percent": change_percent,
            "day_high": day_high,
            "day_low": day_low,
            "volume": volume
        }
    except (KeyError, ValueError, IndexError) as e:
        print(f"Error processing stock data: {e}")
        return {
            "current_price": 0,
            "price_change": 0,
            "change_percent": 0,
            "day_high": 0,
            "day_low": 0,
            "volume": 0
        }

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    """Get stock data for multiple symbols."""
    symbols = request.args.get('symbols', 'AAPL,GOOGL,TSLA,MSFT,NVDA,AMZN,META,NFLX').split(',')
    stocks = []
    
    for symbol in symbols:
        symbol = symbol.strip().upper()
        stock_data = get_stock_data(symbol)
        
        if "error" in stock_data:
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
        else:
            metrics = get_stock_metrics(stock_data)
            
            stocks.append({
                "symbol": symbol,
                "companyName": f"{symbol} Corp.",
                "currentPrice": metrics["current_price"],
                "priceChange": metrics["price_change"],
                "changePercent": metrics["change_percent"],
                "volume": metrics["volume"],
                "dayHigh": metrics["day_high"],
                "dayLow": metrics["day_low"],
                "status": "active" if metrics["current_price"] > 0 else "inactive"
            })
    
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
    
    metrics = get_stock_metrics(stock_data)
    
    return jsonify({
        "symbol": symbol,
        "companyName": f"{symbol} Corp.",
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
    return jsonify({"status": "healthy", "message": "API is running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
