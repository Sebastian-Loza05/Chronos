import pyttsx3
import speech_recognition as sr

# pip install pyttsx3
# pip install SpeechRecognition
# .wav files only (filename)

def speech_to_text(filename):
    r = sr.Recognizer()
    
    with sr.AudioFile(filename) as source:
        print("Chronos: te escucho...")
    
        audio = r.listen(source)
        
        try:
            text = r.recognize_google(audio, language="es-PE")
 
            print(f"Chronos: tu consulta... {text}")
            
            engine = pyttsx3.init()
            engine.runAndWait()
        except sr.UnknownValueError:
            print("Chronos: Lo siento, no pude entender lo que dijiste.")
        except sr.RequestError as e:
            print(f"Chronos: No se pudieron solicitar resultados del servicio de reconocimiento de voz de Google: {e}")
        return text