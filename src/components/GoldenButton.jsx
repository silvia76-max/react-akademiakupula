import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Usamos Link para navegación en React
import "../styles/GoldenButton.css";

// Wrapper para usar el hook useNavigate
const GoldenButtonWithNavigation = (props) => {
  const navigate = useNavigate();
  return <GoldenButtonInner {...props} navigate={navigate} />;
};

// Componente interno que recibe navigate como prop
const GoldenButtonInner = ({ text, href, onClick, children, link, requiresAuth = false, courseId = null, navigate }) => {
  // Si no hay href, usamos `link` (para rutas internas con React Router)
  const ButtonContent = children || text || link;

  // Función para manejar clics en botones que requieren autenticación
  const handleAuthClick = (e) => {
    if (requiresAuth) {
      const isAuthenticated = localStorage.getItem('token') !== null;

      if (!isAuthenticated) {
        e.preventDefault(); // Prevenir la navegación predeterminada

        // Redirigir al login con información del curso
        navigate('/login', {
          state: {
            redirectTo: courseId ? `/curso/${courseId}` : link,
            message: 'Debes iniciar sesión para acceder a este contenido'
          }
        });

        return;
      }
    }

    // Si hay un onClick personalizado, ejecutarlo
    if (onClick) {
      onClick(e);
    }
  };

  if (href) {
    // Si `href` está presente, es un enlace externo
    return (
      <a href={href} className="golden-button" onClick={handleAuthClick}>
        {ButtonContent}
      </a>
    );
  }

  if (link) {
    // Si `link` está presente, usamos React Router para navegación interna
    return (
      <Link to={link} className="golden-button" onClick={handleAuthClick}>
        {ButtonContent}
      </Link>
    );
  }

  // En caso de que no haya ni `href` ni `link`, solo se ejecuta el `onClick`
  return (
    <button className="golden-button" onClick={handleAuthClick}>
      {ButtonContent}
    </button>
  );
};

export default GoldenButtonWithNavigation;
