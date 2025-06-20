import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado y es administrador
    const checkAdminStatus = () => {
      try {
        // Verificar con el nuevo sistema de autenticación
        const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
        const token = localStorage.getItem('akademia_auth_token');

        console.log('Verificando estado de administrador:', userData);

        // Verificar explícitamente si es el usuario administrador por email
        const isAdminUser = userData && userData.email === 'admin@gmail.com';

        if (isAdminUser) {
          console.log('Usuario es administrador (email: admin@gmail.com)');
          setIsAdmin(true);
        } else if (userData && token && userData.isAdmin === true) {
          console.log('Usuario es administrador (propiedad isAdmin)');
          setIsAdmin(true);
        } else {
          console.log('Usuario NO es administrador');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error al verificar estado de administrador:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Solo verificar cuando la autenticación haya terminado de cargar
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authLoading, currentUser]);

  // Mientras se verifica, mostrar un indicador de carga
  if (loading || authLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Verificando permisos...</div>
      </div>
    );
  }

  // Si no es administrador, redirigir a la página de inicio
  if (!isAdmin) {
    console.log('Redirigiendo a inicio - No es administrador');
    return <Navigate to="/" replace />;
  }

  // Si es administrador, mostrar el contenido protegido
  console.log('Mostrando contenido de administrador');
  return children;
};

export default AdminProtectedRoute;

