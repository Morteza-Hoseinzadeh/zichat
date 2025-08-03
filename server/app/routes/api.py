from flask import Blueprint, jsonify, request
from ..services.example import process_data

bp = Blueprint('api', __name__)

@bp.route('/data', methods=['GET'])
def get_data():
    return jsonify({
        'status': 'success',
        'data': {'sample': [1, 2, 3]}
    })

@bp.route('/process', methods=['POST'])
def process():
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
        
    data = request.get_json()
    result = process_data(data)
    return jsonify(result), 201