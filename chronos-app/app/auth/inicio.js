import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Inicio() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Elimina el token de AsyncStorage para cerrar la sesión
      await AsyncStorage.removeItem('userToken');
      // Registra un mensaje en la consola cuando el usuario cierra sesión
      console.log('Usuario cerró sesión exitosamente');
      // Redirige al usuario a la pantalla de inicio de sesión
      navigation.push('auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
//uhdfsohd
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inicio</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
