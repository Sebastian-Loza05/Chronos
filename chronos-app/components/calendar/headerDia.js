import {View, StyleSheet, Text, TouchableOpacity, Modal} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import React, {useState, useEffect} from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import LottieView from 'lottie-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getTasksDate} from "../../app/api";


export default function HeaderDia() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);


    async function loadFonts() {
        await Font.loadAsync({
            'Gabarito': require('../../assets/fonts/Gabarito-VariableFont_wght.ttf'),
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
        }, 10000);
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

    const onChange = async (event, selectedDate) => {
        console.log(selectedDate);
        const currentDate = selectedDate || date;
        setShow(false);
        const formattedDate = selectedDate.toDateString();
        console.log("dia: ", formattedDate);
        const body = {
            type_search: 1,
            begin_date: formattedDate
        }
        const dataTasks = await getTasksDate(body);
        if (data.success)
            setTasks(dataTasks.tasks)
    };


    return (
        <View style={styles.container}>
            <View style={styles.greetingHeader}>
                <TouchableOpacity onPress={toggleModal}>
                    <Text style={styles.text}>Today</Text>
                </TouchableOpacity>
                <DateModal/>
                <Text style={styles.greetingTitle}>{greeting}</Text>
                <Text style={styles.greetingSubtitle}>Chronos</Text>
            </View>
            <View style={styles.taskHeader}>
                <Text style={styles.title}>
                    {date.toDateString()}
                </Text>
                <View style={styles.buttonsContainer}>
                    {isRecording && <MicrophoneAnimation/>}
                    <TouchableOpacity style={styles.button} onPress={onMicrophonePress}>
                        <Icon name="microphone-alt" size={28} color="#982C40"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onAddTaskPress}>
                        <Icon name="plus-circle" size={28} color="#982C40"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: 'red',
        width: '100%',
        paddingTop: 25,
    },
    greetingHeader: {
        padding: 15,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'right',
        height: 140,
    },
    greetingTitle: {
        fontSize: 30,
        color: "#982C40",
        paddingTop: 13,
    },
    greetingSubtitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#982C40",
        marginTop: 10,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        //backgroundColor:'yellow',
        marginTop: -26,

    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#ffffff',
        borderRadius: 50,
        padding: 9,
        marginLeft: 15,
        borderColor: "#982C40",
        borderWidth: 3,
        top:-50,
        left: -10,

    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
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
        width: 380,
        height: 380,
        position: 'absolute',
        top: '-43%',
        left: '-35%',
        zIndex: 1,

    },
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
        right: -10,
        fontFamily: 'Gabarito',
        color: "#982C40",
    },
});
