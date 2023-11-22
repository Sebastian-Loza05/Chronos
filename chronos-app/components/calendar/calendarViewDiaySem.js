import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableWithoutFeedback, Dimensions} from "react-native"
import { horas } from "./../../app/horas"
import TaskItem from "./tasks/taskView";
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { TasksContext } from '../../app/TasksContext'; 
import { useFocusEffect } from '@react-navigation/native';

const {width} = Dimensions.get('screen');

const calculateOverlap = (tasks) => {
  let overlaps = {};

  tasks.forEach((task) => {
    if (!overlaps[task.start_time]) {
      overlaps[task.start_time] = [];
    }
    overlaps[task.start_time].push(task.id);
  });

  return overlaps;
};
  

const TasksList = React.memo(({ tasks, containerHeight, blocked }) => {
  const overlaps = calculateOverlap(tasks);
  const blockedStyle = {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 15,
    justifyContent: 'center',
  }
   
  const textStyle = {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
  }

  if (blocked) {
    return (
      <View style={blockedStyle}>
        <Text style={textStyle}>Día Bloqueado</Text>
      </View> 
    )
  }
  else {
    return (
      <View style={{ position: 'relative', flex: 1 }}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            containerHeight={containerHeight}
            overlaps={overlaps[task.start_time]}
          />
        ))}
      </View>
    );
  }
});

  
export default function CalendarViewDiaySem() {
  const swiper = React.useRef();
  const [value, setValue] = React.useState(new Date());
  const [week, setWeek] = React.useState(0);
  const [currentHour, setCurrentHour]= useState(new Date().getHours());
  const [currentMinute, setCurrentMinute]= useState(new Date().getMinutes());
  const [left, setLeft] = useState(140);
  const totalInterval = 70.0/60;
  const { tasks, refreshTasks, blocked } = useContext(TasksContext);

  // Actualiza las tareas cuando la pestaña gana foco
  useFocusEffect(
    React.useCallback(() => {
      refreshTasks(value);
    }, [value, refreshTasks])
  );

  useEffect(() => {
    refreshTasks(value); // Pasa la fecha seleccionada a refreshTasks
  }, [value, refreshTasks]);

  const style_customized = StyleSheet.create({
    barra: {
      flex: 1,
      borderLeftWidth: 1.5,
      borderColor: '#AB3D52',
      borderStyle: 'solid', //antes de pushear o algo volver a cambiar a 'dashed'
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


  const containerHeight = 70; // Altura de cada contenedor de hora

  const horas_text = [];
  Object.keys(horas).map((hora) => {
    // Utilizando padStart para formatear las horas en el formato "00:00"
    const formattedHour = hora.toString().padStart(2, '0');

    horas_text.push(
      <View key={horas[hora]} style={[styles.hora_view, { height: containerHeight }]}>
        <Text style={obtenerEstilo(hora)}> {formattedHour}:00 </Text>
        <View style={styles.hora_divisor}></View>
      </View>
    );
  });



  const weeks = React.useMemo(() => {
    const start = moment(start).add(week, 'weeks'). startOf('week');
    return[-1,0,1].map(adj =>{
      return Array.from({ length: 7}).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  return (
    <SafeAreaView style = {{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            showsPagination={false}
            loop={false}
            onIndexChanged={ind => {
              if(ind === 1){
                return;
              }
              setTimeout (() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek(newWeek);
                setValue(moment(value).add(newIndex, 'week').toDate());
                swiper.current.scrollTo(1,false);
              }, 100);
            }}>
            {weeks.map((dates, index) => (
              <View
                style={[styles.itemRow,{paddingHorizontal: 16}]} 
                key={index}>
                {dates.map((item, dateIndex) => {
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return(
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue(item.date)}>
                      <View 
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: '#982C40',
                            borderColor: '#982C40',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && {color: '#fff'},
                          ]}>
                          {item.weekday}
                        </Text>
                        <Text 
                          style={[
                            styles.itemDate, 
                            isActive && {color: '#fff'},
                          ]}>
                          {item.date.getDate()}
                        </Text>
                      </View>     
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <View style={{flex: 1, paddingTop: 24}}>
          <Text style={styles.contentText}>{value.toDateString()}</Text>
          <ScrollView> 
            <View style={styles.xd}>
              {horas_text}
            </View>
            <TasksList 
              tasks={tasks} 
              containerHeight={containerHeight} 
              blocked={blocked}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hora_view: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16, // Espacio a la izquierda de cada hora
    //backgroundColor:'yellow',
    //borderWidth:3,
    //borderColor:'red',
  },
  hora_divisor: {
    flex: 1,
    borderBottomWidth: 0.5, // Grosor más delgado para la línea
    borderBottomColor: '#AB3D52',
    marginRight: '-1000%',
  },
  horaSombreada: {
    //hora actual
    backgroundColor: '#AB3D52',
  },
  horaNormal: {
    // Estilos para otras horas
  },
  all: {
    //backgroundColor: 'yellow',
  },
  calendar_scroll: {
    flex: 1,
    backgroundColor: '#fff',
    height: 10,
    flexGrow: 1,
    width: '100%',
    paddingTop: '3%',
    flexDirection: 'row'
  },

  container:{
    flex: 1,
    paddingTop: 5,
    backgroundColor: 'white',
  },
  picker:{
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentText:{
    fontSize: 17,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    marginTop: -3,
    textAlign: 'center',
  },
  itemRow:{
    width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  item:{
    flex: 1,
    height: 50,
    marginHorizontal: 3,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'column',

  },
  itemWeekday:{
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate:{
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  placeholder:{
    flex:1,
    height:400,
    backgroundColor: 'red',
  },
  placeholderContent: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'solid', 
    borderRadius: 9,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  btn:{
    flexDirection: 'row',
    backgroundColor: '#007aff',
    borderWidth: 1,
    borderColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText:{
    fontSize: 18,
    fontWeight: '600',
    color:'#fff',
  }
})
