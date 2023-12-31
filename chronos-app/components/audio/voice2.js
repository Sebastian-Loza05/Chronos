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

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

export default function Voice({ setSuggestionsOpen }) {
  const [recording, setRecording] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const width = (ScreenWidth * 100) / 100;
  const height = (ScreenHeight * 30) / 100;

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
    formData.append("audio", audio);

    const data = await sendAudio(formData);
    if (data?.msg) {
      router.replace("/auth/login");
    }
    console.log(data);
  };

  function MicrophoneAnimation() {
    return (
      <LottieView
        style={styles.animation}
        source={require("../../assets/animations/voice2.json")}
        autoPlay
        loop
      />
    );
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
    //backgroundColor: "rgba(255,255,255,0.5)",
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
