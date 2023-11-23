// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';


const ip = '192.168.51.253'
// const ip = '192.168.0.12'

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
        pais : formData.pais,
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
    console.log('Sending data to API:', JSON.stringify(formData)); 
    const response = await fetch(api_tasks + 'tasks/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData)
    });

    const responseJson = await response.json();

    return responseJson;
  } catch (error) {
    console.error('Error in getTasksDate:', error);
    throw(error);
  }
};


export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      return { error: 'No se encontró el token de autenticación.' };
    }

    const response = await fetch(api_profile + 'profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return { profile: data.profile };
    } else {
      return { error: data.error || 'Error al obtener el perfil de usuario.' };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { error: 'Hubo un problema al conectarse con el servidor.' };
  }
};

export const updateUserProfile = async (photoURL) => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Obteniendo el token de autenticación del usuario
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await fetch(api_profile + 'profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        foto: photoURL,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar el perfil.');
    }
    return data; // Devuelve los datos actualizados
  } catch (error) {
    console.error('Error updating user profile:', error);
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
    if (response.status === 401) {
      return { msg: 'Token inválido' };
    }
    return await response.blob();
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

export const changeVoice = async (formData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(api_IA + 'voice/change', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData)
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}


  
