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
  