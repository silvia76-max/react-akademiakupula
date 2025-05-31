import React, { useState, useEffect } from 'react';
import VimeoPlayer from '../VimeoPlayer';
import '../../styles/MyCourses.css';

const MyCourses = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Función para verificar si el usuario es administrador
    const checkAdminStatus = async () => {
      try {
        setLoading(true);

        // Verificar si el usuario es administrador
        const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
        const adminStatus = userData && userData.isAdmin;
        setIsAdmin(adminStatus);

        console.log('Estado de administrador:', adminStatus);

        setLoading(false);
      } catch (err) {
        console.error('Error al verificar estado de administrador:', err);
        setError('Error al cargar tus cursos. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tus cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Mostrar mensaje cuando no hay cursos
  return (
    <div className="empty-state">
      <h3>No estás inscrito en ningún curso</h3>
      <p className="empty-state-subtitle">Explora nuestro catálogo y encuentra el curso perfecto para ti</p>
      <a href="/" className="browse-courses-link">Ver cursos disponibles</a>

      {/* Ejemplo de reproductor de video (solo visible para administradores) */}
      {isAdmin && (
        <div className="example-player">
          <h4>Ejemplo de reproductor de video:</h4>
          <div className="vimeo-player-container">
            <VimeoPlayer
              videoId="824804225"
              title="Video de ejemplo"
              onComplete={() => console.log('Video completado')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
