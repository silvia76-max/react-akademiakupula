// Servicio de autenticación mejorado con persistencia de sesión
const API_BASE_URL = '/api';

// Claves para localStorage/sessionStorage
const TOKEN_KEY = 'akademia_auth_token';
const USER_KEY = 'akademia_user_data';
const TOKEN_EXPIRY_KEY = 'akademia_token_expiry';

// Guardar token y usuario
function setAuthToken(token, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
}
function setUserData(user, rememberMe = true) {
  if (!user) return; // <-- Añade esta línea
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
}

// LOGIN REAL
export const login = async (credentials, rememberMe = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const data = await response.json();
    const token = data.data?.access_token || data.token || data.access_token;
    const user = data.data?.user || data.user;

    setAuthToken(token, rememberMe);
    setUserData(user, rememberMe);

    return user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// REGISTER REAL
export const register = async (userData, rememberMe = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Error al registrar usuario');
    }

    const data = await response.json();
    const token = data.token || data.access_token;
    const user = data.user;

    setAuthToken(token, rememberMe);
    setUserData(user, rememberMe);

    return user;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

export function getUserData() {
  const user = localStorage.getItem('akademia_user_data') || sessionStorage.getItem('akademia_user_data');
  if (!user || user === "undefined" || user === "null") return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function isAdmin() {
  const user = localStorage.getItem('akademia_user_data') || sessionStorage.getItem('akademia_user_data');
  if (!user) return false;
  try {
    const parsed = JSON.parse(user);
    return parsed.isAdmin === true || parsed.is_admin === true;
  } catch {
    return false;
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem('akademia_auth_token') || sessionStorage.getItem('akademia_auth_token');
  // Puedes agregar más validaciones si quieres comprobar expiración
  return !!token;
}

export function logout() {
  localStorage.removeItem('akademia_auth_token');
  localStorage.removeItem('akademia_user_data');
  localStorage.removeItem('akademia_token_expiry');
  sessionStorage.removeItem('akademia_auth_token');
  sessionStorage.removeItem('akademia_user_data');
  sessionStorage.removeItem('akademia_token_expiry');

  return true;
}

export function updateUserData(newUserData, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('akademia_user_data', JSON.stringify(newUserData));
}

// Función para manejar el inicio de sesión desde un formulario
export async function handleLogin(formData) {
  try {
    const user = await login(
      {
        email: formData.email,
        password: formData.password
      },
      formData.rememberMe
    );
    return user;
  } catch (error) {
    console.error('Error en el manejo del inicio de sesión:', error);
    throw error;
  }
}

// useEffect para redirigir después del inicio de sesión
import { useEffect } from 'react';

export function useRedirectAfterLogin(currentUser, navigate, onClose) {
  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        if (onClose) onClose();
        if (currentUser.is_admin) {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }, 50);
    }
  }, [currentUser, navigate, onClose]);
}
