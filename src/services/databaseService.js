// Servicio para interactuar con las tablas de la base de datos akademiaKupula.db

// URL base para las peticiones a la API
const API_BASE_URL = '/api/admin';

/**
 * Obtiene los datos de una tabla específica de la base de datos
 * @param {string} tableName - Nombre de la tabla
 * @returns {Promise<Array>} - Promesa con los datos de la tabla
 */
export const getTableData = async (tableName) => {
  try {
    console.log(`Obteniendo datos de la tabla ${tableName}...`);

    // Verificar si el usuario es administrador
    const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
    const isAdmin = userData && (userData.email === 'admin@gmail.com' || userData.isAdmin === true);
    console.log('¿Usuario es administrador?', isAdmin, userData);

    if (!isAdmin) {
      console.error('El usuario no tiene permisos de administrador');
      throw new Error('No tienes permisos para acceder a los datos de la base de datos');
    }

    // Obtener token de autenticación si existe
    const token = localStorage.getItem('akademia_auth_token');
    console.log('Token de autenticación:', token ? 'Existe' : 'No existe');

    // Configurar opciones de la petición
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Añadir token si existe
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Añadir cabeceras especiales para el administrador
    if (userData.email === 'admin@gmail.com') {
      options.headers['X-Admin-Access'] = 'true';
      options.headers['X-Admin-Email'] = 'admin@gmail.com';
    }

    const url = `${API_BASE_URL}/${tableName}`;
    console.log(`Realizando petición a: ${url}`, options);

    // Realizar la petición a la API
    const response = await fetch(url, options);
    console.log(`Respuesta de la API para ${tableName}:`, response.status, response.statusText);

    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta para obtener más detalles del error
      let errorBody = '';
      try {
        errorBody = await response.text();
        console.error(`Cuerpo de la respuesta de error:`, errorBody);
      } catch (e) {
        console.error('No se pudo leer el cuerpo de la respuesta de error');
      }

      throw new Error(`Error al obtener datos de la tabla ${tableName}: ${response.status} ${response.statusText}. Detalles: ${errorBody}`);
    }

    const data = await response.json();
    console.log(`Datos obtenidos de la tabla ${tableName}:`, data);

    // Devolver los datos en el formato adecuado
    if (Array.isArray(data)) {
      console.log(`Devolviendo array de datos con ${data.length} elementos`);
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      console.log(`Devolviendo data.data con ${data.data.length} elementos`);
      return data.data;
    } else {
      console.log('No se encontraron datos en formato array, devolviendo array vacío');
      return [];
    }
  } catch (error) {
    console.error(`Error al obtener datos de la tabla ${tableName}:`, error);

    // Si hay un error, devolver un array vacío
    return [];
  }
};

/**
 * Obtiene los datos de la tabla de usuarios
 * @returns {Promise<Array>} - Promesa con los datos de la tabla
 */
export const getUsersTable = async () => {
  return getTableData('users');
};

/**
 * Obtiene los datos de la tabla de cursos
 * @returns {Promise<Array>} - Promesa con los datos de la tabla
 */
export const getCoursesTable = async () => {
  return getTableData('courses');
};

/**
 * Obtiene los datos de la tabla de mensajes de contacto
 * @returns {Promise<Array>} - Promesa con los datos de la tabla
 */
export const getContactsTable = async () => {
  return getTableData('contacts');
};

/**
 * Obtiene los datos de la tabla de órdenes/ventas
 * @returns {Promise<Array>} - Promesa con los datos de la tabla
 */
export const getOrdersTable = async () => {
  return getTableData('orders');
};

/**
 * Obtiene los datos de la tabla de sesiones
 * @returns {Promise<Array>} - Promesa con los datos de la tabla
 */
export const getSessionsTable = async () => {
  return getTableData('sessions');
};

/**
 * Obtiene los datos de la tabla de lista de deseos
 * @returns {Promise<Array>} - Promesa con los datos de la tabla
 */
export const getWishlistTable = async () => {
  return getTableData('wishlist');
};

/**
 * Obtiene los datos de la tabla de carrito
 * @returns {Promise<Array>} - Promesa con los datos de la tabla
 */
export const getCartTable = async () => {
  return getTableData('cart');
};

/**
 * Ejecuta una consulta SQL personalizada (solo para administradores)
 * @param {string} query - Consulta SQL a ejecutar
 * @returns {Promise<Object>} - Promesa con el resultado de la consulta
 */
export const executeQuery = async (query) => {
  try {
    console.log('Ejecutando consulta SQL personalizada:', query);

    // Verificar si el usuario es administrador
    const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
    const isAdmin = userData && (userData.email === 'admin@gmail.com' || userData.isAdmin === true);

    if (!isAdmin) {
      console.error('El usuario no tiene permisos de administrador');
      throw new Error('No tienes permisos para ejecutar consultas SQL');
    }

    // Obtener token de autenticación si existe
    const token = localStorage.getItem('akademia_auth_token');

    // Configurar opciones de la petición
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    };

    // Añadir token si existe
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Realizar la petición a la API
    const response = await fetch(`${API_BASE_URL}/db/query`, options);

    if (!response.ok) {
      throw new Error(`Error al ejecutar la consulta: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resultado de la consulta:', data);

    return {
      success: true,
      data: data.data || [],
      message: data.message || 'Consulta ejecutada correctamente'
    };
  } catch (error) {
    console.error('Error al ejecutar la consulta SQL:', error);

    return {
      success: false,
      data: [],
      message: error.message || 'Error al ejecutar la consulta SQL'
    };
  }
};
