import React, { useState } from "react";
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
import { sendAudio } from "../../app/api";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system";

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

  const startRecording = async () => {
    setSuggestionsOpen(false);
    setModalVisible(true);
    try {
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
    } catch (err) {
      console.error("Failed to start recording ", err);
    }
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
    console.log("json: ", jsonData);
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
        if (!status.isPlaying)
          await sound.unloadAsync();
      }
    }
    else if (Platform.OS === 'ios') {
      const {sound, status } = await Audio.Sound.createAsync(
        require("../../assets/audios/response.mp3"),
        { shouldPlay: true }
      );

      await sound.playAsync();
      if (!status.isPlaying){
        console.log("Paró audio");
      }
      else 
        console.log("Reproduciendo");
    }
  }


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
      <TouchableOpacity style={styles.button} onPress={startRecording}>
        <Icon name="microphone-alt" size={28} color="#982C40" />
      </TouchableOpacity>
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

  button: {
    backgroundColor: "#f8c1c1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginTop: 20,
    top: -40,
    alignSelf: "center",
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
