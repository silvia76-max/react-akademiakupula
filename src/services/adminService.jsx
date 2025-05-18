import axios from 'axios';

// Usar la URL relativa para que funcione con el proxy de Vite
const API_URL = '/api/admin';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('akademia_auth_token');
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

      // Si no hay token pero es una solicitud al panel de administración,
      // verificar si el usuario es admin@gmail.com
      const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
      if (userData && userData.email === 'admin@gmail.com') {
        console.log('Interceptor: Usuario admin@gmail.com detectado, añadiendo cabecera especial');
        config.headers['X-Admin-Access'] = 'true';
        config.headers['X-Admin-Email'] = 'admin@gmail.com';
      }
    }

    // Añadir cabeceras CORS
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Content-Type'] = 'application/json';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Admin-Access';

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
      // Usar las claves correctas
      localStorage.removeItem('akademia_auth_token');
      localStorage.removeItem('akademia_user_data');
      localStorage.removeItem('akademia_token_expiry');
      localStorage.removeItem('akademia_session_id');
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
    // Verificar si el usuario es administrador
    const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
    const isAdmin = userData && (userData.email === 'admin@gmail.com' || userData.isAdmin === true);
    console.log('¿Usuario es administrador?', isAdmin);

    // Si no es administrador, rechazar la solicitud
    if (!isAdmin) {
      console.error('El usuario no tiene permisos de administrador');
      throw new Error('No tienes permisos para acceder al panel de administración');
    }

    // Obtener token de autenticación
    const token = localStorage.getItem('akademia_auth_token');

    // Configurar cabeceras para la solicitud
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (userData.email === 'admin@gmail.com') {
      headers['X-Admin-Access'] = 'true';
      headers['X-Admin-Email'] = 'admin@gmail.com';
    }

    // Intentar obtener datos reales del backend
    try {
      console.log('Intentando obtener datos del dashboard...');

      // Intentar con la primera ruta
      try {
        const response = await axios.get(`${API_URL}/dashboard`, { headers });
        console.log('Respuesta del servidor:', response.data);
        return response.data.data;
      } catch (error1) {
        console.error('Error con la primera ruta:', error1.message);

        // Intentar con una ruta alternativa
        try {
          const response2 = await axios.get(`/api/admin/dashboard`, { headers });
          console.log('Respuesta del servidor (ruta alternativa):', response2.data);
          return response2.data.data;
        } catch (error2) {
          console.error('Error con la segunda ruta:', error2.message);

          // Si ambas rutas fallan, intentar obtener datos de las tablas individuales
          console.log('Intentando construir dashboard a partir de datos individuales...');

          // Obtener usuarios
          const usersPromise = axios.get(`${API_URL}/users`, { headers })
            .catch(e => ({ data: { data: [] } }));

          // Obtener contactos
          const contactsPromise = axios.get(`${API_URL}/contacts`, { headers })
            .catch(e => ({ data: { data: [] } }));

          // Obtener cursos
          const coursesPromise = axios.get(`${API_URL}/courses`, { headers })
            .catch(e => ({ data: { data: [] } }));

          // Obtener ventas
          const salesPromise = axios.get(`${API_URL}/orders`, { headers })
            .catch(e => ({ data: { data: [] } }));

          // Esperar a que todas las promesas se resuelvan
          const [usersResponse, contactsResponse, coursesResponse, salesResponse] =
            await Promise.all([usersPromise, contactsPromise, coursesPromise, salesPromise]);

          // Construir objeto de dashboard
          const users = usersResponse.data.data || [];
          const contacts = contactsResponse.data.data || [];
          const courses = coursesResponse.data.data || [];
          const sales = salesResponse.data.data || [];

          return {
            stats: {
              total_users: users.length,
              total_contacts: contacts.length,
              total_courses: courses.length,
              total_sales: sales.length
            },
            recent_users: users.slice(0, 5),
            recent_contacts: contacts.slice(0, 5)
          };
        }
      }
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);

      // Mostrar más detalles del error
      if (error.response) {
        console.error('Datos de la respuesta de error:', error.response.data);
        console.error('Estado HTTP:', error.response.status);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
      } else {
        console.error('Error al configurar la solicitud:', error.message);
      }

      // Devolver un objeto vacío para evitar errores en la interfaz
      return {
        stats: {
          total_users: 0,
          total_contacts: 0,
          total_courses: 0,
          total_sales: 0
        },
        recent_users: [],
        recent_contacts: [],
        error: 'No se pudieron cargar los datos del dashboard'
      };
    }
  } catch (error) {
    console.error('Error general al obtener datos del dashboard:', error);
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
