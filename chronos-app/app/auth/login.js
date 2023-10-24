import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Keyboard, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import { authenticateUser } from '../api'; // Importa la función desde el archivo api.js
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {iconOffset} from 'react-native';




export default function Login() {
  const navigation = useNavigation();
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Verificar si hay un token almacenado en AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        
        if (token) {
          // Realiza una solicitud GET al servidor para verificar el token
          const response = await fetch('http://192.168.174.71:3000/auth/token', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            // Si se recibe una respuesta exitosa, redirige al usuario a la pantalla de inicio
            router.replace("/calendar/");
          }
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
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
  

  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ImageBackground source={require('../../assets/fondo.png')} style={styles.backgroundImage}>
              <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo-chronos.png')} style={styles.logo} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Login</Text>
              </View>
            </ImageBackground>
            <View style={styles.bottomContainer}>
              <View style={styles.nuevo}>
              <View style={[styles.inputContainer, { marginTop: -40, flexDirection: 'row' }]}>
              <Image source={require('../../assets/user.png')} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="User Name"
                placeholderTextColor="white"
                textAlign="center"
                value={username}
                onChangeText={handleUsernameChange}
              />
              </View>
              <View style={[styles.inputContainer, { marginTop: 10, flexDirection: 'row' }]}>
                <Image source={require('../../assets/key.png')} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor="white"
                  textAlign="center"
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Color de fondo
    margin:0,
    padding:0,

  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la imagen al tamaño del contenedor
    margin:0,
    padding:0,
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
    marginTop: 0,
    marginBottom: 1,
  },
  logo: {
    width: 300,
    height: 300,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: -40,
  },
  titleText: {
    color: 'black',
    fontSize: 40,
  },
  inputContainer: {
    alignItems: "center",
    position: 'relative',
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
  scrollViewContent: {
    flexGrow: 1,
  },
  circularContainer: {
    position: 'absolute',
    left: 35,
    top: iconOffset,
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
    width: 200,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: -102,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  loginText: {
    color: '#ff6373',
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 16, // Tamaño de fuente del texto "¿No tienes cuenta?"
  },
  signupLinkBold: {
    fontWeight: 'bold', // Hace que el texto "Regístrate" sea negrita
    fontSize: 16, // Tamaño de fuente del texto "Regístrate"
  },
  
});
