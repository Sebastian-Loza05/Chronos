import re
from flask import (
    Flask,
    request,
    jsonify,
    abort
)
import redis
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt,
    JWTManager
)
from decouple import config
from models import Users, setup_db
from datetime import timedelta

SECRET_KEY = config('SECRET_KEY')
ACCESS_EXPIRES = timedelta(hours=1)
JWT_SECRET_KEY = config('JWT_SECRET_KEY')

app = Flask(__name__)

# Configuracion del token
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
jwt = JWTManager(app)

# Tokens revocados
revoked_tokens = set()

setup_db(app)
CORS(app, resources={r'/*': {'origins': '*'}})

jwt_redis_blocklist = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)


# Funcion para revisar si el token esta en el blocklist
@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in revoked_tokens


@app.route("/auth", methods=['POST'])
def auth():
    error_403 = False
    error_404 = False
    error_422 = False
    try:
        data = request.get_json()
        username = data.get('username', None)
        password = data.get('password', None)

        if username is None or password is None:
            error_422 = True
            abort(422)

        user = Users.get_by_username(username)

        if user is None:
            error_404 = True
            abort(404)

        if not user.check_password(password):
            error_403 = True
            abort(403)

        token = create_access_token(identity=user.format())

        return jsonify({
            'success': True,
            'profile': user.format(),
            'token': token
        })

    except Exception as e:
        print(e)
        if error_403:
            abort(403)
        elif error_404:
            abort(404)
        elif error_422:
            abort(422)
        else:
            abort(500)


@app.route("/auth/token", methods=['GET'])
def loginByToken():
    error_401 = False
    try:
        token = None
        palabra_eliminar = "Bearer "
        if 'Authorization' in request.headers:
            token = request.headers["Authorization"]
            token = re.sub(rf'\b{palabra_eliminar}\b', '', token)
            print("token:", token)

        if token is None or token == "undefined":
            error_401 = True
            abort(401)

        return jsonify({
            'success': True,
        })
    except Exception as e:
        print(e)
        if error_401:
            abort(401)
        else:
            abort(500)


@app.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    revoked_tokens.add(jti)
    # Returns "Access token revoked" or "Refresh token revoked"
    return jsonify({'message': 'Token revoked'}), 200

@app.route("/auth/signup", methods=['POST'])
def signup():
    error_403 = False
    error_406 = False
    error_422 = False
    try:
        data = request.get_json()
        username = data.get('username', None)
        password = data.get('password', None)
        if username is None or password is None:
            error_422 = True
            abort(422)

        user = Users(username=username)
        user.set_password(password)
        user_id = user.insert()
        if user_id == -1:
            error_406 = True
            abort(406)

        return jsonify({
            'success': True,
            'created_user': user.format()
        })
    except Exception as e:
        print(e)
        if error_403:
            abort(403)
        elif error_406:
            abort(406)
        elif error_422:
            abort(422)
        else:
            abort(500)

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        'success': False,
        'code': 401,
        'message': 'Unauthorized',
    }), 401

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

