import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaTrash, FaEnvelope, FaReply } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DataTable from '../../components/admin/DataTable';
import { getContacts, deleteContact, replyToContact } from '../../services/adminService';
import './ContactsManagement.css';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const navigate = useNavigate();

  // Columnas para la tabla de contactos
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'telefono', label: 'Teléfono', sortable: true },
    {
      key: 'fecha_creacion',
      label: 'Fecha',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'leido',
      label: 'Estado',
      sortable: true,
      render: (value) => (
        <span className={`status-badge ${value ? 'read' : 'unread'}`}>
          {value ? 'Leído' : 'No leído'}
        </span>
      )
    }
  ];



  const fetchContacts = async () => {
    try {
      setLoading(true);

      // Verificar si el usuario es administrador
      const userData = JSON.parse(localStorage.getItem('akademia_user_data') || '{}');
      if (!userData || !userData.isAdmin) {
        console.log('No es administrador, redirigiendo a la página principal...');
        navigate('/');
        return;
      }

      // Obtener los mensajes usando el servicio adminService
      const data = await getContacts();
      console.log('Mensajes obtenidos:', data);
      setContacts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar los mensajes:', err);
      setError('Error al cargar los mensajes. Por favor, inténtalo de nuevo.');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [navigate]);

  // Filtrar contactos según el término de búsqueda
  const filteredContacts = contacts.filter(contact =>
    contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // La búsqueda ya se realiza automáticamente con el filtro
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);

    // Marcar como leído (en una implementación real, esto se haría con una llamada a la API)
    if (!contact.leido) {
      const updatedContacts = contacts.map(c =>
        c.id === contact.id ? { ...c, leido: true } : c
      );
      setContacts(updatedContacts);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      try {
        setLoading(true);
        // Eliminar el mensaje usando el servicio adminService
        await deleteContact(id);
        // Actualizar la lista de mensajes
        const updatedContacts = contacts.filter(contact => contact.id !== id);
        setContacts(updatedContacts);
        setError(null);
      } catch (err) {
        console.error(`Error al eliminar el mensaje ${id}:`, err);
        setError('Error al eliminar el mensaje. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();

    if (!replyText.trim()) {
      alert('Por favor, escribe un mensaje de respuesta.');
      return;
    }

    try {
      setLoading(true);
      // Enviar la respuesta usando el servicio adminService
      await replyToContact(selectedContact.id, replyText);

      // Actualizar el estado del mensaje a leído
      const updatedContacts = contacts.map(c =>
        c.id === selectedContact.id ? { ...c, leido: true } : c
      );
      setContacts(updatedContacts);

      alert(`Respuesta enviada a ${selectedContact.email}`);
      setReplyText('');
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error(`Error al responder al mensaje ${selectedContact.id}:`, err);
      setError('Error al enviar la respuesta. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1>Gestión de Mensajes</h1>
        </div>

        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar por nombre, email o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>
        </div>

        <DataTable
          data={filteredContacts}
          columns={columns}
          title="Mensajes de contacto"
          onView={handleViewContact}
          onDelete={handleDeleteContact}
          loading={loading}
          error={error}
          emptyMessage="No hay mensajes de contacto"
        />

        {/* Modal para ver el mensaje completo */}
        {showModal && selectedContact && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Mensaje de {selectedContact.nombre}</h2>
                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="contact-details">
                  <p><strong>Email:</strong> {selectedContact.email}</p>
                  <p><strong>Teléfono:</strong> {selectedContact.telefono}</p>
                  <p><strong>Fecha:</strong> {new Date(selectedContact.fecha_creacion).toLocaleString()}</p>
                </div>
                <div className="message-content">
                  <h3>Mensaje:</h3>
                  <p>{selectedContact.mensaje}</p>
                </div>
                <div className="reply-form">
                  <h3>Responder:</h3>
                  <form onSubmit={handleReply}>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Escribe tu respuesta aquí..."
                      rows={5}
                    ></textarea>
                    <button type="submit" className="reply-button">
                      <FaReply /> Enviar Respuesta
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsManagement;
