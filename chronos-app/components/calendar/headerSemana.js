import {View, StyleSheet, Text, TouchableOpacity, Modal} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, {useState, useEffect} from 'react';
import  AppLoading  from 'expo-app-loading';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';



export default function HeaderSemana() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    async function loadFonts() {
        await Font.loadAsync({
            'Gabarito': require('../../assets/fonts/Gabarito-VariableFont_wght.ttf'),
            //'../assets/fonts/Gabarito-VariableFont_wght.ttf'
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
        console.log('Add Task Pressed');
    };

    const onMicrophonePress = () => {
        setIsRecording(true);
        setTimeout(() => {
            setIsRecording(false);
        }, 20000);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const onSelectOption = (option) => {
        console.log(`${option} Selected`);
        toggleModal();
    };

    const DateModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                {['Day', 'Week', 'Month'].map(option => (
                    <TouchableOpacity key={option} onPress={() => onSelectOption(option)}>
                        <Text style={styles.modalText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Modal>
    );

    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    let greeting = "Good Morning!";

    if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good Afternoon!";
    } else if (currentHour >= 18 || currentHour < 6) {
        greeting = "Good Evening!";
    }

    function MicrophoneAnimation() {
        return (
            <LottieView
                style={styles.animationExpanded}
                source={require('../../assets/animations/voz.json')}
                autoPlay
                loop
            />
        );
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
          <View style={styles.greetingHeader}>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.text}>Weekend</Text>
            </TouchableOpacity>
            <DateModal />
            <View style={styles.prueba}>
              <View style={styles.weekendContainer}> 
                <Text style={styles.greetingTitle}>Weekend</Text>
                <View style={styles.taskHeader}>
                  <View style={styles.buttonsContainer}>
                    {isRecording && <MicrophoneAnimation />}
                    <TouchableOpacity style={styles.button} onPress={onMicrophonePress}>
                      <Icon name="microphone-alt" size={30} color="#982C40" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onAddTaskPress}>
                      <Icon name="plus-circle" size={30} color="#982C40" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
                        <Icon name="calendar-alt" size={28} color="#982C40"/>
                    </TouchableOpacity>
                  </View>
                </View>
                <Modal
                visible={show}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShow(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalMessageContainer}>
                        <Text style={styles.modalMessage}>Escoge una fecha:</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    </View>
                </View>
            </Modal>
              </View>
            </View>
            <Text style={styles.greetingSubtitle}>Task</Text>
          </View>
          </View>
      );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent'
    },
    modalMessageContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 10,
        right:-10,
        fontFamily:'Gabarito',
        color: "#982C40",
    },
    prueba:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: -10,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      width: '100%',
      paddingTop: 25,
    },
    greetingHeader: {
      padding: 15,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'right', // Esto debe ser 'flex-end' en lugar de 'right'
      height: 150,
    },
    greetingTitle: {
      fontSize: 40,
      color: "#982C40",
      paddingTop: 10,
      paddingBottom: 10,
      fontWeight: 'bold',
      marginRight: 59, // Agregar margen izquierdo
    },
    greetingSubtitle: {
      fontSize: 40,
      fontWeight: 'bold',
      color: "#982C40",
      marginTop: -15,
    },
    weekendContainer: {
        flexDirection: 'row',
        alignItems: 'center',

      },
      
    taskHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#ffffff',
      height: 100,
    },
    buttonsContainer: {
      flexDirection: 'row',
      marginLeft: -46,
    },
    button: {
      backgroundColor: '#ffffff',
      borderRadius:25,
      padding: 6,
      marginLeft: 8,
      borderColor: "#982C40",
      borderWidth: 3, //cambiar a 3 en caso pidan
    },
    title: {
      fontSize: 45,
      fontWeight: 'bold',
      color: "#982C40",
      fontFamily: "Gabarito",
      paddingTop: 10,
    },
    text: {
      fontSize: 18,
      color: "#c96878",
      marginTop:-10,
    },
    modalContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
      width: '40%',
      backgroundColor: 'rgba(250,250,250,0.7)',
    },
    modalText: {
      fontSize: 18,
      color: "#982C40",
      padding: 10,
      borderTopWidth: 1,
    },
    animationExpanded: {
      width: 400,
      height: 400,
      position: 'absolute',
      top: -35,
      left: -85,
      zIndex: 1,
    },
  });
  