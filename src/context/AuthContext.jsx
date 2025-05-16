import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  isAuthenticated,
  getUserData,
  updateUserData,
  isAdmin
} from '../services/authService';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Cargar el usuario al iniciar la aplicación
  useEffect(() => {
    const loadUser = () => {
      try {
        if (isAuthenticated()) {
          const userData = getUserData();
          setCurrentUser(userData);
          setIsAdminUser(isAdmin());
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        setError('Error al cargar usuario');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función para registrar un usuario
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const user = await registerService(userData);
      setCurrentUser(user);
      setIsAdminUser(isAdmin());
      return user;
    } catch (error) {
      console.error('Error al registrar:', error);
      setError('Error al registrar usuario');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (credentials, rememberMe = true) => {
    setLoading(true);
    setError(null);

    try {
      const user = await loginService(credentials, rememberMe);
      setCurrentUser(user);
      setIsAdminUser(isAdmin());
      return user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    try {
      const result = logoutService();
      console.log('Resultado de logoutService:', result);

      // Actualizar el estado
      setCurrentUser(null);
      setIsAdminUser(false);

      return result;
    } catch (error) {
      console.error('Error en función logout del contexto:', error);
      return false;
    }
  };

  // Función para actualizar el perfil del usuario
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserData(userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError('Error al actualizar perfil');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    currentUser,
    loading,
    error,
    isAdminUser,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: () => isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
