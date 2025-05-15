import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaTrash, FaEnvelope, FaReply } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
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

  // Datos simulados para mensajes de contacto
  const mockContacts = [
    {
      id: 1,
      nombre: 'María López',
      email: 'maria.lopez@example.com',
      telefono: '600123456',
      mensaje: 'Me gustaría recibir más información sobre el curso de maquillaje profesional. ¿Cuándo comienza la próxima edición?',
      fecha_creacion: '2023-10-15T14:30:00',
      leido: true
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@example.com',
      telefono: '611234567',
      mensaje: 'Estoy interesado en el curso de uñas esculpidas. ¿Ofrecen algún tipo de certificación al finalizar?',
      fecha_creacion: '2023-10-18T09:45:00',
      leido: false
    },
    {
      id: 3,
      nombre: 'Laura Martínez',
      email: 'laura.martinez@example.com',
      telefono: '622345678',
      mensaje: 'Quisiera saber si tienen modalidad online para el curso de estética integral, ya que vivo fuera de Madrid.',
      fecha_creacion: '2023-10-20T16:15:00',
      leido: false
    },
    {
      id: 4,
      nombre: 'Javier Sánchez',
      email: 'javier.sanchez@example.com',
      telefono: '633456789',
      mensaje: 'Me gustaría conocer los métodos de pago disponibles para el curso de extensión de pestañas.',
      fecha_creacion: '2023-10-22T11:20:00',
      leido: true
    },
    {
      id: 5,
      nombre: 'Ana García',
      email: 'ana.garcia@example.com',
      telefono: '644567890',
      mensaje: '¿Tienen algún descuento para grupos? Somos tres amigas interesadas en el curso de manicura y pedicura.',
      fecha_creacion: '2023-10-25T13:10:00',
      leido: false
    }
  ];

  useEffect(() => {
    // Simulación de carga de datos desde el backend
    const fetchContacts = async () => {
      try {
        setLoading(true);
        // En una implementación real, aquí harías una llamada a la API
        // const response = await fetch('/api/admin/contacts');
        // const data = await response.json();
        
        // Simulamos un retraso para la carga
        setTimeout(() => {
          setContacts(mockContacts);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error al cargar los mensajes:', err);
        setError('Error al cargar los mensajes. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

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

  const handleDeleteContact = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      // En una implementación real, aquí harías una llamada a la API
      // await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      
      const updatedContacts = contacts.filter(contact => contact.id !== id);
      setContacts(updatedContacts);
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      alert('Por favor, escribe un mensaje de respuesta.');
      return;
    }
    
    // En una implementación real, aquí enviarías el email
    // await fetch('/api/admin/contacts/reply', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     contactId: selectedContact.id,
    //     replyText
    //   })
    // });
    
    alert(`Respuesta enviada a ${selectedContact.email}`);
    setReplyText('');
    setShowModal(false);
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

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Cargando...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr key={contact.id} className={contact.leido ? '' : 'unread'}>
                    <td>{contact.id}</td>
                    <td>{contact.nombre}</td>
                    <td>{contact.email}</td>
                    <td>{contact.telefono}</td>
                    <td>{new Date(contact.fecha_creacion).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${contact.leido ? 'read' : 'unread'}`}>
                        {contact.leido ? 'Leído' : 'No leído'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="view-button"
                        onClick={() => handleViewContact(contact)}
                        title="Ver mensaje"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteContact(contact.id)}
                        title="Eliminar mensaje"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
