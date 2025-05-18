import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaEnvelope, FaBook, FaShoppingCart, FaSync } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getDashboardData } from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_users: 0,
      total_contacts: 0,
      total_courses: 0,
      total_sales: 0
    },
    recent_users: [],
    recent_contacts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario es administrador y cargar datos
  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        // Verificar si el usuario es administrador
        const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
        const isAdminUser = userData && (userData.email === 'admin@gmail.com' || userData.isAdmin === true);

        if (!isAdminUser) {
          console.log('No es administrador, redirigiendo a la página principal...');
          navigate('/');
          return;
        }

        // Cargar datos del dashboard
        setLoading(true);
        const data = await getDashboardData();
        console.log('Datos recibidos del dashboard:', data);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [navigate]);

  // Función para recargar los datos
  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Error al recargar datos:', err);
      setError('Error al recargar los datos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-spinner">Cargando datos del dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="dashboard-header">
          <h1>Dashboard de Administración</h1>
          <button className="refresh-button" onClick={refreshData} disabled={loading}>
            <FaSync className={loading ? 'spinning' : ''} />
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon users">
              <FaUsers />
            </div>
            <div className="stat-details">
              <h3>Usuarios</h3>
              <p className="stat-value">{dashboardData?.stats?.total_users || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon messages">
              <FaEnvelope />
            </div>
            <div className="stat-details">
              <h3>Mensajes</h3>
              <p className="stat-value">{dashboardData?.stats?.total_contacts || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon courses">
              <FaBook />
            </div>
            <div className="stat-details">
              <h3>Cursos</h3>
              <p className="stat-value">{dashboardData?.stats?.total_courses || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon sales">
              <FaShoppingCart />
            </div>
            <div className="stat-details">
              <h3>Ventas</h3>
              <p className="stat-value">{dashboardData?.stats?.total_sales || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h2>Usuarios Recientes</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha de registro</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recent_users?.length > 0 ? (
                    dashboardData.recent_users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">No hay datos disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Mensajes Recientes</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recent_contacts?.length > 0 ? (
                    dashboardData.recent_contacts.map(contact => (
                      <tr key={contact.id}>
                        <td>{contact.id}</td>
                        <td>{contact.nombre}</td>
                        <td>{contact.email}</td>
                        <td>{new Date(contact.fecha_creacion).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">No hay datos disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
