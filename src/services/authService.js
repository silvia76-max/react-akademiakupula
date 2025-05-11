// Servicio de autenticación para manejar todas las operaciones relacionadas con la autenticación

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

/**
 * Inicia sesión con las credenciales proporcionadas
 * @param {Object} credentials - Credenciales del usuario (email, password)
 * @returns {Promise<Object>} - Objeto con token y datos del usuario
 */
export const login = async (credentials) => {
  try {
    // En modo desarrollo, podemos simular un inicio de sesión exitoso
    if (isDevelopment() && 
        (credentials.email === TEST_CREDENTIALS.email && 
         credentials.password === TEST_CREDENTIALS.password)) {
      
      console.log('Modo desarrollo: Simulando inicio de sesión exitoso');
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
    
    // En producción o si las credenciales de prueba no coinciden, hacer la llamada real
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      
      // Si el servidor devuelve datos del usuario, guardarlos también
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return {
        success: true,
        ...data
      };
    } else {
      return {
        success: false,
        message: data.message || 'Error al iniciar sesión'
      };
    }
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
      message: 'Error de conexión. Inténtalo de nuevo más tarde.'
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
    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Determinar dónde están los datos del usuario
      const user = data.user || data.data || data;
      
      // Guardar los datos del usuario en localStorage para uso futuro
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        user
      };
    } else {
      return {
        success: false,
        message: data.message || 'Error al obtener el perfil'
      };
    }
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
      message: 'Error de conexión. Inténtalo de nuevo más tarde.'
    };
  }
};

/**
 * Cierra la sesión del usuario actual
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si el usuario está autenticado, false en caso contrario
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default {
  login,
  getProfile,
  logout,
  isAuthenticated
};
