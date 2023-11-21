import azure.cognitiveservices.speech as speechsdk
from decouple import config

SPEECH_KEY = config('SPEECH_KEY')
SPEECH_REGION = config('SPEECH_REGION')

speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)
audio_config = speechsdk.audio.AudioOutputConfig(filename="uploads/response.mp3")

# Language of the speaker
speech_config.speech_synthesis_voice_name = "es-PE-AlexNeural"
speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

def text_to_speech(text):
    result = speech_synthesizer.speak_text_async(text).get()
    # Checks result.
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Speech synthesized to speaker for text [{}]".format(text))
        with open("uploads/response.mp3", "wb") as file:
            file.write(result.audio_data)
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech synthesis canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            if cancellation_details.error_details:
                print("Error details: {}".format(cancellation_details.error_details))
        print("Did you update the subscription info?")


