import React, { useState }  from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Task({taskKey, task}) {
  async function loadFonts() {
    await Font.loadAsync({
      'Gabarito': require('../../../assets/fonts/Gabarito-VariableFont_wght.ttf'),
    });
  }
  // console.log(taskKey%3);
  const totalInterval = 70.0/60;
  const colors = ['#2D728F', '#3B8EA5', '#F5EE9E', '#F49E4C']

  const [hoursStart, minutesStart, secondsStart] = task.start_time.split(":").map(Number);
  const [hoursEnd, minutesEnd, secondsEnd] = task.end_time.split(":").map(Number);

  const left = (hoursStart*60 + minutesStart) * totalInterval + 35;
  const end = (hoursEnd*60 + minutesEnd) * totalInterval + 35;
  const width = end - left;
  function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const color = colors[getRandomInt(0,3)]
  
  const top = (taskKey%3 != 0) ? `${80-(80/(taskKey%3))}%`: '80%';

  const [isModalVisible, setModalVisible] = useState(false);
  
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  }

  const styles_customized = StyleSheet.create({
    task: {
      flex: 1,
      margin: 0,
      position: 'absolute',
      backgroundColor: color,
      width: width,
      height: '20%',
      borderRadius: 10,
      left: left,
      top: top,
      shadowColor: 'black',
      shadowOffset: { width:0, height: 7 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 7
    }
  })
  return (
    <View style={styles_customized.task}>
      <TouchableOpacity activeOpacity={0.7} underlayColor="lightgray" onPress={() => setModalVisible(true)}>
          <Text style={styles.names}> {task.name} </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      > 
        <View style={styles.modal}>
          <View style={styles.modalTask}>
            <Text style={styles.taskTitle}> {task.name} </Text>
          </View> 
        </View> 
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  names: {
    fontSize: 14,
    marginHorizontal: '5%',
    marginVertical: '2%',
    textAlign: 'left',
  },
  tasks: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  modal: {
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTask: {
    padding: '5%',
    height: '50%',
    width: '80%',
    backgroundColor: '#A8A8A8',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width:0, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 7,
    fontFamily: 'Gabarito',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})



