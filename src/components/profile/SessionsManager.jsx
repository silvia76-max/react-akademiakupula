import React, { useState, useEffect } from 'react';
import { FaDesktop, FaMobile, FaTablet, FaTrash, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
// Ahora importamos ambas funciones desde adminService.js en lugar de authService.js
import { getUserSessions, endSession } from '../../services/adminService';
import '../../styles/SessionsManager.css';

const SessionsManager = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sessionToEnd, setSessionToEnd] = useState(null);

  // Cargar las sesiones del usuario
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const userSessions = await getUserSessions();
        setSessions(userSessions);
        setError(null);
      } catch (err) {
        console.error('Error al cargar sesiones:', err);
        setError('No se pudieron cargar las sesiones. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Mostrar confirmación para finalizar una sesión
  const confirmEndSession = (sessionId) => {
    setSessionToEnd(sessionId);
    setShowConfirmation(true);
  };

  // Cancelar la confirmación
  const cancelEndSession = () => {
    setSessionToEnd(null);
    setShowConfirmation(false);
  };

  // Finalizar una sesión específica (o todas, si sessionToEnd === 'all')
  const handleEndSession = async () => {
    if (!sessionToEnd) return;

    try {
      // Si sessionToEnd === 'all', asumimos que endSession('all') cerrará todas las demás sesiones
      const success = await endSession(sessionToEnd);
      if (success) {
        if (sessionToEnd === 'all') {
          // Si cerramos “todas”, dejamos únicamente la sesión actual.
          // Aquí podrías filtrar de otra forma si tu backend te devuelve algo diferente.
          setSessions(sessions.filter((s) => s.is_current));
        } else {
          setSessions(sessions.filter((session) => session.id !== sessionToEnd));
        }
        setShowConfirmation(false);
        setSessionToEnd(null);
      } else {
        setError('No se pudo finalizar la(s) sesión(es). Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error al finalizar sesión:', err);
      setError('Error al finalizar la(s) sesión(es). Inténtalo de nuevo.');
    }
  };

  // Mostrar confirmación para finalizar todas las sesiones
  const confirmEndAllSessions = () => {
    setSessionToEnd('all');
    setShowConfirmation(true);
  };

  // Determinar el icono del dispositivo según el user agent
  const getDeviceIcon = (deviceInfo) => {
    if (!deviceInfo) return <FaDesktop />;

    const device = deviceInfo.toLowerCase();
    if (device.includes('smartphone') || device.includes('iphone') || device.includes('android')) {
      return <FaMobile />;
    }
    if (device.includes('tablet') || device.includes('ipad')) {
      return <FaTablet />;
    }
    return <FaDesktop />;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Desconocida';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular tiempo transcurrido
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `hace ${diffDay} ${diffDay === 1 ? 'día' : 'días'}`;
    }
    if (diffHour > 0) {
      return `hace ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
    }
    if (diffMin > 0) {
      return `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    }
    return 'hace unos segundos';
  };

  if (loading) {
    return (
      <div className="sessions-loading">
        <div className="loading-spinner"></div>
        <p>Cargando sesiones...</p>
      </div>
    );
  }

  return (
    <div className="sessions-manager">
      <div className="sessions-header">
        <h2>Sesiones activas</h2>
        <button
          className="end-all-sessions-button"
          onClick={confirmEndAllSessions}
          disabled={sessions.length <= 1}
        >
          <FaSignOutAlt /> Cerrar otras sesiones
        </button>
      </div>

      <div className="sessions-info">
        <FaInfoCircle className="info-icon" />
        <p>Aquí puedes ver todas tus sesiones activas y cerrarlas si detectas alguna actividad sospechosa.</p>
      </div>

      {error && <div className="sessions-error">{error}</div>}

      {sessions.length === 0 ? (
        <div className="no-sessions">
          <p>No hay sesiones activas.</p>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`session-card ${session.is_current ? 'current-session' : ''}`}
            >
              <div className="session-icon">
                {getDeviceIcon(session.device_info)}
              </div>
              <div className="session-info">
                <div className="session-device">
                  {session.device_info || 'Dispositivo desconocido'}
                  {session.is_current && <span className="current-badge">Actual</span>}
                </div>
                <div className="session-details">
                  <div className="session-ip">IP: {session.ip_address || 'Desconocida'}</div>
                  <div className="session-time">
                    <span>Inicio: {formatDate(session.started_at)}</span>
                    <span className="time-ago">({getTimeAgo(session.started_at)})</span>
                  </div>
                  <div className="session-activity">
                    <span>Última actividad: {formatDate(session.last_activity)}</span>
                    <span className="time-ago">({getTimeAgo(session.last_activity)})</span>
                  </div>
                </div>
              </div>
              {!session.is_current && (
                <button
                  className="end-session-button"
                  onClick={() => confirmEndSession(session.id)}
                  title="Finalizar sesión"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Confirmar acción</h3>
            <p>
              {sessionToEnd === 'all'
                ? '¿Estás seguro de que quieres cerrar todas las otras sesiones?'
                : '¿Estás seguro de que quieres cerrar esta sesión?'}
            </p>
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={handleEndSession}>
                Confirmar
              </button>
              <button className="cancel-button" onClick={cancelEndSession}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsManager;
