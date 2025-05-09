import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../assets/images/vinilo-logo.png";
import taniaImage from "../assets/images/fundadora.jpg";
import GoldenButton from "./GoldenButton";
import AuthForm from './AuthForm'; 
import "../styles/Header.css";
import "../styles/Modal.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <img 
            src={logo} 
            alt="Logo de Akademia" 
            className="header-logo" 
          />
          <button 
            className="menu-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <RxHamburgerMenu />
          </button>
        </div>

        <div className="header-title">
          <h1>Akademia La Kúpula</h1>
          <GoldenButton 
            onClick={() => setShowLoginModal(true)} 
            aria-label="Abrir modal de autenticación"
          >
            Iniciar sesión
          </GoldenButton>
        </div>

        <div className="header-right">
          <img 
            src={taniaImage} 
            alt="Tania Calvo, fundadora" 
            className="header-tania" 
          />
        </div>
      </div>

     
      {isMenuOpen && (
        <nav className="nav-menu" aria-label="Menú principal">
          <a href="#inicio" onClick={toggleMenu}>Inicio</a>
          <a href="#cursos" onClick={toggleMenu}>Cursos</a>
          <a href="#contacto" onClick={toggleMenu}>Contacto</a>
        </nav>
      )}

  
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
              ✖
            </button>
            <AuthForm onClose={() => setShowLoginModal(false)} /> 
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
