// api.js
export const authenticateUser = async (username, password) => {
    try {
      const response = await fetch('http://192.168.174.71:3000/auth', { 
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
    const response = await fetch(`http://192.168.100.15:3000/register`, {
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

  