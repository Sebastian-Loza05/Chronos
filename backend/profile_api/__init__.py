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

# Tokens revocados
revoked_tokens = set()

setup_db(app)
CORS(app, origins=["http://localhost:3000"])

jwt_redis_blocklist = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)

# Funcion para revisar si el token esta en el blocklist
@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in revoked_tokens

@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        current_user = get_jwt_identity()
        profile = Profile.get_by_profile_id(current_user["id"])

        return ({
            'success': True,
            'profile': profile.format()
        })

    except Exception as e:
        print(e)
        abort(500)


@app.route("/sign_in", methods=['POST'])
def sign_in():
    error_422 = False
    error_406 = False
    try:
        data = request.get_json()
        # data del user
        username = data.get("username", None)
        password = data.get("password", None)

        # data del profile
        nombre = data.get("nombre", None)
        apellido = data.get("apellido", None)
        genero = data.get("genero", None)
        fecha_nacimiento = data.get("fecha_nacimiento", None)
        pais = data.get("pais", None)
        celular = data.get("celular", None)
        correo = data.get("correo", None)

        # Creación de user
        if username is None or password is None:
            error_422 = True
            abort(422)

        if nombre is None or apellido is None or genero is None or fecha_nacimiento is None or pais is None or celular is None or correo is None:
            error_422 = True
            abort(422)

        user = Users(username=username)
        user.set_password(password)
        user_id = user.insert()
        if user_id == -1:
            error_406 = True
            abort(406)

        # Creación del profile del user
        profile = Profile(
            user_id=user_id,
            nombre=nombre,
            apellido=apellido,
            genero=genero,
            fecha_nacimiento=fecha_nacimiento,
            pais=pais,
            celular=celular,
            correo=correo
        )

        profile_id = profile.insert()
        if profile_id == -1:
            error_406 = True
            abort(406)

        # Auto login
        user = Users.get_by_id(user_id)
        # user = profile.user
        token = create_access_token(identity=user.format())

        return jsonify({
            'success': True,
            'created_user': profile.format(),
            'token': token
        })

    except Exception as e:
        print(e)
        if error_406:
            abort(406)
        elif error_422:
            abort(422)
        else:
            abort(500)


@app.route("/profile", methods=["PATCH"])
@jwt_required()
def update_profile():
    error_401 = False
    error_422 = False
    try:
        # Obtención de la información
        current_user = get_jwt_identity()
        profile = Profile.get_by_profile_id(current_user["id"])
        foto = request.files["foto"]
        if not foto:
            error_422 = True
            abort(406)

        foto = foto.read()
        profile.foto = foto

        # Actualización del perfil
        profile_id = profile.update()

        if profile_id == -1:
            error_406 = True
            abort(406)

        profile = Profile.get_by_profile_id(current_user["id"])

        return ({
            'success': True,
            'profile_updated': profile.format()
        })

    except Exception as e:
        print(e)
        if error_401:
            abort(401)
        elif error_422:
            abort(422)
        elif error_406:
            abort(406)
        else:
            abort(500)

@app.route("/profile", methods=["DELETE"])
@jwt_required()
def delete_profile():
    try:
        current_user = get_jwt_identity()
        user = Users.get_by_id(current_user["id"])
        profile = user.profile
        profile.delete()
        user.delete()

        return ({
            'succes': True,
        })
    except Exception as e:
        print(e)
        abort(500)

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
