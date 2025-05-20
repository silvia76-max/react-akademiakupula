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
    console.log('Interceptor: Respuesta exitosa recibida', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Interceptor: Error en la respuesta:', {
      url: error.config?.url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

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

    console.log('Obteniendo datos del dashboard...');

    // Crear un objeto para almacenar los resultados
    let users = [];
    let contacts = [];
    let courses = [];
    let sales = [];

    // Intentar obtener usuarios
    try {
      console.log('Obteniendo usuarios...');
      const usersResponse = await axios.get(`${API_URL}/users`);
      users = usersResponse.data.data || [];
      console.log('Usuarios obtenidos:', users.length);
    } catch (userError) {
      console.error('Error al obtener usuarios:', userError);
      users = [];
    }

    // Intentar obtener contactos
    try {
      console.log('Obteniendo contactos...');
      const contactsResponse = await axios.get(`${API_URL}/contacts`);
      contacts = contactsResponse.data.data || [];
      console.log('Contactos obtenidos:', contacts.length);
    } catch (contactError) {
      console.error('Error al obtener contactos:', contactError);
      contacts = [];
    }

    // Intentar obtener cursos
    try {
      console.log('Obteniendo cursos...');
      const coursesResponse = await axios.get(`${API_URL}/courses`);
      courses = coursesResponse.data.data || [];
      console.log('Cursos obtenidos:', courses.length);
    } catch (courseError) {
      console.error('Error al obtener cursos:', courseError);
      courses = [];
    }

    // Intentar obtener ventas
    try {
      console.log('Obteniendo ventas...');
      const salesResponse = await axios.get(`${API_URL}/orders`);
      sales = salesResponse.data.data || [];
      console.log('Ventas obtenidas:', sales.length);
    } catch (salesError) {
      console.error('Error al obtener ventas:', salesError);
      sales = [];
    }

    // Construir objeto de dashboard con los datos obtenidos
    const dashboardData = {
      stats: {
        total_users: users.length,
        total_contacts: contacts.length,
        total_courses: courses.length,
        total_sales: sales.length
      },
      recent_users: users.slice(0, 5),
      recent_contacts: contacts.slice(0, 5)
    };

    console.log('Datos del dashboard construidos:', dashboardData);
    return dashboardData;
  } catch (error) {
    console.error('Error general al obtener datos del dashboard:', error);

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
};

/**
 * Obtiene la lista de usuarios
 * @param {number} page - Número de página
 * @param {number} perPage - Elementos por página
 * @returns {Promise} Promesa con la lista de usuarios
 */
export const getUsers = async (page = 1, perPage = 10) => {
  try {
    console.log(`Obteniendo usuarios de ${API_URL}/users?page=${page}&per_page=${perPage}`);
    const response = await axios.get(`${API_URL}/users?page=${page}&per_page=${perPage}`);

    console.log('Respuesta de la API:', response.data);
    const users = response.data.data || [];
    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);

    if (error.response) {
      console.error('Detalles del error:', {
        status: error.response.status,
        data: error.response.data
      });
    }

    // Devolver un array vacío en caso de error
    return [];
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
    const contacts = response.data.data || [];
    return contacts;
  } catch (error) {
    console.error('Error al obtener mensajes de contacto:', error);
    // Devolver un array vacío en caso de error
    return [];
  }
};

/**
 * Obtiene la lista de cursos
 * @param {number} page - Número de página
 * @param {number} perPage - Elementos por página
 * @returns {Promise} Promesa con la lista de cursos
 */
export const getCourses = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}/courses?page=${page}&per_page=${perPage}`);
    const courses = response.data.data || [];
    return courses;
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    // Devolver un array vacío en caso de error
    return [];
  }
};

/**
 * Obtiene un curso específico
 * @param {number} courseId - ID del curso
 * @returns {Promise} Promesa con los datos del curso
 */
export const getCourse = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/courses/${courseId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener curso ${courseId}:`, error);
    throw error;
  }
};

/**
 * Actualiza un curso
 * @param {number} courseId - ID del curso
 * @param {Object} courseData - Datos actualizados del curso
 * @returns {Promise} Promesa con los datos actualizados del curso
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axios.put(`${API_URL}/courses/${courseId}`, courseData);
    return response.data.data;
  } catch (error) {
    console.error(`Error al actualizar curso ${courseId}:`, error);
    throw error;
  }
};

/**
 * Elimina un curso
 * @param {number} courseId - ID del curso
 * @returns {Promise} Promesa con el resultado de la operación
 */
export const deleteCourse = async (courseId) => {
  try {
    const response = await axios.delete(`${API_URL}/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar curso ${courseId}:`, error);
    throw error;
  }
};

/**
 * Obtiene la lista de órdenes/ventas
 * @param {number} page - Número de página
 * @param {number} perPage - Elementos por página
 * @param {Object} filters - Filtros para las órdenes (status, dateFrom, dateTo)
 * @returns {Promise} Promesa con la lista de órdenes
 */
export const getOrders = async (page = 1, perPage = 10, filters = {}) => {
  try {
    // Construir parámetros de consulta
    let queryParams = `page=${page}&per_page=${perPage}`;

    // Añadir filtros si existen
    if (filters.status) {
      queryParams += `&status=${filters.status}`;
    }
    if (filters.dateFrom) {
      queryParams += `&date_from=${filters.dateFrom}`;
    }
    if (filters.dateTo) {
      queryParams += `&date_to=${filters.dateTo}`;
    }

    const response = await axios.get(`${API_URL}/orders?${queryParams}`);
    const orders = response.data.data || [];
    return orders;
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    // Devolver un array vacío en caso de error
    return [];
  }
};

/**
 * Obtiene una orden específica
 * @param {number} orderId - ID de la orden
 * @returns {Promise} Promesa con los datos de la orden
 */
export const getOrder = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener orden ${orderId}:`, error);
    throw error;
  }
};

/**
 * Obtiene la lista de sesiones
 * @param {number} page - Número de página
 * @param {number} perPage - Elementos por página
 * @returns {Promise} Promesa con la lista de sesiones
 */
export const getSessions = async (page = 1, perPage = 50) => {
  try {
    console.log(`Obteniendo sesiones de ${API_URL}/sessions?page=${page}&per_page=${perPage}`);
    const response = await axios.get(`${API_URL}/sessions?page=${page}&per_page=${perPage}`);

    console.log('Respuesta de la API:', response.data);
    const sessions = response.data.data || [];
    return sessions;
  } catch (error) {
    console.error('Error al obtener sesiones:', error);

    if (error.response) {
      console.error('Detalles del error:', {
        status: error.response.status,
        data: error.response.data
      });
    }

    // Devolver un array vacío en caso de error
    return [];
  }
};

/**
 * Finaliza una sesión específica
 * @param {string} sessionId - ID de la sesión
 * @returns {Promise} Promesa con el resultado de la operación
 */
export const endSession = async (sessionId) => {
  try {
    const response = await axios.delete(`${API_URL}/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al finalizar sesión ${sessionId}:`, error);
    throw error;
  }
};

/**
 * Elimina un mensaje de contacto
 * @param {number} contactId - ID del mensaje de contacto
 * @returns {Promise} Promesa con el resultado de la operación
 */
export const deleteContact = async (contactId) => {
  try {
    const response = await axios.delete(`${API_URL}/contacts/${contactId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar mensaje de contacto ${contactId}:`, error);
    throw error;
  }
};

/**
 * Responde a un mensaje de contacto
 * @param {number} contactId - ID del mensaje de contacto
 * @param {string} replyText - Texto de la respuesta
 * @returns {Promise} Promesa con el resultado de la operación
 */
export const replyToContact = async (contactId, replyText) => {
  try {
    const response = await axios.post(`${API_URL}/contacts/${contactId}/reply`, { replyText });
    return response.data;
  } catch (error) {
    console.error(`Error al responder mensaje de contacto ${contactId}:`, error);
    throw error;
  }
};
