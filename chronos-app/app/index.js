import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  useEffect(() => {
    // Espera 2000 ms (2 segundos) y luego navega a la siguiente pantalla
    const timeout = setTimeout(() => {
      router.push("/auth/login")
    }, 3000);
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.texto}> Chronos </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  texto: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
