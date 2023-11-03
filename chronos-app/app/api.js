// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const ip = '192.168.14.170'
// const ip = '192.168.100.15'

export const api_user = "http://" + ip + ":3000/"
export const api_profile = "http://" + ip + ":3001/"
export const api_tasks = "http://" + ip + ":3002/"
export const api_IA = "http://" + ip + ":3003/"

export const authenticateUser = async (username, password) => {
    try {
      const response = await fetch(api_user + 'auth', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      return data;
    } catch (error) {
      throw error;
    }
  };

export const registerUser = async (formData) => {
  try {
    const response = await fetch(api_profile + `/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        nombre: formData.name,
        apellido: formData.lastname,
        genero:formData.gender,
        fecha_nacimiento : formData.birthday,
        pais : formData.country,
        celular : formData.phone,
        correo : formData.email,
      }),

    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const loginByToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(api_user + 'auth/token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })

    return await response.json()
  } catch (error) {
    throw(error);
  }
};

export const getTasksDate = async (formData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    console.log('Sending data to API:', JSON.stringify(formData)); // Asegúrate de que los datos son correctos
    const response = await fetch(api_tasks + 'tasks/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData)
    });

    console.log('Response status:', response.status);
    const responseJson = await response.json();
    console.log('Response from API:', responseJson);

    return responseJson;
  } catch (error) {
    console.error('Error in getTasksDate:', error);
    throw(error);
  }
};

export const sendAudio = async (formData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(api_IA + 'voice/recomendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    })

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const createTask = async (formData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(api_tasks + 'task', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },

      body: JSON.stringify(formData)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateTask = async (taskId, formData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(api_tasks + `task/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la tarea');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};


  
