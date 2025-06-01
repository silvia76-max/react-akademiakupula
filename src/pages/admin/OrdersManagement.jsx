import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaEye } from 'react-icons/fa';
import { getOrders, deleteOrder } from '../../services/adminService.js';
import './OrdersManagement.css';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Error al cargar los pedidos. Por favor, inténtalo de nuevo.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = Array.isArray(orders) ? orders.filter(order =>
    (order.id + '').includes(searchTerm) ||
    (order.user_id + '').includes(searchTerm) ||
    (order.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.payment_method || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      try {
        setLoading(true);
        await deleteOrder(id);
        setOrders(orders.filter(order => order.id !== id));
        setError(null);
      } catch (err) {
        setError('Error al eliminar el pedido. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>Gestión de Pedidos</h1>
      </div>

      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar por ID, usuario, estado o método de pago..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Cargando...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Usuario</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Método de pago</th>
                <th>ID Pago</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user_id}</td>
                  <td>{typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : '0.00'} €</td>
                  <td>{order.status || ''}</td>
                  <td>{order.payment_method || ''}</td>
                  <td>{order.payment_id || ''}</td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</td>
                  <td className="actions-cell">
                    <button className="view-button" onClick={() => handleViewOrder(order)} title="Ver detalles">
                      <FaEye />
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteOrder(order.id)} title="Eliminar pedido">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para ver detalles del pedido */}
      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content order-modal">
            <div className="modal-header">
              <h2>Pedido #{selectedOrder.id}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Usuario:</span>
                  <span className="detail-value">{selectedOrder.user_id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value">{typeof selectedOrder.total_amount === 'number' ? selectedOrder.total_amount.toFixed(2) : '0.00'} €</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estado:</span>
                  <span className="detail-value">{selectedOrder.status || ''}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Método de pago:</span>
                  <span className="detail-value">{selectedOrder.payment_method || ''}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ID Pago:</span>
                  <span className="detail-value">{selectedOrder.payment_id || ''}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
