from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Use absolute imports starting from your project root
from routes.web import web_routes
from routes.API.cryptoes.cryptoes import crypto_routes

app.register_blueprint(web_routes)
app.register_blueprint(crypto_routes, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)