import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaFileInvoice, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getOrders, getOrder } from '../../services/adminService';
import './OrdersManagement.css';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const navigate = useNavigate();



  useEffect(() => {
    // Función para cargar las órdenes desde la API
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // Verificar si el usuario es administrador
        const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
        if (!userData || !userData.isAdmin) {
          console.log('No es administrador, redirigiendo a la página principal...');
          navigate('/');
          return;
        }

        // Construir filtros para la API
        const apiFilters = {};
        if (filters.status) apiFilters.status = filters.status;
        if (filters.dateFrom) apiFilters.dateFrom = filters.dateFrom;
        if (filters.dateTo) apiFilters.dateTo = filters.dateTo;

        // Obtener las órdenes usando el servicio adminService
        const data = await getOrders(1, 50, apiFilters);
        console.log('Órdenes obtenidas:', data);
        setOrders(data || []);
        setError(null);
      } catch (err) {
        console.error('Error al cargar las órdenes:', err);
        setError('Error al cargar las órdenes. Por favor, inténtalo de nuevo.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, filters.status, filters.dateFrom, filters.dateTo]);

  // Filtrar órdenes según los criterios
  const filteredOrders = orders.filter(order => {
    // Filtro por término de búsqueda
    const searchMatch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por estado
    const statusMatch = filters.status === '' || order.status === filters.status;

    // Filtro por fecha
    let dateMatch = true;
    if (filters.dateFrom) {
      const orderDate = new Date(order.created_at);
      const fromDate = new Date(filters.dateFrom);
      dateMatch = dateMatch && orderDate >= fromDate;
    }
    if (filters.dateTo) {
      const orderDate = new Date(order.created_at);
      const toDate = new Date(filters.dateTo);
      // Ajustar la fecha final para incluir todo el día
      toDate.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && orderDate <= toDate;
    }

    return searchMatch && statusMatch && dateMatch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda ya se realiza automáticamente con el filtro
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewOrder = async (order) => {
    try {
      setLoading(true);
      // Obtener los detalles completos de la orden
      const orderDetails = await getOrder(order.id);
      setSelectedOrder(orderDetails);
      setShowModal(true);
      setError(null);
    } catch (err) {
      console.error(`Error al obtener detalles de la orden ${order.id}:`, err);
      setError('Error al obtener detalles de la orden. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = (orderId) => {
    // En una implementación real, aquí generarías la factura
    alert(`Generando factura para la orden ${orderId}`);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      case 'refunded': return 'refunded';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'failed': return 'Fallido';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1>Gestión de Ventas</h1>
        </div>

        <div className="filters-container">
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar por número de orden, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="status">
                <FaFilter /> Estado:
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="completed">Completado</option>
                <option value="pending">Pendiente</option>
                <option value="failed">Fallido</option>
                <option value="refunded">Reembolsado</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="dateFrom">
                <FaCalendarAlt /> Desde:
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dateTo">
                <FaCalendarAlt /> Hasta:
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Cargando...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nº Orden</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.user.name}</td>
                    <td>{order.user.email}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>{order.total_amount.toFixed(2)} €</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="view-button"
                        onClick={() => handleViewOrder(order)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="invoice-button"
                        onClick={() => handleGenerateInvoice(order.id)}
                        title="Generar factura"
                      >
                        <FaFileInvoice />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para ver detalles de la orden */}
        {showModal && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content order-modal">
              <div className="modal-header">
                <h2>Detalles de la Orden #{selectedOrder.order_number}</h2>
                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="order-details">
                  <div className="order-section">
                    <h3>Información General</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Estado:</span>
                        <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                          {getStatusText(selectedOrder.status)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Fecha:</span>
                        <span className="detail-value">{formatDate(selectedOrder.created_at)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Método de pago:</span>
                        <span className="detail-value">Tarjeta de crédito</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">ID de pago:</span>
                        <span className="detail-value">{selectedOrder.payment_id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-section">
                    <h3>Información del Cliente</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Nombre:</span>
                        <span className="detail-value">{selectedOrder.user.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{selectedOrder.user.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">ID de usuario:</span>
                        <span className="detail-value">{selectedOrder.user.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-section">
                    <h3>Productos</h3>
                    <table className="order-items-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Curso</th>
                          <th>Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.course_id}</td>
                            <td>{item.course_title}</td>
                            <td>{item.price.toFixed(2)} €</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2" className="total-label">Total</td>
                          <td className="total-value">{selectedOrder.total_amount.toFixed(2)} €</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="invoice-button-large"
                    onClick={() => handleGenerateInvoice(selectedOrder.id)}
                  >
                    <FaFileInvoice /> Generar Factura
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
