# import openai
import datetime
import pyttsx3
import speech_recognition as sr
from openai import OpenAI
from decouple import config
import re
from transcribe import text_to_speech

client = OpenAI(
    api_key=config('OPENAI_API_KEY')
)

# ¡Hola! Soy Chronos, tu asistente de calendario. ¿En qué puedo ayudarte hoy?
class Chronos:

    def __init__(self, model, behavior):
        self.model = model
        self.behavior = behavior
        self.today = datetime.date.today().strftime("%d/%m/%Y")
        self.speech_file = "uploads/response.mp3"

        self.engine = pyttsx3.init()
        voices = self.engine.getProperty('voices')
        self.engine.setProperty('rate', 120)
        self.engine.setProperty("voice", voices[3].id)

        self.messages = [{"role": "assistant", "content": self.behavior + self.today}]

        chat = client.chat.completions.create(
            model=self.model,
            messages=self.messages,
            temperature=1,
            max_tokens=256,
        )

        reply = chat.choices[0].message.content
        # self.engine.say(reply)
        print(f"Chronos: {reply}")

        self.engine.runAndWait()

    def get_completion(self, prompt):
        self.messages.append({"role": "user", "content": prompt})
        chat = client.chat.completions.create(
            model=self.model,
            messages=self.messages,
            temperature=1,
            max_tokens=256,
        )
        reply = chat.choices[0].message.content
        self.messages.append({"role": "assistant", "content": reply})
        return reply

    def make_response_speech(self, response):
        text_to_speech(response)

    def listen_to(self, filename):
        r = sr.Recognizer()
        message = "te escucho"
        with sr.AudioFile(filename) as source:
            # self.engine.say(message)
            print(f"Chronos: {message}")

            audio = r.listen(source)

            try:
                speech = r.recognize_google(audio, language="es-PE")
                print(f"Tú: {speech}")
            except sr.UnknownValueError:
                message = "Lo siento, no pude entender lo que dijiste"
                self.engine.say(message)
                print(f"Chronos: {message}")
            except sr.RequestError as e:
                message = f"No se pudieron solicitar resultados del servicio de reconocimiento de voz de Google: {e}"
                self.engine.say(message)
                print(f"Chronos: {message}")
            self.engine.runAndWait()

        return speech

    def process_request(self, horario, speech):
        horario = '\n'.join(horario)
        prompt = f"Horario:\n{horario}\nspeech: {speech}"
        response = self.get_completion(prompt)
        return response

    def parse_response(self, response):
        agendar  = r"""(.*)agendó exitosamente(.*)
nombre: (.+)
fecha: (.+)
hora: (\d{2}:\d{2}) - (\d{2}:\d{2})(.*)"""

        actualizar_eliminar = r"""(.*)(actualizó|eliminó) exitosamente(.*)
id: (\d+)
nombre: (.+)
fecha: (.+)
hora: (\d{2}:\d{2}) - (\d{2}:\d{2})(.*)"""

        match_agendar = re.search(agendar, response, re.DOTALL)
        match_actualizar_eliminar = re.search(actualizar_eliminar, response, re.DOTALL)

        id_tarea = None
        if match_agendar:
            accion = "agendó"
            nombre = match_agendar.group(3)
            fecha = match_agendar.group(4)
            hora_inicio = match_agendar.group(5)
            hora_final = match_agendar.group(6)
        elif match_actualizar_eliminar:
            accion = match_actualizar_eliminar.group(2)
            id_tarea = int(match_actualizar_eliminar.group(4))
            nombre = match_actualizar_eliminar.group(5)
            fecha = match_actualizar_eliminar.group(6)
            hora_inicio = match_actualizar_eliminar.group(7)
            hora_final = match_actualizar_eliminar.group(8)
        else:
            return None
        tarea_dict = {
            "accion": accion,
            "nombre": nombre,
            "fecha": fecha,
            "hora_inicio": hora_inicio,
            "hora_final": hora_final
        }

        if accion != "agendó":
            tarea_dict["id"] = id_tarea

        return tarea_dict

class User:
    def __init__(self, horario):
        self.fecha = datetime.date.today().strftime("%d/%m/%Y")
        self.horario = horario
        self.chronos = Chronos("gpt-3.5-turbo")

    def make_request(self, speech):
        response = self.chronos.get_suggestion(self.fecha, self.horario, speech)
        print(f"Chronos: {response}")
        print("¿Deseas insertar esta actividad en tu horario?")
        answer = input()
        if answer == "si":
            self.horario.append(response)
        return response

    def get_horario(self):
        return self.horario

    def parse_response(self, response):

        lines = response.strip().split("\n")
        key, value = map(str.strip, lines[0].split(":", 1))

        if key != "Tipo" or value not in ["crear", "eliminar", "actualizar"]:
            return None

        result = {}

        for line in lines:
            key, value = map(str.strip, line.split(":", 1))

            if key == "Tipo":
                result["request"] = value
            elif key == "Actividad":
                result["name"] = value
            elif key == "Fecha":
                result["date"] = value
            elif key == "Hora":
                start_time, end_time = map(str.strip, value.split("-"))
                result["start_time"] = start_time
                result["end_time"] = end_time
        return result

# Chat gpt-3.5-turbo model as Chronos
# Chronos debe tener acceso a ciertos datos del usuario como su horario

behavior = """
Desde ahora vas a actuar como un sugeridor de horarios llamado 'Chronos'.
Yo te voy a dar una petición y un horario (lista de actividades de la forma: '<id> <fecha> <hora>: <nombre de la actividad>').
Tus respuestas deben ser cortas y precisas. 
Debes reconocer lo que está queriendo pedir el usuarios, casos:
- Añadir o agendar una o varias actividad
	- Una actividad tiene nombre y rango de tiempo.
	- Debp especificar ambos atributos sino DEBES preguntar por el dato faltante.
- Eliminar una o varias actividades
	- Verificar si la actividad existe sino rechazar la petición.
- Actualizar una o varias actividades
	- Verificar si la actividad o actividades existen sino rechazar la petición.
    - Si no te proporciona un dato de actualización de la tarea pedir más información.
- Sugerencia sobre el horario de una actividad propuesta por mi.
	- Debes preguntar si yo estoy de acuerdo con la sugerencia. Si lo está, agrega la tarea. 
- Si no identificas ningún caso no aceptes la petición. 
Una vez que comfirmes mi acción DEBES responder con el siguiente formato ejemplo, todo en minúscula:
Se agendó/eliminó/actualizó exitosamente la siguiente tarea: 
nombre: <nombre de la actividad>
fecha: <fecha>
hora: <hora>
Utiliza siempre un solo salto de linea.
SI Y SOLO SI la acción es eliminar o actualizar muestra el id de la tarea arriba de nombre (id: <id de la actividad>).
Por favor sigue el formato al pie de la letra.
Chronos, ten en cuenta que hoy estamos: """
# Se agendó/eliminó/actualizó exitosamente la siguiente tarea:
# Nombre: hacer ejercicio
# Fecha: 10/11/2023
# Hora: 15:00 - 16:00
