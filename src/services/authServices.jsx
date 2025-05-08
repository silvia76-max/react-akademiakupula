const BASE_URL = "http://127.0.0.1:5000"; // Solo la base

// Función para hacer las peticiones con fetch
const request = async (endpoint, method, body = null) => {
  const token = localStorage.getItem('token');
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    credentials: 'include', 
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      // Si el token expiró o es inválido
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirige al login
      }
      throw new Error(data.message || 'Error en la solicitud');
    }
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

// Funciones de autenticación utilizando fetch
export const register = (formData) => request('/api/auth/register', 'POST', formData);

export const login = (formData) => request('/api/auth/login', 'POST', formData);

export const getProfile = () => request('/api/auth/profile', 'GET');
