import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSync, FaVideo, FaImage, FaPlus, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import flayerTania from '../../assets/images/flayertania.png';
import './AdminDashboard.css';

// Función para formatear correctamente la URL de Instagram para el iframe
const formatInstagramUrl = (url) => {
  if (!url) return '';

  // Si ya es una URL de embed, devolverla tal cual
  if (url.includes('/embed')) {
    return url;
  }

  // Extraer el código del reel o post
  let postId = '';

  // Patrón para URLs de Instagram como https://www.instagram.com/reel/CODIGO/
<<<<<<< HEAD
  const reelPattern = /instagram\.com\/(?:reel|p)\/([^/?]+)/;
=======
  const reelPattern = /instagram\.com\/(?:reel|p)\/([^\/\?]+)/;
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
  const match = url.match(reelPattern);

  if (match && match[1]) {
    postId = match[1];
  } else {
    // Si no coincide con el patrón, usar la URL completa
    return `${url}/embed/captioned/?hidecaption=true&autoplay=false`;
  }

  // Construir la URL de embed correcta
  return `https://www.instagram.com/reel/${postId}/embed/captioned/?hidecaption=true&autoplay=false`;
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // 'video' o 'flyer'
  const [videoUrl, setVideoUrl] = useState('https://www.instagram.com/reel/DGjn9YcNr2B/');
  const [videoText, setVideoText] = useState('Descubre nuestras instalaciones y conoce más sobre nuestra metodología de enseñanza.');
  const [flyerUrl, setFlyerUrl] = useState(flayerTania);
  const [flyerTitle, setFlyerTitle] = useState('Próximos Cursos y Eventos');
  const [flyerText, setFlyerText] = useState('Mantente al día con nuestras últimas novedades, promociones especiales y eventos exclusivos.');
  const [editMode, setEditMode] = useState(false);
  const [originalVideoUrl, setOriginalVideoUrl] = useState('');
  const [originalVideoText, setOriginalVideoText] = useState('');
  const [originalFlyerUrl, setOriginalFlyerUrl] = useState('');
  const [originalFlyerTitle, setOriginalFlyerTitle] = useState('');
  const [originalFlyerText, setOriginalFlyerText] = useState('');
  const [videoError, setVideoError] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdmin = () => {
      try {
        // Verificar si el usuario es administrador
        const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
        const isAdminUser = userData && (userData.email === 'admin@gmail.com' || userData.isAdmin === true);

        if (!isAdminUser) {
          console.log('No es administrador, redirigiendo a la página principal...');
          navigate('/');
          return;
        }
      } catch (err) {
        console.error('Error al verificar permisos de administrador:', err);
        setError('Error al verificar permisos. Por favor, inténtalo de nuevo.');
      }
    };

    checkAdmin();
  }, [navigate]);

  // Función para iniciar la edición
  const startEditing = () => {
    setOriginalVideoUrl(videoUrl);
    setOriginalVideoText(videoText);
    setOriginalFlyerUrl(flyerUrl);
    setOriginalFlyerTitle(flyerTitle);
    setOriginalFlyerText(flyerText);
    setEditMode(true);
    setError(null);
    setSuccess(null);
  };

  // Función para cancelar la edición
  const cancelEditing = () => {
    setVideoUrl(originalVideoUrl);
    setVideoText(originalVideoText);
    setFlyerUrl(originalFlyerUrl);
    setFlyerTitle(originalFlyerTitle);
    setFlyerText(originalFlyerText);
    setEditMode(false);
    setError(null);
    setSuccess(null);
  };

  // Función para guardar cambios
  const saveChanges = () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Aquí iría la lógica para guardar los cambios en la base de datos
      console.log('Guardando cambios...');
      console.log('Video URL:', videoUrl);
      console.log('Video Text:', videoText);
      console.log('Flyer URL:', flyerUrl);
      console.log('Flyer Title:', flyerTitle);
      console.log('Flyer Text:', flyerText);

      // Simulamos una operación exitosa
      setTimeout(() => {
        setLoading(false);
        setSuccess('Cambios guardados correctamente');
        setEditMode(false);
      }, 1000);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      setError('Error al guardar los cambios. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  // Función para eliminar el contenido actual
  const deleteContent = () => {
    try {
      if (!window.confirm('¿Estás seguro de que deseas eliminar este contenido?')) {
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      // Aquí iría la lógica para eliminar el contenido de la base de datos
      console.log('Eliminando contenido...');

      // Simulamos una operación exitosa
      setTimeout(() => {
        if (activeTab === 'video') {
          setVideoUrl('');
          setVideoText('');
        } else {
          setFlyerUrl('');
          setFlyerTitle('');
          setFlyerText('');
        }
        setLoading(false);
        setSuccess('Contenido eliminado correctamente');
      }, 1000);
    } catch (err) {
      console.error('Error al eliminar contenido:', err);
      setError('Error al eliminar el contenido. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
=======
    <div className="admin-layout">
      <AdminSidebar />
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
      <div className="admin-content">
        <div className="dashboard-header">
          <h1>Panel de Administración de Contenido</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <div className="content-tabs">
          <button
            className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <FaVideo /> Video de Instagram
          </button>
          <button
            className={`tab-button ${activeTab === 'flyer' ? 'active' : ''}`}
            onClick={() => setActiveTab('flyer')}
          >
            <FaImage /> Flyer Informativo
          </button>
        </div>

        <div className="content-editor">
          {activeTab === 'video' && (
            <div className="video-editor">
              <h2>Editar Video de Instagram</h2>
              <p className="editor-description">
                Introduce la URL del video de Instagram que deseas mostrar en la sección "Conoce Nuestra Academia".
              </p>

              <div className="form-group">
                <label htmlFor="videoUrl">URL del Video:</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/CODIGO/"
                    className="form-control"
                    disabled={!editMode}
                  />
                  {editMode && (
                    <button
                      type="button"
                      className="test-button"
                      onClick={() => {
                        setVideoError(false);
                        // Forzar recarga del iframe
                        const tempUrl = videoUrl;
                        setVideoUrl('');
                        setTimeout(() => setVideoUrl(tempUrl), 100);
                      }}
                      title="Probar URL"
                    >
                      Probar
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="videoText">Texto descriptivo:</label>
                <textarea
                  id="videoText"
                  value={videoText}
                  onChange={(e) => setVideoText(e.target.value)}
                  placeholder="Descripción del video"
                  className="form-control"
                  rows="3"
                  disabled={!editMode}
                ></textarea>
              </div>

              <div className="preview-container">
                <h3>Vista previa:</h3>
                <div className="preview-content">
                  <div className="video-preview">
                    {videoUrl ? (
                      videoError ? (
                        <div className="video-error">
                          <p>Error al cargar el video</p>
                          <button
                            className="retry-button"
                            onClick={() => {
                              setVideoError(false);
                              // Forzar recarga del iframe
                              const tempUrl = videoUrl;
                              setVideoUrl('');
                              setTimeout(() => setVideoUrl(tempUrl), 100);
                            }}
                          >
                            Reintentar
                          </button>
                        </div>
                      ) : (
                        <iframe
                          src={formatInstagramUrl(videoUrl)}
                          style={{ border: 'none' }}
                          allowFullScreen
                          title="Vista previa del video de Instagram"
                          onError={() => setVideoError(true)}
                          onLoad={() => setVideoError(false)}
                        ></iframe>
                      )
                    ) : (
                      <div className="no-video-message">No hay video seleccionado</div>
                    )}
                  </div>
                  <div className="preview-text">
                    <p>{videoText}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flyer' && (
            <div className="flyer-editor">
              <h2>Editar Flyer Informativo</h2>
              <p className="editor-description">
                Introduce la URL de la imagen que deseas mostrar como flyer en la sección "Información Destacada".
              </p>

              <div className="form-group">
                <label htmlFor="flyerUrl">URL de la Imagen:</label>
                <input
                  type="text"
                  id="flyerUrl"
                  value={flyerUrl}
                  onChange={(e) => setFlyerUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="form-control"
                  disabled={!editMode}
                />
              </div>

              <div className="form-group">
                <label htmlFor="flyerTitle">Título del Flyer:</label>
                <input
                  type="text"
                  id="flyerTitle"
                  value={flyerTitle}
                  onChange={(e) => setFlyerTitle(e.target.value)}
                  placeholder="Título del flyer"
                  className="form-control"
                  disabled={!editMode}
                />
              </div>

              <div className="form-group">
                <label htmlFor="flyerText">Texto descriptivo:</label>
                <textarea
                  id="flyerText"
                  value={flyerText}
                  onChange={(e) => setFlyerText(e.target.value)}
                  placeholder="Descripción del flyer"
                  className="form-control"
                  rows="3"
                  disabled={!editMode}
                ></textarea>
              </div>

              <div className="preview-container">
                <h3>Vista previa:</h3>
                <div className="preview-content">
                  <div className="flyer-preview">
                    {flyerUrl ? (
                      <img
                        src={flyerUrl}
                        alt="Vista previa del flyer"
                      />
                    ) : (
                      <div className="no-flyer-message">No hay imagen seleccionada</div>
                    )}
                  </div>
                  <div className="preview-text">
                    <h4>{flyerTitle}</h4>
                    <p>{flyerText}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="action-buttons">
            {!editMode ? (
              <>
                <button
                  className="edit-button"
                  onClick={startEditing}
                  disabled={loading}
                >
                  <FaEdit /> Editar
                </button>
                <button
                  className="delete-button"
                  onClick={deleteContent}
                  disabled={loading || (activeTab === 'video' && !videoUrl) || (activeTab === 'flyer' && !flyerUrl)}
                >
                  <FaTrash /> Eliminar
                </button>
              </>
            ) : (
              <>
                <button
                  className="save-button"
                  onClick={saveChanges}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSync className="spinning" /> Guardando...
                    </>
                  ) : (
                    <>
                      <FaPlus /> Guardar Cambios
                    </>
                  )}
                </button>
                <button
                  className="cancel-button"
                  onClick={cancelEditing}
                  disabled={loading}
                >
                  <FaUndo /> Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
<<<<<<< HEAD
=======
    </div>
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
  );
};

export default AdminDashboard;
