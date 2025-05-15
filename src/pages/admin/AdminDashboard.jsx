import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaEnvelope, FaBook, FaShoppingCart } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getDashboardData } from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Verificar si el token existe
        const token = localStorage.getItem('token');
        console.log('Token de autenticación:', token ? 'Existe' : 'No existe');

        // Verificar si el usuario es admin
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Usuario:', user);
        console.log('¿Es admin?:', user.is_admin);

        const data = await getDashboardData();
        console.log('Datos recibidos del dashboard:', data);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        // Mostrar más detalles del error
        if (err.response) {
          console.error('Respuesta del servidor:', err.response.data);
          console.error('Código de estado:', err.response.status);
          setError(`Error ${err.response.status}: ${err.response.data.message || 'Error al cargar los datos'}`);
        } else if (err.request) {
          console.error('No se recibió respuesta del servidor');
          setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Verificar si el usuario es administrador
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.is_admin) {
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="loading-spinner">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Dashboard de Administración</h1>

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
                  {dashboardData?.recent_users?.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
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
                  {dashboardData?.recent_contacts?.map(contact => (
                    <tr key={contact.id}>
                      <td>{contact.id}</td>
                      <td>{contact.nombre}</td>
                      <td>{contact.email}</td>
                      <td>{new Date(contact.fecha_creacion).toLocaleDateString()}</td>
                    </tr>
                  ))}
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
