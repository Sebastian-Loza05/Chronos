//UserProfile.js:
import React from "react";
//import { TouchableOpacity } from "react-native-gesture-handler";
//import {router} from "expo-router";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Button, Alert, ActivityIndicator} from 'react-native';
import RedesSocialesIcon from '../../../assets/redes-sociales.png';
import localImage from '../../../assets/estrella.png';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext} from 'react';
import moment from 'moment';
import 'moment/locale/es';  // Importa el locale en español
import { Ionicons } from '@expo/vector-icons'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {router} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
// Importaciones para Firebase:
import { storage } from '../../config/firebaseConfig'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfileContext } from '../../UserProfileContext';
import { updateUserProfile } from '../../api';


const user1 = {
  firstName: 'Aaron',
  lastName: 'Coorahua Lindo',
  profileImage: 'https://media.discordapp.net/attachments/1015053042959265802/1159916101736603800/Imagen_de_WhatsApp_2023-10-06_a_las_13.11.52_08cc0798.jpg?ex=6532c30c&is=65204e0c&hm=d7212b0de2b75384be76bec11a3503eca502a30f0ffe6061764919261411d68c&=&width=317&height=423',
  aboutme: 'ABOUT ME:',
  description: '',
  role: 'Eco-Organizador',
};

const bannerImage = 'https://media.discordapp.net/attachments/952775750728155136/1172088601689989140/wide-tropical-beach-banner-background-vector.png?ex=655f0b92&is=654c9692&hm=c8262e4fee363733eb9e9bc4eba2c3767f56c0e37c0964fe54ad8f0cf257e031&=&width=837&height=423';

const getCountryText = (country) => {
  // Lista de posibles maneras de escribir "Perú"
  const peruVariants = ['Peru', 'peru', 'Perú', 'perú'];
  
  // Verifica si el país proporcionado es alguna de las variantes de "Perú"
  if (peruVariants.includes(country)) {
    return 'Perú  🇵🇪';
  } else {
    return country;
  }
};

// Este es tu componente de perfil
const ProfileComponent = ({ user }) => {
  // Este estado mantendrá la URL de la foto de perfil actual
  const [profilePhoto, setProfilePhoto] = useState(user.foto);
  const [isUploading, setIsUploading] = useState(false);


  // Este manejador se activará cuando el usuario quiera cambiar su foto de perfil

  const handleEditPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setIsUploading(true); // Indicador de carga
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        const imageName = `profile_${user.id}_${new Date().toISOString()}.jpg`;
        const imageRef = ref(storage, `images/${imageName}`);

        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
  
        setProfilePhoto(downloadURL);
        const updateResult = await updateUserProfile(downloadURL);
        if (updateResult.success) {
          console.log('Perfil actualizado:', updateResult.profile_updated);
          console.log("URL de la foto actualizada:", updateResult.profile_updated.foto);
        } else {
          throw new Error(updateResult.error || 'Error al actualizar el perfil.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    } finally {
      setIsUploading(false); // Finaliza el indicador de carga
    }
  };

  return (
    <View style={styles.profileContainer}>
    {isUploading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CFD8DC" />
      </View>
    ) : (
      <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
    )}
      <TouchableOpacity style={styles.editIcon} onPress={handleEditPhoto}>
        <FontAwesome5 name="pencil-alt" size={15} color="white" style={styles.iconStyle}/>
      </TouchableOpacity>
    </View>
  );
};

export default function user() {
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

  const { userProfile } = useContext(UserProfileContext);

    /* Luego descomentar, ahorita solo quiero probar si funciona bien el redireccionamiento segun el rol del usuario*/
    if (!userProfile) {
      return <Text></Text>;
    }

    // Establece el idioma de moment en español
    moment.locale('es');

    const fechaNacimiento = moment.utc(userProfile.fecha_nacimiento, 'ddd, DD MMM YYYY HH:mm:ss GMT').format('DD-MM-YYYY');


    // Formatea la fecha directamente desde la cadena UTC
    let fechaNacimientoFormateada = moment.utc(userProfile.fecha_nacimiento).format('DD [de] MMMM [del] YYYY');

    // Divide la fecha formateada en partes
      let fechaParts = fechaNacimientoFormateada.split(' ');

      // Capitaliza solo el mes (tercera palabra)
      fechaParts[2] = fechaParts[2][0].toUpperCase() + fechaParts[2].slice(1);
      
      // Une las partes nuevamente
      fechaNacimientoFormateada = fechaParts.join(' ');

     // Icono dependiendo del género
    const genderIconName = userProfile.genero === 'female' ? 'female-symbol' : 'male-symbol';

    const genderIconColor = userProfile.genero === 'female' ? '#FF69B4' : '#1874CD'; // Colores típicos para cada género, puedes ajustarlos a tus preferencias
    const ColorWrap = userProfile.genero === 'female' ? 'pink' : 'skyblue'; // Colores típicos para cada género, puedes ajustarlos a tus preferencias
      const genderIconWrapper= {
        backgroundColor: ColorWrap,
        borderRadius: 50,
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
      };
      const genderIcon = {
        color: genderIconColor,
        fontSize: 24,
        marginLeft: 2,
      };
  return (
    <ScrollView style={styles.container}>

      {/* Banner de fondo */}
      <Image source={{ uri: bannerImage }} style={styles.bannerImage} />

      {/* Contenedor para la imagen de perfil */}

      {/* Aquí renderizas el componente de perfil y le pasas el usuario como prop */}

      <ProfileComponent user={userProfile} />

      {/* Contenedor principal de texto */}
      <View style={styles.nuevo}>
        {/* Contenedor de la sección de nombre */}
        <View style={styles.nameContainer}>
          {/* Nombre y apellido */}
          <Text style={styles.name}>{userProfile.nombre} {userProfile.apellido}</Text>
        </View>

        {/* Contenedor de la fecha de cumpleaños */}
      <View style={styles.birthdayContainer}>
        <Icon name="birthday-cake" size={18} marginTop={-0.2} color="#AB3D52" />
        <Text style={styles.birthdayText}>
          {fechaNacimiento}
        </Text>
      </View>

        {/* Contenedor de Género */}
        <View style={styles.genderContainer}>
        <View style={genderIconWrapper}>
          <Foundation name={genderIconName} style={genderIcon}/>
        </View>
        </View>

      </View>


    {/* Contenedor de la sección de Email */}
    <View style={styles.contactContainer}>
          {/* Icono de Email */}
          <Fontisto name="email" size={24} color="#AB3D52"/>
          {/* Texto de Email */}
          <Text style={styles.contactText}>Email: </Text>
          <Text style={styles.contactText2}> {userProfile.correo}</Text>
    </View>

    {/* Contenedor de la sección de Celular */}
    <View style={styles.contactContainer2}>
      {/* Icono de Celular */}
      <Feather name="phone" size={22.5} color="#AB3D52"/>
      {/* Texto de Celular */}
      <Text style={styles.contactText}>Celular: </Text>
      <Text style={styles.contactText2}> {userProfile.celular}</Text>
    </View>
     {/*Pais*/}
     <View style={styles.contactContainer2}>
      {/* Icono de la Flag */}
      <Fontisto name="map-marker-alt" size={24} color="#AB3D52" marginLeft={2}/>
      {/* Texto de Pais */}
      <Text style={styles.contactText}> Pais: </Text>
      <Text style={styles.contactText2}>{getCountryText(userProfile.pais)}</Text>
    </View>
      {/* Sección de Ajustes (Settings) */}
      <View style={styles.AjustesContainer}>
       <TouchableOpacity style={styles.settingsContainer} onPress={() => {/* Aquí iría la lógica al tocar */}}>
        <Icon name="gears" size={24} color="#AB3D52" style={styles.settingsIcon} />
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>
      </View>
    {/*Container Logout*/}
    <View style={styles.logoutContainer}>
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <View style={styles.iconCircle}>
        <MaterialIcons name="logout" size={20} color="#982C40" />
      </View>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    width: 126, // Cambia el ancho de la imagen
    height: 126, // Cambia la altura de la imagen
    borderRadius: 63, // Asegúrate de que el radio de borde sea la mitad del ancho/altura
    backgroundColor: '#AB3D52', // Un color de fondo para el círculo
    justifyContent: 'center', // Centra el indicador verticalmente
    alignItems: 'center', // Centra el indicador horizontalmente
  },
  AjustesContainer:{
    marginLeft: 20,
    marginRight:20,
  },
  contactContainer: {
    flexDirection: 'row', // Coloca ícono y texto en una fila
    alignItems: 'center', // Alinea verticalmente
    paddingVertical: 15, // Espacio vertical
    paddingHorizontal: 20, // Espacio horizontal
    marginTop: 44,

  },
  contactContainer2: {
    flexDirection: 'row', // Coloca ícono y texto en una fila
    alignItems: 'center', // Alinea verticalmente
    paddingVertical: 15, // Espacio vertical
    paddingHorizontal: 20, // Espacio horizontal
  },
  contactText: {
    fontWeight: 'bold',
    marginLeft: 10, // Espacio entre el ícono y el texto
    fontSize: 16, // Tamaño del texto
    color: '#AB3D52',
    fontFamily: 'Roboto',
  },
  contactText2:{
    fontSize: 16, // Tamaño del texto
    color: '#333',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  nuevo:{
    top: 50,
    left: 0,
  },
  container: {
    flex: 1,
    flexDirection:'column',
  },
  bannerImage: {
    width: '100%',
    height: 200,

  },
  profileContainer: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 130, // Cambia el ancho del contenedor
    height: 130, // Cambia la altura del contenedor
    borderRadius: 130, // Asegúrate de que el radio de borde sea igual al ancho/altura
    //borderWidth: 3, // Aumenta el ancho del borde
    //borderColor: '#AB3D52', //Color del borde
  },
  /*Cambie*/
  editIcon: {
    // Estilos para el botón que contiene el icono
    position: 'absolute', // Puedes ajustar la posición según necesites
    right: 10,
    bottom: 10,
    backgroundColor: '#AB3D52', // Color de fondo del círculo
    borderRadius: 15, // La mitad del ancho y alto para hacerlo circular
    width: 30, // Ancho del círculo
    height: 30, // Alto del círculo
    justifyContent: 'center', // Centra el icono horizontalmente
    alignItems: 'center', // Centra el icono verticalmente
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  iconStyle: {
    // Estilos para el icono en sí
  },
  /*Cambie*/
  profileImage: {
    width: 126, // Cambia el ancho de la imagen
    height: 126, // Cambia la altura de la imagen
    borderRadius: 63, // Asegúrate de que el radio de borde sea la mitad del ancho/altura
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    top: 50,
    marginLeft: 20,
    marginRight:15,
  },
  nameContainer: {
    marginBottom: 10,
    marginTop: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    justifyContent: 'center', // Centra horizontalmente
    alignSelf: 'center', // Alinea el contenedor al centro
  },
  genderContainer:{
    marginTop: -9,
    paddingHorizontal: 10,
    flexDirection: 'row', // Icono y texto en la misma línea
    alignItems: 'center', // Centrar ítems verticalmente
    justifyContent: 'center', // Centrar ítems horizontalmente
    padding: 10,
  },
  genderText:{
    marginLeft: 8,
  },
  birthdayContainer: {
    marginTop: -15,
    marginBottom: 0,
    paddingHorizontal: 10,
    flexDirection: 'row', // Icono y texto en la misma línea
    alignItems: 'center', // Centrar ítems verticalmente
    justifyContent: 'center', // Centrar ítems horizontalmente
    padding: 10,
    shadowColor: '#000', // Sombra para dar profundidad
    backgroundColor: 'transparent', // O el color que desees
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // otros estilos que necesites
  },
  birthdayText: {
    marginLeft: 5, // Espacio entre el icono y el texto
    fontSize: 17,
    backgroundColor: 'transparent', // O el color que desees
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Sombra sutil
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5, // Espaciado de letras personalizado
    lineHeight: 24, // Altura de línea para un mejor espaciado vertical
    color: '#AB3D52', // O el color que prefieras
    fontFamily: 'Roboto',
    // otros estilos que necesites
  },
  aboutme: {
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 9,
    maxWidth: 350,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: 'black',
    flexShrink: 1,
  },
  icon: {
    width: 24, //Ancho del icono
    height: 24, //Alto del icono
    marginRight: 7, //Espacio entre el icono y el texto
    marginTop: 7,
  },
  aboutmeContainer: {
    marginTop: 5,
  },
  aboutmeContent: {
    flexDirection: 'row', //Coloca los elementos en la misma línea
    alignItems: 'center', //Alinea verticalmente los elementos al centro
  },
  cerrar_sesion_1:{
    backgroundColor: "#f8c1c1",
    marginTop:200,
    marginLeft:100,
    marginRight:100,
    alignItems:'center',
    justifyContent: 'center', // Centra verticalmente el ícono
    borderRadius: 130,
  },
  /*
  logoutContainer: {
    alignItems:'flex-end',
    justifyContent: 'flex-end',
    flexDirection: "column",
    alignItems: 'center',
    height: '13%',
    borderWidth:3,
    borderColor:'blue',

  },
  */
  logoutContainer: {
    width: '100%', // Ocupa todo el ancho disponible
    alignItems: 'center', // Alinea los elementos internos al centro horizontalmente
    justifyContent: 'flex-end', // Alinea el botón de logout al final del contenedor verticalmente
    padding: 10, // Espacio alrededor del botón para evitar que se pegue a los bordes
    paddingVertical:30,
    //borderWidth:3,
  },
  /*
  logoutButton: {
    flexDirection: 'row', // Icono y texto en fila
    alignItems: 'center', // Alineación vertical
    backgroundColor: "#f8c1c1",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },*/
  logoutButton: {
    flexDirection: 'row', // Icono y texto en fila
    alignItems: 'center', // Alineación vertical
    backgroundColor: "#f8c1c1",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCircle: {
    width: 30, // Tamaño del círculo
    height: 30, // Tamaño del círculo
    borderRadius: 10, // La mitad del tamaño para que sea un círculo
    borderColor: "#982C40", // Color del borde
    borderWidth: 2, // Grosor del borde
    justifyContent: 'center', // Centrar ícono verticalmente
    alignItems: 'center', // Centrar ícono horizontalmente
    marginRight: 7, // Espacio entre el ícono y el texto
  },
  logoutText: {
    color: "#982C40", // Color del texto
    fontSize: 19, // Tamaño del texto
    fontFamily: 'Gabarito', // Asegúrate de que la fuente está cargada
    fontWeight: 'bold',
  },
  settingsContainer: {
    flexDirection: 'row',
    marginRight: 0,
    marginLeft:0,
    backgroundColor: '#CFD8DC', // Cambia esto según tu tema
    paddingVertical: 15,
    paddingHorizontal: 3,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
  settingsIcon: {
    marginRight: 6,
  },
  settingsText: {
    fontSize: 18,
    color: '#333', // Cambia esto según tu tema
    fontWeight: '600',
  },
});

