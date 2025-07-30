from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock data storage
alerts = []

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "message": "Mock API running"})

@app.route('/api/stocks')
def stocks():
    return jsonify([
        {"symbol": "AAPL", "name": "Apple Inc.", "price": 150.25, "change": 2.5},
        {"symbol": "GOOGL", "name": "Alphabet Inc.", "price": 2750.80, "change": -1.2},
        {"symbol": "MSFT", "name": "Microsoft Corporation", "price": 320.45, "change": 0.8}
    ])

@app.route('/api/dashboard/portfolio')
def portfolio():
    return jsonify({
        "totalValue": 125000,
        "dailyChange": 1250,
        "holdings": [
            {"symbol": "AAPL", "shares": 100, "value": 15025},
            {"symbol": "GOOGL", "shares": 50, "value": 137540}
        ]
    })

@app.route('/api/dashboard/alerts')
def dashboard_alerts():
    return jsonify(alerts)

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    return jsonify(alerts)

@app.route('/api/alerts', methods=['POST'])
def create_alert():
    data = request.json
    alert = {
        "id": str(uuid.uuid4()),
        "symbol": data.get('symbol'),
        "companyName": data.get('companyName', ''),
        "alertType": data.get('alertType'),
        "threshold": data.get('threshold'),
        "percentage": data.get('percentage'),
        "status": "active",
        "createdAt": datetime.now().isoformat(),
        "emailNotifications": data.get('emailNotifications', True),
        "inAppNotifications": data.get('inAppNotifications', True)
    }
    alerts.append(alert)
    return jsonify(alert), 201

@app.route('/api/alerts/<alert_id>', methods=['PUT'])
def update_alert(alert_id):
    data = request.json
    for alert in alerts:
        if alert['id'] == alert_id:
            alert.update(data)
            return jsonify(alert)
    return jsonify({"error": "Alert not found"}), 404

@app.route('/api/alerts/<alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    global alerts
    alerts = [alert for alert in alerts if alert['id'] != alert_id]
    return '', 204

@app.route('/api/alerts/process', methods=['POST'])
def process_alerts():
    # Mock processing - just return success
    return jsonify({"message": "Alerts processed", "processed": len(alerts)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)