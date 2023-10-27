import React, { useEffect, useState } from "react";
import { getTasksDate } from "../../../app/api";
import { View, StyleSheet } from "react-native";
import Task from "./taskView";
import compararHoras from "../../functions/functions";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const getTasks = async () => {
      const date = new Date();
      const day = `${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()}`;
      const body = {
        type_search: 1,
        begin_date: day
      }
      const data = await getTasksDate(body);
      const data_tasks = data.tasks;
      data_tasks.sort(compararHoras);
      if (data.success)
        setTasks(data.tasks)
    }

    getTasks();
  }, [])
  
  const tasks_view = []
  for (let i = 0; i < tasks.length; i++) {
    tasks_view.push(<Task key={i+1} taskKey={i+1} task={tasks[i]} />);
  }

  return (
    <View style={styles.tasks}>
      {tasks_view}
    </View>
  );
}

const styles = StyleSheet.create({
  tasks: {
    flex: 1,
    width: '100%',
    height: '90%',
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: 'transparent'
  },
})

