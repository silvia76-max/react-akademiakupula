// Servicio de autenticación para manejar todas las operaciones relacionadas con la autenticación

// URL base para las peticiones
const BASE_URL = "http://localhost:5000";

// Función para simular un retraso en las operaciones (solo para desarrollo)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para verificar si estamos en modo desarrollo
const isDevelopment = () => process.env.NODE_ENV === 'development';

// Token JWT simulado para desarrollo
const FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVzdWFyaW8gZGUgUHJ1ZWJhIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Usuario simulado para desarrollo
const FAKE_USER = {
  id: 1,
  full_name: 'Usuario de Prueba',
  email: 'test@example.com',
  postal_code: '28001'
};

// Credenciales de prueba para desarrollo
const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

// Credenciales de administrador para desarrollo
const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'AkademiaKupula'
};

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
        localStorage.removeItem('user');
      }
      throw new Error(data.message || 'Error en la solicitud');
    }
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario a registrar
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const register = async (userData) => {
  try {
    // En modo desarrollo, podemos simular un registro exitoso
    if (isDevelopment()) {
      console.log('Modo desarrollo: Simulando registro exitoso');
      await delay(500); // Simular retraso de red

      return {
        success: true,
        message: 'Usuario registrado correctamente',
        user: {
          ...FAKE_USER,
          ...userData,
          id: Math.floor(Math.random() * 1000) + 2 // ID aleatorio
        }
      };
    }

    // En producción, hacer la llamada real
    const data = await request('/api/auth/register', 'POST', userData);

    return {
      success: true,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al registrar usuario'
    };
  }
};

/**
 * Inicia sesión con las credenciales proporcionadas
 * @param {Object} credentials - Credenciales del usuario (email, password)
 * @returns {Promise<Object>} - Objeto con token y datos del usuario
 */
export const login = async (credentials) => {
  try {
    // En modo desarrollo, podemos simular un inicio de sesión exitoso
    if (isDevelopment()) {
      // Verificar si son credenciales de prueba
      if (credentials.email === TEST_CREDENTIALS.email &&
          credentials.password === TEST_CREDENTIALS.password) {

        console.log('Modo desarrollo: Simulando inicio de sesión exitoso (usuario normal)');
        await delay(500); // Simular retraso de red

        // Guardar el token en localStorage
        localStorage.setItem('token', FAKE_TOKEN);
        localStorage.setItem('user', JSON.stringify(FAKE_USER));

        return {
          success: true,
          token: FAKE_TOKEN,
          user: FAKE_USER
        };
      }

      // Verificar si son credenciales de administrador
      if (credentials.email === ADMIN_CREDENTIALS.email &&
          credentials.password === ADMIN_CREDENTIALS.password) {

        console.log('Modo desarrollo: Simulando inicio de sesión exitoso (administrador)');
        await delay(500); // Simular retraso de red

        const adminUser = {
          id: 999,
          full_name: 'Administrador',
          email: 'admin@gmail.com',
          postal_code: '28001',
          is_admin: true
        };

        // Guardar el token en localStorage
        localStorage.setItem('token', FAKE_TOKEN);
        localStorage.setItem('user', JSON.stringify(adminUser));

        return {
          success: true,
          token: FAKE_TOKEN,
          user: adminUser
        };
      }
    }

    // En producción o si las credenciales de prueba no coinciden, hacer la llamada real
    const data = await request('/api/auth/login', 'POST', credentials);

    // Guardar el token en localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    // Si el servidor devuelve datos del usuario, guardarlos también
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error('Error en el servicio de autenticación (login):', error);

    // En desarrollo, podemos simular un inicio de sesión exitoso incluso si hay un error
    if (isDevelopment() && credentials.email === TEST_CREDENTIALS.email) {
      console.log('Modo desarrollo: Simulando inicio de sesión exitoso después de un error');

      // Guardar el token en localStorage
      localStorage.setItem('token', FAKE_TOKEN);
      localStorage.setItem('user', JSON.stringify(FAKE_USER));

      return {
        success: true,
        token: FAKE_TOKEN,
        user: FAKE_USER
      };
    }

    return {
      success: false,
      message: error.message || 'Error de conexión. Inténtalo de nuevo más tarde.'
    };
  }
};

/**
 * Obtiene el perfil del usuario actual
 * @returns {Promise<Object>} - Datos del usuario
 */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');

    // Verificar si el token existe
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // En modo desarrollo, podemos simular una respuesta exitosa
    if (isDevelopment()) {
      console.log('Modo desarrollo: Simulando obtención de perfil');
      await delay(300); // Simular retraso de red

      // Intentar obtener el usuario del localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return {
          success: true,
          user: JSON.parse(storedUser)
        };
      }

      // Si no hay usuario almacenado, usar el usuario simulado
      return {
        success: true,
        user: FAKE_USER
      };
    }

    // En producción, hacer la llamada real
    const data = await request('/api/auth/profile', 'GET');

    // Determinar dónde están los datos del usuario
    const user = data.user || data.data || data;

    // Guardar los datos del usuario en localStorage para uso futuro
    localStorage.setItem('user', JSON.stringify(user));

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Error en el servicio de autenticación (getProfile):', error);

    // En desarrollo, podemos simular una respuesta exitosa incluso si hay un error
    if (isDevelopment()) {
      console.log('Modo desarrollo: Simulando obtención de perfil después de un error');

      return {
        success: true,
        user: FAKE_USER
      };
    }

    return {
      success: false,
      message: error.message || 'Error de conexión. Inténtalo de nuevo más tarde.'
    };
  }
};

/**
 * Cierra la sesión del usuario actual
 */
export const logout = () => {
  try {
    console.log('Ejecutando función logout en authService.jsx...');

    // Eliminar datos de autenticación
    localStorage.removeItem('akademia_auth_token');
    localStorage.removeItem('akademia_user_data');
    localStorage.removeItem('akademia_token_expiry');
    localStorage.removeItem('akademia_session_id');

    // Eliminar también de sessionStorage
    sessionStorage.removeItem('akademia_auth_token');
    sessionStorage.removeItem('akademia_user_data');
    sessionStorage.removeItem('akademia_token_expiry');
    sessionStorage.removeItem('akademia_session_id');

    // Eliminar también las claves antiguas por si acaso
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    console.log('Datos de sesión eliminados desde authService.jsx');

    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si el usuario está autenticado, false en caso contrario
 */
export const isAuthenticated = () => {
  try {
    // Intentar obtener el token de localStorage o sessionStorage
    const token = localStorage.getItem('akademia_auth_token') || sessionStorage.getItem('akademia_auth_token');
    const expiry = localStorage.getItem('akademia_token_expiry') || sessionStorage.getItem('akademia_token_expiry');

    if (!token || !expiry) {
      return false;
    }

    // Verificar si el token ha expirado
    if (new Date().getTime() > parseInt(expiry)) {
      console.log('Token expirado, cerrando sesión');
      // Token expirado, limpiar datos
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return false;
  }
};

/**
 * Verifica si el usuario es administrador
 * @returns {boolean} - true si el usuario es administrador, false en caso contrario
 */
export const isAdmin = () => {
  try {
    // Intentar obtener los datos del usuario de localStorage o sessionStorage
    const userDataStr = localStorage.getItem('akademia_user_data') || sessionStorage.getItem('akademia_user_data');
    if (!userDataStr) return false;

    const userData = JSON.parse(userDataStr);
    return userData && userData.isAdmin === true;
  } catch (error) {
    console.error('Error al verificar si el usuario es administrador:', error);
    return false;
  }
};

export default {
  register,
  login,
  getProfile,
  logout,
  isAuthenticated,
  isAdmin
};