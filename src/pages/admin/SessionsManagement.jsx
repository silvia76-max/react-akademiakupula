import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import DataTable from '../../components/admin/DataTable';
import { endSession } from '../../services/authService';
import '../admin/AdminDashboard.css';
import '../../styles/admin/SessionsManagement.css';

const SessionsManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'user_id', label: 'Usuario', sortable: true },
    { key: 'ip_address', label: 'IP', sortable: false },
    { key: 'device_info', label: 'Dispositivo', sortable: false },
    { key: 'started_at', label: 'Inicio', sortable: true },
    { key: 'ended_at', label: 'Fin', sortable: true },
    { key: 'is_active', label: 'Activa', sortable: true, render: v => v ? 'Sí' : 'No' }
  ];

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await getSessions();
        setSessions(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Error al cargar las sesiones. Por favor, inténtalo de nuevo.');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Filtrar sesiones por término de búsqueda
  const filteredSessions = Array.isArray(sessions) ? sessions.filter(session =>
    (session.ip_address || '').includes(searchTerm) ||
    (session.device_info || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.user_id + '').includes(searchTerm)
  ) : [];

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleEndSession = (session) => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  const confirmEndSession = async () => {
    if (!sessionToDelete) return;
    try {
      await endSession(sessionToDelete.session_id);
      setSessions(sessions.map(session =>
        session.id === sessionToDelete.id
          ? { ...session, is_active: false }
          : session
      ));
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (err) {
      setError('Error al finalizar la sesión. Por favor, inténtalo de nuevo.');
    }
  };

  const cancelEndSession = () => {
    setShowDeleteModal(false);
    setSessionToDelete(null);
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>Gestión de Sesiones</h1>
      </div>

      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar por IP, dispositivo o ID de usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </div>

      <DataTable
        data={filteredSessions}
        columns={columns}
        title="Sesiones de usuarios"
        onView={handleViewSession}
        onDelete={handleEndSession}
        loading={loading}
        error={error}
        emptyMessage="No hay sesiones registradas"
      />

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmar finalización de sesión</h2>
            <p>¿Estás seguro de que deseas finalizar la sesión del usuario <strong>{sessionToDelete?.user_id}</strong>?</p>
            <p>Esta acción cerrará la sesión del usuario y tendrá que volver a iniciar sesión.</p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelEndSession}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={confirmEndSession}>
                Finalizar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {showSessionModal && selectedSession && (
        <div className="modal-overlay">
          <div className="modal session-modal">
            <h2>Detalles de la sesión</h2>
            <div className="session-details">
              <div className="session-field">
                <span className="field-label">ID de sesión:</span>
                <span className="field-value">{selectedSession.session_id}</span>
              </div>
              <div className="session-field">
                <span className="field-label">ID de usuario:</span>
                <span className="field-value">{selectedSession.user_id}</span>
              </div>
              <div className="session-field">
                <span className="field-label">Dirección IP:</span>
                <span className="field-value">{selectedSession.ip_address}</span>
              </div>
              <div className="session-field">
                <span className="field-label">Dispositivo:</span>
                <span className="field-value">{selectedSession.device_info}</span>
              </div>
              <div className="session-field">
                <span className="field-label">Navegador:</span>
                <span className="field-value">{selectedSession.user_agent}</span>
              </div>
              <div className="session-field">
                <span className="field-label">Inicio de sesión:</span>
                <span className="field-value">{selectedSession.started_at ? new Date(selectedSession.started_at).toLocaleString() : ''}</span>
              </div>
              <div className="session-field">
                <span className="field-label">Última actividad:</span>
                <span className="field-value">{selectedSession.last_activity ? new Date(selectedSession.last_activity).toLocaleString() : ''}</span>
              </div>
              <div className="session-field">
                <span className="field-label">Estado:</span>
                <span className={`status-badge ${selectedSession.is_active ? 'active' : 'inactive'}`}>
                  {selectedSession.is_active ? 'Activa' : 'Finalizada'}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              {selectedSession.is_active && (
                <button
                  className="danger-button"
                  onClick={() => {
                    setShowSessionModal(false);
                    handleEndSession(selectedSession);
                  }}
                >
                  <FaSignOutAlt /> Finalizar sesión
                </button>
              )}
              <button className="cancel-button" onClick={() => setShowSessionModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsManagement;
