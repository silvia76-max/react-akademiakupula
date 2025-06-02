import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton = () => {
  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('akademia_auth_token');
    localStorage.removeItem('akademia_user_data');
    localStorage.removeItem('akademia_token_expiry');
    localStorage.removeItem('akademia_session_id');
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('akademia_auth_token');
    sessionStorage.removeItem('akademia_user_data');
    sessionStorage.removeItem('akademia_token_expiry');
    sessionStorage.removeItem('akademia_session_id');
    
    // Redirección forzada a la página principal
    window.location.href = '/';
    
    // Recargar la página para asegurar que se limpien todos los estados
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <button 
      onClick={handleLogout}
      className="logout-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 15px',
        backgroundColor: '#000',
        color: '#D4AF37',
        border: '1px solid #D4AF37',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <FaSignOutAlt />
      <span>Cerrar sesión</span>
    </button>
  );
};

export default LogoutButton;
