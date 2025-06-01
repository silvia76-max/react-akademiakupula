import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege las rutas de administración.
 * Solo permite el acceso a usuarios con el rol de administrador.
 */
const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  console.log('currentUser en AdminProtectedRoute:', currentUser);

  if (loading) return <div>Cargando...</div>;
  if (!currentUser || !currentUser.is_admin) return <Navigate to="/profile" replace />;
  return children;
};

export default AdminProtectedRoute;
