import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";

export default function Login() {
  useEffect(() => {
    // Espera 2000 ms (2 segundos) y luego navega a la siguiente pantalla
    const timeout = setTimeout(() => {
      router.push("/auth/login")
    }, 3000);
  });
  
  return (
    <View>
      <View>
        <Text> Chronos </Text>
      </View>
    </View>
  );
}
