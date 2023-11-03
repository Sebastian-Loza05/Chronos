import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
import Icon from "react-native-vector-icons/FontAwesome5";
import { sendAudio } from '../../app/api';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';


export default function Voice({setSuggestionsOpen}) {
  const [recording, setRecording] = useState(false);

  const onMicrophonePress = () => {
    startRecording(true);
    setSuggestionsOpen(false);
    setTimeout(() => {
      setRecording(false);
    }, 3000);
  };

  const startRecording = async () => {
    try {
      console.log("Requesting Permissions");;
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    }
    catch (err){
      console.error("Failed to start recording ", err);
    }
  }

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    await manageAudio(uri);
  }

  const manageAudio = async (audioUri) => {
    const audioFile = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64
    })

    const formData = new FormData();
    // formData.append('audio', audioUri);
    const filetype = audioUri.split(".").pop();
    const filename = audioUri.split("/").pop();
    console.log("type: ", filetype, "name: ", filename);
    const audio = {
      uri: audioUri,
      type: `audio/${filetype}`,
      name: filename
    }
    formData.append('audio', audio);

    const data = await sendAudio(formData);
    if (data?.msg){
      router.replace("/auth/login")
    }
    console.log(data);
  }

  function MicrophoneAnimation() {
    return (
      <LottieView
        style={styles.animation}
        source={require('../../assets/animations/voz.json')}
        autoPlay
        loop
      />
    );
  }

  return (
    <View>
      {false && <MicrophoneAnimation/>}
      <TouchableOpacity style={styles.button} onPress={recording ? stopRecording : startRecording}>
        <Icon name="microphone-alt" size={28} color="#982C40"/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f8c1c1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginTop: 20,
    top:-40,
    alignSelf: 'center',
  },

  animation: {
    width: 270,
    height: 270,
    position: 'absolute',
    zIndex: 10,
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -190 },
      { translateY: -142 },
    ],
  },
})
