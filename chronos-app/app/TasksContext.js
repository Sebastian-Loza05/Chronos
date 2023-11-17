import React, { createContext, useState, useCallback } from 'react';
import { getTasksDate } from './api'; 
import moment from 'moment'; 

export const TasksContext = createContext(null);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Define la función de carga de tareas
  const loadTasks = useCallback(async (date) => {
    try {
      const formData = {
        type_search: 1,
        begin_date: moment(date).format('YYYY-MM-DD'),
      };
      const response = await getTasksDate(formData);
      
      if (response && response.success) {
        const tasksWithFormattedTime = response.tasks.map((task) => ({
          ...task,
          start_time: moment(task.start_time, 'HH:mm:ss').format('HH:mm'),
          end_time: moment(task.end_time, 'HH:mm:ss').format('HH:mm'),
        }));
        // Ordenar y actualizar el estado si es necesario
        tasksWithFormattedTime.sort((a, b) => moment(a.start_time, 'HH:mm').diff(moment(b.start_time, 'HH:mm')));
        setTasks(tasksWithFormattedTime);
      } else {
        throw new Error('NO HAY TAREAS ESE DIA/Failed to load tasks');
      }
    } catch (error) {
      console.log("Error fetching tasks:", error.message);
      setTasks([]); // Vaciando la lista de tareas en caso de error
    }
  }, []);

  // Se usa el useCallback para hacer que refreshTasks sea estable entre renders
  const refreshTasks = useCallback((date) => {
    loadTasks(date);
  }, [loadTasks]);

  return (
    <TasksContext.Provider value={{ tasks, setTasks, refreshTasks }}>
      {children}
    </TasksContext.Provider>
  );
};
