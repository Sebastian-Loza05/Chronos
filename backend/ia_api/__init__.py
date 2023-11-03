from flask import (
    Flask,
    request,
    jsonify,
    abort
)
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity
)
from decouple import config
from models import Users, setup_db, Tasks
from datetime import timedelta
from werkzeug.utils import secure_filename

from transcribe import speech_to_text
from chronos import User

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

# ----------------------------------------------------------------
@app.route("/voice/recomendations", methods=["POST"])
@jwt_required()
def voice_recomendations():
    error_406 = False
    error_422 = False
    try:
        if 'audio' not in request.files:
            error_406 = True
            abort(406)

        audio_file = request.files['audio']

        if not audio_file:
            error_422 = True
            abort(422)

        audio_file.save('uploads/audio.wav')

        text = speech_to_text('uploads/audio.wav')

        horario = [
            "03/11/2023 00:00 - 08:00: duermo",
            "03/11/2023 08:00 - 08:30: desayuno",
            "03/11/2023 08:30 - 09:30 Pasear al perro",
            "03/11/2023 09:00 - 11:00: Clases de algoritmos",
            "03/11/2023 16:00 - 18:00: Clases de Machine Learning"
        ]

        user = User(horario)
        response = user.make_request(text)

        return jsonify({
            'success': True,
            'response': response
        })

    except Exception as e:
        print(e)
        if error_406:
            abort(406)
        elif error_422:
            abort(422)
        else:
            abort(500)