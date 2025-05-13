import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaEnvelope, FaBook, FaShoppingCart, FaSignOutAlt, FaImages } from 'react-icons/fa';
import '../../styles/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  // Determinar qué enlace está activo
  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
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
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="logout-button">
          <FaSignOutAlt className="sidebar-icon" />
          <span>Volver al sitio</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
