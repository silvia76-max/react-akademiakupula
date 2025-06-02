import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaHeart, FaShoppingCart, FaGraduationCap, FaCertificate, FaShieldAlt } from "react-icons/fa";
import logo from "../assets/images/logo.jpeg";
import "../styles/SimpleProfileHeader.css";

const SimpleProfileHeader = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  // Cerrar sesión
  const handleLogout = () => {
    console.log('Cerrando sesión...');

    // Eliminar datos de autenticación
    localStorage.removeItem('akademia_auth_token');
    localStorage.removeItem('akademia_user_data');
    localStorage.removeItem('akademia_token_expiry');
    localStorage.removeItem('akademia_session_id');

    // Eliminar también de sessionStorage
    sessionStorage.removeItem('akademia_auth_token');
    sessionStorage.removeItem('akademia_user_data');
    sessionStorage.removeItem('akademia_token_expiry');
    sessionStorage.removeItem('akademia_session_id');

    console.log('Datos de sesión eliminados');

    // Redirigir a la página principal
    navigate('/');

    // Recargar la página para asegurar que se limpien todos los estados
    window.location.reload();
  };

  // Lista de enlaces de navegación para el perfil
  const profileNavLinks = [
    { id: "profile", label: "Mi Perfil", icon: <FaUser /> },
    { id: "wishlist", label: "Lista de Deseos", icon: <FaHeart /> },
    { id: "cart", label: "Mi Carrito", icon: <FaShoppingCart /> },
    { id: "courses", label: "Mis Cursos", icon: <FaGraduationCap /> },
    { id: "certificates", label: "Mis Diplomas", icon: <FaCertificate /> }
  ];

  // Verificar si el usuario es administrador
  const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
  const isAdmin = userData && userData.isAdmin;

  // Si es administrador, añadir la pestaña de sesiones
  if (isAdmin) {
    profileNavLinks.push({ id: "sessions", label: "Sesiones", icon: <FaShieldAlt /> });
  }

  // Función para navegar a la página de cursos sin cerrar sesión
  const navigateToCourses = (e) => {
    e.preventDefault();
    navigate('/', { state: { keepSession: true } });
  };

  return (
    <div className="simple-profile-header">
      <div className="simple-profile-top">
        <div className="simple-profile-left">
          <Link to="/" className="simple-logo-link">
            <img
              src={logo}
              alt="Logo de Akademia La Kúpula"
              className="simple-logo"
              width="120"
              height="auto"
            />
          </Link>
        </div>

        <div className="simple-profile-title">
          <h1>Mi Cuenta</h1>
        </div>

        <div className="simple-profile-right">
          <button
            className="simple-explore-button"
            onClick={navigateToCourses}
          >
            Explorar Cursos
          </button>
          <button
            className="simple-logout-button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="simple-profile-nav">
        <ul className="simple-nav-list">
          {profileNavLinks.map(link => (
            <li key={link.id} className="simple-nav-item">
              <button
                className={activeTab === link.id ? 'active' : ''}
                onClick={() => setActiveTab(link.id)}
              >
                {link.icon} {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SimpleProfileHeader;
