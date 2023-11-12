import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeaderMes, CalendarViewMes } from "../../components/calendar";

export default function CalendarMes() {
  const handleLogout = async () => {
    try {
      // Elimina el token de AsyncStorage para cerrar la sesión
      await AsyncStorage.removeItem("userToken");
      // Registra un mensaje en la consola cuando el usuario cierra sesión
      console.log("Usuario cerró sesión exitosamente");
      // Redirige al usuario a la pantalla de inicio de sesión
      router.replace("auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  const [value, setValue] = React.useState(new Date());
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderMes value={value} setValue={setValue} />
      </View>
      <View style={styles.calendar}>
        <CalendarViewMes value={value} setValue={setValue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
  header: {
    height: 50, // Set this to the desired height for your header
    flexGrow: 0.18,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "white",
  },
  calendar: {
    flexGrow: 1,
    height: "55%",
    width: "100%",
    overflow: "hidden",
  },
});
