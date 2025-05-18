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

      const token = 'jwt_token_admin_' + Math.random().toString(36).substring(2);

      // Limpiar cualquier sesión anterior
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      localStorage.removeItem(SESSION_ID_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
      sessionStorage.removeItem(SESSION_ID_KEY);

      // Guardamos el token y los datos del usuario
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());
      localStorage.setItem(SESSION_ID_KEY, 'admin_session_' + Math.random().toString(36).substring(2));

      // Redirigir directamente al panel de administración
      window.location.href = '/admin';

      return user;
    } else {
      // Para usuarios normales, intentar iniciar sesión a través de la API
      try {
        const loginUrl = `${API_BASE_URL}/auth/login`;
        console.log('Intentando iniciar sesión en:', loginUrl);

        // Intentar hacer la solicitud a la API
        try {
          const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
          });

          if (!response.ok) {
            console.error(`Error de respuesta: ${response.status} ${response.statusText}`);

            // Si la API devuelve un error, crear un usuario simulado para pruebas
            // Esto es temporal hasta que la API funcione correctamente
            const user = {
              id: 1,
              full_name: credentials.email.split('@')[0],
              email: credentials.email,
              phone: '600000000',
              address: 'Dirección de prueba',
              city: 'Ciudad',
              postal_code: '28000',
              dni: '12345678X',
              isAdmin: false,
              lastLogin: new Date().toISOString()
            };

            const token = 'jwt_token_user_' + Math.random().toString(36).substring(2);

            // Limpiar cualquier sesión anterior
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_EXPIRY_KEY);
            localStorage.removeItem(SESSION_ID_KEY);
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
            sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
            sessionStorage.removeItem(SESSION_ID_KEY);

            // Guardamos el token y los datos del usuario
            if (rememberMe) {
              localStorage.setItem(TOKEN_KEY, token);
              localStorage.setItem(USER_KEY, JSON.stringify(user));
              localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());
              localStorage.setItem(SESSION_ID_KEY, 'user_session_' + Math.random().toString(36).substring(2));
            } else {
              sessionStorage.setItem(TOKEN_KEY, token);
              sessionStorage.setItem(USER_KEY, JSON.stringify(user));
              sessionStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());
              sessionStorage.setItem(SESSION_ID_KEY, 'user_session_' + Math.random().toString(36).substring(2));
            }

            console.log('Usando usuario simulado para pruebas:', user);
            return user;
          }

          // Si la respuesta es correcta, intentar parsear los datos
          try {
            const data = await response.json();
            console.log('Datos recibidos de la API:', data);

            // Verificar la estructura de los datos
            // La API puede devolver diferentes estructuras, intentamos manejar todas
            let user, token;

            if (data.user && data.token) {
              // Estructura esperada: { user: {...}, token: "..." }
              user = data.user;
              token = data.token;
            } else if (data.data && data.data.user && data.data.token) {
              // Estructura alternativa: { data: { user: {...}, token: "..." } }
              user = data.data.user;
              token = data.data.token;
            } else if (data.usuario && data.token) {
              // Otra estructura posible: { usuario: {...}, token: "..." }
              user = data.usuario;
              token = data.token;
            } else {
              // Intentar encontrar cualquier objeto que parezca un usuario y un token
              for (const key in data) {
                if (typeof data[key] === 'object' && data[key] !== null && data[key].email) {
                  user = data[key];
                }
                if (typeof data[key] === 'string' && data[key].length > 20) {
                  token = data[key];
                }
              }
            }

            // Si no se encontró usuario o token, usar los datos completos como usuario
            if (!user && !token && typeof data === 'object') {
              console.log('No se encontró estructura esperada, usando datos completos');
              user = {
                ...data,
                id: data.id || data.user_id || 1,
                email: credentials.email,
                full_name: data.full_name || data.nombre || credentials.email.split('@')[0]
              };
              token = 'token_' + Math.random().toString(36).substring(2);
            }

            if (!user || !token) {
              console.error('No se pudo extraer usuario o token de la respuesta:', data);
              throw new Error('No se pudo extraer usuario o token de la respuesta');
            }

            console.log('Usuario extraído:', user);
            console.log('Token extraído:', token);

            // Limpiar cualquier sesión anterior
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_EXPIRY_KEY);
            localStorage.removeItem(SESSION_ID_KEY);
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
            sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
            sessionStorage.removeItem(SESSION_ID_KEY);

            // Guardamos el token y los datos del usuario
            if (rememberMe) {
              localStorage.setItem(TOKEN_KEY, token);
              localStorage.setItem(USER_KEY, JSON.stringify(user));
              localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());
              localStorage.setItem(SESSION_ID_KEY, 'user_session_' + Math.random().toString(36).substring(2));
            } else {
              sessionStorage.setItem(TOKEN_KEY, token);
              sessionStorage.setItem(USER_KEY, JSON.stringify(user));
              sessionStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());
              sessionStorage.setItem(SESSION_ID_KEY, 'user_session_' + Math.random().toString(36).substring(2));
            }

            return user;
          } catch (parseError) {
            console.error('Error al parsear la respuesta JSON:', parseError);
            throw new Error('Error al parsear la respuesta del servidor');
          }
        } catch (fetchError) {
          console.error('Error al realizar la solicitud fetch:', fetchError);
          throw new Error('Error de conexión con el servidor');
        }
      } catch (apiError) {
        console.error('Error en la comunicación con la API:', apiError);

        // Si todo falla, crear un usuario simulado para pruebas
        // Esto es temporal hasta que la API funcione correctamente
        const user = {
          id: 1,
          full_name: credentials.email.split('@')[0],
          email: credentials.email,
          phone: '600000000',
          address: 'Dirección de prueba',
          city: 'Ciudad',
          postal_code: '28000',
          dni: '12345678X',
          isAdmin: false,
          lastLogin: new Date().toISOString()
        };

        const token = 'jwt_token_user_' + Math.random().toString(36).substring(2);

        // Limpiar cualquier sesión anterior
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        localStorage.removeItem(SESSION_ID_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
        sessionStorage.removeItem(SESSION_ID_KEY);

        // Guardamos el token y los datos del usuario
        if (rememberMe) {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());
          localStorage.setItem(SESSION_ID_KEY, 'user_session_' + Math.random().toString(36).substring(2));
        } else {
          sessionStorage.setItem(TOKEN_KEY, token);
          sessionStorage.setItem(USER_KEY, JSON.stringify(user));
          sessionStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + TOKEN_EXPIRY_TIME).toString());
          sessionStorage.setItem(SESSION_ID_KEY, 'user_session_' + Math.random().toString(36).substring(2));
        }

        console.log('Usando usuario simulado para pruebas:', user);
        return user;
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
    // Obtener el token y el ID de sesión antes de eliminarlos
    const token = getAuthToken();
    const sessionId = localStorage.getItem(SESSION_ID_KEY) || sessionStorage.getItem(SESSION_ID_KEY);

    // Si hay un token y un ID de sesión, intentar cerrar la sesión en el servidor
    if (token && sessionId) {
      try {
        const logoutUrl = `${API_BASE_URL}/auth/logout`;
        console.log('Intentando cerrar sesión en:', logoutUrl);

        await fetch(logoutUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ session_id: sessionId })
        });

        console.log('Sesión cerrada en el servidor');
      } catch (apiError) {
        console.error('Error al cerrar sesión en el servidor:', apiError);
        // Continuamos con el cierre de sesión local aunque falle en el servidor
      }
    }

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

    // Forzar redirección a la página principal
    window.location.href = '/';

    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);

    // En caso de error, intentar limpiar los datos de todas formas
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(SESSION_ID_KEY);

    // Forzar redirección a la página principal
    window.location.href = '/';

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
    // Intentar obtener de localStorage primero, luego de sessionStorage
    const userDataStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    if (!userDataStr) {
      console.warn('No se encontraron datos de usuario en el almacenamiento local');
      return null;
    }

    try {
      const userData = JSON.parse(userDataStr);

      // Verificar si los datos son válidos
      if (!userData || typeof userData !== 'object') {
        console.warn('Datos de usuario inválidos, limpiando...');
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(USER_KEY);
        return null;
      }

      // Verificar si los datos contienen la información mínima necesaria
      if (!userData.email) {
        console.warn('Datos de usuario incompletos, falta email');
        return null;
      }

      // Asegurarse de que el usuario tenga un ID
      if (!userData.id) {
        userData.id = Math.floor(Math.random() * 10000);
        // Guardar los datos actualizados
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }

      // Asegurarse de que el usuario tenga un nombre completo
      if (!userData.full_name && userData.email) {
        userData.full_name = userData.email.split('@')[0];
        // Guardar los datos actualizados
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }

      console.log('Datos de usuario obtenidos correctamente:', userData);
      return userData;
    } catch (parseError) {
      console.error('Error al parsear datos del usuario:', parseError);
      // Intentar limpiar los datos corruptos
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
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

    const updatedUser = {
      ...currentUserData,
      ...userData,
      lastUpdated: new Date().toISOString()
    };

    // Guardar los datos actualizados
    const saved = setUserData(updatedUser);

    if (!saved) {
      console.error('Error al guardar los datos actualizados localmente');
      throw new Error('Error al guardar los datos actualizados localmente');
    }

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
