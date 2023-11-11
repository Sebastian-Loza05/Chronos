import openai
import datetime
import pyttsx3
import speech_recognition as sr

openai.api_key = "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"        

# ¡Hola! Soy Chronos, tu asistente de calendario. ¿En qué puedo ayudarte hoy?
class Chronos:
    
    def __init__(self, model, behavior):
        self.model = model
        self.behavior = behavior
        self.today = datetime.date.today().strftime("%d/%m/%Y")
    
        self.engine = pyttsx3.init()
        voices = self.engine.getProperty('voices')
        self.engine.setProperty('rate', 120)
        self.engine.setProperty("voice", voices[2].id)

        self.messages = [{"role": "assistant", "content": self.behavior + self.today}]

        chat = openai.ChatCompletion.create(
            model = self.model,
            messages = self.messages,
            temperature = 1,
            max_tokens = 256,
        )

        reply = chat.choices[0].message["content"]
        self.engine.say(reply)
        print(f"Chronos: {reply}")

        self.engine.runAndWait()

    def get_completion(self, prompt):
        self.messages.append({"role": "user", "content": prompt})
        chat = openai.ChatCompletion.create(
            model = self.model,
            messages = self.messages,
            temperature = 1,
            max_tokens = 256,
        )
        reply = chat.choices[0].message.content
        self.messages.append({"role": "assistant", "content": reply})
        return reply

    def listen_to(self, filename):
        r = sr.Recognizer()
        message = "te escucho"
        with sr.AudioFile(filename) as source:
            self.engine.say(message)
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


# Chat gpt-3.5-turbo model as Chronos
# Chronos debe tener acceso a ciertos datos del usuario como su horario

behavior = """
Desde ahora vas a actuar como un sugeridor de horarios llamado 'Chronos'. De entrada tendrás una petición y un horario. Tus respuestas deben ser mas o menos cortas y precisas. Debes poder identificar lo que está queriendo pedir el usuario, tenemos los siguientes casos:
- Añadir o agendar una actividad o varias actividades a su calendario
	- Actividad: nombre y hora
	- Para cada tarea se debe especificar el rango de tiempo y el nombre de la actividad y si no es el caso preguntar por el dato faltante.
- Eliminar una actividad o varias actividades de su calendario
	- Verificar si la actividad existe, si no rechazar la petición con algún mensaje. 
Actualizar una actividad o varias actividades de su calendario
	- Verificar si la actividad o actividades existen, si no rechazar la petición con algún mensaje. 
- Sugerencia sobre el horario de una actividad propuesta por el usuario.	
	- Debes preguntar si el usuario está de acuerdo con la sugerencia. Si lo está responder de forma afirmativa 
- Si no identificamos ningún caso no aceptes la petición. 
Una vez confirmada la accion del usuario deben responder la confirmacion con el siguiente formato ejemplo: 

Tipo: crear
Actividad: jugar futbol
Fecha: 10/11/2023
Hora: 15:00 - 16:00

Chronos, ten en cuenta que hoy estamos: """
