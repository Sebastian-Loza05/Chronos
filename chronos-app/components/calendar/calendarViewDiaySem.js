import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableWithoutFeedback, Dimensions} from "react-native"
import { horas } from "./../../app/horas"
import Tasks from "./tasks/tasksView";
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { TouchableOpacity } from "react-native-gesture-handler";

const {width} = Dimensions.get('screen');

export default function CalendarViewDiaySem() {
    const swiper = React.useRef();
    const [value, setValue] = React.useState(new Date());
    const [week, setWeek] = React.useState(0);
    const [currentHour, setCurrentHour]= useState(new Date().getHours());
    const [currentMinute, setCurrentMinute]= useState(new Date().getMinutes());
    const [left, setLeft] = useState(140);
    const totalInterval = 70.0/60;
  
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

    const horas_text = [];
    Object.keys(horas).map((hora) => {
      horas_text.push(
        <View style={styles.hora_view}>
          <Text key={horas[hora]} style={obtenerEstilo(hora)}> {hora}:00 </Text>
          <View style={styles.hora_divisor}></View>
        </View>
      )
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

            <View style={{flex: 1, paddingVertical: 24, paddingHorizontal: 16}}>
                <Text style={styles.contentText}>{value.toDateString()}</Text>
                    <ScrollView contentContainerStyle={styles.all}>
                        {horas_text}
                        <View style={style_customized.barra}></View>
                        <Tasks />
                    </ScrollView>
            </View>
        </View>
    </SafeAreaView>
  );
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

  container:{
    flex: 1,
    paddingVertical: 5,
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
    marginTop:-18,
  },
  itemRow:{
    width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  item:{
    flex: 1,
    height: 50,
    marginHorizontal: 4,
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
    borderStyle: 'dashed',
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
