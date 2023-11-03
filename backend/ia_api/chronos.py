import openai
import datetime

openai.api_key = "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"

# Chat gpt-3.5-turbo model as Chronos
# Chronos debe tener acceso a ciertos datos del usuario como su horario
class Chronos:
    
    def __init__(self, model):
        self.model = model

    def get_completion(self, behavior, prompt):
        response = openai.ChatCompletion.create(
          model=self.model,
          messages=[
            {
              "role": "assistant",
              "content": behavior
            },
            {
              "role": "user",
              "content": prompt,
            }
          ],
          temperature=0.5,
          max_tokens=256,
          top_p=1,
          frequency_penalty=0,
          presence_penalty=0
        )
        return response.choices[0].message["content"]
    
    # Propon una actividad que desees realizar y chronos te sugiere una fecha para realizar esa actividad
    def get_request(self, fecha, actividad, tiempo, horario):
        behavior = """"
          A continuación, vas a actuar como un sugeridor de horarios llamado “Chronos”. 
          Tu tarea es sugerir un horario óptimo para realizar una actividad propuesta por el usuario. 
          Como entrada tendrás los siguientes parámetros:
          \n- Fecha actual\n- Actividad\n- Tiempo de la actividad\n- Horarios bloqueados\n
          Las fechas tiene el siguiente formato:\n<día>/<mes>/<año> <hora-inicio> - <hora-final>: <actividad>\n
          SOLAMENTE debes responder la fecha con el formato dado. 
          NO realices ningún comentario adicional al respecto por favor (<día>/<mes>/<año> <hora-inicio> - <hora-final>: <actividad>).
        """ 
        horario = '\n'.join(horario)
        prompt = f"Fecha actual: {fecha}\nActividad: {actividad}\nTiempo: {tiempo}\nBloqueados:\n{horario}"
        print("Chronos esta pensando...")
        response = self.get_completion(behavior, prompt)
        return response
    
    def get_suggestion(self, fecha, horario, speech):
        behavior = """"
          A continuación, vas a actuar como un sugeridor de horarios llamado “Chronos”. 
          Tu tarea es sugerir un horario óptimo para realizar una actividad propuesta por el usuario. 
          Como entrada tendrás los siguientes parámetros:
          \n- Fecha actual\n- Horarios bloqueados\n- Actividad descrita por el usuario (speech que contiene la actividad y el tiempo)\n
          Las fechas tiene el siguiente formato:\n<día>/<mes>/<año> <hora-inicio> - <hora-final>: <actividad>\n
          SOLAMENTE debes responder la fecha con el formato dado. 
          NO realices ningún comentario adicional al respecto por favor (<día>/<mes>/<año> <hora-inicio> - <hora-final>: <actividad>).
        """ 
        horario = '\n'.join(horario)
        prompt = f"Fecha actual: {fecha}\nHorarios bloqueados:\n{horario}Actividad descrita por el usuario:\n{speech}"
        print("Chronos esta pensando...")
        response = self.get_completion(behavior, prompt)
        return response
    
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