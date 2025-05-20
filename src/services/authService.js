// Servicio de autenticación mejorado con persistencia de sesión

// URL base para las peticiones a la API
// Nota: El proxy en vite.config.js ya está configurado para redirigir /api a http://localhost:5000
const API_BASE_URL = '/api';

// Constantes para almacenamiento
const TOKEN_KEY = 'akademia_auth_token';
const USER_KEY = 'akademia_user_data';
const TOKEN_EXPIRY_KEY = 'akademia_token_expiry';
const SESSION_ID_KEY = 'akademia_session_id';

// Tiempo de expiración del token en milisegundos (7 días para mayor persistencia)
const TOKEN_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;



// Importar el servicio de base de datos
import { createUser, createSession, detectDeviceType, getClientIP, generateSessionId } from './dbService';

// Función para registrar un usuario
export const register = async (userData) => {
  try {
    console.log('Registrando usuario:', userData);

    // Limpiar el carrito y la lista de deseos para usuarios nuevos
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');

    // Intentar crear el usuario en la base de datos
    const registerUrl = `${API_BASE_URL}/auth/register`;
    console.log('Intentando registrar en:', registerUrl);

    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Verificar si es un registro de administrador
    const isAdmin = userData.email === 'admin@gmail.com';

    // Preparar datos del usuario
    const user = {
      ...data.user,
      // Marcar como usuario nuevo
      isNewUser: true,
      // Marcar como administrador si corresponde
      isAdmin: isAdmin
    };

    // Guardamos el token y los datos del usuario
    const token = data.token;
    const sessionId = setAuthToken(token);
    setUserData(user);

    // Registrar la sesión en la base de datos
    try {
      await createSession({
        user_id: user.id,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        device_info: detectDeviceType(),
        is_active: true,
        session_id: sessionId
      });

      console.log(`Sesión iniciada: ${sessionId} para usuario ${user.id}`);
    } catch (sessionError) {
      console.error('Error al registrar sesión:', sessionError);
      // No interrumpimos el flujo si falla el registro de sesión
    }

    return user;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Función para iniciar sesión
export const login = async (credentials, rememberMe = true) => {
  try {
    console.log('Iniciando sesión con credenciales:', credentials.email);

    // Verificar si son credenciales de administrador
    if (credentials.email === 'admin@gmail.com' && credentials.password === 'AkademiaKupula') {
      console.log('¡CREDENCIALES DE ADMINISTRADOR DETECTADAS!');

      // Para el administrador, usar directamente credenciales hardcodeadas
      const user = {
        id: 999,
        full_name: 'Administrador',
        email: 'admin@gmail.com',
        phone: '600123456',
        address: 'Calle Ejemplo 123',
        city: 'Madrid',
        postal_code: '28001',
        dni: '12345678A',
        isAdmin: true,
        lastLogin: new Date().toISOString()
      };

      // Generar un token simple
      const token = 'admin_token_' + Date.now();

      // Limpiar datos de sesión anteriores
      localStorage.clear();
      sessionStorage.clear();

      // Guardar datos en localStorage para persistencia
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());

      console.log('Datos de administrador guardados correctamente');
      console.log('Token:', token);
      console.log('Usuario:', user);

      return user;
    } else {
      // Para usuarios normales, intentar iniciar sesión a través de la API
      try {
        console.log('Iniciando sesión de usuario normal con email:', credentials.email);

        // Crear un usuario de prueba para desarrollo (esto permite probar sin backend)
        // En un entorno de producción, esto se reemplazaría con la llamada real a la API
        const testUser = {
          id: Math.floor(Math.random() * 1000) + 1,
          full_name: credentials.email.split('@')[0],
          email: credentials.email,
          isAdmin: false,
          lastLogin: new Date().toISOString()
        };

        const testToken = 'user_token_' + Date.now();

        console.log('Creando usuario de prueba:', testUser);

        // Limpiar datos de sesión anteriores
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        localStorage.removeItem(SESSION_ID_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
        sessionStorage.removeItem(SESSION_ID_KEY);

        // Guardar datos en localStorage o sessionStorage según la opción de recordar
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem(TOKEN_KEY, testToken);
        storage.setItem(USER_KEY, JSON.stringify(testUser));
        storage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());
        storage.setItem(SESSION_ID_KEY, 'user_session_' + Date.now());

        console.log('Datos de usuario guardados en:', rememberMe ? 'localStorage' : 'sessionStorage');
        console.log('Token guardado:', testToken);

        return testUser;
      } catch (error) {
        console.error('Error al iniciar sesión de usuario normal:', error);
        throw new Error('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    }
  } catch (error) {
    console.error('Error general al iniciar sesión:', error);
    throw error;
  }
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    console.log('Cerrando sesión...');

    // Guardar temporalmente el avatar si existe
    const avatar = localStorage.getItem('user_avatar');

    // Limpiar datos de autenticación de localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(SESSION_ID_KEY);

    // Limpiar datos de carrito y wishlist
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('cart_') ||
        key.startsWith('wishlist_') ||
        key === 'activeProfileTab'
      )) {
        keysToRemove.push(key);
      }
    }

    // Eliminar las claves recopiladas
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Limpiar datos de sessionStorage
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(SESSION_ID_KEY);

    console.log('Datos de sesión eliminados');

    // No forzar redirección, dejar que React Router maneje la navegación
    console.log('Sesión cerrada correctamente');

    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);

    // En caso de error, intentar limpiar los datos de todas formas
    try {
      // Limpiar datos de localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      localStorage.removeItem(SESSION_ID_KEY);

      // Limpiar datos de carrito y wishlist
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('cart_') || key.startsWith('wishlist_'))) {
          localStorage.removeItem(key);
        }
      }

      // Limpiar datos de sessionStorage
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
      sessionStorage.removeItem(SESSION_ID_KEY);
    } catch (cleanupError) {
      console.error('Error al limpiar datos durante la recuperación:', cleanupError);
    }

    // No forzar redirección, dejar que React Router maneje la navegación
    console.log('Sesión cerrada correctamente (recuperación de error)');

    return false;
  }
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  try {
    console.log('Verificando autenticación...');

    // Intentar obtener el token y datos de usuario
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const userDataStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    console.log('Token encontrado:', token ? 'Sí' : 'No');
    console.log('Datos de usuario encontrados:', userDataStr ? 'Sí' : 'No');

    // Si no hay token o datos de usuario, no está autenticado
    if (!token || !userDataStr) {
      console.log('No hay token o datos de usuario, no está autenticado');
      return false;
    }

    // Intentar parsear los datos de usuario
    try {
      const userData = JSON.parse(userDataStr);
      console.log('Usuario autenticado:', userData.email);
      return true;
    } catch (parseError) {
      console.error('Error al parsear datos de usuario:', parseError);
      return false;
    }
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
    // Generar un ID de sesión único usando la función importada
    const sessionId = generateSessionId();

    // Establecer tiempo de expiración
    const expiryTime = new Date().getTime() + TOKEN_EXPIRY_TIME;

    // Guardar en localStorage (persistente) o sessionStorage (solo sesión actual)
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    storage.setItem(SESSION_ID_KEY, sessionId);

    console.log(`Token guardado con ID de sesión: ${sessionId}`);
    return sessionId;
  } catch (error) {
    console.error('Error al guardar el token:', error);
    return null;
  }
};

// Función para obtener los datos del usuario
export const getUserData = () => {
  try {
    console.log('Obteniendo datos de usuario...');

    // Intentar obtener de localStorage primero, luego de sessionStorage
    const userDataStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    if (!userDataStr) {
      console.warn('No se encontraron datos de usuario en el almacenamiento');
      return null;
    }

    try {
      const userData = JSON.parse(userDataStr);
      console.log('Datos de usuario obtenidos:', userData);

      // Verificar si los datos son válidos
      if (!userData || typeof userData !== 'object') {
        console.warn('Datos de usuario inválidos');
        return null;
      }

      // Verificar si es el usuario administrador
      if (userData.email === 'admin@gmail.com') {
        userData.isAdmin = true;
      }

      return userData;
    } catch (parseError) {
      console.error('Error al parsear datos del usuario:', parseError);
      return null;
    }
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

    console.log('Guardando datos de usuario:', userData);

    // Asegurarse de que la propiedad isAdmin esté correctamente establecida
    if (userData.email === 'admin@gmail.com') {
      console.log('Forzando isAdmin=true para admin@gmail.com');
      userData.isAdmin = true;
    }

    // Asegurarse de que los datos tengan un ID
    if (!userData.id) {
      console.log('Asignando ID temporal al usuario');
      userData.id = Math.floor(Math.random() * 10000);
    }

    // Asegurarse de que los datos tengan un timestamp de última actualización
    userData.lastUpdated = new Date().toISOString();

    // Verificar si hay un avatar guardado y asociarlo al usuario
    const avatar = localStorage.getItem('user_avatar');
    if (avatar) {
      console.log('Asociando avatar existente al usuario');
      userData.hasAvatar = true;
    }

    // Guardar en localStorage (persistente) siempre para asegurar persistencia
    // Y opcionalmente en sessionStorage si rememberMe es false
    const dataToStore = JSON.stringify(userData);

    // Siempre guardar en localStorage para persistencia
    localStorage.setItem(USER_KEY, dataToStore);

    // Si rememberMe es false, también guardar en sessionStorage
    if (!rememberMe) {
      sessionStorage.setItem(USER_KEY, dataToStore);
    }

    // Verificar que se guardó correctamente
    const savedData = localStorage.getItem(USER_KEY);
    if (!savedData) {
      console.error('Error: No se pudieron guardar los datos en localStorage');
      return false;
    }

    try {
      const parsedData = JSON.parse(savedData);
      console.log('Datos guardados correctamente:', parsedData);
      return true;
    } catch (parseError) {
      console.error('Error al verificar los datos guardados:', parseError);
      return false;
    }
  } catch (error) {
    console.error('Error al guardar datos del usuario:', error);
    return false;
  }
};

// Función para actualizar los datos del usuario
export const updateUserData = async (userData) => {
  try {
    console.log('Actualizando datos de usuario:', userData);

    // Obtener los datos actuales del usuario
    const currentUserData = getUserData();

    if (!currentUserData) {
      console.error('No se encontraron datos de usuario para actualizar');
      throw new Error('No se encontraron datos de usuario para actualizar');
    }

    // Intentar actualizar los datos en el servidor
    try {
      const updateUrl = `${API_BASE_URL}/user/profile`;
      console.log('Intentando actualizar perfil en:', updateUrl);

      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        // Si la actualización en el servidor fue exitosa, actualizar los datos locales
        const updatedUser = {
          ...currentUserData,
          ...userData,
          ...data.user // Incluir cualquier dato adicional que el servidor haya devuelto
        };

        // Guardar los datos actualizados
        const saved = setUserData(updatedUser);

        if (!saved) {
          console.error('Error al guardar los datos actualizados');
          throw new Error('Error al guardar los datos actualizados');
        }

        return updatedUser;
      } else {
        console.error('Error al actualizar perfil en el servidor:', response.status, response.statusText);
      }
    } catch (apiError) {
      console.error('Error en la comunicación con la API:', apiError);
    }

    // Si la actualización en el servidor falló o no está disponible,
    // actualizar solo los datos locales
    console.log('Actualizando datos localmente');

    // Preservar el estado del avatar
    const hasAvatar = currentUserData.hasAvatar;

    const updatedUser = {
      ...currentUserData,
      ...userData,
      lastUpdated: new Date().toISOString(),
      hasAvatar: hasAvatar // Preservar el estado del avatar
    };

    // Guardar los datos actualizados
    const saved = setUserData(updatedUser);

    if (!saved) {
      console.error('Error al guardar los datos actualizados localmente');
      throw new Error('Error al guardar los datos actualizados localmente');
    }

    console.log('Perfil actualizado correctamente:', updatedUser);

    return updatedUser;
  } catch (error) {
    console.error('Error general al actualizar datos del usuario:', error);
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

// Usamos la función detectDeviceType importada de dbService.js

// Función para verificar si el usuario es administrador
export const isAdmin = () => {
  const userData = getUserData();

  // Verificar si el usuario existe
  if (!userData) return false;

  // Verificar si el usuario es admin@gmail.com (administrador explícito)
  if (userData.email === 'admin@gmail.com') return true;

  // Verificar si el usuario tiene la propiedad isAdmin
  return userData.isAdmin === true;
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
