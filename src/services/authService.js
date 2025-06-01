// Servicio de autenticación mejorado con persistencia de sesión
const API_BASE_URL = '/api';

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
  if (!user) return;
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
}

// LOGIN
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

// REGISTER
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

// Obtener usuario actual
export function getUserData() {
  const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Verificar autenticación
export function isAuthenticated() {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  return !!token;
}

// Logout
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  return true;
}

// Actualizar datos de usuario
export function updateUserData(newUserData, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(USER_KEY, JSON.stringify(newUserData));
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

// Hook para redirigir después del login
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

import axios from 'axios';

const API_URL = '/api/admin';

export const endSession = async (sessionId) => {
  const response = await axios.delete(`${API_URL}/sessions/${sessionId}`);
  return response.data;
};
