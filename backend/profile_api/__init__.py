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
CORS(app, resources={r'/*': {'origins': '*'}})

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
        print("Si aparece esto esta mal")
        current_user = get_jwt_identity()
        profile = Profile.get_by_profile_id(current_user["id"])
        print(profile.format())
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
        pais = data.get("pais", "Peru")
        celular = data.get("celular", None)
        correo = data.get("correo", None)
        # Imágenes predeterminadas basadas en el género
        default_profile_images = {
            'female': 'https://media.discordapp.net/attachments/1155323431915630594/1171520201183998045/image_17.png?ex=655cfa35&is=654a8535&hm=7bd18544dbac9719106aee1b8e756209f2afa458da7ded9cae2c532d3be19089&=&width=421&height=423',
            'male': 'https://media.discordapp.net/attachments/996002132891271188/1171557183574511756/image_24.png?ex=655d1ca7&is=654aa7a7&hm=ae91272407d0a2a4bb49614f85738d77c7d6f90943a15be2d2a910756abad4d1&=&width=425&height=423',
        }
        print("iMAGEN: ", default_profile_images[genero])
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
            correo=correo,
            foto=default_profile_images[genero.lower()]
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

        # Aquí cambiamos para recibir un JSON en lugar de un archivo
        data = request.get_json()
        foto_url = data.get("foto")
        if not foto_url:
            error_422 = True
            abort(422)

        profile.foto = foto_url  # Ahora estamos asignando la URL de la imagen

        # Actualización del perfil
        profile_id = profile.update()

        if profile_id == -1:
            error_406 = True
            abort(406)

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
        user.delete()

        return ({
            'success': True,
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
