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
from models import Users, Tasks, Categories, Categories_Tasks, setup_db
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
        Tasks.fecha.between(begin_date, end_date),
        Tasks.user_id == user["id"]
    ).all()
    return tasks

# --------------------------
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

        task = Tasks.get_task_by_id(result)

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
    error_404 = False
    error_406 = False
    error_422 = False
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        # Obtenemos los datos de la creación de la tarea
        name = data.get("name", None)
        date = data.get("date", None)
        description = data.get("description", None)
        state = data.get("state", None)
        place = data.get("place", None)
        start_time = data.get("start_time", None)
        end_time = data.get("end_time", None)

        if name is None and date is None and start_time is None and end_time is None and description is None and place is None and state is None:
            error_422 = True
            abort(422)

        task = Tasks.query.filter_by(
            user_id=current_user["id"],
            id=task_id
        ).one_or_none()

        if task is None:
            error_404 = True
            abort(404)

        if state is not None:
            task.estado = state

        if name is not None:
            task.tarea = name

        if date is not None:
            task.fecha = date

        if description is not None:
            task.descripcion = description

        if place is not None:
            task.lugar = place

        if start_time is not None:
            task.hora_inicio = start_time

        if end_time is not None:
            task.hora_final = end_time

        # print(task)

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

@app.route("/category", methods=['POST'])
@jwt_required()
def create_category():
    error_406 = False
    error_422 = False
    try:
        data = request.get_json()
        name = data.get('name', None)

        if name is None:
            error_422 = True
            abort(422)

        current_user = get_jwt_identity()

        category = Categories(
            user_id=current_user['id'],
            nombre=name
        )
        result = category.insert()
        if result == -1:
            error_406 = True
            abs(406)

        category = Categories.get_category_by_id(result)

        return jsonify({
            'success': True,
            'created': category.format()
        })
    except Exception as e:
        print(e)
        if error_406:
            abort(406)
        elif error_422:
            abort(422)
        else:
            abort(500)

# Unitario por ahora pero creo q seria mejor en conjunto
@app.route("/task/<task_id>/category", methods=['POST'])
@jwt_required()
def asignar_categoria(task_id):
    error_404 = False
    error_406 = False
    error_422 = False
    try:
        task = Tasks.get_task_by_id(task_id)
        if task is None:
            error_404 = True
            abort(404)

        data = request.get_json()

        category_id = data.get("category_id", None)
        if category_id is None:
            error_422 = True
            abort(422)

        category_task = Categories_Tasks(
            category_id=category_id,
            task_id=task_id
        )

        result = category_task.insert()
        if result == -1:
            error_406 = True
            abort(406)

        category_task = Categories_Tasks.get_category_task_by_ids(category_id, task_id)

        return jsonify({
            'success': True,
            'created': category_task.format()
        })
    except Exception as e:
        print(e)
        if error_404:
            abort(404)
        elif error_406:
            abort(406)
        elif error_422:
            abort(422)
        else:
            abort(500)

@app.route("/categories", methods=['GET'])
@jwt_required()
def get_categories():
    try:
        current_user = get_jwt_identity()

        categories = Categories.get_categories_by_user(current_user["id"])
        categories = [p.format() for p in categories]

        return jsonify({
            'success': True,
            'categories': categories
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
