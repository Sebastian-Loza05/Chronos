// api.js
const ip = '192.168.0.16'
export const api_user = "http://" + ip + ":3000/"
export const api_profile = "http://" + ip + ":3001/"
export const api_tasks = "http://" + ip + ":3002/"

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

  
