from flask import Blueprint

web_routes = Blueprint('web', __name__)

@web_routes.route('/')
def home():
    return "Home Page"

@web_routes.route('/about')
def about():
    return "About Page"