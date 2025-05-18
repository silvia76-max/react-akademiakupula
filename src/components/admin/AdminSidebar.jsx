import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaEnvelope, FaBook, FaShoppingCart, FaSignOutAlt, FaImages, FaKey } from 'react-icons/fa';
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
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      window.location.href = '/';
    }
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
          <li className={isActive('/admin/users')}>
            <Link to="/admin/users">
              <FaUsers className="sidebar-icon" />
              <span>Usuarios</span>
            </Link>
          </li>
          <li className={isActive('/admin/content')}>
            <Link to="/admin/content">
              <FaImages className="sidebar-icon" />
              <span>Contenido</span>
            </Link>
          </li>
          <li className={isActive('/admin/contacts')}>
            <Link to="/admin/contacts">
              <FaEnvelope className="sidebar-icon" />
              <span>Mensajes</span>
            </Link>
          </li>
          <li className={isActive('/admin/courses')}>
            <Link to="/admin/courses">
              <FaBook className="sidebar-icon" />
              <span>Cursos</span>
            </Link>
          </li>
          <li className={isActive('/admin/orders')}>
            <Link to="/admin/orders">
              <FaShoppingCart className="sidebar-icon" />
              <span>Ventas</span>
            </Link>
          </li>
          <li className={isActive('/admin/sessions')}>
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
