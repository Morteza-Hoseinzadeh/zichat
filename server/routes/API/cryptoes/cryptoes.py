import requests
from flask import Blueprint, jsonify

# Blueprint name should not contain slashes
crypto_routes = Blueprint('crypto', __name__)

@crypto_routes.route('crypto/prices/all', methods=["GET"])
def get_prices():
    try:
        response = requests.get('https://apiv2.nobitex.ir/v3/orderbook/all')
        response.raise_for_status()
        
        data = response.json()
        processed = []
        for items in data.items():
            processed.append(items)

        
        return jsonify({ "status_code": "200", 'data': processed })
        
    except requests.exceptions.RequestException as e:
        return jsonify({ 'status': 'error', 'message': str(e) }), 500