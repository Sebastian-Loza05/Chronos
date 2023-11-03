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
        return jsonify({
        'success': True
        })

    except Exception as e:
        print(e)
        if error_406:
            abort(406)
        elif error_422:
            abort(422)
        else:
            abort(500)