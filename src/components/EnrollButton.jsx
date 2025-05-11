import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const EnrollButton = ({ courseId, courseTitle, size = 'normal' }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  const handleClick = () => {
    if (isAuthenticated) {
      // Si el usuario está autenticado, mostrar mensaje de inscripción
      alert(`¡Gracias por inscribirte en el curso "${courseTitle}"!`);
    } else {
      // Si no está autenticado, redirigir al login
      navigate('/login', { 
        state: { 
          redirectTo: `/curso/${courseId}`,
          message: 'Debes iniciar sesión para inscribirte en este curso' 
        } 
      });
    }
  };
  
  const buttonClass = size === 'large' 
    ? 'enroll-button-large' 
    : 'enroll-button';
  
  if (isAuthenticated) {
    return (
      <button 
        className={buttonClass}
        onClick={handleClick}
      >
        {size === 'normal' && <FaShoppingCart className="button-icon" />}
        {size === 'large' ? 'Inscribirme en este curso' : 'Inscribirme ahora'}
      </button>
    );
  } else {
    return (
      <div className={size === 'large' ? 'login-required-container-large' : 'login-required-container'}>
        <button 
          className={`${buttonClass} disabled`}
          disabled
        >
          {size === 'normal' && <FaShoppingCart className="button-icon" />}
          Inscripción no disponible
        </button>
        <div className="login-message">
          <p>
            Debes <span className="login-link" onClick={handleClick}>iniciar sesión</span> para inscribirte en este curso
          </p>
        </div>
      </div>
    );
  }
};

export default EnrollButton;
