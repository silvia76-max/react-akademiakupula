import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaSignOutAlt,
  FaUsers,
  FaGraduationCap,
  FaEnvelope,
  FaShoppingCart,
  FaKey,
  FaDatabase
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  // Determinar qué enlace está activo
  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('akademia_auth_token');
    localStorage.removeItem('akademia_user_data');
    localStorage.removeItem('akademia_token_expiry');
    localStorage.removeItem('akademia_session_id');

    // Limpiar sessionStorage
    sessionStorage.removeItem('akademia_auth_token');
    sessionStorage.removeItem('akademia_user_data');
    sessionStorage.removeItem('akademia_token_expiry');
    sessionStorage.removeItem('akademia_session_id');

    console.log('Sesión cerrada manualmente');

    // Redirección forzada a la página principal
    window.location.href = '/';
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Panel Admin</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}>
            <Link to="/admin">
              <FaHome className="sidebar-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive('/admin/users') ? 'active' : ''}>
            <Link to="/admin/users">
              <FaUsers className="sidebar-icon" />
              <span>Usuarios</span>
            </Link>
          </li>
          <li className={isActive('/admin/courses') ? 'active' : ''}>
            <Link to="/admin/courses">
              <FaGraduationCap className="sidebar-icon" />
              <span>Cursos</span>
            </Link>
          </li>
          <li className={isActive('/admin/contacts') ? 'active' : ''}>
            <Link to="/admin/contacts">
              <FaEnvelope className="sidebar-icon" />
              <span>Mensajes</span>
            </Link>
          </li>
          <li className={isActive('/admin/orders') ? 'active' : ''}>
            <Link to="/admin/orders">
              <FaShoppingCart className="sidebar-icon" />
              <span>Ventas</span>
            </Link>
          </li>
          <li className={isActive('/admin/sessions') ? 'active' : ''}>
            <Link to="/admin/sessions">
              <FaKey className="sidebar-icon" />
              <span>Sesiones</span>
            </Link>
          </li>

        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="sidebar-icon" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
