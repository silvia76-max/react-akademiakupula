import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DataTable from '../../components/admin/DataTable';
import { getUsers, deleteUser } from '../../services/adminService';
import './UsersManagement.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  // Columnas para la tabla de usuarios
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'full_name', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'postal_code', label: 'Código Postal', sortable: true },
    {
      key: 'isAdmin',
      label: 'Administrador',
      sortable: true,
      render: (value) => value ? <FaCheck className="admin-icon" /> : <FaTimes className="user-icon" />
    },
    {
      key: 'created_at',
      label: 'Fecha de registro',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Verificar si el usuario es administrador
      const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
      if (!userData || !userData.isAdmin) {
        console.log('No es administrador, redirigiendo a la página principal...');
        navigate('/');
        return;
      }

      // Obtener los usuarios usando el servicio adminService
      const data = await getUsers();
      console.log('Usuarios obtenidos:', data);

      // Usar los datos reales de la API
      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar los usuarios. Por favor, inténtalo de nuevo.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtrar usuarios por término de búsqueda
    if (searchTerm.trim() === '') {
      fetchUsers();
    } else {
      const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };

  const handleViewUser = (user) => {
    // Mostrar detalles del usuario
    alert(`Detalles del usuario: ${user.full_name}`);
  };

  const handleEditUser = (user) => {
    navigate(`/admin/users/${user.id}`);
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

        <DataTable
          data={users}
          columns={columns}
          title="Usuarios registrados"
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
          loading={loading}
          error={error}
          emptyMessage="No hay usuarios registrados"
        />

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
