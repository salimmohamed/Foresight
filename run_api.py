#!/usr/bin/env python3
"""
Simple script to run the Flask API server for the stock dashboard.
Make sure you have a .env file with your FINNHUB_API_KEY.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check if API key is available
if not os.getenv("FINNHUB_API_KEY"):
    print("❌ Error: FINNHUB_API_KEY not found in .env file")
    print("Please create a .env file with your Finnhub API key:")
    print("FINNHUB_API_KEY=your_api_key_here")
    sys.exit(1)

print("✅ Finnhub API key found")
print("🚀 Starting Flask API server...")
print("📊 API will be available at: http://localhost:5000")
print("🔗 Dashboard endpoint: http://localhost:5000/api/stocks")
print("🏥 Health check: http://localhost:5000/api/health")
print("\nPress Ctrl+C to stop the server\n")

# Import and run the Flask app
from api.index import app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 