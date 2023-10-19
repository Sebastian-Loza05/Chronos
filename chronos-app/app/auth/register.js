import React from 'react';
import { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View,TouchableOpacity } from "react-native";
import backgroundImage from '../../assets/images/fondo.jpg';
import logo from '../../assets/logo-chronos.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Modal, Button } from 'react-native';
import { router } from "expo-router";
import Login from "./login";



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
    email: '',
  });

  const navigation = useNavigation();
  const [message, setMessage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [gender, setGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  // const [selectedCountry, setSelectedCountry] = useState('Peru');
  // const [selectedDistrict, setSelectedDistrict] = useState('Lima');
  const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);
  const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
  const [errors, setErrors] = useState({});

  // Funciones
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;  
    setDatePickerVisibility(false);
    setSelectedDate(currentDate);
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
  const openLocationPicker = () => {
    setLocationPickerVisible(true);
  };
  
  const closeLocationPicker = () => {
    setLocationPickerVisible(false);
  };

  const countries = [
    {
      name: 'Peru',
      districts: ['Lima', 'Arequipa', 'Cusco', 'Trujillo','Cajamarca', 'Lambayeque', 'Ancash', 'Callao', 'Junin', 
      'Ayachuco', 'Cusco', 'Puno', 'Arequipa', 'Huancavelica', 'Amazonas', 'Apurimac', 'Huanuco', 'San Martin', 'Piura', 'Loreto', 'Ica','Pasco', 'Tacna', 'Moquegua', 'Ucayali', 'Tumbes', 'Madre de Dios']
    }
  ];
  const selectedCountryData = countries.find(country => country.name === selectedCountry);
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
      tempErrors.lastname = "La contraseña es obligatoria";
    }
    if (!formData.lastname) {
      tempErrors.lastname = "El apellido es obligatorio";
    }
    if (!formData.birthday) {
      tempErrors.lastname = "La fecha de nacimiento es obligatoria";
    }
    if (!formData.country) {
      tempErrors.lastname = "La ubicación es obligatoria";
    }


    if (!isValidEmail(formData.email)) {
      tempErrors.email = "Correo electrónico no válido";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  const handleSubmit = async () => {
    try {
      let response = await fetch('http://192.168.100.74/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Algo salió mal al registrarse.');
      }

      setMessage('Registro exitoso!');

      router.replace("/auth/inicio");

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
    <ScrollView style={{ flex: 1 }}>
    <LinearGradient colors={['#D78771', '#fdb9a9', '#FDD2C1','#b75142']} style={style.container}>
      <View style={style.overlay} />
      <Image source={logo} style={style.logo} />
      <Text style={style.txtTitulo}>Register</Text>
      <View style={style.textInputContainer}>
        <Icon name="user" size={20} color="#982C40" style={style.iconStyle} />
        <TextInput placeholder="Username" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="lock" size={20} color="#982C40" style={style.iconStyle} />
        <TextInput placeholder="Password" secureTextEntry={true} style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="edit" size={20} color="#982C40" style={style.iconStyle} />
        <TextInput placeholder="Name" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="edit" size={20} color="#982C40" style={style.iconStyle} />
        <TextInput placeholder="Last Name" style={style.inputWithIcon} />
      </View>
      <TouchableOpacity onPress={openGenderPicker}>
        <View style={style.textInputContainer}>
          <Icon name="genderless" size={20} color="#982C40" style={style.iconStyle} />
          <TextInput 
            placeholder="Gender" 
            style={style.inputWithIcon} 
            value={gender}
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '60%', height: 200, backgroundColor: 'white', padding: 20 ,borderRadius:30 }}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) => {
                setGender(itemValue);
                closeGenderPicker(); 
              }}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
            <Button title="Close" onPress={closeGenderPicker} />
          </View>
        </View>
      </Modal>

      <View style={style.textInputContainer}>
        <Icon name="birthday-cake" size={20} color="#982C40" style={style.iconStyle} />
        <TextInput 
            placeholder="Birthday" 
            style={style.inputWithIcon} 
            value={selectedDate ? selectedDate.toDateString() : ''} 
            onFocus={showDatePicker} 
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
      <TouchableOpacity onPress={openLocationPicker}>
        <View style={style.textInputContainer}>
          <Icon name="location-arrow" size={20} color="#982C40" style={style.iconStyle} />
          <TextInput 
              placeholder="Location" 
              style={style.inputWithIcon} 
              value={selectedCountry ? `${selectedCountry}, ${selectedDistrict}` : ''} 
              editable={false}
          />
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLocationPickerVisible}
        onRequestClose={closeLocationPicker}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', height: 500, backgroundColor: 'white', padding: 20, borderRadius:30 }}>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={(itemValue) => {
                const foundCountry = countries.find(country => country.name === itemValue);
                if (foundCountry) {
                  setSelectedCountry(itemValue);
                  setSelectedDistrict(foundCountry.districts[0]);
                }
              }}              
              
            >
              {countries.map(country => (
                <Picker.Item key={country.name} label={country.name} value={country.name} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedDistrict}
              onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
            >
            {selectedCountryData && selectedCountryData.districts && selectedCountryData.districts.map(district => (
              <Picker.Item key={district} label={district} value={district} />
            ))}
            </Picker>
            <Button title="Close" onPress={closeLocationPicker} />
          </View>
        </View>
      </Modal>
      <View style={style.textInputContainer}>
          <Icon name="phone" size={20} color="#982C40" style={style.iconStyle} />
          <TextInput 
            placeholder="Phone" 
            style={style.inputWithIcon} 
            keyboardType="number-pad"
            maxLength={9}
          />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="envelope" size={20} color="#982C40" style={style.iconStyle} />
        <TextInput placeholder="Email" style={style.inputWithIcon} />
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
  container: {
    flex: 1,
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
    marginTop: 12,  
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
    shadowOffset: { width: 0, height: 2 },
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