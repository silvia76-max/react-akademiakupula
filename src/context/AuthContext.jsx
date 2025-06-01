/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getUserData,
  updateUserData,
  isAuthenticated
} from '../services/authService';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar el usuario al iniciar la aplicación
  useEffect(() => {
    try {
      const userData = getUserData();
      if (userData) {
        setCurrentUser(userData);
        console.log('Usuario cargado:', userData);
      }
    } catch (error) {
      setError('Error al cargar usuario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para registrar un usuario
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await registerService(userData);
      setCurrentUser(user);
      return user;
    } catch (error) {
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
      return user;
    } catch (error) {
      setError('Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await logoutService();
      setCurrentUser(null);
      return true;
    } catch (error) {
      setCurrentUser(null);
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
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: () => !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => useContext(AuthContext);