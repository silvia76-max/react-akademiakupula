import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { FaUser, FaHeart, FaShoppingCart, FaGraduationCap, FaCertificate } from "react-icons/fa";
import logo from "../assets/images/logo.jpeg";
import "../styles/Header.css";
import "../styles/ProfileHeader.css";

const ProfileHeader = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Manejar el scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Lista de enlaces de navegación para el perfil
  const profileNavLinks = [
    { id: "profile", label: "Mi Perfil", icon: <FaUser /> },
    { id: "wishlist", label: "Lista de Deseos", icon: <FaHeart /> },
    { id: "cart", label: "Mi Carrito", icon: <FaShoppingCart /> },
    { id: "courses", label: "Mis Cursos", icon: <FaGraduationCap /> },
    { id: "certificates", label: "Mis Diplomas", icon: <FaCertificate /> }
  ];

  return (
    <header className={`header profile-header ${isScrolled ? 'header-scrolled' : ''}`}>
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
