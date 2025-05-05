import React from "react";
import { Link } from "react-router-dom"; // Usamos Link para navegación en React
import "../styles/GoldenButton.css";  

const GoldenButton = ({ text, href, onClick, children, link }) => {
  // Si no hay href, usamos `link` (para rutas internas con React Router)
  const ButtonContent = children || text || link;

  if (href) {
    // Si `href` está presente, es un enlace externo
    return (
      <a href={href} className="golden-button" onClick={onClick}>
        {ButtonContent}
      </a>
    );
  }

  if (link) {
    // Si `link` está presente, usamos React Router para navegación interna
    return (
      <Link to={link} className="golden-button" onClick={onClick}>
        {ButtonContent}
      </Link>
    );
  }

  // En caso de que no haya ni `href` ni `link`, solo se ejecuta el `onClick`
  return (
    <button className="golden-button" onClick={onClick}>
      {ButtonContent}
    </button>
  );
};

export default GoldenButton;
