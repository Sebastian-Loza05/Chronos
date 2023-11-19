import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Keyboard, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from "expo-router";
import { authenticateUser, loginByToken } from '../api'; // Importa la función desde el archivo api.js
import { Alert, iconOffset } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFonts} from 'expo-font';

export default function Login() {

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const data = await loginByToken();

      if (data.success){
        router.replace("/calendar/")
      }
    };

    checkToken();
  }, []); // El código se ejecutará una vez al cargar el componente


  const handleKeyboardDidShow = (event) => {
    const keyboardHeight = event.endCoordinates.height;
    setKeyboardOffset(keyboardHeight - 100);
  };

  const handleKeyboardDidHide = () => {
    setKeyboardOffset(0);
  };

  Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow);
  Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide);

  const [username, setUsername] = useState(''); // Estado para el nombre de usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      // Mostrar un modal personalizado en lugar de alert
      Alert.alert(
        'Campos Incompletos',
        'Por favor, complete ambos campos para iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ]
      );
      return;
    }
  
    const data = await authenticateUser(username, password);
    if (data.success) {
      console.log('Usuario autenticado');
      await AsyncStorage.setItem('userToken', data.token);
      router.replace("/calendar");
    }
    else {
      // Redirige al usuario a la pantalla de inicio de sesión en caso de autenticación fallida
      router.replace("/auth/login");
  
      if (data.code === 404) {
        // Usuario Incorrecto (404), muestra un mensaje de error
        Alert.alert('La cuenta ingresada no existe', '', [{ text: 'OK' }]);
      } 
      else if (data.code === 403) {
        // Password Incorrecto (403), muestra un mensaje de error
        Alert.alert('Usuario o contraseña Incorrecta', '', [{ text: 'OK' }]);
      } else {
        // Otros errores de autenticación, muestra un mensaje de error genérico
        Alert.alert('Error de autenticación', 'Lo siento, no pudimos autenticar tu usuario en este momento. Por favor, verifica la información ingresada y vuelve a intentarlo.', [{ text: 'Volver a intentarlo' }]);
      }
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.all}>
        <LinearGradient colors={['#D78771', '#fdb9a9', '#FDD2C1', '#b75142']} style={styles.backgroundImage}>


          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innercontainer}>
              <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo-chronos.png')} style={styles.logo} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Login</Text>
              </View>
              <View style={styles.nuevo}>
                <View style={styles.textInputContainer}>
                  <Icon name="user" size={20} color="#982C40" style={styles.iconStyle}/>
                  <TextInput
                    placeholder="Username"
                    style={styles.inputWithIcon}
                    value={username}
                    onChangeText={handleUsernameChange}
                  />
                </View>

                <View style={styles.textInputContainer_}>
                  <Icon name="lock" size={20} color="#982C40" style={styles.iconStyle}/>
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.inputWithIcon}
                        value={password}
                        onChangeText={handlePasswordChange}
                    />
                </View>

              </View>
              <TouchableOpacity style={styles.loginButton} activeOpacity={0.7} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/register')}>
                  <Text style={styles.signupLinkBold}>Regístrate</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>

        </LinearGradient>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}  

const styles = StyleSheet.create({
  all: {
    flex: 1,
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la imagen al tamaño del contenedor
    alignItems: 'center',
    justifyContent: 'center',
    margin:0,
    padding:0,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    margin:0,
    padding:0,
    justifyContent:'center',
  },
  //Container de arriba
  topContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"yellow",
  },
  //Container de abajo
  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },

  
  logoContainer: {
    alignItems: "center",
    marginBottom: 1,
    marginTop: -60,
  },
  logo: {
    width: 300,
    height: 300,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: -35,
  },
  titleText: {
    fontSize: 30,
    color: "#982C40",
    textAlign: "center",
    marginBottom: 100,
    marginTop:4,
    fontFamily: "Caprasimo",
},
iconStyle: {
  marginRight: 10,
},
  inputContainer: {
    alignItems: "center",
    position: 'relative',
    marginBottom: 0,
  },
  input: {
    width: 290,
    height: 50,
    backgroundColor: '#ff6b7a',
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 25,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -55,
    borderRadius: 20,
    height: 30,
    paddingLeft: 10,
    borderColor: "#FFFFFF",
    borderWidth: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
},
textInputContainer_: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
  borderRadius: 20,
  height: 30,
  paddingLeft: 10,
  borderColor: "#FFFFFF",
  borderWidth: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
},
inputWithIcon: {
  flex: 1,
  color: "#982C40",
  fontSize: 18,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
},
  scrollViewContent: {
    flexGrow: 1,
  },
  circularContainer: {
    position: 'absolute',
    top:  100, // Ajusta el valor según el espacio deseado entre los íconos
    left: 35,
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circular_Container: {
    position: 'absolute',
    left: 35,
    top:  100, // Ajusta el valor según el espacio deseado entre los íconos
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: 38,
    height: 38,
    borderRadius: 40,
  },
  keyImage: {
    width: 28,
    height: 28,
    borderRadius: 1,
  },
  loginButton: {
    marginTop: -102,
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
  loginText: {
      color: "#FFEBEE",
      fontSize: 22,
      fontWeight: "bold",
  },
  nuevo: {
    marginBottom:143,
  },
  icon: {
    position: 'absolute', // Superpone el ícono dentro del contenedor de entrada
    top: 36, // Ajusta la posición vertical del ícono según tus necesidades
    left:14,
    width: 25,  // Ajusta el ancho del ícono según tus necesidades
    height: 25, // Ajusta la altura del ícono según tus necesidades
    zIndex: 1, // Asegura que los íconos estén en una capa superior
  },
  signupContainer: {
    flexDirection: 'row', // Muestra los elementos en línea
    alignItems: 'center', // Alinea verticalmente los elementos en el centro
    justifyContent: 'center', // Alinea horizontalmente los elementos en el centro
    marginTop:30,
  },
  signupText: {
    color: "#982C40",
    fontSize: 16, // Tamaño de fuente del texto "¿No tienes cuenta?"
  },
  signupLinkBold: {
    color: "#982C40",
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold', // Hace que el texto "Regístrate" sea negrita
    fontSize: 16, // Tamaño de fuente del texto "Regístrate"
  },
  
});
