
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SiTiktok } from "react-icons/si"
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaChevronDown, FaChevronUp } from "react-icons/fa";
import logo from "../assets/images/img-logo.svg";
import "../styles/Footer.css";
import "../styles/TextosLegales.css";

const Footer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para detener la propagación del evento
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <footer className="footer">
      <div className="footer-logo">
        <img 
          src={logo} 
          alt="Akademia La Kúpula" 
          className="footer-logo-img" 
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Menú desplegable */}
      <div className="footer-legal-menu">
        <button onClick={toggleMenu} className="footer-legal-toggle">
          <span>Textos Legales</span>
          {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {isMenuOpen && (
          <ul className="footer-menu-list">
            <li>
              <Link 
                to="/politica-privacidad" 
                onClick={stopPropagation} // Detener propagación
              >
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link 
                to="/aviso-legal" 
                onClick={stopPropagation} // Detener propagación
              >
                Aviso Legal
              </Link>
            </li>
            <li>
              <Link 
                to="/cookies" 
                onClick={stopPropagation} // Detener propagación
              >
                Política de Cookies
              </Link>
            </li>
            <li>
              <Link 
                to="/condiciones-de-compra" 
                onClick={stopPropagation} // Detener propagación
              >
                Condiciones de Compra
              </Link>
            </li>
          </ul>
        )}
      </div>
      <p>&copy; {new Date().getFullYear()} Akademia La Kúpula. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;