from flask import Blueprint, request, jsonify

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    # Authentication logic would go here
    return jsonify({'token': 'sample-token'})

@bp.route('/register', methods=['POST'])
def register():
    # Registration logic would go here
    return jsonify({'message': 'User created'})