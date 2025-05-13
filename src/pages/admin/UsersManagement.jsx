import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaUserPlus } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getUsers, deleteUser } from '../../services/adminService';
import './UsersManagement.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    per_page: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getUsers(page, pagination.per_page);
      setUsers(data.users);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar los usuarios. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verificar si el usuario es administrador
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.is_admin) {
      navigate('/login');
    }
  }, [navigate]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchUsers(newPage);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar búsqueda (podría requerir un endpoint adicional en el backend)
    console.log('Buscando:', searchTerm);
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1>Gestión de Usuarios</h1>
          <button 
            className="add-button"
            onClick={() => navigate('/admin/users/new')}
          >
            <FaUserPlus /> Nuevo Usuario
          </button>
        </div>

        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
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
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Código Postal</th>
                    <th>Rol</th>
                    <th>Fecha de registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{user.postal_code}</td>
                      <td>{user.is_admin ? 'Administrador' : 'Usuario'}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button 
                          className="edit-button"
                          onClick={() => handleEditUser(user.id)}
                          title="Editar usuario"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteClick(user)}
                          title="Eliminar usuario"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button 
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
              >
                &laquo;
              </button>
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                &lsaquo;
              </button>
              
              <span className="page-info">
                Página {pagination.page} de {pagination.pages}
              </span>
              
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                &rsaquo;
              </button>
              <button 
                onClick={() => handlePageChange(pagination.pages)}
                disabled={pagination.page === pagination.pages}
              >
                &raquo;
              </button>
            </div>
          </>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirmar eliminación</h2>
              <p>¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.full_name}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
              <div className="modal-actions">
                <button className="cancel-button" onClick={cancelDelete}>
                  Cancelar
                </button>
                <button className="confirm-button" onClick={confirmDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
