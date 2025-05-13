import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Configurar interceptor para incluir el token en todas las peticiones
axios.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Obtiene los datos del dashboard de administración
 * @returns {Promise} Promesa con los datos del dashboard
 */
export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de usuarios
 * @param {number} page - Número de página
 * @param {number} perPage - Elementos por página
 * @returns {Promise} Promesa con la lista de usuarios
 */
export const getUsers = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}/users?page=${page}&per_page=${perPage}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario específico
 * @param {number} userId - ID del usuario
 * @returns {Promise} Promesa con los datos del usuario
 */
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Actualiza un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise} Promesa con los datos actualizados del usuario
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData);
    return response.data.data;
  } catch (error) {
    console.error(`Error al actualizar usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Elimina un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise} Promesa con el resultado de la operación
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Obtiene la lista de mensajes de contacto
 * @param {number} page - Número de página
 * @param {number} perPage - Elementos por página
 * @returns {Promise} Promesa con la lista de mensajes de contacto
 */
export const getContacts = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}/contacts?page=${page}&per_page=${perPage}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener mensajes de contacto:', error);
    throw error;
  }
};
