import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { horas } from "./../../app/horas";

export default function CalendarView() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [left, setLeft] = useState(140);
  const totalInterval = 70.0 / 60;

  // Datos ficticios de eventos
  const events = [
    { day: 'Lunes', hour: 1, duration: 30 },
    { day: 'Martes', hour: 4, duration: 15 },
    { day: 'Miercoles', hour: 6, duration: 45 },
    // ... agregar mÃ¡s eventos como desees
  ];
   const daysOfWeek = [
        { day: "MON", date: "05" },
        { day: "TUE", date: "06" },
        { day: "WED", date: "07" },
        { day: "TRU", date: "08" },
        { day: "FRI", date: "09" },
        { day: "SUN", date: "10" },
        { day: "SAT", date: "11" },
    ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setLeft((now.getHours() * 60 + now.getMinutes()) * totalInterval + 35);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const obtenerEstilo = (hora) => {
    if (currentHour == hora) return styles.horaSombreada;
    return styles.horaNormal;
  };

  const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

  return (
    <ScrollView style={styles.mainScrollView}>
    <View style={styles.mainContainer}>
     <View style={styles.nuevo}>
            <View style={styles.daysOfWeekContainer}>
                    {daysOfWeek.map((item, index) => (
                        <View key={index} style={styles.nuevo2}>
                            <Text style={styles.dayText}>{item.day}</Text>
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                    ))}
            </View>
        </View>
      <ScrollView style={styles.calendar_scroll} horizontal={true}>
        {Object.keys(horas).map((hora, index) => (
          <View key={index} style={styles.hora_view}>
            <Text style={obtenerEstilo(hora)}>{hora}:00</Text>
            <View style={styles.hora_divisor}></View>
          </View>
        ))}
        <View style={{ ...styles.barra, left: left }}></View>
      </ScrollView>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    nuevo2: {
        marginBottom: 15,

    },
    mainContainer: {
        flexDirection: "row",
        backgroundColor:'white',
    },
    dateText: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    dayText: {
        flex: 1,
        fontSize: 15,
        textAlign: 'center',
        marginVertical: 7,

    },
    nuevo: {
        paddingRight: 0,
        //marginTop: -10,
        backgroundColor:'white',
        width: 80,
        justifyContent: 'flex-start',
        paddingVertical: 30,
    },    
    daysOfWeekContainer: {
        width: 60,
        backgroundColor: "#A86773",
        padding: 10,
        marginRight: 10,
        marginTop: 30,
        marginLeft: 12,
        borderRadius: 300,
        marginBottom: 22,
    },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  calendar_scroll: {
    flexGrow: 1,
    width: '100%',
    paddingTop: '3%',
    flexDirection: 'row',
  },
  hora_view: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
    height: '100%',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  horaNormal: {
    color: '#A5A5A5',
    fontSize: 13,
    textAlign: "center",
    marginVertical: 5,
    marginBottom: 10,
  },
  horaSombreada: {
    color: '#ECECEC',
    fontSize: 13,
    textAlign: "center",
    borderRadius: 10,
    marginVertical: 5,
    marginBottom: 10,
    backgroundColor: '#AB3D52',
  },
  hora_divisor: {
    borderLeftWidth: 1,
    borderColor: '#A5A5A5',
    height: "90%",
    width: 0,
    borderStyle: 'dashed'
  },
  barra: {
    borderLeftWidth: 1.5,
    borderColor: '#AB3D52',
    borderStyle: 'dashed',
    width: 0,
    height: "90%",
    position: 'absolute',
    bottom: 0,
  }
});