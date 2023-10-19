import { StyleSheet, Text, View, Image } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  useEffect(() => {
    // Espera 2000 ms (2 segundos) y luego navega a la siguiente pantalla
    const timeout = setTimeout(() => {
      router.replace("/auth/login")
    }, 3000);
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.image_container}>
        <Image
          source={require('./../assets/images/logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFCF7'
  },

  image_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  
  logo: { 
    overflow: "hidden",
    height: "50%"
  }
})
