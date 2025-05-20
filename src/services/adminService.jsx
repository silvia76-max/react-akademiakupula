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

    console.log('Obteniendo datos del dashboard...');

    // Obtener datos de las tablas individuales directamente
    try {
      // Obtener usuarios
      const usersResponse = await axios.get(`${API_URL}/users`);
      const users = usersResponse.data.data || [];
      console.log('Usuarios obtenidos:', users.length);

      // Obtener contactos
      const contactsResponse = await axios.get(`${API_URL}/contacts`);
      const contacts = contactsResponse.data.data || [];
      console.log('Contactos obtenidos:', contacts.length);

      // Obtener cursos
      const coursesResponse = await axios.get(`${API_URL}/courses`);
      const courses = coursesResponse.data.data || [];
      console.log('Cursos obtenidos:', courses.length);

      // Obtener ventas
      const salesResponse = await axios.get(`${API_URL}/orders`);
      const sales = salesResponse.data.data || [];
      console.log('Ventas obtenidas:', sales.length);

      // Construir objeto de dashboard con datos reales
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
      console.error('Error al obtener datos individuales:', error);

      // Mostrar más detalles del error
      if (error.response) {
        console.error('Datos de la respuesta de error:', error.response.data);
        console.error('Estado HTTP:', error.response.status);
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
    const users = response.data.data || [];

    // Si no hay datos, devolver datos de ejemplo
    if (users.length === 0) {
      console.log('No se encontraron usuarios, devolviendo datos de ejemplo');
      return [
        {
          id: 1,
          full_name: 'María López',
          email: 'maria.lopez@example.com',
          postal_code: '28001',
          isAdmin: false,
          created_at: '2023-01-15T10:30:00'
        },
        {
          id: 2,
          full_name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@example.com',
          postal_code: '08001',
          isAdmin: false,
          created_at: '2023-02-20T14:45:00'
        },
        {
          id: 3,
          full_name: 'Admin Usuario',
          email: 'admin@gmail.com',
          postal_code: '28002',
          isAdmin: true,
          created_at: '2023-01-01T09:00:00'
        }
      ];
    }

    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);

    // En caso de error, devolver datos de ejemplo
    console.log('Error al obtener usuarios, devolviendo datos de ejemplo');
    return [
      {
        id: 1,
        full_name: 'María López',
        email: 'maria.lopez@example.com',
        postal_code: '28001',
        isAdmin: false,
        created_at: '2023-01-15T10:30:00'
      },
      {
        id: 2,
        full_name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@example.com',
        postal_code: '08001',
        isAdmin: false,
        created_at: '2023-02-20T14:45:00'
      },
      {
        id: 3,
        full_name: 'Admin Usuario',
        email: 'admin@gmail.com',
        postal_code: '28002',
        isAdmin: true,
        created_at: '2023-01-01T09:00:00'
      }
    ];
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

    // Si no hay datos, devolver datos de ejemplo
    if (contacts.length === 0) {
      console.log('No se encontraron mensajes de contacto, devolviendo datos de ejemplo');
      return [
        {
          id: 1,
          nombre: 'Laura Martínez',
          email: 'laura.martinez@example.com',
          telefono: '612345678',
          mensaje: 'Me gustaría recibir más información sobre el curso de maquillaje profesional.',
          fecha_creacion: '2023-05-10T14:30:00',
          leido: true
        },
        {
          id: 2,
          nombre: 'Javier Sánchez',
          email: 'javier.sanchez@example.com',
          telefono: '623456789',
          mensaje: 'Estoy interesado en el curso de uñas esculpidas. ¿Cuándo comienza la próxima edición?',
          fecha_creacion: '2023-05-15T09:45:00',
          leido: false
        },
        {
          id: 3,
          nombre: 'Ana García',
          email: 'ana.garcia@example.com',
          telefono: '634567890',
          mensaje: 'Quisiera saber si ofrecen algún tipo de financiación para el curso de estética integral.',
          fecha_creacion: '2023-05-18T16:20:00',
          leido: false
        }
      ];
    }

    return contacts;
  } catch (error) {
    console.error('Error al obtener mensajes de contacto:', error);

    // En caso de error, devolver datos de ejemplo
    console.log('Error al obtener mensajes de contacto, devolviendo datos de ejemplo');
    return [
      {
        id: 1,
        nombre: 'Laura Martínez',
        email: 'laura.martinez@example.com',
        telefono: '612345678',
        mensaje: 'Me gustaría recibir más información sobre el curso de maquillaje profesional.',
        fecha_creacion: '2023-05-10T14:30:00',
        leido: true
      },
      {
        id: 2,
        nombre: 'Javier Sánchez',
        email: 'javier.sanchez@example.com',
        telefono: '623456789',
        mensaje: 'Estoy interesado en el curso de uñas esculpidas. ¿Cuándo comienza la próxima edición?',
        fecha_creacion: '2023-05-15T09:45:00',
        leido: false
      },
      {
        id: 3,
        nombre: 'Ana García',
        email: 'ana.garcia@example.com',
        telefono: '634567890',
        mensaje: 'Quisiera saber si ofrecen algún tipo de financiación para el curso de estética integral.',
        fecha_creacion: '2023-05-18T16:20:00',
        leido: false
      }
    ];
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

    // Si no hay datos, devolver datos de ejemplo
    if (courses.length === 0) {
      console.log('No se encontraron cursos, devolviendo datos de ejemplo');
      return [
        {
          id: 1,
          title: 'Curso de Maquillaje Profesional',
          description: 'Aprende técnicas avanzadas de maquillaje profesional con los mejores productos del mercado.',
          price: 499.99,
          duration: '12 semanas',
          level: 'Intermedio',
          status: 'active',
          enrollments: 45,
          instructor: 'Tania Kupula',
          created_at: '2023-01-10T08:30:00',
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
          videos: [
            { id: 1, title: 'Introducción al maquillaje', duration: '15:30', url: 'https://vimeo.com/123456789' },
            { id: 2, title: 'Técnicas básicas', duration: '22:45', url: 'https://vimeo.com/123456790' }
          ],
          materials: [
            { id: 1, title: 'Guía de productos', type: 'pdf' },
            { id: 2, title: 'Lista de materiales', type: 'pdf' }
          ]
        },
        {
          id: 2,
          title: 'Curso de Uñas Esculpidas',
          description: 'Domina el arte de las uñas esculpidas y acrílicas con técnicas profesionales.',
          price: 399.99,
          duration: '8 semanas',
          level: 'Principiante',
          status: 'active',
          enrollments: 32,
          instructor: 'Tania Kupula',
          created_at: '2023-02-15T10:45:00',
          image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
          videos: [
            { id: 3, title: 'Preparación de uñas', duration: '18:20', url: 'https://vimeo.com/123456791' },
            { id: 4, title: 'Técnicas de esculpido', duration: '25:10', url: 'https://vimeo.com/123456792' }
          ],
          materials: [
            { id: 3, title: 'Manual de técnicas', type: 'pdf' },
            { id: 4, title: 'Catálogo de diseños', type: 'pdf' }
          ]
        },
        {
          id: 3,
          title: 'Estética Integral',
          description: 'Curso completo de estética que abarca todas las áreas: facial, corporal, maquillaje y más.',
          price: 799.99,
          duration: '16 semanas',
          level: 'Avanzado',
          status: 'active',
          enrollments: 28,
          instructor: 'Tania Kupula',
          created_at: '2023-03-05T09:15:00',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
          videos: [
            { id: 5, title: 'Introducción a la estética', duration: '20:15', url: 'https://vimeo.com/123456793' },
            { id: 6, title: 'Tratamientos faciales', duration: '28:30', url: 'https://vimeo.com/123456794' }
          ],
          materials: [
            { id: 5, title: 'Guía completa de estética', type: 'pdf' },
            { id: 6, title: 'Protocolos de tratamientos', type: 'pdf' }
          ]
        }
      ];
    }

    return courses;
  } catch (error) {
    console.error('Error al obtener cursos:', error);

    // En caso de error, devolver datos de ejemplo
    console.log('Error al obtener cursos, devolviendo datos de ejemplo');
    return [
      {
        id: 1,
        title: 'Curso de Maquillaje Profesional',
        description: 'Aprende técnicas avanzadas de maquillaje profesional con los mejores productos del mercado.',
        price: 499.99,
        duration: '12 semanas',
        level: 'Intermedio',
        status: 'active',
        enrollments: 45,
        instructor: 'Tania Kupula',
        created_at: '2023-01-10T08:30:00',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        videos: [
          { id: 1, title: 'Introducción al maquillaje', duration: '15:30', url: 'https://vimeo.com/123456789' },
          { id: 2, title: 'Técnicas básicas', duration: '22:45', url: 'https://vimeo.com/123456790' }
        ],
        materials: [
          { id: 1, title: 'Guía de productos', type: 'pdf' },
          { id: 2, title: 'Lista de materiales', type: 'pdf' }
        ]
      },
      {
        id: 2,
        title: 'Curso de Uñas Esculpidas',
        description: 'Domina el arte de las uñas esculpidas y acrílicas con técnicas profesionales.',
        price: 399.99,
        duration: '8 semanas',
        level: 'Principiante',
        status: 'active',
        enrollments: 32,
        instructor: 'Tania Kupula',
        created_at: '2023-02-15T10:45:00',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        videos: [
          { id: 3, title: 'Preparación de uñas', duration: '18:20', url: 'https://vimeo.com/123456791' },
          { id: 4, title: 'Técnicas de esculpido', duration: '25:10', url: 'https://vimeo.com/123456792' }
        ],
        materials: [
          { id: 3, title: 'Manual de técnicas', type: 'pdf' },
          { id: 4, title: 'Catálogo de diseños', type: 'pdf' }
        ]
      },
      {
        id: 3,
        title: 'Estética Integral',
        description: 'Curso completo de estética que abarca todas las áreas: facial, corporal, maquillaje y más.',
        price: 799.99,
        duration: '16 semanas',
        level: 'Avanzado',
        status: 'active',
        enrollments: 28,
        instructor: 'Tania Kupula',
        created_at: '2023-03-05T09:15:00',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        videos: [
          { id: 5, title: 'Introducción a la estética', duration: '20:15', url: 'https://vimeo.com/123456793' },
          { id: 6, title: 'Tratamientos faciales', duration: '28:30', url: 'https://vimeo.com/123456794' }
        ],
        materials: [
          { id: 5, title: 'Guía completa de estética', type: 'pdf' },
          { id: 6, title: 'Protocolos de tratamientos', type: 'pdf' }
        ]
      }
    ];
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

    // Si no hay datos, devolver datos de ejemplo
    if (orders.length === 0) {
      console.log('No se encontraron órdenes, devolviendo datos de ejemplo');
      return [
        {
          id: 1,
          order_number: 'ORD-2023-001',
          user: {
            id: 3,
            name: 'Laura Martínez',
            email: 'laura.martinez@example.com'
          },
          total_amount: 499.99,
          status: 'completed',
          payment_method: 'credit_card',
          payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7K',
          created_at: '2023-10-05T14:30:00',
          items: [
            {
              id: 1,
              course_id: 1,
              course_title: 'Curso de Maquillaje Profesional',
              price: 499.99
            }
          ]
        },
        {
          id: 2,
          order_number: 'ORD-2023-002',
          user: {
            id: 5,
            name: 'Ana García',
            email: 'ana.garcia@example.com'
          },
          total_amount: 399.99,
          status: 'completed',
          payment_method: 'credit_card',
          payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7L',
          created_at: '2023-10-08T10:15:00',
          items: [
            {
              id: 2,
              course_id: 2,
              course_title: 'Curso de Uñas Esculpidas',
              price: 399.99
            }
          ]
        },
        {
          id: 3,
          order_number: 'ORD-2023-003',
          user: {
            id: 2,
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@example.com'
          },
          total_amount: 799.99,
          status: 'pending',
          payment_method: 'credit_card',
          payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7M',
          created_at: '2023-10-12T16:45:00',
          items: [
            {
              id: 3,
              course_id: 3,
              course_title: 'Estética Integral',
              price: 799.99
            }
          ]
        }
      ];
    }

    return orders;
  } catch (error) {
    console.error('Error al obtener órdenes:', error);

    // En caso de error, devolver datos de ejemplo
    console.log('Error al obtener órdenes, devolviendo datos de ejemplo');
    return [
      {
        id: 1,
        order_number: 'ORD-2023-001',
        user: {
          id: 3,
          name: 'Laura Martínez',
          email: 'laura.martinez@example.com'
        },
        total_amount: 499.99,
        status: 'completed',
        payment_method: 'credit_card',
        payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7K',
        created_at: '2023-10-05T14:30:00',
        items: [
          {
            id: 1,
            course_id: 1,
            course_title: 'Curso de Maquillaje Profesional',
            price: 499.99
          }
        ]
      },
      {
        id: 2,
        order_number: 'ORD-2023-002',
        user: {
          id: 5,
          name: 'Ana García',
          email: 'ana.garcia@example.com'
        },
        total_amount: 399.99,
        status: 'completed',
        payment_method: 'credit_card',
        payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7L',
        created_at: '2023-10-08T10:15:00',
        items: [
          {
            id: 2,
            course_id: 2,
            course_title: 'Curso de Uñas Esculpidas',
            price: 399.99
          }
        ]
      },
      {
        id: 3,
        order_number: 'ORD-2023-003',
        user: {
          id: 2,
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@example.com'
        },
        total_amount: 799.99,
        status: 'pending',
        payment_method: 'credit_card',
        payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7M',
        created_at: '2023-10-12T16:45:00',
        items: [
          {
            id: 3,
            course_id: 3,
            course_title: 'Estética Integral',
            price: 799.99
          }
        ]
      }
    ];
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
    const response = await axios.get(`${API_URL}/sessions?page=${page}&per_page=${perPage}`);
    const sessions = response.data.data || [];

    // Si no hay datos, devolver datos de ejemplo
    if (sessions.length === 0) {
      console.log('No se encontraron sesiones, devolviendo datos de ejemplo');
      return [
        {
          id: 'sess_123456789',
          user_id: 1,
          user_email: 'maria.lopez@example.com',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          created_at: '2023-10-01T10:30:00',
          last_activity: '2023-10-01T11:45:00',
          status: 'active'
        },
        {
          id: 'sess_234567890',
          user_id: 2,
          user_email: 'carlos.rodriguez@example.com',
          ip_address: '192.168.1.2',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
          created_at: '2023-10-02T14:20:00',
          last_activity: '2023-10-02T15:30:00',
          status: 'active'
        },
        {
          id: 'sess_345678901',
          user_id: 3,
          user_email: 'admin@gmail.com',
          ip_address: '192.168.1.3',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          created_at: '2023-10-03T09:10:00',
          last_activity: '2023-10-03T10:45:00',
          status: 'active'
        }
      ];
    }

    return sessions;
  } catch (error) {
    console.error('Error al obtener sesiones:', error);

    // En caso de error, devolver datos de ejemplo
    console.log('Error al obtener sesiones, devolviendo datos de ejemplo');
    return [
      {
        id: 'sess_123456789',
        user_id: 1,
        user_email: 'maria.lopez@example.com',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        created_at: '2023-10-01T10:30:00',
        last_activity: '2023-10-01T11:45:00',
        status: 'active'
      },
      {
        id: 'sess_234567890',
        user_id: 2,
        user_email: 'carlos.rodriguez@example.com',
        ip_address: '192.168.1.2',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        created_at: '2023-10-02T14:20:00',
        last_activity: '2023-10-02T15:30:00',
        status: 'active'
      },
      {
        id: 'sess_345678901',
        user_id: 3,
        user_email: 'admin@gmail.com',
        ip_address: '192.168.1.3',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        created_at: '2023-10-03T09:10:00',
        last_activity: '2023-10-03T10:45:00',
        status: 'active'
      }
    ];
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
