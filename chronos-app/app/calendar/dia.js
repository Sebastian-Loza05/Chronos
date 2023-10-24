import React from "react";
import { StyleSheet, View, Button } from "react-native";
import {router} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderDia from "../../components/calendar/headerDia";
import CalendarView from "../../components/calendar/calendarView";

export default function CalendarDia() {
  
  const handleLogout = async () => {
    try {
      // Elimina el token de AsyncStorage para cerrar la sesión
      await AsyncStorage.removeItem('userToken');
      // Registra un mensaje en la consola cuando el usuario cierra sesión
      console.log('Usuario cerró sesión exitosamente');
      // Redirige al usuario a la pantalla de inicio de sesión
      router.replace('auth/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderDia />
      </View>
      <View style={styles.calendar}>
        <CalendarView />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow:1,
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
  header: {
    flexGrow: 1,
    height: '40%',
    width: '100%',
    overflow: 'hidden'
  },
  calendar: {
    flexGrow: 1,
    height: '55%',
    width: '100%',
    overflow: 'hidden'
  }

});
