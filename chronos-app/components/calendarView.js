import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { horas } from "../app/horas";

export default function CalendarView() {
  const [currentHour, setCurrentHour]= useState(new Date().getHours());
  const [currentMinute, setCurrentMinute]= useState(new Date().getMinutes());

  useEffect(() => {
    const intervarlId = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    }, 1000);

    return () => {
      clearInterval(intervarlId);
    }
  }, []);
  
  return (
    <ScrollView style={styles.calendar_scroll} horizontal={true}>
      {Object.keys(horas).map((hora) => {
        <Text key={horas[hora]} style={styles.hora}>
          {horas[hora]}
        </Text>
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },

  calendar_scroll: {
    flex: 1,
    borderColor: '#000000',
    height: 10,
    flexGrow: 1,
    width: '100%'
  },

  hora: {
    flex: 1,
    color: '#000000',
    width: 200,
    backgroundColor: '#000000'
  }
})
