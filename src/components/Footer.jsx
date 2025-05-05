
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

      <nav className="footer-links" aria-label="Redes sociales">
        <a 
          href="https://www.tiktok.com/@taniadelacupula" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="TikTok"
          className="social-icon"
        >
           <SiTiktok aria-hidden="true" />
        </a>
        <a 
          href="https://www.facebook.com/tania.laCupula" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Facebook"
          className="social-icon"
        >
          <FaFacebook aria-hidden="true" />
        </a>
        <a 
          href="https://www.instagram.com/taniadelacupula" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Instagram"
          className="social-icon"
        >
          <FaInstagram aria-hidden="true" />
        </a>
        <a 
          href="https://wa.me/+34620576646" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="WhatsApp"
          className="social-icon"
        >
          <FaWhatsapp aria-hidden="true" />
        </a>
        <a 
          href="mailto:institutodebellezataniacalvo@gmail.com" 
          aria-label="Email"
          className="social-icon"
        >
          <FaEnvelope aria-hidden="true" />
        </a>
      </nav>
      <p>&copy; {new Date().getFullYear()} Akademia La Kúpula. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;