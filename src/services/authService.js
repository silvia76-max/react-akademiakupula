// Servicio de autenticación mejorado con persistencia de sesión

// Constantes para almacenamiento
const TOKEN_KEY = 'akademia_auth_token';
const USER_KEY = 'akademia_user_data';
const TOKEN_EXPIRY_KEY = 'akademia_token_expiry';
const SESSION_ID_KEY = 'akademia_session_id';

// Tiempo de expiración del token en milisegundos (7 días para mayor persistencia)
const TOKEN_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

// Función para simular una respuesta de API
const simulateApiResponse = (data, success = true, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(data);
      } else {
        reject(new Error('Error en la solicitud'));
      }
    }, delay);
  });
};

// Función para registrar un usuario
export const register = async (userData) => {
  try {
    // En una implementación real, aquí se haría una llamada a la API
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData)
    // });
    // const data = await response.json();

    // Simulamos una respuesta exitosa
    const mockResponse = {
      token: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
      user: {
        id: Math.floor(Math.random() * 1000),
        full_name: userData.full_name,
        email: userData.email,
        // Marcar como usuario nuevo
        isNewUser: true,
        // Otros campos del usuario
        ...userData
      }
    };

    // Limpiar el carrito y la lista de deseos para usuarios nuevos
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');

    // Guardamos el token y los datos del usuario
    setAuthToken(mockResponse.token);
    setUserData(mockResponse.user);

    return mockResponse.user;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Función para iniciar sesión
export const login = async (credentials, rememberMe = true) => {
  try {
    console.log('Iniciando sesión con:', credentials.email, 'Recordar sesión:', rememberMe);

    // En una implementación real, aquí se haría una llamada a la API
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // });
    // const data = await response.json();

    // Simulamos una respuesta exitosa
    const mockResponse = {
      token: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
      user: {
        id: Math.floor(Math.random() * 1000),
        full_name: credentials.email === 'admin@gmail.com' ? 'Administrador' : 'Usuario de Prueba',
        email: credentials.email,
        phone: '600123456',
        address: 'Calle Ejemplo 123',
        city: 'Madrid',
        postal_code: '28001',
        dni: '12345678A',
        // Verificar si es admin
        isAdmin: credentials.email === 'admin@gmail.com',
        // Añadir fecha de inicio de sesión
        lastLogin: new Date().toISOString()
      }
    };

    // Guardamos el token y los datos del usuario con la opción de recordar sesión
    const sessionId = setAuthToken(mockResponse.token, rememberMe);
    setUserData(mockResponse.user, rememberMe);

    // Registrar la sesión (en una implementación real, esto se haría en el backend)
    console.log(`Sesión iniciada: ${sessionId} para usuario ${mockResponse.user.id}`);

    return mockResponse.user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para cerrar sesión
export const logout = () => {
  try {
    console.log('Ejecutando función logout en authService...');

    // Verificar si hay datos de sesión
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const userData = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    console.log('Token antes de logout:', token ? 'Existe' : 'No existe');
    console.log('Datos de usuario antes de logout:', userData ? 'Existen' : 'No existen');

    // Obtener el ID de sesión antes de eliminar
    const sessionId = localStorage.getItem(SESSION_ID_KEY) || sessionStorage.getItem(SESSION_ID_KEY);
    console.log('ID de sesión antes de logout:', sessionId);

    // Limpiar datos de localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(SESSION_ID_KEY);

    // Limpiar datos de sessionStorage
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(SESSION_ID_KEY);

    // Verificar si se eliminaron los datos
    const tokenAfter = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const userDataAfter = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    console.log('Token después de logout:', tokenAfter ? 'Existe' : 'No existe');
    console.log('Datos de usuario después de logout:', userDataAfter ? 'Existen' : 'No existen');

    // En una implementación real, aquí se haría una llamada a la API para finalizar la sesión
    console.log(`Sesión finalizada: ${sessionId}`);

    // No eliminamos el carrito ni la lista de deseos para mantener la experiencia de usuario
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  try {
    // Intentar obtener el token de localStorage o sessionStorage
    const token = getAuthToken();
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY) || sessionStorage.getItem(TOKEN_EXPIRY_KEY);

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

    // Verificar si hay datos de usuario
    const userData = getUserData();
    if (!userData) {
      console.log('No hay datos de usuario, cerrando sesión');
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return false;
  }
};

// Función para obtener el token de autenticación
export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

// Función para establecer el token de autenticación
export const setAuthToken = (token, rememberMe = true) => {
  try {
    // Generar un ID de sesión único
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);

    // Establecer tiempo de expiración
    const expiryTime = new Date().getTime() + TOKEN_EXPIRY_TIME;

    // Guardar en localStorage (persistente) o sessionStorage (solo sesión actual)
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    storage.setItem(SESSION_ID_KEY, sessionId);

    return sessionId;
  } catch (error) {
    console.error('Error al guardar el token:', error);
    return null;
  }
};

// Función para obtener los datos del usuario
export const getUserData = () => {
  try {
    // Intentar obtener de localStorage primero, luego de sessionStorage
    const userDataStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    if (!userDataStr) {
      return null;
    }

    const userData = JSON.parse(userDataStr);

    // Verificar si los datos son válidos
    if (!userData || typeof userData !== 'object') {
      console.warn('Datos de usuario inválidos, limpiando...');
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

// Función para establecer los datos del usuario
export const setUserData = (userData, rememberMe = true) => {
  try {
    if (!userData) {
      console.warn('Intentando guardar datos de usuario nulos');
      return false;
    }

    // Guardar en localStorage (persistente) o sessionStorage (solo sesión actual)
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(USER_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error al guardar datos del usuario:', error);
    return false;
  }
};

// Función para actualizar los datos del usuario
export const updateUserData = async (userData) => {
  try {
    // En una implementación real, aquí se haría una llamada a la API
    // const response = await fetch('/api/user/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify(userData)
    // });
    // const data = await response.json();

    // Simulamos una respuesta exitosa
    const updatedUser = {
      ...getUserData(),
      ...userData
    };

    // Actualizamos los datos del usuario en localStorage
    setUserData(updatedUser);

    return updatedUser;
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error);
    throw error;
  }
};

// Función para obtener el perfil del usuario
export const getProfile = async () => {
  try {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    // En una implementación real, aquí se haría una llamada a la API
    // const response = await fetch('/api/user/profile', {
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // });
    // const data = await response.json();

    // Simulamos una respuesta exitosa
    const userData = getUserData();

    // Si no hay datos del usuario, intentamos refrescar la sesión
    if (!userData) {
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

// Función para obtener las sesiones del usuario
export const getUserSessions = async () => {
  try {
    const token = getAuthToken();
    if (!token) return [];

    // En una implementación real, aquí se haría una llamada a la API
    // const response = await fetch('/api/sessions', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    // const data = await response.json();
    // return data.sessions;

    // Simulamos una respuesta exitosa con datos de ejemplo
    return [
      {
        id: 1,
        user_id: getUserData()?.id || 1,
        ip_address: '192.168.1.1',
        user_agent: navigator.userAgent,
        device_info: detectDeviceType(),
        started_at: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        is_active: true,
        is_current: true,
        last_activity: new Date().toISOString()
      },
      {
        id: 2,
        user_id: getUserData()?.id || 1,
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        device_info: 'iPhone',
        started_at: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
        is_active: true,
        is_current: false,
        last_activity: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
      },
      {
        id: 3,
        user_id: getUserData()?.id || 1,
        ip_address: '192.168.1.200',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        device_info: 'Windows PC',
        started_at: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
        is_active: true,
        is_current: false,
        last_activity: new Date(Date.now() - 43200000).toISOString() // 12 horas atrás
      }
    ];
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    return [];
  }
};

// Función para finalizar una sesión específica
export const endSession = async (sessionId) => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    // En una implementación real, aquí se haría una llamada a la API
    // const response = await fetch(`/api/sessions/${sessionId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    // const data = await response.json();
    // return data.success;

    // Simulamos una respuesta exitosa
    console.log(`Sesión ${sessionId} finalizada`);
    return true;
  } catch (error) {
    console.error('Error al finalizar sesión:', error);
    return false;
  }
};

// Función para finalizar todas las sesiones excepto la actual
export const endAllOtherSessions = async () => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    // En una implementación real, aquí se haría una llamada a la API
    // const response = await fetch('/api/sessions', {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    // const data = await response.json();
    // return data.success;

    // Simulamos una respuesta exitosa
    console.log('Todas las otras sesiones finalizadas');
    return true;
  } catch (error) {
    console.error('Error al finalizar sesiones:', error);
    return false;
  }
};

// Función auxiliar para detectar el tipo de dispositivo
function detectDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Smartphone';
  }
  return 'Computadora';
}

// Función para verificar si el usuario es administrador
export const isAdmin = () => {
  const userData = getUserData();
  return userData ? userData.isAdmin : false;
};

// Función para refrescar el token (en una implementación real)
export const refreshToken = async () => {
  try {
    // En una implementación real, aquí se haría una llamada a la API
    // const response = await fetch('/api/auth/refresh-token', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // });
    // const data = await response.json();

    // Simulamos una respuesta exitosa
    const newToken = 'refreshed_token_' + Math.random().toString(36).substring(2);

    // Actualizamos el token
    setAuthToken(newToken);

    return true;
  } catch (error) {
    console.error('Error al refrescar token:', error);
    logout();
    return false;
  }
};
