import axios from 'axios';

// Usar la URL relativa para que funcione con el proxy de Vite
const API_URL = '/api/content';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('akademia_auth_token');
};

// Configurar interceptor para incluir el token en todas las peticiones
axios.interceptors.request.use(
  config => {
    // Verificar si la URL ya tiene un interceptor configurado
    if (config.url && config.url.includes('/api/content')) {
      const token = getAuthToken();
      if (token) {
        console.log('ContentService: Token encontrado, añadiendo a la solicitud');
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('ContentService: No se encontró token de autenticación');

        // Si no hay token pero es una solicitud de administrador, añadir cabecera especial
        const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
        if (userData && userData.email === 'admin@gmail.com') {
          console.log('ContentService: Usuario admin@gmail.com detectado, añadiendo cabecera especial');
          config.headers['X-Admin-Access'] = 'true';
          config.headers['X-Admin-Email'] = 'admin@gmail.com';
        }
      }

      // Añadir cabeceras CORS
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Admin-Access';

      console.log('ContentService: Configuración de la solicitud:', {
        url: config.url,
        method: config.method,
        headers: config.headers
      });
    }

    return config;
  },
  error => {
    console.error('ContentService: Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

/**
 * Obtiene contenido filtrado por sección y/o tipo
 * @param {string} section - Sección del contenido (opcional)
 * @param {string} type - Tipo de contenido (opcional)
 * @param {boolean} activeOnly - Si solo se deben obtener contenidos activos
 * @returns {Promise} Promesa con el contenido
 */
export const getContents = async (section = null, type = null, activeOnly = true) => {
  try {
    let url = API_URL;
    const params = new URLSearchParams();

    if (section) params.append('section', section);
    if (type) params.append('type', type);
    params.append('active_only', activeOnly.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener contenido:', error);
    throw error;
  }
};

/**
 * Obtiene un contenido específico por su ID
 * @param {number} contentId - ID del contenido
 * @returns {Promise} Promesa con el contenido
 */
export const getContent = async (contentId) => {
  try {
    const response = await axios.get(`${API_URL}/${contentId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener contenido ${contentId}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo contenido
 * @param {FormData} formData - Datos del contenido en formato FormData
 * @returns {Promise} Promesa con el contenido creado
 */
export const createContent = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error al crear contenido:', error);
    throw error;
  }
};

/**
 * Actualiza un contenido existente
 * @param {number} contentId - ID del contenido
 * @param {FormData} formData - Datos actualizados del contenido en formato FormData
 * @returns {Promise} Promesa con el contenido actualizado
 */
export const updateContent = async (contentId, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${contentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error al actualizar contenido ${contentId}:`, error);
    throw error;
  }
};

/**
 * Elimina un contenido
 * @param {number} contentId - ID del contenido
 * @returns {Promise} Promesa con el resultado de la operación
 */
export const deleteContent = async (contentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${contentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar contenido ${contentId}:`, error);
    throw error;
  }
};
