// src/services/adminService.js

import axios from 'axios';

// URLs base
const API_URL = '/api/admin';
const COURSES_API_URL = '/api/cursos';

/**
 * Recupera el token de autenticación almacenado en localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('akademia_auth_token');
};

// Interceptor para añadir el token y el header Content-Type a cada petición
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores 401 (autorizar de nuevo al usuario)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si recibimos 401, limpiamos los datos de autenticación
      localStorage.removeItem('akademia_auth_token');
      localStorage.removeItem('akademia_user_data');
      localStorage.removeItem('akademia_token_expiry');
      localStorage.removeItem('akademia_session_id');
    }
    return Promise.reject(error);
  }
);

/* ───────────────────────────────────────────────────────────────────────────────
   Sección: Usuarios
   ───────────────────────────────────────────────────────────────────────────── */
export const getUsers = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}/users?page=${page}&per_page=${perPage}`);
    return response.data.data || [];
  } catch {
    return [];
  }
};

export const getUser = async (userId) => {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, userData);
  return response.data.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};

/* ───────────────────────────────────────────────────────────────────────────────
   Sección: Contactos
   ───────────────────────────────────────────────────────────────────────────── */
export const getContacts = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}/contacts?page=${page}&per_page=${perPage}`);
    return response.data.data || [];
  } catch {
    return [];
  }
};

export const deleteContact = async (contactId) => {
  const response = await axios.delete(`${API_URL}/contacts/${contactId}`);
  return response.data;
};

export const replyToContact = async (contactId, replyText) => {
  const response = await axios.post(`${API_URL}/contacts/${contactId}/reply`, { replyText });
  return response.data;
};

/* ───────────────────────────────────────────────────────────────────────────────
   Sección: Cursos (público)
   ───────────────────────────────────────────────────────────────────────────── */
export const getCourses = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${COURSES_API_URL}/?page=${page}&per_page=${perPage}`);
    return response.data.data || [];
  } catch {
    return [];
  }
};

export const getCourse = async (courseId) => {
  const response = await axios.get(`${COURSES_API_URL}/${courseId}`);
  return response.data.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await axios.put(`${API_URL}/courses/${courseId}`, courseData);
  return response.data.data;
};

export const deleteCourse = async (courseId) => {
  const response = await axios.delete(`${API_URL}/courses/${courseId}`);
  return response.data;
};

/* ───────────────────────────────────────────────────────────────────────────────
   Sección: Órdenes
   ───────────────────────────────────────────────────────────────────────────── */
export const getOrders = async (page = 1, perPage = 10, filters = {}) => {
  let queryParams = `page=${page}&per_page=${perPage}`;
  if (filters.status) queryParams += `&status=${filters.status}`;
  if (filters.dateFrom) queryParams += `&date_from=${filters.dateFrom}`;
  if (filters.dateTo) queryParams += `&date_to=${filters.dateTo}`;
  try {
    const response = await axios.get(`${API_URL}/orders?${queryParams}`);
    return response.data.data || [];
  } catch {
    return [];
  }
};

export const getOrder = async (orderId) => {
  const response = await axios.get(`${API_URL}/orders/${orderId}`);
  return response.data.data;
};

/* ───────────────────────────────────────────────────────────────────────────────
   Sección: Sesiones
   ───────────────────────────────────────────────────────────────────────────── */

// implementamos getAllSessions para obtener todas las sesiones (vista admin)
export const getAllSessions = async (page = 1, perPage = 50) => {
  try {
    const response = await axios.get(`${API_URL}/sessions?page=${page}&per_page=${perPage}`);
    return response.data.data || [];
  } catch {
    return [];
  }
};

/**
 * Alias para getAllSessions. 
 * De esta forma, tu SessionsManager.jsx puede importar “getUserSessions”
 * y funcionará correctamente.
 */
export const getUserSessions = async () => {
  // Si quisieras filtrar por usuario, podrías aceptar un parámetro userId.
  // En este ejemplo se devuelven todas las sesiones y luego el componente filtra si es necesario.
  return await getAllSessions();
};

/**
 * Finaliza una sesión concreta (o, si quisieras, podrías detectarlo en el componente
 * y mandar sessionId === 'all' a otro endpoint).
 */
export const endSession = async (sessionId) => {
  const response = await axios.delete(`${API_URL}/sessions/${sessionId}`);
  // Devuelve true si HTTP 200, o lanza error si no
  return response.data;
};

/* ───────────────────────────────────────────────────────────────────────────────
   Sección: Dashboard
   ───────────────────────────────────────────────────────────────────────────── */
export const getDashboardData = async () => {
  try {
    const [users, contacts, courses, sales] = await Promise.all([
      getUsers(1, 100),
      getContacts(1, 100),
      getCourses(1, 100),
      getOrders(1, 100)
    ]);
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
  } catch {
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
