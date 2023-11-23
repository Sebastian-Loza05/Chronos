import React, { useState } from "react";
import { View, Text, TouchableOpacity} from "react-native"
import Modal from 'react-native-modal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import ComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const getUniqueColor = (taskId) => {
    const colors = [
    //pink, verdebonito, skyblue, amarillo, moradito, lightcoral, azuleado, fucsia/rosado
      'pink', '#4CE862', 'skyblue', '#FFE633', '#EE62FF', 'lightcoral', '#3BA3FF', '#FF62A5', 
    ];
  
    const colorIndex = taskId % colors.length; // Usando el id de la tarea se obteniene un índice de color especifico uwu
    return colors[colorIndex];
  };

const calculateTaskWidth = (numberOfOverlaps) => {
  switch (numberOfOverlaps) {
    case 1:
      return 300;
    case 2:
      return 150; 
    case 3:
      return 100; 
    case 4:
      return 75; 
    case 5:
      return 62.9; 
    default:
      return 380; 
  }
};

const calculateTaskLeft = (numberOfOverlaps, overlapIndex) => {
  switch (numberOfOverlaps) {
    case 1:
      return  (60 + overlapIndex * 92); 
    case 2:
      return  (60 + overlapIndex * 150); 
    case 3:
      return (60 + overlapIndex * 100); 
    case 4:
      return (60 + overlapIndex * 75); 
    case 5:
      return (60 + overlapIndex * 62.9); 
    default:
      return 380; 
  }
};

const TaskItem = ({ task, containerHeight, overlaps}) => { 
  const taskColor = getUniqueColor(task.id);
  const startTime = moment(task.start_time, 'HH:mm');
  const endTime = moment(task.end_time, 'HH:mm');

  const durationInMinutes = endTime.diff(startTime, 'minutes');

  const topPosition = ((startTime.hours() * containerHeight) + ((startTime.minutes() / 60) * containerHeight))-1645;
  const taskHeight = (durationInMinutes / 60) * containerHeight;

  // Encuentra el índice de esta tarea en el arreglo de superposiciones
  const overlapIndex = overlaps.indexOf(task.id);
  const numberOfOverlaps = overlaps.length;

  const taskWidth = calculateTaskWidth(numberOfOverlaps); 
  const marginLeft = calculateTaskLeft(numberOfOverlaps, overlapIndex);
  const taskStyle = {
    position: 'absolute', 
    top: topPosition, //posicion de la tarea
    height: taskHeight, //alto de la tarea
    width: taskWidth, //ancho de la tarea
    marginLeft: marginLeft,
    borderRadius: 15,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: taskColor, 
  };

  const timeStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,  // Separación entre el nombre de la tarea y el tiempo
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: 8, 
    right: 8,
  };

  const closeIconStyle = {
    fontSize: 33, // Tamaño del icono
    color: 'red', // Color del icono
  };

  const modalStyle = {
    backgroundColor: taskColor,
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 513,
    width: 340,
  };

  const titleStyle ={
    fontWeight: 'bold',
    marginBottom: 75,
    marginTop: -100,
    fontSize: 28,
    textAlign: 'center',
  };

  const datextoStyle = {
    //backgroundColor: 'skyblue',
    fontWeight: 'bold',
    fontSize: 18,

  };

  const datedStyle = {
    flexDirection: 'row',  // Para alinear ícono y texto en la misma línea
    alignItems: 'center',  // Alinear verticalmente en el centro
    marginBottom: 10,
    marginTop: -45,
    //backgroundColor: 'red',
  };

  const startStyle = {
    flexDirection: 'row',  // Para alinear ícono y texto en la misma línea
    alignItems: 'center',  // Alinear verticalmente en el centro
    marginBottom: 10,
    marginTop: 0,
    //backgroundColor: 'red',
  };

  const endStyle = {
    flexDirection: 'row',  // Para alinear ícono y texto en la misma línea
    alignItems: 'center',  // Alinear verticalmente en el centro
    marginBottom: 10,
    marginTop: 0,
    //backgroundColor: 'red',
  };

  const descStyle = {
    flexDirection: 'row',  
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 0,
    flexWrap: 'wrap',  
    //backgroundColor: 'red',
  };

  const ubiStyle = {
    flexDirection: 'row',  
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 0,
    flexWrap: 'wrap',  
    //backgroundColor: 'red',
  };

  const contentTextStyle = {
    fontSize: 17,
    paddingVertical: 3, 
  };

  const iconStyle = {
    marginRight: 5,  // Espaciado entre ícono y texto.
  };

  const formattedDate = moment.utc(task.date).format('ddd, DD MMM YYYY');

  return (
    <View>
      <TouchableOpacity onPressIn={toggleModal}>
        <View style={taskStyle}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{task.name}</Text>
          <View style={timeStyle}>
            <Text>⏰</Text>
            <Text style={{ marginLeft: 5 }}>{task.start_time} - {task.end_time}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={modalStyle}>
          {/* Botón de cierre del modal "X" */}
          <TouchableOpacity style={closeButtonStyle} onPress={toggleModal}>
            <FontistoIcon name="close" style={closeIconStyle} />
          </TouchableOpacity>

          {/* Contenido del modal */}
          <Text style={titleStyle}>{task.name}</Text>
          <View style={datedStyle}>
            <ComunityIcon name="calendar-clock" size={23} color="#000" style={iconStyle} />
            <Text style={datextoStyle}>Fecha: </Text> 
            <Text style={{fontSize: 17}}>{formattedDate}</Text>
          </View>
          <View style={startStyle}>
            <ComunityIcon name="clock-time-three" size={23} color="#000" style={iconStyle} /> 
            <Text style={datextoStyle}>Hora Inicio: </Text> 
            <Text style={{fontSize: 17}}>{task.start_time}</Text>
          </View>
          <View style={endStyle}>
            <Ionicons name="timer" size={23} color="#000" style={iconStyle} /> 
            <Text style={datextoStyle}>Hora Fin: </Text> 
            <Text style={{fontSize: 17}}>{task.end_time}</Text>
          </View>

          {/* Condición para mostrar descripción solo si no es null */}
          {task.description && (
            <View style={descStyle}>
              <ComunityIcon name="text" size={23} color="#000" style={iconStyle} /> 
              <Text style={datextoStyle}>Descripción: </Text> 
              <Text style={contentTextStyle}>{task.description}</Text>
            </View>
          )}

          {/* Condición para mostrar ubicación solo si no es null */}
          {task.place && (
            <View style={ubiStyle}>
              <FontistoIcon name="map-marker-alt" size={21} color="#000" style={iconStyle} /> 
              <Text style={datextoStyle}> Ubicación: </Text> 
              <Text style={contentTextStyle}>{task.place}</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );

};

export default TaskItem;
