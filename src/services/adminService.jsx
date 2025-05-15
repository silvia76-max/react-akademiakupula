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
      console.log('Interceptor: Token añadido a la solicitud');
    } else {
      console.warn('Interceptor: No se encontró token de autenticación');
    }

    // Añadir cabeceras CORS
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Content-Type'] = 'application/json';

    console.log('Interceptor: Configuración de la solicitud:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });

    return config;
  },
  error => {
    console.error('Interceptor: Error en la configuración de la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
axios.interceptors.response.use(
  response => {
    console.log('Interceptor: Respuesta exitosa recibida');
    return response;
  },
  error => {
    console.error('Interceptor: Error en la respuesta:', error);

    // Si el error es 401 (No autorizado), podría ser un problema con el token
    if (error.response && error.response.status === 401) {
      console.warn('Interceptor: Error de autenticación. Limpiando token...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Aquí podrías redirigir al login si lo deseas
    }

    return Promise.reject(error);
  }
);

/**
 * Obtiene los datos del dashboard de administración
 * @returns {Promise} Promesa con los datos del dashboard
 */
export const getDashboardData = async () => {
  try {
    // Verificar si estamos en modo desarrollo
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log('Modo de desarrollo:', isDevelopment ? 'Sí' : 'No');

    // Verificar el token antes de hacer la solicitud
    const token = localStorage.getItem('token');
    console.log('Token antes de la solicitud:', token ? `${token.substring(0, 15)}...` : 'No hay token');

    // Mostrar la URL completa a la que se está haciendo la solicitud
    console.log('URL de la solicitud:', `${API_URL}/dashboard`);

    // Si estamos en desarrollo y no hay conexión con el backend, podemos devolver datos simulados
    if (isDevelopment) {
      console.log('Intentando conectar con el backend...');
      try {
        // Intentar hacer la solicitud real primero
        const response = await axios.get(`${API_URL}/dashboard`);
        console.log('Respuesta del servidor:', response.data);
        return response.data.data;
      } catch (backendError) {
        console.warn('No se pudo conectar con el backend. Usando datos simulados:', backendError.message);

        // Si no podemos conectar con el backend, devolver datos simulados
        return {
          stats: {
            total_users: 15,
            total_contacts: 8,
            total_courses: 5,
            total_sales: 12
          },
          recent_users: [
            { id: 1, full_name: 'Usuario Simulado 1', email: 'usuario1@example.com', created_at: new Date().toISOString() },
            { id: 2, full_name: 'Usuario Simulado 2', email: 'usuario2@example.com', created_at: new Date().toISOString() }
          ],
          recent_contacts: [
            { id: 1, nombre: 'Contacto Simulado 1', email: 'contacto1@example.com', fecha_creacion: new Date().toISOString() },
            { id: 2, nombre: 'Contacto Simulado 2', email: 'contacto2@example.com', fecha_creacion: new Date().toISOString() }
          ]
        };
      }
    } else {
      // En producción, hacer la solicitud normal
      const response = await axios.get(`${API_URL}/dashboard`);
      return response.data.data;
    }
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);

    // Mostrar más detalles del error
    if (error.response) {
      console.error('Datos de la respuesta de error:', error.response.data);
      console.error('Estado HTTP:', error.response.status);
      console.error('Cabeceras:', error.response.headers);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }

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
