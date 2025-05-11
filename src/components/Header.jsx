import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/images/logo.jpeg";
import taniaImage from "../assets/images/fundadora.png";
import GoldenButton from "./GoldenButton";
import AuthForm from './AuthForm';
import "../styles/Header.css";
import "../styles/Modal.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Función para abrir el modal de login
  const openLoginModal = () => {
    console.log("Abriendo modal de login");
    setShowLoginModal(true);
  };

  // Función para cerrar el modal de login
  const closeLoginModal = () => {
    console.log("Cerrando modal de login");
    setShowLoginModal(false);
  };

  // Manejar el scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      // Detectar qué sección está activa basado en la posición de scroll
      const sections = ["inicio", "sobre", "cursos", "contacto"];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Detectar cambios en el tamaño de la ventana para responsive
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

  // Lista de enlaces de navegación para mantener consistencia
  const navLinks = [
    { id: "inicio", label: "Inicio" },
    { id: "sobre", label: "Nosotros" },
    { id: "cursos", label: "Cursos" },
    { id: "contacto", label: "Contacto" }
  ];

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-top">
          <div className="header-left">
            <a href="#inicio" className="logo-link">
              <img
                src={logo}
                alt="Logo de Akademia La Kúpula"
                className="header-logo"
                width="120"
                height="auto"
              />
            </a>
          </div>

          <div className="header-title">
            <h1>Akademia La Kúpula</h1>

            {/* Navegación para pantallas medianas y grandes */}
            <nav className="desktop-nav" aria-label="Navegación principal">
              <ul className="nav-list">
                {navLinks.map(link => (
                  <li key={link.id} className="nav-item">
                    <a
                      href={`#${link.id}`}
                      className={activeSection === link.id ? 'active' : ''}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Botón de login debajo de la navbar */}
            <div className="login-container">
              <GoldenButton
                onClick={openLoginModal}
                aria-label="Iniciar sesión"
                className="login-button"
              >
                <FaUserCircle className="user-icon" />
                <span className="login-text">Acceder</span>
              </GoldenButton>
            </div>
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

            {!isMobile && (
              <div className="header-tania-container">
                <img
                  src={taniaImage}
                  alt="Tania Calvo, fundadora"
                  className="header-tania"
                  loading="lazy"
                  width="180"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`mobile-nav-container ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav" aria-label="Menú móvil">
          <ul className="mobile-nav-list">
            {navLinks.map((link, index) => (
              <li key={link.id} className="mobile-nav-item" style={{animationDelay: `${index * 0.1}s`}}>
                <a
                  href={`#${link.id}`}
                  onClick={closeMenu}
                  className={activeSection === link.id ? 'active' : ''}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mobile-nav-item" style={{animationDelay: `${navLinks.length * 0.1}s`}}>
              <GoldenButton
                onClick={() => {
                  closeMenu();
                  openLoginModal();
                }}
                className="mobile-login-button"
              >
                Iniciar sesión
              </GoldenButton>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal de inicio de sesión */}
      {showLoginModal && (
        <div
          className="modal-overlay"
          onClick={closeLoginModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={closeLoginModal}
              aria-label="Cerrar modal"
            >
              <IoMdClose />
            </button>
            <AuthForm onClose={closeLoginModal} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
