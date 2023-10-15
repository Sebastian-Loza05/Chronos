from flask import (
    Flask,
    request,
    jsonify,
    abort
)
import redis
from flask_cors import CORS
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    JWTManager
)
from decouple import config
from models import Users, setup_db, Profile
from datetime import timedelta

SECRET_KEY = config('SECRET_KEY')
ACCESS_EXPIRES = timedelta(hours=1)
JWT_SECRET_KEY = config('JWT_SECRET_KEY')

app = Flask(__name__)

# Configuracion del token
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
jwt = JWTManager(app)

setup_db(app)
CORS(app, origins=["http://localhost:3000"])

@app.route("/tasks", methods=["GET"])
def get_tasks():
    try:
        pass
    except Exception as e:
        raise e
@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        'success': False,
        'code': 401,
        'message': 'Unauthorized'
    }), 401

@app.errorhandler(403)
def forbbiden(error):
    return jsonify({
        'success': False,
        'code': 403,
        'message': 'Forbbiden'
    }), 403

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'code': 404,
        'message': 'resource not found'
    }), 404

@app.errorhandler(406)
def not_accepted(error):
    return jsonify({
        'success': False,
        'code': 406,
        'message': 'Not accepted'
    }), 406

@app.errorhandler(422)
def unprocesable(error):
    return jsonify({
        'success': False,
        'code': 422,
        'message': 'Unprocesable'
    }), 422

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'success': False,
        'code': 500,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    app.config.from_object(config['development'])
    app.run(debug=True)
