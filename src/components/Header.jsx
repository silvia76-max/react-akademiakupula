import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/images/vinilo-logo.png";
import taniaImage from "../assets/images/fundadora.jpg";
import GoldenButton from "./GoldenButton";
import AuthForm from './AuthForm';
import "../styles/Header.css";
import "../styles/Modal.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
                onClick={() => setShowLoginModal(true)}
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

            <img
              src={taniaImage}
              alt="Tania Calvo, fundadora"
              className="header-tania"
            />
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
                  setShowLoginModal(true);
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
          onClick={() => setShowLoginModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setShowLoginModal(false)}
              aria-label="Cerrar modal"
            >
              <IoMdClose />
            </button>
            <AuthForm onClose={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
