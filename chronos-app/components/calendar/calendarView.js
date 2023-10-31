import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { horas } from "./../../app/horas"
import Tasks from "./tasks/tasksView";


export default function CalendarView() {
  const [currentHour, setCurrentHour]= useState(new Date().getHours());
  const [currentMinute, setCurrentMinute]= useState(new Date().getMinutes());
  const [left, setLeft] = useState(140);
  const totalInterval = 70.0/60;

  const style_customized = StyleSheet.create({
    barra: {
      flex: 1,
      borderLeftWidth: 1.5,
      borderColor: '#AB3D52',
      borderStyle: 'dashed',
      width: 0,
      height: "90%",
      position: 'absolute',
      left: left,
      bottom: 0,
    }
  })

  useEffect(() => {
    const intervarlId = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
      setLeft(((now.getHours())*60 + now.getMinutes())*totalInterval + 35);
    }, 1000);

    return () => {
      clearInterval(intervarlId);
    }
  }, []);


  const obtenerEstilo = (hora) => {
    if (currentHour == hora)
      return styles.horaSombreada;
    return styles.horaNormal;
  } 
  
  const horas_text = [];
  Object.keys(horas).map((hora) => {
    horas_text.push(
      <View style={styles.hora_view}>
        <Text key={horas[hora]} style={obtenerEstilo(hora)}> {hora}:00 </Text>
        <View style={styles.hora_divisor}></View>
      </View>
    )
  });

  return (
    <ScrollView style={styles.calendar_scroll} horizontal={true}>
      {horas_text}
      <View style={style_customized.barra}></View>
      <Tasks />
    </ScrollView>
  )
}

const styles = StyleSheet.create({

  calendar_scroll: {
    flex: 1,
    backgroundColor: '#fff',
    height: 10,
    flexGrow: 1,
    width: '100%',
    paddingTop: '3%',
    flexDirection: 'row'
  },

  hora_view: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },

  horaNormal: {
    flex: 1,
    color: '#A5A5A5',
    fontSize: 13,
    width: 60,
    textAlign: "center",
    textAlignVertical: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    maxHeight: '7%',
    marginBottom: 10
  },

  horaSombreada: {
    flex: 1,
    color: '#ECECEC',
    fontSize: 13,
    width: 60,
    textAlign: "center",
    textAlignVertical: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    maxHeight: '7%',
    marginBottom: 10,
    backgroundColor: '#AB3D52'
  },
  
  hora_divisor: {
    borderLeftWidth: 1,
    borderColor: '#A5A5A5',
    height: "90%",
    width: 0,
    borderStyle: 'dashed'
  },

})
