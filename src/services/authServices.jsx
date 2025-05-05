const BASE_URL = "http://127.0.0.1:5000"; // Solo la base

// Función para obtener el token
const getToken = () => localStorage.getItem('token');

// Función para hacer las peticiones con fetch
const request = async (endpoint, method, body = null) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method: method,
    headers: headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + endpoint, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error en la solicitud: ${error.message || 'No se pudo completar la solicitud'}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

// Funciones de autenticación utilizando fetch
export const register = (formData) => request('/api/auth/register', 'POST', formData);

export const login = (formData) => request('/api/auth/login', 'POST', formData);

export const getProfile = () => request('/api/auth/profile', 'GET');
