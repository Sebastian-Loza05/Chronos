import React from 'react';
import {useState, useEffect} from 'react';
import {useCallback} from 'react';
import {Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View, TouchableOpacity} from "react-native";
import logo from '../../assets/logo-chronos.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {LinearGradient} from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native';
import {Modal, Button} from 'react-native';
import {router} from "expo-router";
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser } from '../api';

SplashScreen.preventAutoHideAsync();

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        lastname: '',
        gender: '',
        birthday: '',
        country: '',
        phone: '',
        email: '',
    });

    const [message, setMessage] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    // const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [gender, setGender] = useState('');
    const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);
    const [errors, setErrors] = useState({});

    // Funciones
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setDatePickerVisibility(false);
            setSelectedDate(selectedDate);
            const formattedDate = selectedDate.toDateString();
            setFormData(prevState => ({...prevState, birthday: formattedDate}));
        } else {
            setDatePickerVisibility(false);
        }
    };


    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };
    const openGenderPicker = () => {
        setGenderPickerVisible(true);
    };

    const closeGenderPicker = () => {
        setGenderPickerVisible(false);
    };

    const validateFields = () => {
        let tempErrors = {};
        if (!formData.username) {
            tempErrors.username = "El nombre de usuario es obligatorio";
        } else if (formData.username.length < 3) {
            tempErrors.username = "El nombre de usuario debe tener al menos 3 caracteres";
        }
        if (!formData.name) {
            tempErrors.name = "El nombre es obligatorio";
        }
        if (!formData.password) {
            tempErrors.password = "La contraseña es obligatoria";
        }
        if (!formData.password || formData.password.length < 6) {
            tempErrors.password = "La contraseña es obligatoria y debe tener al menos 6 caracteres";
        }
        if (!formData.lastname) {
            tempErrors.lastname = "El apellido es obligatorio";
        }
        if (!formData.birthday) {
            tempErrors.birthday = "La fecha de nacimiento es obligatoria";
        }
        if (!formData.phone) {
            tempErrors.phone = "El numero es obligatorio";
        } else if (formData.phone.length < 9) {
            tempErrors.username = "El numero debe tener al menos 3 caracteres";
        }
        if (!isValidEmail(formData.email)) {
            tempErrors.email = "Correo electrónico no válido";
        }

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length !== 0) {
            const firstError = Object.values(tempErrors)[0];
            Alert.alert("Error", firstError, [{ text: "OK" }]);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            setMessage('Por favor, corrija los errores antes de enviar.');
            return;
        }

        try {
            const data = await registerUser(formData);
            console.log("data: ", data)

            if (data.error) {
                throw new Error(data.message || 'Algo salió mal al registrarse.');
            }

            const token = data.token;
            if (token) {
                await AsyncStorage.setItem('userToken', token);
            }

            setMessage('Registro exitoso!');
            router.replace("/calendar/dia");

        } catch (error) {
            setMessage(error.message);
        }
    };

    const [fontsLoaded, fontsError] = useFonts({
        Ultra: require("../../assets/fonts/Ultra-Regular.ttf"),
        Caprasimo: require("../../assets/fonts/Caprasimo-Regular.ttf"),
    });

    if (fontsError) {
        console.error("Error loading fonts: ", fontsError);
        return <Text>Error loading fonts</Text>;
    }

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }
    return (
        <ScrollView contentContainerStyle={style.all}>
            <LinearGradient colors={['#D78771', '#fdb9a9', '#FDD2C1', '#b75142']} style={style.container}>
                <View style={style.overlay}/>
                <Image source={logo} style={style.logo}/>
                <Text style={style.txtTitulo}>Register</Text>
                <View style={style.textInputContainer}>
                    <Icon name="user" size={20} color="#982C40" style={style.iconStyle}/>
                    <TextInput
                        placeholder="Username"
                        style={style.inputWithIcon}
                        value={formData.username}
                        onChangeText={(text) => setFormData(prevState => ({...prevState, username: text}))}
                    />
                </View>
                <View style={style.textInputContainer}>
                    <Icon name="lock" size={20} color="#982C40" style={style.iconStyle}/>
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        style={style.inputWithIcon}
                        value={formData.password}
                        onChangeText={(text) => setFormData(prevState => ({...prevState, password: text}))}
                    />
                </View>
                <View style={style.textInputContainer}>
                    <Icon name="edit" size={20} color="#982C40" style={style.iconStyle}/>
                    <TextInput
                        placeholder="Name"
                        style={style.inputWithIcon}
                        value={formData.name}
                        onChangeText={(text) => setFormData(prevState => ({...prevState, name: text}))}/>
                </View>
                <View style={style.textInputContainer}>
                    <Icon name="edit" size={20} color="#982C40" style={style.iconStyle}/>
                    <TextInput
                        placeholder="Last Name"
                        style={style.inputWithIcon}
                        value={formData.lastname}
                        onChangeText={(text) => setFormData(prevState => ({...prevState, lastname: text}))}/>
                </View>
                <TouchableOpacity onPress={openGenderPicker}>
                    <View style={style.textInputContainer}>
                        <Icon name="genderless" size={20} color="#982C40" style={style.iconStyle}/>
                        <TextInput
                            placeholder="Gender"
                            style={style.inputWithIcon}
                            value={formData.gender}
                            editable={false}
                        />
                    </View>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isGenderPickerVisible}
                    onRequestClose={closeGenderPicker}
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{
                            width: '70%',
                            height: 200,
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 30
                        }}>
                    <Picker
                        selectedValue={formData.gender}
                        onValueChange={(itemValue, itemIndex) => {
                            setFormData(prevState => ({...prevState, gender: itemValue}));
                        }}
                    >
                                <Picker.Item label="Select Gender" value=""/>
                                <Picker.Item label="Male" value="male"/>
                                <Picker.Item label="Female" value="female"/>
                            </Picker>
                            <Button title="Confirm" onPress={closeGenderPicker}/>

                        </View>
                    </View>
                </Modal>

                <View style={style.textInputContainer}>
                    <Icon name="birthday-cake" size={20} color="#982C40" style={style.iconStyle}/>
                    <TextInput
                        placeholder="Birthday"
                        style={style.inputWithIcon}
                        value={formData.birthday}
                        onFocus={showDatePicker}
                        editable={true}
                    />
                </View>

                {isDatePickerVisible && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
                <View style={style.textInputContainer}>
                    <Icon name="phone" size={20} color="#982C40" style={style.iconStyle}/>
                    <TextInput
                        placeholder="Phone"
                        style={style.inputWithIcon}
                        keyboardType="number-pad"
                        maxLength={9}
                        value={formData.phone}
                        onChangeText={(text) => setFormData(prevState => ({...prevState, phone: text}))}
                    />
                </View>
                <View style={style.textInputContainer}>
                    <Icon name="envelope" size={20} color="#982C40" style={style.iconStyle}/>
                    <TextInput 
                        placeholder="Email" 
                        style={style.inputWithIcon} 
                        value={formData.email}
                        onChangeText={(text) => setFormData(prevState => ({...prevState, email: text}))}
                    />
                </View>
                <Pressable onPress={handleSubmit}>
                    <View style={style.btnSesion}>
                        <Text style={style.txtSesion}>Submit</Text>
                    </View>
                </Pressable>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text style={style.redirectText}>¿Ya tienes una cuenta? Ingresa</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    all: {
      flex: 1,
      height: "100%",
    },

    container: {
        flex: 1,
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 45,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 1,
    },
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        borderRadius: 20,
        height: 30,
        paddingLeft: 10,
        borderColor: "#FFFFFF",
        borderWidth: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    iconStyle: {
        marginRight: 10,
    },
    btnSesion: {
        marginTop: 30,
        backgroundColor: "#ff1744",
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
    },
    txtTitulo: {
        fontSize: 30,
        color: "#982C40",
        textAlign: "center",
        marginBottom: 10,
        fontFamily: "Caprasimo",
    },
    inputWithIcon: {
        flex: 1,
        color: "#982C40",
        fontSize: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    txtSesion: {
        color: "#FFEBEE",
        fontSize: 22,
        fontWeight: "bold",
    },
    redirectText: {
        color: "#982C40",
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 10,
        fontWeight: "bold",
    },
    messageText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
