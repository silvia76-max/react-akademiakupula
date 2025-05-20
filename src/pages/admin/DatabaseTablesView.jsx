import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDatabase, FaTable, FaSync, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DataTable from '../../components/admin/DataTable';
import { getTableData, addRecord, updateRecord, deleteRecord } from '../../services/databaseService';
import './DatabaseTablesView.css';

const DatabaseTablesView = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Definir las tablas disponibles
  const tables = [
    { id: 'users', label: 'Usuarios', endpoint: '/api/admin/users' },
    { id: 'courses', label: 'Cursos', endpoint: '/api/admin/courses' },
    { id: 'contacts', label: 'Mensajes', endpoint: '/api/admin/contacts' },
    { id: 'orders', label: 'Ventas', endpoint: '/api/admin/orders' },
    { id: 'sessions', label: 'Sesiones', endpoint: '/api/admin/sessions' },
    { id: 'wishlist', label: 'Lista de Deseos', endpoint: '/api/admin/wishlist' },
    { id: 'cart', label: 'Carrito', endpoint: '/api/admin/cart' }
  ];

  // Columnas para cada tabla
  const tableColumns = {
    users: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'full_name', label: 'Nombre', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'postal_code', label: 'Código Postal', sortable: true },
      { key: 'created_at', label: 'Fecha de registro', sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' }
    ],
    courses: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'title', label: 'Título', sortable: true },
      { key: 'price', label: 'Precio', sortable: true,
        render: (value) => value ? `${value.toFixed(2)} €` : '0.00 €' },
      { key: 'level', label: 'Nivel', sortable: true },
      { key: 'duration', label: 'Duración', sortable: true }
    ],
    contacts: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Nombre', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'subject', label: 'Asunto', sortable: true },
      { key: 'created_at', label: 'Fecha', sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' }
    ],
    orders: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'order_number', label: 'Nº Orden', sortable: true },
      { key: 'user_id', label: 'ID Usuario', sortable: true },
      { key: 'total_amount', label: 'Total', sortable: true,
        render: (value) => value ? `${value.toFixed(2)} €` : '0.00 €' },
      { key: 'status', label: 'Estado', sortable: true },
      { key: 'created_at', label: 'Fecha', sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' }
    ],
    sessions: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'user_id', label: 'ID Usuario', sortable: true },
      { key: 'ip_address', label: 'Dirección IP', sortable: true },
      { key: 'device_info', label: 'Dispositivo', sortable: true },
      { key: 'started_at', label: 'Inicio', sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
      { key: 'is_active', label: 'Activa', sortable: true,
        render: (value) => value ? 'Sí' : 'No' }
    ],
    wishlist: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'user_id', label: 'ID Usuario', sortable: true },
      { key: 'course_id', label: 'ID Curso', sortable: true },
      { key: 'created_at', label: 'Fecha', sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' }
    ],
    cart: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'user_id', label: 'ID Usuario', sortable: true },
      { key: 'course_id', label: 'ID Curso', sortable: true },
      { key: 'created_at', label: 'Fecha', sortable: true,
        render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' }
    ]
  };

  // Función para cargar los datos de la tabla seleccionada
  const fetchTableData = async (tableId) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar si el usuario es administrador
      const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
      console.log('Datos del usuario:', userData);

      if (!userData || !userData.isAdmin) {
        console.log('No es administrador, redirigiendo a la página principal...');
        navigate('/');
        return;
      }

      // Encontrar la tabla seleccionada
      const selectedTable = tables.find(table => table.id === tableId);
      if (!selectedTable) {
        throw new Error('Tabla no encontrada');
      }

      console.log(`Intentando cargar datos de la tabla ${tableId} desde el endpoint: ${selectedTable.endpoint}`);

      // Usar el servicio de base de datos para obtener los datos
      const data = await getTableData(tableId);
      console.log(`Datos de la tabla ${tableId}:`, data);

      if (!data || data.length === 0) {
        console.log(`No se encontraron datos en la tabla ${tableId}. Verificar la conexión con la API.`);
      }

      // Actualizar el estado con los datos recibidos
      setTableData(data || []);
    } catch (err) {
      console.error(`Error al cargar la tabla ${tableId}:`, err);
      setError(`Error al cargar los datos de la tabla. ${err.message}`);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos cuando cambia la pestaña activa
  useEffect(() => {
    fetchTableData(activeTab);
  }, [activeTab, navigate]);

  // Filtrar datos según el término de búsqueda
  const filteredData = tableData.filter(item => {
    if (!searchTerm) return true;

    // Buscar en todas las propiedades del objeto
    return Object.values(item).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando:', searchTerm);
    // La búsqueda ya se aplica automáticamente a través de filteredData
  };

  // Manejar el cambio de pestaña
  const handleTabChange = (tableId) => {
    setActiveTab(tableId);
    setSearchTerm('');
  };

  // Manejar la actualización de datos
  const handleRefresh = () => {
    fetchTableData(activeTab);
  };

  // Función para probar la conexión directa con la API
  const testApiConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener token de autenticación si existe
      const token = localStorage.getItem('akademia_auth_token');

      // Configurar opciones de la petición
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Añadir token si existe
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      // Añadir cabeceras especiales para el administrador
      const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
      if (userData.email === 'admin@gmail.com') {
        options.headers['X-Admin-Access'] = 'true';
        options.headers['X-Admin-Email'] = 'admin@gmail.com';
      }

      // Realizar la petición a la API
      const selectedTable = tables.find(table => table.id === activeTab);
      const response = await fetch(selectedTable.endpoint, options);

      if (!response.ok) {
        throw new Error(`Error al conectar con la API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta de la API:', data);

      // Actualizar el estado con los datos recibidos
      if (Array.isArray(data)) {
        setTableData(data);
      } else if (data.data && Array.isArray(data.data)) {
        setTableData(data.data);
      } else {
        setTableData([]);
      }

      alert('Conexión exitosa con la API. Revisa la consola para ver los detalles.');
    } catch (err) {
      console.error('Error al probar la conexión con la API:', err);
      setError(`Error al conectar con la API. ${err.message}`);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1>Consulta de Base de Datos</h1>
          <div className="header-buttons">
            <button className="test-button" onClick={testApiConnection} title="Probar conexión directa con la API">
              Probar API
            </button>
            <button className="refresh-button" onClick={handleRefresh} title="Actualizar datos">
              <FaSync />
            </button>
          </div>
        </div>

        <div className="database-tabs">
          {tables.map(table => (
            <button
              key={table.id}
              className={`tab-button ${activeTab === table.id ? 'active' : ''}`}
              onClick={() => handleTabChange(table.id)}
            >
              <FaTable className="tab-icon" />
              <span>{table.label}</span>
            </button>
          ))}
        </div>

        <div className="info-message">
          <p>
            <strong>Nota:</strong> Si no ves datos en las tablas, asegúrate de que:
          </p>
          <ol>
            <li>El servidor Flask está en ejecución en <code>http://localhost:5000</code></li>
            <li>Has iniciado sesión como administrador (admin@gmail.com)</li>
            <li>Los endpoints de la API están correctamente configurados</li>
          </ol>
          <p>
            Puedes usar el botón "Probar API" para verificar la conexión directa con la API.
          </p>
        </div>

        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar en la tabla actual..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="table-container">
          <h2 className="table-title">
            <FaDatabase className="table-icon" />
            Tabla: {tables.find(t => t.id === activeTab)?.label || activeTab}
          </h2>

          <DataTable
            data={filteredData}
            columns={tableColumns[activeTab] || []}
            title={`Registros de ${tables.find(t => t.id === activeTab)?.label || activeTab}`}
            loading={loading}
            error={error}
            emptyMessage={`No hay datos en la tabla ${tables.find(t => t.id === activeTab)?.label || activeTab}`}
          />
        </div>
      </div>
    </div>
  );
};

export default DatabaseTablesView;
