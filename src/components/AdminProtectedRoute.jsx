import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Componente que protege las rutas de administración.
 * Solo permite el acceso a usuarios con el rol de administrador.
 */
const AdminProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado y es administrador
    const checkAdminStatus = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        // Verificar si el usuario existe, tiene token y es administrador
        if (user && token && user.is_admin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error al verificar estado de administrador:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Mientras se verifica, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Verificando permisos...</div>
      </div>
    );
  }

  // Si no es administrador, redirigir a la página de inicio
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es administrador, mostrar el contenido protegido
  return children;
};

export default AdminProtectedRoute;
