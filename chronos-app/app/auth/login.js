import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Register from "./register";

export default function Login() {
  const navigation = useNavigation();
  const [keyboardOffset, setKeyboardOffset] = useState(0);

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

  const handleLogin = () => {
    fetch('http://192.168.212.253:3000/auth', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Usuario autenticado');
          navigation.navigate('Inicio');
        } else {
          console.error('Error de autenticación');
        }
      })
      .catch((error) => {
        console.error('Error de red:', error);
      });
  };
  const [isRegistering, setIsRegistering] = useState(false); // Variable para mostrar el registro

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scrollViewContent, { paddingBottom: keyboardOffset }]}
        bounces={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo-chronos.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Login</Text>
        </View>
        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          placeholderTextColor="white"
          textAlign="center"
          value={username}
          onChangeText={handleUsernameChange}
       />
        </View>
        <View style={styles.inputContainer}>
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
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.7}
          onPress={handleLogin} // Llama a la función de inicio de sesión al hacer clic en el botón
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {isRegistering ? ( // Si estamos registrando, muestra la pantalla de registro
          <Register />
        ) : (

          <TouchableOpacity
        style={styles.signupLink}
        onPress={() => navigation.navigate("Register")} // Redirige a la pantalla de registro
      >
        <Text style={styles.signupLinkText}>¿No tienes una cuenta? <Text style={styles.signupLinkBold}>Regístrate</Text></Text>
      </TouchableOpacity>
        )}

        <View style={styles.circularContainer}>
          <Image
            source={require("../../assets/usuario.png")}
            style={styles.userImage}
          />
        </View>
        <View style={styles.circular_Container}>
          <Image
            source={require("../../assets/llave.png")}
            style={styles.keyImage}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6373',
  },
  logoContainer: {
    alignItems: "center",
    marginTop: -60,
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
    color: 'white',
    fontSize: 40,
  },
  inputContainer: {
    alignItems: "center",
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
    position: "absolute",
    left: 35,
    top: 274,
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  circular_Container: {
    position: "absolute",
    left: 35,
    top: 349,
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 55,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  loginText: {
    color: '#ff6373',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupLink: {
    alignItems: "center",
    marginTop: 20, // Ajusta según tus necesidades
  },
  signupLinkText: {
    color: 'white',
    fontSize: 16,
  },
  signupLinkBold: {
    color: 'white', // Puedes cambiar el color que prefieras
    fontSize: 16,
    fontWeight: 'bold', // Hace que el texto sea negrita
  },
});
