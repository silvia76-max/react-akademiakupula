import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/VimeoPlayer.css';

const VimeoPlayer = ({ videoId, title, onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    // Cargar el script de Vimeo Player API
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    script.onload = initializePlayer;
    script.onerror = () => setError('Error al cargar el reproductor de Vimeo');
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [videoId]);

  const initializePlayer = () => {
    try {
      // Asegurarse de que el elemento iframe existe
      const iframe = document.getElementById(`vimeo-player-${videoId}`);
      if (!iframe) {
        setError('Error al inicializar el reproductor');
        return;
      }

      // Crear una instancia del reproductor de Vimeo
      const player = new window.Vimeo.Player(iframe);
      
      // Eventos del reproductor
      player.on('loaded', () => {
        setIsLoading(false);
        setPlayerReady(true);
      });
      
      player.on('progress', (data) => {
        setProgress(Math.floor(data.percent * 100));
        
        // Si el progreso es 100%, llamar a la función onComplete
        if (data.percent >= 0.99 && onComplete) {
          onComplete(videoId);
        }
      });
      
      player.on('error', (error) => {
        console.error('Error del reproductor de Vimeo:', error);
        setError('Error al reproducir el video');
      });
      
      // Guardar la referencia del reproductor
      window.vimeoPlayers = window.vimeoPlayers || {};
      window.vimeoPlayers[videoId] = player;
      
    } catch (err) {
      console.error('Error al inicializar el reproductor de Vimeo:', err);
      setError('Error al inicializar el reproductor');
    }
  };

  // Extraer el ID del video de la URL de Vimeo
  const extractVideoId = (url) => {
    if (!url) return null;
    
    // Si ya es un ID, devolverlo
    if (/^\d+$/.test(url)) return url;
    
    // Intentar extraer el ID de la URL
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : null;
  };

  const vimeoId = extractVideoId(videoId);

  if (!vimeoId) {
    return <div className="vimeo-error">ID de video inválido</div>;
  }

  return (
    <div className="vimeo-player-container">
      <div className="vimeo-player-header">
        <h3 className="vimeo-title">{title}</h3>
        {playerReady && (
          <div className="vimeo-progress-container">
            <div className="vimeo-progress-bar">
              <div 
                className="vimeo-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="vimeo-progress-text">{progress}% completado</span>
          </div>
        )}
      </div>
      
      <div className="vimeo-player-wrapper">
        {isLoading && (
          <div className="vimeo-loading">
            <div className="vimeo-spinner"></div>
            <p>Cargando video...</p>
          </div>
        )}
        
        {error && (
          <div className="vimeo-error">
            <p>{error}</p>
            <button 
              className="vimeo-retry-button"
              onClick={() => {
                setError(null);
                setIsLoading(true);
                initializePlayer();
              }}
            >
              Reintentar
            </button>
          </div>
        )}
        
        <iframe
          id={`vimeo-player-${videoId}`}
          src={`https://player.vimeo.com/video/${vimeoId}?h=0&autopause=0&player_id=0&app_id=58479`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          className={isLoading ? 'vimeo-iframe loading' : 'vimeo-iframe'}
        ></iframe>
      </div>
    </div>
  );
};

VimeoPlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
  title: PropTypes.string,
  onComplete: PropTypes.func
};

VimeoPlayer.defaultProps = {
  title: 'Video',
  onComplete: null
};

export default VimeoPlayer;
