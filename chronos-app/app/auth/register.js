import React from 'react';
import { useCallback } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View,TouchableOpacity } from "react-native";
import backgroundImage from '../../assets/images/fondo.jpg';
import logo from '../../assets/logo-chronos.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

export default function Register() {
  const showMessages = () => {
    console.log("Boton presionado");
  }
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

    <LinearGradient colors={['#D78771', '#fdb9a9', '#FDD2C1','#b75142']} style={style.container}>
      <View style={style.overlay} />
      <Image source={logo} style={style.logo} />
      <Text style={style.txtTitulo}>Register</Text>
      <View style={style.textInputContainer}>
        <Icon name="user" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Username" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="lock" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Password" secureTextEntry={true} style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="edit" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Name" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="edit" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Last Name" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="genderless" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Gender" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="birthday-cake" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Birthday" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="location-arrow" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Country" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="phone" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Phone" style={style.inputWithIcon} />
      </View>
      <View style={style.textInputContainer}>
        <Icon name="envelope" size={20} color="#B71C1C" style={style.iconStyle} />
        <TextInput placeholder="Email" style={style.inputWithIcon} />
      </View>
      <Pressable onPress={showMessages}>
      <View style={style.btnSesion}>
        <Text style={style.txtSesion}>Submit</Text>
      </View>
    </Pressable>
    <TouchableOpacity onPress={() => { /* Aquí tu función para navegar a la pantalla de inicio de sesión */ }}>
      <Text style={style.redirectText}>¿Ya tienes una cuenta? Ingresa</Text>
    </TouchableOpacity>
    </LinearGradient>
  );
}
const style = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   resizeMode: "cover",
  //   justifyContent: "center",
  //   paddingHorizontal: 45,
  // },
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
    //backgroundColor: 'rgba(0,0,0,0.20)', // Aumentamos aún más la opacidad para oscurecer el fondo
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 8,  // Reducir el margen superior
    marginBottom: 1, // Aumentar el espaciado después del logo
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6, // Reducir el margen superior para espaciar más uniformemente los campos
    borderRadius: 20,
    height: 30,
    paddingLeft: 10,
    borderColor: "#FFFFFF",
    borderWidth: 3,
    marginTop: 12,  // Espaciado adicional
    backgroundColor: 'rgba(255, 255, 255, 0.7)',  // Fondo blanco opaco
  },
  iconStyle: {
    marginRight: 10,
  },
  btnSesion: {
    marginTop: 30, // Reducir el margen superior
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
    color: "#982C40",  // Color igual al del ícono
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 10,
    fontWeight: "bold",
  },
});