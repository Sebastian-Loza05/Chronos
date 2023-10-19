from flask import (
    Flask,
    request,
    jsonify,
    abort
)
from flask_cors import CORS
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    JWTManager
)
from decouple import config
from models import Tasks, setup_db
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

@app.route("/task", methods=["POST"])
@jwt_required()
def create_task():
    error_406 = False
    error_422 = False
    try:
        data = request.get_json()
        name = data.get('name', None)
        place = data.get('place', None)
        description = data.get('description', None)
        date = data.get('date', None)
        start_time = data.get('start_time', None)
        end_time = data.get('end_time', None)

        if name is None or date is None or start_time is None or end_time is None:
            error_422 = True
            abort(422)
        current_user = get_jwt_identity()

        task = Tasks(
            user_id=current_user['id'],
            nombre=name,
            lugar=place,
            descripcion=description,
            fecha=date,
            hora_inicio=start_time,
            hora_final=end_time
        )
        result = task.insert()
        if result == -1:
            error_406 = True
            abort(406)

        return jsonify({
            'success': True,
            'created': task.format()
        })
    except Exception as e:
        print(e)
        if error_406:
            abort(406)
        elif error_422:
            abort(422)
        else:
            abort(500)

@app.route("/tasks", methods=["GET"])
@jwt_required()
def get_tasks():
    try:
        current_user = get_jwt_identity()
        
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
