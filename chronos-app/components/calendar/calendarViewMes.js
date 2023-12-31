import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/FontAwesome5";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import LottieView from "lottie-react-native";
import { createTask, getTasksDate } from "../../app/api";
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get("window");

export default function CalendarViewMes() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [modalVisible, setmodalVisible] = useState(false);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dia, setDia] = useState("");
  const [State, setState] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);




  const getTasksForDay = async (date) => {
    try {
      const data = await getTasksDate({ type_search: 1, begin_date: date });
      if (data.success && Array.isArray(data.tasks)) {
        return data.tasks;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      return [];
    }
  };

  const handleDayPress = async (day) => {
    setSelectedDay(day.dateString);
    setModalVisible(true);
    const tasksForDay = await getTasksForDay(day.dateString);
    setTasks(tasksForDay);
  };
  const handlePressTaskName = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };



  const renderTasksModal = () => {
    if (!selectedDay || !Array.isArray(tasks)) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredViewTaks}>
            <View style={styles.modalViewTaks}>
              <Text style={styles.modalTitle}>Tasks for {selectedDay}</Text>
              <ScrollView style={styles.scrollView}>
                {tasks.map((task, index) => (
                    <TouchableOpacity
                        key={task.id}
                        onPress={() => handlePressTaskName(task.id)}
                        style={[
                          styles.taskContainer,
                          expandedTaskId === task.id && styles.expandedTaskContainer
                        ]}
                    >
                      <Text style={styles.taskText}>{task.name}</Text>
                      {expandedTaskId === task.id && (
                          <View style={styles.taskDetails}>
                            <Text style={styles.taskTextDetail}>Start Time: {task.start_time}</Text>
                            <Text style={styles.taskTextDetail}>End Time: {task.end_time}</Text>
                            <Text style={styles.taskTextDetail}>Place: {task.place}</Text>
                            <Text style={styles.taskTextDetail}>Description: {task.description}</Text>
                          </View>
                      )}
                    </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    );
  };

  async function loadFonts() {
    await Font.loadAsync({
      Gabarito: require("../../assets/fonts/Gabarito-VariableFont_wght.ttf"),
    });
  }

  useEffect(() => {
    // Cargar fuentes y otros recursos
    async function loadData() {
      await loadFonts();
      // Puedes agregar más carga de recursos aquí si es necesario
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
  const onAddTaskPress = () => {
    setmodalVisible(true);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onSelectOption = (option) => {
    console.log(`${option} Selected`);
    toggleModal();
  };
  const onDateChange = (event, selectedDate) => {
    setDatePickerVisibility(Platform.OS === "ios");
    if (selectedDate) {
      setDatePickerVisibility(false);
      setSelectedDate(selectedDate);
      const offset = selectedDate.getTimezoneOffset() * 60000;
      const localDate = new Date(selectedDate.getTime() - offset);
      const formattedDate = localDate.toISOString().split("T")[0]; // Formato 'yyyy-mm-dd'
      setDia(formattedDate);
    } else {
      setDatePickerVisibility(false);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setTimePickerVisibility(Platform.OS === "ios");
    if (Platform.OS === "android") {
      setTimePickerVisibility(false);
    }
    if (selectedTime) {
      setTimePickerVisibility(false);
      setSelectedTime(selectedTime);
      let hours = selectedTime.getHours().toString().padStart(2, "0");
      let minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      let formattedTime = `${hours}:${minutes}`;

      setStartTime(formattedTime);
    } else {
      setTimePickerVisibility(false);
    }
  };
  const onEndTimeChange = (event, selectedTime) => {
    setEndTimePickerVisibility(Platform.OS === "ios");
    if (Platform.OS === "android") {
      setEndTimePickerVisibility(false);
    }
    if (selectedTime) {
      setEndTimePickerVisibility(false);
      setSelectedEndTime(selectedTime);
      let hours = selectedTime.getHours().toString().padStart(2, "0");
      let minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      let formattedTime = `${hours}:${minutes}`;

      setEndTime(formattedTime);
    } else {
      setEndTimePickerVisibility(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const onChange = async (event, selectedDate) => {
    console.log(selectedDate);
    const currentDate = selectedDate || date;
    setShow(false);
    const formattedDate = selectedDate.toDateString();
    console.log("dia: ", formattedDate);
    const body = {
      type_search: 1,
      begin_date: formattedDate,
    };
    const dataTasks = await getTasksDate(body);
    if (data.success) setTasks(dataTasks.tasks);
  };
  const handleCloseModal = () => {
    setmodalVisible(false);
  };
  const handleSaveTask = async () => {
    if (!name.trim()) {
      alert("Por favor, ingrese el nombre de la tarea.");
      return;
    }
    if (!dia.trim()) {
      alert("Por favor, ingrese la fecha de la tarea.");
      return;
    }
    if (!startTime.trim()) {
      alert("Por favor, ingrese la hora de inicio de la tarea.");
      return;
    }
    if (!endTime.trim()) {
      alert("Por favor, ingrese la hora de finalización de la tarea.");
      return;
    }

    const formData = {
      name: name.trim(),
      place: place.trim(),
      description: description.trim(),
      state: State.trim(),
      date: dia.trim(),
      start_time: startTime.trim(),
      end_time: endTime.trim(),
    };

    try {
      const data = await createTask(formData);
      console.log("Success:", data);
      setModalVisible(false);
      setName("");
      setPlace("");
      setDescription("");
      setDia("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la tarea. Por favor, intente de nuevo.");
    }
  };

  return (
      <View style={styles.container}>
        <Calendar
            style={styles.calendar}
            onDayPress={handleDayPress}
            // Personaliza los colores
            theme={{
              backgroundColor: "#FFFFFF",
              calendarBackground: "#ffffff",
              monthTextColor: "#982C40",
              dayTextColor: "#000000",
              textDisabledColor: "#969696",
              selectedDayBackgroundColor: "#ff005e",
              selectedDayTextColor: "#be2727",
              arrowColor: "#982C40",
              textDayFontFamily: "Gabarito",
              textMonthFontFamily: "Gabarito",
              textDayHeaderFontFamily: "Gabarito",
              textDayFontSize: 16,
              textMonthFontSize: 26,
              textDayHeaderFontSize: 16,
              todayTextColor: "#be2727",
              todayBackgroundColor: "#ffdcdc",
              headerStyle: {
                backgroundColor: "#ffffff",
              },
              "stylesheet.day.basic": {
                base: {
                  width: width / 6,
                  height: (height - 200) / 7,
                  alignItems: "center",
                  justifyContent: "center",
                },
              },
              "stylesheet.calendar.header": {
                week: {
                  marginTop: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              },
            }}
        />
        {renderTasksModal()}
        <TouchableOpacity
            onPress={onAddTaskPress}
            style={styles.fab}
            activeOpacity={0.7}
        >
          <Icon name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
        >
          <View style={styles.modalView}>
            <TextInput
                style={styles.input}
                placeholder="Task Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Date"
                value={dia}
                onChangeText={setDia}
                onFocus={showDatePicker}
                editable={!isDatePickerVisible}
            />
            {isDatePickerVisible && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Start Time"
                value={startTime}
                onChangeText={setStartTime}
                onFocus={showTimePicker}
                editable={!isTimePickerVisible}
            />

            {isTimePickerVisible && (
                <RNDateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                    onTouchCancel={() => setTimePickerVisibility(false)}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="End Time"
                value={endTime}
                onChangeText={setEndTime}
                onFocus={showEndTimePicker}
                editable={!isEndTimePickerVisible}
            />

            {isEndTimePickerVisible && (
                <RNDateTimePicker
                    value={selectedEndTime}
                    mode="time"
                    display="default"
                    onChange={onEndTimeChange}
                    onTouchCancel={() => setEndTimePickerVisibility(false)}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Place (Optional)"
                value={place}
                onChangeText={setPlace}
            />
            <TextInput
                style={styles.input}
                placeholder="Description (Optional)"
                value={description}
                onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
              <Text style={styles.textbutton}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
            >
              <Text style={styles.textbutton}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF", // Color de fondo de la vista
  },
  calendar: {
    borderWidth: 0,
    borderColor: "transparent",
    height: height, // Asegúrate de que el calendario use toda la altura disponible
    paddingBottom: 10, // Puedes ajustar esto para que coincida con tu diseño
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#982C40",
    borderRadius: 28,
    elevation: 5, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { height: 2, width: 0 },
  },
  greetingTitle: {
    fontSize: 30,
    color: "#982C40",
    paddingTop: 13,
  },
  greetingSubtitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#982C40",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    marginTop: -26,
  },
  buttonlist: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 9,
    marginLeft: 15,
    borderColor: "#982C40",
    borderWidth: 3,
    top: -40,
    left: 220,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#982C40",
    fontFamily: "Gabarito",
    paddingTop: 10,
  },
  text: {
    fontSize: 18,
    //fontWeight: 'bold',
    color: "#c96878",
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
  animationExpanded: {
    width: 380,
    height: 380,
    position: "absolute",
    top: "-18%",
    left: "-1%",
    zIndex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  modalMessageContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 10,
    right: -10,
    fontFamily: "Gabarito",
    color: "#982C40",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ffedf1",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    top: "15%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "88%",
    height: "53%",
  },
  input: {
    width: "75%",
    padding: 6,
    margin: 10,
    borderWidth: 2,
    borderColor: "#982C40",
    borderRadius: 15,
    backgroundColor: "#ffffff",
    fontFamily: "Gabarito",
  },
  saveButton: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 5,
    marginLeft: 15,
    borderColor: "#982C40",
    borderWidth: 2,
    top: -6,
    left: -92,
    marginBottom: 10,
    marginTop: 15,
    fontFamily: "Gabarito",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 5,
    marginLeft: 15,
    borderColor: "#982C40",
    borderWidth: 2,
    top: -42,
    left: 75,
  },
  textbutton: {
    fontSize: 13,
    fontFamily: "Gabarito",
    color: "#982C40",
  },
  centeredViewTaks: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalViewTaks: {
    margin: 20,
    backgroundColor: "#fcd9d9",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 200, // Tamaño mínimo del modal
    maxHeight: '60%', // Tamaño máximo del modal
  },

  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily:'Gabarito'
  },
  scrollView: {
    width: '100%',
  },
  taskContainer: {
    backgroundColor: "#ee3e3e",
    padding: 15,
    borderRadius: 5,
    marginBottom: 12,
  },
  taskDetails:{
    backgroundColor: "#ee3e3e",
    padding: 10,
    borderRadius: 5,
    height:'auto',
    paddingEnd:20,
    paddingHorizontal:20

  },
  taskText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontFamily:'Gabarito'

  },
  taskTextDetail:{
    fontSize: 12,
    color: "white",
    textAlign: "center",
    fontFamily:'Gabarito'
  },
  closeButton: {
    backgroundColor: "#982C40",
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  expandedTaskContainer: {
    height: 'auto', // o un valor específico mayor que el original
    backgroundColor: '#ee3e3e'
  },
});