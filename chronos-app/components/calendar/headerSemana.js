import {View, StyleSheet, Text, TouchableOpacity, Modal} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, {useState} from 'react';
import  AppLoading  from 'expo-app-loading';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';




export default function HeaderSemana() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    async function loadFonts() {
        await Font.loadAsync({
            'Gabarito': require('../../assets/fonts/Gabarito-VariableFont_wght.ttf'),
            //'../assets/fonts/Gabarito-VariableFont_wght.ttf'
        });
    }

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
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.greetingSubtitle}>Task</Text>
          </View>
          </View>
      );
}

const styles = StyleSheet.create({
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
    },
    button: {
      backgroundColor: '#ffffff',
      borderRadius: 25,
      padding: 6,
      marginLeft: 10,
      borderColor: "#982C40",
      borderWidth: 2, //cambiar a 3 en caso pidan
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
  