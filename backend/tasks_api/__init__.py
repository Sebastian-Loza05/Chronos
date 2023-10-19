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
from models import Users, setup_db, Tasks
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
CORS(app, resources={r'/*': {'origins': '*'}})

def get_tasks_params(type_search, begin_date, end_date, user):
    # En caso sólo se quieran las tareas de un día
    if type_search == 1:
        tasks = Tasks.get_task_by_date(begin_date)
        return tasks
    # En caso se quieran las tareas de un periodo de tiempo
    if end_date is None:
        return [-1]
    tasks = Tasks.query.filter(
        Tasks.dia.between(begin_date, end_date),
        Tasks.user_id == user["id"]
    ).all()
    return tasks

@app.route("/task", methods=["POST"])
@jwt_required()
def get_tasks():
    error_422 = False
    error_406 = False
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        # Obtenemos los datos de la creación de la tarea
        tarea = data.get("tarea", None)
        dia = data.get("dia", None)
        descripcion = data.get("descripcion", None)
        lugar = data.get("lugar", None)
        hora_inicio = data.get("inicio", None)
        hora_final = data.get("fin", None)

        if tarea is None or dia is None or hora_final is None or hora_final is None:
            error_422 = True
            abort(422)

        task = Tasks(
            user_id=current_user["id"],
            nombre=tarea,
            estado="Sin completar",
            dia=dia,
            hora_inicio=hora_inicio,
            hora_final=hora_final
        )

        if descripcion is not None:
            task.descripcion = descripcion

        if lugar is not None:
            task.lugar = lugar

        task_id = task.insert()
        if task_id == -1:
            error_406 = True
            abort(406)

        task = Tasks.get_task_by_id(task_id)

        return ({
            'success': True,
            'task_created': task.format()
        })

    except Exception as e:
        print(e)
        if error_422:
            abort(422)
        elif error_406:
            abort(406)
        else:
            abort(500)

@app.route("/tasks/search", methods=["POST"])
@jwt_required()
def search():
    error_422 = False
    error_406 = False
    error_404 = False
    try:
        current_user = get_jwt_identity()

        data = request.get_json()
        type_search = data.get("type_search", None)
        begin_date = data.get("begin_date", None)
        end_date = data.get("end_date", None)

        # Obtenemos los parámetros de la búsqueda
        if type_search is None or begin_date is None:
            error_422 = True
            abort(422)

        # llamamos a la función para obtener tasks
        tasks = get_tasks_params(type_search, begin_date, end_date, current_user)
        # print("Tasks: ", tasks)

        if len(tasks) == 0:
            error_404 = True
            abort(404)

        if tasks[0] == -1:
            error_422 = True
            abort(422)

        tasks = [task.format() for task in tasks]

        return jsonify({
            'success': True,
            'tasks': tasks
        })

    except Exception as e:
        print(e)
        if error_422:
            abort(422)
        elif error_406:
            abort(406)
        elif error_404:
            abort(404)
        else:
            abort(500)

@app.route("/task/<task_id>", methods=['PATCH'])
@jwt_required()
def update_task(task_id):
    error_422 = False
    error_406 = False
    error_404 = False
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        # Obtenemos los datos de la creación de la tarea
        tarea = data.get("tarea", None)
        dia = data.get("dia", None)
        descripcion = data.get("descripcion", None)
        estado = data.get("estado", None)
        lugar = data.get("lugar", None)
        hora_inicio = data.get("inicio", None)
        hora_final = data.get("fin", None)

        if tarea is None and dia is None and hora_final is None and hora_final is None and descripcion is None and lugar is None and estado is None:
            error_422 = True
            abort(422)

        task = Tasks.query.filter_by(
            user_id=current_user["id"],
            id=task_id
        ).one_or_none()

        if task is None:
            error_404 = True
            abort(404)

        if estado is not None:
            task.estado = "Completada"

        if tarea is not None:
            task.tarea = tarea

        if dia is not None:
            task.dia = dia

        if descripcion is not None:
            task.descripcion = descripcion

        if lugar is not None:
            task.lugar = lugar

        if hora_inicio is not None:
            task.hora_inicio = hora_inicio

        if hora_final is not None:
            task.hora_final = hora_final

        print(task)

        task_id = task.update()

        if task_id == -1:
            error_406 = True
            abort(406)

        task = Tasks.query.filter_by(
            user_id=current_user["id"],
            id=task_id
        ).one_or_none()

        return jsonify({
            'success': True,
            'task_updated': task.format()
        })

    except Exception as e:
        print(e)
        if error_422:
            abort(422)
        elif error_406:
            abort(406)
        elif error_404:
            abort(404)
        else:
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