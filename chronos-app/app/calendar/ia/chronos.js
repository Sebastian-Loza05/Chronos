import React from "react";
import {StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import LottieView from 'lottie-react-native';
import AppLoading from 'expo-app-loading';
import {useState, useEffect} from 'react';
import * as Font from 'expo-font';
import Icon from "react-native-vector-icons/FontAwesome5";
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native';


export default function Chronos() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([
        {
            title: "Hacer ejercicio",
            time: "10:00 AM - 11:00 AM",
            date: "5 Nov 2023"
        }
    ]);
    async function loadFonts() {
        await Font.loadAsync({
            'Gabarito': require('../../../assets/fonts/Gabarito-VariableFont_wght.ttf'),
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
    const onMicrophonePress = () => {
        setIsRecording(true);
        setSuggestionsOpen(false);
        setTimeout(() => {
            setIsRecording(false);
        }, 10000);
    };
    const toggleSuggestionsPanel = () => {
        //getNewSuggestionFromAI();
        setSuggestionsOpen(prevState => !prevState);
    };

    function getNewSuggestionFromAI() {
        // Aquí simularemos obtener una sugerencia de la IA
        const newSuggestion = {
            title: "Leer un libro",
            time: "8:00 PM - 9:00 PM",
            date: "6 Nov 2023"
        };

        setSuggestions(prevSuggestions => [...prevSuggestions, newSuggestion]);
    }

    function Suggestion({ suggestion, index, onPress }) {
        return (
            <TouchableOpacity style={styles.suggestionContainer} onPress={onPress}>
                <View style={styles.iconWithText}>
                    <Icon name="lightbulb" size={20} color="#982C40" marginRight={10} />
                    <Text style={styles.suggestionNumber}>Sugerencia {index + 1}:</Text>
                </View>
                <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                <Text style={styles.suggestionTime}>{suggestion.time}</Text>
                <Text style={styles.suggestionDate}>{suggestion.date}</Text>
            </TouchableOpacity>
        );
    }


    function RobotAnimation() {
        return (
            <LottieView
                style={styles.animationExpanded}
                source={require('../../../assets/animations/robot.json')}
                autoPlay
                loop
            />
        );
    }

    function MicrophoneAnimation() {
        return (
            <LottieView
                style={styles.animation}
                source={require('../../../assets/animations/voz.json')}
                autoPlay
                loop
            />
        );
    }
    function handleSuggestionPress(suggestion) {
        // navigation.navigate('CalendarScreen', { /* parámetros si es necesario */ });
        console.log('Suggestion pressed:', suggestion);
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Chronos</Text>

            <View style={styles.card}>
                <RobotAnimation/>
            </View>

            {isRecording && <MicrophoneAnimation/>}

            <TouchableOpacity style={styles.button} onPress={onMicrophonePress}>
                <Icon name="microphone-alt" size={28} color="#982C40"/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={toggleSuggestionsPanel}>
                <Text style={styles.buttonText}>Sugerencias</Text>
            </TouchableOpacity>

            {isSuggestionsOpen && (
                <TouchableOpacity
                    style={styles.fullScreenTouchable}
                    onPress={toggleSuggestionsPanel}
                    activeOpacity={1}
                >
                    <View style={styles.suggestionsContainer}>
                        {suggestions.map((suggestion, index) => (
                            <Suggestion
                                key={index}
                                index={index}
                                suggestion={suggestion}
                                onPress={() => handleSuggestionPress(suggestion)}
                            />
                        ))}
                    </View>
                </TouchableOpacity>
            )}

        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 45,
        fontWeight: 'bold',
        color: "#982C40",
        paddingTop: 1,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Gabarito'
    },
    card: {
        backgroundColor: 'transparent',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#f8c1c1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 40,
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: "#982C40",
        fontFamily: 'Gabarito'
    },
    translationText: {
        marginTop: 40,
        fontSize: 18,
        color: '#A9A9A9',
        textAlign: 'center',
    },
    animationExpanded: {
        width: 250,
        height: 250
    },
    animation: {
        width: 80,
        height: 80
    },
    suggestionsPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '80%',
        alignSelf: 'center',
        padding: 20,
        borderRadius: 5,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },

    suggestion: {
        marginBottom: 10,
        fontSize: 16,
        color: "#982C40",
        fontFamily:'Gabarito'
    },
    suggestionContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    suggestionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily:'Gabarito',
        color: "#982C40",
    },
    suggestionTitle: {
        fontSize: 14,
        marginTop: 5,
        fontFamily:'Gabarito',
        color: '#000000'

    },
    suggestionTime: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
        fontFamily:'Gabarito'
    },
    suggestionDate: {
        fontSize: 12,
        color: '#be2727',
        marginTop: 5,
        fontFamily:'Gabarito'
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(190,39,39)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems:'center'

    },
    suggestionsContainer: {
        width: '90%', // por ejemplo
        maxHeight: '80%', // por ejemplo
        backgroundColor: 'white', // o cualquier otro color de fondo que desees
        borderRadius: 10, // si quieres bordes redondeados
    },
    iconWithText: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});

