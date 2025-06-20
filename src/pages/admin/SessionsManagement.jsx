import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { FaSearch, FaTrash, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import DataTable from '../../components/admin/DataTable';
import { endSession } from '../../services/authService';
=======
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTrash, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DataTable from '../../components/admin/DataTable';
import { getSessions, endSession } from '../../services/adminService';
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
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
<<<<<<< HEAD

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
=======
  const navigate = useNavigate();

  // Columnas para la tabla de sesiones
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'user_id', label: 'ID Usuario', sortable: true },
    { key: 'ip_address', label: 'Dirección IP', sortable: true },
    { key: 'device_info', label: 'Dispositivo', sortable: true },
    {
      key: 'started_at',
      label: 'Inicio',
      sortable: true,
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'last_activity',
      label: 'Última actividad',
      sortable: true,
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'is_active',
      label: 'Estado',
      sortable: true,
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Activa' : 'Finalizada'}
        </span>
      )
    }
  ];

  const fetchSessions = async () => {
    try {
      setLoading(true);

      // Verificar si el usuario es administrador
      const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
      if (!userData || !userData.isAdmin) {
        console.log('No es administrador, redirigiendo a la página principal...');
        navigate('/');
        return;
      }

      // Obtener las sesiones usando el servicio adminService
      const data = await getSessions();
      console.log('Sesiones obtenidas:', data);
      setSessions(data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar sesiones:', err);
      setError('Error al cargar las sesiones. Por favor, inténtalo de nuevo.');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtrar sesiones por término de búsqueda
    if (searchTerm.trim() === '') {
      fetchSessions();
    } else {
      const filteredSessions = sessions.filter(session =>
        session.ip_address.includes(searchTerm) ||
        session.device_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.user_id.toString().includes(searchTerm)
      );
      setSessions(filteredSessions);
    }
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
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
<<<<<<< HEAD
    try {
      await endSession(sessionToDelete.session_id);
=======

    try {
      await endSession(sessionToDelete.session_id);

      // Actualizar la lista de sesiones
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
      setSessions(sessions.map(session =>
        session.id === sessionToDelete.id
          ? { ...session, is_active: false }
          : session
      ));
<<<<<<< HEAD
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (err) {
=======

      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (err) {
      console.error('Error al finalizar sesión:', err);
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
      setError('Error al finalizar la sesión. Por favor, inténtalo de nuevo.');
    }
  };

  const cancelEndSession = () => {
    setShowDeleteModal(false);
    setSessionToDelete(null);
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="admin-layout">
      <AdminSidebar />
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
          data={sessions}
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
                  <span className="field-value">{new Date(selectedSession.started_at).toLocaleString()}</span>
                </div>
                <div className="session-field">
                  <span className="field-label">Última actividad:</span>
                  <span className="field-value">{new Date(selectedSession.last_activity).toLocaleString()}</span>
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
>>>>>>> 92ec14313c90033ee7aed81cb6133cfda4661041
    </div>
  );
};

export default SessionsManagement;
