import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaFileInvoice, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
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

  // Datos simulados para órdenes
  const mockOrders = [
    {
      id: 1,
      order_number: 'ORD-2023-001',
      user: {
        id: 3,
        name: 'Laura Martínez',
        email: 'laura.martinez@example.com'
      },
      total_amount: 499.99,
      status: 'completed',
      payment_method: 'credit_card',
      payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7K',
      created_at: '2023-10-05T14:30:00',
      items: [
        {
          id: 1,
          course_id: 1,
          course_title: 'Curso de Maquillaje Profesional',
          price: 499.99
        }
      ]
    },
    {
      id: 2,
      order_number: 'ORD-2023-002',
      user: {
        id: 5,
        name: 'Ana García',
        email: 'ana.garcia@example.com'
      },
      total_amount: 399.99,
      status: 'completed',
      payment_method: 'credit_card',
      payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7L',
      created_at: '2023-10-08T10:15:00',
      items: [
        {
          id: 2,
          course_id: 2,
          course_title: 'Curso de Uñas Esculpidas',
          price: 399.99
        }
      ]
    },
    {
      id: 3,
      order_number: 'ORD-2023-003',
      user: {
        id: 2,
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@example.com'
      },
      total_amount: 799.99,
      status: 'completed',
      payment_method: 'credit_card',
      payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7M',
      created_at: '2023-10-12T16:45:00',
      items: [
        {
          id: 3,
          course_id: 3,
          course_title: 'Estética Integral',
          price: 799.99
        }
      ]
    },
    {
      id: 4,
      order_number: 'ORD-2023-004',
      user: {
        id: 4,
        name: 'Javier Sánchez',
        email: 'javier.sanchez@example.com'
      },
      total_amount: 299.99,
      status: 'pending',
      payment_method: 'credit_card',
      payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7N',
      created_at: '2023-10-15T09:30:00',
      items: [
        {
          id: 4,
          course_id: 4,
          course_title: 'Curso de Manicura y Pedicura',
          price: 299.99
        }
      ]
    },
    {
      id: 5,
      order_number: 'ORD-2023-005',
      user: {
        id: 1,
        name: 'María López',
        email: 'maria.lopez@example.com'
      },
      total_amount: 449.99,
      status: 'failed',
      payment_method: 'credit_card',
      payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7O',
      created_at: '2023-10-18T13:20:00',
      items: [
        {
          id: 5,
          course_id: 6,
          course_title: 'Curso de Extensión de Pestañas',
          price: 449.99
        }
      ]
    },
    {
      id: 6,
      order_number: 'ORD-2023-006',
      user: {
        id: 3,
        name: 'Laura Martínez',
        email: 'laura.martinez@example.com'
      },
      total_amount: 349.99,
      status: 'refunded',
      payment_method: 'credit_card',
      payment_id: 'pi_3NqKL2CDxUStkLAz0MHgaB7P',
      created_at: '2023-10-20T11:10:00',
      items: [
        {
          id: 6,
          course_id: 5,
          course_title: 'Curso de Maquillaje Social',
          price: 349.99
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulación de carga de datos desde el backend
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // En una implementación real, aquí harías una llamada a la API
        // const response = await fetch('/api/admin/orders');
        // const data = await response.json();
        
        // Simulamos un retraso para la carga
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error al cargar las órdenes:', err);
        setError('Error al cargar las órdenes. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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
