import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { FaUser, FaHeart, FaShoppingCart, FaGraduationCap, FaCertificate, FaShieldAlt } from "react-icons/fa";
import logo from "../assets/images/logo.jpeg";
import "../styles/Header.css";
import "../styles/ProfileHeader.css";

const ProfileHeader = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Cerrar sesión
  const handleLogout = () => {
    console.log('Cerrando sesión desde ProfileHeader...');

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

  // Función para navegar a la página de cursos sin cerrar sesión
  const navigateToCourses = (e) => {
    e.preventDefault();
    navigate('/', { state: { keepSession: true } });
  };

  return (
    <header className="header profile-header">
      <div className="header-container">
        <div className="header-top">
          <div className="header-left">
            <Link to="/" className="logo-link">
              <img
                src={logo}
                alt="Logo de Akademia La Kúpula"
                className="header-logo"
                width="120"
                height="auto"
              />
            </Link>
          </div>

          <div className="header-title">
            <h1>Mi Cuenta</h1>

            {/* Navegación para pantallas medianas y grandes */}
            <nav className="desktop-nav profile-nav" aria-label="Navegación de perfil">
              <ul className="nav-list">
                {profileNavLinks.map(link => (
                  <li key={link.id} className="nav-item">
                    <button
                      className={activeTab === link.id ? 'active' : ''}
                      onClick={() => setActiveTab(link.id)}
                    >
                      {link.icon} {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="header-right">
            <button
              className={`menu-toggle ${isMenuOpen ? 'menu-open' : ''}`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <IoMdClose /> : <RxHamburgerMenu />}
            </button>

            <button
              className="explore-courses-button"
              onClick={navigateToCourses}
            >
              Explorar Cursos
            </button>
            <button
              className="logout-button-header"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`mobile-nav-container ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav" aria-label="Menú móvil de perfil">
          <ul className="mobile-nav-list">
            {profileNavLinks.map((link, index) => (
              <li key={link.id} className="mobile-nav-item" style={{animationDelay: `${index * 0.1}s`}}>
                <button
                  onClick={() => {
                    setActiveTab(link.id);
                    closeMenu();
                  }}
                  className={activeTab === link.id ? 'active' : ''}
                >
                  {link.icon} {link.label}
                </button>
              </li>
            ))}
            <li className="mobile-nav-item" style={{animationDelay: `${profileNavLinks.length * 0.1}s`}}>
              <button
                onClick={navigateToCourses}
                className="mobile-explore-button"
              >
                Explorar Cursos
              </button>
            </li>
            <li className="mobile-nav-item" style={{animationDelay: `${(profileNavLinks.length + 1) * 0.1}s`}}>
              <button
                onClick={handleLogout}
                className="mobile-logout-button"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default ProfileHeader;
