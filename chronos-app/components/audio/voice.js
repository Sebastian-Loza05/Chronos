import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome5";
import { sendAudio, fetchUserProfile } from "../../app/api";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system";
import * as Speech from 'expo-speech';

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

function MicrophoneAnimation() {
  return (
    <LottieView
      style={styles.animation}
      source={require("../../assets/animations/voz.json")}
      autoPlay
      loop
    />
  );
}

export default function Voice({ setSuggestionsOpen }) {
  const [recording, setRecording] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const speak = async () => {
      const user = await fetchUserProfile();
      const thingToSay = `Hola ${user.profile.nombre}`;
      //Speech.speak(thingToSay);
    }

    speak();
  }, [])

  const startRecording = async () => {
    setSuggestionsOpen(false);
    try {
      if (sound === null) {
        console.log(sound);
        setModalVisible(true);
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        console.log("Starting recording..");
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
        );
        setRecording(recording);
        console.log("Recording started");
      }
    } catch (err) {
      console.error("Failed to start recording ", err);
    }
  };

  const pauseAudio = async () => {
    await sound.unloadAsync();
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    setRecording(false);
    setModalVisible(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    await manageAudio(uri);
  };

  const manageAudio = async (audioUri) => {
    const formData = new FormData();
    const filetype = audioUri.split(".").pop();
    const filename = audioUri.split("/").pop();
    const audio = {
      uri: audioUri,
      type: `audio/${filetype}`,
      name: filename,
    };

    const data = {
      success: "true"
    }
    formData.append("audio", audio);
    formData.append("json", JSON.stringify(data));

    const  speech = await sendAudio(formData);
    if (speech?.msg){
      router.replace("/auth/login")
    }
    if (Platform.OS === "android") {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(speech);
      fileReader.onload = async () => {
        const base64data = fileReader.result;
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: base64data },
          { shouldPlay: true }
        );
        await sound.playAsync();
        setSound(sound);
        if (!status.isPlaying){
          console.log("Is not playing");
          await sound.unloadAsync();
        }
      }
    }
    else if (Platform.OS === 'ios') {
// Configura el modo de audio para usar el altavoz principal
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });

      const fileReader = new FileReader();
      fileReader.readAsDataURL(speech);
      fileReader.onload = async () => {
        const base64data = fileReader.result;
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: base64data },
          { shouldPlay: true }
        );
        await sound.playAsync();
        if (!status.isPlaying)
          await sound.unloadAsync();
      }
    }
  }

  useEffect(() => {
    const checkStatusAudio = async () => {
      if(sound) {
        const status = await sound.getStatusAsync();

        if (status.isPlaying){
          console.log("Is playing");
        } else {
          console.log("Is not playing");
          setSound(null);
        }
      }
    };

    const interval = setInterval(() => {
      checkStatusAudio();
    }, 1000);

    return () => clearInterval(interval);
  }, [sound]);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={70} style={styles.modal}>
          <MicrophoneAnimation />
          <TouchableOpacity style={styles.button_stop} onPress={stopRecording}>
            <Icon name="stop" size={23} color="#982C40" />
          </TouchableOpacity>
        </BlurView>
      </Modal>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={startRecording}>
          <Icon name="microphone-alt" size={28} color="#982C40" />
        </TouchableOpacity>
        { sound && (
          <TouchableOpacity style={styles.button1} onPress={pauseAudio}>
            <Icon name="pause" size={21} color="#982C40" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
  },

  button: {
    backgroundColor: "#f8c1c1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginTop: 20,
    top: -40,
    alignSelf: "center",
    marginRight: "2%"
  },

  button1: {
    backgroundColor: "#f8c1c1",
    paddingHorizontal: 20,
    paddingTop: "11%",
    borderRadius: 40,
    marginTop: 20,
    height: '68%',
    maxHeight: "68%",
    top: -40,
    alignSelf: "center",
    marginLeft: "2%"
  },

  button_stop: {
    backgroundColor: "#f8c1c1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginTop: "38%",
    alignSelf: "center",
  },

  animation: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
