import axios from 'axios';

const API_URL = 'http://localhost:5000/api/content';

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
