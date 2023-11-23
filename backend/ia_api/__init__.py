import ffmpeg
import json
import os
from flask import (
    Flask,
    request,
    jsonify,
    abort,
    send_file,
    make_response
)
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity
)
from decouple import config
from models import Users, setup_db, Tasks, Settings
from datetime import timedelta
# from werkzeug.utils import secure_filename

from chronos import Chronos, behavior

from datetime import datetime

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

def actualizarBd(response, user_id):
    if response["accion"] == "agendó":
        new_task = Tasks(
            user_id=user_id,
            nombre=response['nombre'],
            fecha=response['fecha'],
            hora_inicio=response['hora_inicio'],
            hora_final=response['hora_final']
        )
        new_task.insert()
    elif response["accion"] == "actualizó":
        id = response["id"]
        tarea = Tasks.get_task_by_id(id, user_id)
        tarea.nombre = response["nombre"]
        tarea.date = response["fecha"]
        tarea.hora_inicio = response["hora_inicio"]
        tarea.hora_final = response["hora_final"]

        tarea.update()
    elif response["accion"] == "eliminó":
        tarea = Tasks.get_task_by_id(
            response["id"],
            user_id
        )
        tarea.delete()


# Instanciamiento de chronos
chronos = Chronos("gpt-3.5-turbo", behavior)
# ----------------------------------------------------------------
@app.route("/voice/recomendations", methods=["POST"])
@jwt_required()
def voice_recomendations():
    error_406 = False
    error_422 = False
    output_file = "uploads/audio.wav"
    try:
        current_user = get_jwt_identity()
        if 'audio' not in request.files:
            print("asbfakfab")
            error_406 = True
            abort(406)

        audio_file = request.files['audio']

        if not audio_file:
            error_422 = True
            abort(422)
        print(audio_file.filename)
        save_file = f'uploads/{audio_file.filename}'
        audio_file.save(save_file)
        ffmpeg.input(save_file).output(output_file).run()
        os.remove(save_file)

        # ! Actualmente jala la del dia actual, puede estar a variacion mas adelante
        fecha = datetime.now()
        fecha = fecha.strftime('%Y-%m-%d')
        current_user = get_jwt_identity()
        horario = Tasks.get_tasks_by_user_by_date(current_user["id"], fecha)
        horario = [p.format_ia() for p in horario]

        print(horario)
        speech = chronos.listen_to(output_file)
        response = chronos.process_request(horario, speech)

        if os.path.exists("../uploads/response.mp3"):
            os.remove("../uploads/response.mp3")

        # ! Cambiar por la voz de chronos
        # settings = Settings.get_by_user_id(current_user["id"])
        # chronos.change_voice(settings.voice)

        # ! Si quieren probar sin azure tts
        chronos.make_response_speech_without_azure(response)

        # chronos.make_response_speech(response)
        confirmation = chronos.parse_response(response)
        print(confirmation)

        if confirmation is not None:
            actualizarBd(confirmation, current_user["id"])

        print(response)
        os.remove(output_file)
        response = send_file(
            "../uploads/response.mp3",
            mimetype="audio/mp3",
            download_name="response.mp3")

        return response

    except Exception as e:
        print(e)
        if error_406:
            abort(406)
        elif error_422:
            abort(422)
        else:
            abort(500)

@app.route("/voice/change", methods=["PATCH"])
@jwt_required()
def change_voice():
    error_406 = False
    error_422 = False
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        codigo = data["codigo"]
        if codigo is None:
            error_422 = True
            abort(422)

        configuration = Settings.get_by_user_id(current_user["id"])
        configuration.voice = codigo
        configuration_id = configuration.update()
        if configuration_id == -1:
            error_406 = True
            abort(406)
        return jsonify({
            'success': True,
            'voz': configuration.format()
        })
    except Exception as e:
        print(e)
        if error_406:
            abort(406)
        elif error_422:
            abort(422)
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
