import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, { useState, useEffect } from "react";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getTasksDate } from "../../app/api";
import { createTask } from "../../app/api";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function HeaderMes() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dia, setDia] = useState("");
  const [State, setState] = useState("");

  async function loadFonts() {
    await Font.loadAsync({
      Gabarito: require("../../assets/fonts/Gabarito-VariableFont_wght.ttf"),
    });
  }

  useEffect(() => {
    async function loadData() {
      await loadFonts();
    }

    loadData();
  }, []);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const onSelectOption = (option) => {
    console.log(`${option} Selected`);
    if (option === "Day"){
      router.push("/calendar/dia");
    }
    toggleModal();
  };
  const handleCloseModal = () => {
    setmodalVisible(false);
  };

  const DateModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalContainer}>
        {["Day", "Month"].map((option) => (
          <TouchableOpacity key={option} onPress={() => onSelectOption(option)}>
            <Text style={styles.modalText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
  return (
    <View style={styles.container}>
      <View style={styles.greetingHeader}>
        <TouchableOpacity onPress={toggleModal} style={styles.buttonlist}>
          <Icon name="list" size={18} color="#c96878" />
          <Text style={styles.text}>Month</Text>
        </TouchableOpacity>
        <DateModal />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 5,
  },
  greetingHeader: {
    padding: 18,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "right",
    height: 100,
  },
  buttonlist: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 4,
  },
  text: {
    fontSize: 18,
    //fontWeight: 'bold',
    color: "#c96878",
    right: -5,
  },
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "40%",
    backgroundColor: "rgba(250,250,250,0.7)",
  },
  modalText: {
    fontSize: 18,
    color: "#982C40",
    padding: 10,
    borderTopWidth: 1,
  },
});
