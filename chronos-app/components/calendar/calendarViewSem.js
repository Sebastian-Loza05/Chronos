import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const daysOfWeek = [
  { day: 'MON', date: '05' },
  { day: 'TUE', date: '06' },
  { day: 'WED', date: '07' },
  { day: 'THU', date: '08' },
  { day: 'FRI', date: '09' },
  { day: 'SAT', date: '10' },
  { day: 'SUN', date: '11' },
];

const events = [
  { day: 'MON', hour: 10, description: 'Evento texto' },
  { day: 'MON', hour: 1, description: 'Evento texto' },
  { day: 'WED', hour: 0, description: 'Evento texto1' },
  { day: 'SAT', hour: 12, description: 'Evento texto2' },
  { day: 'SUN', hour: 13, description: 'Evento texto3' },
];

const CalendarView = () => {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 1000 * 60);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const obtenerEstilo = (hora) => {
    if (currentHour === hora) return { columnStyles: styles.horaConBordes, textStyles: styles.activeHourText };
    return { columnStyles: {}, textStyles: {} };
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.verticalScroll}>
        <View style={styles.rowsContainer}>
          <View style={styles.daysColumn}>
            {daysOfWeek.map((item) => (
            <View style={styles.headerDayContainer} key={item.day}>
              <View style ={styles.nuevo}>
                <Text style={styles.headerDay}>{item.day}</Text>
                <Text style={styles.HeaderDate}>{item.date}</Text>
                </View>
              </View>
            ))}
          </View>
          <ScrollView horizontal={true} style={styles.content}>
            {Array.from({ length: 24 }).map((_, index) => {
              const { columnStyles, textStyles } = obtenerEstilo(index);
              return (
                <View key={index} style={[styles.column, columnStyles]}>
                  <Text style={[styles.timeText, textStyles]}>{`${index}:00`}</Text>
                  <View style={[styles.centeredLine, currentHour === index && styles.activeLine]}></View> 
                  {events.filter(event => event.hour === index).map((event, idx) => (
                    <View key={idx} style={[styles.event, { top: daysOfWeek.findIndex(d => d.day === event.day) * 60 + 60 }]}>
                      <Text style={styles.eventText}>{event.description}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
    nuevo: {
    //backgroundColor: 'green',
    },
  activeHourText: {
    color: '#A31939', // Puedes usar cualquier color que desees para la hora activa
    fontWeight: 'bold', // Puedes hacer el texto más grueso si así lo prefieres
  },
  
  centeredLine: {
    position: 'absolute',
    left: '50%', // Centrado horizontalmente
    top: 0,
    bottom: 0,
    width: 1,
    top: 40,
    marginTop: 10,  // esto moverá la línea un poco hacia abajo
    borderStyle: 'dashed', // esto hará que la línea sea entrelineada
    borderColor: 'rgba(128, 128, 128, 0.5)', // color con transparencia
    borderWidth: 1,
    borderRadius: 0,
  },
  activeLine: {
    backgroundColor: '#1E050B', // Color cuando la línea es activa (es la hora actual)\
    marginTop: 10,  // esto moverá la línea un poco hacia abajo
    borderStyle: 'dashed', // esto hará que la línea sea entrelineada    
    borderWidth: 1,
    borderRadius: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  verticalScroll: {
    flex: 1,
  },
  rowsContainer: {
    flexDirection: 'row',
  },
  daysColumn: {
    backgroundColor: '#A86773', // Color de fondo rosa claro de la barra de días
    paddingHorizontal: 10,
    marginTop: 60,
    borderRadius: 50,// Radio inferior izquierdo
    marginLeft: 15,  
    marginRight: 13,
  },
  headerDay: {    
    width: 38,
    textAlign: 'center',
    fontSize: 16,
    color: '#1E050B', // Color de texto
    height: 60,
    lineHeight: 60,
  },
  timeText: {
    width: 60,
    height: 60,
    lineHeight: 60,
    textAlign: 'center',
    color: '#888',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    width: 70,
  },
  event: {
    position: 'absolute',
    left: 5,
    right: 5,
    height: 56,
    backgroundColor: '#F7F7F7', 
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    elevation: 1, 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,    
    borderColor: '#DDDDDD', // Borde sutil
    justifyContent: 'space-between', // Distribuye el contenido (texto y línea) a lo largo del eje vertical
  },
  eventText: {
    color: '#555',
    fontWeight: 'bold',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1, // Altura de la línea
    backgroundColor: '#1E050B', // Color de la línea
    top: '50%', // Para que la línea quede centrada verticalmente dentro del evento
  },
});

styles.headerDayContainer = {
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  //backgroundColor: 'yellow',
};

styles.headerDay = {
  textAlign: 'center',
  fontSize: 16,
  color: '#1E050B',
};

styles.HeaderDate = {
  textAlign: 'center',
  fontSize: 16,  // Hice el tamaño de la fecha un poco más pequeño
  color: '#1E050B',
};

export default CalendarView;